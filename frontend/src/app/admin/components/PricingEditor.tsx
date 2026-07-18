'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useAdminAuth, adminFetch } from '../lib/auth';
import { AdminModal, AdminTable, SectionHeader, Toggle } from './AdminUI';

type PricingSection = 'software' | 'social' | 'media';
type SoftwareCategory = 'web' | 'commerce' | 'crm' | 'ai' | 'automation' | 'growth';
type EditorStep = 'basics' | 'benefits' | 'publishing';

interface PricingPackage {
  id: number;
  section: PricingSection;
  softwareCategory?: SoftwareCategory | null;
  isCustomPlan: boolean;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  badgeAr?: string;
  badgeEn?: string;
  price: number;
  originalPrice?: number | null;
  currency: string;
  period: 'monthly' | 'yearly' | 'once';
  priceNoteAr?: string;
  priceNoteEn?: string;
  featuresAr: string;
  featuresEn: string;
  detailsAr?: string;
  detailsEn?: string;
  highlighted: boolean;
  ctaText?: string;
  ctaLink?: string;
  order: number;
  isActive: boolean;
}

const DEFAULT_PLAN_CTA = 'ابدأ طلب الخطة';

const sectionConfig: Record<PricingSection, { label: string; singular: string; hint: string; defaultCta: string }> = {
  software: {
    label: 'خطط البرمجيات',
    singular: 'خطة برمجية',
    hint: 'مواقع، متاجر، ومنصات رقمية. أضف فقط تفاصيل هذه الخطة.',
    defaultCta: DEFAULT_PLAN_CTA,
  },
  social: {
    label: 'خطط السوشيال',
    singular: 'خطة سوشيال',
    hint: 'خطط إدارة المحتوى والتصميم للسوشيال ميديا.',
    defaultCta: DEFAULT_PLAN_CTA,
  },
  media: {
    label: 'خطط الميديا',
    singular: 'خطة ميديا',
    hint: 'تصوير، إنتاج، وفيديوهات تسويقية منظمة.',
    defaultCta: DEFAULT_PLAN_CTA,
  },
};

const periodLabels: Record<PricingPackage['period'], string> = {
  monthly: 'شهري',
  yearly: 'سنوي',
  once: 'مرة واحدة',
};

const softwareCategoryLabels: Record<SoftwareCategory, string> = {
  web: 'موقع شركة',
  commerce: 'متجر',
  crm: 'CRM',
  ai: 'ذكاء اصطناعي',
  automation: 'أتمتة',
  growth: 'تطوير',
};

const blankPackage: Partial<PricingPackage> = {
  nameAr: '',
  nameEn: '',
  price: 0,
  originalPrice: null,
  softwareCategory: 'web',
  isCustomPlan: false,
  currency: 'EGP',
  period: 'monthly',
  featuresAr: '',
  featuresEn: '',
  highlighted: false,
  order: 0,
  isActive: true,
};

function parseFeatures(value?: string) {
  if (!value) return '';
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.join('\n') : value;
  } catch {
    return value;
  }
}

function listTextarea(value?: string | null) {
  return parseFeatures(value || '');
}

