'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import {
  Plus,
  Trash2,
  Settings,
  ListTodo,
  Languages,
  Monitor,
  Smartphone,
  Check,
  Sparkles,
  CircleDot,
  Layers3,
  Eye,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Save,
  HelpCircle,
  Undo,
  ArrowRight,
  Code2,
  FileCode,
  Sliders,
  Sparkle
} from 'lucide-react';
import { useAdminAuth, adminFetch } from '../lib/auth';
import { SectionHeader, Toggle } from './AdminUI';
import {
  DEFAULT_SOFTWARE_CUSTOM_PLAN_CONFIG,
  normalizeSoftwareCustomPlanConfig,
  type SoftwareCustomPlanConfig,
  type SoftwareCustomPlanOption
} from '../../../lib/softwareCustomPlan';

function copyConfig(config: SoftwareCustomPlanConfig): SoftwareCustomPlanConfig {
  return { ...config, options: config.options.map(option => ({ ...option })) };
}

// Position options mathematically in a circle
function getPointPosition(index: number, total: number) {
  const angle = (Math.PI * 2 * index / Math.max(total, 1)) - Math.PI / 2;
  return {
    left: `${50 + Math.cos(angle) * 38}%`,
    top: `${50 + Math.sin(angle) * 38}%`,
    angle
  };
}

