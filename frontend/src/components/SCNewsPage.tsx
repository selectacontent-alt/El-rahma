"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bot,
  Brain,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  Facebook,
  Info,
  Linkedin,
  Link2,
  ListTree,
  Mail,
  Megaphone,
  MessageCircle,
  Microchip,
  Newspaper,
  Play,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
  Tag,
  TrendingUp,
  Users,
  UserRound,
  Youtube
} from "lucide-react";
import type { ComponentType, CSSProperties } from "react";
import type { Language } from "../types";
import { publicDriveUrl } from "../lib/siteApi";


export const newsTokens = {
  colors: {
    primary: "#9d027c",
    secondary: "#ffbc01",
    textMain: "#1f1f1f",
    textLight: "#666666",
    textMuted: "#888888",
    bgMain: "#f7f7f9",
    bgCard: "#ffffff",
    border: "#e8e8ee",
    placeholder: "#f0edf1"
  },
  radius: {
    card: "8px",
    button: "8px",
    badge: "4px"
  },
  shadows: {
    card: "0 8px 24px rgba(0,0,0,0.04)",
    cardHover: "0 12px 32px rgba(157,2,124,0.08)",
    hero: "0 10px 30px rgba(0,0,0,0.06)"
  },
  transitions: {
    default: "0.3s ease",
    hover: "0.2s ease-out"
  }
};

interface SCNewsPageProps {
  currentLang: Language;
  setActiveTab?: (tab: string) => void;
}

interface NewsCategory {
  id?: number;
  name_ar: string;
  name_en?: string;
  slug: string;
  description_ar?: string;
  description_en?: string;
}

interface NewsTag {
  id?: number;
  name_ar: string;
  name_en?: string;
  slug: string;
}

interface NewsAuthor {
  name_ar: string;
  name_en?: string;
  title_ar?: string;
  title_en?: string;
  bio_ar?: string;
  bio_en?: string;
  avatar_url?: string | null;
}

interface NewsArticle {
  id?: number;
  title_ar: string;
  title_en?: string;
  slug: string;
  excerpt_ar: string;
  excerpt_en?: string;
  body_ar?: string;
  body_en?: string;
  featured_image_url?: string | null;
  image_alt_ar?: string;
  image_alt_en?: string;
  category: NewsCategory;
  tags?: NewsTag[];
  author?: NewsAuthor | null;
  article_type: "news" | "company_update" | "guide" | "video" | "case_study";
  is_featured?: boolean;
  is_breaking?: boolean;
  is_trending?: boolean;
  published_at: string;
  updated_at?: string;
  created_at?: string;
  read_time_minutes?: number;
  views_count?: number;
  source_name?: string | null;
  source_url?: string | null;
  video_url?: string | null;
  related_articles?: NewsArticle[];
  previous_article?: NewsArticle | null;
  next_article?: NewsArticle | null;
  latest_articles?: NewsArticle[];
  trending_articles?: NewsArticle[];
}

interface NewsHomePayload {
  featured: NewsArticle | null;
  hero_side: NewsArticle[];
  breaking: NewsArticle[];
  latest: NewsArticle[];
  company_updates: NewsArticle[];
  guides: NewsArticle[];
  videos: NewsArticle[];
  case_studies: NewsArticle[];
  categories: NewsCategory[];
  trending: NewsArticle[];
}

interface ApiEnvelope<T> {
  status: string;
  data: T;
}

interface SectionConfig {
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  chipsAr: string[];
  chipsEn: string[];
  accent: string;
  soft: string;
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  specialAr: string;
  specialEn: string;
  url: string;
}

type SectionModuleType =
  | "company_timeline"
  | "tech_lab"
  | "ai_radar"
  | "market_pulse"
  | "trend_wall"
  | "growth_hub"
  | "proof_gallery"
  | "knowledge_library"
  | "media_studio"
  | "security_alert"
  | "startup_roadmap";

type SectionPattern = "grid" | "circuit" | "neural" | "ticker" | "hashtags" | "growth" | "proof" | "library" | "studio" | "shield" | "roadmap";

interface SectionIdentity {
  slug: string;
  editorialAr: string;
  editorialEn: string;
  taglineAr: string;
  taglineEn: string;
  heroTitleAr: string;
  heroTitleEn: string;
  heroDescriptionAr: string;
  heroDescriptionEn: string;
  accent: string;
  soft: string;
  pattern: SectionPattern;
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  quickChipsAr: string[];
  quickChipsEn: string[];
  ctaAr: string;
  ctaEn: string;
  moduleType: SectionModuleType;
  sidebarFocusAr: string;
  sidebarFocusEn: string;
  articleInsightAr: string;
  articleInsightEn: string;
}

const API_BASE = typeof window !== 'undefined' ? `http://${window.location.hostname}:5005` : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005");

const sectionConfigs: SectionConfig[] = [
  {
    slug: "company-news",
    nameAr: "أخبار الشركة",
    nameEn: "Company News",
    descriptionAr: "تابع آخر تحديثات الشركة، إطلاق الخدمات، الشراكات، الإنجازات، والفعاليات.",
    descriptionEn: "Company updates, service launches, partnerships, achievements, and events.",
    chipsAr: ["إطلاق خدمات", "شراكات", "فعاليات"],
    chipsEn: ["Launches", "Partnerships", "Events"],
    accent: "#9d027c",
    soft: "#fbf0f8",
    icon: BriefcaseBusiness,
    specialAr: "تحديثات الشركة",
    specialEn: "Company timeline",
    url: "/news/company-news"
  },
  {
    slug: "technology",
    nameAr: "تقنية",
    nameEn: "Technology",
    descriptionAr: "آخر أخبار التكنولوجيا، التطبيقات، الأجهزة، والشركات التقنية في مكان واحد.",
    descriptionEn: "Technology news, apps, devices, and tech companies in one place.",
    chipsAr: ["أخبار التقنية", "تطبيقات", "أمن سيبراني"],
    chipsEn: ["Tech news", "Apps", "Cybersecurity"],
    accent: "#0ea5e9",
    soft: "#eef8ff",
    icon: Microchip,
    specialAr: "أحدث المراجعات التقنية",
    specialEn: "Latest tech reviews",
    url: "/news/technology"
  },
  {
    slug: "ai",
    nameAr: "ذكاء اصطناعي",
    nameEn: "Artificial Intelligence",
    descriptionAr: "أخبار وأدوات وشروحات AI وتأثيرها على الأعمال والتسويق وصناعة المحتوى.",
    descriptionEn: "AI news, tools, explainers, and practical business and marketing applications.",
    chipsAr: ["أدوات AI", "شروحات", "تطبيقات الأعمال"],
    chipsEn: ["AI tools", "Explainers", "Business use cases"],
    accent: "#6d28d9",
    soft: "#f4f0ff",
    icon: Brain,
    specialAr: "أدوات AI ننصح بها",
    specialEn: "Recommended AI tools",
    url: "/news/ai"
  },
  {
    slug: "economy-stocks",
    nameAr: "اقتصاد وأسهم",
    nameEn: "Economy & Stocks",
    descriptionAr: "متابعة الأخبار الاقتصادية، تحليلات السوق، الأسهم، الذهب، العملات، والشركات.",
    descriptionEn: "Economic news, market analysis, stocks, gold, currencies, and companies.",
    chipsAr: ["أسهم", "ذهب وعملات", "تحليلات"],
    chipsEn: ["Stocks", "Gold & FX", "Analysis"],
    accent: "#059669",
    soft: "#eefdf6",
    icon: BarChart3,
    specialAr: "تحليل السوق اليوم",
    specialEn: "Today market brief",
    url: "/news/economy-stocks"
  },
  {
    slug: "social-media",
    nameAr: "سوشيال ميديا",
    nameEn: "Social Media",
    descriptionAr: "أخبار المنصات، التريندات، صناع المحتوى، وتحديثات فيسبوك وإنستجرام وتيك توك.",
    descriptionEn: "Platform updates, trends, creators, and social media advertising news.",
    chipsAr: ["تريندات", "منصات", "إعلانات"],
    chipsEn: ["Trends", "Platforms", "Ads"],
    accent: "#db2777",
    soft: "#fff0f7",
    icon: Share2,
    specialAr: "تريندات هذا الأسبوع",
    specialEn: "Trends this week",
    url: "/news/social-media"
  },
  {
    slug: "digital-marketing",
    nameAr: "تسويق رقمي",
    nameEn: "Digital Marketing",
    descriptionAr: "استراتيجيات، أدوات، ونصائح تساعد الشركات على زيادة الظهور والبيع عبر الإنترنت.",
    descriptionEn: "Strategies, tools, and practical guidance for visibility and online sales.",
    chipsAr: ["SEO", "إعلانات", "Growth"],
    chipsEn: ["SEO", "Ads", "Growth"],
    accent: "#d97706",
    soft: "#fff8e8",
    icon: Target,
    specialAr: "اختار هدفك التسويقي",
    specialEn: "Choose your growth goal",
    url: "/news/digital-marketing"
  },
  {
    slug: "case-studies",
    nameAr: "دراسات حالة",
    nameEn: "Case Studies",
    descriptionAr: "قصص نجاح ونتائج حقيقية توضح كيف ساعدنا الشركات على تحسين حضورها الرقمي.",
    descriptionEn: "Success stories and real results from digital growth projects.",
    chipsAr: ["نتائج", "قبل وبعد", "مشاريع"],
    chipsEn: ["Results", "Before/after", "Projects"],
    accent: "#9d027c",
    soft: "#fbf0f8",
    icon: TrendingUp,
    specialAr: "نتائج مختصرة",
    specialEn: "Results snapshot",
    url: "/news/case-studies"
  },
  {
    slug: "articles",
    nameAr: "مقالات",
    nameEn: "Articles",
    descriptionAr: "مقالات تحليلية وشروحات عملية في التسويق، التقنية، الأعمال، وتحسين الظهور.",
    descriptionEn: "Editorial guides and practical explainers for marketing, technology, and visibility.",
    chipsAr: ["أدلة", "نصائح", "تحليلات"],
    chipsEn: ["Guides", "Tips", "Analysis"],
    accent: "#7c3aed",
    soft: "#f6f2ff",
    icon: BookOpen,
    specialAr: "أدلة مختارة",
    specialEn: "Selected guides",
    url: "/news/articles"
  },
  {
    slug: "videos",
    nameAr: "فيديوهات",
    nameEn: "Videos",
    descriptionAr: "شروحات، تحليلات، ملخصات، ومحتوى مرئي يساعدك على فهم السوق والتسويق بسهولة.",
    descriptionEn: "Video explainers, market analysis, recaps, and visual learning.",
    chipsAr: ["شروحات", "Shorts", "تحليلات"],
    chipsEn: ["Explainers", "Shorts", "Analysis"],
    accent: "#e11d48",
    soft: "#fff1f2",
    icon: Play,
    specialAr: "سلاسل الفيديو",
    specialEn: "Video series",
    url: "/news/videos"
  },
  {
    slug: "cybersecurity",
    nameAr: "أمن سيبراني",
    nameEn: "Cybersecurity",
    descriptionAr: "أخبار وتحليلات حول حماية البيانات، الخصوصية، والهجمات الإلكترونية.",
    descriptionEn: "News and analysis about data protection, privacy, and cyber attacks.",
    chipsAr: ["خصوصية", "ثغرات", "حماية"],
    chipsEn: ["Privacy", "Threats", "Protection"],
    accent: "#1d4ed8",
    soft: "#eff6ff",
    icon: ShieldCheck,
    specialAr: "تنبيهات الحماية",
    specialEn: "Security alerts",
    url: "/news/cybersecurity"
  },
  {
    slug: "entrepreneurship",
    nameAr: "ريادة أعمال",
    nameEn: "Entrepreneurship",
    descriptionAr: "أخبار ونصائح للشركات الناشئة ورواد الأعمال وبناء المشاريع الرقمية.",
    descriptionEn: "Startup news, founder advice, and digital business building.",
    chipsAr: ["Startups", "فرق عمل", "نمو"],
    chipsEn: ["Startups", "Teams", "Growth"],
    accent: "#f59e0b",
    soft: "#fffbeb",
    icon: Users,
    specialAr: "خريطة طريق Startup",
    specialEn: "Startup roadmap",
    url: "/news/entrepreneurship"
  }
];