export default function PricingEditor({ fixedSection }: { fixedSection: PricingSection }) {
  const { token } = useAdminAuth();
  const [items, setItems] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState<EditorStep>('basics');
  const [editItem, setEditItem] = useState<Partial<PricingPackage>>(blankPackage);
  const config = sectionConfig[fixedSection];

  const loadItems = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await adminFetch(`/pricing?section=${fixedSection}`, token);
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadItems().catch(console.error);
  }, [fixedSection, token]);

  const visibleItems = useMemo(() => [...items].sort((a, b) => a.order - b.order), [items]);

  const openAdd = () => {
    setEditItem({ ...blankPackage, section: fixedSection, softwareCategory: fixedSection === 'software' ? 'web' : null, isCustomPlan: false, ctaText: config.defaultCta, ctaLink: '/checkout' });
    setStep('basics');
    setModalOpen(true);
  };

  const openEdit = (item: PricingPackage) => {
    setEditItem(item);
    setStep('basics');
    setModalOpen(true);
  };

  const saveItem = async () => {
    if (!editItem.nameAr?.trim() || !editItem.nameEn?.trim()) {
      alert('اسم الخطة بالعربي والإنجليزي مطلوب');
      setStep('basics');
      return;
    }
    if (!listTextarea(editItem.featuresAr).trim() || !listTextarea(editItem.featuresEn).trim()) {
      alert('أضف ميزة واحدة على الأقل بالعربي والإنجليزي. اكتب كل ميزة في سطر منفصل.');
      setStep('benefits');
      return;
    }
    const discountedPrice = Number(editItem.price || 0);
    const originalPrice = editItem.originalPrice == null
      ? null
      : Number(editItem.originalPrice);
    if (originalPrice !== null && originalPrice < discountedPrice) {
      alert('السعر قبل الخصم يجب أن يكون أكبر من أو مساويًا للسعر بعد الخصم.');
      setStep('basics');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...editItem,
        section: fixedSection,
        softwareCategory: fixedSection === 'software' ? (editItem.softwareCategory || 'web') : null,
        isCustomPlan: fixedSection === 'software' && !!editItem.isCustomPlan,
        ctaLink: fixedSection === 'software' && editItem.isCustomPlan ? '/custom-plan' : '/checkout',
        price: discountedPrice,
        originalPrice,
        order: Number(editItem.order || 0),
        featuresAr: parseFeatures(editItem.featuresAr),
        featuresEn: parseFeatures(editItem.featuresEn),
        detailsAr: editItem.detailsAr ? parseFeatures(editItem.detailsAr) : null,
        detailsEn: editItem.detailsEn ? parseFeatures(editItem.detailsEn) : null,
      };
      if (editItem.id) {
        await adminFetch(`/pricing/${editItem.id}`, token, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await adminFetch('/pricing', token, { method: 'POST', body: JSON.stringify(payload) });
      }
      setModalOpen(false);
      await loadItems();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (item: PricingPackage) => {
    await adminFetch(`/pricing/${item.id}`, token, { method: 'DELETE' });
    await loadItems();
  };

  const columns = [
    { key: 'order', label: 'الترتيب' },
    { key: 'nameAr', label: `اسم ${config.singular}` },
    ...(fixedSection === 'software' ? [{ key: 'softwareCategory', label: 'القسم البرمجي', render: (item: PricingPackage) => item.softwareCategory ? softwareCategoryLabels[item.softwareCategory] : 'موقع شركة' }, { key: 'isCustomPlan', label: 'خطة مخصصة', render: (item: PricingPackage) => item.isCustomPlan ? 'نعم' : '-' }] : []),
    { key: 'originalPrice', label: 'قبل الخصم', render: (item: PricingPackage) => item.originalPrice != null ? `${item.originalPrice.toLocaleString()} ${item.currency}` : '—' },
    { key: 'price', label: 'بعد الخصم', render: (item: PricingPackage) => `${item.price.toLocaleString()} ${item.currency}` },
    { key: 'period', label: 'الفترة', render: (item: PricingPackage) => periodLabels[item.period] || item.period },
    { key: 'highlighted', label: 'مميزة', render: (item: PricingPackage) => item.highlighted ? 'نعم' : '-' },
    { key: 'isActive', label: 'الحالة', render: (item: PricingPackage) => item.isActive ? 'نشطة' : 'مخفية' },
  ];

  const steps: { id: EditorStep; label: string; description: string }[] = [
    { id: 'basics', label: '١. الأساسيات', description: 'الاسم والسعر والوصف' },
    { id: 'benefits', label: '٢. المزايا', description: 'ما يحصل عليه العميل' },
    { id: 'publishing', label: '٣. النشر', description: 'الظهور وزر الطلب' },
  ];

  return (
    <div className="admin-card admin-card--table-page pricing-workspace">
      <SectionHeader
        title={config.label}
        description={config.hint}
        action={<button className="admin-btn admin-btn--primary" onClick={openAdd}>+ إضافة {config.singular}</button>}
      />

      <div className="pricing-workspace-note">
        <strong>{visibleItems.length.toLocaleString('ar-EG')} خطة في هذا القسم</strong>
        <span>لن تظهر هنا أي بيانات تخص الأقسام الأخرى.</span>
      </div>
      <AdminTable columns={columns} data={visibleItems} loading={loading} onEdit={openEdit} onDelete={deleteItem} />

      <AdminModal title={editItem.id ? `تعديل ${config.singular}` : `إضافة ${config.singular} جديدة`} open={modalOpen} onClose={() => setModalOpen(false)} onSave={saveItem} saving={saving}>
        <div className="pricing-editor">
          <div className="pricing-editor-intro">
            <span>{config.label}</span>
            <p>أكمل الخطوات بالترتيب؛ ستُحفظ جميع التفاصيل داخل هذا القسم فقط.</p>
          </div>
          <div className="pricing-editor-steps" role="tablist" aria-label="خطوات إعداد الخطة">
            {steps.map((item) => (
              <button key={item.id} type="button" role="tab" aria-selected={step === item.id} className={`pricing-editor-step ${step === item.id ? 'pricing-editor-step--active' : ''}`} onClick={() => setStep(item.id)}>
                <strong>{item.label}</strong>
                <small>{item.description}</small>
              </button>
            ))}
          </div>

          {step === 'basics' && (
            <div className="admin-form-grid pricing-editor-panel">
              <div className="admin-form-section-title"><strong>تعريف {config.singular}</strong><span>الحقول الأساسية التي تظهر للعميل أولًا.</span></div>
              <div className="admin-grid-2">
                <div className="admin-field"><label className="admin-label">الاسم بالعربي *</label><input className="admin-input" placeholder={fixedSection === 'software' ? 'مثال: موقع أعمال احترافي' : fixedSection === 'social' ? 'مثال: خطة نمو شهرية' : 'مثال: خطة تصوير وإنتاج'} value={editItem.nameAr || ''} onChange={event => setEditItem({ ...editItem, nameAr: event.target.value })} /></div>
                <div className="admin-field"><label className="admin-label">الاسم بالإنجليزي *</label><input className="admin-input" dir="ltr" value={editItem.nameEn || ''} onChange={event => setEditItem({ ...editItem, nameEn: event.target.value })} /></div>
              </div>
              {fixedSection === 'software' && (
                <div className="admin-field"><label className="admin-label">القسم البرمجي *</label><select className="admin-select" value={editItem.softwareCategory || 'web'} onChange={event => setEditItem({ ...editItem, softwareCategory: event.target.value as SoftwareCategory })}>{(Object.entries(softwareCategoryLabels) as Array<[SoftwareCategory, string]>).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><small className="admin-field-hint">تظهر الخطة داخل التبويب الذي تختاره في صفحة البرمجيات.</small></div>
              )}
              <div className="admin-grid-2">
                <div className="admin-field"><label className="admin-label">السعر قبل الخصم</label><input type="number" min="0" className="admin-input" value={editItem.originalPrice ?? ''} onChange={event => setEditItem({ ...editItem, originalPrice: event.target.value === '' ? null : Number(event.target.value) })} /></div>
                <div className="admin-field"><label className="admin-label">السعر بعد الخصم</label><input type="number" min="0" className="admin-input" value={editItem.price || 0} onChange={event => setEditItem({ ...editItem, price: Number(event.target.value) })} /></div>
              </div>
              <div className="admin-grid-2">
                <div className="admin-field"><label className="admin-label">العملة</label><input className="admin-input" value={editItem.currency || 'EGP'} onChange={event => setEditItem({ ...editItem, currency: event.target.value })} /></div>
                <div className="admin-field"><label className="admin-label">الفترة</label><select className="admin-select" value={editItem.period || 'monthly'} onChange={event => setEditItem({ ...editItem, period: event.target.value as PricingPackage['period'] })}><option value="monthly">شهري</option><option value="yearly">سنوي</option><option value="once">مرة واحدة</option></select></div>
              </div>
              <div className="admin-grid-2">
                <div className="admin-field"><label className="admin-label">وصف مختصر بالعربي</label><textarea className="admin-textarea" value={editItem.descriptionAr || ''} onChange={event => setEditItem({ ...editItem, descriptionAr: event.target.value })} /></div>
                <div className="admin-field"><label className="admin-label">وصف مختصر بالإنجليزي</label><textarea className="admin-textarea" dir="ltr" value={editItem.descriptionEn || ''} onChange={event => setEditItem({ ...editItem, descriptionEn: event.target.value })} /></div>
              </div>
            </div>
          )}

          {step === 'benefits' && (
            <div className="admin-form-grid pricing-editor-panel">
              <div className="admin-form-section-title"><strong>ماذا تشمل الخطة؟</strong><span>كل سطر سيتحول إلى نقطة مستقلة في واجهة الموقع.</span></div>
              <div className="admin-grid-2">
                <div className="admin-field"><label className="admin-label">المزايا بالعربي *</label><textarea className="admin-textarea pricing-list-input" placeholder={'ميزة أولى\nميزة ثانية\nميزة ثالثة'} value={listTextarea(editItem.featuresAr)} onChange={event => setEditItem({ ...editItem, featuresAr: event.target.value })} /></div>
                <div className="admin-field"><label className="admin-label">المزايا بالإنجليزي *</label><textarea className="admin-textarea pricing-list-input" dir="ltr" placeholder={'First benefit\nSecond benefit\nThird benefit'} value={listTextarea(editItem.featuresEn)} onChange={event => setEditItem({ ...editItem, featuresEn: event.target.value })} /></div>
              </div>
              <div className="admin-grid-2">
                <div className="admin-field"><label className="admin-label">تفاصيل إضافية بالعربي <span>اختياري</span></label><textarea className="admin-textarea pricing-list-input" value={listTextarea(editItem.detailsAr)} onChange={event => setEditItem({ ...editItem, detailsAr: event.target.value })} /></div>
                <div className="admin-field"><label className="admin-label">تفاصيل إضافية بالإنجليزي <span>اختياري</span></label><textarea className="admin-textarea pricing-list-input" dir="ltr" value={listTextarea(editItem.detailsEn)} onChange={event => setEditItem({ ...editItem, detailsEn: event.target.value })} /></div>
              </div>
            </div>
          )}

          {step === 'publishing' && (
            <div className="admin-form-grid pricing-editor-panel">
              <div className="admin-form-section-title"><strong>إعدادات الظهور والنشر</strong><span>هذه الحقول اختيارية، باستثناء حالة النشر.</span></div>
              <div className="admin-grid-2">
                <div className="admin-field"><label className="admin-label">شارة بالعربي</label><input className="admin-input" placeholder="مثال: الأكثر طلبًا" value={editItem.badgeAr || ''} onChange={event => setEditItem({ ...editItem, badgeAr: event.target.value })} /></div>
                <div className="admin-field"><label className="admin-label">شارة بالإنجليزي</label><input className="admin-input" dir="ltr" value={editItem.badgeEn || ''} onChange={event => setEditItem({ ...editItem, badgeEn: event.target.value })} /></div>
              </div>
              <div className="admin-grid-2">
                <div className="admin-field"><label className="admin-label">ملاحظة السعر بالعربي</label><input className="admin-input" placeholder="مثال: لا يشمل ميزانية الإعلانات" value={editItem.priceNoteAr || ''} onChange={event => setEditItem({ ...editItem, priceNoteAr: event.target.value })} /></div>
                <div className="admin-field"><label className="admin-label">ملاحظة السعر بالإنجليزي</label><input className="admin-input" dir="ltr" value={editItem.priceNoteEn || ''} onChange={event => setEditItem({ ...editItem, priceNoteEn: event.target.value })} /></div>
              </div>
              <div className="admin-grid-2">
                <div className="admin-field"><label className="admin-label">نص زر الطلب</label><input className="admin-input" value={editItem.ctaText || ''} onChange={event => setEditItem({ ...editItem, ctaText: event.target.value })} /></div>
                <div className="admin-field"><label className="admin-label">رابط زر الطلب</label><div className="admin-input flex items-center bg-slate-50 text-slate-600" dir="ltr">{fixedSection === 'software' && editItem.isCustomPlan ? '/custom-plan' : '/checkout'}</div><small className="admin-field-hint">الخطة العادية تدخل ضمن طلب العميل، أما الخطة المخصصة فتفتح صفحة بناء الخطة.</small></div>
              </div>
              {fixedSection === 'software' && <Toggle checked={!!editItem.isCustomPlan} onChange={value => setEditItem({ ...editItem, isCustomPlan: value, ctaText: value ? 'ابدأ بناء الخطة' : (editItem.ctaText || config.defaultCta) })} label="خطة مخصصة: تفتح صفحة بناء الخطة بدلاً من إضافتها مباشرة للطلب" />}
              <div className="admin-grid-3 pricing-editor-publish-controls">
                <div className="admin-field"><label className="admin-label">ترتيب الظهور</label><input type="number" min="0" className="admin-input" value={editItem.order || 0} onChange={event => setEditItem({ ...editItem, order: Number(event.target.value) })} /></div>
                <Toggle checked={!!editItem.highlighted} onChange={value => setEditItem({ ...editItem, highlighted: value })} label="خطة مميزة" />
                <Toggle checked={!!editItem.isActive} onChange={value => setEditItem({ ...editItem, isActive: value })} label="منشورة الآن" />
              </div>
            </div>
          )}
        </div>
      </AdminModal>
    </div>
  );
}
