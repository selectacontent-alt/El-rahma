'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { adminFetch, AdminUploadResult, driveUrl, useAdminAuth } from '../lib/auth';
import { AdminModal, AdminTable, DriveUpload, SectionHeader } from './AdminUI';

type LocaleCopy = Record<string, string>;

interface CmsSection {
  id: number;
  key: string;
  labelAr: string;
  labelEn?: string | null;
  type: string;
  content: string | Record<string, unknown>;
  order: number;
  isVisible: boolean;
}

interface Metric {
  id: string;
  value: string;
  suffix: string;
  labelAr: string;
  labelEn: string;
}

interface Partner {
  id: number;
  name: string;
  logoUrl: string;
  order: number;
}

interface Testimonial {
  id: number;
  clientName: string;
  clientTitle?: string | null;
  clientImage?: string | null;
  contentAr: string;
  contentEn?: string | null;
  rating: number;
}

const HOME_DEFAULTS: Record<string, { labelAr: string; labelEn: string; order: number; content: { ar: LocaleCopy; en: LocaleCopy } }> = {
  hero: {
    labelAr: 'واجهة النمو',
    labelEn: 'Growth hero',
    order: 1,
    content: {
      ar: {
        eyebrow: 'منظومة نمو متكاملة',
        title: 'انضم إلى عائلتنا',
        subtitle: 'نبدأ من هدفك، ونربط كل خدمة بالخطوة التي تقرّب مشروعك من النتيجة.',
        typingLines: 'صمم موقعك الاحترافي برمجة خاصة\nصمم هويتك البصرية باحتراف\nاطلب خطة تسويقية مجانا\nصور منتجاتك باحترافية\nصمم فيديوهات احترافية لتطوير نشاطك التجاري\nصمم تطبيق موبايل احترافي\nصمم CRM احترافي لتطوير ادارة نشاطك',
        primaryCta: 'اختار مسار نموك',
        secondaryCta: 'ابدأ مشروعك',
      },
      en: {
        eyebrow: 'A connected growth system',
        title: 'Not isolated services. One connected growth system for your business.',
        subtitle: 'From brand and content to software and performance, every step is connected to create real momentum.',
        typingLines: 'Design your custom website\nDesign your visual identity\nRequest a free marketing plan\nPhotograph your products professionally\nCreate promo videos for your business\nDesign a mobile app\nDesign a custom CRM system',
        primaryCta: 'Choose your growth path',
        secondaryCta: 'Start your project',
      },
    },
  },
  growth: {
    labelAr: 'مركز النمو',
    labelEn: 'Growth centre',
    order: 2,
    content: {
      ar: { eyebrow: 'مسارات النمو', title: 'اختار هدفك وشوف المنظومة المناسبة', subtitle: 'كل خدمة هنا مرتبطة بهدف واضح في نمو مشروعك.' },
      en: { eyebrow: 'Growth paths', title: 'Choose your goal and see the right system', subtitle: 'Every service here is connected to a clear business outcome.' },
    },
  },
  process: {
    labelAr: 'طريقة العمل',
    labelEn: 'How we work',
    order: 5,
    content: {
      ar: { eyebrow: 'منهجية واضحة', title: 'من التشخيص للقياس والتحسين', subtitle: 'نحوّل المطلوب لمسار عملي قابل للقياس.', steps: 'تشخيص\nتصميم الحل\nالإطلاق\nالقياس والتحسين' },
      en: { eyebrow: 'A clear method', title: 'From diagnosis to optimisation', subtitle: 'We turn the brief into a measurable operating path.', steps: 'Diagnose\nArchitect\nLaunch\nMeasure and optimise' },
    },
  },
  partners: {
    labelAr: 'شركاء النجاح',
    labelEn: 'Success Partners',
    order: 7,
    content: {
      ar: {
        eyebrow: '',
        title: 'شركاء النجاح',
        subtitle: 'ثقة بنيناها مع شركاء اختاروا النمو معنا.',
      },
      en: {
        eyebrow: '',
        title: 'Success Partners',
        subtitle: 'Trusted by partners who chose to grow with us.',
      },
    },
  },
  finalCta: {
    labelAr: 'الدعوة الختامية',
    labelEn: 'Closing CTA',
    order: 8,
    content: {
      ar: { title: 'جاهز نبني مسار النمو الخاص بمشروعك؟', cta: 'ابدأ مشروعك' },
      en: { title: 'Ready to build your growth path?', cta: 'Start your project' },
    },
  },
};

