"use client";

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  ClipboardList,
  Globe,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  Palette,
  Phone,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { Language } from '../types';
import type { PublicService } from '../lib/homeApi';

interface ContactCopy {
  title: string;
  subtitle: string;
  name: string;
  email: string;
  company: string;
  message: string;
  submit: string;
  success: string;
  cards: {
    addressTitle: string;
    addressDesc: string;
    phoneTitle: string;
    phoneDesc: string;
    paymentTitle?: string;
    paymentDesc: string;
  };
}

interface ContactStartPageProps {
  lang: Language;
  copy: ContactCopy;
  services: PublicService[];
  servicesLoading: boolean;
  selectedServices: string[];
  submitted: boolean;
  submitting: boolean;
  submitError: string | null;
  isReady: boolean;
  name: string;
  email: string;
  company: string;
  message: string;
  onServiceToggle: (slug: string) => void;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onRequestDetailsChange?: (details: any) => void;
}

const SERVICE_ICONS: Record<string, React.ElementType> = {
  Globe,
  Megaphone,
  Search,
  Share2,
  Palette,
  Smartphone,
};

const serviceTitle = (service: PublicService, lang: Language) => (
  lang === 'ar' ? service.titleAr : service.titleEn
);

const serviceDescription = (service: PublicService, lang: Language) => (
  lang === 'ar'
    ? service.descAr || service.contentAr || service.descEn || service.contentEn || ''
    : service.descEn || service.contentEn || service.descAr || service.contentAr || ''
);

function selectionCount(count: number, isAr: boolean) {
  if (!isAr) return count === 1 ? '1 service selected' : `${count} services selected`;
  if (count === 0) return 'لم تحدد خدمات';
  if (count === 1) return 'خدمة واحدة مختارة';
  if (count === 2) return 'خدمتان مختارتان';
  return `${count} خدمات مختارة`;
}

