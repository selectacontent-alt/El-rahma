'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Headphones,
  Loader2,
  PackageCheck,
  Plus,
  Send,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
} from 'lucide-react';
import type { CountryCode } from 'libphonenumber-js';
import type { Language } from '../types';
import { PUBLIC_API } from '../lib/siteApi';
import { clearPlanCart, PLAN_CART_UPDATED_EVENT, readPlanCart, type PlanCartItem, writePlanCart } from '../lib/planCart';
import { DEFAULT_PHONE_COUNTRY, getLocaleCountry, isValidPhoneCountry, parseWhatsAppPhone } from '../lib/phone';
import PhoneCountryField from './PhoneCountryField';

interface PlanCheckoutPageProps {
  currentLang: Language;
  setActiveTab: (tab: string) => void;
}

const sectionLabels: Record<string, { ar: string; en: string }> = {
  software: { ar: 'حلول برمجية', en: 'Software' },
  social: { ar: 'سوشيال ميديا', en: 'Social media' },
  media: { ar: 'ميديا وإنتاج', en: 'Media production' },
  branding: { ar: 'هوية بصرية', en: 'Branding' },
};

function money(value: number, currency = 'EGP', isAr = true) {
  return `${value.toLocaleString(isAr ? 'ar-EG' : 'en-US')} ${currency}`;
}

function numeric(value?: number | null) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

const fieldClass = 'mt-2 h-[3.65rem] w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-4 text-sm font-semibold text-slate-100 outline-none transition-colors placeholder:text-slate-500 hover:border-slate-700 focus:border-[#9d027c] focus:bg-slate-950 focus:ring-4 focus:ring-[#9d027c]/10';
const labelClass = 'block text-sm font-bold text-slate-300';

