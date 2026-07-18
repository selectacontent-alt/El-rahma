'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpLeft,
  BellRing,
  ClipboardList,
  FileText,
  Film,
  FolderKanban,
  Globe2,
  Mail,
  Newspaper,
  Settings2,
  Tags,
  UsersRound,
} from 'lucide-react';
import { useAdminAuth, adminFetch } from './lib/auth';
import { StatCard, StatusBadge } from './components/AdminUI';
import AdminPageWrapper from './components/AdminPageWrapper';

interface DashboardStats {
  contacts: number;
  portfolio: number;
  websites: number;
  articles: number;
  pages: number;
  mediaAssets: number;
  services: number;
  newContacts: number;
  newPlanRequests: number;
  newAdvertisingRequests: number;
  draftArticles: number;
  publishedArticles: number;
  publishedPages: number;
  recentContacts: { id: number; name: string; email?: string; phone?: string; planTitle?: string; status: string; createdAt: string }[];
  recentAudit: { id: number; method: string; path: string; createdAt: string; user?: { username: string } }[];
}

const quickActions = [
  { href: '/admin/news', label: 'مقال جديد', desc: 'اكتب وانشر مع SEO والوسائط', icon: Newspaper, tone: 'magenta' },
  { href: '/admin/leads', label: 'متابعة العملاء', desc: 'راجع الطلبات الجديدة أولًا', icon: UsersRound, tone: 'violet' },
  { href: '/admin/media', label: 'رفع أصل جديد', desc: 'ريل، لقطة، أو ملف منظم', icon: Film, tone: 'orange' },
  { href: '/admin/portfolio', label: 'إضافة مشروع', desc: 'هوية أو دراسة حالة جديدة', icon: FolderKanban, tone: 'blue' },
];

function relativeDate(value: string) {
  const date = new Date(value).getTime();
  if (Number.isNaN(date)) return '';
  const minutes = Math.max(0, Math.round((Date.now() - date) / 60000));
  if (minutes < 1) return 'الآن';
  if (minutes < 60) return `منذ ${minutes} د`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `منذ ${hours} س`;
  return new Date(value).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' });
}

