'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, ChevronLeft, Globe2, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { publicDriveUrl } from '../lib/siteApi';

type Lang = 'ar' | 'en';

export interface ServiceDetailData {
  id: number;
  slug: string;
  titleAr: string;
  titleEn?: string | null;
  descAr?: string | null;
  descEn?: string | null;
  contentAr?: string | null;
  contentEn?: string | null;
  detailsAr?: string | null;
  detailsEn?: string | null;
  featuresAr?: string[] | string | null;
  featuresEn?: string[] | string | null;
  features?: string[] | string | null;
  coverImage?: string | null;
  image?: string | null;
  imageUrl?: string | null;
  goalKeys?: string[] | string | null;
  themeKey?: string | null;
  theme?: string | null;
  projects?: Array<{
    id: number;
    titleAr: string;
    titleEn?: string | null;
    descAr?: string | null;
    descEn?: string | null;
    image?: string | null;
    clientName?: string | null;
    link?: string | null;
    imageUrl?: string | null;
    category?: string | null;
  }>;
  portfolios?: Array<{
    id: number;
    titleAr: string;
    titleEn?: string | null;
    descAr?: string | null;
    descEn?: string | null;
    image?: string | null;
    imageUrl?: string | null;
    category?: string | null;
    clientName?: string | null;
    link?: string | null;
  }>;
}

const goalCopy: Record<string, { ar: string; en: string }> = {
  sales: { ar: 'زيادة المبيعات', en: 'Grow sales' },
  brand: { ar: 'بناء البراند', en: 'Build your brand' },
  platform: { ar: 'إطلاق منصة', en: 'Launch a platform' },
  content: { ar: 'صناعة المحتوى', en: 'Create content' },
  automation: { ar: 'أتمتة العمل', en: 'Automate operations' },
  'increase-sales': { ar: 'زيادة المبيعات', en: 'Grow sales' },
  'build-brand': { ar: 'بناء البراند', en: 'Build your brand' },
  'launch-platform': { ar: 'إطلاق منصة', en: 'Launch a platform' },
  'create-content': { ar: 'صناعة المحتوى', en: 'Create content' },
  'automate-work': { ar: 'أتمتة العمل', en: 'Automate operations' },
};

function toList(value?: string[] | string | null) {
  if (Array.isArray(value)) return value.filter(item => typeof item === 'string' && item.trim());
  if (typeof value !== 'string' || !value.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter(item => typeof item === 'string' && item.trim());
  } catch {
    // Newline-separated values remain supported for older records.
  }
  return value.split('\n').map(item => item.trim()).filter(Boolean);
}