export default function ContactStartPage({
  lang,
  copy,
  services,
  servicesLoading,
  selectedServices,
  submitted,
  submitting,
  submitError,
  isReady,
  name,
  email,
  company,
  message,
  onServiceToggle,
  onNameChange,
  onEmailChange,
  onCompanyChange,
  onMessageChange,
  onSubmit,
  onRequestDetailsChange,
}: ContactStartPageProps) {
  const isAr = lang === 'ar';
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const panelRef = useRef<HTMLDivElement>(null);
  
  const needsCustomization = selectedServices.some(slug => ['branding', 'software', 'media'].includes(slug));
  const canContinue = selectedServices.length > 0 || (!servicesLoading && services.length === 0);
  
  const [brandingPkg, setBrandingPkg] = useState<string>('custom');
  const [mediaPkg, setMediaPkg] = useState<string>('custom');
  const [softwareOpts, setSoftwareOpts] = useState<string[]>([]);

  const serviceMap = new Map(services.map((service) => [service.slug, service]));
  const selectedLabels = selectedServices.map((slug) => {
    const service = serviceMap.get(slug);
    return service ? serviceTitle(service, lang) : slug;
  });

  // Sync selected details with App.tsx state on changes
  useEffect(() => {
    if (!onRequestDetailsChange) return;

    const data: any = {};
    const summaryParts: string[] = [];

    if (selectedServices.includes('branding')) {
      data.brandingPackage = brandingPkg;
      const pkgLabel = brandingPkg === 'starter' 
        ? (isAr ? 'خطة الأساسيات للهوية (6,500 ج.م)' : 'Starter Identity Plan (6,500 EGP)')
        : brandingPkg === 'growth'
          ? (isAr ? 'الخطة المتكاملة للبراند (12,000 ج.م)' : 'Growth Branding Plan (12,000 EGP)')
          : brandingPkg === 'enterprise'
            ? (isAr ? 'الهوية الشاملة والتغليف (20,000 ج.م)' : 'Enterprise Branding & Pack (20,000 EGP)')
            : (isAr ? 'خطة مخصصة' : 'Custom branding plan');
      summaryParts.push(isAr ? `الخطة المطلوبة للهوية: ${pkgLabel}` : `Branding Plan: ${pkgLabel}`);
    }

    if (selectedServices.includes('media')) {
      data.mediaPackage = mediaPkg;
      const pkgLabel = mediaPkg === 'starter'
        ? (isAr ? 'خطة الميديا الأساسية (5,000 ج.م)' : 'Starter Media Plan (5,000 EGP)')
        : mediaPkg === 'growth'
          ? (isAr ? 'خطة إنتاج المحتوى (9,500 ج.م)' : 'Content Production Plan (9,500 EGP)')
          : mediaPkg === 'enterprise'
            ? (isAr ? 'الخطة الشاملة للتصوير والإنتاج (16,000 ج.م)' : 'Enterprise Media Production (16,000 EGP)')
            : (isAr ? 'خطة ميديا مخصصة' : 'Custom media plan');
      summaryParts.push(isAr ? `الخطة المطلوبة للميديا: ${pkgLabel}` : `Media Plan: ${pkgLabel}`);
    }

    if (selectedServices.includes('software')) {
      data.softwareOptions = softwareOpts;
      const labelsMap: Record<string, {ar: string, en: string}> = {
        website: { ar: 'موقع تعريفي للشركة', en: 'Corporate Website' },
        store: { ar: 'متجر إلكتروني متكامل', en: 'E-commerce Store' },
        app: { ar: 'تطبيق جوال (iOS/Android)', en: 'Mobile App' },
        crm: { ar: 'نظام إدارة CRM / لوحة تحكم', en: 'CRM / Dashboard' },
        saas: { ar: 'منصة ساس SaaS / بوابة عملاء', en: 'SaaS / Portal' },
        uiux: { ar: 'تصميم واجهات UI/UX', en: 'UI/UX Design' },
        ai: { ar: 'ربط ذكاء اصطناعي وأتمتة العمليات', en: 'AI & Automation' }
      };
      const selectedLabels = softwareOpts.map(opt => labelsMap[opt]?.[isAr ? 'ar' : 'en'] || opt);
      if (selectedLabels.length) {
        summaryParts.push(isAr ? `مكونات البرمجة المطلوبة: ${selectedLabels.join(' · ')}` : `Software Options: ${selectedLabels.join(' · ')}`);
      } else {
        summaryParts.push(isAr ? `خيارات البرمجة: لم يتم تحديد مكونات مخصصة` : `Software Options: None selected`);
      }
    }

    onRequestDetailsChange({
      data,
      summary: summaryParts.join('\n')
    });
  }, [selectedServices, brandingPkg, mediaPkg, softwareOpts, onRequestDetailsChange, isAr]);

  const moveToStep = (nextStep: 1 | 2 | 3) => {
    if (nextStep === 2) {
      if (!canContinue) return;
      if (needsCustomization) {
        setStep(2);
      } else {
        setStep(3);
      }
    } else if (nextStep === 3) {
      setStep(3);
    } else {
      setStep(1);
    }
    window.requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  useEffect(() => {
    if (!submitted) return;
    setStep(3);
    window.requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [submitted]);

  return (
    <section
      id="contact"
      className={`relative isolate overflow-hidden bg-[#FBF8FC] text-[#221523] ${step === 1 ? 'pb-32 md:pb-24' : 'pb-24'} pt-28 sm:pt-32`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(circle_at_82%_12%,rgba(157,2,124,0.09),transparent_34%),radial-gradient(circle_at_18%_20%,rgba(255,188,1,0.08),transparent_26%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-[#9D027C]/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="mt-6 text-[clamp(2rem,5vw,3.4rem)] font-black leading-[1.18] tracking-normal text-[#221523]">
            {isAr ? 'حدد احتياجك وسنرتب لك مسار التنفيذ.' : 'Tell us what you need and we will shape the execution path.'}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-8 text-[#6F6670] sm:text-base">
            {isAr
              ? 'اختر الخدمات، أضف تفاصيل المشروع، وسنرد عليك بنطاق واضح يناسب هدفك ومرحلة نشاطك.'
              : 'Choose the services, add project details, and we will reply with a clear scope that fits your goal and business stage.'}
          </p>
        </header>

        <div className="mx-auto mt-8 flex max-w-2xl items-start px-2" aria-label={isAr ? 'خطوات إرسال الطلب' : 'Request steps'}>
          <div className="flex min-w-0 flex-1 flex-col items-center text-center">
            <span className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-black text-white shadow-[0_8px_20px_rgba(157,2,124,0.2)] ${step > 1 ? 'bg-emerald-600' : 'bg-[#9D027C]'}`}>
              {step > 1 ? <Check className="h-5 w-5" /> : '1'}
            </span>
            <span className="mt-2 text-xs font-black text-[#6D0758]">{isAr ? 'اختيار الخدمات' : 'Choose services'}</span>
          </div>
          
          <div className={`mt-5 h-px flex-1 transition-colors ${step > 1 ? 'bg-emerald-600' : 'bg-[#E9DEE7]'}`} />
          
          <div className="flex min-w-0 flex-1 flex-col items-center text-center">
            <span className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-black transition-colors ${
              step === 2 
                ? 'border-[#9D027C] bg-[#9D027C] text-white shadow-[0_8px_20px_rgba(157,2,124,0.2)]' 
                : step > 2 
                  ? 'border-emerald-600 bg-emerald-600 text-white shadow-[0_8px_20px_rgba(16,185,129,0.2)]'
                  : 'border-[#DCCFD9] bg-white text-[#8E818B]'
            }`}>
              {step > 2 ? <Check className="h-5 w-5" /> : '2'}
            </span>
            <span className={`mt-2 text-xs font-black ${step >= 2 ? 'text-[#6D0758]' : 'text-[#8E818B]'}`}>
              {isAr ? 'تفاصيل الخطة' : 'Plan Details'}
            </span>
          </div>
          
          <div className={`mt-5 h-px flex-1 transition-colors ${step > 2 ? 'bg-emerald-600' : 'bg-[#E9DEE7]'}`} />
          
          <div className="flex min-w-0 flex-1 flex-col items-center text-center">
            <span className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-black transition-colors ${
              step === 3 
                ? 'border-[#9D027C] bg-[#9D027C] text-white shadow-[0_8px_20px_rgba(157,2,124,0.2)]' 
                : 'border-[#DCCFD9] bg-white text-[#8E818B]'
            }`}>
              3
            </span>
            <span className={`mt-2 text-xs font-black ${step >= 3 ? 'text-[#6D0758]' : 'text-[#8E818B]'}`}>
              {isAr ? 'بيانات التواصل' : 'Contact Details'}
            </span>
          </div>
        </div>

        {step === 1 && (
          <div className="mt-10 overflow-hidden rounded-[28px] border border-[#E9DEE7] bg-white shadow-[0_22px_60px_rgba(74,31,64,0.08)]">
            <div className="flex flex-col gap-4 border-b border-[#EFE5ED] p-5 sm:flex-row sm:items-end sm:justify-between sm:p-7 lg:p-8">
                <div>
                  <div className="inline-flex items-center gap-2 text-[11px] font-black text-[#8A066D]">
                    <ClipboardList className="h-4 w-4" />
                    {isAr ? 'الخطوة الأولى' : 'First step'}
                  </div>
                  <h2 className="mt-2 text-2xl font-black text-[#221523] sm:text-3xl">
                    {isAr ? 'ما المسارات التي تخدم هدفك؟' : 'Which tracks support your goal?'}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-[#736A72]">
                    {isAr ? 'اختر خدمة واحدة أو أكثر حسب ما تحتاجه الآن في التسويق، المحتوى، أو التطوير.' : 'Choose one or more services based on what you need now in marketing, content, or development.'}
                  </p>
                </div>
                <span className="w-fit rounded-full border border-[#E6D8E2] bg-[#FCF7FB] px-4 py-2 text-xs font-black text-[#7B1766]">
                  {selectionCount(selectedServices.length, isAr)}
                </span>
              </div>

              <div className="p-4 sm:p-7 lg:p-8">
                {servicesLoading ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label={isAr ? 'جارٍ تحميل الخدمات' : 'Loading services'}>
                    {[0, 1, 2, 3, 4, 5].map((item) => (
                      <div key={item} className="h-44 animate-pulse rounded-2xl border border-[#EFE5ED] bg-[#FBF8FA]" />
                    ))}
                  </div>
                ) : services.length ? (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => {
                      const active = selectedServices.includes(service.slug);
                      const title = serviceTitle(service, lang);
                      const description = serviceDescription(service, lang);
                      const ServiceIcon = service.icon && SERVICE_ICONS[service.icon] ? SERVICE_ICONS[service.icon] : Sparkles;

                      return (
                        <button
                          key={service.slug}
                          type="button"
                          aria-pressed={active}
                          onClick={() => onServiceToggle(service.slug)}
                          className={`group relative min-h-[168px] rounded-2xl border p-5 text-start transition duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#9D027C]/15 ${active ? 'border-[#9D027C] bg-[#FFF8FD] shadow-[0_12px_30px_rgba(157,2,124,0.1)]' : 'border-[#E9DEE7] bg-white hover:-translate-y-0.5 hover:border-[#CDAFC6] hover:shadow-[0_12px_30px_rgba(74,31,64,0.07)]'}`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <span className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${active ? 'bg-[#9D027C] text-white' : 'bg-[#F6EDF4] text-[#9D027C]'}`}>
                              <ServiceIcon className="h-5 w-5" />
                            </span>
                            <span className={`flex h-7 w-7 items-center justify-center rounded-full border transition-colors ${active ? 'border-[#FFBC01] bg-[#FFBC01] text-[#3A2A00]' : 'border-[#DCCFD9] bg-white text-transparent'}`}>
                              <Check className="h-4 w-4" />
                            </span>
                          </div>
                          <h3 className="mt-5 text-base font-black leading-6 text-[#221523]">{title}</h3>
                          {description ? <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-[#756B73]">{description}</p> : null}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-[#DCCFD9] bg-[#FCF9FB] p-8 text-center">
                    <ClipboardList className="mx-auto h-7 w-7 text-[#9D027C]" />
                    <h3 className="mt-4 text-base font-black text-[#221523]">{isAr ? 'الخدمات غير متاحة الآن' : 'Services are unavailable right now'}</h3>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#756B73]">
                      {isAr ? 'يمكنك المتابعة وكتابة احتياج مشروعك بالتفصيل، وسنراجعه معك.' : 'You can continue and describe what your project needs. We will review it with you.'}
                    </p>
                  </div>
                )}

                <div className="mt-7 hidden items-center justify-between gap-4 border-t border-[#EFE5ED] pt-6 md:flex">
                  <p className="text-sm text-[#756B73]">
                    {canContinue
                      ? (isAr ? 'اختياراتك محفوظة، انتقل لتخصيص الخطط.' : 'Your selection is saved. Continue to plan customization.')
                      : (isAr ? 'اختر خدمة واحدة على الأقل للمتابعة.' : 'Choose at least one service to continue.')}
                  </p>
                  <button
                    type="button"
                    disabled={!canContinue}
                    onClick={() => moveToStep(2)}
                    className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#9D027C] px-6 py-3 text-sm font-black text-white shadow-[0_12px_24px_rgba(157,2,124,0.2)] transition hover:bg-[#7F0066] disabled:cursor-not-allowed disabled:bg-[#D8CCD5] disabled:text-[#8F838C] disabled:shadow-none"
                  >
                    {isAr ? 'متابعة التخصيص' : 'Continue to options'}
                    <ArrowRight className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="mt-10 rounded-[28px] border border-[#E9DEE7] bg-white p-5 shadow-[0_22px_60px_rgba(74,31,64,0.08)] sm:p-7 lg:p-8">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#EFE5ED] pb-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-[11px] font-black text-[#8A066D]">
                    <ClipboardList className="h-4 w-4" />
                    {isAr ? 'الخطوة الثانية' : 'Second step'}
                  </div>
                  <h2 className="mt-2 text-2xl font-black text-[#221523] sm:text-3xl">
                    {isAr ? 'تخصيص الخطط والخيارات' : 'Customize plans and options'}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-[#736A72]">
                    {isAr ? 'اختر الخطة أو المكونات التي تناسب الهدف قبل إرسال الطلب.' : 'Choose the plan or components that fit the goal before sending the request.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => moveToStep(1)}
                  className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-[#E2D5DF] bg-white px-4 py-2 text-sm font-black text-[#6D0758] transition hover:border-[#CDAFC6] hover:bg-[#FFF8FD]"
                >
                  <ArrowLeft className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} />
                  {isAr ? 'العودة للخدمات' : 'Back to services'}
                </button>
              </div>

              <div className="space-y-8">
                {/* Branding Packages */}
                {selectedServices.includes('branding') && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-black text-[#221523] border-r-4 border-[#9D027C] pr-3">
                      {isAr ? 'خطة الهوية البصرية والتصميم' : 'Branding & Design Plan'}
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {[
                        { id: 'starter', labelAr: 'خطة الأساسيات للهوية', labelEn: 'Starter Identity Plan', price: '6,500' },
                        { id: 'growth', labelAr: 'الخطة المتكاملة للبراند', labelEn: 'Growth Branding Plan', price: '12,000' },
                        { id: 'enterprise', labelAr: 'الهوية الشاملة والتغليف', labelEn: 'Enterprise Branding & Pack', price: '20,000' },
                        { id: 'custom', labelAr: 'طلب مخصص / خطة خاصة', labelEn: 'Custom Branding Request', price: null }
                      ].map((pkg) => {
                        const active = brandingPkg === pkg.id;
                        return (
                          <button
                            key={pkg.id}
                            type="button"
                            onClick={() => setBrandingPkg(pkg.id)}
                            className={`group relative rounded-xl border p-4 text-start transition duration-150 ${
                              active 
                                ? 'border-[#9D027C] bg-[#FFF8FD] shadow-[0_8px_20px_rgba(157,2,124,0.06)]' 
                                : 'border-[#E9DEE7] bg-white hover:border-[#CDAFC6]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-black text-[#221523]">
                                {isAr ? pkg.labelAr : pkg.labelEn}
                              </span>
                              <span className={`h-4 w-4 rounded-full border flex items-center justify-center ${active ? 'border-[#9D027C]' : 'border-[#DCCFD9]'}`}>
                                {active && <span className="h-2 w-2 rounded-full bg-[#9D027C]" />}
                              </span>
                            </div>
                            {pkg.price && (
                              <p className="mt-2 text-xs font-black text-[#9D027C]">
                                {pkg.price} {isAr ? 'ج.م' : 'EGP'}
                              </p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Media Packages */}
                {selectedServices.includes('media') && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-black text-[#221523] border-r-4 border-[#9D027C] pr-3">
                      {isAr ? 'خطة إنتاج الميديا والتصوير' : 'Media & Content Production Plan'}
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {[
                        { id: 'starter', labelAr: 'خطة الميديا الأساسية', labelEn: 'Starter Media Plan', price: '5,000' },
                        { id: 'growth', labelAr: 'خطة إنتاج المحتوى', labelEn: 'Content Production Plan', price: '9,500' },
                        { id: 'enterprise', labelAr: 'الخطة الشاملة للتصوير والإنتاج', labelEn: 'Enterprise Media Production', price: '16,000' },
                        { id: 'custom', labelAr: 'طلب مخصص / خطة خاصة', labelEn: 'Custom Media Request', price: null }
                      ].map((pkg) => {
                        const active = mediaPkg === pkg.id;
                        return (
                          <button
                            key={pkg.id}
                            type="button"
                            onClick={() => setMediaPkg(pkg.id)}
                            className={`group relative rounded-xl border p-4 text-start transition duration-150 ${
                              active 
                                ? 'border-[#9D027C] bg-[#FFF8FD] shadow-[0_8px_20px_rgba(157,2,124,0.06)]' 
                                : 'border-[#E9DEE7] bg-white hover:border-[#CDAFC6]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-black text-[#221523]">
                                {isAr ? pkg.labelAr : pkg.labelEn}
                              </span>
                              <span className={`h-4 w-4 rounded-full border flex items-center justify-center ${active ? 'border-[#9D027C]' : 'border-[#DCCFD9]'}`}>
                                {active && <span className="h-2 w-2 rounded-full bg-[#9D027C]" />}
                              </span>
                            </div>
                            {pkg.price && (
                              <p className="mt-2 text-xs font-black text-[#9D027C]">
                                {pkg.price} {isAr ? 'ج.م' : 'EGP'}
                              </p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Software Checklist */}
                {selectedServices.includes('software') && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-black text-[#221523] border-r-4 border-[#9D027C] pr-3">
                      {isAr ? 'البرمجة والسوفتوير: اختر المكونات المطلوبة' : 'Software and custom development: select components'}
                    </h3>
                    <p className="text-xs text-[#736A72] -mt-2">
                      {isAr ? 'اختياراتك تساعدنا نحول الفكرة إلى نطاق تنفيذ واضح بدلاً من عرض عام.' : 'Your choices help us turn the idea into a clear scope instead of a generic offer.'}
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {[
                        { id: 'website', labelAr: 'موقع تعريفي للشركة', labelEn: 'Corporate Website' },
                        { id: 'store', labelAr: 'متجر إلكتروني متكامل', labelEn: 'E-commerce / Online Store' },
                        { id: 'app', labelAr: 'تطبيق جوال (iOS/Android)', labelEn: 'Mobile App (iOS/Android)' },
                        { id: 'crm', labelAr: 'نظام إدارة CRM / لوحة تحكم', labelEn: 'CRM / Admin Dashboard' },
                        { id: 'saas', labelAr: 'منصة ساس SaaS / بوابة عملاء', labelEn: 'SaaS Platform / Portal' },
                        { id: 'uiux', labelAr: 'تصميم واجهات وتجربة المستخدم UI/UX', labelEn: 'UI/UX Design' },
                        { id: 'ai', labelAr: 'ربط ذكاء اصطناعي وأتمتة العمليات', labelEn: 'AI & Automation Integration' }
                      ].map((opt) => {
                        const active = softwareOpts.includes(opt.id);
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setSoftwareOpts(current => 
                                current.includes(opt.id)
                                  ? current.filter(x => x !== opt.id)
                                  : [...current, opt.id]
                              );
                            }}
                            className={`group relative rounded-xl border p-4 text-start transition duration-150 ${
                              active 
                                ? 'border-[#9D027C] bg-[#FFF8FD] shadow-[0_8px_20px_rgba(157,2,124,0.06)]' 
                                : 'border-[#E9DEE7] bg-white hover:border-[#CDAFC6]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm font-black text-[#221523]">
                                {isAr ? opt.labelAr : opt.labelEn}
                              </span>
                              <span className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${active ? 'bg-[#9D027C] border-[#9D027C] text-white' : 'border-[#DCCFD9] text-transparent'}`}>
                                <Check className="h-3.5 w-3.5" />
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 border-t border-[#EFE5ED] pt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => moveToStep(3)}
                  className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#9D027C] px-6 py-3 text-sm font-black text-white shadow-[0_12px_24px_rgba(157,2,124,0.2)] transition hover:bg-[#7F0066]"
                >
                  {isAr ? 'متابعة إلى البيانات' : 'Continue to details'}
                  <ArrowRight className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="mt-10">
              {submitted ? (
                <div className="mx-auto max-w-2xl rounded-[28px] border border-[#D8EADD] bg-white p-7 text-center shadow-[0_22px_60px_rgba(44,92,58,0.08)] sm:p-10">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#1F8A4C] text-white">
                    <Check className="h-8 w-8" />
                  </div>
                  <p className="mt-5 text-xs font-black text-[#1F7A45]">{isAr ? 'تم إرسال طلبك' : 'Request sent'}</p>
                  <h2 className="mt-2 text-2xl font-black text-[#193021] sm:text-3xl">{isAr ? 'وصلتنا تفاصيل مشروعك بنجاح' : 'We received your project details'}</h2>
                  <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#5F6F63]">{copy.success}</p>
                </div>
              ) : (
                <>
                  <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      type="button"
                      onClick={() => moveToStep(needsCustomization ? 2 : 1)}
                      className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-[#E2D5DF] bg-white px-4 py-2 text-sm font-black text-[#6D0758] transition hover:border-[#CDAFC6] hover:bg-[#FFF8FD]"
                    >
                      <ArrowLeft className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} />
                      {isAr ? (needsCustomization ? 'الرجوع للتخصيص' : 'تعديل الخدمات') : (needsCustomization ? 'Back to options' : 'Edit services')}
                    </button>
                    <span className="w-fit rounded-full border border-[#E6D8E2] bg-white px-4 py-2 text-xs font-black text-[#7B1766]">
                      {selectionCount(selectedServices.length, isAr)}
                    </span>
                  </div>

                  <div className="grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.75fr)]">
                    <div className="rounded-[28px] border border-[#E9DEE7] bg-white p-5 shadow-[0_22px_60px_rgba(74,31,64,0.08)] sm:p-7 lg:p-8">
                      <div className="inline-flex items-center gap-2 text-[11px] font-black text-[#8A066D]">
                        <Mail className="h-4 w-4" />
                        {isAr ? (needsCustomization ? 'الخطوة الثالثة' : 'الخطوة الثانية') : (needsCustomization ? 'Third step' : 'Second step')}
                      </div>
                      <h2 className="mt-2 text-2xl font-black text-[#221523] sm:text-3xl">{isAr ? 'أرسل تفاصيل تساعدنا نجهز الرد' : 'Send details that help us prepare the reply'}</h2>
                      <p className="mt-2 text-sm leading-7 text-[#736A72]">{isAr ? 'اكتب بيانات التواصل والهدف التجاري وأي روابط أو أمثلة مهمة.' : 'Add contact details, the business goal, and any useful links or examples.'}</p>

                      {selectedLabels.length ? (
                        <div className="mt-5 flex flex-wrap gap-2 rounded-2xl border border-[#EEE3EB] bg-[#FCF8FB] p-4">
                          {selectedLabels.map((label) => (
                            <span key={label} className="rounded-full border border-[#E3D3DF] bg-white px-3 py-1.5 text-xs font-black text-[#7B1766]">{label}</span>
                          ))}
                        </div>
                      ) : null}

                      <form onSubmit={onSubmit} className="mt-6 space-y-5">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="block">
                            <span className="text-xs font-black text-[#4F454D]">{copy.name} *</span>
                            <input
                              type="text"
                              required
                              autoComplete="name"
                              value={name}
                              onChange={(event) => onNameChange(event.target.value)}
                              className="mt-2 min-h-12 w-full rounded-xl border border-[#DDD1DA] bg-white px-4 py-3 text-base text-[#221523] outline-none transition placeholder:text-[#A99DA6] focus:border-[#9D027C] focus:ring-4 focus:ring-[#9D027C]/10"
                            />
                          </label>
                          <label className="block">
                            <span className="text-xs font-black text-[#4F454D]">{copy.email} *</span>
                            <input
                              type="email"
                              required
                              inputMode="email"
                              autoComplete="email"
                              dir="ltr"
                              value={email}
                              onChange={(event) => onEmailChange(event.target.value)}
                              className="mt-2 min-h-12 w-full rounded-xl border border-[#DDD1DA] bg-white px-4 py-3 text-base text-[#221523] outline-none transition placeholder:text-[#A99DA6] focus:border-[#9D027C] focus:ring-4 focus:ring-[#9D027C]/10"
                            />
                          </label>
                        </div>

                        <label className="block">
                          <span className="text-xs font-black text-[#4F454D]">{copy.company}</span>
                          <input
                            type="text"
                            autoComplete="organization"
                            value={company}
                            onChange={(event) => onCompanyChange(event.target.value)}
                            className="mt-2 min-h-12 w-full rounded-xl border border-[#DDD1DA] bg-white px-4 py-3 text-base text-[#221523] outline-none transition placeholder:text-[#A99DA6] focus:border-[#9D027C] focus:ring-4 focus:ring-[#9D027C]/10"
                          />
                        </label>

                        <label className="block">
                          <span className="text-xs font-black text-[#4F454D]">{copy.message}</span>
                          <textarea
                            rows={5}
                            value={message}
                            onChange={(event) => onMessageChange(event.target.value)}
                            className="mt-2 w-full resize-y rounded-xl border border-[#DDD1DA] bg-white px-4 py-3 text-base leading-7 text-[#221523] outline-none transition placeholder:text-[#A99DA6] focus:border-[#9D027C] focus:ring-4 focus:ring-[#9D027C]/10"
                          />
                        </label>

                        {submitError ? (
                          <div role="alert" className="flex items-start gap-3 rounded-xl border border-[#F0C8C8] bg-[#FFF7F7] p-4 text-sm leading-6 text-[#9A3434]">
                            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
                            <span>{submitError}</span>
                          </div>
                        ) : null}

                        <button
                          type="submit"
                          disabled={!isReady || submitting}
                          className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-[#9D027C] px-6 py-3.5 text-sm font-black text-white shadow-[0_14px_28px_rgba(157,2,124,0.2)] transition hover:bg-[#7F0066] disabled:cursor-not-allowed disabled:bg-[#D8CCD5] disabled:text-[#8F838C] disabled:shadow-none"
                        >
                          {submitting ? (isAr ? 'جارٍ إرسال الطلب...' : 'Sending request...') : copy.submit}
                          <Send className="h-4 w-4" />
                        </button>
                      </form>
                    </div>

                    <aside className="space-y-3 lg:pt-1">
                      <div className="rounded-2xl border border-[#E9DEE7] bg-white p-5">
                        <MapPin className="h-5 w-5 text-[#9D027C]" />
                        <h3 className="mt-4 text-sm font-black text-[#221523]">{copy.cards.addressTitle}</h3>
                        <p className="mt-2 text-sm leading-7 text-[#756B73]">{copy.cards.addressDesc}</p>
                      </div>
                      <div className="rounded-2xl border border-[#E9DEE7] bg-white p-5">
                        <Phone className="h-5 w-5 text-[#9D027C]" />
                        <h3 className="mt-4 text-sm font-black text-[#221523]">{copy.cards.phoneTitle}</h3>
                        <p className="mt-2 text-sm leading-7 text-[#756B73]">{copy.cards.phoneDesc}</p>
                      </div>
                      <div className="rounded-2xl border border-[#E9DEE7] bg-white p-5">
                        <ShieldCheck className="h-5 w-5 text-[#9D027C]" />
                        <h3 className="mt-4 text-sm font-black text-[#221523]">{copy.cards.paymentTitle || (isAr ? 'التعاقد والسداد' : 'Payment methods')}</h3>
                        <p className="mt-2 text-sm leading-7 text-[#756B73]">{copy.cards.paymentDesc}</p>
                      </div>
                      <div className="rounded-2xl border border-[#F0D989] bg-[#FFF9E8] p-5">
                        <div className="flex items-center gap-2 text-sm font-black text-[#745400]">
                          <MessageCircle className="h-5 w-5" />
                          {isAr ? 'تفاصيل أوضح، رد أدق' : 'Clearer details, sharper reply'}
                        </div>
                        <p className="mt-2 text-sm leading-7 text-[#76663D]">{isAr ? 'اكتب هدف المشروع والتحدي الحالي لنفهم نقطة البداية بسرعة.' : 'Share your goal and current challenge so we can understand the starting point quickly.'}</p>
                      </div>
                    </aside>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

      {step === 1 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E6D9E3] bg-white/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_32px_rgba(74,31,64,0.09)] backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-lg items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-black text-[#6D0758]">{selectionCount(selectedServices.length, isAr)}</p>
              <p className="mt-0.5 truncate text-[11px] text-[#80747D]">{isAr ? 'اختر الخدمة المناسبة ثم تابع' : 'Choose the right service, then continue'}</p>
            </div>
            <button
              type="button"
              disabled={!canContinue}
              onClick={() => moveToStep(2)}
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#9D027C] px-5 py-3 text-sm font-black text-white shadow-[0_10px_20px_rgba(157,2,124,0.2)] disabled:cursor-not-allowed disabled:bg-[#D8CCD5] disabled:text-[#8F838C] disabled:shadow-none"
            >
              {isAr ? 'متابعة' : 'Continue'}
              <ArrowRight className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E6D9E3] bg-white/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_32px_rgba(74,31,64,0.09)] backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => moveToStep(1)}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#E2D5DF] bg-white px-4 py-3 text-sm font-black text-[#6D0758]"
            >
              <ArrowLeft className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} />
              {isAr ? 'رجوع' : 'Back'}
            </button>
            <button
              type="button"
              onClick={() => moveToStep(3)}
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#9D027C] px-5 py-3 text-sm font-black text-white shadow-[0_10px_20px_rgba(157,2,124,0.2)]"
            >
              {isAr ? 'متابعة' : 'Continue'}
              <ArrowRight className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
