"use client";

import { useMemo, useState, useEffect } from "react";
import type { ComponentType } from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  BadgeCheck,
  Camera,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  Layers3,
  LayoutTemplate,
  LineChart,
  Megaphone,
  MessageCircle,
  Palette,
  PenLine,
  Share2,
  Sparkles,
  SwatchBook,
  WandSparkles,
  Rocket,
  Eye,
  Target,
  Zap,
  Check,
  Plus,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import type { Language } from "../types";
import { publicDriveUrl, siteFetch } from "../lib/siteApi";
import { addPlanToCart } from "../lib/planCart";

interface BrandingServicePageProps {
  currentLang: Language;
  setActiveTab?: (tab: string) => void;
}

type PlatformId = "facebook" | "instagram" | "tiktok" | "linkedin" | "snapchat";
type AddOnId = "copywriting" | "webui" | "trademark";
type ModuleId = "logo" | "guidelines" | "social" | "stationery" | "packaging";

interface PlatformOption {
  id: PlatformId;
  labelAr: string;
  labelEn: string;
  price: number;
}

interface AddOnOption {
  id: AddOnId;
  labelAr: string;
  labelEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  icon: ComponentType<{ className?: string }>;
}

interface WorkshopModule {
  id: ModuleId;
  labelAr: string;
  labelEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  icon: ComponentType<{ className?: string }>;
}

interface PortfolioProject {
  id: string;
  nameAr: string;
  nameEn: string;
  categoryAr: string;
  categoryEn: string;
  resultAr: string;
  resultEn: string;
  palette: string[];
  accent: string;
  metricAr: string;
  metricEn: string;
  imageUrl?: string;
}

const platformLogoMap: Record<PlatformId, string> = {
  facebook: "/logos/meta.png",
  instagram: "/logos/instagram.png",
  tiktok: "/logos/tiktok.png",
  linkedin: "/social-icons/icon7.png",
  snapchat: "/logos/snapchat.png"
};

const platformOptions: PlatformOption[] = [
  { id: "facebook", labelAr: "فيسبوك", labelEn: "Facebook", price: 300 },
  { id: "instagram", labelAr: "إنستجرام", labelEn: "Instagram", price: 300 },
  { id: "tiktok", labelAr: "تيك توك", labelEn: "TikTok", price: 350 },
  { id: "linkedin", labelAr: "لينكد إن", labelEn: "LinkedIn", price: 400 },
  { id: "snapchat", labelAr: "سناب شات", labelEn: "Snapchat", price: 300 }
];

const workshopModules: WorkshopModule[] = [
  {
    id: "logo",
    labelAr: "تصميم الشعار والاتجاه الفني",
    labelEn: "Logo & Art Direction",
    descriptionAr: "٣ خيارات/أفكار مبتكرة، ملفات مصدرية ونظام هندسي دقيق.",
    descriptionEn: "3 concepts, vector source files, and precise grid layout.",
    price: 5000,
    icon: Sparkles
  },
  {
    id: "guidelines",
    labelAr: "دليل الهوية البصرية (Brand Book)",
    labelEn: "Brand Guidelines (Brand Book)",
    descriptionAr: "كتاب القواعد الأساسي: لوحة الألوان، الخطوط، وشبكات التصميم.",
    descriptionEn: "Rules for colors, typography spacing, and grids system.",
    price: 3500,
    icon: SwatchBook
  },
  {
    id: "social",
    labelAr: "حزمة السوشيال ميديا",
    labelEn: "Social Media Templates",
    descriptionAr: "تأسيس شبكة الإنستجرام و٦ قوالب منشورات قابلة للتعديل.",
    descriptionEn: "Instagram grid architecture and 6 custom post layouts.",
    price: 2500,
    icon: LayoutTemplate
  },
  {
    id: "stationery",
    labelAr: "المطبوعات الورقية والرسمية",
    labelEn: "Stationery & Printables",
    descriptionAr: "تصميم كروت الفريق، ورق الخطابات، الأظرف، وتوقيعات الإيميل.",
    descriptionEn: "Business cards, letterheads, envelopes, and email footer.",
    price: 1500,
    icon: FileText
  },
  {
    id: "packaging",
    labelAr: "تصميم العبوات والتغليف",
    labelEn: "Packaging & Bags",
    descriptionAr: "شكل الصندوق، الشنطة، الملصقات، وتفاصيل الكرتون الخارجي.",
    descriptionEn: "Packaging box structure, bag print template, and details.",
    price: 4000,
    icon: Layers3
  }
];

const addOnOptions: AddOnOption[] = [
  {
    id: "copywriting",
    labelAr: "دليل نبرة الصوت والمحتوى",
    labelEn: "Brand Voice & Copywriting",
    descriptionAr: "تحديد لغة الكتابة، نبرة الصوت، وأسلوب طرح الكابشن.",
    descriptionEn: "Defining the tone of voice, slogans, and copy patterns.",
    price: 2000,
    icon: PenLine
  },
  {
    id: "webui",
    labelAr: "تطوير واجهة الويب التجريبية",
    labelEn: "Web UI Visual Mockups",
    descriptionAr: "واجهة مرئية نموذجية تعبر عن روح الهوية على المتصفح.",
    descriptionEn: "Visual layouts that translate the brand to web screens.",
    price: 3000,
    icon: LayoutTemplate
  },
  {
    id: "trademark",
    labelAr: "دعم فني لتسجيل العلامة",
    labelEn: "Trademark Check Support",
    descriptionAr: "مراجعة الشعار وتأكيده قانونياً قبل عملية التسجيل التجاري.",
    descriptionEn: "Checking elements safety against trademark registrations.",
    price: 1500,
    icon: BadgeCheck
  }
];

