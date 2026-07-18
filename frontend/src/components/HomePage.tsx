"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowUpRight,
  Bot,
  Boxes,
  BriefcaseBusiness,
  Check,
  ChevronLeft,
  ChevronRight,
  Code2,
  Layers3,
  Megaphone,
  Palette,
  Play,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import { Language } from '../types';
import { addPlanToCart } from '../lib/planCart';
import { publicDriveUrl, siteFetch } from '../lib/siteApi';
import {
  normalizeHomePayload,
  type GrowthGoalKey,
  type PublicHomePayload,
  type PublicPortfolioProject,
  type PublicService,
  readHomeText,
  readHomeSteps,
} from '../lib/growthSite';
import { AnimatedCTA } from './BentoServices';
import SuccessPartnersCarousel from './SuccessPartnersCarousel';
import TechnologyPhoneShowcase from './TechnologyPhoneShowcase';
import { TypingEffect } from './TypingEffect';

interface HomePageProps {
  currentLang: Language;
  onContact: (serviceSlugs?: string[]) => void;
}

type PricingSection = 'software' | 'social' | 'media';

interface HomePricingPackage {
  id: number | string;
  section: PricingSection;
  softwareCategory?: string | null;
  isCustomPlan?: boolean;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  badgeAr?: string;
  badgeEn?: string;
  price: number;
  originalPrice?: number | null;
  currency: string;
  period?: 'monthly' | 'yearly' | 'once' | string;
  priceNoteAr?: string;
  priceNoteEn?: string;
  featuresAr: string[];
  featuresEn: string[];
  detailsAr?: string[];
  detailsEn?: string[];
  highlighted?: boolean;
  ctaText?: string;
  ctaLink?: string;
}

const pricingSections: PricingSection[] = ['software', 'social', 'media'];

const featuredSectionConfig: Record<PricingSection, {
  labelAr: string;
  labelEn: string;
  eyebrowAr: string;
  eyebrowEn: string;
  href: string;
  accent: string;
  soft: string;
  glow: string;
  Icon: LucideIcon;
  goalKeys: GrowthGoalKey[];
}> = {
  software: {
    labelAr: 'البرمجيات والمواقع',
    labelEn: 'Software & websites',
    eyebrowAr: 'حلول رقمية',
    eyebrowEn: 'Digital solutions',
    href: '/software',
    accent: '#9d027c',
    soft: 'rgba(157,2,124,.08)',
    glow: 'rgba(157,2,124,.18)',
    Icon: Code2,
    goalKeys: ['platform', 'automation', 'sales'],
  },
  social: {
    labelAr: 'إدارة السوشيال',
    labelEn: 'Social media',
    eyebrowAr: 'نمو المحتوى',
    eyebrowEn: 'Content growth',
    href: '/social',
    accent: '#f43f5e',
    soft: 'rgba(244,63,94,.08)',
    glow: 'rgba(244,63,94,.18)',
    Icon: Megaphone,
    goalKeys: ['sales', 'brand', 'content'],
  },
  media: {
    labelAr: 'الميديا والإنتاج',
    labelEn: 'Media production',
    eyebrowAr: 'صناعة الصورة',
    eyebrowEn: 'Visual production',
    href: '/media',
    accent: '#d69e00',
    soft: 'rgba(255,188,1,.11)',
    glow: 'rgba(255,188,1,.20)',
    Icon: Play,
    goalKeys: ['content', 'brand', 'sales'],
  },
};