const orderedSectionSlugs = [
  "company-news",
  "technology",
  "ai",
  "economy-stocks",
  "social-media",
  "digital-marketing",
  "case-studies",
  "articles",
  "videos",
  "cybersecurity",
  "entrepreneurship"
];

const sectionIdentityConfig: Record<string, SectionIdentity> = {
  "company-news": {
    slug: "company-news",
    editorialAr: "مسار الشركة",
    editorialEn: "Company Track",
    taglineAr: "إطلاقات، شراكات، وقرارات من داخل غرفة عمليات S C.",
    taglineEn: "Launches, partnerships, and decisions from the S C operations room.",
    heroTitleAr: "كل ما يحدث داخل الشركة في خط زمني واضح",
    heroTitleEn: "Company updates in one clear timeline",
    heroDescriptionAr: "صفحة أخبار الشركة تعرض التحركات المهمة، الخدمات الجديدة، الشراكات، والفعاليات بطريقة تربط كل تحديث بقيمة عملية للعميل.",
    heroDescriptionEn: "Company news presented as a clear timeline of launches, partnerships, events, and practical customer value.",
    accent: "#9d027c",
    soft: "#fbf0f8",
    pattern: "grid",
    icon: BriefcaseBusiness,
    quickChipsAr: ["إطلاق خدمة", "شراكة", "حدث", "إنجاز"],
    quickChipsEn: ["Launch", "Partnership", "Event", "Milestone"],
    ctaAr: "تواصل مع الفريق",
    ctaEn: "Contact the team",
    moduleType: "company_timeline",
    sidebarFocusAr: "تابع آخر تحركات الشركة",
    sidebarFocusEn: "Follow the latest company moves",
    articleInsightAr: "كل تحديث من الشركة لازم يوضح أثره على العميل: خدمة أسرع، ظهور أقوى، أو قرار يساعد على النمو.",
    articleInsightEn: "Every company update should explain the client impact: faster service, stronger visibility, or a growth decision."
  },
  technology: {
    slug: "technology",
    editorialAr: "معمل التقنية",
    editorialEn: "Technology Lab",
    taglineAr: "اختبارات، أدوات، ومنتجات تقنية نفككها للشركات.",
    taglineEn: "Tools, products, and tech changes unpacked for companies.",
    heroTitleAr: "معمل التقنية: افهم الأدوات قبل ما تختارها",
    heroTitleEn: "Technology Lab: understand tools before choosing them",
    heroDescriptionAr: "تجربة تقنية سريعة ونظيفة تعرض الأخبار، التطبيقات، الأجهزة، والمراجعات مع زاوية عملية: ماذا يفيد شركتك الآن؟",
    heroDescriptionEn: "A clean lab-style section for tech news, apps, devices, and reviews with a practical business angle.",
    accent: "#0ea5e9",
    soft: "#eef8ff",
    pattern: "circuit",
    icon: Microchip,
    quickChipsAr: ["أداة", "تطبيق", "مراجعة", "أمن"],
    quickChipsEn: ["Tool", "App", "Review", "Security"],
    ctaAr: "استكشف التقنية",
    ctaEn: "Explore tech",
    moduleType: "tech_lab",
    sidebarFocusAr: "أدوات وتجارب تقنية مختارة",
    sidebarFocusEn: "Selected tools and tech experiments",
    articleInsightAr: "لا يكفي معرفة الخبر التقني؛ الأهم هل سيقلل وقت فريقك أو يحسن تجربة عميلك؟",
    articleInsightEn: "A tech story matters when it saves team time or improves the customer experience."
  },
  ai: {
    slug: "ai",
    editorialAr: "رادار الذكاء الاصطناعي",
    editorialEn: "AI Radar",
    taglineAr: "أدوات، Prompts، واستخدامات عملية للشركات.",
    taglineEn: "Tools, prompts, and practical AI use cases for companies.",
    heroTitleAr: "رادار AI يرصد ما يستحق التجربة",
    heroTitleEn: "AI Radar tracks what is worth testing",
    heroDescriptionAr: "صفحة AI ليست أخبارًا فقط؛ هي مرصد سريع للأدوات، الشروحات، والتطبيقات التي يمكن أن تغير التسويق والمحتوى وخدمة العملاء.",
    heroDescriptionEn: "More than AI news: a radar for tools, explainers, and use cases that can change marketing, content, and support.",
    accent: "#6d28d9",
    soft: "#f4f0ff",
    pattern: "neural",
    icon: Brain,
    quickChipsAr: ["Tool", "Prompt", "Guide", "Use Case"],
    quickChipsEn: ["Tool", "Prompt", "Guide", "Use case"],
    ctaAr: "جرّب فكرة AI",
    ctaEn: "Try an AI idea",
    moduleType: "ai_radar",
    sidebarFocusAr: "أدوات AI وشروحات سريعة",
    sidebarFocusEn: "AI tools and quick explainers",
    articleInsightAr: "اسأل دائمًا: هل هذا الخبر يقلل تكلفة إنتاج المحتوى أو يرفع جودة القرار؟",
    articleInsightEn: "Ask whether this AI story lowers content production cost or improves decision quality."
  },
  "economy-stocks": {
    slug: "economy-stocks",
    editorialAr: "نبض السوق",
    editorialEn: "Market Pulse",
    taglineAr: "مؤشرات واتجاهات اقتصادية بلغة مفهومة للشركات.",
    taglineEn: "Economic signals translated into business language.",
    heroTitleAr: "نبض الاقتصاد والأسهم بدون ضوضاء",
    heroTitleEn: "Economy and stocks without the noise",
    heroDescriptionAr: "لوحة متابعة خفيفة للأسهم، العملات، الذهب، والشركات مع شرح سريع لما قد يعنيه كل تحرك على التسويق والشراء والنمو.",
    heroDescriptionEn: "A lightweight pulse board for stocks, FX, gold, and companies with context for marketing, buying, and growth.",
    accent: "#059669",
    soft: "#eefdf6",
    pattern: "ticker",
    icon: BarChart3,
    quickChipsAr: ["أسهم", "ذهب", "عملات", "تحليل"],
    quickChipsEn: ["Stocks", "Gold", "FX", "Analysis"],
    ctaAr: "اقرأ تحليل السوق",
    ctaEn: "Read market brief",
    moduleType: "market_pulse",
    sidebarFocusAr: "مؤشرات السوق الأكثر تأثيرًا",
    sidebarFocusEn: "Most impactful market signals",
    articleInsightAr: "الأخبار الاقتصادية مهمة عندما تغيّر تكلفة الإعلان، سلوك الشراء، أو خطط التوسع.",
    articleInsightEn: "Economic news matters when it affects ad cost, buyer behavior, or expansion plans."
  },
  "social-media": {
    slug: "social-media",
    editorialAr: "غرفة التريندات",
    editorialEn: "Trend Wall",
    taglineAr: "منصات، هاشتاجات، وخوارزميات تتحرك كل يوم.",
    taglineEn: "Platforms, hashtags, and algorithms moving every day.",
    heroTitleAr: "غرفة التريندات: افهم المنصة قبل ما تنشر",
    heroTitleEn: "Trend Wall: understand the platform before posting",
    heroDescriptionAr: "تجربة بصرية تعرض تحديثات المنصات والتريندات وصناع المحتوى مع ربط مباشر بتأثيرها على الوصول والإعلانات.",
    heroDescriptionEn: "A visual wall for platform updates, trends, creators, and their impact on reach and ads.",
    accent: "#db2777",
    soft: "#fff0f7",
    pattern: "hashtags",
    icon: Share2,
    quickChipsAr: ["TikTok", "Instagram", "Creators", "Ads"],
    quickChipsEn: ["TikTok", "Instagram", "Creators", "Ads"],
    ctaAr: "راقب التريند",
    ctaEn: "Track trends",
    moduleType: "trend_wall",
    sidebarFocusAr: "تريندات ومنصات يجب مراقبتها",
    sidebarFocusEn: "Trends and platforms to watch",
    articleInsightAr: "أي تحديث في منصة اجتماعية قد يغير معدل الوصول أو تكلفة الإعلان أو شكل المحتوى الفائز.",
    articleInsightEn: "A platform update can change reach, ad cost, or the format that wins attention."
  },
  "digital-marketing": {
    slug: "digital-marketing",
    editorialAr: "مركز النمو",
    editorialEn: "Growth Hub",
    taglineAr: "SEO، إعلانات، محتوى، وتحويلات لخدمة النمو.",
    taglineEn: "SEO, ads, content, and conversion for growth.",
    heroTitleAr: "مركز النمو الرقمي للشركات",
    heroTitleEn: "Digital growth hub for companies",
    heroDescriptionAr: "صفحة تسويق عملية تجمع الاستراتيجيات والأدوات والنصائح التي تساعد على زيادة الظهور والطلبات والمبيعات.",
    heroDescriptionEn: "A practical marketing hub for strategies, tools, and guidance that improve visibility, leads, and sales.",
    accent: "#d97706",
    soft: "#fff8e8",
    pattern: "growth",
    icon: Target,
    quickChipsAr: ["SEO", "Ads", "Content", "Conversion"],
    quickChipsEn: ["SEO", "Ads", "Content", "Conversion"],
    ctaAr: "اختار هدف النمو",
    ctaEn: "Choose a growth goal",
    moduleType: "growth_hub",
    sidebarFocusAr: "أهداف نمو قابلة للتنفيذ",
    sidebarFocusEn: "Actionable growth goals",
    articleInsightAr: "كل فكرة تسويقية لازم تتحول إلى خطوة: تحسين صفحة، حملة، محتوى، أو رابط داخلي.",
    articleInsightEn: "Every marketing idea should turn into a page improvement, campaign, content piece, or internal link."
  },
  "case-studies": {
    slug: "case-studies",
    editorialAr: "معرض النتائج",
    editorialEn: "Proof Gallery",
    taglineAr: "أرقام وقصص تثبت أثر الشغل الرقمي.",
    taglineEn: "Numbers and stories that prove digital impact.",
    heroTitleAr: "نتائج حقيقية بدل الوعود العامة",
    heroTitleEn: "Real outcomes instead of generic promises",
    heroDescriptionAr: "صفحة دراسات الحالة تركز على قبل وبعد، التحدي، الحل، والنتائج حتى يرى الزائر أثر الخدمة بوضوح.",
    heroDescriptionEn: "Case studies focus on before/after, challenge, solution, and outcomes so visitors see the value clearly.",
    accent: "#9d027c",
    soft: "#fbf0f8",
    pattern: "proof",
    icon: TrendingUp,
    quickChipsAr: ["نتيجة", "قبل/بعد", "حل", "أرقام"],
    quickChipsEn: ["Result", "Before/after", "Solution", "Metrics"],
    ctaAr: "شاهد النتائج",
    ctaEn: "View results",
    moduleType: "proof_gallery",
    sidebarFocusAr: "نتائج مختصرة من المشاريع",
    sidebarFocusEn: "Project result snapshots",
    articleInsightAr: "القصة القوية لا تعرض الخدمة فقط؛ تعرض المشكلة والرقم الذي تغير بعدها.",
    articleInsightEn: "A strong case story shows the problem and the number that changed after the solution."
  },
  articles: {
    slug: "articles",
    editorialAr: "مكتبة المعرفة",
    editorialEn: "Knowledge Library",
    taglineAr: "أدلة وشروحات تبني ثقة طويلة المدى.",
    taglineEn: "Guides and explainers that build long-term trust.",
    heroTitleAr: "مكتبة معرفة عملية لا تضيّع وقتك",
    heroTitleEn: "A practical knowledge library that respects your time",
    heroDescriptionAr: "مقالات تحليلية وشروحات منظمة تربط التسويق والتقنية والأعمال بخطوات واضحة قابلة للتطبيق.",
    heroDescriptionEn: "Organized explainers that connect marketing, technology, and business to clear action steps.",
    accent: "#7c3aed",
    soft: "#f6f2ff",
    pattern: "library",
    icon: BookOpen,
    quickChipsAr: ["دليل", "شرح", "تحليل", "SEO"],
    quickChipsEn: ["Guide", "Explainer", "Analysis", "SEO"],
    ctaAr: "ابدأ القراءة",
    ctaEn: "Start reading",
    moduleType: "knowledge_library",
    sidebarFocusAr: "أدلة وشروحات مرتبطة",
    sidebarFocusEn: "Related guides and explainers",
    articleInsightAr: "المقال الجيد لا يشرح فقط؛ يترك القارئ بخطوة تالية واضحة.",
    articleInsightEn: "A good article does more than explain; it leaves the reader with a clear next step."
  },
  videos: {
    slug: "videos",
    editorialAr: "استوديو المعرفة",
    editorialEn: "Media Studio",
    taglineAr: "مشاهدة أسرع لفهم أوضح.",
    taglineEn: "Faster viewing for clearer understanding.",
    heroTitleAr: "استوديو المعرفة: ملخصات وفيديوهات عملية",
    heroTitleEn: "Media Studio: practical videos and recaps",
    heroDescriptionAr: "مساحة مرئية للفيديوهات والملخصات والشروحات التي تساعدك تفهم التحديثات بسرعة وبدون تعقيد.",
    heroDescriptionEn: "A visual space for videos, recaps, and explainers that make updates easier to understand.",
    accent: "#e11d48",
    soft: "#fff1f2",
    pattern: "studio",
    icon: Play,
    quickChipsAr: ["شرح", "Shorts", "تحليل", "ملخص"],
    quickChipsEn: ["Explainer", "Shorts", "Analysis", "Recap"],
    ctaAr: "شاهد الآن",
    ctaEn: "Watch now",
    moduleType: "media_studio",
    sidebarFocusAr: "فيديوهات وملخصات مختارة",
    sidebarFocusEn: "Selected videos and recaps",
    articleInsightAr: "الفيديو الجيد يحول المعلومة المعقدة إلى قرار سريع أو خطوة واضحة.",
    articleInsightEn: "A good video turns complex information into a quick decision or clear action."
  },
  cybersecurity: {
    slug: "cybersecurity",
    editorialAr: "مركز الحماية",
    editorialEn: "Security Center",
    taglineAr: "تحذيرات وممارسات تحمي بيانات الشركة.",
    taglineEn: "Alerts and practices that protect company data.",
    heroTitleAr: "مركز الحماية: انتبه قبل أن تدفع الثمن",
    heroTitleEn: "Security Center: act before risk becomes cost",
    heroDescriptionAr: "أخبار وتحليلات أمنية تعرض مستوى الخطورة وما يجب فعله الآن لحماية البيانات والسمعة الرقمية.",
    heroDescriptionEn: "Security stories with risk level and immediate action for data and reputation protection.",
    accent: "#1d4ed8",
    soft: "#eff6ff",
    pattern: "shield",
    icon: ShieldCheck,
    quickChipsAr: ["تنبيه", "خصوصية", "ثغرة", "حماية"],
    quickChipsEn: ["Alert", "Privacy", "Threat", "Protection"],
    ctaAr: "راجع الحماية",
    ctaEn: "Review protection",
    moduleType: "security_alert",
    sidebarFocusAr: "تنبيهات أمنية وإجراءات سريعة",
    sidebarFocusEn: "Security alerts and quick actions",
    articleInsightAr: "الخبر الأمني مهم عندما يوضح درجة الخطر وما يجب فعله خلال الساعات القادمة.",
    articleInsightEn: "Security news matters when it explains risk level and the next action to take."
  },
  entrepreneurship: {
    slug: "entrepreneurship",
    editorialAr: "خريطة رواد الأعمال",
    editorialEn: "Startup Roadmap",
    taglineAr: "من الفكرة إلى النمو بخطوات عملية.",
    taglineEn: "From idea to growth through practical steps.",
    heroTitleAr: "خريطة طريق للشركات الناشئة",
    heroTitleEn: "A roadmap for startups and founders",
    heroDescriptionAr: "أخبار ونصائح وأدوات تساعد أصحاب المشاريع على الإطلاق، النمو، بناء الفريق، وتسويق الفكرة بذكاء.",
    heroDescriptionEn: "News, advice, and tools that help founders launch, grow, build teams, and market smarter.",
    accent: "#f59e0b",
    soft: "#fffbeb",
    pattern: "roadmap",
    icon: Users,
    quickChipsAr: ["فكرة", "إطلاق", "نمو", "تمويل"],
    quickChipsEn: ["Idea", "Launch", "Growth", "Funding"],
    ctaAr: "ابدأ مشروعك",
    ctaEn: "Start your project",
    moduleType: "startup_roadmap",
    sidebarFocusAr: "مراحل ونصائح للرواد",
    sidebarFocusEn: "Stages and advice for founders",
    articleInsightAr: "أي نصيحة لريادة الأعمال يجب أن تساعدك تختار خطوة المرحلة الحالية: فكرة، إطلاق، نمو، أو توسع.",
    articleInsightEn: "Founder advice should help choose the current-stage step: idea, launch, growth, or scale."
  }
};

