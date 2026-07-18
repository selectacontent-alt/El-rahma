'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import type { CountryCode } from 'libphonenumber-js';
import { DEFAULT_PHONE_COUNTRY, formatPhoneInput, getPhoneCountryOptions } from '../lib/phone';

interface PhoneCountryFieldProps {
  currentLang: 'ar' | 'en';
  country: CountryCode;
  phone: string;
  onCountryChange: (country: CountryCode) => void;
  onPhoneChange: (phone: string) => void;
  inputClass: string;
  labelClass: string;
  error?: string;
}

function CountryFlag({ code, emoji }: { code?: string; emoji?: string }) {
  return <span className="relative inline-flex h-5 w-7 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-slate-100"><span className="text-base leading-none">{emoji || '🌐'}</span>{code && <img src={`https://flagcdn.com/28x21/${code.toLowerCase()}.png`} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" onError={event => { event.currentTarget.style.display = 'none'; }} />}</span>;
}

export default function PhoneCountryField({ currentLang, country, phone, onCountryChange, onPhoneChange, inputClass, labelClass, error }: PhoneCountryFieldProps) {
  const isAr = currentLang === 'ar';
  const countries = useMemo(() => getPhoneCountryOptions(), []);
  const selectedCountry = countries.find(item => item.code === country) || countries.find(item => item.code === DEFAULT_PHONE_COUNTRY);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const filteredCountries = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return countries;
    return countries.filter(item => [item.nameAr, item.nameEn, item.code, item.dialCode].some(value => value.toLocaleLowerCase().includes(normalizedQuery)));
  }, [countries, query]);

  useEffect(() => {
    const closeWhenOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', closeWhenOutside);
    return () => document.removeEventListener('mousedown', closeWhenOutside);
  }, []);

  const chooseCountry = (nextCountry: CountryCode) => {
    onCountryChange(nextCountry);
    if (phone) onPhoneChange(formatPhoneInput(phone, nextCountry));
    setQuery('');
    setOpen(false);
  };

  return (
    <label className={labelClass}>
      {isAr ? 'رقم الهاتف / واتساب' : 'Phone / WhatsApp'}
      <div className="mt-1.5 grid grid-cols-[minmax(0,1fr)_7.5rem] gap-2" dir="ltr">
        <input
          dir="ltr"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          className={inputClass}
          value={phone}
          onChange={event => onPhoneChange(formatPhoneInput(event.target.value, country))}
          placeholder={isAr ? 'رقمك المحلي بدون رمز الدولة' : 'Local number without country code'}
        />
        <div className="relative" ref={wrapperRef} dir={isAr ? 'rtl' : 'ltr'}>
          <button
            type="button"
            aria-label={isAr ? 'الدولة ورمز الاتصال' : 'Country and calling code'}
            aria-expanded={open}
            className={`${inputClass} flex items-center justify-between gap-2 text-left text-[#0b0b12]`}
            onClick={() => setOpen(value => !value)}
          >
            <span className="flex min-w-0 items-center gap-2"><CountryFlag code={selectedCountry?.code} emoji={selectedCountry?.flag} /><span className="truncate text-xs font-bold">{isAr ? selectedCountry?.nameAr : selectedCountry?.nameEn}</span></span>
            <span className="flex shrink-0 items-center gap-1 text-xs font-black text-[#9d027c]" dir="ltr">{selectedCountry?.dialCode || '+20'}<ChevronDown size={15} className={`transition ${open ? 'rotate-180' : ''}`} /></span>
          </button>
          {open && <div className={`absolute ${isAr ? 'right-0' : 'left-0'} top-full z-[70] mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#9d027c]/20 bg-white p-2 text-[#0b0b12] shadow-[0_18px_50px_rgba(34,21,35,.2)]`} dir={isAr ? 'rtl' : 'ltr'}>
            <div className="relative mb-2"><Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9d027c]" /><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder={isAr ? 'ابحث باسم الدولة أو الرمز...' : 'Search country or code...'} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs font-semibold text-[#0b0b12] outline-none focus:border-[#9d027c] focus:ring-2 focus:ring-[#9d027c]/10" dir={isAr ? 'rtl' : 'ltr'} /></div>
            <div className="max-h-64 overflow-y-auto pr-1" role="listbox">
              {filteredCountries.length ? filteredCountries.map(item => <button key={item.code} type="button" role="option" aria-selected={item.code === country} onClick={() => chooseCountry(item.code)} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs transition hover:bg-[#9d027c]/8 ${item.code === country ? 'bg-[#9d027c]/10 font-black text-[#9d027c]' : 'font-semibold text-[#0b0b12]'}`}><span className="flex min-w-0 items-center gap-2"><CountryFlag code={item.code} emoji={item.flag} /><span className="truncate">{isAr ? item.nameAr : item.nameEn}</span></span><span className="flex shrink-0 items-center gap-1 text-[11px] font-black text-[#0b0b12]" dir="ltr">{item.dialCode}{item.code === country && <Check size={14} className="text-[#9d027c]" />}</span></button>) : <p className="px-3 py-5 text-center text-xs font-bold text-slate-400">{isAr ? 'لا توجد دولة بهذا البحث' : 'No country found'}</p>}
            </div>
          </div>}
        </div>
      </div>
      {error && <span className="mt-1 block text-xs font-semibold text-red-600">{error}</span>}
    </label>
  );
}