const portfolioProjects: PortfolioProject[] = [
  {
    id: "noura",
    nameAr: "Noura Lounge",
    nameEn: "Noura Lounge",
    categoryAr: "هوية ضيافة وتجربة رقمية",
    categoryEn: "Hospitality identity and digital experience",
    resultAr: "لغة بصرية راقية تظهر على المنيو، العبوات، والواجهة الاجتماعية اليومية.",
    resultEn: "A refined visual language across menus, packaging, and daily social presence.",
    palette: ["#201A1D", "#B7792B", "#F6E8D2", "#9D3C72"],
    accent: "#B7792B",
    metricAr: "من الشعار إلى التفاصيل التشغيلية",
    metricEn: "From the mark to daily operating touchpoints"
  },
  {
    id: "medora",
    nameAr: "Medora Clinic",
    nameEn: "Medora Clinic",
    categoryAr: "هوية طبية وحجز إلكتروني",
    categoryEn: "Medical identity and booking UI",
    resultAr: "نظام هادئ يزيد الثقة، ويعوّل الحجز من خطوة مربكة إلى تجربة واضحة.",
    resultEn: "A calm system that builds trust and turns booking into a clearer flow.",
    palette: ["#10343B", "#5CA8A0", "#ECF7F5", "#1B2230"],
    accent: "#5CA8A0",
    metricAr: "تحسين الثقة والوضوح في نقطة التحويل",
    metricEn: "Stronger trust and clarity at the conversion point"
  },
  {
    id: "flux",
    nameAr: "Flux Tech",
    nameEn: "Flux Tech",
    categoryAr: "براند تقني وواجهة تطبيق",
    categoryEn: "Tech brand and app interface",
    resultAr: "حضور رقمي قوي مع واجهة قابلة للتوسع وأصول بصرية واضحة لكل شاشة.",
    resultEn: "A strong digital presence with scalable interface patterns and clean visual assets.",
    palette: ["#191B22", "#5B21B6", "#FFB400", "#F6F7FB"],
    accent: "#5B21B6",
    metricAr: "توحيد المنتج والمحتوى تحت لغة واحدة",
    metricEn: "One language across product, content, and launch assets"
  },
  {
    id: "verde",
    nameAr: "Verde Market",
    nameEn: "Verde Market",
    categoryAr: "هوية متجر وحملات بيع",
    categoryEn: "Retail identity and campaign system",
    resultAr: "هوية دافئة وسهلة التطبيق داخل الفروع، العروض، والمنشورات البيعية.",
    resultEn: "A warm retail identity that works across branches, offers, and sales creatives.",
    palette: ["#22352B", "#5E8D4B", "#E9F0E0", "#D7A63A"],
    accent: "#5E8D4B",
    metricAr: "هوية سهلة التنفيذ تحت ضغط الحملات",
    metricEn: "A system that stays consistent under campaign pressure"
  }
];

const packagesData = [
  {
    id: "starter-brand",
    nameAr: "خطة الأساسيات للهوية",
    nameEn: "Starter Identity Pack",
    price: 6500,
    descAr: "مثالية للمشاريع الناشئة لبناء حضور أولي ذكي واحترافي للشعار والألوان.",
    descEn: "Ideal for startups needing a clean, professional launch style and core logo.",
    featuresAr: [
      "تصميم الشعار الأساسي البديل",
      "لوحة ألوان الهوية المتناسقة",
      "تحديد الخطوط والتايبوغرافي",
      "تسليم الملفات المصدرية المتجهية",
      "دليل استخدام بصري مصغر (١٢ صفحة)"
    ],
    featuresEn: [
      "Core & alternative logo design",
      "Harmonious brand palette",
      "Typography & typography rules",
      "Vector source files delivery",
      "Mini brand usage manual (12 pages)"
    ],
    icon: Sparkles,
    badgeAr: "بداية ذكية",
    badgeEn: "Smart Start"
  },
  {
    id: "growth-brand",
    nameAr: "الخطة المتكاملة للبراند",
    nameEn: "Growth Branding Plan",
    price: 12000,
    descAr: "هوية شاملة بالكامل تغطي الشاشات، المطبوعات، وقوالب السوشيال ميديا.",
    descEn: "A complete identity kit covering print, digital UI, and social creatives.",
    featuresAr: [
      "كل ما تحويه خطة الأساسيات",
      "تصميم الكروت الرسمية والورقيات والأظرف",
      "حزمة قوالب السوشيال ميديا (٦ قوالب Canva)",
      "كتيب إرشادات الهوية المتكامل (Brand Book)",
      "نماذج تطبيقات واقعية ثلاثية أبعاد 3D Mockups"
    ],
    featuresEn: [
      "Everything in Starter Pack",
      "Official stationery, sheets, and envelopes",
      "Social media template kit (6 Canva files)",
      "Full Brand Book document guide",
      "Realistic 3D mockup renderings"
    ],
    icon: SwatchBook,
    badgeAr: "الأكثر طلباً",
    badgeEn: "Most Popular",
    highlighted: true
  },
  {
    id: "enterprise-brand",
    nameAr: "الهوية الشاملة والتغليف",
    nameEn: "Enterprise Branding & Pack",
    price: 20000,
    descAr: "النظام البصري الشامل للعلامات التجارية الراغبة في تصميم العبوات والويب.",
    descEn: "The ultimate brand system with packaging assets and visual web UI.",
    featuresAr: [
      "كل ما تحويه الخطة المتكاملة",
      "تصميم عبوتين أو ثلاثة للمنتجات (Packaging)",
      "دليل نبرة الصوت وصناعة المحتوى",
      "تصميم الواجهة التجريبية للموقع (UI Prototype)",
      "أولوية دعم استراتيجي وتنسيق كامل للإطلاق"
    ],
    featuresEn: [
      "Everything in Growth Pack",
      "Product packaging/label designs (2-3 items)",
      "Brand voice guidelines & copywriting guide",
      "Interactive Web UI mockups/prototype",
      "Priority design updates & launch support"
    ],
    icon: Rocket,
    badgeAr: "الحل الشامل",
    badgeEn: "Complete Solution"
  }
];

