'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Check, CheckCircle2, ChevronLeft, ChevronRight, Loader2, MoreHorizontal, Send, Target } from 'lucide-react';
import type { CountryCode } from 'libphonenumber-js';
import type { Language } from '../types';
import { PUBLIC_API, siteFetch } from '../lib/siteApi';
import PhoneCountryField from './PhoneCountryField';
import { DEFAULT_PHONE_COUNTRY, getLocaleCountry, isValidPhoneCountry, parseWhatsAppPhone } from '../lib/phone';

type CampaignForm = {
  name: string;
  phone: string;
  phoneCountry: CountryCode;
  email: string;
  businessName: string;
  activity: string;
  offer: string;
  campaignGoal: string;
  audience: string;
  locations: string;
  monthlyBudget: number;
  platforms: string[];
  website: string;
  socialLinks: string;
  brandIdentity: string;
  assets: string;
  brandColors: string;
  logoUrl: string;
  assetLinks: string;
  notes: string;
};

const platformOptions = [
  ['meta', 'Meta / Facebook'], ['instagram', 'Instagram'], ['tiktok', 'TikTok'],
  ['google', 'Google Ads'], ['snapchat', 'Snapchat'], ['youtube', 'YouTube'],
  ['linkedin', 'LinkedIn'], ['x', 'X'], ['whatsapp', 'WhatsApp'], ['other', 'أخرى'],
];
const platformLogos: Record<string, string> = {
  meta: '/logos/meta.png',
  instagram: '/logos/instagram.png',
  tiktok: '/logos/tiktok.png',
  google: '/technology-phone/social/google.svg',
  snapchat: '/logos/snapchat.png',
  youtube: '/technology-phone/social/youtube.svg',
  linkedin: '/technology-phone/social/linkedin.svg',
  x: '/logos/x.png',
  whatsapp: '/logos/whatsapp.png',
  other: '/technology-phone/social/other.svg',
};
const campaignGoalIds = new Set(['sales', 'leads', 'messages', 'awareness', 'traffic']);

type AdvertisingBudgetConfig = { options: number[]; min: number; max: number; step: number };
const defaultBudgetOptions = [10500, 15000, 20000, 25000, 30000];
const defaultBudgetConfig: AdvertisingBudgetConfig = { options: defaultBudgetOptions, min: defaultBudgetOptions[0], max: defaultBudgetOptions[defaultBudgetOptions.length - 1], step: defaultBudgetOptions[1] - defaultBudgetOptions[0] };

function normalizeBudgetConfig(value: Partial<AdvertisingBudgetConfig> | null | undefined): AdvertisingBudgetConfig {
  const options = Array.isArray(value?.options)
    ? [...new Set(value.options.map(Number))].filter(item => Number.isInteger(item) && item >= 10500).sort((a, b) => a - b)
    : defaultBudgetOptions;
  const safeOptions = options.length >= 2 ? options : defaultBudgetOptions;
  return { options: safeOptions, min: safeOptions[0], max: safeOptions[safeOptions.length - 1], step: safeOptions[1] - safeOptions[0] };
}

function snapBudget(value: number, config: AdvertisingBudgetConfig) {
  const safeValue = Number.isFinite(value) ? value : config.options[0];
  return config.options.reduce((closest, option) => Math.abs(option - safeValue) < Math.abs(closest - safeValue) ? option : closest, config.options[0]);
}

function hasRealText(value: string, minimumLength = 2) {
  return value.trim().length >= minimumLength && /\p{L}/u.test(value);
}

const initialForm: CampaignForm = {
  name: '', phone: '', phoneCountry: DEFAULT_PHONE_COUNTRY, email: '', businessName: '', activity: '', offer: '', campaignGoal: '',
  audience: '', locations: '', monthlyBudget: 10500, platforms: [], website: '', socialLinks: '',
  brandIdentity: '', assets: '', brandColors: '', logoUrl: '', assetLinks: '', notes: '',
};

