'use client';

import { FormEvent, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, Loader2, Send, X } from 'lucide-react';
import type { CountryCode } from 'libphonenumber-js';
import type { Language } from '../types';
import { PUBLIC_API } from '../lib/siteApi';
import PhoneCountryField from './PhoneCountryField';
import { DEFAULT_PHONE_COUNTRY, getLocaleCountry, isValidPhoneCountry, parseWhatsAppPhone } from '../lib/phone';
import type { PlanCartItem } from '../lib/planCart';

export interface PlanRequestSnapshot extends PlanCartItem {}

interface PlanRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  snapshot: PlanRequestSnapshot | null;
}

export default function PlanRequestModal({ isOpen, onClose, currentLang, snapshot }: PlanRequestModalProps) {
  const isAr = currentLang === 'ar';
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
    if (!isOpen) {
      setSubmitted(false);
      setError('');
    }
  }, [isOpen]);

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

  const resetAndClose = () => {
    setName('');
    setPhone('');
    setPhoneCountry(DEFAULT_PHONE_COUNTRY);
    setCompany('');
    setEmail('');
    setNotes('');
    setError('');
    setSubmitted(false);
    onClose();
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!snapshot || submitting) return;
    const normalizedPhone = parseWhatsAppPhone(phone, phoneCountry);
    if (!name.trim() || !normalizedPhone || !company.trim()) {
      setError(isAr ? 'اكتب الاسم ورقم الهاتف واسم أو نشاط الشركة.' : 'Name, phone, and business name or activity are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
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
          planSection: snapshot.section,
          planId: snapshot.id,
          planTitle: snapshot.title,
          planPrice: snapshot.price ?? null,
          planCurrency: snapshot.currency || 'EGP',
          requestDetails: {
            description: snapshot.description || '',
            features: snapshot.features || [],
            ...(snapshot.details || {}),
          },
          message: notes.trim() || `Plan request: ${snapshot.title}`,
          source: `website-${snapshot.section}-plan`,
        }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || `Request failed (${response.status})`);
      }
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : (isAr ? 'تعذر إرسال الطلب الآن.' : 'Unable to submit the request right now.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" dir={isAr ? 'rtl' : 'ltr'}>
          <motion.button aria-label={isAr ? 'إغلاق' : 'Close'} className="absolute inset-0 cursor-default bg-[#0f172a]/70 backdrop-blur-sm" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-white/10 bg-white p-6 text-[#221523] shadow-2xl sm:p-8" initial={{ opacity: 0, y: 24, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: .97 }}>
            <button type="button" onClick={onClose} className="absolute left-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800" aria-label={isAr ? 'إغلاق' : 'Close'}><X size={18} /></button>
            {!submitted ? (
              <>
                <div className="mb-6 border-b border-slate-100 pb-5">
                  <span className="text-[11px] font-black uppercase tracking-[.2em] text-[#9d027c]">{isAr ? 'طلب خطة' : 'Plan request'}</span>
                  <h2 className="mt-2 text-2xl font-black text-[#221523]">{isAr ? 'ثبّت اختيارك وسنتواصل معك' : 'Confirm your selection'}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{isAr ? 'ستصلنا تفاصيل الخطة كاملة مع بيانات التواصل.' : 'We will receive the full plan snapshot with your contact details.'}</p>
                </div>
                {snapshot && (
                  <div className="mb-6 rounded-2xl border border-[#9d027c]/15 bg-[#9d027c]/5 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold text-[#9d027c]">{isAr ? 'الخطة المختارة' : 'Selected plan'}</p>
                        <h3 className="mt-1 text-lg font-black">{snapshot.title}</h3>
                      </div>
                      {snapshot.price !== null && snapshot.price !== undefined && (
                        <strong className="whitespace-nowrap text-lg text-[#9d027c]">{snapshot.price.toLocaleString()} {snapshot.currency || 'EGP'}</strong>
                      )}
                    </div>
                    {!!snapshot.features?.length && <p className="mt-3 text-xs leading-5 text-slate-500">{snapshot.features.slice(0, 3).join(' • ')}</p>}
                  </div>
                )}
                <form className="space-y-4" onSubmit={submit}>
                  <label className="block text-sm font-bold">{isAr ? 'الاسم الكامل' : 'Full name'}<input className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#9d027c]" value={name} onChange={event => setName(event.target.value)} autoComplete="name" /></label>
                    <PhoneCountryField currentLang={isAr ? 'ar' : 'en'} country={phoneCountry} phone={phone} onCountryChange={setPhoneCountry} onPhoneChange={setPhone} inputClass="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#9d027c]" labelClass="block text-sm font-bold" />
                  <label className="block text-sm font-bold">{isAr ? 'اسم أو نشاط الشركة' : 'Business name or activity'}<input className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#9d027c]" value={company} onChange={event => setCompany(event.target.value)} /></label>
                  <label className="block text-sm font-bold">{isAr ? 'البريد الإلكتروني (اختياري)' : 'Email (optional)'}<input type="email" className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#9d027c]" value={email} onChange={event => setEmail(event.target.value)} autoComplete="email" /></label>
                  <label className="block text-sm font-bold">{isAr ? 'ملاحظات (اختياري)' : 'Notes (optional)'}<textarea rows={3} className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#9d027c]" value={notes} onChange={event => setNotes(event.target.value)} /></label>
                  {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
                  <button disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#9d027c] px-5 py-3.5 font-black text-white shadow-lg shadow-[#9d027c]/20 transition hover:bg-[#820267] disabled:cursor-wait disabled:opacity-60">
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    {isAr ? 'إرسال الطلب' : 'Send request'}
                  </button>
                </form>
              </>
            ) : (
              <div className="py-12 text-center">
                <CheckCircle2 className="mx-auto text-emerald-500" size={64} />
                <h2 className="mt-5 text-2xl font-black">{isAr ? 'تم استلام طلبك' : 'Request received'}</h2>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">{isAr ? 'وصلتنا تفاصيل اختيارك ورقمك، وسيتواصل معك الفريق لمراجعة الخطوات.' : 'Your selected plan and phone number are now with our team.'}</p>
                <button type="button" onClick={resetAndClose} className="mt-8 rounded-xl bg-[#221523] px-6 py-3 font-bold text-white">{isAr ? 'إغلاق' : 'Close'}</button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
