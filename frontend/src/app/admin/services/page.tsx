'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Eye,
  Layers3,
  Link2,
  ListChecks,
  Plus,
  Sparkles,
  X,
} from 'lucide-react';
import AdminPageWrapper from '../components/AdminPageWrapper';
import { AdminModal, AdminTable, DriveUpload, SectionHeader, Toggle } from '../components/AdminUI';
import { adminFetch, driveUrl, useAdminAuth } from '../lib/auth';

type DestinationType = 'dynamic' | 'internal';

interface ServicePortfolio {
  id: number;
  titleAr?: string;
  titleEn?: string;
}

interface ServiceItem {
  id: number;
  slug?: string | null;
  titleAr: string;
  titleEn: string;
  descAr?: string | null;
  descEn?: string | null;
  detailsAr?: string | null;
  detailsEn?: string | null;
  image?: string | null;
  features?: string[] | string | null;
  goalKeys?: string[] | string | null;
  theme?: string | null;
  destinationType?: DestinationType | null;
  internalPath?: string | null;
  icon?: string | null;
  price?: number | null;
  order: number;
  isActive: boolean;
  portfolioIds?: number[];
  portfolios?: ServicePortfolio[];
}

type ServiceDraft = Partial<ServiceItem> & {
  features: string[];
  goalKeys: string[];
};

const GROWTH_GOALS = [
  { key: 'sales', label: 'زيادة المبيعات', hint: 'تحويل الاهتمام إلى طلبات ومبيعات' },
  { key: 'brand', label: 'بناء البراند', hint: 'هوية ورسالة أوضح في السوق' },
  { key: 'platform', label: 'إطلاق منصة', hint: 'موقع أو تجربة رقمية جاهزة للنمو' },
  { key: 'content', label: 'صناعة المحتوى', hint: 'محتوى مستمر يخلي البراند حاضر' },
  { key: 'automation', label: 'أتمتة العمل', hint: 'أنظمة تقلل الوقت والعمل اليدوي' },
];

const THEMES = [
  { value: 'plum', label: 'Select Plum', color: '#9d027c' },
  { value: 'violet', label: 'Violet', color: '#7c3aed' },
  { value: 'gold', label: 'Gold', color: '#d97706' },
  { value: 'rose', label: 'Rose', color: '#e11d48' },
  { value: 'ocean', label: 'Ocean', color: '#0891b2' },
  { value: 'forest', label: 'Forest', color: '#059669' },
  { value: 'slate', label: 'Slate', color: '#475569' },
];

const INTERNAL_DESTINATIONS = [
  { value: '/branding', label: 'الهوية البصرية — /branding' },
  { value: '/social', label: 'السوشيال والتسويق — /social' },
  { value: '/software', label: 'البرمجيات والمنصات — /software' },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function listFrom(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(item => String(item).trim()).filter(Boolean);
  if (typeof value !== 'string') return [];

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(item => String(item).trim()).filter(Boolean);
  } catch {
    // Older records can contain a newline-separated value.
  }

  return value.split(/\r?\n|,/).map(item => item.trim()).filter(Boolean);
}

function normaliseService(item: ServiceItem): ServiceItem {
  return {
    ...item,
    features: listFrom(item.features),
    goalKeys: listFrom(item.goalKeys),
    theme: item.theme || 'plum',
    destinationType: item.destinationType === 'internal' ? 'internal' : 'dynamic',
    portfolios: Array.isArray(item.portfolios) ? item.portfolios : [],
  };
}

function publicHref(item: Partial<ServiceItem>) {
  if (item.destinationType === 'internal' && item.internalPath) return item.internalPath;
  return item.slug ? `/services/${item.slug}` : '/services';
}

function destinationLabel(item: ServiceItem) {
  if (item.destinationType !== 'internal') return 'صفحة خدمة ديناميكية';
  return INTERNAL_DESTINATIONS.find(destination => destination.value === item.internalPath)?.label || item.internalPath || 'صفحة داخلية';
}

