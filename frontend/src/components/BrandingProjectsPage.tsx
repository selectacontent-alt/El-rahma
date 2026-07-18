"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Palette,
  Sparkles,
  Layers,
  Eye,
  Compass,
  FileText,
  Package,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Grid,
  Cpu,
  Bookmark,
  Share2,
  Copy,
  Check
} from "lucide-react";
import { Language } from "../types";

interface ProjectAsset {
  type: "grid" | "stationery" | "packaging";
  titleAr: string;
  titleEn: string;
}

interface ShowcaseProject {
  id: string;
  nameAr: string;
  nameEn: string;
  sloganAr: string;
  sloganEn: string;
  categoryAr: string;
  categoryEn: string;
  conceptAr: string;
  conceptEn: string;
  resultAr: string;
  resultEn: string;
  palette: { nameAr: string; nameEn: string; hex: string }[];
  accentColor: string;
  metricAr: string;
  metricEn: string;
  assets: ProjectAsset[];
}

const showcaseProjects: ShowcaseProject[] = [
  {
    id: "noura",
    nameAr: "Noura Lounge",
    nameEn: "Noura Lounge",
    sloganAr: "الفخامة العربية المعاصرة",
    sloganEn: "Contemporary Arab Luxury",
    categoryAr: "هوية ضيافة وتجربة فاخرة",
    categoryEn: "Hospitality identity & luxury experience",
    conceptAr: "دمج النقوش الشرقية الكلاسيكية بالخطوط الهندسية العصرية لخلق تجربة ضيافة ملكية دافئة.",
    conceptEn: "Merging classical Eastern motifs with clean geometric lines to create a warm, royal hospitality experience.",
    resultAr: "تصميم متكامل للمنيو الورقي والرقمي، أشكال التعبئة والعلب للمأكولات، والزي الرسمي والمنشورات الاجتماعية اليومية.",
    resultEn: "Integrated design for physical and digital menus, takeaway boxes, staff uniforms, and daily social branding.",
    accentColor: "#B7792B",
    metricAr: "تمثيل بصري متناسق 100% عبر الفروع والإنترنت",
    metricEn: "100% consistent visual representation across branches & online",
    palette: [
      { nameAr: "ذهبي ملكي", nameEn: "Royal Gold", hex: "#B7792B" },
      { nameAr: "أسود كربوني", nameEn: "Carbon Black", hex: "#1A1A1D" },
      { nameAr: "عاجي دافئ", nameEn: "Warm Ivory", hex: "#F6E8D2" },
      { nameAr: "باذنجاني غامق", nameEn: "Deep Aubergine", hex: "#4A1C30" }
    ],
    assets: [
      { type: "grid", titleAr: "الشبكة الهندسية للشعار", titleEn: "Logo Geometric Grid" },
      { type: "stationery", titleAr: "المطبوعات الفاخرة والمنيو", titleEn: "Premium Stationery & Menu" },
      { type: "packaging", titleAr: "عبوات المأكولات والشرائط", titleEn: "Food Packaging & Ribbons" }
    ]
  },
  {
    id: "medora",
    nameAr: "Medora Clinic",
    nameEn: "Medora Clinic",
    sloganAr: "هدوء الطبيعة ودقة العلم",
    sloganEn: "Nature's Calm & Scientific Precision",
    categoryAr: "هوية طبية وتصميم رقمي",
    categoryEn: "Medical identity & digital experience",
    conceptAr: "هوية قائمة على أشكال الأوراق الطبيعية النظيفة والدوائر الهندسية لتوفير شعور بالأمان والاحترافية والهدوء.",
    conceptEn: "An identity based on organic leaf shapes and geometric circles to convey safety, professionalism, and healing calm.",
    resultAr: "تصميم دليل البراند، لافتات العيادة الداخلية، بطاقات المواعيد، وواجهة النظام الطبي الرقمي المتناسقة.",
    resultEn: "Full brand book, clinic indoor signage, appointment cards, and a matching medical dashboard UI system.",
    accentColor: "#5CA8A0",
    metricAr: "زيادة ثقة المراجعين وسهولة الاستخدام الرقمي بوضوح كامل",
    metricEn: "Enhanced patient trust and digital usability with absolute clarity",
    palette: [
      { nameAr: "زمرّدي هادئ", nameEn: "Calm Emerald", hex: "#10343B" },
      { nameAr: "فيروزي دافئ", nameEn: "Warm Turquoise", hex: "#5CA8A0" },
      { nameAr: "أبيض طبي", nameEn: "Medical White", hex: "#ECF7F5" },
      { nameAr: "رمادي داكن", nameEn: "Dark Slate", hex: "#1D2430" }
    ],
    assets: [
      { type: "grid", titleAr: "النسبة الذهبية للشعار", titleEn: "Golden Ratio Logo construction" },
      { type: "stationery", titleAr: "الأظرف الورقية وبطاقة الموعد", titleEn: "Paper Envelopes & Appointment Cards" },
      { type: "packaging", titleAr: "ملصقات وعبوات الأدوية", titleEn: "Medicine Bottles & Stickers" }
    ]
  },
  {
    id: "flux",
    nameAr: "Flux Tech",
    nameEn: "Flux Tech",
    sloganAr: "تدفق الأفكار والمستقبل",
    sloganEn: "Flow of Ideas & Future Tech",
    categoryAr: "هوية تقنية وتجربة برمجية",
    categoryEn: "Tech brand & software experience",
    conceptAr: "تمثيل الحركة الدائمة والسرعة من خلال خطوط مائلة ودرجات بنفسجية متوهجة تجسد الحوسبة السحابية الحديثة.",
    conceptEn: "Representing continuous flow and speed through slanted paths and glowing violet hues that embody modern cloud computing.",
    resultAr: "تصميم شعار تفاعلي، صور ثلاثية أبعاد للموقع، تصميم واجهات لوحة التحكم، وبطاقات الموظفين الذكية.",
    resultEn: "Dynamic logo assets, 3D landing page elements, dashboard interface system, and smart employee access cards.",
    accentColor: "#8B5CF6",
    metricAr: "تكامل لغة المنتج والبراند الرقمي تحت علامة متينة واحدة",
    metricEn: "Seamless product and digital brand integration under one solid mark",
    palette: [
      { nameAr: "بنفسجي متوهج", nameEn: "Glowing Violet", hex: "#8B5CF6" },
      { nameAr: "أزرق فلكي", nameEn: "Cosmic Blue", hex: "#0F172A" },
      { nameAr: "أصفر ساطع", nameEn: "Bright Amber", hex: "#FBBF24" },
      { nameAr: "أبيض جليدي", nameEn: "Ice White", hex: "#F8FAFC" }
    ],
    assets: [
      { type: "grid", titleAr: "شبكة الكود والمسارات", titleEn: "Code Grids & Vector Slopes" },
      { type: "stationery", titleAr: "بطاقات الهوية البلاستيكية الذكية", titleEn: "Smart Plastic ID Cards" },
      { type: "packaging", titleAr: "صناديق شحن السيرفرات والأجهزة", titleEn: "Server Shipping Boxes & Tech Cases" }
    ]
  },
  {
    id: "verde",
    nameAr: "Verde Market",
    nameEn: "Verde Market",
    sloganAr: "عضوي، منعش ومستدام",
    sloganEn: "Organic, Fresh & Sustainable",
    categoryAr: "براند تجزئة وسوبرماركت صحي",
    categoryEn: "Retail brand & healthy supermarket",
    conceptAr: "هوية مبنية على خامات الورق المعاد تدويره والألوان الطبيعية الترابية لتأكيد التزام المتجر بالصحة والاستدامة.",
    conceptEn: "An identity built on recycled paper textures and earthy natural colors to emphasize store commitment to health and eco-friendliness.",
    resultAr: "تصميم شنط التسوق الورقية والقماشية، لوحات الفروع، ملصقات الأسعار، وتصميم تيشرتات طاقم العمل.",
    resultEn: "Paper & canvas shopping bag designs, branch banners, price tags, and custom crew member uniforms.",
    accentColor: "#10B981",
    metricAr: "نقل رسالة الحفاظ على البيئة من أول ثانية للعميل",
    metricEn: "Conveying the eco-friendly core message to clients from second one",
    palette: [
      { nameAr: "أخضر الغابة", nameEn: "Forest Green", hex: "#064E3B" },
      { nameAr: "نعناعي طازج", nameEn: "Fresh Mint", hex: "#10B981" },
      { nameAr: "خلفية رملية", nameEn: "Sand Base", hex: "#F3F4F6" },
      { nameAr: "ذهبي القمح", nameEn: "Wheat Gold", hex: "#D97706" }
    ],
    assets: [
      { type: "grid", titleAr: "شبكة الأوراق والأشكال العضوية", titleEn: "Organic Leaf Grids & Contours" },
      { type: "stationery", titleAr: "الفواتير الورقية الوردي والملصقات", titleEn: "Recycled Invoices & Seal Labels" },
      { type: "packaging", titleAr: "شنط الورق المقوى وعلب المنتجات", titleEn: "Kraft Paper Bags & Produce Boxes" }
    ]
  }
];

