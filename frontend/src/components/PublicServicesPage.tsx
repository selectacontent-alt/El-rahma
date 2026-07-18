"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Target, WandSparkles } from 'lucide-react';
import { Language } from '../types';
import { siteFetch } from '../lib/siteApi';
import {
  normalizePublicServices,
  type GrowthGoalKey,
  type PublicService,
} from '../lib/growthSite';
import { growthGoals, GrowthServiceCard } from './HomePage';

interface PublicServicesPageProps {
  currentLang: Language;
  onContact: (serviceSlugs?: string[]) => void;
}

/**
 * The /services tab intentionally reuses the exact cards and goal system from
 * the home command center; both read the same public Service contract.
 */
export default function PublicServicesPage({ currentLang: lang, onContact }: PublicServicesPageProps) {
  const [remoteServices, setRemoteServices] = useState<PublicService[] | null | undefined>(undefined);
  const [selectedGoal, setSelectedGoal] = useState<GrowthGoalKey | null>(null);
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    siteFetch<unknown>('/services', { signal: controller.signal })
      .then((payload) => {
        if (!controller.signal.aborted) setRemoteServices(payload ? normalizePublicServices(payload) : null);
      })
      .catch(() => {
        if (!controller.signal.aborted) setRemoteServices(null);
      });
    return () => controller.abort();
  }, []);

  const services = useMemo(() => remoteServices || [], [remoteServices]);

  return (
    <section id="services" className="relative min-h-[75vh] overflow-hidden pb-24 pt-32 sm:pb-32">
      <div className="pointer-events-none absolute right-0 top-24 h-[440px] w-[440px]" style={{ background: 'radial-gradient(circle, rgba(157,2,124,0.12) 0%, transparent 70%)' }} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
            <WandSparkles className="h-4 w-4" />
            {lang === 'ar' ? 'كل مسارات النمو' : 'All growth tracks'}
          </div>
          <h1 className="mt-4 text-[clamp(2rem,5vw,3.5rem)] font-black leading-[1.18] tracking-normal text-white">
            {lang === 'ar' ? 'اختر الخدمة التي تخدم هدفك التجاري الآن.' : 'Choose the service that supports your business goal now.'}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
            {lang === 'ar' ? 'استعرض الخدمات حسب هدف النمو: ظهور، طلبات، مبيعات، تشغيل، أو هوية. كل خدمة مرتبطة بمخرجات واضحة قابلة للتنفيذ.' : 'Browse services by growth goal: visibility, requests, sales, operations, or identity. Every service is tied to clear deliverables.'}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {growthGoals.map(({ key, titleAr, titleEn, subtitleAr, subtitleEn, Icon }) => {
            const active = selectedGoal === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedGoal((current) => current === key ? null : key)}
                className={`rounded-2xl border p-4 text-start transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${active ? 'border-amber-300/70 bg-amber-300/10' : 'border-white/10 bg-slate-900/45 hover:border-violet-300/50'}`}
              >
                <Icon className={`h-5 w-5 ${active ? 'text-amber-300' : 'text-violet-300'}`} />
                <span className="mt-5 block text-xs font-black text-slate-100">{lang === 'ar' ? titleAr : titleEn}</span>
                <span className="mt-1.5 block text-[11px] leading-4 text-slate-500">{lang === 'ar' ? subtitleAr : subtitleEn}</span>
              </button>
            );
          })}
        </div>

        {remoteServices === undefined ? (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label={lang === 'ar' ? 'جارٍ تحميل الخدمات' : 'Loading services'}>
            {[0, 1, 2].map((item) => <div key={item} className="h-[285px] animate-pulse rounded-[1.55rem] border border-white/10 bg-slate-900/40" />)}
          </div>
        ) : services.length ? (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <GrowthServiceCard
                key={service.slug}
                service={service}
                lang={lang}
                activeGoal={selectedGoal}
                selected={selectedServiceSlug === service.slug}
                onSelect={() => setSelectedServiceSlug((current) => current === service.slug ? null : service.slug)}
                onContact={() => onContact([service.slug])}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed border-white/15 bg-slate-900/35 p-10 text-center text-sm text-slate-400">
            {lang === 'ar' ? 'لا توجد خدمات مفعّلة حاليًا.' : 'There are no active services right now.'}
          </div>
        )}

        <div className="mt-16 rounded-[2rem] border border-violet-300/20 bg-gradient-to-br from-violet-500/15 to-slate-900/55 p-7 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-amber-200"><Target className="h-4 w-4" />{lang === 'ar' ? 'مش محتاج تبدأ من خدمة واحدة؟' : 'Need more than one service?'}</div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">{lang === 'ar' ? 'ابعث لنا هدف مشروعك وسنرتب معك البداية الصحيحة.' : 'Tell us your business goal and we will help arrange the right start.'}</p>
          </div>
          <button type="button" onClick={() => onContact(selectedServiceSlug ? [selectedServiceSlug] : [])} className="mt-5 shrink-0 rounded-full bg-amber-300 px-5 py-3 text-xs font-black text-slate-950 transition hover:-translate-y-0.5 sm:mt-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
            {lang === 'ar' ? 'ابدأ مشروعك' : 'Start your project'}
          </button>
        </div>
      </div>
    </section>
  );
}