export default function PlanCheckoutPage({ currentLang, setActiveTab }: PlanCheckoutPageProps) {
  const isAr = currentLang === 'ar';
  const [items, setItems] = useState<PlanCartItem[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneCountry, setPhoneCountry] = useState<CountryCode>(DEFAULT_PHONE_COUNTRY);
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const refreshCart = () => setItems(readPlanCart());
    refreshCart();
    window.addEventListener(PLAN_CART_UPDATED_EVENT, refreshCart);
    return () => window.removeEventListener(PLAN_CART_UPDATED_EVENT, refreshCart);
  }, []);

  useEffect(() => {
    const localeCountry = getLocaleCountry();
    if (localeCountry) setPhoneCountry(localeCountry);
    let active = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 2500);
    fetch('https://ipapi.co/json/', { signal: controller.signal })
      .then(response => response.ok ? response.json() : null)
      .then(payload => {
        const detected = payload?.country_code as CountryCode | undefined;
        if (active && detected && isValidPhoneCountry(detected)) setPhoneCountry(detected);
      })
      .catch(() => undefined)
      .finally(() => window.clearTimeout(timeout));
    return () => { active = false; controller.abort(); window.clearTimeout(timeout); };
  }, []);

  const totals = useMemo(() => {
    const finalTotal = items.reduce((total, item) => total + numeric(item.price), 0);
    const originalTotal = items.reduce((total, item) => {
      const beforeDiscount = numeric(item.originalPrice);
      const afterDiscount = numeric(item.price);
      return total + (beforeDiscount > afterDiscount ? beforeDiscount : afterDiscount);
    }, 0);
    return { finalTotal, originalTotal, savings: Math.max(originalTotal - finalTotal, 0) };
  }, [items]);

  const summaryCurrency = items[0]?.currency || 'EGP';

  const removeItem = (item: PlanCartItem) => {
    const nextItems = items.filter(current => !(current.section === item.section && current.id === item.id));
    setItems(nextItems);
    writePlanCart(nextItems);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting || !items.length) return;
    const normalizedPhone = parseWhatsAppPhone(phone, phoneCountry);
    if (!name.trim() || !normalizedPhone || !company.trim()) {
      setError(isAr ? 'اكتب الاسم ورقم الهاتف واسم الشركة أو النشاط.' : 'Name, phone, and business name or activity are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const firstItem = items[0];
      const response = await fetch(`${PUBLIC_API}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: 'plan',
          name: name.trim(),
          phone: normalizedPhone,
          phoneCountry,
          company: company.trim(),
          businessActivity: company.trim(),
          email: email.trim() || null,
          planSection: firstItem.section,
          planId: items.map(item => `${item.section}:${item.id}`).join(', '),
          planTitle: items.map(item => item.title).join(' + '),
          planPrice: totals.finalTotal || null,
          planCurrency: firstItem.currency || 'EGP',
          requestDetails: {
            cart: items,
            cartTotal: totals.finalTotal,
            originalTotal: totals.originalTotal,
            savings: totals.savings,
          },
          message: notes.trim() || `Cart request: ${items.map(item => item.title).join(', ')}`,
          source: 'website-plan-cart',
        }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || `Request failed (${response.status})`);
      }
      clearPlanCart();
      setItems([]);
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : (isAr ? 'تعذر إرسال الطلب الآن.' : 'Unable to submit the request right now.'));
    } finally {
      setSubmitting(false);
    }
  };

  const goToPackages = () => setActiveTab('software');

  if (submitted) {
    return (
      <section dir={isAr ? 'rtl' : 'ltr'} className="relative flex min-h-screen items-center overflow-hidden bg-transparent px-4 pb-[max(5rem,calc(1.25rem+env(safe-area-inset-bottom)))] pt-[calc(7rem+env(safe-area-inset-top))] text-slate-100 sm:px-6 sm:pt-32">
        <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/40 p-6 text-center shadow-none sm:rounded-[2.5rem] sm:p-12">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#9d027c] via-[#d735a9] to-[#ffbc01]" />
          <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"><CheckCircle2 size={48} strokeWidth={1.8} /></span>
          <span className="mt-7 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-xs font-black text-emerald-450"><BadgeCheck size={15} />{isAr ? 'تم إرسال التفاصيل بنجاح' : 'Details sent successfully'}</span>
          <h1 className="mt-4 text-[clamp(2rem,4vw,2.65rem)] font-black leading-[1.2] tracking-normal">{isAr ? 'طلبك وصل لفريقنا' : 'Your request is with our team'}</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-8 text-slate-400 sm:text-base">{isAr ? 'وصلتنا الخطط وبيانات التواصل كاملة. سيراجع الفريق التفاصيل ويتواصل معك لتأكيد نطاق العمل والخطوة التالية.' : 'We received your selected plans and contact details. Our team will review everything and contact you with the next step.'}</p>
          <div className="mt-7 grid gap-3 text-start sm:grid-cols-3">
            {[
              { icon: Check, ar: 'مراجعة التفاصيل', en: 'Details reviewed' },
              { icon: Headphones, ar: 'تواصل من الفريق', en: 'Team follow-up' },
              { icon: Sparkles, ar: 'تأكيد خطة البداية', en: 'Kickoff confirmed' },
            ].map(({ icon: Icon, ar, en }, index) => (
              <div key={en} className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/40 p-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#9d027c]/10 text-magenta"><Icon size={17} /></span>
                <span><small className="block text-[10px] font-black text-slate-500">0{index + 1}</small><strong className="block text-xs text-slate-350">{isAr ? ar : en}</strong></span>
              </div>
            ))}
          </div>
          <button type="button" onClick={goToPackages} className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#9d027c] px-6 py-3.5 font-black text-white transition-colors hover:bg-[#820267] focus:outline-none focus:ring-4 focus:ring-[#9d027c]/20">{isAr ? 'تصفح باقي الخطط' : 'Browse more plans'}<ChevronLeft className={isAr ? '' : 'rotate-180'} size={18} /></button>
        </div>
      </section>
    );
  }

  return (
    <section dir={isAr ? 'rtl' : 'ltr'} className="relative min-h-screen overflow-hidden bg-transparent px-4 pb-[max(5rem,calc(1.5rem+env(safe-area-inset-bottom)))] pt-[calc(6.5rem+env(safe-area-inset-top))] text-slate-100 sm:px-6 sm:pt-28 lg:px-8">

      <div className="relative mx-auto max-w-7xl">
        <button type="button" onClick={goToPackages} className="group inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/40 px-4 py-2.5 text-xs font-black text-slate-400 shadow-sm transition-colors hover:border-slate-700 hover:text-slate-200">
          <ArrowLeft className={`transition group-hover:-translate-x-0.5 ${isAr ? 'rotate-180 group-hover:translate-x-0.5' : ''}`} size={15} />
          {isAr ? 'العودة للخطط' : 'Back to plans'}
        </button>

        <header className="mt-7">
          <div className="max-w-3xl">
            <h1 className="max-w-4xl text-[clamp(1.9rem,5vw,3.25rem)] font-black leading-[1.18] tracking-normal text-slate-100">
              {isAr ? 'راجع اختياراتك قبل تجهيز العرض' : 'Review your choices before we prepare the offer'}
            </h1>
          </div>
        </header>

        {!items.length ? (
          <div className="relative mt-10 overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/40 p-7 text-center shadow-none sm:rounded-[2.5rem] sm:p-14">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#9d027c] via-[#d735a9] to-[#ffbc01]" />
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.7rem] border border-[#9d027c]/20 bg-[#9d027c]/10 text-magenta"><ShoppingBag size={34} strokeWidth={1.8} /></span>
            <h2 className="mt-6 text-2xl font-black sm:text-3xl">{isAr ? 'ابدأ باختيار خدمة مناسبة' : 'Start by choosing a service'}</h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-400">{isAr ? 'اختر خطة أو نطاقاً مخصصاً، وستظهر هنا التفاصيل التي يحتاجها الفريق لتجهيز عرض واضح.' : 'Choose a plan or custom scope, and the details will appear here so the team can prepare a clear offer.'}</p>
            <button type="button" onClick={goToPackages} className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#9d027c] px-6 py-3.5 font-black text-white transition-colors hover:bg-[#820267]"><Plus size={18} />{isAr ? 'استعرض الخطط' : 'Explore plans'}</button>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-7 xl:grid-cols-[minmax(0,1fr)_25rem]">
            <section className="order-1 min-w-0 lg:col-start-1 lg:row-start-1" aria-labelledby="selected-plans-heading">
              <div className="mb-4 flex items-center justify-between gap-3 px-1">
                <div>
                  <span className="text-[11px] font-black tracking-[.14em] text-magenta">{isAr ? '01 — اختياراتك' : '01 — YOUR SELECTION'}</span>
                  <h2 id="selected-plans-heading" className="mt-1 text-xl font-black sm:text-2xl text-slate-100">{isAr ? 'الخطط المختارة' : 'Selected plans'}</h2>
                </div>
                <button type="button" onClick={goToPackages} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-xs font-black text-slate-400 transition-colors hover:border-slate-750 hover:text-slate-200"><Plus size={15} />{isAr ? 'إضافة خطة' : 'Add plan'}</button>
              </div>

              <div className="space-y-3.5">
                {items.map((item, index) => {
                  const price = numeric(item.price);
                  const before = numeric(item.originalPrice);
                  const label = sectionLabels[item.section]?.[isAr ? 'ar' : 'en'] || item.section;
                  const itemSaving = Math.max(before - price, 0);
                  return (
                    <article key={`${item.section}:${item.id}`} className="group relative overflow-hidden rounded-[1.65rem] border border-slate-800 bg-slate-900/40 p-4 shadow-none transition-colors hover:border-slate-700 sm:p-5">
                      <div className="absolute inset-y-0 start-0 w-1 bg-gradient-to-b from-[#9d027c] to-[#ffbc01] opacity-80" />
                      <div className="flex items-start gap-3.5 sm:gap-4">
                        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-[0_12px_28px_rgba(34,21,35,.2)] sm:h-14 sm:w-14">
                          <PackageCheck size={23} />
                          <small className="absolute -end-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-slate-900 bg-[#ffbc01] px-1 text-[9px] font-black text-slate-950">{index + 1}</small>
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[10px] font-black tracking-[.12em] text-magenta">{label}</span>
                                {itemSaving > 0 && <span className="rounded-full bg-[#ffbc01]/18 px-2 py-1 text-[9px] font-black text-[#8a6200]">{isAr ? `وفّر ${money(itemSaving, item.currency, true)}` : `Save ${money(itemSaving, item.currency, false)}`}</span>}
                              </div>
                              <h3 className="mt-1 break-words text-lg font-black leading-7 text-slate-100 sm:text-xl">{item.title}</h3>
                            </div>
                            <button type="button" onClick={() => removeItem(item)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-transparent text-slate-500 transition hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-400 focus:outline-none focus:ring-4 focus:ring-red-100" aria-label={isAr ? 'حذف الخطة' : 'Remove plan'}><Trash2 size={17} /></button>
                          </div>

                          {item.description && <p className="mt-2 max-w-3xl text-xs leading-6 text-slate-400 sm:text-sm">{item.description}</p>}

                          {!!item.features?.length && (
                            <div className="mt-3.5 flex flex-wrap gap-2">
                              {item.features.slice(0, 5).map(feature => <span key={feature} className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950/40 px-2.5 py-1.5 text-[10px] font-bold text-slate-300 sm:text-[11px]"><Check size={12} className="text-[#ffbc01]" />{feature}</span>)}
                              {item.features.length > 5 && <span className="rounded-full border border-[#9d027c]/20 bg-[#9d027c]/10 px-2.5 py-1.5 text-[10px] font-black text-magenta">+{item.features.length - 5}</span>}
                            </div>
                          )}

                          <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-slate-800 pt-4">
                            <div>
                              {before > price && <p className="mb-0.5 text-xs font-bold text-slate-500 line-through">{money(before, item.currency, isAr)}</p>}
                              <p className="text-xl font-black text-[#ffbc01] sm:text-2xl">{price ? money(price, item.currency, isAr) : (isAr ? 'سعر حسب الطلب' : 'Custom quote')}</p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/15 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-black text-emerald-450"><CheckCircle2 size={13} />{isAr ? 'مضافة للطلب' : 'In your request'}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <aside className="order-2 h-fit overflow-hidden rounded-[1.8rem] border border-[#3d2c39] bg-[#241722] p-5 text-white shadow-[0_18px_50px_rgba(36,23,34,.16)] lg:sticky lg:top-28 lg:col-start-2 lg:row-span-2 lg:row-start-1 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div><span className="text-[10px] font-black tracking-[.15em] text-[#ffd566]">{isAr ? 'ملخص سريع' : 'QUICK SUMMARY'}</span><h2 className="mt-1 text-xl font-black">{isAr ? 'ملخص الطلب' : 'Order summary'}</h2></div>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-[#ffcf4d]"><ShieldCheck size={21} /></span>
              </div>

              <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-black/10 p-4 text-sm">
                <div className="flex items-center justify-between text-white/70"><span>{isAr ? 'عدد الخطط' : 'Selected plans'}</span><strong className="flex h-7 min-w-7 items-center justify-center rounded-lg bg-white/10 px-2 text-white">{items.length}</strong></div>
                {totals.savings > 0 && <div className="flex items-center justify-between text-[#ffe08a]"><span>{isAr ? 'إجمالي التوفير' : 'Total savings'}</span><strong>{money(totals.savings, summaryCurrency, isAr)}</strong></div>}
              </div>

              <div className="mt-6">
                <span className="text-xs font-bold text-white/60">{isAr ? 'الإجمالي المتوقع' : 'Estimated total'}</span>
                {totals.originalTotal > totals.finalTotal && <p className="mt-2 text-sm font-bold text-white/40 line-through">{money(totals.originalTotal, summaryCurrency, isAr)}</p>}
                <strong className="mt-1 block text-3xl font-black leading-tight text-[#ffcf4d] sm:text-4xl">{totals.finalTotal ? money(totals.finalTotal, summaryCurrency, isAr) : (isAr ? 'حسب الطلب' : 'Custom')}</strong>
              </div>

              <div className="mt-6 flex gap-3 rounded-2xl border border-[#ffcf4d]/20 bg-[#ffcf4d]/10 p-4">
                <BadgeCheck className="mt-0.5 shrink-0 text-[#ffcf4d]" size={19} />
                <div><strong className="text-sm text-white">{isAr ? 'لن يتم خصم أي مبلغ الآن' : 'No charge is taken now'}</strong><p className="mt-1 text-xs leading-5 text-white/65">{isAr ? 'هذه الخطوة ترسل اختياراتك للفريق لمراجعة العرض والتواصل معك.' : 'This step sends your selection to our team for review and follow-up.'}</p></div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <div className="rounded-2xl border border-white/10 bg-white/7 p-3"><Clock3 size={16} className="text-[#ffcf4d]" /><strong className="mt-2 block text-xs">{isAr ? 'متابعة سريعة' : 'Fast follow-up'}</strong></div>
                <div className="rounded-2xl border border-white/10 bg-white/7 p-3"><Headphones size={16} className="text-[#ffcf4d]" /><strong className="mt-2 block text-xs">{isAr ? 'دعم مباشر' : 'Direct support'}</strong></div>
              </div>
            </aside>

            <form id="checkout-contact-form" onSubmit={submit} className="order-3 overflow-hidden rounded-[1.8rem] border border-slate-800 bg-slate-900/40 shadow-none lg:col-start-1 lg:row-start-2">
              <div className="border-b border-slate-800 bg-slate-950/20 p-5 sm:p-6">
                <span className="text-[11px] font-black tracking-[.14em] text-magenta">{isAr ? '02 — بيانات التواصل' : '02 — CONTACT DETAILS'}</span>
                <h2 className="mt-1 text-xl font-black sm:text-2xl text-slate-100">{isAr ? 'بيانات بسيطة لتجهيز العرض' : 'Simple details to prepare the offer'}</h2>
                <p className="mt-2 text-xs leading-6 text-slate-400 sm:text-sm">{isAr ? 'سنستخدم هذه البيانات للتواصل معك ومراجعة الخطة أو النطاق قبل أي تعاقد.' : 'We will use these details to contact you and review the plan or scope before any agreement.'}</p>
              </div>

              <div className="p-4 sm:p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className={labelClass}>{isAr ? 'الاسم الكامل *' : 'Full name *'}<input className={fieldClass} value={name} onChange={event => { setName(event.target.value); setError(''); }} autoComplete="name" placeholder={isAr ? 'اكتب اسمك بالكامل' : 'Enter your full name'} /></label>
                  <PhoneCountryField currentLang={isAr ? 'ar' : 'en'} country={phoneCountry} phone={phone} onCountryChange={setPhoneCountry} onPhoneChange={value => { setPhone(value); setError(''); }} inputClass="h-[3.65rem] w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-3 text-sm font-semibold text-slate-100 outline-none transition-colors placeholder:text-slate-500 hover:border-slate-700 focus:border-[#9d027c] focus:bg-slate-950 focus:ring-4 focus:ring-[#9d027c]/10" labelClass={labelClass} />
                  <label className={labelClass}>{isAr ? 'الشركة أو النشاط *' : 'Business or activity *'}<input className={fieldClass} value={company} onChange={event => { setCompany(event.target.value); setError(''); }} autoComplete="organization" placeholder={isAr ? 'اسم الشركة أو نوع نشاطك' : 'Company name or business type'} /></label>
                  <label className={labelClass}>{isAr ? 'البريد الإلكتروني (اختياري)' : 'Email (optional)'}<input type="email" className={fieldClass} value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" placeholder="name@company.com" dir="ltr" /></label>
                </div>

                <label className={`mt-4 ${labelClass}`}>{isAr ? 'ملاحظات أو متطلبات إضافية (اختياري)' : 'Notes or extra requirements (optional)'}<textarea rows={4} className={`${fieldClass} h-auto min-h-32 resize-y py-3.5 leading-6`} value={notes} onChange={event => setNotes(event.target.value)} placeholder={isAr ? 'اكتب أي تفاصيل تساعدنا نفهم احتياجك بشكل أفضل...' : 'Share anything that helps us understand your needs better...'} /></label>

                {error && <div role="alert" className="mt-4 flex items-start gap-2.5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-400"><AlertCircle className="mt-0.5 shrink-0" size={18} /><span>{error}</span></div>}

                <button disabled={submitting} className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-[#9d027c] px-6 py-4 font-black text-white transition-colors hover:bg-[#820267] focus:outline-none focus:ring-4 focus:ring-[#9d027c]/20 disabled:cursor-wait disabled:opacity-60">{submitting ? <Loader2 className="animate-spin" size={19} /> : <Send size={19} />}{isAr ? 'إرسال الطلب للفريق' : 'Send request to the team'}</button>
                <p className="mt-3 text-center text-[11px] font-bold leading-5 text-slate-400">{isAr ? 'بالإرسال أنت تشارك بياناتك فقط لمتابعة هذا الطلب، بدون دفع إلكتروني الآن.' : 'Submitting only shares your details for this request, with no online payment now.'}</p>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