export default function SoftwareCustomPlanSettings() {
  const { token } = useAdminAuth();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [config, setConfig] = useState<SoftwareCustomPlanConfig>(() => copyConfig(DEFAULT_SOFTWARE_CUSTOM_PLAN_CONFIG));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // UI state
  const [activeTab, setActiveTab] = useState<'general' | 'options'>('general');
  const [previewLang, setPreviewLang] = useState<'ar' | 'en'>('ar');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [expandedOptionIndex, setExpandedOptionIndex] = useState<number | null>(0);
  const [selectedPreviewIds, setSelectedPreviewIds] = useState<string[]>(['pages', 'store']);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!token) return;
    adminFetch('/settings', token)
      .then((data: Record<string, string>) => {
        setSettings(data);
        try {
          setConfig(copyConfig(normalizeSoftwareCustomPlanConfig(data.software_custom_plan_config ? JSON.parse(data.software_custom_plan_config) : undefined)));
        } catch {
          setConfig(copyConfig(DEFAULT_SOFTWARE_CUSTOM_PLAN_CONFIG));
        }
      })
      .catch(error => alert(error.message))
      .finally(() => setLoading(false));
  }, [token]);

  // Track if values are modified from DB
  const isDirty = useMemo(() => {
    const dbValue = settings.software_custom_plan_config;
    if (!dbValue) return true;
    try {
      return JSON.stringify(config) !== JSON.stringify(JSON.parse(dbValue));
    } catch {
      return true;
    }
  }, [config, settings]);

  const validateOption = (option: SoftwareCustomPlanOption, index: number) => {
    const errors: Record<string, string> = { ...validationErrors };
    const idKey = `option-${index}-id`;
    const labelArKey = `option-${index}-labelAr`;
    const labelEnKey = `option-${index}-labelEn`;

    if (!/^[a-z0-9-]{2,48}$/.test(option.id)) {
      errors[idKey] = 'يجب أن يتكون المعرف من 2-48 حرف إنجليزي صغير أو أرقام أو شرطة (-) فقط.';
    } else {
      delete errors[idKey];
    }

    if (!option.labelAr.trim()) {
      errors[labelArKey] = 'الاسم بالعربية مطلوب.';
    } else {
      delete errors[labelArKey];
    }

    if (!option.labelEn.trim()) {
      errors[labelEnKey] = 'Name in English is required.';
    } else {
      delete errors[labelEnKey];
    }

    setValidationErrors(errors);
  };

  const updateOption = (index: number, field: keyof SoftwareCustomPlanOption, value: string) => {
    const updatedOptions = config.options.map((option, optionIndex) => {
      if (optionIndex === index) {
        const nextOption = { ...option, [field]: value };
        // Perform real-time validation
        validateOption(nextOption, index);
        return nextOption;
      }
      return option;
    });
    setConfig(current => ({ ...current, options: updatedOptions }));
  };

  const addOption = () => {
    if (config.options.length >= 12) return;
    const nextNumber = config.options.length + 1;
    const newOpt = {
      id: `option-${nextNumber}`,
      labelAr: `احتياج جديد ${nextNumber}`,
      labelEn: `New Requirement ${nextNumber}`,
      descriptionAr: 'وصف قصير للاحتياج يوضح للعميل فائدة هذا الخيار.',
      descriptionEn: 'Short description clarifying the benefit of this option.'
    };
    setConfig(current => ({
      ...current,
      options: [...current.options, newOpt],
    }));
    setExpandedOptionIndex(config.options.length); // Expand the newly added option
  };

  const removeOption = (index: number) => {
    if (config.options.length <= 1) return;
    const updated = config.options.filter((_, optionIndex) => optionIndex !== index);
    setConfig(current => ({ ...current, options: updated }));

    // Adjust expanded index if necessary
    if (expandedOptionIndex === index) {
      setExpandedOptionIndex(null);
    } else if (expandedOptionIndex !== null && expandedOptionIndex > index) {
      setExpandedOptionIndex(expandedOptionIndex - 1);
    }

    // Clean up validation errors for deleted index
    const errors = { ...validationErrors };
    delete errors[`option-${index}-id`];
    delete errors[`option-${index}-labelAr`];
    delete errors[`option-${index}-labelEn`];
    setValidationErrors(errors);
  };

  const resetToDefault = () => {
    if (confirm('هل أنت متأكد من رغبتك في إعادة ضبط الإعدادات إلى الوضع الافتراضي للموقع؟')) {
      setConfig(copyConfig(DEFAULT_SOFTWARE_CUSTOM_PLAN_CONFIG));
      setExpandedOptionIndex(0);
      setValidationErrors({});
    }
  };

  const togglePreviewOption = (id: string) => {
    setSelectedPreviewIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const save = async () => {
    const cleanedOptions = config.options.map(option => ({
      id: option.id.trim().toLowerCase(),
      labelAr: option.labelAr.trim(),
      labelEn: option.labelEn.trim(),
      descriptionAr: option.descriptionAr.trim(),
      descriptionEn: option.descriptionEn.trim(),
    }));

    if (!cleanedOptions.length || cleanedOptions.length > 12) {
      alert('أضف من خيار واحد إلى 12 خياراً للخطة المخصصة.');
      return;
    }

    if (cleanedOptions.some(option => !/^[a-z0-9-]{2,48}$/.test(option.id) || !option.labelAr || !option.labelEn)) {
      alert('الرجاء التأكد من صحة معرفات الخيارات وملء الحقول المطلوبة (الاسم بالعربية والإنجليزية).');
      return;
    }

    if (new Set(cleanedOptions.map(option => option.id)).size !== cleanedOptions.length) {
      alert('معرفات الخيارات يجب أن تكون فريدة ومختلفة عن بعضها البعض.');
      return;
    }

    setSaving(true);
    try {
      const nextConfig = { ...config, options: cleanedOptions };
      await adminFetch('/settings', token, {
        method: 'PUT',
        body: JSON.stringify({ ...settings, software_custom_plan_config: JSON.stringify(nextConfig) }),
      });
      setConfig(nextConfig);
      setSettings(current => ({ ...current, software_custom_plan_config: JSON.stringify(nextConfig) }));
    } catch (error: any) {
      alert(error.message || 'تعذر حفظ إعدادات الخطة المخصصة.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center rounded-[24px] border border-purple-100/50 bg-white shadow-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-100 border-t-purple-600" />
          <span className="text-sm font-semibold text-slate-500">جاري تحميل إعدادات الخطة...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 font-sans">

      {/* Redesigned Premium Header Banner */}
      <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-slate-900 via-[#1e0a24] to-[#12082b] p-6 shadow-md border border-white/5">
        {/* Glow effect */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#9d027c]/15 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#9d027c]/20 border border-[#9d027c]/30 px-3 py-1 text-xs font-bold text-[#f59ce3]">
              <Sparkles size={12} className="text-[#ffbc01]" />
              <span>مخطط البرمجيات المخصص</span>
            </div>
            <h2 className="mt-3 text-2xl font-extrabold text-white tracking-tight">تخصيص دائرة احتياجات العميل</h2>
            <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
              قم بتهيئة الخيارات الدائرية التفاعلية التي تظهر لعملائك لتركيب وبناء نظامهم البرمجي. يتم إرسال طلباتهم مباشرة إلى لوحة تحكم المبيعات.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              type="button"
              className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-xs font-bold text-slate-200 transition hover:bg-white/10 hover:text-white active:scale-95"
              onClick={resetToDefault}
            >
              <Undo size={14} />
              ضبط الافتراضي
            </button>

            <button
              type="button"
              className={`inline-flex min-h-[42px] items-center gap-2 rounded-xl px-5 text-xs font-bold text-white transition active:scale-95 ${isDirty
                  ? 'bg-gradient-to-r from-[#9d027c] to-purple-600 hover:brightness-110 shadow-lg shadow-purple-950/20'
                  : 'bg-white/10 text-slate-400 cursor-not-allowed border border-white/5'
                }`}
              onClick={save}
              disabled={saving || !isDirty}
            >
              {saving ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save size={14} />
                  حفظ التغييرات
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid gap-6 lg:grid-cols-12">

        {/* RIGHT COLUMN: Settings Form Controls (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col gap-6">

          {/* Card Wrapper with Premium Styling */}
          <div className="rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-sm md:p-6">

            {/* Tab buttons */}
            <div className="flex gap-2 border-b border-slate-100 pb-4 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('general')}
                className={`relative flex items-center gap-2 px-4 py-3 text-xs font-bold rounded-xl transition-all duration-200 ${activeTab === 'general'
                    ? 'bg-purple-50 text-purple-700 font-extrabold border border-purple-100/50 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
              >
                <Settings size={14} />
                الإعدادات العامة
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('options')}
                className={`relative flex items-center gap-2 px-4 py-3 text-xs font-bold rounded-xl transition-all duration-200 ${activeTab === 'options'
                    ? 'bg-purple-50 text-purple-700 font-extrabold border border-purple-100/50 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
              >
                <ListTodo size={14} />
                خيارات الدائرة
                <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-extrabold ${config.options.length >= 12 ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                  {config.options.length}
                </span>
              </button>
            </div>

            {/* TAB CONTENT: General Config */}
            {activeTab === 'general' && (
              <div className="flex flex-col gap-6">

                {/* Custom Status Card with Toggle */}
                <div className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 ${config.enabled
                    ? 'bg-emerald-50/20 border-emerald-100 text-emerald-800'
                    : 'bg-slate-50 border-slate-200/80 text-slate-500'
                  }`}>
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                      {config.enabled && (
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      )}
                      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${config.enabled ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                    </span>
                    <div>
                      <strong className="block text-sm font-extrabold text-slate-800">تفعيل الخطة المخصصة</strong>
                      <span className="text-xs text-slate-500">
                        {config.enabled ? 'قسم الدائرة المخصصة يظهر حالياً للعملاء في صفحة البرمجيات.' : 'القسم مخفي بالكامل في الموقع العام.'}
                      </span>
                    </div>
                  </div>
                  <Toggle checked={config.enabled} onChange={value => setConfig(current => ({ ...current, enabled: value }))} />
                </div>

                <div className="flex flex-col gap-5">
                  {/* Grid 2: Arabic and English Titles */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>العنوان الرئيسي (عربي)</span>
                        <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">AR</span>
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/10 hover:border-slate-300"
                        value={config.titleAr}
                        onChange={event => setConfig(current => ({ ...current, titleAr: event.target.value }))}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>Title in English</span>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">EN</span>
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/10 hover:border-slate-300"
                        dir="ltr"
                        value={config.titleEn}
                        onChange={event => setConfig(current => ({ ...current, titleEn: event.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Grid 2: Arabic and English Leads */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>وصف الدائرة (عربي)</span>
                        <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">AR</span>
                      </label>
                      <textarea
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/10 hover:border-slate-300 resize-none"
                        rows={3}
                        value={config.leadAr}
                        onChange={event => setConfig(current => ({ ...current, leadAr: event.target.value }))}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>Description in English</span>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">EN</span>
                      </label>
                      <textarea
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/10 hover:border-slate-300 resize-none"
                        rows={3}
                        dir="ltr"
                        value={config.leadEn}
                        onChange={event => setConfig(current => ({ ...current, leadEn: event.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Grid 2: Button Texts */}
                  <div className="grid gap-4 md:grid-cols-2 border-t border-slate-100 pt-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>نص زر الطلب (عربي)</span>
                        <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">AR</span>
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/10 hover:border-slate-300"
                        value={config.buttonAr}
                        onChange={event => setConfig(current => ({ ...current, buttonAr: event.target.value }))}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>Cart Button Text (English)</span>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">EN</span>
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/10 hover:border-slate-300"
                        dir="ltr"
                        value={config.buttonEn}
                        onChange={event => setConfig(current => ({ ...current, buttonEn: event.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                {/* Helpful Tip Card */}
                <div className="flex gap-3 rounded-2xl bg-amber-50/40 border border-amber-100 p-4 text-xs text-amber-800 leading-relaxed">
                  <AlertCircle size={18} className="flex-shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <strong className="block text-sm font-bold text-amber-900">💡 ملحوظة للتصميم</strong>
                    <p className="mt-1 text-slate-600 leading-normal">
                      تظهر هذه النصوص للعملاء لتشجيعهم على تركيب طلبهم. ننصح بأن تكون صياغة العناوين مختصرة وقوية، والالتزام بـ 8 إلى 12 خياراً لضمان تناسب دائرة الاحتياجات مع جميع أحجام الشاشات.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Options List */}
            {activeTab === 'options' && (
              <div className="flex flex-col gap-5">

                {/* Options Header Summary Card */}
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">خيارات متطلبات المشروع</h3>
                    <p className="mt-1 text-xs text-slate-500">
                      قم بإضافة المتطلبات الفرعية للمشاريع (مثل: متجر، دفع إلكتروني، حجز ومواعيد).
                    </p>
                  </div>

                  <button
                    type="button"
                    className="flex min-h-[38px] items-center gap-1.5 rounded-xl bg-purple-50 px-3.5 text-xs font-bold text-purple-700 border border-purple-100 hover:bg-purple-100 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={addOption}
                    disabled={config.options.length >= 12}
                  >
                    <Plus size={14} />
                    إضافة احتياج
                  </button>
                </div>

                {/* Progress Bar of Options Limit */}
                <div className="px-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1.5">
                    <span>الحد الأقصى للخيارات</span>
                    <span className={config.options.length >= 12 ? 'text-rose-600' : 'text-purple-600'}>
                      {config.options.length} من أصل 12 خياراً
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${config.options.length >= 12 ? 'bg-amber-500' : 'bg-purple-600'
                        }`}
                      style={{ width: `${(config.options.length / 12) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Vertical Option Accordion Cards */}
                <div className="flex flex-col gap-3 mt-2">
                  {config.options.map((option, index) => {
                    const isExpanded = expandedOptionIndex === index;
                    const hasErrors = Object.keys(validationErrors).some(key => key.startsWith(`option-${index}-`));

                    return (
                      <article
                        key={`${option.id}-${index}`}
                        className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isExpanded
                            ? 'border-purple-200 shadow-md bg-white shadow-purple-50/20'
                            : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50/70'
                          } ${hasErrors ? 'border-rose-300 ring-1 ring-rose-200' : ''}`}
                      >
                        {/* Option Card Header */}
                        <div
                          className="flex items-center justify-between gap-4 p-4 cursor-pointer select-none"
                          onClick={() => setExpandedOptionIndex(isExpanded ? null : index)}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${isExpanded ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-600'
                              }`}>
                              {index + 1}
                            </span>
                            <div className="min-w-0">
                              <strong className="block text-xs font-extrabold text-slate-800 truncate">
                                {option.labelAr || <span className="text-slate-400 italic">بدون اسم عربي</span>}
                              </strong>
                              <span className="block mt-0.5 text-[10px] text-slate-400 font-mono truncate">
                                ID: {option.id || 'none'}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {hasErrors && (
                              <span className="flex h-5 items-center gap-1 rounded bg-rose-50 px-1.5 text-[9px] font-bold text-rose-600">
                                <AlertCircle size={10} />
                                تنبيه
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (config.options.length <= 1) {
                                  alert('يجب أن تحتوي الخطة على خيار واحد على الأقل.');
                                  return;
                                }
                                if (confirm(`هل ترغب في حذف احتياج "${option.labelAr || option.id}"؟`)) {
                                  removeOption(index);
                                }
                              }}
                              className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              disabled={config.options.length <= 1}
                              aria-label="حذف الاحتياج"
                            >
                              <Trash2 size={14} />
                            </button>

                            <span className="text-slate-400">
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </span>
                          </div>
                        </div>

                        {/* Option Card Body */}
                        {isExpanded && (
                          <div className="border-t border-slate-100 bg-white p-4 sm:p-5 flex flex-col gap-4">

                            {/* Inputs Grid */}
                            <div className="grid gap-4 sm:grid-cols-3">
                              {/* Option ID */}
                              <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-600 flex items-center justify-between">
                                  <span>المعرف الفريد (ID)</span>
                                  <span className="font-mono text-[9px] text-slate-400">Unique ID</span>
                                </label>
                                <input
                                  type="text"
                                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/10"
                                  dir="ltr"
                                  placeholder="online-store"
                                  value={option.id}
                                  onChange={event => updateOption(index, 'id', event.target.value)}
                                />
                                {validationErrors[`option-${index}-id`] && (
                                  <span className="text-[10px] text-rose-600 font-bold leading-normal mt-1">
                                    {validationErrors[`option-${index}-id`]}
                                  </span>
                                )}
                              </div>

                              {/* Label Ar */}
                              <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-600 flex items-center justify-between">
                                  <span>الاسم بالعربية</span>
                                  <span className="text-[10px] text-purple-600 bg-purple-50 px-1 py-0.5 rounded">عربي</span>
                                </label>
                                <input
                                  type="text"
                                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/10"
                                  placeholder="متجر إلكتروني"
                                  value={option.labelAr}
                                  onChange={event => updateOption(index, 'labelAr', event.target.value)}
                                />
                                {validationErrors[`option-${index}-labelAr`] && (
                                  <span className="text-[10px] text-rose-600 font-bold mt-1">
                                    {validationErrors[`option-${index}-labelAr`]}
                                  </span>
                                )}
                              </div>

                              {/* Label En */}
                              <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-600 flex items-center justify-between">
                                  <span>Name in English</span>
                                  <span className="text-[10px] text-blue-600 bg-blue-50 px-1 py-0.5 rounded">EN</span>
                                </label>
                                <input
                                  type="text"
                                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/10"
                                  dir="ltr"
                                  placeholder="Online Store"
                                  value={option.labelEn}
                                  onChange={event => updateOption(index, 'labelEn', event.target.value)}
                                />
                                {validationErrors[`option-${index}-labelEn`] && (
                                  <span className="text-[10px] text-rose-600 font-bold mt-1">
                                    {validationErrors[`option-${index}-labelEn`]}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Descriptions Grid */}
                            <div className="grid gap-4 sm:grid-cols-2">
                              {/* Description Ar */}
                              <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-600 flex items-center justify-between">
                                  <span>الوصف المختصر (عربي)</span>
                                  <span className="text-[10px] text-purple-600 bg-purple-50 px-1 py-0.5 rounded">عربي</span>
                                </label>
                                <input
                                  type="text"
                                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/10"
                                  placeholder="صفحة منتجات وسلة شراء ودفع متكامل"
                                  value={option.descriptionAr}
                                  onChange={event => updateOption(index, 'descriptionAr', event.target.value)}
                                />
                              </div>

                              {/* Description En */}
                              <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-600 flex items-center justify-between">
                                  <span>Description in English</span>
                                  <span className="text-[10px] text-blue-600 bg-blue-50 px-1 py-0.5 rounded">EN</span>
                                </label>
                                <input
                                  type="text"
                                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs transition focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/10"
                                  dir="ltr"
                                  placeholder="Product showcase, shopping cart, and payment checkout"
                                  value={option.descriptionEn}
                                  onChange={event => updateOption(index, 'descriptionEn', event.target.value)}
                                />
                              </div>
                            </div>

                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>

              </div>
            )}

          </div>
        </div>

        {/* LEFT COLUMN: Sticky Interactive Device Mockups (5 Columns) */}
        <div className="lg:col-span-5">

          <div className="sticky top-24 flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-slate-50/50 p-4 text-slate-800 shadow-xl shadow-slate-100/50">

            {/* Header controls for Mockup */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="flex items-center gap-1.5 rounded bg-purple-50 border border-purple-100 px-2 py-1 text-[10px] font-bold text-purple-700">
                <Eye size={12} className="text-purple-600" />
                معاينة حية تفاعلية للموقع
              </span>

              <div className="flex gap-2">
                {/* Language Switcher */}
                <div className="flex rounded-lg bg-slate-200/50 p-0.5">
                  <button
                    type="button"
                    onClick={() => setPreviewLang('ar')}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition ${previewLang === 'ar' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    عربي
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewLang('en')}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition ${previewLang === 'en' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    EN
                  </button>
                </div>

                {/* Device selector */}
                <div className="flex rounded-lg bg-slate-200/50 p-0.5">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1 rounded-md transition ${previewDevice === 'desktop' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    title="معاينة شاشة مكتب"
                  >
                    <Monitor size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1 rounded-md transition ${previewDevice === 'mobile' ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    title="معاينة شاشة جوال"
                  >
                    <Smartphone size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* If general custom plan is disabled */}
            {!config.enabled && (
              <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-100 p-3 text-xs text-amber-800 leading-normal">
                <AlertCircle size={16} className="flex-shrink-0 text-amber-600" />
                <span>الخطة المخصصة غير نشطة حالياً في الموقع العام.</span>
              </div>
            )}

            {/* Desktop Mockup Frame */}
            {previewDevice === 'desktop' && (
              <div className="relative overflow-hidden rounded-[20px] bg-white transition-all duration-300 border border-slate-200/80 shadow-md">
                {/* Mac-style Window Controls */}
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-450" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  <div className="mx-auto w-40 rounded bg-slate-200/60 py-0.5 px-2 text-[8px] text-slate-500 text-center font-mono truncate select-none">
                    select.eg/custom-plan
                  </div>
                </div>

                <div className="relative p-5 flex flex-col h-[400px] justify-between" dir={previewLang === 'ar' ? 'rtl' : 'ltr'}>
                  {/* Background lighting */}
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(157,2,124,.03),transparent_40%)]" />

                  {/* Header metadata */}
                  <div className="relative z-10">
                    <h4 className="text-sm font-extrabold text-slate-800 leading-tight">
                      {previewLang === 'ar' ? (config.titleAr || 'ابنِ خطتك البرمجية') : (config.titleEn || 'Build your custom plan')}
                    </h4>
                    <p className="mt-1 text-[10px] leading-relaxed text-slate-500 line-clamp-2">
                      {previewLang === 'ar' ? (config.leadAr || 'اختر احتياجاتك') : (config.leadEn || 'Select your project needs')}
                    </p>
                  </div>

                  {/* Circle of options inside browser */}
                  <div className="relative mx-auto my-3 h-[210px] w-[210px] flex items-center justify-center">

                    {/* SVG Connecting lines */}
                    <svg className="absolute inset-0 h-full w-full pointer-events-none z-0">
                      {config.options.map((option, idx) => {
                        const pos = getPointPosition(idx, config.options.length);
                        const isSelected = selectedPreviewIds.includes(option.id);
                        return (
                          <line
                            key={option.id}
                            x1="50%"
                            y1="50%"
                            x2={pos.left}
                            y2={pos.top}
                            stroke={isSelected ? '#9d027c' : '#f1f5f9'}
                            strokeWidth={isSelected ? '1.5' : '1'}
                            strokeDasharray={isSelected ? 'none' : '3 3'}
                            className="transition-all duration-300"
                          />
                        );
                      })}
                    </svg>

                    {/* Dashed outer boundary ring */}
                    <div className="absolute h-[154px] w-[154px] rounded-full border border-dashed border-slate-200 z-0" />

                    {/* Glowing center circle */}
                    <div className="absolute h-[70px] w-[70px] rounded-full border border-slate-250 bg-slate-50 shadow-[0_0_20px_rgba(157,2,124,0.08)] flex flex-col items-center justify-center text-center z-10">
                      <Layers3 size={15} className="text-[#9d027c] animate-pulse" />
                      <strong className="mt-0.5 px-1 text-[8px] text-slate-800 font-extrabold leading-tight">
                        {previewLang === 'ar' ? 'موقع وويب' : 'Web & App'}
                      </strong>
                    </div>

                    {/* Circle option elements */}
                    {config.options.map((option, idx) => {
                      const pos = getPointPosition(idx, config.options.length);
                      const isSelected = selectedPreviewIds.includes(option.id);

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => togglePreviewOption(option.id)}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border p-1 text-center transition-all duration-200 cursor-pointer z-20 ${isSelected
                              ? 'border-[#9d027c] bg-[#9d027c] text-white shadow-[0_4px_10px_rgba(157,2,124,0.2)] scale-105'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-350 hover:scale-105'
                            }`}
                          style={{
                            left: pos.left,
                            top: pos.top,
                            width: '58px',
                            minHeight: '36px',
                            boxSizing: 'border-box'
                          }}
                        >
                          <span className={`mx-auto mb-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border text-[7px] ${isSelected ? 'border-white/30 bg-white/20 text-white' : 'border-slate-200 bg-slate-50 text-[#9d027c]'
                            }`}>
                            {isSelected ? <Check size={6} /> : <CircleDot size={6} />}
                          </span>
                          <strong className="block text-[7px] font-bold leading-tight truncate">
                            {previewLang === 'ar' ? option.labelAr : option.labelEn}
                          </strong>
                        </button>
                      );
                    })}
                  </div>

                  {/* Browser Footer Checkout Actions */}
                  <div className="relative border-t border-slate-200 pt-3 flex flex-col gap-2 z-10">
                    <div className="flex items-center justify-between text-[9px] text-slate-500 font-bold">
                      <span>
                        {previewLang === 'ar' ? 'الاحتياجات المختارة:' : 'Selected needs:'} {selectedPreviewIds.length}
                      </span>
                      <span className="text-[#9d027c]">استشارة مجانية</span>
                    </div>

                    <button
                      type="button"
                      className="w-full flex min-h-[32px] items-center justify-center gap-1.5 rounded-xl bg-[#9d027c] text-white text-xs font-bold shadow-[0_4px_12px_rgba(157,2,124,0.15)]"
                    >
                      <span>
                        {previewLang === 'ar' ? (config.buttonAr || 'طلب الخطة') : (config.buttonEn || 'Order Custom Plan')}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Mockup Frame */}
            {previewDevice === 'mobile' && (
              <div className="relative mx-auto w-[240px] overflow-hidden rounded-[32px] border-4 border-slate-300 bg-white transition-all duration-300 shadow-2xl">
                {/* Simulated Notch & status icons */}
                <div className="bg-slate-50 h-5 px-4 flex items-center justify-between text-[8px] text-slate-500 select-none">
                  <span>9:41</span>
                  <div className="w-12 h-3.5 bg-slate-200 rounded-b-md mx-auto" />
                  <div className="flex items-center gap-1">
                    <span>LTE</span>
                    <div className="w-3 h-1.5 bg-slate-400 rounded-sm" />
                  </div>
                </div>

                <div className="relative p-4 flex flex-col h-[380px] justify-between" dir={previewLang === 'ar' ? 'rtl' : 'ltr'}>
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(157,2,124,.03),transparent_60%)]" />

                  {/* Header */}
                  <div className="relative z-10">
                    <h4 className="mt-1 text-[11px] font-bold text-slate-800 leading-snug">
                      {previewLang === 'ar' ? (config.titleAr || 'ابن خطتك') : (config.titleEn || 'Build custom plan')}
                    </h4>
                  </div>

                  {/* Scrollable list inside Mobile preview */}
                  <div className="my-2 flex-1 overflow-y-auto max-h-[220px] space-y-1.5 pr-1 text-right scrollbar-thin select-none relative z-10">
                    {config.options.map(option => {
                      const isSelected = selectedPreviewIds.includes(option.id);

                      return (
                        <div
                          key={option.id}
                          onClick={() => togglePreviewOption(option.id)}
                          className={`p-2 rounded-xl border transition cursor-pointer flex items-center justify-between ${isSelected
                              ? 'border-[#9d027c] bg-[#9d027c]/5 text-slate-800'
                              : 'border-slate-100 bg-slate-50/50 text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                          <div className="min-w-0 pr-1.5">
                            <strong className="block text-[9px] font-bold text-slate-800 truncate max-w-[150px]">
                              {previewLang === 'ar' ? option.labelAr : option.labelEn}
                            </strong>
                            <span className="block text-[7px] text-slate-500 mt-0.5 truncate max-w-[150px]">
                              {previewLang === 'ar' ? option.descriptionAr : option.descriptionEn}
                            </span>
                          </div>

                          <span className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border ${isSelected ? 'border-[#9d027c] bg-[#9d027c] text-white' : 'border-slate-200 bg-white text-[#9d027c]'
                            }`}>
                            {isSelected ? <Check size={8} /> : <CircleDot size={8} />}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile Footer */}
                  <div className="relative border-t border-slate-150 pt-2 flex flex-col gap-1.5 z-10">
                    <button
                      type="button"
                      className="w-full flex min-h-[30px] items-center justify-center rounded-xl bg-[#9d027c] text-white text-[10px] font-bold shadow-[0_3px_8px_rgba(157,2,124,0.12)]"
                    >
                      {previewLang === 'ar' ? (config.buttonAr || 'طلب الخطة') : (config.buttonEn || 'Order Plan')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Help/Instruction Tip */}
            <div className="flex items-start gap-1.5 text-[10px] text-slate-400 px-1 leading-relaxed mt-1">
              <HelpCircle size={13} className="text-purple-400 flex-shrink-0 mt-0.5" />
              <span>
                انقر على خيارات المعاينة لتجربة ميكانيكية الاختيار الدائرية ومطابقة النصوص مع التصميم العام.
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