function FeatureEditor({
  values,
  onChange,
}: {
  values: string[];
  onChange: (next: string[]) => void;
}) {
  const [value, setValue] = useState('');

  const add = () => {
    const next = value.trim();
    if (!next || values.includes(next)) return;
    onChange([...values, next]);
    setValue('');
  };

  return (
    <div className="service-chip-editor">
      <div className="service-chip-editor__values" aria-live="polite">
        {values.length ? values.map((feature) => (
          <span className="service-chip" key={feature}>
            {feature}
            <button type="button" onClick={() => onChange(values.filter(item => item !== feature))} aria-label={`حذف ${feature}`}>
              <X size={13} />
            </button>
          </span>
        )) : <span className="service-chip-editor__empty">أضف المميزات التي سيراها العميل في صفحة الخدمة.</span>}
      </div>
      <div className="service-chip-editor__input">
        <input
          className="admin-input"
          value={value}
          onChange={event => setValue(event.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              event.preventDefault();
              add();
            }
          }}
          placeholder="مثال: حملة مدفوعة مبنية على بيانات"
        />
        <button type="button" className="admin-btn admin-btn--ghost" onClick={add} disabled={!value.trim()}>
          <Plus size={15} /> إضافة
        </button>
      </div>
    </div>
  );
}

export default function AdminServicesPage() {
  const { token } = useAdminAuth();
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [movingId, setMovingId] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<ServiceDraft | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  const orderedItems = useMemo(
    () => [...items].sort((first, second) => first.order - second.order || first.id - second.id),
    [items],
  );

  const loadItems = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await adminFetch('/services', token);
      const data = Array.isArray(response) ? response : response?.data || response?.services || [];
      setItems(data.map((item: ServiceItem) => normaliseService(item)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems().catch(console.error);
  }, [token]);

  const updateDraft = (patch: Partial<ServiceDraft>) => {
    setEditItem(current => current ? { ...current, ...patch } : current);
  };

  const openAdd = () => {
    const nextOrder = orderedItems.reduce((highest, item) => Math.max(highest, Number(item.order) || 0), 0) + 1;
    setSlugTouched(false);
    setEditItem({
      titleAr: '',
      titleEn: '',
      slug: '',
      descAr: '',
      descEn: '',
      detailsAr: '',
      detailsEn: '',
      image: '',
      features: [],
      goalKeys: [],
      theme: 'plum',
      destinationType: 'dynamic',
      internalPath: '',
      icon: 'Sparkles',
      price: null,
      order: nextOrder,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEdit = (item: ServiceItem) => {
    const normalised = normaliseService(item);
    setSlugTouched(true);
    setEditItem({
      ...normalised,
      features: listFrom(normalised.features),
      goalKeys: listFrom(normalised.goalKeys),
    });
    setModalOpen(true);
  };

  const saveItem = async () => {
    if (!token || !editItem) return;
    const slug = slugify(editItem.slug || '');
    if (!editItem.titleAr?.trim() || !editItem.titleEn?.trim() || !slug || !editItem.descAr?.trim() || !editItem.descEn?.trim()) {
      alert('اكتب الاسم والوصف المختصر بالعربي والإنجليزي، مع رابط خدمة قصير صالح.');
      return;
    }

    setSaving(true);
    try {
      // This is an internal-only field. The public DTO intentionally strips it.
      const payload = {
        slug,
        titleAr: editItem.titleAr.trim(),
        titleEn: editItem.titleEn.trim(),
        descAr: editItem.descAr.trim(),
        descEn: editItem.descEn.trim(),
        detailsAr: editItem.detailsAr?.trim() || '',
        detailsEn: editItem.detailsEn?.trim() || '',
        image: editItem.image?.trim() || null,
        features: listFrom(editItem.features),
        goalKeys: listFrom(editItem.goalKeys),
        theme: editItem.theme || 'plum',
        destinationType: editItem.destinationType === 'internal' ? 'internal' : 'dynamic',
        internalPath: editItem.destinationType === 'internal' ? editItem.internalPath?.trim() || null : null,
        icon: editItem.icon || 'Sparkles',
        price: editItem.price ?? null,
        order: Number(editItem.order) || 0,
        isActive: editItem.isActive !== false,
      };

      if (editItem.id) {
        await adminFetch(`/services/${editItem.id}`, token, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await adminFetch('/services', token, { method: 'POST', body: JSON.stringify(payload) });
      }

      setModalOpen(false);
      await loadItems();
    } catch (error: any) {
      alert(error?.message || 'تعذر حفظ الخدمة.');
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (item: ServiceItem) => {
    if (!token) return;
    try {
      await adminFetch(`/services/${item.id}`, token, { method: 'DELETE' });
      await loadItems();
    } catch (error: any) {
      alert(error?.message || 'تعذر حذف الخدمة.');
    }
  };

  const moveItem = async (item: ServiceItem, direction: -1 | 1) => {
    if (!token || movingId) return;
    const index = orderedItems.findIndex(candidate => candidate.id === item.id);
    const neighbour = orderedItems[index + direction];
    if (!neighbour) return;

    setMovingId(item.id);
    try {
      const nextOrder = [...orderedItems];
      [nextOrder[index], nextOrder[index + direction]] = [nextOrder[index + direction], nextOrder[index]];
      // Normalise the entire sequence so legacy services with equal order values can still be reordered reliably.
      await Promise.all(nextOrder.map((service, serviceIndex) => {
        const order = (serviceIndex + 1) * 10;
        return service.order === order
          ? Promise.resolve()
          : adminFetch(`/services/${service.id}`, token, { method: 'PUT', body: JSON.stringify({ order }) });
      }));
      await loadItems();
    } catch (error: any) {
      alert(error?.message || 'تعذر تغيير ترتيب الخدمة.');
    } finally {
      setMovingId(null);
    }
  };

  const activeCount = orderedItems.filter(item => item.isActive).length;
  const linkedProjects = orderedItems.reduce((count, item) => count + (item.portfolios?.length || 0), 0);
  const featureCount = orderedItems.reduce((count, item) => count + listFrom(item.features).length, 0);

  const columns = [
    {
      key: 'service',
      label: 'الخدمة',
      render: (item: ServiceItem) => (
        <div className="service-table-title">
          <span className="service-table-image">
            {item.image ? <img src={driveUrl(item.image)} alt="" /> : <Sparkles size={17} />}
          </span>
          <span>
            <strong>{item.titleAr}</strong>
            <small>/{item.slug || 'pending-slug'}</small>
          </span>
        </div>
      ),
    },
    {
      key: 'goals',
      label: 'مسار النمو',
      render: (item: ServiceItem) => {
        const goals = listFrom(item.goalKeys);
        return goals.length ? (
          <div className="service-table-goals">
            {goals.slice(0, 2).map(goal => <span key={goal}>{GROWTH_GOALS.find(itemGoal => itemGoal.key === goal)?.label || goal}</span>)}
            {goals.length > 2 && <span>+{goals.length - 2}</span>}
          </div>
        ) : <span className="service-table-muted">لم يتم تحديد هدف</span>;
      },
    },
    {
      key: 'destination',
      label: 'الوجهة',
      render: (item: ServiceItem) => <span className="service-destination-label">{destinationLabel(item)}</span>,
    },
    {
      key: 'portfolio',
      label: 'الأعمال',
      render: (item: ServiceItem) => item.portfolios?.length
        ? <span className="service-table-linked">{item.portfolios.length} مرتبط</span>
        : <span className="service-table-muted">بدون ربط</span>,
    },
    {
      key: 'order',
      label: 'الترتيب',
      render: (item: ServiceItem) => {
        const index = orderedItems.findIndex(candidate => candidate.id === item.id);
        return (
          <div className="service-order-control">
            <strong>{index + 1}</strong>
            <span>
              <button type="button" onClick={() => moveItem(item, -1)} disabled={index === 0 || movingId !== null} title="تحريك للأعلى" aria-label="تحريك للأعلى"><ArrowUp size={14} /></button>
              <button type="button" onClick={() => moveItem(item, 1)} disabled={index === orderedItems.length - 1 || movingId !== null} title="تحريك للأسفل" aria-label="تحريك للأسفل"><ArrowDown size={14} /></button>
            </span>
          </div>
        );
      },
    },
    {
      key: 'isActive',
      label: 'الحالة',
      render: (item: ServiceItem) => (
        <span className={`admin-badge ${item.isActive ? 'admin-badge--green' : 'admin-badge--gray'}`}>
          {item.isActive ? 'نشطة' : 'مخفية'}
        </span>
      ),
    },
  ];

  const selectedGoals = listFrom(editItem?.goalKeys);
  const imageIsUrl = Boolean(editItem?.image?.startsWith('http'));
  const imageFolder = `services/${editItem?.slug || slugify(editItem?.titleEn || '') || 'new-service'}`;

  return (
    <AdminPageWrapper title="خدمات النمو">
      <section className="service-command-hero">
        <div className="service-command-hero__copy">
          <span className="service-command-hero__eyebrow"><Layers3 size={15} /> Select Growth Command Center</span>
          <h1>كل خدمة هنا هي خطوة واضحة في رحلة نمو العميل.</h1>
          <p>رتّب الخدمات، اربطها بالأعمال الحقيقية، وحدد الوجهة التي تظهر للعميل من مصدر واحد.</p>
        </div>
        <button type="button" className="admin-btn admin-btn--primary" onClick={openAdd}>
          <Plus size={17} /> إضافة خدمة
        </button>
      </section>

      <section className="service-summary-grid" aria-label="ملخص الخدمات">
        <div className="service-summary-card"><span className="service-summary-card__icon service-summary-card__icon--magenta"><Sparkles size={19} /></span><span><strong>{orderedItems.length}</strong><small>خدمة في المركز</small></span></div>
        <div className="service-summary-card"><span className="service-summary-card__icon service-summary-card__icon--green"><Eye size={19} /></span><span><strong>{activeCount}</strong><small>ظاهرة للجمهور</small></span></div>
        <div className="service-summary-card"><span className="service-summary-card__icon service-summary-card__icon--blue"><Link2 size={19} /></span><span><strong>{linkedProjects}</strong><small>ربط مع أعمال</small></span></div>
        <div className="service-summary-card"><span className="service-summary-card__icon service-summary-card__icon--amber"><ListChecks size={19} /></span><span><strong>{featureCount}</strong><small>ميزة معرفة</small></span></div>
      </section>

      <section className="admin-card service-command-table-card">
        <SectionHeader
          title="خريطة الخدمات"
          description="الترتيب هنا هو نفسه ترتيب الظهور في الرئيسية والخدمات العامة. تعطيل خدمة يخفيها فقط، ولا يحذف بياناتها."
          action={<button type="button" className="admin-btn admin-btn--ghost" onClick={loadItems} disabled={loading}>تحديث القائمة</button>}
        />
        <AdminTable columns={columns} data={orderedItems} loading={loading} onEdit={openEdit} onDelete={deleteItem} />
      </section>

      <AdminModal
        title={editItem?.id ? `تعديل خدمة: ${editItem.titleAr}` : 'إضافة خدمة جديدة'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={saveItem}
        saving={saving}
      >
        {editItem && (
          <div className="admin-form-grid service-editor-form">
            <section className="service-editor-section">
              <div className="service-editor-section__title"><Sparkles size={16} /><span>هوية الخدمة</span></div>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label className="admin-label">اسم الخدمة بالعربي *</label>
                  <input className="admin-input" value={editItem.titleAr || ''} onChange={event => updateDraft({ titleAr: event.target.value })} />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Service name in English *</label>
                  <input
                    className="admin-input"
                    value={editItem.titleEn || ''}
                    onChange={event => {
                      const titleEn = event.target.value;
                      updateDraft({ titleEn, ...(!editItem.id && !slugTouched ? { slug: slugify(titleEn) } : {}) });
                    }}
                  />
                </div>
              </div>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label className="admin-label">رابط الخدمة القصير *</label>
                  <input
                    className="admin-input service-slug-input"
                    dir="ltr"
                    value={editItem.slug || ''}
                    disabled={Boolean(editItem.id)}
                    onChange={event => {
                      setSlugTouched(true);
                      updateDraft({ slug: slugify(event.target.value) });
                    }}
                    placeholder="digital-marketing"
                  />
                  <small className="admin-field-hint">{editItem.id ? 'الرابط ثابت لحماية الروابط المنشورة. أنشئ خدمة جديدة إذا احتجت رابطًا مختلفًا.' : `سيظهر كـ /services/${editItem.slug || 'your-service'}`}</small>
                </div>
                <div className="admin-field">
                  <label className="admin-label">ثيم البطاقة</label>
                  <div className="service-theme-options" role="radiogroup" aria-label="ثيم الخدمة">
                    {THEMES.map(theme => (
                      <label className={`service-theme-option ${editItem.theme === theme.value ? 'service-theme-option--selected' : ''}`} key={theme.value} title={theme.label}>
                        <input type="radio" name="theme" value={theme.value} checked={editItem.theme === theme.value} onChange={() => updateDraft({ theme: theme.value })} />
                        <span style={{ background: theme.color }} />
                        <em>{theme.label}</em>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="admin-field">
                <label className="admin-label">صورة الخدمة</label>
                <DriveUpload
                  label="ارفع غلاف الخدمة إلى Google Drive"
                  currentFileId={imageIsUrl ? undefined : editItem.image || undefined}
                  currentUrl={imageIsUrl ? editItem.image || undefined : undefined}
                  folderPath={imageFolder}
                  scope="SITE-SERVICE-COVER"
                  disabled={!editItem.slug && !editItem.titleEn}
                  disabledReason="اكتب اسم الخدمة أو الرابط القصير أولًا لتحديد فولدر Drive."
                  onUploaded={result => updateDraft({ image: result.fileId })}
                />
              </div>
              <div className="admin-field">
                <label className="admin-label">سعر داخلي فقط</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="admin-input"
                  value={editItem.price ?? ''}
                  onChange={event => updateDraft({ price: event.target.value === '' ? null : Number(event.target.value) })}
                  placeholder="لا يظهر في الموقع العام"
                />
                <small className="admin-field-hint">يُحتفظ به داخل الإدارة فقط ولا يصل إلى API أو واجهة الخدمات العامة.</small>
              </div>
            </section>

            <section className="service-editor-section">
              <div className="service-editor-section__title"><ListChecks size={16} /><span>محتوى ومزايا الخدمة</span></div>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label className="admin-label">وصف مختصر بالعربي *</label>
                  <textarea className="admin-textarea" value={editItem.descAr || ''} onChange={event => updateDraft({ descAr: event.target.value })} placeholder="وصف واضح يظهر في بطاقة الخدمة." />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Short description in English *</label>
                  <textarea className="admin-textarea" value={editItem.descEn || ''} onChange={event => updateDraft({ descEn: event.target.value })} placeholder="Short card description." />
                </div>
              </div>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label className="admin-label">التفاصيل بالعربي</label>
                  <textarea className="admin-textarea service-editor-details" value={editItem.detailsAr || ''} onChange={event => updateDraft({ detailsAr: event.target.value })} placeholder="القصة الكاملة للعميل: ماذا تشمل الخدمة، ولماذا يحتاجها؟" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Details in English</label>
                  <textarea className="admin-textarea service-editor-details" value={editItem.detailsEn || ''} onChange={event => updateDraft({ detailsEn: event.target.value })} placeholder="The fuller story used on the service detail page." />
                </div>
              </div>
              <div className="admin-field">
                <label className="admin-label">مميزات الخدمة</label>
                <FeatureEditor values={listFrom(editItem.features)} onChange={features => updateDraft({ features })} />
              </div>
            </section>

            <section className="service-editor-section">
              <div className="service-editor-section__title"><Layers3 size={16} /><span>رحلة العميل والظهور</span></div>
              <div className="admin-field">
                <label className="admin-label">الخدمة تساعد العميل في</label>
                <div className="service-goal-grid">
                  {GROWTH_GOALS.map(goal => {
                    const selected = selectedGoals.includes(goal.key);
                    return (
                      <label className={`service-goal-option ${selected ? 'service-goal-option--selected' : ''}`} key={goal.key}>
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => updateDraft({
                            goalKeys: selected ? selectedGoals.filter(key => key !== goal.key) : [...selectedGoals, goal.key],
                          })}
                        />
                        <span><strong>{goal.label}</strong><small>{goal.hint}</small></span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label className="admin-label">نوع الوجهة</label>
                  <select className="admin-select" value={editItem.destinationType || 'dynamic'} onChange={event => updateDraft({ destinationType: event.target.value as DestinationType })}>
                    <option value="dynamic">صفحة خدمة ديناميكية</option>
                    <option value="internal">صفحة متخصصة موجودة</option>
                  </select>
                </div>
                {editItem.destinationType === 'internal' ? (
                  <div className="admin-field">
                    <label className="admin-label">الصفحة المتخصصة</label>
                    <select className="admin-select" value={editItem.internalPath || ''} onChange={event => updateDraft({ internalPath: event.target.value })}>
                      <option value="">اختر وجهة</option>
                      {INTERNAL_DESTINATIONS.map(destination => <option key={destination.value} value={destination.value}>{destination.label}</option>)}
                    </select>
                  </div>
                ) : (
                  <div className="admin-field">
                    <label className="admin-label">الصفحة العامة</label>
                    <div className="service-readonly-path"><Link2 size={15} /><code>/services/{editItem.slug || 'your-service'}</code></div>
                  </div>
                )}
              </div>
              <div className="service-editor-footer-controls">
                <Toggle label="الخدمة نشطة وتظهر للجمهور" checked={editItem.isActive !== false} onChange={isActive => updateDraft({ isActive })} />
                <div className="service-editor-preview">
                  <a href={publicHref(editItem)} target="_blank" rel="noreferrer" className="admin-btn admin-btn--ghost">
                    <Eye size={15} /> معاينة الوجهة
                  </a>
                  <span>الأعمال المرتبطة تختارها من محرر المشروع.</span>
                </div>
              </div>
            </section>
          </div>
        )}
      </AdminModal>
    </AdminPageWrapper>
  );
}