const featuredPackageFallbacks: Record<PricingSection, HomePricingPackage> = {
  software: {
    id: 'software-featured-fallback',
    section: 'software',
    nameAr: 'خطة الأعمال الرقمية',
    nameEn: 'Digital Business Plan',
    descriptionAr: 'حل متكامل لإطلاق حضور رقمي احترافي قابل للنمو ومهيأ لتحويل الزوار إلى عملاء.',
    descriptionEn: 'A complete digital launch plan built to scale and turn visitors into customers.',
    price: 0,
    currency: 'EGP',
    priceNoteAr: 'عرض مخصص',
    priceNoteEn: 'Custom quote',
    featuresAr: ['تصميم احترافي متجاوب', 'تجربة سريعة ومهيأة للتحويل', 'دعم فني بعد الإطلاق'],
    featuresEn: ['Responsive premium design', 'Fast conversion-ready experience', 'Post-launch technical support'],
    highlighted: true,
  },
  social: {
    id: 'social-featured-fallback',
    section: 'social',
    nameAr: 'النمو الذكي المستهدف',
    nameEn: 'Smart Targeted Growth',
    descriptionAr: 'خطة محتوى وإدارة متكاملة للشركات التي تريد زيادة المبيعات وبناء حضور يومي قوي.',
    descriptionEn: 'A complete content and management plan for stronger daily presence and sales growth.',
    badgeAr: 'الأكثر اختياراً',
    badgeEn: 'Most selected',
    price: 9500,
    currency: 'EGP',
    period: 'monthly',
    featuresAr: ['28 منشور وفيديو ريلز شهرياً', 'إنتاج 8 فيديوهات Reels بالمونتاج', 'تغطية 4 منصات تواصل'],
    featuresEn: ['28 posts and reels monthly', '8 fully edited Reels', 'Coverage across 4 social platforms'],
    highlighted: true,
  },
  media: {
    id: 'media-featured-fallback',
    section: 'media',
    nameAr: 'ميكس إعلاني بريميوم',
    nameEn: 'Pro Media Hybrid',
    descriptionAr: 'مزيج قوي بين الصور الإعلانية والفيديوهات القصيرة لصناعة حملة بصرية متكاملة.',
    descriptionEn: 'A premium blend of commercial photography and short-form video for a complete visual campaign.',
    badgeAr: 'الأكثر طلباً',
    badgeEn: 'Most requested',
    price: 7500,
    currency: 'EGP',
    period: 'once',
    featuresAr: ['تصوير منتجات حتى 25 لقطة', 'إنتاج 3 فيديوهات قصيرة بالمونتاج', 'تسليم سريع مع تعديلين'],
    featuresEn: ['Product shoot up to 25 shots', '3 fully edited short videos', 'Priority delivery with 2 revisions'],
    highlighted: true,
  },
};

export const growthGoals: Array<{
  key: GrowthGoalKey;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  Icon: LucideIcon;
}> = [
  {
    key: 'sales',
    titleAr: 'زيادة المبيعات',
    titleEn: 'Grow sales',
    subtitleAr: 'نحوّل الاهتمام إلى طلبات واضحة.',
    subtitleEn: 'Turn attention into qualified demand.',
    Icon: TrendingUp,
  },
  {
    key: 'brand',
    titleAr: 'بناء البراند',
    titleEn: 'Build the brand',
    subtitleAr: 'هوية أكثر وضوحًا وثقة.',
    subtitleEn: 'Make the brand unmistakable.',
    Icon: Palette,
  },
  {
    key: 'platform',
    titleAr: 'إطلاق منصة',
    titleEn: 'Launch a platform',
    subtitleAr: 'تجربة رقمية جاهزة للنمو.',
    subtitleEn: 'Build a digital base for scale.',
    Icon: Boxes,
  },
  {
    key: 'content',
    titleAr: 'صناعة المحتوى',
    titleEn: 'Create content',
    subtitleAr: 'رسالة تبقى في الذاكرة.',
    subtitleEn: 'Create a message worth remembering.',
    Icon: Play,
  },
  {
    key: 'automation',
    titleAr: 'أتمتة العمل',
    titleEn: 'Automate work',
    subtitleAr: 'وقت أقل في التكرار، وتركيز أكبر.',
    subtitleEn: 'Less repetition. More momentum.',
    Icon: Bot,
  },
];

const iconMap: Record<string, LucideIcon> = {
  megaphone: Megaphone,
  marketing: Megaphone,
  palette: Palette,
  brush: Palette,
  code: Code2,
  code2: Code2,
  globe: Boxes,
  bot: Bot,
  brain: Bot,
  ai: Bot,
  video: Play,
  content: Play,
  layers: Layers3,
};

const serviceTheme = (themeKey?: string | null) => {
  const key = (themeKey || '').trim().toLowerCase();
  if (key === 'gold') {
    return { accent: '#fbbf24', glow: 'rgba(251,191,36,0.16)', soft: 'rgba(251,191,36,0.08)' };
  }
  if (key === 'rose') {
    return { accent: '#fb7185', glow: 'rgba(251,113,133,0.16)', soft: 'rgba(251,113,133,0.08)' };
  }
  if (key === 'ocean') {
    return { accent: '#38bdf8', glow: 'rgba(56,189,248,0.16)', soft: 'rgba(56,189,248,0.08)' };
  }
  if (key === 'forest') {
    return { accent: '#34d399', glow: 'rgba(52,211,153,0.16)', soft: 'rgba(52,211,153,0.08)' };
  }
  if (key === 'slate') {
    return { accent: '#94a3b8', glow: 'rgba(148,163,184,0.16)', soft: 'rgba(148,163,184,0.08)' };
  }
  if (['brand', 'branding', 'identity', 'design'].includes(key)) {
    return { accent: '#f43f5e', glow: 'rgba(244,63,94,0.16)', soft: 'rgba(244,63,94,0.08)' };
  }
  if (['platform', 'software', 'web', 'development'].includes(key)) {
    return { accent: '#38bdf8', glow: 'rgba(56,189,248,0.16)', soft: 'rgba(56,189,248,0.08)' };
  }
  if (['automation', 'ai', 'artificial-intelligence'].includes(key)) {
    return { accent: '#34d399', glow: 'rgba(52,211,153,0.16)', soft: 'rgba(52,211,153,0.08)' };
  }
  if (['content', 'media', 'social'].includes(key)) {
    return { accent: '#fbbf24', glow: 'rgba(251,191,36,0.16)', soft: 'rgba(251,191,36,0.08)' };
  }
  return { accent: '#a855f7', glow: 'rgba(168,85,247,0.16)', soft: 'rgba(168,85,247,0.08)' };
};