const fallbackCategories: NewsCategory[] = sectionConfigs.map((section) => ({
  name_ar: section.nameAr,
  name_en: section.nameEn,
  slug: section.slug,
  description_ar: section.descriptionAr,
  description_en: section.descriptionEn
}));

const fallbackArticles: NewsArticle[] = [];

const fallbackHome: NewsHomePayload = {
  featured: null,
  hero_side: [],
  breaking: [],
  latest: [],
  company_updates: [],
  guides: [],
  videos: [],
  case_studies: [],
  categories: fallbackCategories,
  trending: []
};

const copy = {
  ar: {
    promo: "اكتشف حلولنا الرقمية لنجاح شركتك",
    learnMore: "اعرف المزيد",
    today: "اليوم",
    quickLinks: ["من نحن", "تواصل معنا", "أعلن معنا"],
    nav: ["الرئيسية", "أخبار الشركة", "أخبار السوق", "مقالات", "دراسات حالة", "فيديوهات"],
    search: "ابحث في S C News",
    cta: "اطلب خدمة",
    breaking: "عاجل",
    commandLabel: "The Command Center",
    commandTitle: "غرفة التحكم في أخبار السوق الرقمي",
    commandText: "تابع نبض التقنية، الذكاء الاصطناعي، الاقتصاد، السوشيال، والتسويق الرقمي في مساحة واحدة تربط الخبر بما يعنيه لشركتك.",
    startReading: "ابدأ القراءة",
    browseSections: "تصفح الأقسام",
    hotNow: "الأكثر سخونة الآن",
    editorPicks: "اختيارات التحرير",
    chooseInterest: "ماذا تريد أن تتابع؟",
    whatItMeans: "ماذا يعني هذا لشركتك؟",
    whatItMeansText: "نحوّل الخبر إلى زاوية عملية: لماذا يهم؟ وكيف يمكن أن تستفيد منه في التسويق أو النمو أو إدارة حضورك الرقمي.",
    openSection: "افتح الصفحة",
    allSections: "كل الأقسام",
    sectionSnapshots: "لقطات من غرف الأخبار",
    latest: "أحدث الأخبار",
    company: "أخبار الشركة",
    guides: "مقالات ونصائح",
    videos: "فيديوهات",
    caseStudies: "قصص نجاح",
    categories: "الأقسام",
    trending: "الأكثر قراءة",
    readMore: "اقرأ المزيد",
    newsletterTitle: "اشترك ليصلك أحدث أخبار السوق ونصائح تساعد شركتك على النمو.",
    newsletterPlaceholder: "البريد الإلكتروني",
    subscribe: "اشترك",
    sourceFallback: "محتوى تجريبي حتى يتم ربط CMS",
    readTime: "دقائق قراءة",
    views: "مشاهدة",
    articleBack: "العودة إلى S C News",
    related: "مقالات ذات صلة",
    subscribeDone: "تم تسجيل بريدك بنجاح",
    subscribeError: "تعذر التسجيل الآن، حاول لاحقًا",
    breadcrumbHome: "الرئيسية",
    updatedAt: "آخر تحديث",
    shareArticle: "شارك المقال",
    tableOfContents: "محتويات المقال",
    importantInfo: "معلومة مهمة",
    importantInfoText: "المقالات التي تستهدف كلمات مفتاحية واضحة وتربط بالخدمات المناسبة تساعد في تحسين ظهور الموقع على جوجل مع الوقت.",
    articleCtaTitle: "هل تريد إنشاء محتوى أخبار احترافي لشركتك؟",
    articleCtaText: "تواصل معنا واحصل على خطة محتوى وربط داخلي مناسبة لنشاطك.",
    internalLinks: "اقرأ أيضًا",
    authorTitle: "كاتب المقال",
    allAuthorArticles: "كل مقالات الكاتب",
    previousArticle: "المقال السابق",
    nextArticle: "المقال التالي",
    latestSidebar: "أحدث الأخبار",
    sidebarSearch: "ابحث في الموقع",
    searchButton: "بحث",
    siteCategories: "الأقسام",
    servicesBanner: "خدماتنا تساعدك على الظهور في نتائج البحث",
    discoverServices: "اكتشف الخدمات",
    newsletterMini: "اشترك ليصلك كل جديد",
    copied: "تم نسخ الرابط"
  },
  en: {
    promo: "Discover digital solutions that help your company grow",
    learnMore: "Learn more",
    today: "Today",
    quickLinks: ["About", "Contact", "Advertise"],
    nav: ["Home", "Company News", "Market News", "Articles", "Case Studies", "Videos"],
    search: "Search S C News",
    cta: "Request service",
    breaking: "Breaking",
    commandLabel: "The Command Center",
    commandTitle: "Digital market command center",
    commandText: "Track technology, AI, economy, social, and digital marketing signals in one place, with practical context for your company.",
    startReading: "Start reading",
    browseSections: "Browse sections",
    hotNow: "Hot now",
    editorPicks: "Editor picks",
    chooseInterest: "What do you want to follow?",
    whatItMeans: "What does this mean for your company?",
    whatItMeansText: "We translate every story into practical context: why it matters and how your company can use it for marketing, growth, or visibility.",
    openSection: "Open page",
    allSections: "All sections",
    sectionSnapshots: "Newsroom snapshots",
    latest: "Latest News",
    company: "Company Updates",
    guides: "Articles & Guides",
    videos: "Videos",
    caseStudies: "Case Studies",
    categories: "Categories",
    trending: "Most Read",
    readMore: "Read more",
    newsletterTitle: "Subscribe for market news and practical growth insights.",
    newsletterPlaceholder: "Email address",
    subscribe: "Subscribe",
    sourceFallback: "Fallback content until CMS is connected",
    readTime: "min read",
    views: "views",
    articleBack: "Back to S C News",
    related: "Related articles",
    subscribeDone: "Your email has been registered",
    subscribeError: "Subscription failed, please try again",
    breadcrumbHome: "Home",
    updatedAt: "Updated",
    shareArticle: "Share article",
    tableOfContents: "Article contents",
    importantInfo: "Important note",
    importantInfoText: "Articles that target clear keywords and link to relevant services can improve Google visibility over time.",
    articleCtaTitle: "Need a professional news content system for your company?",
    articleCtaText: "Contact us for a content and internal-linking plan tailored to your business.",
    internalLinks: "Read also",
    authorTitle: "Article author",
    allAuthorArticles: "All author articles",
    previousArticle: "Previous article",
    nextArticle: "Next article",
    latestSidebar: "Latest news",
    sidebarSearch: "Search site",
    searchButton: "Search",
    siteCategories: "Categories",
    servicesBanner: "Our services help you show up in search results",
    discoverServices: "Discover services",
    newsletterMini: "Subscribe for updates",
    copied: "Link copied"
  }
} as const;

/**
 * Some older editorial strings were saved after a Windows-1256/UTF-8 mix-up.
 * Normalising them at the presentation boundary keeps existing CMS data intact
 * while ensuring Arabic never appears as "ط§ظ„..." in the newsroom.
 */
function repairArabicText(value: string) {
  const mojibakePairs = value.match(/[طظ][\u0621-\u06ff£]/g) || [];
  if (mojibakePairs.length < 2) return value;
  try {
    const decoder = new TextDecoder("windows-1256");
    const byteForCharacter = new Map<string, number>();
    for (let index = 0; index < 256; index += 1) {
      byteForCharacter.set(decoder.decode(Uint8Array.of(index)), index);
    }
    const bytes = Uint8Array.from(Array.from(value), (character) => byteForCharacter.get(character) ?? character.charCodeAt(0));
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return value;
  }
}

