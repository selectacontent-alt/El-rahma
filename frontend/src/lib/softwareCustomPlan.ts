export interface SoftwareCustomPlanOption {
  id: string;
  labelAr: string;
  labelEn: string;
  descriptionAr: string;
  descriptionEn: string;
}

export interface SoftwareCustomPlanConfig {
  enabled: boolean;
  titleAr: string;
  titleEn: string;
  leadAr: string;
  leadEn: string;
  buttonAr: string;
  buttonEn: string;
  options: SoftwareCustomPlanOption[];
}

export const DEFAULT_SOFTWARE_CUSTOM_PLAN_CONFIG: SoftwareCustomPlanConfig = {
  enabled: true,
  titleAr: 'كوّن نطاق مشروعك الرقمي بوضوح',
  titleEn: 'Define your digital project scope clearly',
  leadAr: 'اختر المكونات التي يحتاجها المشروع الآن، ثم أضف ملاحظاتك لنراجعها كنطاق تنفيذ وتسعير مناسب.',
  leadEn: 'Choose the components your project needs now, then add context so we can review the scope and pricing properly.',
  buttonAr: 'ابدأ طلب الخطة',
  buttonEn: 'Start Plan Request',
  options: [
    { id: 'pages', labelAr: 'صفحات تعريفية', labelEn: 'Company pages', descriptionAr: 'صفحات خدمات وعروض ونماذج تواصل مصممة لتحويل الزيارات إلى طلبات.', descriptionEn: 'Service, offer, and contact pages designed to turn visits into requests.' },
    { id: 'store', labelAr: 'متجر إلكتروني', labelEn: 'Online store', descriptionAr: 'كتالوج، سلة، طلبات، وتهيئة لمسار شراء واضح.', descriptionEn: 'Catalog, cart, orders, and a clearer buying journey.' },
    { id: 'dashboard', labelAr: 'لوحة تحكم', labelEn: 'Admin dashboard', descriptionAr: 'إدارة محتوى وطلبات وتقارير من مكان واحد.', descriptionEn: 'Content, requests, and reporting managed from one place.' },
    { id: 'booking', labelAr: 'حجز ومواعيد', labelEn: 'Booking', descriptionAr: 'مواعيد، تنبيهات، ومتابعة حالة الطلب بدون فوضى.', descriptionEn: 'Appointments, reminders, and request status tracking without confusion.' },
    { id: 'payments', labelAr: 'دفع إلكتروني', labelEn: 'Online payments', descriptionAr: 'بوابات دفع وربط فواتير بطريقة آمنة ومناسبة لفريقك.', descriptionEn: 'Secure payment gateways and invoice links that fit your team.' },
    { id: 'crm', labelAr: 'CRM وعملاء', labelEn: 'CRM', descriptionAr: 'تجميع العملاء المحتملين وتنظيم مراحل المتابعة والبيع.', descriptionEn: 'Lead capture with organized follow-up and sales stages.' },
    { id: 'automation', labelAr: 'أتمتة وربط', labelEn: 'Automation', descriptionAr: 'ربط الأدوات وتقليل المهام المتكررة بين التسويق والتشغيل.', descriptionEn: 'Tool integrations that reduce repeated marketing and operations work.' },
    { id: 'seo', labelAr: 'SEO وتحليلات', labelEn: 'SEO and analytics', descriptionAr: 'تهيئة بحث وقياس زيارات وتحويلات من أول إطلاق.', descriptionEn: 'Search setup plus visit and conversion tracking from launch.' },
  ],
};

function text(value: unknown, fallback: string, maximum = 500) {
  return typeof value === 'string' && value.trim() ? value.trim().slice(0, maximum) : fallback;
}

export function normalizeSoftwareCustomPlanConfig(value: unknown): SoftwareCustomPlanConfig {
  const source = value && typeof value === 'object' ? value as Partial<SoftwareCustomPlanConfig> : {};
  const options: unknown[] = Array.isArray(source.options) ? source.options : DEFAULT_SOFTWARE_CUSTOM_PLAN_CONFIG.options;
  const normalizedOptions = options
    .filter((option): option is Partial<SoftwareCustomPlanOption> => !!option && typeof option === 'object')
    .map((option, index) => ({
      id: typeof option.id === 'string' && /^[a-z0-9-]{2,48}$/i.test(option.id) ? option.id : `option-${index + 1}`,
      labelAr: text(option.labelAr, '', 120),
      labelEn: text(option.labelEn, '', 120),
      descriptionAr: text(option.descriptionAr, '', 300),
      descriptionEn: text(option.descriptionEn, '', 300),
    }))
    .filter(option => option.labelAr && option.labelEn)
    .slice(0, 12);
  return {
    enabled: source.enabled !== false,
    titleAr: text(source.titleAr, DEFAULT_SOFTWARE_CUSTOM_PLAN_CONFIG.titleAr),
    titleEn: text(source.titleEn, DEFAULT_SOFTWARE_CUSTOM_PLAN_CONFIG.titleEn),
    leadAr: text(source.leadAr, DEFAULT_SOFTWARE_CUSTOM_PLAN_CONFIG.leadAr),
    leadEn: text(source.leadEn, DEFAULT_SOFTWARE_CUSTOM_PLAN_CONFIG.leadEn),
    buttonAr: text(source.buttonAr, DEFAULT_SOFTWARE_CUSTOM_PLAN_CONFIG.buttonAr, 120),
    buttonEn: text(source.buttonEn, DEFAULT_SOFTWARE_CUSTOM_PLAN_CONFIG.buttonEn, 120),
    options: normalizedOptions.length ? normalizedOptions : DEFAULT_SOFTWARE_CUSTOM_PLAN_CONFIG.options,
  };
}