const EMPTY_PARTNER: Partial<Partner> = { name: '', logoUrl: '', order: 0 };
const EMPTY_TESTIMONIAL: Partial<Testimonial> = { clientName: '', clientTitle: '', clientImage: '', contentAr: '', contentEn: '', rating: 5 };

function readContent(value: CmsSection['content'], fallback: Record<string, unknown>) {
  if (value && typeof value === 'object') return value as Record<string, unknown>;
  if (typeof value !== 'string') return fallback;
  try {
    const parsed = JSON.parse(value || '{}');
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function text(content: Record<string, unknown>, locale: 'ar' | 'en', field: string, fallback = '') {
  const localized = content[locale];
  if (localized && typeof localized === 'object') {
    const value = (localized as Record<string, unknown>)[field];
    if (typeof value === 'string') return value;
  }
  return fallback;
}

function normalizeMetrics(raw?: string): Metric[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(Boolean).map((item, index) => ({
      id: String(item.id || `metric-${index + 1}`),
      value: String(item.value || ''),
      suffix: String(item.suffix || ''),
      labelAr: String(item.labelAr || ''),
      labelEn: String(item.labelEn || ''),
    }));
  } catch {
    return [];
  }
}

function SectionFields({
  sectionKey,
  section,
  onChange,
}: {
  sectionKey: string;
  section: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
}) {
  const config = HOME_DEFAULTS[sectionKey];
  const fields = sectionKey === 'hero'
    ? ['eyebrow', 'title', 'subtitle', 'typingLines', 'primaryCta', 'secondaryCta']
    : sectionKey === 'process'
      ? ['eyebrow', 'title', 'subtitle', 'steps']
      : sectionKey === 'finalCta'
        ? ['title', 'cta']
        : ['eyebrow', 'title', 'subtitle'];

  const update = (locale: 'ar' | 'en', field: string, value: string) => {
    const current = readContent(section as any, config.content);
    const localized = { ...((current[locale] as Record<string, unknown>) || {}), [field]: value };
    onChange({ ...current, [locale]: localized });
  };

  const labels: Record<string, string> = {
    eyebrow: 'العنوان الصغير',
    title: 'العنوان',
    subtitle: 'الوصف',
    typingLines: 'أسطر التأثير البصري - سطر لكل عبارة',
    primaryCta: 'زر المسار',
    secondaryCta: 'زر التواصل',
    cta: 'نص الزر',
    steps: 'الخطوات - سطر لكل خطوة',
  };

  return (
    <div className="admin-form-grid" style={{ marginTop: 16 }}>
      {fields.map(field => (
        <div className="admin-grid-2" key={field}>
          <div className="admin-field">
            <label className="admin-label">{labels[field]} AR</label>
            {field === 'subtitle' || field === 'steps' || field === 'typingLines' ? (
              <textarea className="admin-textarea" value={text(section, 'ar', field, text(config.content as any, 'ar', field))} onChange={event => update('ar', field, event.target.value)} />
            ) : (
              <input className="admin-input" value={text(section, 'ar', field, text(config.content as any, 'ar', field))} onChange={event => update('ar', field, event.target.value)} />
            )}
          </div>
          <div className="admin-field">
            <label className="admin-label">{labels[field]} EN</label>
            {field === 'subtitle' || field === 'steps' || field === 'typingLines' ? (
              <textarea className="admin-textarea" value={text(section, 'en', field, text(config.content as any, 'en', field))} onChange={event => update('en', field, event.target.value)} />
            ) : (
              <input className="admin-input" value={text(section, 'en', field, text(config.content as any, 'en', field))} onChange={event => update('en', field, event.target.value)} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomeControlCenter() {
  const { token } = useAdminAuth();
  const [sections, setSections] = useState<Record<string, CmsSection>>({});
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [partnerDraft, setPartnerDraft] = useState<Partial<Partner> | null>(null);
  const [testimonialDraft, setTestimonialDraft] = useState<Partial<Testimonial> | null>(null);

  const cards = useMemo(() => Object.keys(HOME_DEFAULTS).map(key => ({ key, config: HOME_DEFAULTS[key] })), []);

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [page, settings, partnerRows, testimonialRows] = await Promise.all([
        adminFetch('/pages/home', token),
        adminFetch('/home', token),
        adminFetch('/partners', token),
        adminFetch('/testimonials', token),
      ]);
      const byKey: Record<string, CmsSection> = {};
      (page.sections || []).forEach((item: CmsSection) => { byKey[item.key] = item; });
      setSections(byKey);
      setMetrics(normalizeMetrics(settings?.['home.metrics']));
      setPartners(partnerRows || []);
      setTestimonials(testimonialRows || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load().catch(console.error); }, [token]);

  const sectionContent = (key: string) => readContent(sections[key]?.content || {}, HOME_DEFAULTS[key].content);

  const updateSection = (key: string, content: Record<string, unknown>) => {
    setSections(current => ({
      ...current,
      [key]: { ...(current[key] || { id: 0, key, ...HOME_DEFAULTS[key], type: 'home', isVisible: true }), content },
    }));
  };

  const saveHome = async () => {
    if (!token) return;
    setSaving(true);
    try {
      await Promise.all(cards.map(async ({ key, config }) => {
        const section = sections[key];
        const payload = {
          key,
          labelAr: config.labelAr,
          labelEn: config.labelEn,
          type: 'home',
          content: sectionContent(key),
          order: config.order,
          isVisible: true,
        };
        if (section?.id) {
          await adminFetch(`/pages/home/sections/${section.id}`, token, { method: 'PUT', body: JSON.stringify(payload) });
        } else {
          await adminFetch('/pages/home/sections', token, { method: 'POST', body: JSON.stringify(payload) });
        }
      }));
      await adminFetch('/home', token, { method: 'PUT', body: JSON.stringify({ 'home.metrics': JSON.stringify(metrics) }) });
      await adminFetch('/pages/home/publish', token, { method: 'POST' });
      await load();
    } catch (error: any) {
      alert(error.message || 'تعذر حفظ محتوى الرئيسية');
    } finally {
      setSaving(false);
    }
  };

  const savePartner = async () => {
    if (!token) return;
    const name = partnerDraft?.name?.trim() || '';
    const logoUrl = partnerDraft?.logoUrl?.trim() || '';
    if (!name) {
      alert('اكتب اسم الشريك أولًا');
      return;
    }
    if (!logoUrl) {
      alert('ارفع شعار الشريك أولًا؛ بدون شعار لن يظهر في الرئيسية');
      return;
    }
    const payload = { name, logoUrl, order: Number(partnerDraft?.order || 0) };
    try {
      if (partnerDraft?.id) await adminFetch(`/partners/${partnerDraft.id}`, token, { method: 'PUT', body: JSON.stringify(payload) });
      else await adminFetch('/partners', token, { method: 'POST', body: JSON.stringify(payload) });
      setPartnerDraft(null);
      await load();
    } catch (error: any) {
      alert(error.message || 'تعذر حفظ الشريك');
    }
  };

  const saveTestimonial = async () => {
    if (!testimonialDraft?.clientName || !testimonialDraft?.contentAr || !token) return;
    const payload = {
      clientName: testimonialDraft.clientName,
      clientTitle: testimonialDraft.clientTitle || null,
      clientImage: testimonialDraft.clientImage || null,
      contentAr: testimonialDraft.contentAr,
      contentEn: testimonialDraft.contentEn || null,
      rating: Number(testimonialDraft.rating || 5),
    };
    if (testimonialDraft.id) await adminFetch(`/testimonials/${testimonialDraft.id}`, token, { method: 'PUT', body: JSON.stringify(payload) });
    else await adminFetch('/testimonials', token, { method: 'POST', body: JSON.stringify(payload) });
    setTestimonialDraft(null);
    await load();
  };

  if (loading) return <div className="admin-card"><span className="admin-spinner admin-spinner--lg" /></div>;

  return (
    <div className="admin-form-grid">
      <div className="admin-card">
        <SectionHeader
          title="محتوى الرئيسية"
          description="حقول منظمة للواجهة الجديدة. الحفظ ينشر النصوص مباشرة في الصفحة العامة."
          action={<button type="button" className="admin-btn admin-btn--primary" onClick={saveHome} disabled={saving}>{saving ? 'جاري الحفظ...' : 'حفظ ونشر الرئيسية'}</button>}
        />
        {cards.map(({ key, config }) => (
          <details key={key} className="admin-card" open={key === 'hero'} style={{ marginTop: 14, boxShadow: 'none' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 800 }}>{config.labelAr}</summary>
            <SectionFields sectionKey={key} section={sectionContent(key)} onChange={content => updateSection(key, content)} />
          </details>
        ))}
      </div>

      <div className="admin-card">
        <SectionHeader title="أرقام موثقة" description="لن تظهر في الموقع إن لم تضف أرقامًا حقيقية هنا." action={<button type="button" className="admin-btn admin-btn--ghost" onClick={() => setMetrics(current => [...current, { id: `metric-${Date.now()}`, value: '', suffix: '+', labelAr: '', labelEn: '' }])}><Plus size={16} /> إضافة رقم</button>} />
        <div className="admin-form-grid">
          {metrics.map((metric, index) => (
            <div className="admin-grid-3" key={metric.id}>
              <input className="admin-input" placeholder="الرقم" value={metric.value} onChange={event => setMetrics(current => current.map((row, rowIndex) => rowIndex === index ? { ...row, value: event.target.value } : row))} />
              <input className="admin-input" placeholder="الوصف AR" value={metric.labelAr} onChange={event => setMetrics(current => current.map((row, rowIndex) => rowIndex === index ? { ...row, labelAr: event.target.value } : row))} />
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="admin-input" placeholder="الوصف EN" value={metric.labelEn} onChange={event => setMetrics(current => current.map((row, rowIndex) => rowIndex === index ? { ...row, labelEn: event.target.value } : row))} />
                <button type="button" className="admin-icon-btn admin-icon-btn--danger" onClick={() => setMetrics(current => current.filter((_, rowIndex) => rowIndex !== index))}><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
          {!metrics.length && <div className="admin-empty">لا توجد أرقام منشورة الآن.</div>}
        </div>
      </div>

      <div className="admin-grid-2">
        <div className="admin-card">
          <SectionHeader title="شركاء النجاح" description="القسم مخفي من الرئيسية الآن لأنه لا توجد شعارات محفوظة. أضف شريكًا حقيقيًا وسيظهر تلقائيًا بدون تعديل كود." action={<button type="button" className="admin-btn admin-btn--ghost" onClick={() => setPartnerDraft(EMPTY_PARTNER)}><Plus size={16} /> شريك</button>} />
          <AdminTable columns={[
            { key: 'logoUrl', label: 'الشعار', render: (row: Partner) => <img src={driveUrl(row.logoUrl)} alt="" style={{ width: 52, height: 34, objectFit: 'contain' }} /> },
            { key: 'name', label: 'الاسم' },
            { key: 'order', label: 'الترتيب' },
          ]} data={partners} onEdit={row => setPartnerDraft(row)} onDelete={async row => { await adminFetch(`/partners/${row.id}`, token, { method: 'DELETE' }); await load(); }} />
          {!partners.length && (
            <div className="admin-empty" style={{ marginTop: 12 }}>
              لن يظهر شريط شركاء النجاح في الرئيسية إلا بعد إضافة اسم الشريك ورفع الشعار من هنا.
            </div>
          )}
        </div>
        <div className="admin-card">
          <SectionHeader title="شهادات حقيقية" description="لن تظهر أي شهادة حتى تضيفها بنفسك." action={<button type="button" className="admin-btn admin-btn--ghost" onClick={() => setTestimonialDraft(EMPTY_TESTIMONIAL)}><Plus size={16} /> شهادة</button>} />
          <AdminTable columns={[
            { key: 'clientName', label: 'العميل' },
            { key: 'clientTitle', label: 'الصفة' },
            { key: 'rating', label: 'التقييم', render: (row: Testimonial) => `${row.rating}/5` },
          ]} data={testimonials} onEdit={row => setTestimonialDraft(row)} onDelete={async row => { await adminFetch(`/testimonials/${row.id}`, token, { method: 'DELETE' }); await load(); }} />
        </div>
      </div>

      <AdminModal title={partnerDraft?.id ? 'تعديل شريك' : 'إضافة شريك'} open={!!partnerDraft} onClose={() => setPartnerDraft(null)} onSave={savePartner}>
        <div className="admin-form-grid">
          <div className="admin-field"><label className="admin-label">اسم الشريك *</label><input className="admin-input" value={partnerDraft?.name || ''} onChange={event => setPartnerDraft(current => ({ ...current, name: event.target.value }))} /></div>
          <div className="admin-field"><label className="admin-label">الترتيب</label><input type="number" className="admin-input" value={partnerDraft?.order || 0} onChange={event => setPartnerDraft(current => ({ ...current, order: Number(event.target.value) }))} /></div>
          <DriveUpload label="رفع شعار الشريك" folderPath="home/partners" scope="HOME-PARTNER" currentFileId={partnerDraft?.logoUrl} onUploaded={result => setPartnerDraft(current => ({ ...current, logoUrl: result.fileId }))} />
        </div>
      </AdminModal>

      <AdminModal title={testimonialDraft?.id ? 'تعديل شهادة' : 'إضافة شهادة'} open={!!testimonialDraft} onClose={() => setTestimonialDraft(null)} onSave={saveTestimonial}>
        <div className="admin-form-grid">
          <div className="admin-grid-2">
            <div className="admin-field"><label className="admin-label">اسم العميل *</label><input className="admin-input" value={testimonialDraft?.clientName || ''} onChange={event => setTestimonialDraft(current => ({ ...current, clientName: event.target.value }))} /></div>
            <div className="admin-field"><label className="admin-label">الصفة</label><input className="admin-input" value={testimonialDraft?.clientTitle || ''} onChange={event => setTestimonialDraft(current => ({ ...current, clientTitle: event.target.value }))} /></div>
          </div>
          <DriveUpload label="صورة العميل" folderPath="home/testimonials" scope="HOME-TESTIMONIAL" currentFileId={testimonialDraft?.clientImage || undefined} onUploaded={result => setTestimonialDraft(current => ({ ...current, clientImage: result.fileId }))} />
          <div className="admin-field"><label className="admin-label">الشهادة AR *</label><textarea className="admin-textarea" value={testimonialDraft?.contentAr || ''} onChange={event => setTestimonialDraft(current => ({ ...current, contentAr: event.target.value }))} /></div>
          <div className="admin-field"><label className="admin-label">Testimonial EN</label><textarea className="admin-textarea" value={testimonialDraft?.contentEn || ''} onChange={event => setTestimonialDraft(current => ({ ...current, contentEn: event.target.value }))} /></div>
          <div className="admin-field"><label className="admin-label">التقييم</label><input type="number" min="1" max="5" className="admin-input" value={testimonialDraft?.rating || 5} onChange={event => setTestimonialDraft(current => ({ ...current, rating: Number(event.target.value) }))} /></div>
        </div>
      </AdminModal>
    </div>
  );
}