export default function AdminDashboard() {
  const { user, token } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    if (!token) return;
    setError('');
    try {
      setStats(await adminFetch('/dashboard', token));
    } catch (requestError: any) {
      setError(requestError?.message || 'تعذر تحميل مؤشرات لوحة القيادة');
    }
  };

  useEffect(() => { void loadDashboard(); }, [token]);

  const publication = useMemo(() => {
    if (!stats?.articles) return 0;
    return Math.round((stats.publishedArticles / stats.articles) * 100);
  }, [stats]);

  const priorityItems = [
    { label: 'طلبات تواصل جديدة', count: stats?.newContacts ?? 0, href: '/admin/leads', hint: 'تحتاج متابعة وتحديد الحالة', icon: Mail },
    { label: 'طلبات خطط تسويقية', count: stats?.newPlanRequests ?? 0, href: '/admin/leads?requestType=plan', hint: 'راجع الميزانية وبيانات التواصل', icon: ClipboardList },
    { label: 'مسودات بانتظار النشر', count: stats?.draftArticles ?? 0, href: '/admin/news?status=draft', hint: 'راجع المحتوى والـSEO قبل النشر', icon: FileText },
  ];

  return (
    <AdminPageWrapper>
      <section className="admin-command-hero">
        <div>
          <span className="admin-command-kicker">مركز تشغيل Select</span>
          <h1>أهلًا {user?.username || 'بك'}، كل ما يحتاج متابعة ظاهر أمامك.</h1>
          <p>تابع الطلبات والمحتوى والأصول من مكان واحد، وابدأ بالمهام التي تؤثر على العمل اليوم.</p>
        </div>
        <div className="admin-command-hero-actions">
          <Link href="/admin/leads" className="admin-btn admin-btn--primary"><BellRing size={16} />فتح مهام اليوم</Link>
          <Link href="/admin/settings" className="admin-btn admin-btn--ghost"><Settings2 size={16} />إعدادات الموقع</Link>
        </div>
      </section>

      {error ? (
        <section className="admin-inline-error">
          <div><strong>تعذر تحديث لوحة القيادة</strong><span>{error}</span></div>
          <button className="admin-btn admin-btn--ghost" type="button" onClick={() => void loadDashboard()}>إعادة المحاولة</button>
        </section>
      ) : (
        <>
          <section className="admin-overview-grid">
            <div className="admin-overview-card admin-overview-card--priority">
              <span>مهام تحتاج انتباهك</span>
              <strong>{((stats?.newContacts ?? 0) + (stats?.draftArticles ?? 0)).toLocaleString('ar-EG')}</strong>
              <small>طلبات جديدة ومسودات محتوى بانتظار قرار</small>
              <div className="admin-overview-progress"><span style={{ width: `${Math.min(100, 24 + ((stats?.newContacts ?? 0) + (stats?.draftArticles ?? 0)) * 8)}%` }} /></div>
            </div>
            <div className="admin-overview-card">
              <span>جاهزية النشر</span>
              <strong>{publication}%</strong>
              <small>{stats?.publishedArticles ?? 0} منشور من {stats?.articles ?? 0} مقال</small>
              <Link href="/admin/news" className="admin-overview-link">إدارة المقالات <ArrowUpLeft size={14} /></Link>
            </div>
            <div className="admin-overview-card">
              <span>محتوى الموقع</span>
              <strong>{stats?.publishedPages ?? 0}</strong>
              <small>صفحة منشورة من أصل {stats?.pages ?? 0}</small>
              <Link href="/admin/pages" className="admin-overview-link">فتح الصفحات <ArrowUpLeft size={14} /></Link>
            </div>
          </section>

          <section className="admin-stats-grid admin-stats-grid--command">
            <StatCard label="عملاء جدد" value={stats?.newContacts ?? '—'} color="#a1087f" icon={<Mail size={21} />} helper="طلبات بانتظار المتابعة" />
            <StatCard label="طلبات إعلانات" value={stats?.newAdvertisingRequests ?? '—'} color="#c2410c" icon={<BellRing size={21} />} helper="احتياجات حملات وميزانيات" />
            <StatCard label="مقالات منشورة" value={stats?.publishedArticles ?? '—'} color="#087a4d" icon={<Newspaper size={21} />} helper="محتوى متاح للزوار" />
            <StatCard label="أصول ميديا" value={stats?.mediaAssets ?? '—'} color="#2563eb" icon={<Film size={21} />} helper="صور وفيديو منظم" />
            <StatCard label="مشاريع وهويات" value={stats?.portfolio ?? '—'} color="#7c3aed" icon={<FolderKanban size={21} />} helper="نماذج أعمال معروضة" />
            <StatCard label="مشاريع مواقع" value={stats?.websites ?? '—'} color="#0f766e" icon={<Globe2 size={21} />} helper="روابط ولقطات حية" />
          </section>

          <section className="admin-workspace-grid">
            <div className="admin-card admin-card--workspace">
              <div className="admin-card-header">
                <div><h2 className="admin-card-title">أولوية اليوم</h2><p className="admin-card-sub">ابدأ بالعناصر التي تحتاج قرارًا أو متابعة مباشرة.</p></div>
                <Link href="/admin/leads" className="admin-mini-link">كل العملاء</Link>
              </div>
              <div className="admin-priority-list">
                {priorityItems.map(item => {
                  const Icon = item.icon;
                  return <Link className="admin-priority-row" key={item.label} href={item.href}>
                    <span className="admin-priority-icon"><Icon size={18} /></span>
                    <span><strong>{item.label}</strong><small>{item.hint}</small></span>
                    <b>{item.count.toLocaleString('ar-EG')}</b><ArrowUpLeft size={16} />
                  </Link>;
                })}
              </div>
            </div>
            <div className="admin-card admin-card--workspace">
              <div className="admin-card-header"><div><h2 className="admin-card-title">إجراءات سريعة</h2><p className="admin-card-sub">اختصارات لأكثر العمليات المتكررة.</p></div></div>
              <div className="admin-quick-action-grid">
                {quickActions.map(item => {
                  const Icon = item.icon;
                  return <Link key={item.href} href={item.href} className={`admin-quick-action admin-quick-action--${item.tone}`}>
                    <span><Icon size={18} /></span><strong>{item.label}</strong><small>{item.desc}</small>
                  </Link>;
                })}
              </div>
            </div>
          </section>

          <section className="admin-workspace-grid admin-workspace-grid--activity">
            <div className="admin-card admin-card--workspace">
              <div className="admin-card-header"><div><h2 className="admin-card-title">آخر العملاء</h2><p className="admin-card-sub">طلبات الموقع التي وصلت مؤخرًا.</p></div><Link href="/admin/leads" className="admin-mini-link">عرض الكل</Link></div>
              {!stats ? <div className="admin-table-loading admin-table-skeleton"><span /><span /><span /></div> : !stats.recentContacts.length ? <div className="admin-empty"><strong>لا توجد طلبات جديدة حتى الآن</strong><span>ستظهر طلبات التواصل هنا فور وصولها.</span></div> : <div className="admin-list admin-list--command">{stats.recentContacts.map(lead => <Link href="/admin/leads" key={lead.id} className="admin-list-row"><span><strong>{lead.name}</strong><small>{lead.planTitle || lead.email || lead.phone || 'طلب جديد'} · {relativeDate(lead.createdAt)}</small></span><StatusBadge status={lead.status} /></Link>)}</div>}
            </div>
            <div className="admin-card admin-card--workspace">
              <div className="admin-card-header"><div><h2 className="admin-card-title">آخر النشاطات</h2><p className="admin-card-sub">متابعة ما تم تغييره داخل اللوحة.</p></div><Link href="/admin/audit" className="admin-mini-link">سجل النشاط</Link></div>
              {!stats ? <div className="admin-table-loading admin-table-skeleton"><span /><span /><span /></div> : !stats.recentAudit?.length ? <div className="admin-empty"><strong>لا توجد نشاطات مسجلة</strong><span>ستظهر عمليات الحفظ والتعديل هنا.</span></div> : <div className="admin-list admin-list--command">{stats.recentAudit.map(log => <div key={log.id} className="admin-list-row"><span><strong>{log.method} {log.path}</strong><small>{log.user?.username || 'النظام'} · {relativeDate(log.createdAt)}</small></span></div>)}</div>}
            </div>
          </section>
        </>
      )}
    </AdminPageWrapper>
  );
}