const visualIcon = (icon?: string | null) => {
  const normalized = (icon || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return iconMap[normalized] || Sparkles;
};

const projectServices = (services: PublicService[]) => {
  const seen = new Map<string, PublicPortfolioProject>();
  services.forEach((service) => {
    service.projects?.forEach((project) => {
      const existing = seen.get(project.id);
      const serviceSlugs = [...new Set([...(existing?.serviceSlugs || []), ...project.serviceSlugs, service.slug])];
      seen.set(project.id, { ...existing, ...project, serviceSlugs });
    });
  });
  return [...seen.values()];
};


const mainHeadingClass = 'text-[clamp(1.65rem,4vw,3rem)] font-black leading-[1.2] tracking-tight';

const projectImage = (project: PublicPortfolioProject) => (
  project.coverImage ? publicDriveUrl(project.coverImage, project.coverImage, 'w1200') : ''
);

function ProjectCard({ project, lang, featured = false }: { project: PublicPortfolioProject; lang: Language; featured?: boolean }) {
  const image = projectImage(project);
  const title = lang === 'ar' ? project.titleAr : project.titleEn;
  const summary = lang === 'ar' ? project.summaryAr : project.summaryEn;
  const content = (
    <article className={`group relative isolate overflow-hidden rounded-[1.6rem] border border-white/10 bg-slate-900/65 transition duration-500 hover:-translate-y-1 hover:border-white/25 ${featured ? 'min-h-[340px] sm:min-h-[410px]' : 'min-h-[250px]'}`}>
      {image ? (
        <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-90" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_16%,rgba(168,85,247,0.35),transparent_26%),linear-gradient(145deg,rgba(15,23,42,0.95),rgba(49,15,77,0.75))]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/45 to-transparent" />
      <div className="relative flex h-full min-h-[inherit] flex-col justify-end p-6 sm:p-8">
        <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-[#0f172a]/65 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/90 backdrop-blur">
          <BriefcaseBusiness className="h-3.5 w-3.5 text-amber-300" />
          {lang === 'ar' ? 'عمل مرتبط' : 'Connected work'}
        </div>
        <h3 className={`${featured ? 'text-2xl sm:text-4xl' : 'text-xl'} font-black tracking-tight text-white`}>{title}</h3>
        {summary && <p className="mt-3 max-w-2xl text-sm leading-6 text-white/85">{summary}</p>}
        {project.href && (
          <span className="mt-5 inline-flex items-center gap-2 text-xs font-black text-amber-300">
            {lang === 'ar' ? 'شاهد المشروع' : 'View project'}
            <ArrowUpRight className="h-4 w-4" />
          </span>
        )}
      </div>
    </article>
  );

  return project.href ? (
    <a href={project.href} target={project.href.startsWith('http') ? '_blank' : undefined} rel={project.href.startsWith('http') ? 'noreferrer' : undefined}>
      {content}
    </a>
  ) : content;
}

export function GrowthServiceCard({
  service,
  lang,
  activeGoal,
  selected,
  onSelect,
  onContact,
}: {
  service: PublicService;
  lang: Language;
  activeGoal: GrowthGoalKey | null;
  selected: boolean;
  onSelect: () => void;
  onContact: () => void;
}) {
  const theme = serviceTheme(service.themeKey);
  const Icon = visualIcon(service.icon);
  const title = lang === 'ar' ? service.titleAr : service.titleEn;
  const description = lang === 'ar' ? service.descAr : service.descEn;
  const goalMatched = !activeGoal || service.goalKeys.includes(activeGoal);
  const href = service.destinationPath || `/services/${encodeURIComponent(service.slug)}`;

  return (
    <motion.article
      layout
      className={`group relative flex min-h-[285px] flex-col overflow-hidden rounded-[1.55rem] border bg-white/90 p-5 backdrop-blur-sm transition duration-300 sm:p-6 ${
        selected ? 'ring-1 ring-[#9d027c]/40' : ''
      } ${goalMatched ? 'opacity-100' : 'opacity-45 grayscale-[0.15]'}`}
      style={{ borderColor: selected ? theme.accent : 'rgba(148,163,184,0.17)', boxShadow: selected ? `0 18px 50px ${theme.glow}` : undefined }}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-2xl" style={{ background: theme.glow }} />
      <div className="relative flex items-start justify-between gap-4">
        <button
          type="button"
          onClick={onSelect}
          aria-pressed={selected}
          className="rounded-2xl border p-3 text-left transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9d027c]"
          style={{ borderColor: theme.glow, background: theme.soft, color: theme.accent }}
          aria-label={lang === 'ar' ? `فلترة الأعمال لخدمة ${title}` : `Filter work for ${title}`}
        >
          <Icon className="h-6 w-6" />
        </button>
        <div className="flex flex-wrap justify-end gap-1.5">
          {service.goalKeys.slice(0, 2).map((key) => {
            const goal = growthGoals.find((item) => item.key === key);
            return goal ? (
              <span key={key} className="rounded-full border border-white/10 bg-slate-950/50 px-2.5 py-1 text-[9px] font-black text-slate-300">
                {lang === 'ar' ? goal.titleAr : goal.titleEn}
              </span>
            ) : null;
          })}
        </div>
      </div>

      <div className="relative mt-8">
        <h3 className="text-xl font-black tracking-tight text-[#0f172a] sm:text-2xl">{title}</h3>
        {description && <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>}
      </div>

      <div className="relative mt-auto flex flex-wrap items-center justify-between gap-3 pt-7">
        <a href={href} className="inline-flex items-center gap-2 text-xs font-black text-[#8a066d] transition hover:text-[#a16207] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9d027c]">
          {lang === 'ar' ? 'استكشف الخدمة' : 'Explore service'}
          {lang === 'ar' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </a>
        <button
          type="button"
          onClick={onContact}
          className="rounded-full border px-3.5 py-2 text-[10px] font-black transition hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          style={{ borderColor: theme.glow, background: theme.soft, color: '#1e293b' }}
        >
          {lang === 'ar' ? 'ابدأ بها' : 'Start here'}
        </button>
      </div>
    </motion.article>
  );
}

const packagePrice = (pkg: HomePricingPackage, lang: Language) => {
  if (Number(pkg.price) > 0) {
    return `${Number(pkg.price).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')} ${pkg.currency || 'EGP'}`;
  }
  return (lang === 'ar' ? pkg.priceNoteAr : pkg.priceNoteEn) || (lang === 'ar' ? 'عرض مخصص' : 'Custom quote');
};

const packagePeriod = (period: HomePricingPackage['period'], lang: Language) => {
  const labels: Record<string, { ar: string; en: string }> = {
    monthly: { ar: 'شهرياً', en: 'monthly' },
    yearly: { ar: 'سنوياً', en: 'yearly' },
    once: { ar: 'مرة واحدة', en: 'one time' },
  };
  if (!period || !labels[period]) return '';
  return lang === 'ar' ? labels[period].ar : labels[period].en;
};

function FeaturedHomePackageCard({
  pkg,
  lang,
  onOrder,
}: {
  pkg: HomePricingPackage;
  lang: Language;
  onOrder: (pkg: HomePricingPackage) => void;
}) {
  const config = featuredSectionConfig[pkg.section];
  const Icon = config.Icon;
  const title = lang === 'ar' ? pkg.nameAr : pkg.nameEn;
  const description = lang === 'ar' ? pkg.descriptionAr : pkg.descriptionEn;
  const features = [
    ...(lang === 'ar' ? pkg.featuresAr || [] : pkg.featuresEn || []),
    ...(lang === 'ar' ? pkg.detailsAr || [] : pkg.detailsEn || []),
  ].slice(0, 3);
  const originalPrice = Number(pkg.originalPrice || 0);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      className="group relative isolate flex min-h-[430px] flex-col overflow-hidden rounded-[1.8rem] border bg-transparent p-6 backdrop-blur-sm transition duration-500 hover:-translate-y-1 sm:p-7"
      style={{
        borderColor: `${config.accent}35`,
        boxShadow: `0 22px 60px rgba(15,23,42,.04), 0 10px 36px ${config.glow}`,
      }}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 -z-10 h-64 w-64 rounded-full blur-3xl opacity-40" style={{ background: config.glow }} />
      <div className="pointer-events-none absolute inset-x-7 top-0 h-[3px] rounded-b-full bg-gradient-to-r from-transparent via-[#9d027c] to-[#ffbc01]" />

      <div className="flex items-start gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border" style={{ borderColor: `${config.accent}30`, background: config.soft, color: config.accent }}>
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <span className="block text-[10px] font-black tracking-[.14em] text-slate-400">{lang === 'ar' ? config.eyebrowAr : config.eyebrowEn}</span>
            <strong className="mt-1 block text-xs font-black text-[#0f172a]">{lang === 'ar' ? config.labelAr : config.labelEn}</strong>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-black leading-tight tracking-tight text-[#0f172a] sm:text-[1.75rem]">{title}</h3>
        {description && <p className="mt-3 min-h-[52px] text-sm leading-6 text-slate-500">{description}</p>}
      </div>

      <div className="mt-6 flex items-end justify-between gap-4 border-y border-slate-700/10 py-5">
        <div>
          <span className="block text-[10px] font-black text-slate-400">{lang === 'ar' ? 'سعر الخطة' : 'Plan price'}</span>
          {originalPrice > Number(pkg.price || 0) && (
            <span className="mt-1 block text-xs font-bold text-slate-400 line-through">{originalPrice.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')} {pkg.currency}</span>
          )}
          <strong className="mt-1 block text-2xl font-black sm:text-3xl" style={{ color: config.accent }}>{packagePrice(pkg, lang)}</strong>
        </div>
        {packagePeriod(pkg.period, lang) && (
          <span className="rounded-full px-3 py-1.5 text-[10px] font-black" style={{ background: config.soft, color: config.accent }}>
            {packagePeriod(pkg.period, lang)}
          </span>
        )}
      </div>

      <div className="mt-5 space-y-3">
        {features.map((feature) => (
          <div key={feature} className="flex items-start gap-2.5 text-xs font-bold leading-5 text-slate-600">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ background: config.soft, color: config.accent }}>
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-2 pt-7 sm:flex-row">
        <button
          type="button"
          onClick={() => onOrder(pkg)}
          className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#9d027c] px-4 text-xs font-black text-white shadow-[0_12px_28px_rgba(157,2,124,.22)] transition hover:-translate-y-0.5 hover:bg-[#850269] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffbc01]"
        >
          <ShoppingBag className="h-4 w-4 text-[#ffda67]" />
          {pkg.ctaText || (lang === 'ar' ? 'ابدأ طلب الخطة' : 'Start Plan Request')}
        </button>
        <a
          href={config.href}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-transparent px-4 text-xs font-black text-[#0f172a] transition hover:border-[#9d027c]/35 hover:text-[#9d027c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9d027c]"
        >
          {lang === 'ar' ? 'كل الخطط' : 'All plans'}
          {lang === 'ar' ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </a>
      </div>
    </motion.article>
  );
}

export default function HomePage({ currentLang: lang, onContact }: HomePageProps) {
  const [home, setHome] = useState<PublicHomePayload | null | undefined>(undefined);
  const [featuredPackages, setFeaturedPackages] = useState<HomePricingPackage[] | undefined>(undefined);
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();
    siteFetch<unknown>('/home', { signal: controller.signal })
      .then((payload) => {
        if (!controller.signal.aborted) setHome(payload ? normalizeHomePayload(payload) : null);
      })
      .catch(() => {
        if (!controller.signal.aborted) setHome(null);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all(
      pricingSections.map(section => siteFetch<HomePricingPackage[]>(`/pricing?section=${section}`, { signal: controller.signal }))
    )
      .then((groups) => {
        if (controller.signal.aborted) return;
        const selected = pricingSections.map((section, index) => {
          const packages = groups[index] || [];
          const featured = packages.find(pkg => pkg.highlighted) || packages[0] || featuredPackageFallbacks[section];
          return { ...featured, section };
        });
        setFeaturedPackages(selected);
      })
      .catch(() => {
        if (!controller.signal.aborted) setFeaturedPackages(pricingSections.map(section => featuredPackageFallbacks[section]));
      });
    return () => controller.abort();
  }, []);

  const services = useMemo(() => {
    if (home === null) return [];
    return home?.services || [];
  }, [home]);

  const allProjects = useMemo(() => {
    const indexed = new Map<string, PublicPortfolioProject>();
    [...(home?.portfolio || []), ...projectServices(services)].forEach((project) => {
      const existing = indexed.get(project.id);
      indexed.set(project.id, {
        ...existing,
        ...project,
        serviceSlugs: [...new Set([...(existing?.serviceSlugs || []), ...project.serviceSlugs])],
      });
    });
    return [...indexed.values()];
  }, [home?.portfolio, services]);

  const filteredProjects = useMemo(() => {
    if (!selectedServiceSlug) return allProjects;
    return allProjects.filter((project) => project.serviceSlugs.includes(selectedServiceSlug));
  }, [allProjects, selectedServiceSlug]);

  const page = home?.page;
  const heroTitle = readHomeText(page, 'hero', 'title', lang, lang === 'ar' ? 'انضم إلى عائلتنا' : 'Not separate services. One connected growth system.');
  const heroSubtitle = readHomeText(page, 'hero', 'subtitle', lang, lang === 'ar' ? 'نبدأ من هدفك، ونربط كل خدمة بالخطوة التي تقرّب مشروعك من النتيجة.' : 'Start with your goal and connect every service to the next measurable move.');
  const startProjectText = readHomeText(page, 'hero', 'startProject', lang, lang === 'ar' ? 'ابدأ مشروعك' : 'Start your project');
  const featuredPackagesTitle = readHomeText(page, 'featuredPackages', 'title', lang, lang === 'ar' ? 'الخطة الأقوى من كل قسم، جاهزة لخطوتك التالية.' : 'The strongest plan from every department, ready for your next move.');
  const featuredPackagesSubtitle = readHomeText(page, 'featuredPackages', 'subtitle', lang, lang === 'ar' ? 'جمعنا لك الاختيار المميز من البرمجيات والسوشيال والميديا؛ سعر واضح، أهم المزايا، وطلب مباشر من مكان واحد.' : 'See the featured choice from software, social, and media with clear pricing, key benefits, and one-click ordering.');
  const processTitle = readHomeText(page, 'process', 'title', lang, lang === 'ar' ? 'خطة واضحة من أول تشخيص إلى التحسين المستمر.' : 'A clear path from diagnosis to continuous improvement.');
  const processSubtitle = readHomeText(page, 'process', 'subtitle', lang, '');
  const partnersTitle = readHomeText(page, 'partners', 'title', lang, lang === 'ar' ? 'شركاء النجاح' : 'Success Partners');
  const partnersSubtitle = readHomeText(page, 'partners', 'subtitle', lang, lang === 'ar' ? 'علامات وثقت في Select لتبني خطوتها التالية.' : 'Brands that trusted Select to build their next move.');
  const configuredProcessSteps = readHomeSteps(page);
  const processSteps = configuredProcessSteps.length ? configuredProcessSteps : [
    { titleAr: 'تشخيص', titleEn: 'Diagnosis', descriptionAr: 'نفهم الفرصة والعوائق.', descriptionEn: 'We map opportunity and friction.' },
    { titleAr: 'تصميم الحل', titleEn: 'Solution design', descriptionAr: 'نربط الخدمات في مسار واحد.', descriptionEn: 'We connect services into one plan.' },
    { titleAr: 'الإطلاق', titleEn: 'Launch', descriptionAr: 'نحوّل الخطة إلى تجربة حية.', descriptionEn: 'We turn the plan into a live experience.' },
    { titleAr: 'القياس والتحسين', titleEn: 'Measure & improve', descriptionAr: 'نقيس ما يهم ونحسن التالي.', descriptionEn: 'We measure what matters and improve the next move.' },
  ];
  const typingLinesRawAr = readHomeText(page, 'hero', 'typingLines', 'ar', 'صمم موقعك الاحترافي برمجة خاصة\nصمم هويتك البصرية باحتراف\nاطلب خطة تسويقية مجانا\nصور منتجاتك باحترافية\nصمم فيديوهات احترافية لتطوير نشاطك التجاري\nصمم تطبيق موبايل احترافي\nصمم CRM احترافي لتطوير ادارة نشاطك');
  const typingLinesRawEn = readHomeText(page, 'hero', 'typingLines', 'en', 'Design your custom website\nDesign your visual identity\nRequest a free marketing plan\nPhotograph your products professionally\nCreate promo videos for your business\nDesign a mobile app\nDesign a custom CRM system');

  const heroTypingAr = useMemo(() => typingLinesRawAr.split('\n').map(l => l.trim()).filter(Boolean), [typingLinesRawAr]);
  const heroTypingEn = useMemo(() => typingLinesRawEn.split('\n').map(l => l.trim()).filter(Boolean), [typingLinesRawEn]);

  const toggleService = (slug: string) => {
    setSelectedServiceSlug((current) => current === slug ? null : slug);
    if (typeof window !== 'undefined') {
      window.setTimeout(() => document.getElementById('connected-work')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }), 0);
    }
  };

  const orderFeaturedPackage = (pkg: HomePricingPackage) => {
    if (pkg.isCustomPlan || pkg.ctaLink === '/custom-plan') {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams();
        if (pkg.softwareCategory) params.set('service', pkg.softwareCategory);
        params.set('package', String(pkg.id));
        params.set('title', lang === 'ar' ? pkg.nameAr : pkg.nameEn);
        window.location.assign(`/custom-plan?${params.toString()}`);
      }
      return;
    }

    const shownPrice = Number(pkg.price || 0);
    const originalPrice = Number(pkg.originalPrice || 0);
    addPlanToCart({
      section: pkg.section,
      id: String(pkg.id),
      title: lang === 'ar' ? pkg.nameAr : pkg.nameEn,
      price: shownPrice > 0 ? shownPrice : null,
      originalPrice: originalPrice > shownPrice ? originalPrice : null,
      currency: pkg.currency || 'EGP',
      description: lang === 'ar' ? pkg.descriptionAr : pkg.descriptionEn,
      features: lang === 'ar' ? pkg.featuresAr : pkg.featuresEn,
      details: {
        softwareCategory: pkg.softwareCategory || undefined,
        period: pkg.period || undefined,
        source: 'homepage-featured-package',
      },
    });
    if (typeof window !== 'undefined') window.location.assign('/checkout');
  };

  return (
    <>
      <section id="home" className="relative flex min-h-[85vh] items-center overflow-hidden pb-12 pt-32">
        <div className="pointer-events-none absolute right-1/4 top-0 h-[500px] w-[500px]" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)' }} />
        <div className="pointer-events-none absolute bottom-10 left-10 h-[400px] w-[400px]" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)' }} />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <motion.div
              className="flex flex-col items-center text-center lg:col-span-6 lg:items-start lg:text-right ltr:lg:text-left"
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <h1 className={mainHeadingClass}>
                <span
                  className="block bg-clip-text font-black text-transparent"
                  style={{ backgroundImage: 'linear-gradient(90deg, #9d027c, #f43f5e, #ffbc01, #f43f5e, #9d027c)', backgroundSize: '200% auto', animation: reduceMotion ? undefined : 'gradient-melt 4s linear infinite' }}
                >
                  {heroTitle}
                </span>
                <span className="mt-5 block min-h-[2.3rem] text-xl font-bold text-slate-300 sm:text-2xl lg:text-3xl">
                  <TypingEffect arStrings={heroTypingAr} enStrings={heroTypingEn} lang={lang} />
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">{heroSubtitle}</p>
              <div className={`mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row ${lang === 'ar' ? 'rtl' : ''}`}>
                <AnimatedCTA
                  text={startProjectText}
                  textSent={lang === 'ar' ? 'جاري بدء المشروع' : 'Starting your project'}
                  className="glass"
                  onClick={() => onContact()}
                />
              </div>
            </motion.div>

            {/* This is intentionally the same technology-phone component and prop shape as the previous hero. */}
            <TechnologyPhoneShowcase lang={lang} />
          </div>
        </div>
      </section>

      <section id="growth-services" className="relative scroll-mt-24 overflow-hidden border-y border-violet-950/35 py-24 sm:py-28">
        <div className="pointer-events-none absolute left-0 top-1/4 h-[420px] w-[420px]" style={{ background: 'radial-gradient(circle, rgba(157,2,124,0.10) 0%, transparent 70%)' }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center flex flex-col items-center">
            <h2 className={mainHeadingClass}>
              <span
                className="bg-clip-text text-transparent block sm:whitespace-nowrap"
                style={{ backgroundImage: 'linear-gradient(90deg, #9d027c, #f43f5e, #ffbc01, #f43f5e, #9d027c)', backgroundSize: '200% auto', animation: reduceMotion ? undefined : 'gradient-melt 4s linear infinite' }}
              >
                {featuredPackagesTitle}
              </span>
            </h2>
            <p className="mt-5 max-w-2xl mx-auto text-sm leading-7 text-slate-500 sm:text-base">
              {featuredPackagesSubtitle}
            </p>
          </div>

          {featuredPackages === undefined ? (
            <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3" aria-label={lang === 'ar' ? 'جارٍ تحميل الخطط المميزة' : 'Loading featured plans'}>
              {[0, 1, 2].map((item) => <div key={item} className="h-[430px] animate-pulse rounded-[1.8rem] border border-slate-700/15 bg-white/75" />)}
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {featuredPackages.map((pkg) => (
                <FeaturedHomePackageCard
                  key={`${pkg.section}-${pkg.id}`}
                  pkg={pkg}
                  lang={lang}
                  onOrder={orderFeaturedPackage}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {allProjects.length > 0 && (
        <section id="connected-work" className="relative scroll-mt-24 py-24 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#8a066d]">
                  <BriefcaseBusiness className="h-4 w-4" />
                  {lang === 'ar' ? 'أعمال مرتبطة' : 'Connected work'}
                </div>
                <h2 className={`mt-4 ${mainHeadingClass} text-[#0f172a]`}>
                  {selectedServiceSlug
                    ? (lang === 'ar' ? 'أعمال هذه الخدمة' : 'Work for this service')
                    : (lang === 'ar' ? 'منظومات تم تنفيذها على أرض الواقع.' : 'Growth systems made real.')}
                </h2>
              </div>
              {selectedServiceSlug && (
                <button type="button" onClick={() => setSelectedServiceSlug(null)} className="w-fit rounded-full border border-slate-700/20 px-4 py-2 text-xs font-black text-slate-300 transition hover:border-[#9d027c] hover:text-[#8a066d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9d027c]">
                  {lang === 'ar' ? 'عرض كل الأعمال' : 'Show all work'}
                </button>
              )}
            </div>

            {filteredProjects.length ? (
              <div className="mt-10 grid gap-4 lg:grid-cols-2">
                <ProjectCard project={filteredProjects[0]} lang={lang} featured />
                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredProjects.slice(1).map((project) => <ProjectCard key={project.id} project={project} lang={lang} />)}
                </div>
              </div>
            ) : (
              <div className="mt-10 rounded-3xl border border-dashed border-slate-700/20 bg-white/70 p-8 text-sm text-slate-400">
                {lang === 'ar' ? 'لا توجد أعمال مرتبطة بهذه الخدمة حتى الآن.' : 'There is no published work linked to this service yet.'}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="relative border-y border-slate-700/15 bg-white/45 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center flex flex-col items-center">
            <h2 className={mainHeadingClass}>
              <span
                className="bg-clip-text text-transparent block sm:whitespace-nowrap"
                style={{ backgroundImage: 'linear-gradient(90deg, #9d027c, #f43f5e, #ffbc01, #f43f5e, #9d027c)', backgroundSize: '200% auto', animation: reduceMotion ? undefined : 'gradient-melt 4s linear infinite' }}
              >
                {processTitle}
              </span>
            </h2>
            {processSubtitle && <p className="mt-4 max-w-xl mx-auto text-sm leading-7 text-slate-400 sm:text-base">{processSubtitle}</p>}
          </div>
          <div className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-4 md:overflow-visible md:pb-0">
            {processSteps.map((step, index) => (
              <motion.div key={`${step.titleEn}-${index}`} initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-70px' }} transition={{ delay: index * 0.08 }} className="min-w-[220px] snap-start rounded-3xl border border-slate-700/15 bg-white/85 p-6 md:min-w-0 text-center flex flex-col items-center justify-start">
                <span className="font-mono text-xs font-black text-[#a16207]">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-8 text-base font-black leading-snug text-[#0f172a] sm:text-lg">{lang === 'ar' ? step.titleAr : step.titleEn}</h3>
                {(lang === 'ar' ? step.descriptionAr : step.descriptionEn) && <p className="mt-3 text-sm leading-6 text-slate-400">{lang === 'ar' ? step.descriptionAr : step.descriptionEn}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {(home?.metrics?.length || home?.testimonials?.length) ? (
        <section className="relative py-24 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {home?.metrics?.length ? (
              <div className="grid grid-cols-2 gap-3 border-b border-slate-700/15 pb-12 sm:grid-cols-4">
                {home.metrics.map((metric) => (
                  <div key={metric.id} className="rounded-2xl border border-slate-700/15 bg-white/85 p-5">
                    <div className="text-2xl font-black text-[#a16207] sm:text-3xl">{metric.value}</div>
                    <div className="mt-2 text-xs font-black text-slate-200">{lang === 'ar' ? metric.labelAr : metric.labelEn}</div>
                    {(lang === 'ar' ? metric.detailAr : metric.detailEn) && <p className="mt-2 text-[11px] leading-5 text-slate-600">{lang === 'ar' ? metric.detailAr : metric.detailEn}</p>}
                  </div>
                ))}
              </div>
            ) : null}

            {home?.testimonials?.length ? (
              <div className="mt-14">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#8a066d]"><UsersRound className="h-4 w-4" />{lang === 'ar' ? 'كلمات من العملاء' : 'Client notes'}</div>
                <div className="mt-7 grid gap-4 lg:grid-cols-3">
                  {home.testimonials.map((testimonial) => (
                    <figure key={testimonial.id} className="rounded-3xl border border-slate-700/15 bg-white/85 p-6">
                      <blockquote className="text-sm leading-7 text-slate-200">“{lang === 'ar' ? testimonial.quoteAr : testimonial.quoteEn}”</blockquote>
                      <figcaption className="mt-6 border-t border-slate-700/15 pt-4 text-xs font-black text-[#8a066d]">
                        {lang === 'ar' ? testimonial.nameAr : testimonial.nameEn}
                        {(lang === 'ar' ? testimonial.roleAr || testimonial.companyAr : testimonial.roleEn || testimonial.companyEn) && <span className="mt-1 block font-normal text-slate-600">{lang === 'ar' ? testimonial.roleAr || testimonial.companyAr : testimonial.roleEn || testimonial.companyEn}</span>}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ) : null}

          </div>
        </section>
      ) : null}

      {home?.partners?.length ? (
        <SuccessPartnersCarousel
          partners={home.partners}
          title={partnersTitle}
          subtitle={partnersSubtitle}
          lang={lang}
        />
      ) : null}

    </>
  );
}