export default function ServiceDetailPage({ service }: { service: ServiceDetailData }) {
  const [lang, setLang] = useState<Lang>('ar');

  useEffect(() => {
    const saved = window.localStorage.getItem('site_lang');
    const nextLang: Lang = saved === 'en' ? 'en' : 'ar';
    setLang(nextLang);
    document.documentElement.lang = nextLang;
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
  }, []);

  const isAr = lang === 'ar';
  const title = (isAr ? service.titleAr : service.titleEn) || service.titleAr;
  const summary = (isAr ? service.descAr : service.descEn) || service.descAr || '';
  const content = (isAr ? service.contentAr || service.detailsAr : service.contentEn || service.detailsEn)
    || service.contentAr || service.detailsAr || summary;
  const features = toList(isAr ? service.featuresAr || service.features : service.featuresEn || service.features);
  const goals = toList(service.goalKeys);
  const cover = publicDriveUrl(service.coverImage || service.image, service.imageUrl);
  const projects = service.projects || service.portfolios || [];
  const backArrow = isAr ? <ArrowRight size={17} /> : <ArrowLeft size={17} />;
  const forwardArrow = isAr ? <ArrowLeft size={17} /> : <ArrowRight size={17} />;
  const contactHref = `/contact?service=${encodeURIComponent(service.slug)}`;

  const goalLabels = useMemo(() => goals.map(goal => goalCopy[goal]?.[lang] || goal).filter(Boolean), [goals, lang]);

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#15202b]" dir={isAr ? 'rtl' : 'ltr'}>
      <header className="sticky top-0 z-30 border-b border-[#e6e8ee] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label={isAr ? 'العودة للرئيسية' : 'Back to home'}>
            <img src="/logo.svg" alt="S C Marketing" className="h-10 w-auto max-w-[170px] object-contain" />
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/services" className="hidden rounded-full px-4 py-2 text-sm font-bold text-[#465463] transition hover:bg-[#f4f0f3] hover:text-[#9d027c] sm:inline-flex">
              {isAr ? 'كل الخدمات' : 'All services'}
            </Link>
            <button type="button" onClick={() => setLang(current => current === 'ar' ? 'en' : 'ar')} className="rounded-full border border-[#eadce7] bg-white px-3 py-2 text-xs font-black text-[#9d027c] transition hover:border-[#9d027c]">
              {isAr ? 'EN' : 'AR'}
            </button>
            <Link href={contactHref} className="inline-flex items-center gap-2 rounded-full bg-[#9d027c] px-4 py-2 text-sm font-black text-white shadow-[0_12px_30px_rgba(157,2,124,0.2)] transition hover:-translate-y-0.5 hover:bg-[#7e0063]">
              {isAr ? 'ابدأ مشروعك' : 'Start your project'}
              {forwardArrow}
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8">
        <div className="pointer-events-none absolute -right-28 -top-32 h-[430px] w-[430px] rounded-full bg-[#9d027c]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-36 -left-24 h-[380px] w-[380px] rounded-full bg-[#ffbc01]/15 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <Link href="/services" className="inline-flex items-center gap-2 text-sm font-black text-[#6b7280] transition hover:text-[#9d027c]">
              {backArrow}
              {isAr ? 'العودة إلى الخدمات' : 'Back to services'}
            </Link>
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#eadce7] bg-white/75 px-4 py-2 text-[11px] font-black tracking-[0.16em] text-[#9d027c]">
              <Sparkles size={14} />
              <span>{isAr ? 'مسار نمو قابل للتنفيذ' : 'EXECUTABLE GROWTH PATH'}</span>
            </div>
            <h1 className="mt-5 max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-black leading-[1.18] tracking-normal text-[#11141b]">{title}</h1>
            {summary && <p className="mt-6 max-w-2xl text-base leading-8 text-[#4b5563] sm:text-lg">{summary}</p>}
            {goalLabels.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-2">
                {goalLabels.map(goal => <span key={goal} className="rounded-full bg-[#9d027c]/8 px-3 py-1.5 text-xs font-black text-[#8a006d]">{goal}</span>)}
              </div>
            )}
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={contactHref} className="inline-flex items-center gap-2 rounded-full bg-[#9d027c] px-6 py-3.5 text-sm font-black text-white shadow-[0_16px_34px_rgba(157,2,124,0.22)] transition hover:-translate-y-0.5 hover:bg-[#7e0063]">
                {isAr ? 'اطلب هذه الخدمة' : 'Request this service'}
                {forwardArrow}
              </Link>
              <Link href="/services" className="inline-flex items-center gap-2 rounded-full border border-[#d8c5ad] bg-white px-6 py-3.5 text-sm font-black text-[#53434e] transition hover:border-[#9d027c] hover:text-[#9d027c]">
                {isAr ? 'استكشف باقي الخدمات' : 'Explore all services'}
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[32px] border border-white bg-white p-2 shadow-[0_28px_70px_rgba(49,39,48,0.14)] sm:p-3">
            {cover ? (
              <img src={cover} alt={title} className="aspect-[4/3] w-full rounded-[25px] object-cover" />
            ) : (
              <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[25px] bg-[linear-gradient(135deg,#32142b,#9d027c_56%,#ffbc01)]">
                <Globe2 className="h-24 w-24 text-white/90" strokeWidth={1.1} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.35),transparent_35%)]" />
              </div>
            )}
          </div>
        </div>
      </section>

      {(content || features.length > 0) && (
        <section className="border-y border-[#e7e7ea] bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-20">
            <article>
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#9d027c]">{isAr ? 'عن الخدمة' : 'ABOUT THE SERVICE'}</div>
              <h2 className="mt-4 text-[clamp(1.85rem,4vw,2.65rem)] font-black leading-[1.22] text-[#11141b]">{isAr ? 'ما الذي سننفذه داخل هذه الخدمة؟' : 'What will we execute inside this service?'}</h2>
              {content && <p className="mt-6 whitespace-pre-line text-base leading-8 text-[#4b5563]">{content}</p>}
            </article>
            {features.length > 0 && (
              <aside className="rounded-[28px] border border-[#eadce7] bg-[#fffafd] p-6 sm:p-8">
                <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#9d027c]">{isAr ? 'المخرجات' : 'DELIVERABLES'}</div>
                <ul className="mt-6 grid gap-4">
                  {features.map(feature => (
                    <li key={feature} className="flex items-start gap-3 text-sm font-bold leading-7 text-[#3d3440]">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#9d027c] text-white"><Check size={12} /></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </aside>
            )}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#9d027c]">{isAr ? 'أعمال مرتبطة' : 'RELATED WORK'}</div>
              <h2 className="mt-4 text-[clamp(1.85rem,4vw,2.65rem)] font-black leading-[1.22] text-[#11141b]">{isAr ? 'نماذج مرتبطة بهذا المسار' : 'Work samples connected to this track'}</h2>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map(project => {
                const projectTitle = (isAr ? project.titleAr : project.titleEn) || project.titleAr;
                const projectDesc = (isAr ? project.descAr : project.descEn) || project.descAr || project.category || '';
                const projectImage = publicDriveUrl(project.image, project.imageUrl);
                const card = (
                  <article className="group overflow-hidden rounded-[24px] border border-[#e5e7eb] bg-white shadow-[0_16px_34px_rgba(35,30,37,0.06)] transition hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(35,30,37,0.12)]">
                    {projectImage && <img src={projectImage} alt={projectTitle} className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.03]" />}
                    <div className="p-5">
                      {project.clientName && <div className="text-xs font-black text-[#9d027c]">{project.clientName}</div>}
                      <h3 className="mt-2 text-lg font-black text-[#1d2027]">{projectTitle}</h3>
                      {projectDesc && <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#667085]">{projectDesc}</p>}
                    </div>
                  </article>
                );
                return project.link ? <a key={project.id} href={project.link} target="_blank" rel="noreferrer">{card}</a> : <div key={project.id}>{card}</div>;
              })}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-[#eadce7] bg-[#251521] px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#ffcc4d]">SELECT GROWTH SYSTEM</div>
            <h2 className="mt-4 text-[clamp(1.85rem,4vw,2.65rem)] font-black leading-[1.22]">{isAr ? 'لنضع هذه الخدمة داخل مسار نمو كامل.' : 'Let us connect this service to a complete growth path.'}</h2>
          </div>
          <Link href={contactHref} className="inline-flex items-center gap-2 rounded-full bg-[#ffbc01] px-6 py-3.5 text-sm font-black text-[#2b1b25] transition hover:-translate-y-0.5 hover:bg-[#ffd153]">
            {isAr ? 'اطلب عرضك الآن' : 'Request your brief'}
            {forwardArrow}
          </Link>
        </div>
      </section>
    </main>
  );
}