interface AdvertisingCampaignDashboardProps {
  currentLang: Language;
}

export default function AdvertisingCampaignDashboard({ currentLang }: AdvertisingCampaignDashboardProps) {
  const isAr = currentLang === 'ar';
  const [form, setForm] = useState<CampaignForm>(initialForm);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [budgetConfig, setBudgetConfig] = useState<AdvertisingBudgetConfig>(defaultBudgetConfig);
  const steps = isAr ? ['النشاط', 'الحملة', 'المنصات والهوية', 'المراجعة'] : ['Business', 'Campaign', 'Channels & identity', 'Review'];

  useEffect(() => {
    let active = true;
    siteFetch<AdvertisingBudgetConfig>('/advertising-budget').then(config => {
      if (!active || !config) return;
      const nextConfig = normalizeBudgetConfig(config);
      setBudgetConfig(nextConfig);
      setForm(previous => ({ ...previous, monthlyBudget: snapBudget(previous.monthlyBudget, nextConfig) }));
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    const localeCountry = getLocaleCountry();
    if (localeCountry) setForm(previous => ({ ...previous, phoneCountry: localeCountry }));
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 2500);
    fetch('https://ipapi.co/json/', { signal: controller.signal })
      .then(response => response.ok ? response.json() : null)
      .then(payload => {
        const detected = payload?.country_code as CountryCode | undefined;
        if (active && detected && isValidPhoneCountry(detected)) setForm(previous => ({ ...previous, phoneCountry: detected }));
      })
      .catch(() => undefined)
      .finally(() => window.clearTimeout(timeout));
    return () => { active = false; controller.abort(); window.clearTimeout(timeout); };
  }, []);

  const update = <K extends keyof CampaignForm>(key: K, value: CampaignForm[K]) => setForm(previous => ({ ...previous, [key]: value }));
  const togglePlatform = (id: string) => update('platforms', form.platforms.includes(id) ? form.platforms.filter(item => item !== id) : [...form.platforms, id]);
  const amount = useMemo(() => form.monthlyBudget.toLocaleString(isAr ? 'ar-EG' : 'en-US'), [form.monthlyBudget, isAr]);
  const budgetIndex = Math.max(0, budgetConfig.options.indexOf(form.monthlyBudget));
  const budgetProgress = budgetConfig.options.length > 1 ? (budgetIndex / (budgetConfig.options.length - 1)) * 100 : 0;

  const validateStep = () => {
    if (step === 0 && !hasRealText(form.name, 2)) return isAr ? 'اكتب اسمًا حقيقيًا من حرفين على الأقل.' : 'Enter a real name with at least two letters.';
    if (step === 0 && !parseWhatsAppPhone(form.phone, form.phoneCountry)) return isAr ? 'اكتب رقم واتساب صحيحًا واختر الدولة المناسبة.' : 'Enter a valid WhatsApp number and choose the correct country.';
    if (step === 0 && !hasRealText(form.activity, 3)) return isAr ? 'اكتب نشاطًا تجاريًا حقيقيًا وواضحًا.' : 'Enter a real, clear business activity.';
    if (step === 1 && !campaignGoalIds.has(form.campaignGoal)) return isAr ? 'اختر هدفًا حقيقيًا للحملة.' : 'Choose a valid campaign goal.';
    if (step === 2 && (!form.platforms.length || !budgetConfig.options.includes(form.monthlyBudget))) return isAr ? `اختر منصة واحدة على الأقل وحدد سعرًا من الاختيارات المتاحة: ${budgetConfig.options.map(option => option.toLocaleString('ar-EG')).join('، ')} جنيه.` : `Select at least one platform and one of the configured budgets: ${budgetConfig.options.join(', ')} EGP.`;
    return '';
  };

  const next = () => {
    const message = validateStep();
    if (message) { setError(message); return; }
    setError('');
    setStep(value => Math.min(value + 1, steps.length - 1));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const message = validateStep();
    if (message || submitting) { setError(message); return; }
    setSubmitting(true);
    setError('');
    try {
      const normalizedPhone = parseWhatsAppPhone(form.phone, form.phoneCountry);
      if (!normalizedPhone) {
        setError(isAr ? 'رقم واتساب غير صحيح للدولة المختارة.' : 'The phone number is not valid for the selected country.');
        setSubmitting(false);
        return;
      }
      const response = await fetch(`${PUBLIC_API}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: 'advertising', name: form.name.trim(), phone: normalizedPhone, email: form.email.trim() || null,
          company: form.businessName.trim() || null, businessActivity: form.activity.trim(), budget: form.monthlyBudget,
          requestDetails: {
            phoneCountry: form.phoneCountry, phoneInternational: normalizedPhone, productOrService: form.offer.trim(), campaignGoal: form.campaignGoal.trim(), targetAudience: form.audience.trim(),
            targetLocations: form.locations.trim(), monthlyBudget: form.monthlyBudget, budgetOptions: budgetConfig.options, platforms: form.platforms,
            platformNames: form.platforms.map(id => platformOptions.find(([optionId]) => optionId === id)?.[1] || id),
            website: form.website.trim(), socialLinks: form.socialLinks.trim(), brandIdentity: form.brandIdentity,
            assets: form.assets, brandColors: form.brandColors.trim(), logoUrl: form.logoUrl.trim(), assetLinks: form.assetLinks.trim(), notes: form.notes.trim(),
          },
          message: form.notes.trim() || `Advertising campaign brief: ${form.activity.trim()}`,
          source: 'website-advertising-dashboard',
        }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || (isAr ? 'تعذر إرسال البريف.' : 'Unable to submit campaign brief.'));
      }
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : (isAr ? 'تعذر إرسال الطلب الآن.' : 'Unable to submit the request right now.'));
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'mt-1.5 w-full rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-[#9d027c] focus:bg-slate-950 focus:ring-2 focus:ring-[#9d027c]/10';
  const labelClass = 'block text-sm font-bold text-slate-300';

  if (submitted) {
    return <div className="mx-auto max-w-4xl rounded-[28px] border border-emerald-500/20 bg-slate-900/40 p-10 text-center shadow-xl" dir={isAr ? 'rtl' : 'ltr'}><CheckCircle2 className="mx-auto text-emerald-500" size={64} /><h3 className="mt-5 text-2xl font-black text-slate-100">{isAr ? 'تم إرسال بريف الحملة' : 'Campaign brief sent'}</h3><p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-400">{isAr ? 'وصلتنا كل تفاصيل النشاط والميزانية والمنصات. سيتواصل معك فريقنا لمراجعة الخطوة التالية.' : 'We received your business, budget, platform, and identity details. Our team will follow up with the next step.'}</p></div>;
  }

  return (
    <section id="advertising-plans-row" className="mx-auto max-w-7xl rounded-[30px] border border-slate-800 bg-slate-900/40 p-4 sm:p-6 lg:p-8" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="mb-8 border-b border-slate-800 pb-6">
        <h3 className="text-2xl font-black text-slate-100 sm:text-3xl">{isAr ? 'جهز بريف حملة مرتبط بهدف واضح' : 'Build a campaign brief around a clear goal'}</h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{isAr ? 'املأ بيانات النشاط، الجمهور، الميزانية، والمنصات حتى يراجع الفريق الحملة على أساس صحيح.' : 'Share the business, audience, budget, and platforms so the team can review the campaign properly.'}</p>
      </div>
      <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-4">{steps.map((item, index) => <div key={item} className={`rounded-xl px-3 py-3 text-center text-xs font-black transition ${index === step ? 'bg-[#9d027c] text-white shadow-lg shadow-[#9d027c]/15' : index < step ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-950/30 text-slate-500'}`}><span className="mb-1 block text-[10px] opacity-70">0{index + 1}</span>{item}</div>)}</div>
      <form onSubmit={submit}>
        {step === 0 && <div className="grid gap-5 md:grid-cols-2"><label className={labelClass}>{isAr ? 'الاسم الكامل' : 'Full name'}<input className={inputClass} value={form.name} onChange={event => update('name', event.target.value)} /></label><PhoneCountryField currentLang={isAr ? 'ar' : 'en'} country={form.phoneCountry} phone={form.phone} onCountryChange={country => update('phoneCountry', country)} onPhoneChange={phone => update('phone', phone)} inputClass={inputClass} labelClass={labelClass} /><label className={labelClass}>{isAr ? 'اسم البراند أو الشركة (اختياري)' : 'Brand or company name (optional)'}<input className={inputClass} value={form.businessName} onChange={event => update('businessName', event.target.value)} /></label><label className={labelClass}>{isAr ? 'البريد الإلكتروني (اختياري)' : 'Email (optional)'}<input type="email" className={inputClass} value={form.email} onChange={event => update('email', event.target.value)} /></label><label className={`${labelClass} md:col-span-2`}>{isAr ? 'النشاط التجاري' : 'Business activity'}<input className={inputClass} placeholder={isAr ? 'مثال: عيادة أسنان أو متجر ملابس' : 'Example: dental clinic or fashion store'} value={form.activity} onChange={event => update('activity', event.target.value)} /></label><label className={`${labelClass} md:col-span-2`}>{isAr ? 'ما الذي تريد الترويج له؟' : 'What are you promoting?'}<textarea rows={3} className={inputClass} value={form.offer} onChange={event => update('offer', event.target.value)} /></label></div>}
        {step === 1 && <div className="grid gap-5 md:grid-cols-2"><label className={labelClass}>{isAr ? 'هدف الحملة' : 'Campaign goal'}<select className={inputClass} value={form.campaignGoal} onChange={event => update('campaignGoal', event.target.value)}><option value="">{isAr ? 'اختر الهدف' : 'Choose a goal'}</option><option value="sales">{isAr ? 'مبيعات وطلبات' : 'Sales and orders'}</option><option value="leads">{isAr ? 'عملاء محتملون' : 'Lead generation'}</option><option value="messages">{isAr ? 'رسائل وواتساب' : 'Messages and WhatsApp'}</option><option value="awareness">{isAr ? 'وصول ووعي بالبراند' : 'Reach and awareness'}</option><option value="traffic">{isAr ? 'زيارات للموقع' : 'Website traffic'}</option></select></label><label className={labelClass}>{isAr ? 'الجمهور المستهدف' : 'Target audience'}<input className={inputClass} placeholder={isAr ? 'العمر، الاهتمامات، نوع العميل' : 'Age, interests, customer type'} value={form.audience} onChange={event => update('audience', event.target.value)} /></label><label className={labelClass}>{isAr ? 'المدن أو المناطق' : 'Target locations'}<input className={inputClass} value={form.locations} onChange={event => update('locations', event.target.value)} /></label><label className={labelClass}>{isAr ? 'الموقع الإلكتروني (اختياري)' : 'Website (optional)'}<input dir="ltr" className={inputClass} value={form.website} onChange={event => update('website', event.target.value)} /></label><label className={`${labelClass} md:col-span-2`}>{isAr ? 'روابط الحسابات الحالية (اختياري)' : 'Current social links (optional)'}<textarea rows={3} dir="ltr" className={inputClass} value={form.socialLinks} onChange={event => update('socialLinks', event.target.value)} /></label></div>}
        {step === 2 && <div><div className="mb-6"><div className="mb-2 flex items-center justify-between"><label className={labelClass}>{isAr ? 'الميزانية الشهرية للإعلانات' : 'Monthly advertising budget'}</label><strong className="text-lg font-black text-slate-100">{amount} {isAr ? 'ج.م' : 'EGP'}</strong></div><input type="range" min={0} max={budgetConfig.options.length - 1} step={1} aria-label={isAr ? 'الميزانية الشهرية للإعلانات' : 'Monthly advertising budget'} className="advertising-budget-range" value={budgetIndex} onChange={event => update('monthlyBudget', budgetConfig.options[Number(event.target.value)] || budgetConfig.options[0])} style={{ background: `linear-gradient(to left, #9d027c 0%, #9d027c ${budgetProgress}%, #1e293b ${budgetProgress}%, #1e293b 100%)` }} /><div className="mt-2 flex items-center justify-between text-xs font-bold text-slate-400"><span>{budgetConfig.options[0].toLocaleString(isAr ? 'ar-EG' : 'en-US')} {isAr ? 'ج.م' : 'EGP'}</span><span>{budgetConfig.options[budgetConfig.options.length - 1].toLocaleString(isAr ? 'ar-EG' : 'en-US')} {isAr ? 'ج.م' : 'EGP'}</span></div><div className="mt-3 flex flex-wrap justify-center gap-2">{budgetConfig.options.map(option => <span key={option} className={`rounded-full px-2.5 py-1 text-[11px] font-black transition ${option === form.monthlyBudget ? 'bg-[#9d027c] text-white' : 'bg-[#9d027c]/10 text-magenta'}`}>{option.toLocaleString(isAr ? 'ar-EG' : 'en-US')}</span>)}</div></div><div className="mb-6"><p className={`${labelClass} mb-3`}>{isAr ? 'المنصات التي تعمل عليها أو تريد استخدامها' : 'Platforms you use or want to activate'}</p><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{platformOptions.map(([id, label]) => <button type="button" key={id} aria-pressed={form.platforms.includes(id)} onClick={() => togglePlatform(id)} className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-bold transition ${form.platforms.includes(id) ? 'border-[#9d027c]/50 bg-[#9d027c]/10 text-magenta shadow-sm' : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'}`}><span className="flex min-w-0 items-center gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-900 p-1"><img src={platformLogos[id]} alt="" aria-hidden="true" className="h-full w-full object-contain" draggable="false" />{!platformLogos[id] && <MoreHorizontal size={17} className="text-slate-500" />}</span><span>{label}</span></span>{form.platforms.includes(id) && <Check size={17} aria-hidden="true" />}</button>)}</div></div><div className="grid gap-5 md:grid-cols-2"><label className={labelClass}>{isAr ? 'حالة الهوية البصرية' : 'Visual identity status'}<select className={inputClass} value={form.brandIdentity} onChange={event => update('brandIdentity', event.target.value)}><option value="">{isAr ? 'اختر الحالة' : 'Choose status'}</option><option value="complete">{isAr ? 'هوية مكتملة' : 'Complete identity'}</option><option value="partial">{isAr ? 'هوية جزئية' : 'Partial identity'}</option><option value="new">{isAr ? 'نحتاج بناء الهوية' : 'Need identity direction'}</option></select></label><label className={labelClass}>{isAr ? 'الأصول المتاحة' : 'Available assets'}<select className={inputClass} value={form.assets} onChange={event => update('assets', event.target.value)}><option value="">{isAr ? 'اختر' : 'Choose'}</option><option value="logo">{isAr ? 'شعار وصور' : 'Logo and images'}</option><option value="photo-video">{isAr ? 'صور وفيديو' : 'Photo and video'}</option><option value="none">{isAr ? 'لا توجد أصول جاهزة' : 'No ready assets'}</option></select></label></div><div className="mt-5 grid gap-5 md:grid-cols-2"><label className={labelClass}>{isAr ? 'رابط الشعار (اختياري)' : 'Logo link (optional)'}<input dir="ltr" className={inputClass} value={form.logoUrl} onChange={event => update('logoUrl', event.target.value)} /></label><label className={labelClass}>{isAr ? 'ألوان الهوية (اختياري)' : 'Brand colors (optional)'}<input className={inputClass} placeholder={isAr ? 'مثال: كحلي، ماجنتا، أصفر' : 'Example: navy, magenta, yellow'} value={form.brandColors} onChange={event => update('brandColors', event.target.value)} /></label><label className={`${labelClass} md:col-span-2`}>{isAr ? 'روابط الصور والفيديو أو مجلد الأصول (اختياري)' : 'Photo/video or asset folder links (optional)'}<textarea rows={2} dir="ltr" className={inputClass} value={form.assetLinks} onChange={event => update('assetLinks', event.target.value)} /></label></div></div>}
        {step === 3 && <div className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]"><div className="space-y-3"><div className="rounded-2xl bg-slate-900/40 p-4"><p className="text-xs font-bold text-slate-500">{isAr ? 'النشاط' : 'Business'}</p><strong className="mt-1 block text-slate-200">{form.businessName || form.activity}</strong><p className="mt-1 text-sm text-slate-400">{form.activity}</p></div><div className="rounded-2xl bg-slate-900/40 p-4"><p className="text-xs font-bold text-slate-500">{isAr ? 'الهدف والجمهور' : 'Goal and audience'}</p><strong className="mt-1 block text-slate-200">{form.campaignGoal}</strong><p className="mt-1 text-sm text-slate-400">{form.audience || (isAr ? 'لم يحدد بعد' : 'Not specified')} · {form.locations || (isAr ? 'كل المناطق' : 'All locations')}</p></div><div className="rounded-2xl bg-slate-900/40 p-4"><p className="text-xs font-bold text-slate-500">{isAr ? 'المنصات' : 'Platforms'}</p><p className="mt-1 text-sm font-bold text-magenta">{form.platforms.join(' · ')}</p></div></div><div className="rounded-3xl bg-[#221523] p-6 text-white"><Target className="text-[#ffbc01]" size={28} /><p className="mt-5 text-xs font-bold text-white/50">{isAr ? 'ميزانية الإنفاق الشهري' : 'Monthly media spend'}</p><strong className="mt-1 block text-4xl font-black">{amount}</strong><span className="text-sm text-white/60">{isAr ? 'جنيه مصري، بدون رسوم خطة' : 'EGP, no plan fee'}</span><label className="mt-7 block text-sm font-bold">{isAr ? 'ملاحظات إضافية' : 'Additional notes'}<textarea rows={4} className="mt-2 w-full rounded-xl border-0 bg-white/10 px-3 py-3 text-sm text-white outline-none placeholder:text-white/40" value={form.notes} onChange={event => update('notes', event.target.value)} /></label></div></div>}
        {error && <p className="mt-5 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm font-bold text-red-400">{error}</p>}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-800 pt-6"><button type="button" disabled={step === 0} onClick={() => { setError(''); setStep(value => Math.max(value - 1, 0)); }} className="inline-flex items-center gap-2 rounded-xl border border-slate-800 px-4 py-3 text-sm font-black text-slate-400 disabled:invisible hover:border-slate-700 hover:text-slate-200">{isAr ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}{isAr ? 'السابق' : 'Back'}</button>{step < steps.length - 1 ? <button type="button" onClick={next} className="inline-flex items-center gap-2 rounded-xl bg-[#9d027c] px-5 py-3 text-sm font-black text-white">{isAr ? 'التالي' : 'Continue'}{isAr ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}</button> : <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-xl bg-[#9d027c] px-5 py-3 text-sm font-black text-white disabled:opacity-60">{submitting ? <Loader2 className="animate-spin" size={17} /> : <Send size={17} />}{isAr ? 'إرسال البريف' : 'Send campaign brief'}</button>}</div>
      </form>
    </section>
  );
}