function repairEditorialCopy(value: unknown): void {
  if (typeof value === "string") return;
  if (!value || typeof value !== "object") return;
  Object.entries(value as Record<string, unknown>).forEach(([key, item]) => {
    if (typeof item === "string") (value as Record<string, unknown>)[key] = repairArabicText(item);
    else repairEditorialCopy(item);
  });
}

repairEditorialCopy(copy);
repairEditorialCopy(sectionConfigs);
repairEditorialCopy(sectionIdentityConfig);

const getTitle = (article: NewsArticle, lang: Language) => (lang === "ar" ? article.title_ar : article.title_en || article.title_ar);
const getExcerpt = (article: NewsArticle, lang: Language) => (lang === "ar" ? article.excerpt_ar : article.excerpt_en || article.excerpt_ar);
const getBody = (article: NewsArticle, lang: Language) => (lang === "ar" ? article.body_ar : article.body_en || article.body_ar || article.excerpt_ar);
const getCategoryName = (category: NewsCategory, lang: Language) => (lang === "ar" ? category.name_ar : category.name_en || category.name_ar);
const getAuthorName = (article: NewsArticle, lang: Language) =>
  lang === "ar" ? article.author?.name_ar || "S C News" : article.author?.name_en || article.author?.name_ar || "S C News";

