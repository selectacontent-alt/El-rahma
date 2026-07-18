'use client';

import { useEffect, useMemo, useState } from 'react';
import { 
  ArrowLeft, 
  Bot, 
  Check, 
  ChevronLeft, 
  CircleDot, 
  Code2, 
  DatabaseZap, 
  Globe2, 
  PencilLine, 
  ShoppingCart, 
  Sparkles, 
  Workflow,
  Calendar,
  CreditCard,
  Users,
  Sliders
} from 'lucide-react';
import type { Language } from '../types';
import { siteFetch } from '../lib/siteApi';
import { addPlanToCart } from '../lib/planCart';
import { DEFAULT_SOFTWARE_CUSTOM_PLAN_CONFIG, normalizeSoftwareCustomPlanConfig, type SoftwareCustomPlanConfig, type SoftwareCustomPlanOption } from '../lib/softwareCustomPlan';

interface CustomPlanPageProps {
  currentLang: Language;
  setActiveTab: (tab: string) => void;
}

const serviceMeta = {
  web: { ar: 'موقع شركة', en: 'Company website', icon: Globe2, accent: '#d64bb7' },
  commerce: { ar: 'متجر إلكتروني', en: 'Online store', icon: ShoppingCart, accent: '#f6b62d' },
  crm: { ar: 'CRM', en: 'CRM system', icon: DatabaseZap, accent: '#4a9cff' },
  ai: { ar: 'ذكاء اصطناعي', en: 'AI solution', icon: Bot, accent: '#9f74ff' },
  automation: { ar: 'أتمتة', en: 'Automation', icon: Workflow, accent: '#29c7a1' },
  growth: { ar: 'تطوير', en: 'Development', icon: Code2, accent: '#fb7b3a' },
} as const;

type ServiceId = keyof typeof serviceMeta;

function requestedService(): ServiceId {
  if (typeof window === 'undefined') return 'web';
  const raw = new URLSearchParams(window.location.search).get('service');
  return raw && raw in serviceMeta ? raw as ServiceId : 'web';
}

function requestedPackageTitle() {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get('title')?.trim().slice(0, 120) || '';
}

const getOptionIcon = (id: string) => {
  switch (id) {
    case 'pages': return Globe2;
    case 'store': return ShoppingCart;
    case 'dashboard': return Sliders;
    case 'booking': return Calendar;
    case 'payments': return CreditCard;
    case 'crm': return Users;
    case 'automation': return Workflow;
    case 'seo': return Sparkles;
    default: return Code2;
  }
};