const copy = {
  ar: {
    heroBadge: "استراتيجية وهوية بصرية للعلامات التجارية",
    heroTitle: "هوية تجعل العميل يفهمك بسرعة ويتذكرك بثقة.",
    heroLead:
      "نبدأ من موقعك في السوق، ثم نبني لغة بصرية ورسائل وقوالب استخدام تساعد فريقك على الظهور بشكل ثابت في الإعلانات، السوشيال، الموقع، والمطبوعات.",
    primaryCta: "ابدأ بناء هويتك",
    secondaryCta: "استعرض الخطط",
    heroNotes: [
      "تحليل جمهور ومنافسين قبل التصميم",
      "نظام بصري يصلح للإعلانات والمنصات",
      "ملفات واضحة للاستخدام اليومي"
    ],
    heroStats: [
      { value: "4", label: "مسارات قرار أساسية" },
      { value: "72h", label: "لأول اتجاه بصري" },
      { value: "360°", label: "تطبيق على نقاط البيع والتواصل" }
    ],
    heroLabelLeft: "Architecture",
    heroLabelRight: "Select Studio",
    
    packagesTitle: "خطط هوية حسب مرحلة مشروعك",
    packagesSubtitle: "اختار بداية منظمة أو نظام كامل. كل خطة مبنية على مخرجات واضحة يمكن استخدامها فوراً في السوق.",
    recommendedBadge: "الأكثر طلباً",
    addPackageToCart: "ابدأ طلب الخطة",
    packageAdded: "تمت الإضافة للطلب",

    builderTitle: "كوّن نطاق الهوية بنفسك",
    builderSubtitle: "حدد الأصول التي تحتاجها الآن، وسنحوّلها إلى خطة تنفيذ وتسليم واضحة تناسب حجم النشاط.",
    workshopSection: "١. عناصر الهوية الأساسية",
    addonsSection: "٢. الخدمات الإضافية والتشغيل",
    summaryTitle: "ملخص خطتك المخصصة",
    summarySubtitle: "سعر فوري وتفاصيل جاهزة لإرسال الطلب",
    currency: "جنيه مصري",
    addCustomToCart: "ابدأ طلب الخطة",
    selectedModules: "العناصر المختارة",
    selectedAddons: "الإضافات المختارة",
    
    workflowTitle: "طريقة عمل تحفظ ثبات العلامة",
    workflowSubtitle: "كل خطوة تربط التصميم بهدف تجاري واضح: تميّز، ثقة، سهولة استخدام، وقدرة على التوسع.",
    step1Title: "الاستكشاف والتحليل",
    step1Desc: "ندرس السوق، المنافسين، والجمهور المستهدف لنضع اتجاه بصري فريد.",
    step2Title: "تصميم الأفكار والشعار",
    step2Desc: "نبتكر خطوط، وشعارات، وخيارات بصرية متعددة حتى نصل للشكل المثالي.",
    step3Title: "بناء دليل العلامة التجارية",
    step3Desc: "نوثق القواعد، الألوان، الخطوط، والشبكات لضمان ثبات الشكل عبر الزمن.",
    step4Title: "تطبيقات العالم الحقيقي",
    step4Desc: "نصمم المطبوعات، التغليف، وقوالب السوشيال ميديا لنطلق براند متكامل.",
    
    galleryTitle: "نماذج تطبيق الهوية",
    gallerySubtitle: "نعرض كيف تتحول القواعد البصرية إلى منشورات، واجهات، مطبوعات، وتغليف قابل للاستخدام اليومي."
  },
  en: {
    heroBadge: "Brand Strategy and Visual Identity",
    heroTitle: "Identity that helps customers understand you fast and remember you clearly.",
    heroLead:
      "We start from your market position, then build visual language, messaging, and usage templates that keep your ads, social channels, website, and print materials consistent.",
    primaryCta: "Build your identity",
    secondaryCta: "Explore Plans",
    heroNotes: [
      "Audience and competitor review before design",
      "Visual system ready for ads and channels",
      "Clear files for daily team use"
    ],
    heroStats: [
      { value: "4", label: "core decision tracks" },
      { value: "72h", label: "to first visual direction" },
      { value: "360°", label: "sales and channel touchpoints" }
    ],
    heroLabelLeft: "Architecture",
    heroLabelRight: "Select Studio",
    
    packagesTitle: "Identity Plans by Business Stage",
    packagesSubtitle: "Choose a focused start or a complete system. Every plan is built around clear deliverables your team can use in-market.",
    recommendedBadge: "Most Popular",
    addPackageToCart: "Start Plan Request",
    packageAdded: "Added to Request",

    builderTitle: "Build Your Identity Scope",
    builderSubtitle: "Select the assets you need now and we will turn them into a clear execution and delivery plan.",
    workshopSection: "1. Core Identity Modules",
    addonsSection: "2. Add-ons & Execution Support",
    summaryTitle: "Custom Plan Summary",
    summarySubtitle: "Instant estimate ready to send as a request",
    currency: "EGP",
    addCustomToCart: "Start Plan Request",
    selectedModules: "Selected Modules",
    selectedAddons: "Selected Add-ons",
    
    workflowTitle: "A Process That Keeps the Brand Consistent",
    workflowSubtitle: "Every step connects design to a business job: distinction, trust, usable assets, and room to scale.",
    step1Title: "Discovery & Strategy",
    step1Desc: "We analyze the market, competitors, and target audience to set a unique visual direction.",
    step2Title: "Logo & Concept Design",
    step2Desc: "We design concepts, typography routes, and multiple visual concepts until we reach perfection.",
    step3Title: "Brand Book Development",
    step3Desc: "We document rules, colors, fonts, and grid systems to ensure brand consistency.",
    step4Title: "Real-World Delivery",
    step4Desc: "We design stationery, packaging, and social templates to launch a complete brand.",
    
    galleryTitle: "Identity Application Examples",
    gallerySubtitle: "See how visual rules become posts, interfaces, print, and packaging your team can use every day."
  }
} as const;

type PageText = (typeof copy)["ar"] | (typeof copy)["en"];

const formatEgp = (value: number, lang: Language) =>
  value.toLocaleString(lang === "ar" ? "ar-EG" : "en-US");