function formatDate(value: string, lang: Language) {
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-EG" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}

function videoEmbedUrl(value?: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.hostname.includes("youtu.be")) return `https://www.youtube-nocookie.com/embed/${url.pathname.slice(1)}`;
    if (url.hostname.includes("youtube.com")) {
      const id = url.searchParams.get("v") || url.pathname.split("/").filter(Boolean).pop();
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (url.hostname.includes("vimeo.com")) {
      const id = url.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

async function readEnvelope<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  const envelope = (await response.json()) as ApiEnvelope<T>;
  return envelope.data;
}

function ArticleImage({ article, large = false, lang }: { article: NewsArticle; large?: boolean; lang?: Language }) {
  if (article.featured_image_url) {
    return (
      <img
        src={publicDriveUrl(article.featured_image_url, article.featured_image_url, large ? "w1800" : "w1000")}
        alt={article.image_alt_ar || article.title_ar}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        loading={large ? "eager" : "lazy"}
      />
    );
  }

  const categoryName = lang ? (lang === "ar" ? article.category?.name_ar : article.category?.name_en || article.category?.name_ar) : article.category?.name_ar;
  
  return (
    <div className="flex h-full w-full items-center justify-center" style={{ backgroundColor: newsTokens.colors.placeholder }}>
      <div className="flex flex-col items-center gap-2 opacity-50" style={{ color: newsTokens.colors.primary }}>
        <Newspaper className="h-8 w-8" />
        <span className="text-xs font-black">{categoryName || 'S C News'}</span>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, action }: { icon: ComponentType<{ className?: string; style?: CSSProperties }>; title: string; action?: string }) {
  return (
    <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:mb-6 sm:flex-row sm:items-end">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#9d027c] text-white sm:h-10 sm:w-10">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </span>
        <div className="min-w-0">
          <h2 className="break-words text-xl font-black leading-8 text-[#1f1f1f] sm:text-2xl lg:text-3xl">{title}</h2>
          <span className="mt-2 block h-1 w-16 rounded-full bg-[#ffbc01]" />
        </div>
      </div>
      {action && <span className="hidden text-sm font-bold text-[#9d027c] sm:inline">{action}</span>}
    </div>
  );
}

function NewsCard({
  article,
  lang,
  onNavigate,
  compact = false
}: {
  article: NewsArticle;
  lang: Language;
  onNavigate: (slug: string) => void;
  compact?: boolean;
}) {
  return (
    <article className="group h-full overflow-hidden rounded-[8px] border bg-white transition-all hover:-translate-y-1" style={{ borderColor: newsTokens.colors.border, boxShadow: newsTokens.colors.bgCard ? newsTokens.shadows.card : "" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = newsTokens.colors.primary + "4D"; e.currentTarget.style.boxShadow = newsTokens.shadows.cardHover; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = newsTokens.colors.border; e.currentTarget.style.boxShadow = newsTokens.shadows.card; }}>
      <button onClick={() => onNavigate(article.slug)} className="block h-full w-full text-start">
        <div className={`overflow-hidden bg-[#f0edf1] ${compact ? "h-28 sm:h-32" : "h-40 sm:h-44 lg:h-48"}`}>
          <ArticleImage article={article} lang={lang} />
        </div>
        <div className="p-3 sm:p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="max-w-full rounded bg-[#ffbc01] px-2.5 py-1 text-[11px] font-black text-[#1f1f1f]">
              {getCategoryName(article.category, lang)}
            </span>
            <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-[#666666]">
              <Clock3 className="h-3.5 w-3.5" />
              {article.read_time_minutes || 4} {copy[lang].readTime}
            </span>
          </div>
          <h3 className={`${compact ? "text-base" : "text-base sm:text-lg"} break-words font-black leading-7 text-[#1f1f1f] group-hover:text-[#9d027c]`}>
            {getTitle(article, lang)}
          </h3>
          {!compact && <p className="mt-3 line-clamp-2 text-sm font-medium leading-7 text-[#666666]">{getExcerpt(article, lang)}</p>}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[12px] font-bold text-[#666666]">
            <span>{formatDate(article.published_at, lang)}</span>
            <span className="text-[#9d027c]">{copy[lang].readMore}</span>
          </div>
        </div>
      </button>
    </article>
  );
}

function SmallArticle({ article, lang, onNavigate }: { article: NewsArticle; lang: Language; onNavigate: (slug: string) => void }) {
  return (
    <button
      onClick={() => onNavigate(article.slug)}
      className="group grid grid-cols-[82px_minmax(0,1fr)] gap-3 rounded-[8px] border border-[#e8e8ee] bg-white p-3 text-start transition hover:border-[#9d027c]/30 sm:grid-cols-[96px_minmax(0,1fr)] sm:rounded-[8px]"
    >
      <div className="h-20 overflow-hidden rounded-[8px] bg-[#f0edf1]">
        <ArticleImage article={article} lang={lang} />
      </div>
      <div className="min-w-0">
        <span className="text-[11px] font-black text-[#9d027c]">{getCategoryName(article.category, lang)}</span>
        <h3 className="mt-1 line-clamp-2 text-sm font-black leading-6 text-[#1f1f1f] group-hover:text-[#9d027c]">
          {getTitle(article, lang)}
        </h3>
        <span className="mt-2 block text-[11px] font-semibold text-[#666666]">{formatDate(article.published_at, lang)}</span>
      </div>
    </button>
  );
}

function TrendingList({ articles, lang, onNavigate }: { articles: NewsArticle[]; lang: Language; onNavigate: (slug: string) => void }) {
  return (
    <aside className="rounded-[8px] border border-[#e8e8ee] bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.05)] sm:rounded-[8px] sm:p-5">
      <SectionTitle icon={TrendingUp} title={copy[lang].trending} />
      <div className="space-y-4">
        {articles.slice(0, 6).map((article, index) => (
          <button key={article.slug} onClick={() => onNavigate(article.slug)} className="group flex w-full gap-3 text-start">
            <span className="shrink-0 font-mono text-2xl font-black text-[#ffbc01]">{String(index + 1).padStart(2, "0")}</span>
            <span className="min-w-0">
              <span className="line-clamp-2 text-sm font-black leading-6 text-[#1f1f1f] group-hover:text-[#9d027c]">
                {getTitle(article, lang)}
              </span>
              <span className="mt-1 block text-[11px] font-semibold text-[#666666]">
                {getCategoryName(article.category, lang)} - {article.views_count || 0} {copy[lang].views}
              </span>
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}

function getHomeArticles(home: NewsHomePayload) {
  return home.latest.length ? home.latest : fallbackHome.latest;
}

function getSectionArticles(home: NewsHomePayload, slug: string) {
  const articles = getHomeArticles(home).filter((item) => item.category.slug === slug);
  const fallback = fallbackArticles.filter((item) => item.category.slug === slug);
  return articles.length ? articles : fallback.length ? fallback : getHomeArticles(home).slice(0, 3);
}

function getSectionIdentity(slug?: string | null) {
  return sectionIdentityConfig[slug || "articles"] || sectionIdentityConfig.articles;
}

function getArticleIdentity(article: NewsArticle) {
  return getSectionIdentity(article.category?.slug);
}

function getIdentityArticles(home: NewsHomePayload, slug: string) {
  return getSectionArticles(home, getSectionIdentity(slug).slug);
}

function getIdentityText(identity: SectionIdentity, lang: Language, key: "editorial" | "tagline" | "heroTitle" | "heroDescription" | "cta" | "sidebarFocus" | "articleInsight") {
  const fields = {
    editorial: lang === "ar" ? identity.editorialAr : identity.editorialEn,
    tagline: lang === "ar" ? identity.taglineAr : identity.taglineEn,
    heroTitle: lang === "ar" ? identity.heroTitleAr : identity.heroTitleEn,
    heroDescription: lang === "ar" ? identity.heroDescriptionAr : identity.heroDescriptionEn,
    cta: lang === "ar" ? identity.ctaAr : identity.ctaEn,
    sidebarFocus: lang === "ar" ? identity.sidebarFocusAr : identity.sidebarFocusEn,
    articleInsight: lang === "ar" ? identity.articleInsightAr : identity.articleInsightEn
  };

  return fields[key];
}

function getIdentityChips(identity: SectionIdentity, lang: Language) {
  return lang === "ar" ? identity.quickChipsAr : identity.quickChipsEn;
}

function getIdentityPatternStyle(identity: SectionIdentity): CSSProperties {
  const dot = `${identity.accent}22`;
  const line = `${identity.accent}18`;

  if (identity.pattern === "circuit") {
    return {
      backgroundImage: `linear-gradient(90deg, ${line} 1px, transparent 1px), linear-gradient(${line} 1px, transparent 1px)`,
      backgroundSize: "34px 34px"
    };
  }

  if (identity.pattern === "neural") {
    return {
      backgroundImage: `radial-gradient(circle at 20% 20%, ${dot} 0 2px, transparent 3px), radial-gradient(circle at 70% 40%, ${dot} 0 3px, transparent 4px), linear-gradient(135deg, ${line}, transparent 40%)`,
      backgroundSize: "120px 120px, 180px 180px, auto"
    };
  }

  if (identity.pattern === "ticker") {
    return {
      backgroundImage: `linear-gradient(120deg, transparent 0 42%, ${line} 43% 45%, transparent 46% 100%)`,
      backgroundSize: "44px 44px"
    };
  }

  if (identity.pattern === "hashtags") {
    return {
      backgroundImage: `radial-gradient(circle, ${dot} 0 2px, transparent 2.5px)`,
      backgroundSize: "28px 28px"
    };
  }

  if (identity.pattern === "shield") {
    return {
      backgroundImage: `linear-gradient(45deg, ${line} 25%, transparent 25%, transparent 50%, ${line} 50%, ${line} 75%, transparent 75%, transparent)`,
      backgroundSize: "42px 42px"
    };
  }

  return {
    backgroundImage: `radial-gradient(circle at 1px 1px, ${dot} 1px, transparent 0)`,
    backgroundSize: "24px 24px"
  };
}



function NewsroomDirectory({
  lang,
  onNavigateCategory
}: {
  lang: Language;
  onNavigateCategory: (slug: string) => void;
}) {
  const t = copy[lang];
  const sections = orderedSectionSlugs
    .map((slug) => sectionConfigs.find((section) => section.slug === slug))
    .filter(Boolean) as SectionConfig[];

  return (
    <section className="bg-[#f7f7f9] py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle icon={ListTree} title={t.sectionSnapshots} action={t.openSection} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => {
            const identity = getSectionIdentity(section.slug);
            const Icon = identity.icon;
            return (
              <button
                key={section.slug}
                onClick={() => onNavigateCategory(section.slug)}
                className="group relative min-h-[210px] overflow-hidden rounded-[8px] border border-[#e8e8ee] bg-white p-4 text-start shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:border-[#9d027c]/25 sm:min-h-[230px] sm:p-5"
                style={{ background: `linear-gradient(135deg, ${identity.soft}, #ffffff 64%)`, ...getIdentityPatternStyle(identity) }}
              >
                <div className="relative z-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[8px] text-white" style={{ backgroundColor: identity.accent }}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="mt-4 inline-flex rounded-full bg-white px-3 py-1.5 text-xs font-black shadow-sm" style={{ color: identity.accent }}>
                    {getIdentityText(identity, lang, "editorial")}
                  </span>
                  <h3 className="mt-4 break-words text-xl font-black leading-8 text-[#161616] group-hover:text-[#9d027c] sm:text-2xl sm:leading-9">
                    {lang === "ar" ? section.nameAr : section.nameEn}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm font-semibold leading-7 text-[#666]">
                    {getIdentityText(identity, lang, "tagline")}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-xs font-black" style={{ color: identity.accent }}>
                    {t.openSection}
                    {lang === "ar" ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function getArticleSections(article: NewsArticle, lang: Language) {
  const body = getBody(article, lang) || "";
  const paragraphs = body.split("\n").filter(Boolean);
  const fallback = lang === "ar"
    ? ["لماذا تحتاج الشركة إلى قسم أخبار؟", "كيف تساعد المقالات في تحسين SEO؟", "ما العناصر الأساسية في صفحة المقال؟", "نصائح لكتابة مقال متوافق"]
    : ["Why companies need a newsroom", "How articles improve SEO", "Core article page elements", "Tips for SEO-friendly writing"];

  return fallback.slice(0, Math.max(3, Math.min(4, paragraphs.length || 4))).map((title, index) => ({
    id: `article-section-${index + 1}`,
    title,
    paragraph: paragraphs[index] || getExcerpt(article, lang)
  }));
}

function ShareButtons({
  article,
  lang,
  copied,
  onCopy
}: {
  article: NewsArticle;
  lang: Language;
  copied: boolean;
  onCopy: () => void;
}) {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const title = getTitle(article, lang);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const buttons = [
    { label: "Facebook", icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { label: "LinkedIn", icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` }
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {buttons.map((button) => {
        const Icon = button.icon;
        return (
          <a
            key={button.label}
            href={button.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={button.label}
            className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-[#e8e8ee] bg-white text-[#9d027c] transition hover:border-[#ffbc01] hover:bg-[#ffbc01] hover:text-[#1f1f1f]"
          >
            <Icon className="h-4 w-4" />
          </a>
        );
      })}
      <button
        type="button"
        onClick={onCopy}
        className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-[#e8e8ee] bg-white px-3 text-xs font-black text-[#9d027c] transition hover:border-[#ffbc01] hover:bg-[#ffbc01] hover:text-[#1f1f1f]"
      >
        {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copied ? copy[lang].copied : "Copy"}
      </button>
    </div>
  );
}

function ArticleSidebar({
  lang,
  identity,
  latest,
  trending,
  categories,
  query,
  setQuery,
  email,
  setEmail,
  newsletterState,
  submitNewsletter,
  onNavigate,
  setActiveTab
}: {
  lang: Language;
  identity?: SectionIdentity;
  latest: NewsArticle[];
  trending: NewsArticle[];
  categories: NewsCategory[];
  query: string;
  setQuery: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  newsletterState: "idle" | "success" | "error";
  submitNewsletter: (event: React.FormEvent) => void;
  onNavigate: (slug: string) => void;
  setActiveTab?: (tab: string) => void;
}) {
  const t = copy[lang];
  const activeIdentity = identity || sectionIdentityConfig.articles;

  return (
    <aside className="space-y-5 xl:sticky xl:top-40">
      <div className="rounded-[8px] border border-[#e8e8ee] bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
        <h3 className="mb-3 text-base font-black text-[#1f1f1f]">{t.sidebarSearch}</h3>
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.search}
            className="min-h-11 min-w-0 flex-1 rounded-[8px] border border-[#e8e8ee] bg-[#f7f7f9] px-3 text-sm font-semibold outline-none focus:border-[#9d027c]"
          />
          <button className="rounded-[8px] bg-[#9d027c] px-4 text-xs font-black text-white transition hover:bg-[#ffbc01] hover:text-[#1f1f1f]">
            {t.searchButton}
          </button>
        </div>
      </div>

      <TrendingList articles={trending} lang={lang} onNavigate={onNavigate} />

      <div className="rounded-[8px] border border-[#e8e8ee] bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
        <h3 className="mb-4 text-lg font-black text-[#9d027c]">{t.latestSidebar}</h3>
        <div className="space-y-3">
          {latest.slice(0, 4).map((item) => (
            <SmallArticle key={item.slug} article={item} lang={lang} onNavigate={onNavigate} />
          ))}
        </div>
      </div>

      <div className="rounded-[8px] border border-[#e8e8ee] bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
        <h3 className="mb-4 text-lg font-black text-[#9d027c]">{t.siteCategories}</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span key={category.slug} className="rounded-[8px] border border-[#e8e8ee] px-3 py-2 text-xs font-black text-[#666666]">
              {getCategoryName(category, lang)}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-[8px] border p-5" style={{ borderColor: `${activeIdentity.accent}33`, backgroundColor: activeIdentity.soft }}>
        <Megaphone className="h-7 w-7" style={{ color: activeIdentity.accent }} />
        <h3 className="mt-3 text-lg font-black leading-7 text-[#1f1f1f]">{getIdentityText(activeIdentity, lang, "sidebarFocus")}</h3>
        <p className="mt-2 text-sm font-semibold leading-7 text-[#666]">{getIdentityText(activeIdentity, lang, "articleInsight")}</p>
        <button
          onClick={() => setActiveTab?.("services")}
          className="mt-4 rounded-[8px] px-4 py-2 text-xs font-black text-white"
          style={{ backgroundColor: activeIdentity.accent }}
        >
          {getIdentityText(activeIdentity, lang, "cta") || t.discoverServices}
        </button>
      </div>

      <form onSubmit={submitNewsletter} className="rounded-[8px] p-5 text-white" style={{ backgroundColor: activeIdentity.accent }}>
        <Mail className="h-7 w-7 text-[#ffbc01]" />
        <h3 className="mt-3 text-lg font-black">{t.newsletterMini}</h3>
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t.newsletterPlaceholder}
          className="mt-4 min-h-11 w-full rounded-[8px] border border-white/20 bg-white px-3 text-sm font-bold text-[#1f1f1f] outline-none"
        />
        <button className="mt-3 min-h-11 w-full rounded-[8px] bg-[#ffbc01] text-xs font-black text-[#1f1f1f]">
          {t.subscribe}
        </button>
        {newsletterState !== "idle" && (
          <p className="mt-3 text-xs font-bold text-white/85">
            {newsletterState === "success" ? t.subscribeDone : t.subscribeError}
          </p>
        )}
      </form>
    </aside>
  );
}

function ArticleJsonLd({
  article,
  lang
}: {
  article: NewsArticle;
  lang: Language;
}) {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: getTitle(article, lang),
        description: getExcerpt(article, lang),
        image: article.featured_image_url ? [article.featured_image_url] : undefined,
        datePublished: article.published_at,
        dateModified: article.updated_at || article.published_at,
        author: {
          "@type": "Person",
          name: getAuthorName(article, lang)
        },
        publisher: {
          "@type": "Organization",
          name: "S C MARKTING"
        },
        mainEntityOfPage: url
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: copy[lang].breadcrumbHome, item: "/news" },
          { "@type": "ListItem", position: 2, name: getCategoryName(article.category, lang) },
          { "@type": "ListItem", position: 3, name: getTitle(article, lang), item: url }
        ]
      }
    ]
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

function CategorySpecialBlock({
  section,
  identity,
  lang,
  articles,
  onNavigate,
  setActiveTab
}: {
  section: SectionConfig;
  identity: SectionIdentity;
  lang: Language;
  articles: NewsArticle[];
  onNavigate: (slug: string) => void;
  setActiveTab?: (tab: string) => void;
}) {
  const chips = getIdentityChips(identity, lang);
  const goals = lang === "ar"
    ? ["زيادة الزيارات", "زيادة المبيعات", "تحسين السوشيال", "تحسين الظهور"]
    : ["More traffic", "More sales", "Better social", "Better visibility"];

  if (identity.moduleType === "market_pulse") {
    return (
      <div className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {["EGX30 +0.4%", "Gold -0.2%", "USD Stable", "Ad CPM +6%", "Retail demand", "Funding watch"].map((item) => (
            <div key={item} className="rounded-[8px] border border-[#e8e8ee] bg-white p-4 font-mono text-lg font-black text-[#161616]">
              {item}
            </div>
          ))}
        </div>
        <div className="rounded-[8px] bg-white p-5">
          <h3 className="text-xl font-black text-[#161616]">{getIdentityText(identity, lang, "sidebarFocus")}</h3>
          <p className="mt-3 text-sm font-semibold leading-7 text-[#666]">{getIdentityText(identity, lang, "articleInsight")}</p>
        </div>
      </div>
    );
  }

  if (identity.moduleType === "ai_radar") {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {(lang === "ar" ? ["أداة الأسبوع", "Prompt جاهز", "تطبيق في الشركات"] : ["Tool of the week", "Ready prompt", "Business use case"]).map((title, index) => (
          <div key={title} className="rounded-[8px] border border-[#e8e8ee] bg-white p-5">
            <span className="rounded-[8px] px-3 py-1 text-xs font-black text-white" style={{ backgroundColor: identity.accent }}>
              AI / 0{index + 1}
            </span>
            <h3 className="mt-4 text-xl font-black text-[#161616]">{title}</h3>
            <p className="mt-3 text-sm font-semibold leading-7 text-[#666]">
              {articles[index] ? getExcerpt(articles[index], lang) : getIdentityText(identity, lang, "articleInsight")}
            </p>
          </div>
        ))}
      </div>
    );
  }

  if (identity.moduleType === "trend_wall") {
    return (
      <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[8px] bg-[#161616] p-5 text-white">
          <h3 className="text-2xl font-black">Hot Now</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {["#AI", "#TikTok", "#Reels", "#Creators", "#Ads"].map((tag) => (
              <span key={tag} className="rounded-full bg-white/10 px-3 py-2 text-xs font-black text-[#ffbc01]">{tag}</span>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {articles.slice(0, 4).map((item) => (
            <SmallArticle key={item.slug} article={item} lang={lang} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    );
  }

  if (identity.moduleType === "growth_hub") {
    return (
      <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[8px] bg-white p-5">
          <h3 className="text-xl font-black text-[#161616]">{getIdentityText(identity, lang, "cta")}</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {goals.map((goal) => (
              <button key={goal} onClick={() => setActiveTab?.("services")} className="rounded-[8px] bg-[#ffbc01] px-4 py-2 text-sm font-black text-[#161616]">
                {goal}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {articles.slice(0, 4).map((item) => <NewsCard key={item.slug} article={item} lang={lang} onNavigate={onNavigate} compact />)}
        </div>
      </div>
    );
  }

  if (identity.moduleType === "proof_gallery") {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {["+180%", "+65%", "-40%"].map((metric, index) => (
          <div key={metric} className="rounded-[8px] border border-[#e8e8ee] bg-white p-5">
            <div className="text-4xl font-black" style={{ color: identity.accent }}>{metric}</div>
            <p className="mt-2 text-sm font-bold text-[#6b6b6b]">
              {lang === "ar"
                ? ["زيادة في الزيارات", "تحسين معدل التحويل", "انخفاض تكلفة الإعلان"][index]
                : ["Traffic growth", "Conversion lift", "Lower ad cost"][index]}
            </p>
          </div>
        ))}
      </div>
    );
  }

  if (identity.moduleType === "security_alert") {
    return (
      <div className="grid gap-4 md:grid-cols-[0.7fr_1.3fr]">
        <div className="rounded-[8px] border border-[#1d4ed8]/20 bg-white p-5">
          <span className="rounded-[8px] bg-[#1d4ed8] px-3 py-1 text-xs font-black text-white">{lang === "ar" ? "درجة الخطورة" : "Risk level"}</span>
          <div className="mt-4 text-4xl font-black text-[#1d4ed8]">{lang === "ar" ? "متوسطة" : "Medium"}</div>
          <p className="mt-3 text-sm font-semibold leading-7 text-[#666]">{getIdentityText(identity, lang, "articleInsight")}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {articles.slice(0, 4).map((item) => <SmallArticle key={item.slug} article={item} lang={lang} onNavigate={onNavigate} />)}
        </div>
      </div>
    );
  }

  if (identity.moduleType === "startup_roadmap") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(lang === "ar" ? ["فكرة", "إطلاق", "نمو", "توسع"] : ["Idea", "Launch", "Growth", "Scale"]).map((stage, index) => (
          <div key={stage} className="rounded-[8px] border border-[#e8e8ee] bg-white p-5">
            <span className="font-mono text-2xl font-black" style={{ color: identity.accent }}>0{index + 1}</span>
            <h3 className="mt-3 text-lg font-black text-[#161616]">{stage}</h3>
            <p className="mt-2 text-sm font-semibold leading-7 text-[#666]">{chips[index] || getIdentityText(identity, lang, "articleInsight")}</p>
          </div>
        ))}
      </div>
    );
  }

  if (identity.moduleType === "media_studio") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {articles.slice(0, 4).map((item) => (
          <div key={item.slug} className="relative">
            <NewsCard article={item} lang={lang} onNavigate={onNavigate} compact />
            <span className="pointer-events-none absolute end-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#ffbc01] text-[#161616] shadow-lg">
              <Play className="h-5 w-5 fill-current" />
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (identity.moduleType === "company_timeline") {
    return (
      <div className="space-y-3">
        {articles.slice(0, 5).map((item, index) => (
          <button key={item.slug} onClick={() => onNavigate(item.slug)} className="grid w-full gap-3 rounded-[8px] border border-[#e8e8ee] bg-white p-4 text-start sm:grid-cols-[90px_1fr]">
            <span className="font-mono text-2xl font-black" style={{ color: identity.accent }}>{String(index + 1).padStart(2, "0")}</span>
            <span>
              <span className="block text-lg font-black text-[#161616]">{getTitle(item, lang)}</span>
              <span className="mt-2 block text-sm font-semibold leading-7 text-[#666]">{getExcerpt(item, lang)}</span>
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {articles.slice(0, 4).map((item) => (
        <NewsCard key={item.slug} article={item} lang={lang} onNavigate={onNavigate} compact />
      ))}
    </div>
  );
}


function NewsMasthead({
  lang,
  query,
  setQuery,
  onNavigateHome,
  onNavigateCategory,
  activeSlug,
  setActiveTab
}: {
  lang: Language;
  query: string;
  setQuery: (value: string) => void;
  onNavigateHome: () => void;
  onNavigateCategory: (slug: string) => void;
  activeSlug: string | null;
  setActiveTab?: (tab: string) => void;
}) {
  const t = copy[lang];
  const isAr = lang === "ar";
  
  return (
    <>
      <section className="border-b" style={{ borderColor: newsTokens.colors.border, backgroundColor: newsTokens.colors.bgCard }}>
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-3 text-xs font-bold md:flex-row md:items-center" style={{ color: newsTokens.colors.textLight }}>
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" style={{color: newsTokens.colors.primary}} />
              {t.today}: {formatDate(new Date().toISOString(), lang)}
            </span>
            <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {t.quickLinks.map((link) => (
                <button key={link} className="transition" style={{color: newsTokens.colors.textLight}} onMouseEnter={(e) => e.currentTarget.style.color = newsTokens.colors.primary} onMouseLeave={(e) => e.currentTarget.style.color = newsTokens.colors.textLight}>{link}</button>
              ))}
              <Facebook className="h-4 w-4 transition hover:scale-110" style={{color: newsTokens.colors.primary}} />
              <Youtube className="h-4 w-4 transition hover:scale-110" style={{color: newsTokens.colors.primary}} />
            </span>
          </div>
        </div>
      </section>

      <section className="sticky top-[66px] z-30 border-b shadow-sm sm:top-[74px] lg:top-[78px]" style={{ borderColor: newsTokens.colors.border, backgroundColor: newsTokens.colors.bgCard }}>
        <div className="mx-auto flex max-w-7xl flex-col items-stretch justify-between gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center lg:px-8">
          <button onClick={onNavigateHome} className="shrink-0 text-start group">
            <div className="text-xl font-black tracking-tight sm:text-2xl" style={{ color: newsTokens.colors.textMain }}>
              <span style={{color: newsTokens.colors.primary}}>S C</span> News
            </div>
            <div className="hidden text-[11px] font-bold lg:block" style={{ color: newsTokens.colors.textMuted }}>{isAr ? "بوابة أخبار التسويق والنمو الرقمي" : "Marketing & growth newsroom"}</div>
          </button>
          <div className="flex min-w-0 items-center gap-2">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-[8px] border px-3 py-2 md:max-w-xs transition-colors focus-within:border-[#9d027c]" style={{ borderColor: newsTokens.colors.border, backgroundColor: newsTokens.colors.bgMain }}>
              <Search className="h-4 w-4 shrink-0" style={{color: newsTokens.colors.primary}} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none" style={{color: newsTokens.colors.textMain}} />
            </label>
            <button onClick={() => setActiveTab?.("contact")} className="hidden shrink-0 rounded-[8px] px-4 py-2 text-xs font-black sm:inline-flex transition hover:opacity-90" style={{backgroundColor: newsTokens.colors.secondary, color: newsTokens.colors.textMain}}>{t.cta}</button>
          </div>
        </div>
        <div className="border-t" style={{ borderColor: newsTokens.colors.placeholder }}>
          <nav className="mx-auto flex max-w-7xl snap-x gap-0.5 overflow-x-auto px-3 sm:px-6 lg:px-8" style={{ scrollbarWidth: 'none' }}>
            <button
              onClick={onNavigateHome}
              className="group flex shrink-0 snap-start flex-col items-center gap-1 border-b-2 px-3 py-2.5 text-[11px] font-black transition"
              style={activeSlug === null ? { color: newsTokens.colors.primary, borderColor: newsTokens.colors.primary } : { color: newsTokens.colors.textLight, borderColor: 'transparent' }}
            >
              <span className="h-1.5 w-1.5 rounded-full transition" style={{ backgroundColor: newsTokens.colors.primary, opacity: activeSlug === null ? 1 : 0 }} />
              {isAr ? "الرئيسية" : "Home"}
            </button>
            {sectionConfigs.map((item) => {
              const isActive = activeSlug === item.slug;
              return (
                <button
                  key={item.slug}
                  onClick={() => onNavigateCategory(item.slug)}
                  className={`group flex shrink-0 snap-start flex-col items-center gap-1 border-b-2 px-3 py-2.5 text-[11px] font-black transition`}
                  style={isActive ? { color: item.accent, borderColor: item.accent } : { color: newsTokens.colors.textLight, borderColor: 'transparent' }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = '#333' }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = newsTokens.colors.textLight }}
                >
                  <span className="h-1.5 w-1.5 rounded-full transition" style={{ backgroundColor: item.accent, opacity: isActive ? 1 : 0 }} />
                  {isAr ? item.nameAr : item.nameEn}
                </button>
              );
            })}
          </nav>
        </div>
      </section>
    </>
  );
}

function NewsCategoryPage({
  section,
  identity,
  articles,
  home,
  lang,
  query,
  setQuery,
  email,
  setEmail,
  newsletterState,
  submitNewsletter,
  onNavigateArticle,
  onNavigateHome,
  onNavigateCategory,
  setActiveTab
}: {
  section: SectionConfig;
  identity: SectionIdentity;
  articles: NewsArticle[];
  home: NewsHomePayload;
  lang: Language;
  query: string;
  setQuery: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  newsletterState: "idle" | "success" | "error";
  submitNewsletter: (event: React.FormEvent) => void;
  onNavigateArticle: (slug: string) => void;
  onNavigateHome: () => void;
  onNavigateCategory: (slug: string) => void;
  setActiveTab?: (tab: string) => void;
}) {
  const t = copy[lang];
  const isAr = lang === "ar";
  const Icon = identity.icon;
  const categoryArticles = articles.length ? articles : fallbackArticles.filter((item) => item.category.slug === section.slug);
  const displayArticles = categoryArticles.length ? categoryArticles : fallbackHome.latest;
  const featured = displayArticles[0];
  const sideArticles = displayArticles.slice(1, 5);
  const description = getIdentityText(identity, lang, "heroDescription");
  const chips = getIdentityChips(identity, lang);

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen overflow-x-hidden bg-[#f7f7f9] pt-20 text-[#161616] sm:pt-24">
      <NewsMasthead lang={lang} query={query} setQuery={setQuery} onNavigateHome={onNavigateHome} onNavigateCategory={onNavigateCategory} activeSlug={section.slug} setActiveTab={setActiveTab} />

      <main className="pb-16 text-[#161616] sm:pb-20">
        <div className="mx-auto max-w-7xl px-3 pt-5 sm:px-6 sm:pt-6 lg:px-8">
          <nav className="mb-5 flex flex-wrap items-center gap-2 text-xs font-bold text-[#6b6b6b]">
            <button onClick={onNavigateHome} className="text-[#9d027c]">{t.breadcrumbHome}</button>
            <span>›</span>
            <span className="flex items-center gap-1.5" style={{ color: identity.accent }}>
              <Icon className="h-3.5 w-3.5" />
              {isAr ? section.nameAr : section.nameEn}
            </span>
          </nav>

          <section className="rounded-[8px] border border-[#e8e8ee] p-4 sm:p-6" style={{ backgroundColor: identity.soft, ...getIdentityPatternStyle(identity) }}>
            <SectionTitle icon={identity.icon} title={getIdentityText(identity, lang, "sidebarFocus")} />
            <CategorySpecialBlock section={section} identity={identity} lang={lang} articles={displayArticles} onNavigate={onNavigateArticle} setActiveTab={setActiveTab} />
          </section>

        <section className="mt-6 grid gap-5 sm:mt-8 md:grid-cols-[1.15fr_0.85fr]">
          {featured && (
            <button onClick={() => onNavigateArticle(featured.slug)} className="group overflow-hidden rounded-[8px] border border-[#e8e8ee] bg-white text-start shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
              <div className="h-[220px] overflow-hidden bg-[#f0edf1] sm:h-[340px] lg:h-[420px]">
                <ArticleImage article={featured} large lang={lang} />
              </div>
              <div className="p-4 sm:p-5">
                <span className="rounded bg-[#ffbc01] px-3 py-1 text-xs font-black text-[#161616]">{getCategoryName(featured.category, lang)}</span>
                <h2 className="mt-4 break-words text-xl font-black leading-8 text-[#161616] group-hover:text-[#9d027c] sm:text-2xl sm:leading-9 lg:text-3xl">{getTitle(featured, lang)}</h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-[#666]">{getExcerpt(featured, lang)}</p>
              </div>
            </button>
          )}
          <div className="grid gap-4">
            {sideArticles.map((item) => (
              <SmallArticle key={item.slug} article={item} lang={lang} onNavigate={onNavigateArticle} />
            ))}
          </div>
        </section>

        <section className="mt-10 grid gap-8 sm:mt-12 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <SectionTitle icon={Newspaper} title={t.latest} />
            <div className="grid gap-5 sm:grid-cols-2">
              {displayArticles.slice(0, 8).map((item) => (
                <NewsCard key={item.slug} article={item} lang={lang} onNavigate={onNavigateArticle} />
              ))}
            </div>
          </div>
          <ArticleSidebar
            lang={lang}
            identity={identity}
            latest={home.latest.length ? home.latest : fallbackHome.latest}
            trending={home.trending.length ? home.trending : fallbackHome.trending}
            categories={home.categories.length ? home.categories : fallbackHome.categories}
            query={query}
            setQuery={setQuery}
            email={email}
            setEmail={setEmail}
            newsletterState={newsletterState}
            submitNewsletter={submitNewsletter}
            onNavigate={onNavigateArticle}
            setActiveTab={setActiveTab}
          />
        </section>

        <section className="mt-12 flex items-center justify-center gap-2">
          <button className="rounded-[8px] border border-[#e8e8ee] bg-white px-4 py-2 text-sm font-black text-[#666]">1</button>
          <button className="rounded-[8px] border border-[#e8e8ee] bg-white px-4 py-2 text-sm font-black text-[#666]">2</button>
          <button className="rounded-[8px] bg-[#9d027c] px-4 py-2 text-sm font-black text-white">{isAr ? "المزيد" : "More"}</button>
        </section>
        </div>{/* end max-w-7xl wrapper */}
      </main>
    </div>
  );
}

export default function SCNewsPage({ currentLang, setActiveTab }: SCNewsPageProps) {
  const t = copy[currentLang];
  const isAr = currentLang === "ar";
  const [home, setHome] = useState<NewsHomePayload>(fallbackHome);
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [routeSlug, setRouteSlug] = useState<string | null>(null);
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const [categoryArticles, setCategoryArticles] = useState<NewsArticle[]>([]);
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");
  const [newsletterState, setNewsletterState] = useState<"idle" | "success" | "error">("idle");
  const [usingFallback, setUsingFallback] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState("all");

  const refreshRoute = () => {
    if (typeof window === "undefined") return;
    const match = window.location.pathname.match(/^\/news\/articles\/([^/]+)/);
    const categoryMatch = window.location.pathname.match(/^\/news\/([^/]+)/);
    setRouteSlug(match?.[1] || null);
    setCategorySlug(!match && categoryMatch?.[1] ? categoryMatch[1] : null);
  };

  useEffect(() => {
    refreshRoute();
    window.addEventListener("popstate", refreshRoute);
    return () => window.removeEventListener("popstate", refreshRoute);
  }, []);

  useEffect(() => {
    let cancelled = false;
    readEnvelope<NewsHomePayload>(`${API_BASE}/api/news/home/`)
      .then((payload) => {
        if (!cancelled && payload) {
          setHome({
            ...fallbackHome,
            ...payload,
            featured: payload.featured || fallbackHome.featured
          });
          setUsingFallback(false);
        }
      })
      .catch(() => setUsingFallback(true));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!routeSlug) {
      setArticle(null);
      return;
    }

    const localArticle = fallbackArticles.find((item) => item.slug === routeSlug) || null;
    setArticle(localArticle);

    let cancelled = false;
    readEnvelope<NewsArticle>(`${API_BASE}/api/news/articles/${routeSlug}/`)
      .then((payload) => {
        if (!cancelled) setArticle(payload);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [routeSlug]);

  useEffect(() => {
    if (!categorySlug) {
      setCategoryArticles([]);
      return;
    }

    const localArticles = fallbackArticles.filter((item) => item.category.slug === categorySlug);
    setCategoryArticles(localArticles);

    let cancelled = false;
    readEnvelope<NewsArticle[]>(`${API_BASE}/api/news/categories/${categorySlug}/articles/`)
      .then((payload) => {
        if (!cancelled && Array.isArray(payload)) setCategoryArticles(payload);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [categorySlug]);

  const navigateToArticle = (slug: string) => {
    const path = `/news/articles/${slug}/`;
    window.history.pushState({}, "", path);
    setRouteSlug(slug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateHome = () => {
    window.history.pushState({}, "", "/news");
    setRouteSlug(null);
    setCategorySlug(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToCategory = (slug: string) => {
    const section = sectionConfigs.find((item) => item.slug === slug);
    window.history.pushState({}, "", section?.url || `/news/${slug}`);
    setRouteSlug(null);
    setCategorySlug(slug);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const copyArticleLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 1800);
    } catch {
      setCopiedLink(false);
    }
  };

  const filteredLatest = useMemo(() => {
    const source = selectedInterest === "all"
      ? getHomeArticles(home)
      : getIdentityArticles(home, selectedInterest);
    if (!query.trim()) return source;
    const q = query.trim().toLowerCase();
    return source.filter((item) =>
      `${item.title_ar} ${item.title_en || ""} ${item.excerpt_ar} ${item.excerpt_en || ""}`.toLowerCase().includes(q)
    );
  }, [home, query, selectedInterest]);

  const submitNewsletter = async (event: React.FormEvent) => {
    event.preventDefault();
    setNewsletterState("idle");
    try {
      await readEnvelope(`${API_BASE}/api/news/newsletter/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "sc_news_page" })
      });
      setNewsletterState("success");
      setEmail("");
    } catch {
      setNewsletterState("error");
    }
  };

  if (routeSlug && article) {
    const articleIdentity = getArticleIdentity(article);
    const related = article.related_articles?.length ? article.related_articles : fallbackArticles.filter((item) => item.slug !== article.slug).slice(0, 3);
    const latestForArticle = article.latest_articles?.length ? article.latest_articles : home.latest.length ? home.latest : fallbackHome.latest;
    const trendingForArticle = article.trending_articles?.length ? article.trending_articles : home.trending.length ? home.trending : fallbackHome.trending;
    const sections = getArticleSections(article, currentLang);
    const previousArticle = article.previous_article || fallbackArticles.filter((item) => item.slug !== article.slug)[0] || null;
    const nextArticle = article.next_article || fallbackArticles.filter((item) => item.slug !== article.slug)[1] || null;

    return (
      <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen overflow-x-hidden bg-[#f7f7f9] pt-20 text-[#161616] sm:pt-24">
        <ArticleJsonLd article={article} lang={currentLang} />

        <NewsMasthead lang={currentLang} query={query} setQuery={setQuery} onNavigateHome={navigateHome} onNavigateCategory={navigateToCategory} activeSlug={null} setActiveTab={setActiveTab} />

        <section className="text-white" style={{ backgroundColor: articleIdentity.accent }}>
          <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-hidden px-3 py-3 sm:gap-4 sm:px-6 lg:px-8">
            <span className="shrink-0 rounded bg-[#ffbc01] px-3 py-1 text-xs font-black text-[#1f1f1f]">{getIdentityText(articleIdentity, currentLang, "editorial")}</span>
            <div className="flex min-w-0 gap-6 overflow-x-auto text-sm font-bold">
              {(home.breaking.length ? home.breaking : fallbackHome.breaking).map((item) => (
                <button key={item.slug} onClick={() => navigateToArticle(item.slug)} className="shrink-0 hover:text-[#ffbc01]">
                  {getTitle(item, currentLang)}
                </button>
              ))}
            </div>
          </div>
        </section>

        <main className="mx-auto max-w-7xl px-3 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8 lg:px-8">
          <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs font-bold text-[#6b6b6b]">
            <button onClick={navigateHome} className="text-[#9d027c]">{t.breadcrumbHome}</button>
            <span>›</span>
            <span className="text-[#9d027c]">{getCategoryName(article.category, currentLang)}</span>
            <span>›</span>
            <span className="line-clamp-1 max-w-[520px]">{getTitle(article, currentLang)}</span>
          </nav>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
            <article className="min-w-0">
              {/* Category accent banner */}
              <div
                className="relative overflow-hidden rounded-t-[8px] px-4 py-4 sm:px-8 sm:py-5"
                style={{ backgroundColor: articleIdentity.accent, ...getIdentityPatternStyle(articleIdentity) }}
              >
                <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 0%, rgba(255,255,255,0.10) 0%, transparent 60%)" }} />
                <div className="relative flex flex-wrap items-center gap-3">
                  <span className="rounded bg-[#ffbc01] px-3 py-1 text-xs font-black text-[#1f1f1f]">
                    {getCategoryName(article.category, currentLang)}
                  </span>
                  <span className="rounded bg-white/20 px-3 py-1 text-xs font-black text-white backdrop-blur">
                    {getIdentityText(articleIdentity, currentLang, "editorial")}
                  </span>
                  {article.is_breaking && (
                    <span className="rounded bg-red-500 px-3 py-1 text-xs font-black text-white animate-pulse">
                      {currentLang === "ar" ? "عاجل" : "BREAKING"}
                    </span>
                  )}
                </div>
              </div>

              {/* Article title block — white newspaper style */}
              <header className="rounded-b-[8px] border border-t-0 border-[#e8e8ee] bg-white px-4 pb-5 pt-6 shadow-[0_8px_24px_rgba(0,0,0,0.05)] sm:px-8 sm:pb-6 sm:pt-7">
                <h1 className="max-w-4xl break-words text-[clamp(2rem,5vw,3.1rem)] font-black leading-[1.28] tracking-normal text-[#111]">
                  {getTitle(article, currentLang)}
                </h1>
                <p className="mt-5 max-w-3xl border-s-4 ps-4 text-sm font-semibold leading-7 text-[#5f5f5f] sm:text-lg sm:leading-8" style={{ borderColor: articleIdentity.accent }}>
                  {getExcerpt(article, currentLang)}
                </p>

                {/* Metadata strip */}
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-[#e8e8ee] pt-5 text-sm font-bold text-[#6b6b6b]">
                  <span className="inline-flex items-center gap-2" style={{ color: articleIdentity.accent }}>
                    <UserRound className="h-4 w-4" />
                    {getAuthorName(article, currentLang)}
                  </span>
                  <span className="flex items-center gap-1"><CalendarDays className="h-4 w-4" /> {formatDate(article.published_at, currentLang)}</span>
                  <span className="flex items-center gap-1"><Clock3 className="h-4 w-4" /> {article.read_time_minutes || 4} {t.readTime}</span>
                  <span className="flex w-full flex-col items-start gap-2 sm:ms-auto sm:w-auto sm:flex-row sm:items-center">
                    <Share2 className="h-4 w-4" style={{ color: articleIdentity.accent }} />
                    {t.shareArticle}
                    <ShareButtons article={article} lang={currentLang} copied={copiedLink} onCopy={copyArticleLink} />
                  </span>
                </div>
              </header>

              {/* Hero image — full width, no extra card wrapper */}
              <div className="mt-4 overflow-hidden rounded-[8px] border border-[#e8e8ee] bg-[#f0edf1] shadow-sm">
                <div className="h-[220px] overflow-hidden sm:h-[360px] lg:h-[460px]">
                  <ArticleImage article={article} large lang={currentLang} />
                </div>
                {(article.image_alt_ar || article.image_alt_en) && (
                  <p className="border-t border-[#e8e8ee] px-5 py-3 text-xs font-semibold text-[#6b6b6b] sm:px-6">
                    {isAr ? article.image_alt_ar : article.image_alt_en || article.image_alt_ar}
                  </p>
                )}
              </div>

              {(article.source_name || article.source_url) && (
                <div className="mt-4 flex flex-wrap items-center gap-3 rounded-[8px] border border-[#e8e8ee] bg-white px-4 py-3 text-sm font-bold text-[#555]">
                  <span className="inline-flex items-center gap-2" style={{ color: articleIdentity.accent }}><Info className="h-4 w-4" />{currentLang === "ar" ? "المصدر" : "Source"}</span>
                  {article.source_url ? (
                    <a href={article.source_url} target="_blank" rel="noopener noreferrer" className="underline decoration-[#ffbc01] decoration-2 underline-offset-4 hover:text-[#9d027c]">
                      {article.source_name || article.source_url}
                    </a>
                  ) : <span>{article.source_name}</span>}
                </div>
              )}

              {videoEmbedUrl(article.video_url) && (
                <section className="mt-4 overflow-hidden rounded-[8px] border border-[#e8e8ee] bg-[#161616] shadow-sm">
                  <iframe
                    src={videoEmbedUrl(article.video_url) || undefined}
                    title={getTitle(article, currentLang)}
                    className="aspect-video w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </section>
              )}

              <section className="mt-6 rounded-[8px] border border-[#e8e8ee] bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)] sm:p-6">
                <h2 className="flex items-center gap-2 text-lg font-black text-[#161616]">
                  <ListTree className="h-5 w-5" style={{ color: articleIdentity.accent }} />
                  {t.tableOfContents}
                </h2>
                <div className="mt-4 grid gap-2 border-s-4 bg-[#f7f7f9] p-4" style={{ borderColor: articleIdentity.accent }}>
                  {sections.map((section, index) => (
                    <a key={section.id} href={`#${section.id}`} className="text-sm font-bold text-[#555] hover:text-[#9d027c]">
                      {index + 1}. {section.title}
                    </a>
                  ))}
                </div>
              </section>

              <section className="mt-6 rounded-[8px] border border-[#e8e8ee] bg-white p-4 shadow-[0_8px_24px_rgba(0,0,0,0.04)] sm:p-8">
                <div className="max-w-[720px] space-y-8 text-base font-medium leading-8 text-[#2f2f2f] sm:text-[18px] sm:leading-[1.9]">
                  {sections.map((section, index) => (
                    <div key={section.id} id={section.id} className="scroll-mt-36">
                      <h2 className="mb-3 break-words text-xl font-black leading-8 text-[#161616] sm:text-2xl sm:leading-9">{section.title}</h2>
                      <p>{section.paragraph}</p>
                      {index === 0 && (
                        <div className="mt-6 border-s-4 p-4 text-base font-bold leading-8 text-[#4f3b00]" style={{ borderColor: articleIdentity.accent, backgroundColor: articleIdentity.soft }}>
                          <span className="mb-2 flex items-center gap-2 text-[#161616]">
                            <Info className="h-5 w-5" style={{ color: articleIdentity.accent }} />
                            {t.importantInfo}
                          </span>
                          {getIdentityText(articleIdentity, currentLang, "articleInsight")}
                        </div>
                      )}
                      {index === 1 && (
                        <div className="mt-6 rounded-[8px] p-5 text-white" style={{ backgroundColor: articleIdentity.accent }}>
                          <h3 className="text-xl font-black">{getIdentityText(articleIdentity, currentLang, "cta")}</h3>
                          <p className="mt-2 text-base font-semibold leading-8 text-white/80">{getIdentityText(articleIdentity, currentLang, "tagline")}</p>
                          <button onClick={() => setActiveTab?.("contact")} className="mt-4 rounded-[8px] bg-[#ffbc01] px-5 py-2 text-sm font-black text-[#161616]">
                            {t.cta}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-[8px] border border-[#e8e8ee] bg-[#f7f7f9] p-4 sm:p-5">
                  <h3 className="mb-3 flex items-center gap-2 text-base font-black text-[#161616]">
                    <Link2 className="h-4 w-4" style={{ color: articleIdentity.accent }} />
                    {t.internalLinks}
                  </h3>
                  <div className="grid gap-2">
                    {related.slice(0, 3).map((item) => (
                      <button key={item.slug} onClick={() => navigateToArticle(item.slug)} className="text-start text-sm font-bold leading-7 text-[#666] hover:text-[#9d027c]">
                        {getTitle(item, currentLang)}
                      </button>
                    ))}
                  </div>
                </div>

                {!!article.tags?.length && (
                  <div className="mt-8 flex flex-wrap gap-2">
                    {article.tags.map((tagItem) => (
                      <span key={tagItem.slug} className="inline-flex items-center gap-1 rounded-[8px] border bg-white px-3 py-1.5 text-xs font-bold text-[#666666] transition hover:text-white" style={{ borderColor: `${articleIdentity.accent}33` }}>
                        <Tag className="h-3.5 w-3.5" />
                        {isAr ? tagItem.name_ar : tagItem.name_en || tagItem.name_ar}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-8 flex flex-col justify-between gap-4 border-t border-[#e8e8ee] pt-6 sm:flex-row sm:items-center">
                  <span className="text-sm font-black text-[#161616]">{t.shareArticle}</span>
                  <ShareButtons article={article} lang={currentLang} copied={copiedLink} onCopy={copyArticleLink} />
                </div>

                <div className="mt-8 rounded-[8px] border border-[#e8e8ee] bg-[#fbfbfc] p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[8px] text-white" style={{ backgroundColor: articleIdentity.accent }}>
                      {article.author?.avatar_url ? (
                        <img src={publicDriveUrl(article.author.avatar_url, article.author.avatar_url, "w400")} alt={getAuthorName(article, currentLang)} className="h-full w-full rounded-[8px] object-cover" />
                      ) : (
                        <UserRound className="h-8 w-8" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-black" style={{ color: articleIdentity.accent }}>{t.authorTitle}</div>
                      <h3 className="mt-1 text-xl font-black text-[#161616]">{getAuthorName(article, currentLang)}</h3>
                      <p className="mt-2 text-sm font-semibold leading-7 text-[#666666]">
                        {isAr
                          ? article.author?.bio_ar || "نكتب محتوى متخصص حول أخبار السوق، التسويق الرقمي، وتحسين ظهور الشركات على الإنترنت."
                          : article.author?.bio_en || article.author?.bio_ar || "We publish specialized content about market news, digital marketing, and business visibility."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {previousArticle && (
                    <button onClick={() => navigateToArticle(previousArticle.slug)} className="rounded-[8px] border border-[#e8e8ee] bg-white p-4 text-start transition hover:border-[#9d027c]/30">
                      <span className="flex items-center gap-2 text-xs font-black text-[#9d027c]">
                        {isAr ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                        {t.previousArticle}
                      </span>
                      <span className="mt-2 block text-base font-black leading-7 text-[#161616]">{getTitle(previousArticle, currentLang)}</span>
                    </button>
                  )}
                  {nextArticle && (
                    <button onClick={() => navigateToArticle(nextArticle.slug)} className="rounded-[8px] border border-[#e8e8ee] bg-white p-4 text-start transition hover:border-[#9d027c]/30">
                      <span className="flex items-center gap-2 text-xs font-black text-[#9d027c]">
                        {t.nextArticle}
                        {isAr ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </span>
                      <span className="mt-2 block text-base font-black leading-7 text-[#161616]">{getTitle(nextArticle, currentLang)}</span>
                    </button>
                  )}
                </div>
              </section>

              <section className="mt-12">
                <SectionTitle icon={BookOpen} title={t.related} />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {related.map((item) => (
                    <NewsCard key={item.slug} article={item} lang={currentLang} onNavigate={navigateToArticle} compact />
                  ))}
                </div>
              </section>
            </article>

            <ArticleSidebar
              lang={currentLang}
              identity={articleIdentity}
              latest={latestForArticle}
              trending={trendingForArticle}
              categories={home.categories.length ? home.categories : fallbackHome.categories}
              query={query}
              setQuery={setQuery}
              email={email}
              setEmail={setEmail}
              newsletterState={newsletterState}
              submitNewsletter={submitNewsletter}
              onNavigate={navigateToArticle}
              setActiveTab={setActiveTab}
            />
          </div>
        </main>
      </div>
    );
  }

  if (categorySlug) {
    const section = sectionConfigs.find((item) => item.slug === categorySlug) || sectionConfigs.find((item) => item.slug === "articles") || sectionConfigs[0];
    const identity = getSectionIdentity(categorySlug);

    return (
      <NewsCategoryPage
        section={section}
        identity={identity}
        articles={categoryArticles}
        home={home}
        lang={currentLang}
        query={query}
        setQuery={setQuery}
        email={email}
        setEmail={setEmail}
        newsletterState={newsletterState}
        submitNewsletter={submitNewsletter}
        onNavigateArticle={navigateToArticle}
        onNavigateHome={navigateHome}
        onNavigateCategory={navigateToCategory}
        setActiveTab={setActiveTab}
      />
    );
  }

  const featured = home.featured || fallbackHome.featured;
  const heroSide = home.hero_side.length ? home.hero_side : fallbackHome.hero_side;
  const trending = home.trending.length ? home.trending : fallbackHome.trending;

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen overflow-x-hidden bg-[#f7f7f9] pt-20 text-[#1f1f1f] sm:pt-24">
      <NewsMasthead lang={currentLang} query={query} setQuery={setQuery} onNavigateHome={navigateHome} onNavigateCategory={navigateToCategory} activeSlug={null} setActiveTab={setActiveTab} />

      <section className="bg-[#9d027c] text-white mt-4 sm:mt-6">
        <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-hidden px-3 py-3 sm:gap-4 sm:px-6 lg:px-8">
          <span className="shrink-0 rounded bg-[#ffbc01] px-3 py-1 text-xs font-black text-[#1f1f1f]">{t.breaking}</span>
          <div className="flex min-w-0 gap-6 overflow-x-auto text-sm font-bold">
            {(home.breaking.length ? home.breaking : fallbackHome.breaking).map((item) => (
              <button key={item.slug} onClick={() => navigateToArticle(item.slug)} className="shrink-0 hover:text-[#ffbc01]">
                {getTitle(item, currentLang)}
              </button>
            ))}
          </div>
          {usingFallback && <span className="ms-auto hidden shrink-0 text-[11px] font-bold text-white/70 lg:inline">{t.sourceFallback}</span>}
        </div>
      </section>

      <main className="pt-8 sm:pt-10 lg:pt-12">

        <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-8 sm:px-6 md:grid-cols-2 xl:grid-cols-[1.5fr_0.85fr_0.8fr] lg:px-8">
          {featured && (
            <button onClick={() => navigateToArticle(featured.slug)} className="group relative min-h-[360px] overflow-hidden rounded-[8px] bg-[#1f1f1f] text-start shadow-[0_8px_24px_rgba(0,0,0,0.08)] sm:min-h-[440px] md:col-span-2 xl:col-span-1 xl:min-h-[420px]">
              <ArticleImage article={featured} large lang={currentLang} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-7">
                <span className="rounded bg-[#ffbc01] px-3 py-1 text-xs font-black text-[#1f1f1f]">{getCategoryName(featured.category, currentLang)}</span>
                <h2 className="mt-4 break-words text-[clamp(1.75rem,4vw,3rem)] font-black leading-[1.3] tracking-normal text-white">{getTitle(featured, currentLang)}</h2>
                <p className="mt-3 line-clamp-2 max-w-2xl text-sm font-semibold leading-7 text-white/82 sm:line-clamp-none">{getExcerpt(featured, currentLang)}</p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-bold text-white/72">
                  <span>{getAuthorName(featured, currentLang)}</span>
                  <span>{formatDate(featured.published_at, currentLang)}</span>
                </div>
              </div>
            </button>
          )}

          <div className="grid gap-4">
            {heroSide.map((item) => <SmallArticle key={item.slug} article={item} lang={currentLang} onNavigate={navigateToArticle} />)}
          </div>

          <TrendingList articles={trending} lang={currentLang} onNavigate={navigateToArticle} />
        </section>

        <section className="bg-white py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle icon={Newspaper} title={t.latest} />
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredLatest.slice(0, 9).map((item) => <NewsCard key={item.slug} article={item} lang={currentLang} onNavigate={navigateToArticle} />)}
            </div>
          </div>
        </section>

        <NewsroomDirectory lang={currentLang} onNavigateCategory={navigateToCategory} />

        <section className="py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle icon={Tag} title={t.categories} />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {(home.categories.length ? home.categories : fallbackHome.categories).map((category) => (
                <button key={category.slug} onClick={() => navigateToCategory(category.slug)} className="rounded-[8px] border border-[#e8e8ee] bg-white p-5 text-start shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:border-[#9d027c]/30">
                  <h3 className="text-xl font-black text-[#9d027c]">{getCategoryName(category, currentLang)}</h3>
                  <p className="mt-3 text-sm font-medium leading-7 text-[#666666]">
                    {isAr ? category.description_ar || "تابع أحدث الأخبار والتحليلات في هذا القسم." : category.description_en || "Follow the latest updates and analysis in this category."}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-[8px] bg-[#9d027c] p-6 text-white sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div>
                <Mail className="h-8 w-8 text-[#ffbc01]" />
                <h2 className="mt-3 max-w-2xl text-[clamp(1.7rem,4vw,2.6rem)] font-black leading-[1.35] tracking-normal">{t.newsletterTitle}</h2>
              </div>
              <form onSubmit={submitNewsletter} className="flex flex-col gap-3 sm:flex-row">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t.newsletterPlaceholder}
                  className="min-h-12 flex-1 rounded-[8px] border border-white/20 bg-white px-4 text-sm font-bold text-[#1f1f1f] outline-none"
                />
                <button className="min-h-12 rounded-[8px] bg-[#ffbc01] px-6 text-sm font-black text-[#1f1f1f]">{t.subscribe}</button>
              </form>
            </div>
            {newsletterState !== "idle" && (
              <p className="mt-4 text-sm font-bold text-white/85">
                {newsletterState === "success" ? t.subscribeDone : t.subscribeError}
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