export default function CustomPlanPage({ currentLang, setActiveTab }: CustomPlanPageProps) {
  const isAr = currentLang === 'ar';
  const [serviceId, setServiceId] = useState<ServiceId>('web');
  const [packageTitle, setPackageTitle] = useState('');
  const [config, setConfig] = useState<SoftwareCustomPlanConfig>(DEFAULT_SOFTWARE_CUSTOM_PLAN_CONFIG);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [brief, setBrief] = useState('');
  const [error, setError] = useState('');
  const service = serviceMeta[serviceId];
  const ServiceIcon = service.icon;
  const selectedOptions = useMemo(() => config.options.filter(option => selectedIds.includes(option.id)), [config.options, selectedIds]);

  useEffect(() => {
    setServiceId(requestedService());
    setPackageTitle(requestedPackageTitle());
    let active = true;
    siteFetch<SoftwareCustomPlanConfig>('/software-custom-plan').then(payload => {
      if (active && payload) setConfig(normalizeSoftwareCustomPlanConfig(payload));
    });
    return () => { active = false; };
  }, []);

  const toggleOption = (option: SoftwareCustomPlanOption) => {
    setSelectedIds(current => current.includes(option.id) ? current.filter(id => id !== option.id) : [...current, option.id]);
    setError('');
  };

  const continueToCart = () => {
    if (!selectedOptions.length && !brief.trim()) {
      setError(isAr ? 'اختر احتياجاً واحداً على الأقل أو اكتب فكرتك.' : 'Select at least one requirement or describe your idea.');
      return;
    }
    const serviceName = isAr ? service.ar : service.en;
    const requirements = selectedOptions.map(option => isAr ? option.labelAr : option.labelEn);
    addPlanToCart({
      section: 'software-custom',
      id: `${serviceId}-${[...selectedIds].sort().join('-') || 'brief'}`,
      title: packageTitle || (isAr ? `خطة مخصصة: ${serviceName}` : `Custom plan: ${serviceName}`),
      price: null,
      currency: 'EGP',
      description: brief.trim() || (isAr ? 'خطة مخصصة حسب احتياجات المشروع المختارة.' : 'A custom plan based on your selected project requirements.'),
      features: requirements,
      details: {
        customPlan: true,
        softwareCategory: serviceId,
        softwareCategoryLabel: serviceName,
        selectedOptionIds: selectedOptions.map(option => option.id),
        selectedRequirements: requirements,
        projectBrief: brief.trim(),
      },
    });
  };

  if (!config.enabled) {
    return (
      <section dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen px-4 pb-20 pt-32 text-slate-350">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-slate-800 bg-slate-900 p-8 text-center shadow-xl">
          <Sparkles className="mx-auto text-[#9d027c]" size={34} />
          <h1 className="mt-5 text-2xl font-black">{isAr ? 'الخطة المخصصة غير متاحة حالياً' : 'Custom plans are currently unavailable'}</h1>
          <button type="button" onClick={() => setActiveTab('software')} className="mt-7 rounded-2xl bg-[#9d027c] px-5 py-3 font-black text-white shadow-md hover:bg-[#850269] transition">
            {isAr ? 'العودة للخطط' : 'Back to plans'}
          </button>
        </div>
      </section>
    );
  }

  const optionButton = (option: SoftwareCustomPlanOption) => {
    const selected = selectedIds.includes(option.id);
    const IconComponent = getOptionIcon(option.id);
    
    return (
      <button
        key={option.id}
        type="button"
        aria-pressed={selected}
        onClick={() => toggleOption(option)}
        className={`group relative w-full p-5 rounded-3xl border text-start transition-all duration-305 focus:outline-none focus:ring-2 focus:ring-[#9d027c]/40 cursor-pointer select-none ${
          selected
            ? 'border-[#9d027c] bg-white shadow-[0_12px_30px_rgba(157,2,124,0.06)] scale-[1.01]'
            : 'border-slate-800 bg-slate-900 text-slate-300 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-850 hover:shadow-md'
        }`}
      >
        {selected && (
          <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top_right,rgba(157,2,124,0.04),transparent_50%)] pointer-events-none" />
        )}

        <div className="flex items-start gap-4">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition-all duration-300 ${
            selected 
              ? 'border-transparent bg-[#9d027c] text-white shadow-[0_4px_12px_rgba(157,2,124,0.25)]' 
              : 'border-slate-850 bg-slate-850 text-[#9d027c] group-hover:bg-purple-50 group-hover:text-[#9d027c]'
          }`}>
            <IconComponent size={20} className="transition-transform duration-300 group-hover:scale-110" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <strong className="block text-sm font-black leading-tight text-slate-200 transition-colors duration-300">
                {isAr ? option.labelAr : option.labelEn}
              </strong>
              
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                selected 
                  ? 'border-[#9d027c] bg-[#9d027c] text-white scale-100' 
                  : 'border-slate-800 bg-slate-900 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-95'
              }`}>
                <Check size={12} className="stroke-[3]" />
              </span>
            </div>
            <p className="mt-2 text-[11px] sm:text-xs font-medium leading-relaxed text-slate-400">
              {isAr ? option.descriptionAr : option.descriptionEn}
            </p>
          </div>
        </div>
      </button>
    );
  };

  const selectionPercentage = config.options.length > 0 
    ? Math.round((selectedIds.length / config.options.length) * 100) 
    : 0;

  return (
    <main dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen overflow-hidden pb-[max(5rem,calc(1.5rem+env(safe-area-inset-bottom)))] pt-[calc(6.25rem+env(safe-area-inset-top))] text-slate-300 sm:pt-28">
      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setActiveTab('software')}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs font-bold text-slate-300 transition hover:border-slate-700 hover:bg-slate-850/80 shadow-sm"
        >
          <ChevronLeft className={isAr ? '' : 'rotate-180'} size={16} />
          {isAr ? 'رجوع للخطط' : 'Back to plans'}
        </button>

        <section className="mt-6 rounded-[2rem] border border-slate-800 bg-slate-900/90 p-5 shadow-[0_20px_50px_rgba(157,2,124,0.04)] backdrop-blur-md sm:p-8 lg:p-10">
          <div className="flex flex-col gap-5 border-b border-slate-800 pb-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-[clamp(2rem,5vw,3.3rem)] font-black leading-[1.18] tracking-normal text-slate-200">
                {packageTitle || (isAr ? config.titleAr : config.titleEn)}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                {isAr ? config.leadAr : config.leadEn}
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-3.5 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ backgroundColor: `${service.accent}22`, color: service.accent }}>
                <ServiceIcon size={21} />
              </span>
              <span>
                <small className="block text-[10px] font-bold uppercase tracking-[.15em] text-slate-400">
                  {isAr ? 'نوع المشروع' : 'Project type'}
                </small>
                <strong className="mt-1 block text-sm text-slate-200">
                  {isAr ? service.ar : service.en}
                </strong>
              </span>
            </div>
          </div>

          <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px] xl:gap-9">
            <section className="min-w-0 rounded-[1.6rem] border border-slate-800 bg-slate-900/50 p-4 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-slate-200">
                    {isAr ? 'حدد مكونات النطاق المطلوب' : 'Define the required scope'}
                  </h2>
                </div>
                <span className="rounded-full border border-slate-800 bg-slate-850 px-3 py-1.5 text-xs font-bold text-slate-300">
                  {isAr ? `${selectedOptions.length} مختار` : `${selectedOptions.length} selected`}
                </span>
              </div>

              {/* Grid Layout of options */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {config.options.map(option => optionButton(option))}
              </div>
            </section>

            <aside className="rounded-[1.6rem] border border-slate-800 bg-slate-900 p-5 shadow-[0_15px_45px_rgba(0,0,0,0.04)] xl:sticky xl:top-28 xl:h-fit sm:p-6">
              <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                <div className="flex items-center justify-between gap-3 text-xs font-bold text-slate-300">
                  <span>{isAr ? 'تقدم بناء الخطة' : 'Plan building progress'}</span>
                  <span dir="ltr">{selectedIds.length} / {config.options.length}</span>
                </div>
                <div className="relative mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-850">
                  <div 
                    className="h-full bg-gradient-to-r from-[#9d027c] to-[#d64bb7] transition-all duration-500 ease-out"
                    style={{ width: `${selectionPercentage}%` }}
                  />
                </div>
              </div>

              {selectedOptions.length > 0 ? (
                <div className="mb-6">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {isAr ? 'الميزات المحددة' : 'Selected features'}
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-1">
                    {selectedOptions.map(option => (
                      <span 
                        key={option.id} 
                        className="inline-flex items-center gap-1.5 rounded-xl border border-purple-800/20 bg-purple-900/10 px-2.5 py-1 text-xs font-bold text-[#9d027c] animate-fade-in"
                      >
                        <Check size={11} className="stroke-[3]" />
                        {isAr ? option.labelAr : option.labelEn}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-6 py-4 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30">
                  <span className="text-xs text-slate-400 font-bold block">
                    {isAr ? 'لم يتم اختيار أي ميزات بعد' : 'No features selected yet'}
                  </span>
                </div>
              )}

              <h2 className="text-xl font-black text-slate-200">
                {isAr ? 'اكتب الهدف التجاري للمشروع' : 'Describe the business goal'}
              </h2>
              <p className="mt-2 text-xs leading-6 text-slate-350">
                {isAr ? 'اذكر الجمهور، رحلة العميل، الوظائف الأساسية، وأي مثال قريب من النتيجة التي تريدها.' : 'Share the audience, customer journey, core features, and any example close to the result you want.'}
              </p>
              <textarea
                value={brief}
                onChange={event => { setBrief(event.target.value); setError(''); }}
                rows={8}
                maxLength={3000}
                className="mt-5 w-full resize-y rounded-2xl border border-slate-800 bg-slate-850 px-4 py-3 text-sm leading-6 text-slate-200 outline-none transition placeholder:text-slate-450 focus:border-[#9d027c] focus:bg-slate-900 focus:ring-2 focus:ring-[#9d027c]/10"
                placeholder={isAr ? 'مثال: موقع عقارات به بحث متقدم، حسابات ملاك، وحجز معاينة...' : 'Example: a real-estate platform with advanced search, owner accounts, and viewing bookings...'}
              />
              <div className="mt-3 flex justify-between text-[11px] font-bold text-slate-400">
                <span>{brief.length}/3000</span>
                <span>{isAr ? 'اختياري مع وجود اختيارات' : 'Optional with selections'}</span>
              </div>
              {error && (
                <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700">
                  {error}
                </p>
              )}
              <button
                type="button"
                onClick={continueToCart}
                className="mt-5 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#9d027c] px-5 py-4 text-sm font-black text-white shadow-[0_12px_28px_rgba(157,2,124,0.25)] transition hover:-translate-y-0.5 hover:bg-[#850269] active:scale-[.98]"
              >
                <span>{isAr ? config.buttonAr : config.buttonEn}</span>
                <ArrowLeft className={isAr ? '' : 'rotate-180'} size={18} />
              </button>
              <p className="mt-3 text-center text-[11px] leading-5 text-slate-355">
                {isAr ? 'سيراجع الفريق احتياجاتك ويجهز لك عرضاً دقيقاً؛ لا يتم الدفع الآن.' : 'Our team will review your needs and prepare a precise quote; no payment is taken now.'}
              </p>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