function SectionShell({
  children,
  tone = "default"
}: {
  children: React.ReactNode;
  tone?: "default" | "dark";
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[36px] border p-6 shadow-[0_16px_50px_rgba(43,26,39,0.06)] sm:p-8 lg:p-10 ${
        tone === "dark"
          ? "border-[#3d2c39] bg-[#241722] text-white"
          : "border-[#e4dfe6] bg-white text-[#241b25]"
      }`}
    >
      <div
        className={`absolute inset-0 ${
          tone === "dark"
            ? "bg-[radial-gradient(circle_at_top_left,rgba(157,2,124,0.16),transparent_30%)]"
            : "bg-[linear-gradient(135deg,rgba(157,2,124,0.025),transparent_34%)]"
        }`}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function BrandStage({
  t,
  isAr
}: {
  t: PageText;
  isAr: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-[34px] border border-[#e1d9e2] bg-white p-6 shadow-[0_18px_55px_rgba(43,26,39,0.08)] sm:p-8">
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(157,2,124,0.025),transparent_38%,rgba(255,188,1,0.035))]" />
      <div className="absolute inset-y-0 left-[14%] w-px bg-[linear-gradient(180deg,transparent,rgba(96,70,48,0.16),transparent)]" />
      <div className="absolute inset-y-0 right-[18%] w-px bg-[linear-gradient(180deg,transparent,rgba(96,70,48,0.16),transparent)]" />

      <div className="relative flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.24em] text-[#9d027c]/70">
        <span className="flex items-center gap-2"><div className="h-1.5 w-1.5 rounded-full bg-[#9d027c] animate-pulse" /> {t.heroLabelLeft}</span>
        <span>{t.heroLabelRight}</span>
      </div>

      <motion.div
        className="relative mt-8 overflow-hidden rounded-[30px] border border-[#34243a] bg-[#17131a] p-4 shadow-[0_16px_45px_rgba(23,19,26,0.16)] sm:p-6"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ffbc01]">
              Brand Direction
            </div>
            <div className="mt-2 max-w-[170px] text-lg font-bold leading-tight text-white sm:max-w-none sm:text-2xl">
              Select Identity Suite
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            {["#221b1f", "#B7792B", "#8D3C5F", "#F1E5D3"].map((color) => (
              <span
                key={color}
                className="h-6 w-6 rounded-full border-[3px] border-white shadow-sm sm:h-7 sm:w-7 sm:border-4"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-[1.2fr_0.9fr]">
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#241722] p-5 text-white shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,188,1,0.16),transparent_36%),linear-gradient(315deg,rgba(157,2,124,0.18),transparent_44%)]" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-[#f3e9d7]">Brand Manual</div>
                <SwatchBook className="h-5 w-5 text-[#ffbc01]" />
              </div>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-[#101828]/60 p-4">
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
                    Palette
                  </div>
                  <div className="mt-4 flex gap-2">
                    {["#B7792B", "#F1E5D3", "#8D3C5F", "#FDFBF6"].map((color) => (
                      <span
                        key={color}
                        className="h-9 flex-1 rounded-full shadow-inner"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#101828]/60 p-4">
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
                    Grid
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {Array.from({ length: 9 }).map((_, index) => (
                      <span
                        key={index}
                        className="aspect-square rounded-lg border border-white/12 bg-white/[0.06]"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-[#101828]/60 p-4">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.18em] text-white/42">
                  <span>Applications</span>
                  <span>Print / Social / UI</span>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="h-24 rounded-[22px] bg-[linear-gradient(145deg,#f8f3eb_0%,#e7d7bb_100%)] shadow-inner" />
                  <div className="h-24 rounded-[22px] bg-[linear-gradient(145deg,#3A2D35_0%,#8D3C5F_100%)] shadow-inner" />
                  <div className="h-24 rounded-[22px] bg-[linear-gradient(145deg,#fefefe_0%,#efe6d8_100%)] shadow-inner" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[26px] border border-white/10 bg-[#211a23] p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ffbc01]">
                  Visual Stack
                </span>
                <LayoutTemplate className="h-4 w-4 text-[#9d027c]" />
              </div>
              <div className="mt-4 space-y-3">
                {t.heroNotes.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 text-sm font-semibold text-white/75"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-bold text-[#ffbc01] shadow-sm">
                      0{index + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-[26px] border border-white/10 bg-[#211a23] p-5">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">
                  Social
                </div>
                <div className="mt-4 h-28 rounded-[24px] bg-[linear-gradient(135deg,#241a26_0%,#9d027c_100%)] shadow-inner" />
              </div>
              <div className="rounded-[26px] border border-white/10 bg-[#211a23] p-5">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">
                  Stationery
                </div>
                <div className="mt-4 h-28 rounded-[24px] bg-[linear-gradient(135deg,#fff6df_0%,#ffbc01_100%)] shadow-inner" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div
        className={`absolute ${isAr ? "left-6" : "right-6"} bottom-6 rounded-full border border-white/10 bg-[#241722] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/75`}
      >
        Premium Identity Studio
      </div>
    </div>
  );
}

function renderProjectMockup(id: string, accent: string) {
  if (id === 'noura') {
    return (
      <div className="mt-5 grid gap-3 sm:grid-cols-[1.2fr_0.8fr] items-stretch">
        <div className="rounded-[20px] bg-[#F6E8D2] p-4 border border-[#B7792B]/20 flex flex-col justify-between shadow-sm">
          <div className="border border-[#B7792B]/40 p-2.5 rounded-lg text-center bg-slate-900/40">
            <span className="font-serif text-xs font-bold tracking-[0.2em] text-[#201A1D] block">NOURA</span>
            <span className="text-[7px] uppercase tracking-[0.1em] text-[#B7792B] block mt-0.5">Lounge & Garden</span>
          </div>
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-[8px] font-bold text-[#201A1D] border-b border-[#B7792B]/10 pb-1">
              <span>Arabic Blend</span>
              <span>85 EGP</span>
            </div>
            <div className="flex justify-between text-[8px] font-bold text-[#201A1D] border-b border-[#B7792B]/10 pb-1">
              <span>Signature Dessert</span>
              <span>110 EGP</span>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-[#201A1D] py-1.5 text-center text-[8px] font-bold text-[#F6E8D2] shadow-sm">
            Reserve Table
          </div>
        </div>
        <div className="rounded-[24px] border-[6px] border-[#201A1D] bg-[#201A1D] overflow-hidden shadow-lg relative flex flex-col justify-between p-2 min-h-[160px]">
          <div className="text-[7px] font-mono text-[#F6E8D2] opacity-80">Noura App</div>
          <div className="h-20 w-full rounded-xl bg-[#B7792B]/20 flex items-center justify-center border border-[#B7792B]/30 my-2">
            <span className="text-[8px] font-serif text-[#F6E8D2] font-black">N</span>
          </div>
          <div className="h-6 w-full rounded-lg bg-[#F6E8D2] flex items-center justify-center">
            <span className="text-[7px] font-bold text-[#201A1D]">View Menu</span>
          </div>
        </div>
      </div>
    );
  }

  if (id === 'medora') {
    return (
      <div className="mt-5 grid gap-3 sm:grid-cols-[1.1fr_0.9fr] items-stretch">
        <div className="rounded-[20px] bg-[#ECF7F5] p-4 border border-[#5CA8A0]/20 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#5CA8A0] text-white text-[9px] font-bold">Dr</span>
              <div>
                <span className="text-[9px] font-bold text-[#10343B] block">Dr. Sarah Mansour</span>
                <span className="text-[7px] text-[#5CA8A0] block">Dermatologist</span>
              </div>
            </div>
            <div className="mt-3 flex gap-1">
              <span className="flex-1 text-[7px] font-bold text-center bg-[#5CA8A0] text-white py-1 rounded">Mon 12</span>
              <span className="flex-1 text-[7px] font-bold text-center bg-slate-900/40 text-[#10343B] py-1 rounded border border-[#5CA8A0]/10">Tue 13</span>
              <span className="flex-1 text-[7px] font-bold text-center bg-slate-900/40 text-[#10343B] py-1 rounded border border-[#5CA8A0]/10">Wed 14</span>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-[#10343B] py-1.5 text-center text-[8px] font-bold text-[#ECF7F5] shadow-sm">
            Confirm Booking
          </div>
        </div>
        <div className="rounded-[24px] border-[6px] border-[#10343B] bg-slate-900/40 overflow-hidden shadow-lg p-2.5 flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between text-[7px] font-bold text-[#10343B]">
            <span>Medora Health</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          </div>
          <div className="my-2 space-y-1">
            <div className="h-2 w-3/4 rounded bg-[#5CA8A0]/20"></div>
            <div className="h-6 w-full rounded bg-[#ECF7F5] flex items-center px-1.5">
              <span className="text-[6px] font-medium text-[#10343B]">Next visit: June 15, 6:00 PM</span>
            </div>
          </div>
          <div className="h-6 w-full rounded-lg bg-[#5CA8A0] flex items-center justify-center text-white text-[7px] font-bold shadow-sm">
            Interactive Chat
          </div>
        </div>
      </div>
    );
  }

  if (id === 'flux') {
    return (
      <div className="mt-5 grid gap-3 sm:grid-cols-[1.1fr_0.9fr] items-stretch">
        <div className="rounded-[20px] bg-[#191B22] p-4 border border-[#5B21B6]/30 flex flex-col justify-between shadow-sm text-white">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold tracking-wider text-[#FFB400]">FLUX ENGINE</span>
            <span className="text-[7px] bg-[#5B21B6]/30 px-1.5 py-0.5 rounded text-[#5B21B6] border border-[#5B21B6]/40">Active</span>
          </div>
          <div className="my-3 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="h-1 flex-1 bg-[#101828]/80 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#5B21B6] to-[#FFB400] w-[78%]"></div>
              </div>
              <span className="text-[7px] font-mono">78%</span>
            </div>
            <span className="text-[7px] text-white/50 block">Bandwidth utilization stable</span>
          </div>
          <div className="rounded-lg bg-[#5B21B6] py-1.5 text-center text-[8px] font-bold text-white shadow-sm">
            Access Terminal
          </div>
        </div>
        <div className="rounded-[24px] border-[6px] border-[#191B22] bg-[#191B22] overflow-hidden shadow-lg p-2.5 flex flex-col justify-between min-h-[160px] text-white">
          <div className="flex items-center justify-between text-[7px]">
            <span className="opacity-60">Analytics</span>
            <span className="text-[#FFB400] font-mono">v1.0.4</span>
          </div>
          <div className="h-14 w-full flex items-end gap-1 px-1 my-2">
            <div className="bg-[#5B21B6] h-[30%] w-full rounded-sm"></div>
            <div className="bg-[#FFB400] h-[55%] w-full rounded-sm"></div>
            <div className="bg-[#5B21B6] h-[40%] w-full rounded-sm"></div>
            <div className="bg-[#FFB400] h-[85%] w-full rounded-sm"></div>
            <div className="bg-[#5B21B6] h-[65%] w-full rounded-sm"></div>
          </div>
          <div className="h-6 w-full rounded-lg bg-[#101828]/80 flex items-center justify-center text-white text-[7px] font-bold">
            Export Report
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-[1.1fr_0.9fr] items-stretch">
      <div className="rounded-[20px] bg-[#E9F0E0] p-4 border border-[#5E8D4B]/20 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-[#22352B]">VERDE FRESH</span>
          <span className="text-[7px] font-bold text-[#D7A63A] bg-slate-900/40 px-1.5 py-0.5 rounded shadow-sm">20% OFF</span>
        </div>
        <div className="mt-3 flex items-center gap-2 bg-slate-900/40 p-1.5 rounded-lg border border-[#5E8D4B]/10">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#5E8D4B]/20 text-[#5E8D4B] text-[10px] font-bold">🥑</span>
          <div>
            <span className="text-[8px] font-bold text-[#22352B] block">Fresh Avocado</span>
            <span className="text-[6px] text-[#5E8D4B] block">Organic • 1 Unit</span>
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-[#22352B] py-1.5 text-center text-[8px] font-bold text-white shadow-sm">
          Checkout Now
        </div>
      </div>
      <div className="rounded-[24px] border-[6px] border-[#22352B] bg-[#22352B] overflow-hidden shadow-lg p-2.5 flex flex-col justify-between min-h-[160px] text-white">
        <div className="text-[7px] opacity-70">Order Status</div>
        <div className="my-2 space-y-2">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D7A63A]"></span>
            <span className="text-[6px] font-bold">Packed and verified</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900/40 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#5E8D4B] to-[#D7A63A] w-[60%]"></div>
          </div>
        </div>
        <div className="h-6 w-full rounded-lg bg-[#5E8D4B] flex items-center justify-center text-white text-[7px] font-bold shadow-sm">
          Track Delivery
        </div>
      </div>
    </div>
  );
}

function PortfolioCard({
  project,
  isAr,
  index
}: {
  project: PortfolioProject;
  isAr: boolean;
  index: number;
}) {
  const wide = index % 3 === 0;

  return (
    <motion.article
      className={`group relative overflow-hidden rounded-[30px] border border-[#e4dfe6] bg-white shadow-[0_12px_38px_rgba(43,26,39,0.06)] ${wide ? "xl:col-span-2" : ""}`}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" style={{ boxShadow: `inset 0 0 0 1px ${project.accent}50` }} />
      <div
        className="relative overflow-hidden border-b border-[#3d2c39] bg-[#241722] p-5 sm:p-6"
        style={{
          backgroundImage: `radial-gradient(circle at 18% 22%, ${project.accent}20, transparent 24%)`
        }}
      >
        <div className={`grid gap-4 ${wide ? "lg:grid-cols-[1.15fr_0.85fr]" : ""}`}>
          <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ffbc01]">
                {isAr ? project.categoryAr : project.categoryEn}
              </div>
              <span
                className="h-8 w-8 rounded-full shadow-sm shadow-[0_0_15px_currentColor]"
                style={{ backgroundColor: project.accent, color: project.accent }}
              />
            </div>
            {project.imageUrl ? (
              <img
                src={publicDriveUrl(project.imageUrl, project.imageUrl, "w1400")}
                alt={isAr ? project.nameAr : project.nameEn}
                className="h-[250px] w-full rounded-[22px] object-cover shadow-[0_14px_34px_rgba(15,23,42,0.16)]"
                referrerPolicy="no-referrer"
              />
            ) : renderProjectMockup(project.id, project.accent)}
          </div>

          <div className="flex flex-col justify-between gap-4 rounded-[28px] border border-white/10 bg-[#30212e] p-5 text-white">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ffbc01]">
                Brand Result
              </div>
              <div className="mt-4 text-lg font-bold leading-8">
                {isAr ? project.metricAr : project.metricEn}
              </div>
            </div>
            <div className="flex gap-2">
              {project.palette.map((color) => (
                <span
                  key={color}
                  className="h-10 flex-1 rounded-full shadow-inner"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-7 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-[#241b25]" style={{ '--hover-color': project.accent } as React.CSSProperties}>
              {isAr ? project.nameAr : project.nameEn}
            </h3>
            <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-[#706670]">
              {isAr ? project.resultAr : project.resultEn}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.palette.map((color) => (
              <span
                key={color}
                className="inline-flex items-center gap-2 rounded-full border border-[#e4dfe6] bg-[#faf8fa] px-3 py-1.5 font-mono text-[10px] text-[#675d67]"
              >
                <span
                  className="h-4 w-4 rounded-full border border-white shadow-sm"
                  style={{ backgroundColor: color }}
                />
                {color}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function BrandingServicePage({
  currentLang,
  setActiveTab
}: BrandingServicePageProps) {
  const isAr = currentLang === "ar";
  const t = copy[currentLang];
  
  // Custom Modules and Add-ons State
  const [selectedModules, setSelectedModules] = useState<ModuleId[]>(["logo", "guidelines"]);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnId[]>([]);
  const [cmsPortfolioProjects, setCmsPortfolioProjects] = useState<PortfolioProject[]>([]);
  const [addedPackages, setAddedPackages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let active = true;
    const loadPortfolio = async () => {
      const data = await siteFetch<any[]>('/portfolio?category=branding');
      if (!active || !data?.length) return;
      const colors = [
        ["#201A1D", "#B7792B", "#F6E8D2", "#9D3C72"],
        ["#10343B", "#5CA8A0", "#ECF7F5", "#1B2230"],
        ["#191B22", "#5B21B6", "#FFB400", "#F6F7FB"],
        ["#22352B", "#5E8D4B", "#E9F0E0", "#D7A63A"],
      ];
      setCmsPortfolioProjects(data.map((project, index) => {
        const palette = colors[index % colors.length];
        return {
          id: `cms-${project.id}`,
          nameAr: project.titleAr || project.titleEn || `هوية ${index + 1}`,
          nameEn: project.titleEn || project.titleAr || `Identity ${index + 1}`,
          categoryAr: project.clientName || "هوية بصرية حقيقية",
          categoryEn: project.clientName || "Real visual identity",
          resultAr: project.descAr || project.descEn || "هوية بصرية مرفوعة من لوحة التحكم.",
          resultEn: project.descEn || project.descAr || "Visual identity managed from the admin panel.",
          palette,
          accent: palette[1],
          metricAr: project.clientName ? `هوية ${project.clientName}` : "صور حقيقية من Drive",
          metricEn: project.clientName ? `${project.clientName} identity` : "Real Drive assets",
          imageUrl: publicDriveUrl(project.image, project.imageUrl || project.imageViewUrl, "w1400"),
        };
      }));
    };
    loadPortfolio();
    return () => { active = false; };
  }, []);

  const displayPortfolioProjects = cmsPortfolioProjects.length ? cmsPortfolioProjects : portfolioProjects;

  const toggleModule = (id: ModuleId) => {
    setSelectedModules((prev) =>
      prev.includes(id) 
        ? (prev.length > 1 ? prev.filter((m) => m !== id) : prev) // keep at least 1 module
        : [...prev, id]
    );
  };

  const toggleAddOn = (id: AddOnId) => {
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((addOnId) => addOnId !== id) : [...prev, id]
    );
  };

  const selectedModuleItems = useMemo(
    () => workshopModules.filter((m) => selectedModules.includes(m.id)),
    [selectedModules]
  );

  const selectedAddOnItems = useMemo(
    () => addOnOptions.filter((addOn) => selectedAddOns.includes(addOn.id)),
    [selectedAddOns]
  );

  const customPlanCost = useMemo(() => {
    const modulesTotal = selectedModuleItems.reduce((sum, m) => sum + m.price, 0);
    const addOnsTotal = selectedAddOnItems.reduce((sum, a) => sum + a.price, 0);
    return modulesTotal + addOnsTotal;
  }, [selectedModuleItems, selectedAddOnItems]);

  const requestCustomPlan = () => {
    const features = [
      ...selectedModuleItems.map(m => isAr ? m.labelAr : m.labelEn),
      ...selectedAddOnItems.map(a => isAr ? a.labelAr : a.labelEn)
    ];

    addPlanToCart({
      section: 'branding',
      id: 'custom-branding-builder',
      title: isAr ? 'هوية بصرية (تصميم مخصص)' : 'Visual Identity (Custom Design)',
      price: customPlanCost,
      currency: 'EGP',
      description: isAr ? 'هوية مصممة بشكل مخصص حسب الموديولات والإضافات المختارة.' : 'Custom visual brand identity tailored with chosen modules & support features.',
      features: features,
      details: { selectedModules, selectedAddOns, customPlanCost }
    });
  };

  const addPackageToCart = (pkg: typeof packagesData[0]) => {
    addPlanToCart({
      section: 'branding',
      id: pkg.id,
      title: isAr ? pkg.nameAr : pkg.nameEn,
      price: pkg.price,
      currency: 'EGP',
      description: isAr ? pkg.descAr : pkg.descEn,
      features: isAr ? pkg.featuresAr : pkg.featuresEn,
      details: { packageId: pkg.id }
    });

    setAddedPackages(prev => ({ ...prev, [pkg.id]: true }));
    setTimeout(() => {
      setAddedPackages(prev => ({ ...prev, [pkg.id]: false }));
    }, 2000);
  };

  const goToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="relative min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-transparent text-slate-100 [font-family:'Noto_Kufi_Arabic','Tajawal','Inter',system-ui,sans-serif]"
    >
      {/* Hero Section */}
      <section className="relative max-w-[100vw] overflow-x-hidden px-4 pb-18 pt-28 sm:px-6 lg:px-8 lg:pb-24 lg:pt-36">
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-12">
          <motion.div
            className="lg:col-span-5 relative z-10"
            initial={{ opacity: 0, x: isAr ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            

            <h1 className="mt-6 text-[clamp(2.1rem,5vw,3.5rem)] font-black leading-[1.18] tracking-normal text-slate-100">
              {t.heroTitle}
            </h1>

            <p className="mt-6 text-base font-medium leading-8 text-slate-400 sm:text-lg">
              {t.heroLead}
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">

              <button
                onClick={() => goToSection("plan-builder")}
                className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/40 px-8 py-3 text-sm font-bold text-slate-200 shadow-sm transition-colors hover:border-[#9d027c] hover:text-white"
              >
                <span>{isAr ? 'فصّل باقتك المخصصة' : 'Customize Your Plan'}</span>
                <ArrowUpRight className="h-4 w-4 text-[#ffbc01] transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {t.heroNotes.map((item) => (
                <div
                  key={item}
                  className="rounded-[24px] border border-slate-800/80 bg-slate-900/40 p-4 shadow-[0_10px_28px_rgba(43,26,39,0.05)]"
                >
                  <CheckCircle2 className="mb-3 h-5 w-5 text-[#9d027c]" />
                  <div className="text-[13px] font-bold leading-7 text-slate-300">{item}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {t.heroStats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[24px] border border-slate-800/80 bg-slate-900/40 p-4 shadow-[0_10px_28px_rgba(43,26,39,0.05)]"
                >
                  <div className="text-2xl font-black tracking-tight text-slate-100">{item.value}</div>
                  <div className="mt-2 text-[13px] font-semibold leading-6 text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            <BrandStage t={t} isAr={isAr} />
          </motion.div>
        </div>
      </section>

      {/* Visual Identity Packages Pricing Section (Where we Sell!) */}
      <section id="packages" className="relative max-w-[100vw] overflow-x-hidden px-4 py-18 sm:px-6 lg:px-8 lg:py-22">
        <div className="mx-auto max-w-7xl">
          <SectionShell>
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-[clamp(1.9rem,4vw,2.65rem)] font-black leading-[1.22] text-slate-100">
                {t.packagesTitle}
              </h2>
              <p className="mt-4 text-sm font-medium leading-7 text-slate-400 max-w-2xl mx-auto sm:text-base">
                {t.packagesSubtitle}
              </p>
            </div>

            {/* Connected Flow Roadmap above the cards */}
            <div className="mx-auto max-w-4xl mb-12 hidden md:block relative z-10 px-4">
              <div className="relative flex items-center justify-between">
                {/* Background Track Line */}
                <div className="absolute left-[5%] right-[5%] top-1/2 h-1 -translate-y-1/2 bg-slate-800/60 rounded-full" />
                
                {/* Glowing Active Fill Line */}
                <div className="absolute left-[5%] right-[5%] top-1/2 h-1 -translate-y-1/2 bg-gradient-to-r from-[#9d027c] via-[#f43f5e] to-[#ffbc01] rounded-full opacity-80 blur-[2px]" />
                <div className="absolute left-[5%] right-[5%] top-1/2 h-0.5 -translate-y-1/2 bg-gradient-to-r from-[#9d027c] via-[#f43f5e] to-[#ffbc01] rounded-full opacity-100" />
                
                {/* Step 1: Starter */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#9d027c] bg-[#020617] text-sm font-black text-[#9d027c] shadow-[0_0_20px_rgba(157,2,124,0.4)] transition-transform hover:scale-110 duration-300">
                    01
                  </div>
                  <span className="mt-3 text-xs font-black text-slate-200 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-800/40">
                    {isAr ? "الأساسيات (التأسيس)" : "Starter (Foundation)"}
                  </span>
                </div>

                {/* Step 2: Growth */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#f43f5e] bg-[#020617] text-sm font-black text-[#f43f5e] shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-transform hover:scale-110 duration-300">
                    02
                  </div>
                  <span className="mt-3 text-xs font-black text-[#f43f5e] bg-[#f43f5e]/5 px-3 py-1 rounded-full border border-[#f43f5e]/20">
                    {isAr ? "المتكاملة (الانتشار)" : "Growth (Expansion)"}
                  </span>
                </div>

                {/* Step 3: Enterprise */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#ffbc01] bg-[#020617] text-sm font-black text-[#ffbc01] shadow-[0_0_20px_rgba(255,188,1,0.4)] transition-transform hover:scale-110 duration-300">
                    03
                  </div>
                  <span className="mt-3 text-xs font-black text-slate-200 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-800/40">
                    {isAr ? "الشاملة والتغليف (السيطرة)" : "Enterprise (Scale & Pack)"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-stretch">
              {packagesData.map((pkg, idx) => {
                const PkgIcon = pkg.icon;
                const isRecommended = pkg.highlighted;
                const isAdded = addedPackages[pkg.id];

                return (
                  <div
                    key={pkg.id}
                    className={`relative flex flex-col justify-between rounded-3xl border p-6 ${
                      isRecommended
                        ? "border-[#9d027c]/40 bg-[#9d027c]/10 shadow-[0_14px_38px_rgba(157,2,124,0.03)]"
                        : "border-slate-800/80 bg-slate-900/40 shadow-none"
                    }`}
                  >
                    {/* Visual Connector Arrow for Desktop */}
                    {idx < 2 && (
                      <div className={`hidden md:flex absolute top-1/2 -translate-y-1/2 z-20 items-center justify-center pointer-events-none
                        ${isAr ? 'left-[-20px]' : 'right-[-20px]'}
                      `}>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#f43f5e]/30 bg-slate-950/80 shadow-[0_0_12px_rgba(244,63,94,0.25)] animate-pulse">
                          {isAr ? (
                            <ChevronLeft className="h-4 w-4 text-[#ffbc01]" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-[#ffbc01]" />
                          )}
                        </div>
                      </div>
                    )}

                    {isRecommended && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#9d027c] px-4 py-1 text-[10px] font-black text-white uppercase tracking-wider">
                        {isAr ? pkg.badgeAr : pkg.badgeEn}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-center text-center mb-4">
                        <h4 className="text-xl font-bold text-slate-100">{isAr ? pkg.nameAr : pkg.nameEn}</h4>
                      </div>

                      <p className="min-h-[56px] text-xs font-semibold leading-6 text-slate-400">
                        {isAr ? pkg.descAr : pkg.descEn}
                      </p>

                      <div className="my-6">
                        <div className="text-3xl font-black text-[#ffbc01] flex items-baseline gap-1">
                          <span>{formatEgp(pkg.price, currentLang)}</span>
                          <span className="text-xs font-bold text-slate-400">{isAr ? "ج.م" : "EGP"}</span>
                        </div>
                      </div>

                      <div className="space-y-3.5 border-t border-slate-800 pt-5">
                        { (isAr ? pkg.featuresAr : pkg.featuresEn).map((feature) => (
                          <div key={feature} className="flex items-start gap-2.5 text-xs font-semibold text-slate-300">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#ffbc01]" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => addPackageToCart(pkg)}
                      disabled={isAdded}
                      className={`mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl text-xs font-black transition-colors ${
                        isAdded
                          ? "bg-emerald-500 text-white cursor-default"
                          : isRecommended
                            ? "bg-[#9d027c] text-white hover:bg-[#820267]"
                            : "border border-slate-800 bg-slate-950/40 text-slate-200 hover:border-[#9d027c] hover:text-white"
                      }`}
                    >
                      <span>{isAdded ? t.packageAdded : t.addPackageToCart}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </SectionShell>
        </div>
      </section>

      {/* Interactive Custom Branding Builder (Top-tier UI/UX!) */}
      <section id="plan-builder" className="relative max-w-[100vw] overflow-x-hidden px-4 py-18 sm:px-6 lg:px-8 lg:py-22">
        <div className="relative mx-auto max-w-7xl">
          <SectionShell>
            <div className="mb-10 max-w-3xl">
              <h2 className="text-[clamp(1.9rem,4vw,2.65rem)] font-black leading-[1.22] text-slate-100">
                {t.builderTitle}
              </h2>
              <p className="mt-4 text-sm font-medium leading-7 text-slate-400 sm:text-base">
                {t.builderSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Modules Selector */}
              <div className="space-y-6 lg:col-span-7">
                {/* Core Modules Card */}
                <div className="rounded-[30px] border border-slate-800/80 bg-slate-900/40 p-5 shadow-none sm:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <Palette className="h-5 w-5 text-magenta" />
                    <h3 className="text-xl font-bold text-slate-100">{t.workshopSection}</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {workshopModules.map((module) => {
                      const active = selectedModules.includes(module.id);
                      const ModuleIcon = module.icon;

                      return (
                        <button
                          key={module.id}
                          type="button"
                          onClick={() => toggleModule(module.id)}
                          className={`flex flex-col justify-between p-4 rounded-2xl border text-start transition duration-300 min-h-[140px] ${
                            active
                              ? "border-[#9d027c]/50 bg-[#9d027c]/10 shadow-none"
                              : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-start justify-between w-full">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#9d027c]/20 text-[#ffbc01]">
                              <ModuleIcon className="h-5 w-5" />
                            </span>
                            <span className={`h-5 w-5 rounded-full border flex items-center justify-center transition-all ${
                              active ? "border-[#9d027c] bg-[#9d027c] text-white" : "border-slate-750"
                            }`}>
                              {active && <Check className="h-3 w-3 stroke-[3]" />}
                            </span>
                          </div>
                          
                          <div className="mt-4">
                            <span className="font-bold text-slate-200 block text-sm">
                              {isAr ? module.labelAr : module.labelEn}
                            </span>
                            <span className="text-[11px] leading-5 text-slate-400 mt-1 block">
                              {isAr ? module.descriptionAr : module.descriptionEn}
                            </span>
                          </div>

                          <div className="mt-4 border-t border-slate-800 pt-3 w-full flex justify-between items-center text-xs font-bold text-[#ffbc01]">
                            <span>{isAr ? "القيمة:" : "Price:"}</span>
                            <span>{formatEgp(module.price, currentLang)} {isAr ? "ج.م" : "EGP"}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Add-ons Selection */}
                <div className="rounded-[30px] border border-slate-800/80 bg-slate-900/40 p-5 shadow-none sm:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <BadgeCheck className="h-5 w-5 text-magenta" />
                    <h3 className="text-xl font-bold text-slate-100">{t.addonsSection}</h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {addOnOptions.map((addOn) => {
                      const active = selectedAddOns.includes(addOn.id);
                      const AddonIcon = addOn.icon;

                      return (
                        <button
                          key={addOn.id}
                          type="button"
                          onClick={() => toggleAddOn(addOn.id)}
                          className={`rounded-[24px] border p-4 text-start transition duration-300 flex flex-col justify-between min-h-[140px] ${
                            active
                              ? "border-[#9d027c]/50 bg-[#9d027c]/10"
                              : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-start justify-between w-full">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#9d027c]/20 text-[#ffbc01]">
                              <AddonIcon className="h-5 w-5" />
                            </span>
                            <span className={`h-5 w-5 rounded-full border flex items-center justify-center transition-all ${
                              active ? "border-[#9d027c] bg-[#9d027c] text-white" : "border-slate-750"
                            }`}>
                              {active && <Check className="h-3 w-3 stroke-[3]" />}
                            </span>
                          </div>

                          <div className="mt-4">
                            <div className="font-bold text-slate-200 text-sm">
                              {isAr ? addOn.labelAr : addOn.labelEn}
                            </div>
                            <div className="mt-1 text-[11px] leading-5 text-slate-400">
                              {isAr ? addOn.descriptionAr : addOn.descriptionEn}
                            </div>
                          </div>

                          <div className="mt-4 border-t border-slate-800 pt-3 w-full flex justify-between items-center text-xs font-bold text-[#ffbc01]">
                            <span>{isAr ? "قيمة مضافة:" : "Add-on value:"}</span>
                            <span>+{formatEgp(addOn.price, currentLang)} {isAr ? "ج.م" : "EGP"}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Estimate Summary Sticky Card */}
              <div className="lg:col-span-5">
                <aside className="sticky top-24 overflow-hidden rounded-[32px] border border-slate-800 bg-slate-900/80 shadow-[0_14px_45px_rgba(43,26,39,0.08)]">
                  <div className="border-b border-[#3d2c39] bg-[#241722] p-6 text-white">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#ffbc01]">
                          Live Estimate
                        </div>
                        <h3 className="mt-2 text-2xl font-bold">{t.summaryTitle}</h3>
                        <p className="mt-2 text-sm font-medium text-white/70">{t.summarySubtitle}</p>
                      </div>
                      <CircleDollarSign className="h-9 w-9 text-[#ffbc01]" />
                    </div>
                    <div className="mt-8">
                      <div className="text-sm font-semibold text-white/80">{isAr ? "القيمة المتوقعة" : "Expected Total"}</div>
                      <motion.div
                        key={customPlanCost}
                        className="mt-2 text-4xl font-black tracking-tight"
                        initial={{ y: 8, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                      >
                        {formatEgp(customPlanCost, currentLang)}
                      </motion.div>
                      <div className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#ffbc01]">
                        {t.currency}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    {/* Selected Modules Summary */}
                    <div className="rounded-[24px] border border-slate-800 bg-slate-950/60 p-4">
                      <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-magenta">
                        {t.selectedModules} ({selectedModules.length})
                      </div>
                      <div className="mt-3 space-y-2">
                        {selectedModuleItems.map(m => (
                          <div key={m.id} className="flex justify-between text-xs font-semibold text-slate-300">
                            <span>• {isAr ? m.labelAr : m.labelEn}</span>
                            <span>{formatEgp(m.price, currentLang)} ج.م</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Selected Add-ons Summary */}
                    {selectedAddOns.length > 0 && (
                      <div className="rounded-[24px] border border-slate-800 bg-slate-950/60 p-4">
                        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-magenta">
                          {t.selectedAddons} ({selectedAddOns.length})
                        </div>
                        <div className="mt-3 space-y-2">
                          {selectedAddOnItems.map(a => (
                            <div key={a.id} className="flex justify-between text-xs font-semibold text-slate-300">
                              <span>• {isAr ? a.labelAr : a.labelEn}</span>
                              <span>+{formatEgp(a.price, currentLang)} ج.م</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={requestCustomPlan}
                      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#9d027c] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#820267]"
                    >
                      <MessageCircle className="h-4 w-4 text-[#ffbc01]" />
                      <span>{t.addCustomToCart}</span>
                    </button>
                  </div>
                </aside>
              </div>
            </div>
          </SectionShell>
        </div>
      </section>

      {/* Examples Portfolio cases */}
      <section className="relative max-w-[100vw] overflow-x-hidden px-4 py-18 sm:px-6 lg:px-8 lg:py-22">
        <div className="mx-auto max-w-7xl">
          <SectionShell>
            <div className="mb-10 grid gap-5 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#9d027c]/20 bg-[#9d027c]/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-magenta">
                  <Layers3 className="h-4 w-4 text-magenta" />
                  <span>{t.galleryTitle}</span>
                </div>
                <h2 className="mt-4 text-[clamp(1.9rem,4vw,2.65rem)] font-black leading-[1.22] text-slate-100">
                  {t.galleryTitle}
                </h2>
              </div>
              <p className="text-sm font-medium leading-7 text-slate-400 lg:col-span-5 sm:text-base">
                {t.gallerySubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
              {displayPortfolioProjects.map((project, index) => (
                <PortfolioCard
                  key={project.id}
                  project={project}
                  isAr={isAr}
                  index={index}
                />
              ))}
            </div>
          </SectionShell>
        </div>
      </section>

      {/* Workflow Steps Section */}
      <section className="relative max-w-[100vw] overflow-x-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionShell>
            <div className="text-center mb-16">
              <h2 className="text-[clamp(1.9rem,4vw,2.65rem)] font-black leading-[1.22] text-slate-100">
                {t.workflowTitle}
              </h2>
              <p className="mt-4 text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-7">
                {t.workflowSubtitle}
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  step: "01",
                  title: t.step1Title,
                  desc: t.step1Desc,
                  color: "#9d027c",
                  icon: Eye
                },
                {
                  step: "02",
                  title: t.step2Title,
                  desc: t.step2Desc,
                  color: "#ffbc01",
                  icon: Palette
                },
                {
                  step: "03",
                  title: t.step3Title,
                  desc: t.step3Desc,
                  color: "#5B21B6",
                  icon: SwatchBook
                },
                {
                  step: "04",
                  title: t.step4Title,
                  desc: t.step4Desc,
                  color: "#10343B",
                  icon: Rocket
                }
              ].map((item, i) => {
                const StepIcon = item.icon;
                return (
                  <motion.div
                    key={item.step}
                    className="group relative overflow-hidden rounded-[28px] border border-slate-800 bg-slate-900/40 p-6 shadow-none"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.1 }}
                  >
                    <div className="absolute -top-6 -right-4 text-[80px] font-black text-[#9d027c]/[0.03] leading-none select-none">
                      {item.step}
                    </div>
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${item.color}15`, border: `1px solid ${item.color}25` }}
                    >
                      <StepIcon className="h-6 w-6" style={{ color: item.color }} />
                    </div>
                    <div className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-magenta">
                      {isAr ? `الخطوة ${item.step}` : `Step ${item.step}`}
                    </div>
                    <h3 className="mt-2 text-lg font-bold text-slate-200">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[13px] font-medium leading-7 text-slate-400">
                      {item.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </SectionShell>
        </div>
      </section>
    </div>
  );
}