const copy = {
  ar: {
    heroBadge: "معرض مشروعات الهوية البصرية",
    heroTitle: "نماذج هوية توضّح كيف يتحول التصميم إلى أصل تسويقي.",
    heroLead: "استعرض طريقة تطبيق الهوية على الشعار، الألوان، المطبوعات، التغليف، والواجهات حتى ترى كيف يحافظ البراند على حضوره في كل نقطة تواصل.",
    ctaBottom: "ابدأ مشروع هوية واضح",
    ctaSubtitle: "شاركنا مرحلة مشروعك وسنقترح نطاق هوية يناسب السوق والجمهور.",
    metricLabel: "الأثر والنتيجة",
    conceptLabel: "الفلسفة والاتجاه الفني",
    elementsLabel: "عناصر الهوية البصرية",
    copied: "تم النسخ!",
    playgroundTitle: "اختبر لغة الهوية بصرياً",
    playgroundSubtitle: "غيّر الألوان وشاهد كيف تؤثر اللوحة على إحساس العلامة وقابلية استخدامها في التطبيق اليومي.",
    playgroundPaletteLabel: "اختر لوحة الألوان للمشروع:",
    showGrid: "عرض خطوط الشبكة الهندسية",
    hideGrid: "إخفاء خطوط الشبكة الهندسية"
  },
  en: {
    heroBadge: "Visual Identity Projects Portfolio",
    heroTitle: "Identity samples that show how design becomes a marketing asset.",
    heroLead: "Explore how identity works across marks, colors, print, packaging, and interfaces so the brand stays consistent at every touchpoint.",
    ctaBottom: "Start a Clear Identity Project",
    ctaSubtitle: "Share your project stage and we will suggest an identity scope that fits the market and audience.",
    metricLabel: "Impact & Result",
    conceptLabel: "Design Philosophy & Art Direction",
    elementsLabel: "Branding Elements",
    copied: "Copied!",
    playgroundTitle: "Test the Brand Language Visually",
    playgroundSubtitle: "Change palettes and see how color affects the brand feeling and daily usability.",
    playgroundPaletteLabel: "Select brand color palette:",
    showGrid: "Show Geometric Construction Grid",
    hideGrid: "Hide Geometric Construction Grid"
  }
};

