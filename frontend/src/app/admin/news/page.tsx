'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Archive,
  Clock3,
  ExternalLink,
  Eye,
  FileText,
  Flame,
  FolderTree,
  ImageIcon,
  Megaphone,
  Newspaper,
  Pencil,
  Plus,
  Radio,
  Save,
  Search,
  Star,
  Tags,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';
import AdminPageWrapper from '../components/AdminPageWrapper';
import { AdminUploadResult, useAdminAuth, adminFetch, driveUrl } from '../lib/auth';
import { AdminModal, AdminTable, DriveUpload, SectionHeader, StatusBadge, Toggle } from '../components/AdminUI';
import { useAdminFeedback } from '../components/AdminFeedback';

interface NewsArticle {
  id: number;
  titleAr: string;
  titleEn?: string;
  slug: string;
  summaryAr?: string;
  summaryEn?: string;
  contentAr: string;
  contentEn?: string;
  image?: string;
  images?: string | AdminUploadResult[];
  imageAltAr?: string;
  imageAltEn?: string;
  category: string;
  authorId?: number | null;
  tags?: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  breaking: boolean;
  trending?: boolean;
  homeSlot?: string;
  homeOrder?: number;
  metaTitle?: string;
  metaDesc?: string;
  seoKeywords?: string;
  canonicalUrl?: string;
  sourceName?: string;
  sourceUrl?: string;
  videoUrl?: string;
  readTimeMinutes?: number;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface NewsCategory { id: number; nameAr: string; nameEn: string; slug: string; color: string; order: number; }
interface NewsAuthor { id: number; nameAr: string; nameEn: string; bioAr?: string; bioEn?: string; image?: string; }
interface BreakingNews { id: number; textAr: string; textEn?: string; link?: string; isActive: boolean; order: number; }

type NewsTab = 'articles' | 'categories' | 'authors' | 'breaking';
type StatusFilter = 'all' | NewsArticle['status'];
type SortMode = 'newest' | 'home' | 'title';

const tabLabels: Record<NewsTab, string> = {
  articles: 'المقالات',
  categories: 'التصنيفات',
  authors: 'الكتاب',
  breaking: 'الشريط العاجل',
};

const statusLabels: Record<NewsArticle['status'], string> = {
  draft: 'مسودة',
  published: 'منشور',
  archived: 'أرشيف',
};

const createBlankArticle = (): Partial<NewsArticle> => ({
  titleAr: '',
  titleEn: '',
  slug: '',
  summaryAr: '',
  summaryEn: '',
  contentAr: '',
  contentEn: '',
  category: 'general',
  status: 'draft',
  featured: false,
  breaking: false,
  trending: false,
  homeOrder: 0,
  images: [],
});

const blankCategory: Partial<NewsCategory> = { nameAr: '', nameEn: '', slug: '', color: '#9d027c', order: 0 };
const blankAuthor: Partial<NewsAuthor> = { nameAr: '', nameEn: '' };
const blankBreaking: Partial<BreakingNews> = { textAr: '', textEn: '', link: '', isActive: true, order: 0 };

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function parseAssets(value?: string | AdminUploadResult[] | null): AdminUploadResult[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatDate(value?: string) {
  if (!value) return 'غير محدد';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'غير محدد';
  return new Intl.DateTimeFormat('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

function wordCount(value?: string) {
  return (value || '').trim().split(/\s+/).filter(Boolean).length;
}

function MetricTile({
  icon,
  label,
  value,
  tone = 'purple',
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  tone?: 'purple' | 'green' | 'amber' | 'blue' | 'red';
}) {
  return (
    <div className={`blogger-metric blogger-metric--${tone}`}>
      <span className="blogger-metric-icon">{icon}</span>
      <span className="blogger-metric-value">{value}</span>
      <span className="blogger-metric-label">{label}</span>
    </div>
  );
}

export default function AdminNewsPage() {
  const { token } = useAdminAuth();
  const { confirm, notify } = useAdminFeedback();
  const [tab, setTab] = useState<NewsTab>('articles');
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [authors, setAuthors] = useState<NewsAuthor[]>([]);
  const [breaking, setBreaking] = useState<BreakingNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [resourcesLoaded, setResourcesLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortMode, setSortMode] = useState<SortMode>('newest');
  const [editArticle, setEditArticle] = useState<Partial<NewsArticle>>(createBlankArticle);
  const [editCategory, setEditCategory] = useState<Partial<NewsCategory>>(blankCategory);
  const [editAuthor, setEditAuthor] = useState<Partial<NewsAuthor>>(blankAuthor);
  const [editBreaking, setEditBreaking] = useState<Partial<BreakingNews>>(blankBreaking);

  const galleryImages = parseAssets(editArticle.images);
  const articleWords = wordCount(editArticle.contentAr);

  const loadAll = async (includeResources = true) => {
    if (!token) return;
    setLoading(true);
    try {
      const articleData = await adminFetch('/news/articles?limit=25', token);
      setArticles(articleData.items || articleData.articles || []);
      if (includeResources) {
        const [categoryData, authorData, breakingData] = await Promise.all([
          adminFetch('/news/categories', token),
          adminFetch('/news/authors', token),
          adminFetch('/news/breaking', token),
        ]);
        setCategories(categoryData);
        setAuthors(authorData);
        setBreaking(breakingData);
        setResourcesLoaded(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadAll(false).catch(console.error);
  }, [token]);

  const categoryName = (slug?: string) => {
    if (!slug || slug === 'general') return 'عام';
    return categories.find(category => category.slug === slug)?.nameAr || slug;
  };

  const authorName = (authorId?: number | null) => {
    if (!authorId) return 'بدون كاتب';
    return authors.find(author => author.id === authorId)?.nameAr || 'كاتب غير محدد';
  };

  const stats = useMemo(() => {
    const published = articles.filter(article => article.status === 'published').length;
    const drafts = articles.filter(article => article.status === 'draft').length;
    const archived = articles.filter(article => article.status === 'archived').length;
    const highlighted = articles.filter(article => article.featured || article.trending || article.breaking).length;
    return { published, drafts, archived, highlighted };
  }, [articles]);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const result = articles.filter(article => {
      const haystack = [
        article.titleAr,
        article.titleEn,
        article.slug,
        article.summaryAr,
        article.category,
        article.tags,
      ].filter(Boolean).join(' ').toLowerCase();

      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
      return matchesQuery && matchesStatus && matchesCategory;
    });

    return result.sort((a, b) => {
      if (sortMode === 'home') return (a.homeOrder || 0) - (b.homeOrder || 0);
      if (sortMode === 'title') return (a.titleAr || '').localeCompare(b.titleAr || '', 'ar');
      return new Date(b.publishedAt || b.createdAt || 0).getTime() - new Date(a.publishedAt || a.createdAt || 0).getTime();
    });
  }, [articles, categoryFilter, query, sortMode, statusFilter]);

  const updateArticle = (patch: Partial<NewsArticle>) => {
    setEditArticle(current => ({ ...current, ...patch }));
  };

  const createSlugForArticle = () => {
    const existing = slugify(editArticle.slug || '');
    if (existing) return existing;
    const englishSlug = slugify(editArticle.titleEn || '');
    if (englishSlug) return englishSlug;
    if (editArticle.id) return `article-${editArticle.id}`;
    return `article-${Date.now()}`;
  };

  const openNewArticle = () => {
    setTab('articles');
    setModalOpen(false);
    setEditArticle(createBlankArticle());
  };

  const openArticle = (article: NewsArticle) => {
    setTab('articles');
    setModalOpen(false);
    setEditArticle({ ...article, images: parseAssets(article.images) });
  };

  const openNew = () => {
    if (tab === 'articles') {
      openNewArticle();
      return;
    }
    if (tab === 'categories') setEditCategory(blankCategory);
    if (tab === 'authors') setEditAuthor(blankAuthor);
    if (tab === 'breaking') setEditBreaking(blankBreaking);
    setModalOpen(true);
  };

  const appendGallery = (results: AdminUploadResult[]) => {
    setEditArticle(current => ({
      ...current,
      images: [...parseAssets(current.images), ...results],
    }));
  };

  const removeGalleryImage = (index: number) => {
    setEditArticle(current => ({
      ...current,
      images: parseAssets(current.images).filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  const saveArticle = async () => {
    setSaving(true);
    try {
      const slug = createSlugForArticle();
      const payload = {
        ...editArticle,
        slug,
        images: parseAssets(editArticle.images),
        homeOrder: Number(editArticle.homeOrder || 0),
        readTimeMinutes: editArticle.readTimeMinutes ? Number(editArticle.readTimeMinutes) : null,
      };
      const endpoint = editArticle.id ? `/news/articles/${editArticle.id}` : '/news/articles';
      const saved = await adminFetch(endpoint, token, {
        method: editArticle.id ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      });
      setEditArticle({ ...saved, images: parseAssets(saved.images) });
      await loadAll();
    } catch (error: any) {
      alert(error.message || 'تعذر حفظ المقال');
    } finally {
      setSaving(false);
    }
  };

  const saveCurrent = async () => {
    if (tab === 'articles') {
      await saveArticle();
      return;
    }

    setSaving(true);
    try {
      if (tab === 'categories') {
        const payload = {
          ...editCategory,
          slug: editCategory.slug || slugify(editCategory.nameEn || editCategory.nameAr || ''),
          order: Number(editCategory.order || 0),
        };
        const endpoint = editCategory.id ? `/news/categories/${editCategory.id}` : '/news/categories';
        await adminFetch(endpoint, token, { method: editCategory.id ? 'PUT' : 'POST', body: JSON.stringify(payload) });
      }
      if (tab === 'authors') {
        const endpoint = editAuthor.id ? `/news/authors/${editAuthor.id}` : '/news/authors';
        await adminFetch(endpoint, token, { method: editAuthor.id ? 'PUT' : 'POST', body: JSON.stringify(editAuthor) });
      }
      if (tab === 'breaking') {
        const payload = { ...editBreaking, order: Number(editBreaking.order || 0) };
        const endpoint = editBreaking.id ? `/news/breaking/${editBreaking.id}` : '/news/breaking';
        await adminFetch(endpoint, token, { method: editBreaking.id ? 'PUT' : 'POST', body: JSON.stringify(payload) });
      }
      setModalOpen(false);
      await loadAll();
    } catch (error: any) {
      alert(error.message || 'تعذر حفظ البيانات');
    } finally {
      setSaving(false);
    }
  };

  const deleteArticle = async (article: NewsArticle) => {
    if (!await confirm({ title: `حذف «${article.titleAr}»؟`, description: 'سيُزال المقال من لوحة التحكم ومن الموقع إذا كان منشورًا.', confirmLabel: 'حذف المقال', tone: 'danger' })) return;
    await adminFetch(`/news/articles/${article.id}`, token, { method: 'DELETE' });
    if (editArticle.id === article.id) setEditArticle(createBlankArticle());
    await loadAll();
    notify('تم حذف المقال', 'success');
  };

  const deleteItem = async (item: any) => {
    const map = { categories: 'categories', authors: 'authors', breaking: 'breaking' } as const;
    if (tab === 'articles') return;
    await adminFetch(`/news/${map[tab]}/${item.id}`, token, { method: 'DELETE' });
    await loadAll();
  };

  const resourceColumns = tab === 'categories' ? [
    { key: 'order', label: 'الترتيب' },
    { key: 'nameAr', label: 'اسم التصنيف' },
    { key: 'slug', label: 'Slug' },
    { key: 'color', label: 'اللون', render: (item: NewsCategory) => <span className="blogger-color-swatch" style={{ ['--swatch-color' as string]: item.color }}>{item.color}</span> },
  ] : tab === 'authors' ? [
    { key: 'image', label: 'الصورة', render: (item: NewsAuthor) => item.image ? <img src={driveUrl(item.image)} alt={item.nameAr} className="blogger-author-avatar" /> : '-' },
    { key: 'nameAr', label: 'اسم الكاتب' },
    { key: 'nameEn', label: 'الاسم الإنجليزي' },
  ] : [
    { key: 'order', label: 'الترتيب' },
    { key: 'textAr', label: 'النص' },
    { key: 'link', label: 'الرابط' },
    { key: 'isActive', label: 'الحالة', render: (item: BreakingNews) => item.isActive ? 'نشط' : 'مخفي' },
  ];

  const resourceData = tab === 'categories' ? categories : tab === 'authors' ? authors : breaking;

  return (
    <AdminPageWrapper title="الأخبار والمقالات">
      <div className="blogger-news-hero">
        <div className="blogger-news-hero-copy">
          <span className="blogger-news-kicker"><Newspaper size={15} /> News CMS</span>
          <h1>استوديو نشر الأخبار</h1>
          <p>مساحة إدارة مقالات أقرب لأدوات التدوين: كتابة، نشر، تصنيف، صور، SEO، ومعاينة في نفس الشاشة.</p>
        </div>
        <div className="blogger-news-hero-actions">
          <a className="admin-btn admin-btn--ghost" href="/news" target="_blank" rel="noopener noreferrer">
            <ExternalLink size={16} />
            فتح الأخبار
          </a>
          <button className="admin-btn admin-btn--primary" type="button" onClick={openNewArticle}>
            <Plus size={16} />
            مقال جديد
          </button>
        </div>
      </div>

      <div className="blogger-metrics-grid">
        <MetricTile icon={<FileText size={18} />} label="كل المقالات" value={articles.length} />
        <MetricTile icon={<Eye size={18} />} label="منشور" value={stats.published} tone="green" />
        <MetricTile icon={<Pencil size={18} />} label="مسودات" value={stats.drafts} tone="amber" />
        <MetricTile icon={<Star size={18} />} label="مميز أو رائج" value={stats.highlighted} tone="blue" />
        <MetricTile icon={<Archive size={18} />} label="أرشيف" value={stats.archived} tone="red" />
      </div>

      <div className="blogger-news-tabs" role="tablist" aria-label="إدارة الأخبار">
        {([
          ['articles', Newspaper, articles.length],
          ['categories', FolderTree, categories.length],
          ['authors', UserRound, authors.length],
          ['breaking', Radio, breaking.length],
        ] as const).map(([value, Icon, count]) => (
          <button
            key={value}
            type="button"
            className={`blogger-news-tab ${tab === value ? 'blogger-news-tab--active' : ''}`}
            onClick={() => {
              setTab(value);
              if (value !== 'articles' && !resourcesLoaded) loadAll().catch(console.error);
              setModalOpen(false);
            }}
          >
            <Icon size={16} />
            <span>{tabLabels[value]}</span>
            <strong>{count}</strong>
          </button>
        ))}
      </div>

      {tab === 'articles' ? (
        <div className="blogger-workbench">
          <aside className="blogger-posts-panel">
            <div className="blogger-panel-head">
              <div>
                <h2>قائمة المقالات</h2>
                <span>{filteredArticles.length} نتيجة</span>
              </div>
              <button className="admin-icon-btn" type="button" onClick={openNewArticle} title="مقال جديد">
                <Plus size={16} />
              </button>
            </div>

            <div className="blogger-filters">
              <label className="blogger-search-box">
                <Search size={16} />
                <input value={query} onChange={event => setQuery(event.target.value)} placeholder="بحث في العنوان أو slug" />
              </label>
              <select value={statusFilter} onChange={event => setStatusFilter(event.target.value as StatusFilter)}>
                <option value="all">كل الحالات</option>
                <option value="published">منشور</option>
                <option value="draft">مسودة</option>
                <option value="archived">أرشيف</option>
              </select>
              <select value={categoryFilter} onChange={event => setCategoryFilter(event.target.value)}>
                <option value="all">كل التصنيفات</option>
                <option value="general">عام</option>
                {categories.map(category => <option key={category.slug} value={category.slug}>{category.nameAr}</option>)}
              </select>
              <select value={sortMode} onChange={event => setSortMode(event.target.value as SortMode)}>
                <option value="newest">الأحدث</option>
                <option value="home">ترتيب الرئيسية</option>
                <option value="title">العنوان</option>
              </select>
            </div>

            <div className="blogger-post-list">
              {loading && <div className="admin-table-loading"><span className="admin-spinner admin-spinner--lg" /></div>}
              {!loading && filteredArticles.length === 0 && <div className="admin-empty">لا توجد مقالات مطابقة</div>}
              {!loading && filteredArticles.map(article => (
                <article
                  key={article.id}
                  className={`blogger-post-row ${editArticle.id === article.id ? 'blogger-post-row--active' : ''}`}
                  onClick={() => openArticle(article)}
                >
                  <div className="blogger-post-thumb">
                    {article.image ? <img src={driveUrl(article.image, 'w400')} alt={article.titleAr} /> : <ImageIcon size={18} />}
                  </div>
                  <div className="blogger-post-info">
                    <div className="blogger-post-title">{article.titleAr || 'بدون عنوان'}</div>
                    <div className="blogger-post-meta">
                      <span>{categoryName(article.category)}</span>
                      <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                    </div>
                    <div className="blogger-post-badges">
                      <StatusBadge status={article.status} />
                      {article.featured && <span className="admin-badge admin-badge--purple">مميز</span>}
                      {article.trending && <span className="admin-badge admin-badge--blue">رائج</span>}
                      {article.breaking && <span className="admin-badge admin-badge--red">عاجل</span>}
                    </div>
                  </div>
                  <div className="blogger-post-actions">
                    <button
                      type="button"
                      className="admin-icon-btn"
                      onClick={(event) => {
                        event.stopPropagation();
                        openArticle(article);
                      }}
                      title="تعديل"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      className="admin-icon-btn admin-icon-btn--danger"
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteArticle(article);
                      }}
                      title="حذف"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </aside>

          <main className="blogger-editor-panel">
            <div className="blogger-editor-toolbar">
              <div>
                <span className="blogger-editor-eyebrow">{editArticle.id ? `#${editArticle.id}` : 'مقال جديد'}</span>
                <h2>{editArticle.titleAr || 'محرر المقال'}</h2>
              </div>
              <div className="blogger-editor-actions">
                <StatusBadge status={editArticle.status || 'draft'} />
                <button className="admin-btn admin-btn--ghost" type="button" onClick={openNewArticle}>
                  <X size={16} />
                  تفريغ
                </button>
                <button className="admin-btn admin-btn--primary" type="button" onClick={saveArticle} disabled={saving}>
                  {saving ? <span className="admin-spinner admin-spinner--sm" /> : <Save size={16} />}
                  حفظ
                </button>
              </div>
            </div>

            <div className="blogger-editor-grid">
              <section className="blogger-editor-main">
                <div className="blogger-form-section">
                  <div className="blogger-section-title">
                    <FileText size={16} />
                    <span>العنوان والرابط</span>
                  </div>
                  <div className="admin-grid-2">
                    <div className="admin-field">
                      <label className="admin-label">العنوان عربي</label>
                      <input className="admin-input admin-input--xl" value={editArticle.titleAr || ''} onChange={event => updateArticle({ titleAr: event.target.value })} />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">العنوان إنجليزي</label>
                      <input className="admin-input admin-input--xl" value={editArticle.titleEn || ''} onChange={event => updateArticle({ titleEn: event.target.value, slug: editArticle.slug || slugify(event.target.value) })} />
                    </div>
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">Slug</label>
                    <input className="admin-input" dir="ltr" value={editArticle.slug || ''} placeholder="article-url" onChange={event => updateArticle({ slug: slugify(event.target.value) })} />
                  </div>
                  <div className="admin-grid-3">
                    <div className="admin-field">
                      <label className="admin-label">اسم المصدر</label>
                      <input className="admin-input" value={editArticle.sourceName || ''} onChange={event => updateArticle({ sourceName: event.target.value })} placeholder="مثال: فريق S C News" />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">رابط المصدر</label>
                      <input className="admin-input" dir="ltr" type="url" value={editArticle.sourceUrl || ''} onChange={event => updateArticle({ sourceUrl: event.target.value })} placeholder="https://..." />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">رابط الفيديو</label>
                      <input className="admin-input" dir="ltr" type="url" value={editArticle.videoUrl || ''} onChange={event => updateArticle({ videoUrl: event.target.value })} placeholder="YouTube أو Vimeo" />
                    </div>
                  </div>
                </div>

                <div className="blogger-form-section">
                  <div className="blogger-section-title">
                    <Tags size={16} />
                    <span>النشر والتصنيف</span>
                  </div>
                  <div className="admin-grid-3">
                    <div className="admin-field">
                      <label className="admin-label">التصنيف</label>
                      <select className="admin-select" value={editArticle.category || 'general'} onChange={event => updateArticle({ category: event.target.value })}>
                        <option value="general">عام</option>
                        {categories.map(category => <option key={category.slug} value={category.slug}>{category.nameAr}</option>)}
                      </select>
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">حالة النشر</label>
                      <select className="admin-select" value={editArticle.status || 'draft'} onChange={event => updateArticle({ status: event.target.value as NewsArticle['status'] })}>
                        <option value="draft">مسودة</option>
                        <option value="published">منشور</option>
                        <option value="archived">أرشيف</option>
                      </select>
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">الكاتب</label>
                      <select className="admin-select" value={editArticle.authorId ?? ''} onChange={event => updateArticle({ authorId: event.target.value ? Number(event.target.value) : null })}>
                        <option value="">بدون كاتب</option>
                        {authors.map(author => <option key={author.id} value={author.id}>{author.nameAr}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="admin-grid-3">
                    <div className="admin-field">
                      <label className="admin-label">مكان الظهور في الرئيسية</label>
                      <input className="admin-input" placeholder="hero / grid / sidebar" value={editArticle.homeSlot || ''} onChange={event => updateArticle({ homeSlot: event.target.value })} />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">ترتيب الرئيسية</label>
                      <input type="number" className="admin-input" value={editArticle.homeOrder || 0} onChange={event => updateArticle({ homeOrder: Number(event.target.value) })} />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">وقت القراءة بالدقائق</label>
                      <input type="number" className="admin-input" value={editArticle.readTimeMinutes || ''} onChange={event => updateArticle({ readTimeMinutes: event.target.value ? Number(event.target.value) : undefined })} />
                    </div>
                  </div>
                  <div className="blogger-toggle-row">
                    <Toggle checked={!!editArticle.featured} onChange={value => updateArticle({ featured: value })} label="مميز" />
                    <Toggle checked={!!editArticle.trending} onChange={value => updateArticle({ trending: value })} label="رائج" />
                    <Toggle checked={!!editArticle.breaking} onChange={value => updateArticle({ breaking: value })} label="عاجل" />
                  </div>
                </div>

                <div className="blogger-form-section">
                  <div className="blogger-section-title">
                    <ImageIcon size={16} />
                    <span>الصور</span>
                  </div>
                  <DriveUpload
                    label="رفع الصورة الرئيسية"
                    currentFileId={editArticle.image}
                    folderPath="news/articles/main"
                    scope="NEWS-ARTICLE-MAIN"
                    onUploaded={(result) => updateArticle({ image: result.fileId })}
                  />
                  <div className="admin-grid-2">
                    <div className="admin-field">
                      <label className="admin-label">وصف الصورة عربي</label>
                      <input className="admin-input" value={editArticle.imageAltAr || ''} onChange={event => updateArticle({ imageAltAr: event.target.value })} />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">وصف الصورة إنجليزي</label>
                      <input className="admin-input" value={editArticle.imageAltEn || ''} onChange={event => updateArticle({ imageAltEn: event.target.value })} />
                    </div>
                  </div>
                  <DriveUpload
                    label="رفع صور المعرض"
                    multiple
                    folderPath="news/articles/gallery"
                    scope="NEWS-ARTICLE-GALLERY"
                    onUploaded={() => undefined}
                    onUploadedMany={appendGallery}
                  />
                  {galleryImages.length > 0 && (
                    <div className="blogger-gallery-strip">
                      {galleryImages.map((image, index) => (
                        <span className="blogger-gallery-item" key={`${image.fileId}-${index}`}>
                          <img src={driveUrl(image.fileId || image.thumbnailUrl || image.url, 'w200')} alt="" />
                          <span>{image.driveName || image.fileName || `image ${index + 1}`}</span>
                          <button type="button" onClick={() => removeGalleryImage(index)} aria-label="حذف الصورة">
                            <X size={13} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="blogger-form-section">
                  <div className="blogger-section-title">
                    <Newspaper size={16} />
                    <span>المحتوى</span>
                  </div>
                  <div className="admin-grid-2">
                    <div className="admin-field">
                      <label className="admin-label">ملخص عربي</label>
                      <textarea className="admin-textarea" value={editArticle.summaryAr || ''} onChange={event => updateArticle({ summaryAr: event.target.value })} />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">ملخص إنجليزي</label>
                      <textarea className="admin-textarea" value={editArticle.summaryEn || ''} onChange={event => updateArticle({ summaryEn: event.target.value })} />
                    </div>
                  </div>
                  <div className="admin-grid-2">
                    <div className="admin-field">
                      <label className="admin-label">المحتوى عربي</label>
                      <textarea className="admin-textarea blogger-content-textarea" value={editArticle.contentAr || ''} onChange={event => updateArticle({ contentAr: event.target.value })} />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">المحتوى إنجليزي</label>
                      <textarea className="admin-textarea blogger-content-textarea" value={editArticle.contentEn || ''} onChange={event => updateArticle({ contentEn: event.target.value })} />
                    </div>
                  </div>
                </div>

                <div className="blogger-form-section">
                  <div className="blogger-section-title">
                    <Search size={16} />
                    <span>SEO</span>
                  </div>
                  <div className="admin-grid-3">
                    <div className="admin-field">
                      <label className="admin-label">Meta title</label>
                      <input className="admin-input" value={editArticle.metaTitle || ''} onChange={event => updateArticle({ metaTitle: event.target.value })} />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">Canonical URL</label>
                      <input className="admin-input" dir="ltr" value={editArticle.canonicalUrl || ''} onChange={event => updateArticle({ canonicalUrl: event.target.value })} />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">Tags</label>
                      <input className="admin-input" value={editArticle.tags || ''} onChange={event => updateArticle({ tags: event.target.value })} />
                    </div>
                  </div>
                  <div className="admin-grid-2">
                    <div className="admin-field">
                      <label className="admin-label">كلمات SEO</label>
                      <textarea className="admin-textarea" value={editArticle.seoKeywords || ''} onChange={event => updateArticle({ seoKeywords: event.target.value })} />
                    </div>
                    <div className="admin-field">
                      <label className="admin-label">Meta description</label>
                      <textarea className="admin-textarea" value={editArticle.metaDesc || ''} onChange={event => updateArticle({ metaDesc: event.target.value })} />
                    </div>
                  </div>
                </div>
              </section>

              <aside className="blogger-preview-panel">
                <div className="blogger-preview-card">
                  <div className="blogger-preview-image">
                    {editArticle.image ? <img src={driveUrl(editArticle.image, 'w800')} alt={editArticle.titleAr || ''} /> : <ImageIcon size={28} />}
                  </div>
                  <div className="blogger-preview-body">
                    <div className="blogger-preview-topline">
                      <span>{categoryName(editArticle.category)}</span>
                      <span>{statusLabels[editArticle.status || 'draft']}</span>
                    </div>
                    <h3>{editArticle.titleAr || 'عنوان المقال'}</h3>
                    <p>{editArticle.summaryAr || 'ملخص المقال يظهر هنا أثناء التحرير.'}</p>
                    <div className="blogger-preview-meta">
                      <span><UserRound size={14} /> {authorName(editArticle.authorId)}</span>
                      <span><Clock3 size={14} /> {editArticle.readTimeMinutes || Math.max(1, Math.ceil(articleWords / 220))} د</span>
                    </div>
                    <div className="blogger-preview-flags">
                      {editArticle.featured && <span><Star size={13} /> مميز</span>}
                      {editArticle.trending && <span><Flame size={13} /> رائج</span>}
                      {editArticle.breaking && <span><Megaphone size={13} /> عاجل</span>}
                    </div>
                  </div>
                </div>

                <div className="blogger-checklist">
                  <h3>جاهزية النشر</h3>
                  {[
                    ['عنوان عربي', !!editArticle.titleAr],
                    ['Slug صالح', !!createSlugForArticle()],
                    ['محتوى عربي', !!editArticle.contentAr],
                    ['صورة رئيسية', !!editArticle.image],
                    ['وصف SEO', !!editArticle.metaDesc],
                  ].map(([label, done]) => (
                    <div key={String(label)} className={done ? 'blogger-check blogger-check--done' : 'blogger-check'}>
                      <span>{done ? '✓' : '•'}</span>
                      <strong>{label}</strong>
                    </div>
                  ))}
                </div>

                <div className="blogger-side-note">
                  <span>URL</span>
                  <code>/news/articles/{createSlugForArticle()}</code>
                </div>
              </aside>
            </div>
          </main>
        </div>
      ) : (
        <div className="admin-card blogger-resource-card">
          <SectionHeader
            title={tabLabels[tab]}
            description={tab === 'categories' ? 'تنظيم أقسام الأخبار وألوانها.' : tab === 'authors' ? 'إدارة بيانات الكتاب وصورهم.' : 'إدارة الأخبار العاجلة في الشريط العلوي.'}
            action={<button className="admin-btn admin-btn--primary" type="button" onClick={openNew}><Plus size={16} /> إضافة</button>}
          />
          <AdminTable columns={resourceColumns as any} data={resourceData as any} loading={loading} onEdit={(item: any) => {
            if (tab === 'categories') setEditCategory(item);
            if (tab === 'authors') setEditAuthor(item);
            if (tab === 'breaking') setEditBreaking(item);
            setModalOpen(true);
          }} onDelete={deleteItem} />
        </div>
      )}

      {tab !== 'articles' && (
        <AdminModal title={`${tab === 'categories' && editCategory.id ? 'تعديل' : tab === 'authors' && editAuthor.id ? 'تعديل' : tab === 'breaking' && editBreaking.id ? 'تعديل' : 'إضافة'} ${tabLabels[tab]}`} open={modalOpen} onClose={() => setModalOpen(false)} onSave={saveCurrent} saving={saving}>
          {tab === 'categories' && (
            <div className="admin-form-grid">
              <div className="admin-grid-2">
                <div className="admin-field"><label className="admin-label">اسم التصنيف عربي</label><input className="admin-input" value={editCategory.nameAr || ''} onChange={event => setEditCategory({ ...editCategory, nameAr: event.target.value })} /></div>
                <div className="admin-field"><label className="admin-label">اسم التصنيف إنجليزي</label><input className="admin-input" value={editCategory.nameEn || ''} onChange={event => setEditCategory({ ...editCategory, nameEn: event.target.value, slug: editCategory.slug || slugify(event.target.value) })} /></div>
              </div>
              <div className="admin-grid-3">
                <div className="admin-field"><label className="admin-label">Slug</label><input className="admin-input" value={editCategory.slug || ''} onChange={event => setEditCategory({ ...editCategory, slug: slugify(event.target.value) })} /></div>
                <div className="admin-field"><label className="admin-label">اللون</label><input className="admin-input" value={editCategory.color || '#9d027c'} onChange={event => setEditCategory({ ...editCategory, color: event.target.value })} /></div>
                <div className="admin-field"><label className="admin-label">ترتيب الظهور</label><input type="number" className="admin-input" value={editCategory.order || 0} onChange={event => setEditCategory({ ...editCategory, order: Number(event.target.value) })} /></div>
              </div>
            </div>
          )}

          {tab === 'authors' && (
            <div className="admin-form-grid">
              <div className="admin-grid-2">
                <div className="admin-field"><label className="admin-label">اسم الكاتب عربي</label><input className="admin-input" value={editAuthor.nameAr || ''} onChange={event => setEditAuthor({ ...editAuthor, nameAr: event.target.value })} /></div>
                <div className="admin-field"><label className="admin-label">اسم الكاتب إنجليزي</label><input className="admin-input" value={editAuthor.nameEn || ''} onChange={event => setEditAuthor({ ...editAuthor, nameEn: event.target.value })} /></div>
              </div>
              <div className="admin-field">
                <label className="admin-label">صورة الكاتب</label>
                <DriveUpload currentFileId={editAuthor.image} folderPath="news/authors" scope="NEWS-AUTHOR" onUploaded={(result) => setEditAuthor({ ...editAuthor, image: result.fileId })} />
              </div>
              <div className="admin-grid-2">
                <div className="admin-field"><label className="admin-label">نبذة عربي</label><textarea className="admin-textarea" value={editAuthor.bioAr || ''} onChange={event => setEditAuthor({ ...editAuthor, bioAr: event.target.value })} /></div>
                <div className="admin-field"><label className="admin-label">نبذة إنجليزي</label><textarea className="admin-textarea" value={editAuthor.bioEn || ''} onChange={event => setEditAuthor({ ...editAuthor, bioEn: event.target.value })} /></div>
              </div>
            </div>
          )}

          {tab === 'breaking' && (
            <div className="admin-form-grid">
              <div className="admin-grid-2">
                <div className="admin-field"><label className="admin-label">نص الخبر عربي</label><input className="admin-input" value={editBreaking.textAr || ''} onChange={event => setEditBreaking({ ...editBreaking, textAr: event.target.value })} /></div>
                <div className="admin-field"><label className="admin-label">نص الخبر إنجليزي</label><input className="admin-input" value={editBreaking.textEn || ''} onChange={event => setEditBreaking({ ...editBreaking, textEn: event.target.value })} /></div>
              </div>
              <div className="admin-grid-3">
                <div className="admin-field"><label className="admin-label">الرابط</label><input className="admin-input" value={editBreaking.link || ''} onChange={event => setEditBreaking({ ...editBreaking, link: event.target.value })} /></div>
                <div className="admin-field"><label className="admin-label">ترتيب الظهور</label><input type="number" className="admin-input" value={editBreaking.order || 0} onChange={event => setEditBreaking({ ...editBreaking, order: Number(event.target.value) })} /></div>
                <Toggle checked={!!editBreaking.isActive} onChange={value => setEditBreaking({ ...editBreaking, isActive: value })} label="نشط" />
              </div>
            </div>
          )}
        </AdminModal>
      )}
    </AdminPageWrapper>
  );
}