export default function BrandingProjectsPage({
  currentLang,
  setActiveTab
}: {
  currentLang: Language;
  setActiveTab?: (tab: string) => void;
}) {
  const [activeProjId, setActiveProjId] = useState("noura");
  const [activeAssetType, setActiveAssetType] = useState<"grid" | "stationery" | "packaging">("grid");
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [showGeometricGrid, setShowGeometricGrid] = useState(true);
  const [customHue, setCustomHue] = useState(0);

  const t = copy[currentLang];
  const activeProject = showcaseProjects.find((p) => p.id === activeProjId) || showcaseProjects[0];

  // Sync asset tabs when project changes to prevent empty previews
  useEffect(() => {
    setActiveAssetType("grid");
  }, [activeProjId]);

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="relative pt-28 md:pt-36 pb-24 text-slate-100 overflow-hidden font-sans">
      {/* Background Ambient Glow */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 transition-all duration-1000 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${activeProject.accentColor} 0%, transparent 70%)`
        }}
      />

      {/* Grid Lines Global Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-5 overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="branding-proj-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#branding-proj-grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HEADER HERO */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-pink-500/35 bg-pink-500/10 text-pink-300 text-xs font-bold uppercase tracking-widest mb-4 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t.heroBadge}
          </motion.span>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[clamp(2rem,5vw,3.5rem)] font-black tracking-normal leading-[1.18] mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400"
          >
            {t.heroTitle}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg font-medium leading-8 text-slate-400 max-w-3xl mx-auto"
          >
            {t.heroLead}
          </motion.p>
        </div>

        {/* GEOMETRIC WATERMARK GRID */}
        <div className="w-full flex items-center justify-center mb-16 relative py-4">
          <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
            <div className="w-[300px] h-[300px] rounded-full border border-dashed border-white/10 animate-spin" style={{ animationDuration: '40s' }} />
            <div className="w-[200px] h-[200px] rounded-full border border-dashed border-white/15 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
          </div>
          
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl">
            {showcaseProjects.map((p) => {
              const isSelected = activeProjId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveProjId(p.id)}
                  className={`relative p-6 rounded-2xl border text-right rtl:text-right ltr:text-left overflow-hidden transition-all duration-300 group cursor-pointer ${
                    isSelected
                      ? "bg-slate-900/80 border-slate-700 shadow-2xl shadow-slate-950/80 scale-[1.03]"
                      : "bg-slate-950/40 border-slate-900 hover:border-slate-800/80 hover:bg-slate-900/30"
                  }`}
                >
                  {/* Accent Highlight Corner */}
                  <div 
                    className="absolute top-0 right-0 w-2.5 h-full transition-opacity duration-300"
                    style={{ 
                      backgroundColor: p.accentColor,
                      opacity: isSelected ? 1 : 0 
                    }}
                  />

                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                      <Palette className="w-4 h-4" style={{ color: p.accentColor }} />
                    </div>
                    {isSelected && (
                      <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-white/10 text-white">
                        Active
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-white group-hover:text-slate-200 transition-colors">
                    {currentLang === "ar" ? p.nameAr : p.nameEn}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-semibold line-clamp-1">
                    {currentLang === "ar" ? p.sloganAr : p.sloganEn}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN CASE STUDY CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-6xl mx-auto bg-slate-950/50 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden shadow-2xl shadow-black/60 mb-20">
          
          {/* LEFT SIDE: DETAILS (5 Columns) */}
          <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-l border-white/5">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300">
                  {currentLang === "ar" ? activeProject.categoryAr : activeProject.categoryEn}
                </span>
              </div>

              <h2 className="text-[clamp(1.85rem,4vw,2.65rem)] font-black leading-[1.22] text-white mb-6">
                {currentLang === "ar" ? activeProject.nameAr : activeProject.nameEn}
              </h2>

              {/* CONCEPT */}
              <div className="mb-8">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2.5 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" style={{ color: activeProject.accentColor }} />
                  {t.conceptLabel}
                </h4>
                <p className="text-sm font-medium leading-relaxed text-slate-300">
                  {currentLang === "ar" ? activeProject.conceptAr : activeProject.conceptEn}
                </p>
              </div>

              {/* DELIVERABLES */}
              <div className="mb-8">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" style={{ color: activeProject.accentColor }} />
                  {t.elementsLabel}
                </h4>
                <p className="text-sm font-medium leading-relaxed text-slate-400">
                  {currentLang === "ar" ? activeProject.resultAr : activeProject.resultEn}
                </p>
              </div>

              {/* COLOR SWATCH PLAYGROUND */}
              <div className="mb-8">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
                  لوحة الألوان التفاعلية (انقر للنسخ)
                </h4>
                <div className="flex flex-wrap gap-3">
                  {activeProject.palette.map((color, idx) => {
                    const isHovered = hoveredColor === color.hex;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleCopyColor(color.hex)}
                        onMouseEnter={() => setHoveredColor(color.hex)}
                        onMouseLeave={() => setHoveredColor(null)}
                        className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/5 hover:border-white/15 hover:bg-slate-900 transition-all cursor-pointer group"
                      >
                        <div 
                          className="w-4 h-4 rounded-full border border-white/10 group-hover:scale-110 transition-transform" 
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-xs font-bold font-mono text-slate-300">
                          {color.hex}
                        </span>
                        
                        <AnimatePresence>
                          {isHovered && (
                            <motion.span 
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-slate-950 border border-white/10 rounded text-[9px] text-white whitespace-nowrap shadow-md z-30"
                            >
                              {copiedColor === color.hex ? t.copied : currentLang === "ar" ? color.nameAr : color.nameEn}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* PERFORMANCE METRIC BADGE */}
            <div className="pt-6 border-t border-white/5 mt-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                {t.metricLabel}
              </h4>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span className="text-xs md:text-sm font-bold text-slate-200">
                  {currentLang === "ar" ? activeProject.metricAr : activeProject.metricEn}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: INTERACTIVE CANVAS (7 Columns) */}
          <div className="lg:col-span-7 p-8 md:p-12 bg-slate-950/40 flex flex-col justify-between">
            {/* Asset Views Selector Tabs */}
            <div className="flex border-b border-white/5 pb-4 mb-6">
              {activeProject.assets.map((asset) => {
                const isActive = activeAssetType === asset.type;
                return (
                  <button
                    key={asset.type}
                    onClick={() => setActiveAssetType(asset.type)}
                    className={`pb-3 px-4 font-bold text-xs uppercase relative transition-colors cursor-pointer ${
                      isActive ? "text-white font-black" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <span>{currentLang === "ar" ? asset.titleAr : asset.titleEn}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="activeAssetTabLine"
                        className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                        style={{ backgroundColor: activeProject.accentColor }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* INTERACTIVE WORKSPACE MOCKUP PREVIEW */}
            <div className="flex-1 min-h-[300px] flex items-center justify-center relative overflow-hidden bg-slate-900/60 rounded-2xl border border-white/5 p-6 select-none">
              
              {/* Grid construction overlay */}
              {showGeometricGrid && activeAssetType === "grid" && (
                <div className="absolute inset-0 pointer-events-none opacity-20">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50%" cy="50%" r="120" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="3 3" />
                    <circle cx="50%" cy="50%" r="80" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="3 3" />
                    <circle cx="50%" cy="50%" r="40" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="3 3" />
                    <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" />
                    <line x1="50%" y1="0" x2="50%" y2="100%" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" />
                    <line x1="0" y1="0" x2="100%" y2="100%" stroke="white" strokeWidth="0.5" strokeDasharray="5 5" />
                    <line x1="0" y1="100%" x2="100%" y2="0" stroke="white" strokeWidth="0.5" strokeDasharray="5 5" />
                  </svg>
                </div>
              )}

              <AnimatePresence mode="wait">
                {/* 1. LOGO GEOMETRIC GRID MOCKUP */}
                {activeAssetType === "grid" && (
                  <motion.div
                    key={`${activeProjId}-grid`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center justify-center gap-6 text-center"
                  >
                    {/* Construction SVG Logo Symbol */}
                    <div className="relative w-48 h-48 flex items-center justify-center border border-white/5 rounded-full bg-slate-950/80 p-8 shadow-2xl">
                      {/* Grid Construction Lines circles */}
                      {showGeometricGrid && (
                        <>
                          <div className="absolute inset-2 rounded-full border border-blue-500/20" />
                          <div className="absolute inset-8 rounded-full border border-blue-500/20 border-dashed" />
                          <div className="absolute inset-16 rounded-full border border-pink-500/10" />
                          <div className="absolute top-1/2 left-0 right-0 h-px bg-blue-500/10" />
                          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-blue-500/10" />
                          <div className="absolute top-[30%] left-[30%] w-3 h-3 border border-pink-500/40 rounded-full" />
                          <div className="absolute bottom-[30%] right-[30%] w-3 h-3 border border-pink-500/40 rounded-full" />
                          {/* golden ratio lines */}
                          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 100 100">
                            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e11d48" strokeWidth="0.25" />
                            <path d="M 50 10 A 40 40 0 0 1 50 90" fill="none" stroke="#e11d48" strokeWidth="0.25" />
                            <rect x="25" y="25" width="50" height="50" fill="none" stroke="#3b82f6" strokeWidth="0.2" />
                            <circle cx="50" cy="50" r="35.3" fill="none" stroke="#e11d48" strokeWidth="0.25" />
                          </svg>
                        </>
                      )}

                      {/* SVG Vector Logo shape based on project */}
                      <svg 
                        className="w-24 h-24 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-transform duration-500 hover:scale-105" 
                        viewBox="0 0 100 100" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {activeProjId === "noura" && (
                          <g stroke={activeProject.accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            {/* Royal Lounge Arabesque Shape */}
                            <path d="M50 10 C30 25 15 40 15 60 C15 75 30 85 50 90 C70 85 85 75 85 60 C85 40 70 25 50 10 Z" />
                            <path d="M50 25 C40 35 30 45 30 60 C30 70 40 75 50 78 C60 78 70 70 70 60 C70 45 60 35 50 25 Z" fill={`${activeProject.accentColor}20`} />
                            <circle cx="50" cy="53" r="5" fill={activeProject.accentColor} />
                          </g>
                        )}
                        {activeProjId === "medora" && (
                          <g stroke={activeProject.accentColor} strokeWidth="3" strokeLinecap="round">
                            {/* Medical Leaf/Helix Circle */}
                            <circle cx="50" cy="50" r="35" strokeDasharray="4 4" />
                            <path d="M50 15 C35 30 35 70 50 85 C65 70 65 30 50 15 Z" fill={`${activeProject.accentColor}30`} />
                            <path d="M25 50 C40 35 60 35 75 50" />
                          </g>
                        )}
                        {activeProjId === "flux" && (
                          <g fill="none" stroke={activeProject.accentColor} strokeWidth="3" strokeLinejoin="round">
                            {/* Tech Slopes */}
                            <path d="M20 70 L40 30 L80 30" strokeLinecap="round" />
                            <path d="M20 70 L60 70 L80 30" strokeLinecap="round" fill={`${activeProject.accentColor}15`} />
                            <circle cx="40" cy="30" r="4" fill={activeProject.accentColor} />
                            <circle cx="60" cy="70" r="4" fill={activeProject.accentColor} />
                          </g>
                        )}
                        {activeProjId === "verde" && (
                          <g stroke={activeProject.accentColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            {/* Organic Leaf Design */}
                            <path d="M50 15 C25 35 35 75 50 85 C65 75 75 35 50 15 Z" fill={`${activeProject.accentColor}20`} />
                            <path d="M50 85 L50 45" />
                            <path d="M50 65 C40 60 38 52 42 48" />
                            <path d="M50 55 C60 50 62 42 58 38" />
                          </g>
                        )}
                      </svg>
                    </div>

                    {/* Logo Subtitle with construction tag */}
                    <div>
                      <h4 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
                        {currentLang === "ar" ? activeProject.nameAr : activeProject.nameEn}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-mono">
                        Vector Construction File // Scale 1:1
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* 2. STATIONERY MOCKUP */}
                {activeAssetType === "stationery" && (
                  <motion.div
                    key={`${activeProjId}-stationery`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-sm flex flex-col items-center gap-4"
                  >
                    {/* Letterhead Mockup Card */}
                    <div className="w-full aspect-[1.41/1] bg-slate-900 rounded-xl border border-white/10 p-5 shadow-2xl relative flex flex-col justify-between overflow-hidden">
                      {/* Grid Background */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.02)_0%,transparent_60%)] pointer-events-none" />
                      
                      {/* Top Header branding */}
                      <div className="flex justify-between items-start border-b border-white/5 pb-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: activeProject.accentColor }} />
                          <span className="text-[10px] font-black tracking-wider text-white uppercase">{activeProject.nameEn}</span>
                        </div>
                        <span className="text-[7px] text-slate-500 font-mono">Date: 24.10.2026 // Ref: #909</span>
                      </div>

                      {/* Mock Text lines */}
                      <div className="flex-1 py-4 flex flex-col gap-2">
                        <div className="w-1/3 h-1.5 rounded-full bg-slate-700/80" />
                        <div className="w-5/6 h-1 rounded-full bg-slate-800" />
                        <div className="w-4/5 h-1 rounded-full bg-slate-800" />
                        <div className="w-full h-1 rounded-full bg-slate-800" />
                        <div className="w-2/3 h-1 rounded-full bg-slate-800" />
                      </div>

                      {/* Bottom branding footer details */}
                      <div className="flex justify-between items-center pt-3 border-t border-white/5">
                        <div className="flex gap-1">
                          {activeProject.palette.map((c, i) => (
                            <div key={i} className="w-2.5 h-2.5 rounded-full border border-white/10" style={{ backgroundColor: c.hex }} />
                          ))}
                        </div>
                        <span className="text-[6px] text-slate-500 font-mono">select-agency.com // hello@select.com</span>
                      </div>
                    </div>

                    {/* Business card hovering layout */}
                    <div className="w-4/5 aspect-[1.75/1] bg-slate-950 rounded-lg border border-white/10 p-4 shadow-xl flex items-center justify-between relative overflow-hidden self-end -mt-6 z-10 hover:translate-y-[-4px] transition-transform duration-300">
                      {/* Hot stamp foil glow edge */}
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-1" 
                        style={{ backgroundColor: activeProject.accentColor }}
                      />
                      <div className="flex flex-col justify-between h-full">
                        <div>
                          <span className="text-[10px] font-black tracking-widest text-white uppercase">{activeProject.nameEn}</span>
                          <p className="text-[6px] text-slate-400 tracking-wider">Visual Identity Direction</p>
                        </div>
                        <div className="text-[6px] text-slate-500 font-mono">
                          <p>T: +20 120 000 0000</p>
                          <p>Cairo, Egypt</p>
                        </div>
                      </div>
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/10"
                        style={{ backgroundColor: `${activeProject.accentColor}10` }}
                      >
                        <Palette className="w-5 h-5" style={{ color: activeProject.accentColor }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 3. PRODUCT & PACKAGING MOCKUP */}
                {activeAssetType === "packaging" && (
                  <motion.div
                    key={`${activeProjId}-packaging`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center justify-center gap-6"
                  >
                    {/* Bottle/Box packaging frame mock */}
                    <div className="w-32 h-56 bg-slate-900 border border-white/10 rounded-2xl p-4 shadow-2xl relative flex flex-col justify-between overflow-hidden">
                      {/* Glossy Reflection Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none" />
                      
                      {/* Cap */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-4 bg-slate-950 border-b border-white/15 rounded-b-md" />
                      
                      {/* Brand Label Area */}
                      <div 
                        className="mt-6 flex-1 rounded-xl p-3 border flex flex-col justify-between items-center text-center"
                        style={{ 
                          backgroundColor: `${activeProject.accentColor}08`,
                          borderColor: `${activeProject.accentColor}25`
                        }}
                      >
                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-slate-950">
                          <Palette className="w-4 h-4" style={{ color: activeProject.accentColor }} />
                        </div>
                        
                        <div>
                          <span className="text-[11px] font-black tracking-widest text-white uppercase block leading-none">
                            {activeProject.nameEn}
                          </span>
                          <span className="text-[6px] text-slate-500 font-mono tracking-widest uppercase mt-1 block">
                            Organic Batch
                          </span>
                        </div>
                        
                        <div className="w-full flex justify-center gap-1">
                          {activeProject.palette.map((c, i) => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.hex }} />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Paper shopping bag mock */}
                    <div className="w-36 h-48 bg-slate-950 border border-white/10 rounded-lg p-4 shadow-2xl relative flex flex-col justify-between overflow-hidden self-end hover:scale-[1.02] transition-transform duration-300">
                      {/* Bag Handles */}
                      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex gap-3">
                        <div className="w-4 h-3 rounded-t-full border-t border-x border-slate-500" />
                        <div className="w-4 h-3 rounded-t-full border-t border-x border-slate-500" />
                      </div>

                      {/* Brand name printed on shopping bag */}
                      <div className="mt-4 flex-1 flex flex-col justify-center items-center">
                        <span 
                          className="text-base font-black uppercase tracking-wider"
                          style={{ color: activeProject.accentColor }}
                        >
                          {activeProject.nameEn}
                        </span>
                        <p className="text-[7px] text-slate-400 mt-1 uppercase tracking-widest">
                          {currentLang === "ar" ? "حقيبة صديقة للبيئة" : "Eco-Friendly Kraft Bag"}
                        </p>
                      </div>

                      <div className="border-t border-white/5 pt-2 flex justify-between items-center">
                        <span className="text-[5px] text-slate-500 font-mono">2026 Select Studio</span>
                        <Package className="w-3 h-3 text-slate-500" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Panel controls: Grid toggle & Custom Hue Mixer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-white/5">
              <button
                onClick={() => setShowGeometricGrid(!showGeometricGrid)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-white/5 hover:border-white/10 text-xs font-bold text-slate-300 cursor-pointer transition-colors"
              >
                <Grid className="w-4 h-4 text-slate-500" />
                <span>{showGeometricGrid ? t.hideGrid : t.showGrid}</span>
              </button>

              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                Press Palette circles to inspect hexadecimal codes
              </div>
            </div>

          </div>

        </div>

        {/* CUSTOM MIXER EXPERIMENTAL LABORATORY */}
        <div className="w-full max-w-4xl mx-auto p-8 bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/5 shadow-xl mb-24 relative overflow-hidden">
          {/* Subtle decoration lines */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#9d027c]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-xl md:text-2xl font-black text-white mb-2">
              {t.playgroundTitle}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.playgroundSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Color control slides */}
            <div className="flex flex-col gap-6">
              <div>
                <label className="text-xs font-bold text-slate-300 mb-2.5 block flex justify-between">
                  <span>تعديل تدرج البراند البصري (Hue Shift)</span>
                  <span className="font-mono text-pink-400">{customHue}°</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={customHue}
                  onChange={(e) => setCustomHue(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#9d027c]"
                />
              </div>

              {/* Sample Preset color cards */}
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 block">
                  لوحات سريعة جاهزة للتجربة (Preset Palettes)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { labelAr: "التوهج البنفسجي", labelEn: "Neon Purp", hue: 280, accent: "#8B5CF6" },
                    { labelAr: "النعناعي الطازج", labelEn: "Fresh Mint", hue: 150, accent: "#10B981" },
                    { labelAr: "الذهبي الملكي", labelEn: "Classic Gold", hue: 35, accent: "#B7792B" },
                    { labelAr: "الأزرق الفلكي", labelEn: "Cosmic Sky", hue: 200, accent: "#3B82F6" }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCustomHue(preset.hue)}
                      className="px-3 py-2 rounded-xl bg-slate-950/60 border border-white/5 hover:border-white/10 text-[10px] font-bold text-slate-300 text-center cursor-pointer transition-colors flex items-center justify-center gap-2"
                    >
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: preset.accent }} />
                      <span>{currentLang === "ar" ? preset.labelAr : preset.labelEn}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulated Live Mobile Branding Screen mock */}
            <div className="flex justify-center">
              <div 
                className="w-56 aspect-[9/19] rounded-[36px] border-4 border-slate-800 bg-slate-950 shadow-2xl p-4 flex flex-col justify-between relative overflow-hidden transition-all duration-300"
                style={{ 
                  filter: `hue-rotate(${customHue}deg)`
                }}
              >
                {/* Speaker top bar */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-slate-800 rounded-full flex items-center justify-center gap-1 px-2.5">
                  <div className="w-8 h-[2px] bg-slate-900 rounded-full" />
                  <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />
                </div>

                {/* Top Status */}
                <div className="flex justify-between items-center text-[7px] text-slate-500 mt-2 px-1">
                  <span>9:41 AM</span>
                  <div className="flex gap-0.5">
                    <div className="w-1.5 h-1.5 bg-slate-600 rounded-full" />
                    <div className="w-2 h-1.5 bg-slate-600 rounded-sm" />
                  </div>
                </div>

                {/* Mock Mobile Brand Design */}
                <div className="flex-1 flex flex-col justify-center items-center gap-4 text-center mt-6">
                  {/* Glowing logo mark */}
                  <div className="w-16 h-16 rounded-full border border-pink-500/20 bg-slate-900 flex items-center justify-center relative shadow-lg shadow-pink-500/10">
                    <Palette className="w-8 h-8 text-pink-400" />
                    {/* Pulsing ring */}
                    <div className="absolute inset-0 rounded-full border border-pink-400/40 animate-ping opacity-45" style={{ animationDuration: '3s' }} />
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-black text-white tracking-widest uppercase">
                      Select App
                    </h5>
                    <p className="text-[7px] text-slate-400 mt-1 uppercase tracking-widest">
                      Live Branding Simulator
                    </p>
                  </div>
                </div>

                {/* Bottom App Bar */}
                <div className="flex justify-around items-center pt-2.5 border-t border-white/5 mt-4 text-slate-600">
                  <Palette className="w-4 h-4 text-pink-400" />
                  <div className="w-4 h-4 rounded bg-slate-800" />
                  <div className="w-4 h-4 rounded bg-slate-800" />
                </div>
                
                {/* Home Indicator */}
                <div className="w-16 h-1 bg-slate-800 rounded-full mx-auto mt-2" />
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM CALL TO ACTION (NO PRICES) */}
        <div className="w-full max-w-5xl mx-auto rounded-3xl p-10 md:p-16 border border-white/5 relative overflow-hidden bg-[radial-gradient(ellipse_at_bottom,rgba(157,2,124,0.15),transparent_70%)] shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#9d027c]/45 to-transparent" />
          
          <div className="text-center relative z-10">
            <h2 className="text-[clamp(1.85rem,4vw,2.65rem)] font-black leading-[1.22] text-white mb-4">
              {t.ctaBottom}
            </h2>
            <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto mb-8 font-medium">
              {t.ctaSubtitle}
            </p>

            <div className="flex justify-center">
              <button
                onClick={() => {
                  if (setActiveTab) {
                    setActiveTab("contact");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className="relative px-8 py-4 rounded-full font-black text-sm text-black bg-gradient-to-r from-pink-500 to-[#ffbc01] shadow-xl hover:shadow-2xl hover:shadow-pink-500/20 hover:scale-[1.03] transition-all cursor-pointer inline-flex items-center gap-2 group"
              >
                <span>{currentLang === "ar" ? "ابدأ مشروعك الآن" : "Start Your Project Now"}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
