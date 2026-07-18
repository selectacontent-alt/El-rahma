import { ServiceItem, PortfolioItem, JourneyStep, PricingPlan, StatItem } from "./types";

export const SERVICES: ServiceItem[] = [
  {
    id: "product-photo",
    titleAr: "تصوير منتجات للبيع",
    titleEn: "Product Photography for Sales",
    descriptionAr: "صور واضحة للمتجر والإعلانات تشرح الحجم، الخامة، التفاصيل، وتساعد العميل يثق في المنتج قبل الشراء.",
    descriptionEn: "Clear store and ad photos that show size, material, and details so customers trust the product before buying.",
    icon: "Camera",
    category: "photo",
    accentColor: "#ffbc01", // Amber
    size: "2x1",
  },
  {
    id: "portrait-headshots",
    titleAr: "بورتريه مهني للفريق",
    titleEn: "Professional Team Portraits",
    descriptionAr: "صور شخصية موحدة للمديرين والفريق تستخدم في الموقع، لينكدإن، العروض، والملفات التعريفية.",
    descriptionEn: "Consistent portraits for leaders and teams, ready for websites, LinkedIn, decks, and company profiles.",
    icon: "User",
    category: "photo",
    accentColor: "#8b5cf6", // Violet
    size: "1x1",
  },
  {
    id: "drone-aerial",
    titleAr: "درون للمواقع والمشروعات",
    titleEn: "Drone Shots for Locations",
    descriptionAr: "لقطات علوية تشرح حجم المكان وتناسب العقارات، المصانع، الفعاليات، والمشروعات التي تحتاج لإظهار المساحة.",
    descriptionEn: "Aerial shots that explain scale for real estate, factories, events, and projects where location matters.",
    icon: "Compass",
    category: "drone",
    accentColor: "#3b82f6", // Blue
    size: "1x1",
  },
  {
    id: "motion-graphics",
    titleAr: "موشن جرافيك للشرح",
    titleEn: "Explainer Motion Graphics",
    descriptionAr: "فيديوهات قصيرة تشرح الخدمة أو المنتج بلغة بسيطة تصلح للإعلانات، العروض، وصفحات الهبوط.",
    descriptionEn: "Short explainers that make products and services easier to understand across ads, decks, and landing pages.",
    icon: "Layers",
    category: "motion",
    accentColor: "#10b981", // Emerald
    size: "2x1",
  },
  {
    id: "commercial-video",
    titleAr: "فيديو إعلاني للحملات",
    titleEn: "Campaign Commercial Video",
    descriptionAr: "فيديو مبني على رسالة وCTA واضح، مناسب للإعلانات المدفوعة، السوشيال، وصفحات البيع.",
    descriptionEn: "Commercial videos built around a message and clear CTA, ready for paid ads, social, and sales pages.",
    icon: "Video",
    category: "video",
    accentColor: "#f43f5e", // Rose
    size: "1x2",
  },
];

export const PORTFOLIO: PortfolioItem[] = [
  {
    id: "perfume-luxury",
    titleAr: "حملة عطر العود الملكي",
    titleEn: "Royal Oud Perfume Campaign",
    categoryAr: "تصوير منتجات صامت",
    categoryEn: "Still Product Photography",
    imageUrl: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=85",
    year: "2026",
    clientAr: "دار الطيب للعود",
    clientEn: "Al-Tayeb Oud Line",
    type: "photo",
  },
  {
    id: "coffee-cinematic",
    titleAr: "إعلان الحبة الذهبية للقهوة",
    titleEn: "Golden Bean Coffee Story",
    categoryAr: "فيديو إعلاني قصير",
    categoryEn: "Commercial Short Film",
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=85",
    year: "2025",
    clientAr: "محامص حبوب البن",
    clientEn: "Golden Bean Roastery",
    type: "video",
  },
  {
    id: "realestate-aerial",
    titleAr: "مجمع حدائق القرنفل السكني",
    titleEn: "Clover Gardens Compound",
    categoryAr: "تصوير جوي وإنتاج عقاري",
    categoryEn: "Drone & Real Estate Cinematic",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=85",
    year: "2026",
    clientAr: "إعمار للتطوير العقاري",
    clientEn: "Emaar Real Estate",
    type: "drone",
  },
  {
    id: "fashion-shoot",
    titleAr: "مجموعة الشتاء لعلامة ڤيلا",
    titleEn: "Vela Winter Collection",
    categoryAr: "تصوير أزياء وموديلز",
    categoryEn: "Fashion & Editorial Shoot",
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85",
    year: "2026",
    clientAr: "ڤيلا للأزياء الجاهزة",
    clientEn: "Vela Fashion",
    type: "photo",
  },
  {
    id: "smarttech-promo",
    titleAr: "إطلاق ساعة بيونيك الذكية",
    titleEn: "Bionic SmartWatch Launch",
    categoryAr: "فيديو ثري دي ومونتاج مدمج",
    categoryEn: "CGI & Fusion Promo Film",
    imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=85",
    year: "2025",
    clientAr: "بيونيك تيك",
    clientEn: "Bionic Tech Global",
    type: "video",
  },
  {
    id: "gourmet-restaurant",
    titleAr: "هوية مأكولات شيف ستوديو",
    titleEn: "Chef's Studio Culinary Identity",
    categoryAr: "تصوير أطعمة احترافي",
    categoryEn: "Gourmet Food Styling",
    imageUrl: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1000&q=85",
    year: "2026",
    clientAr: "مطعم لو شيف",
    clientEn: "Le Chef Gourmet",
    type: "photo",
  },
];

export const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: "step-1",
    stepNumber: "01",
    titleAr: "البريف وهدف المحتوى",
    titleEn: "Brief and content goal",
    descriptionAr: "نحدد المنتج أو الخدمة، الجمهور، الرسالة الأساسية، والمنصة التي سيستخدم عليها المحتوى قبل وضع خطة التصوير.",
    descriptionEn: "We define the product or service, audience, core message, and intended platform before planning the shoot.",
    icon: "ClipboardList",
  },
  {
    id: "step-2",
    stepNumber: "02",
    titleAr: "تجهيز المشهد والأصول",
    titleEn: "Scene and asset preparation",
    descriptionAr: "نرتب المنتجات، الخلفيات، الإضاءة، الأشخاص، والديكورات المطلوبة حتى يظهر المحتوى جاهزاً للإعلانات والصفحات.",
    descriptionEn: "We prepare products, backdrops, lighting, people, and props so the content is ready for ads and pages.",
    icon: "MapPin",
  },
  {
    id: "step-3",
    stepNumber: "03",
    titleAr: "التصوير حسب الاستخدام",
    titleEn: "Production by use case",
    descriptionAr: "نصور لقطات رئيسية وتفصيلية ونسخ مناسبة للمتجر، السوشيال، الإعلانات، أو صفحة الهبوط حسب الخطة.",
    descriptionEn: "We capture hero shots, detail shots, and versions for stores, social, ads, or landing pages based on the plan.",
    icon: "Camera",
  },
  {
    id: "step-4",
    stepNumber: "04",
    titleAr: "المونتاج وتجهيز النسخ",
    titleEn: "Editing and content versions",
    descriptionAr: "نختار أفضل اللقطات، نضبط الألوان والصوت، ونجهز نسخاً بأبعاد مختلفة للإعلان، الريلز، والموقع.",
    descriptionEn: "We select the best shots, adjust color and sound, and prepare versions for ads, reels, and the website.",
    icon: "Sliders",
  },
  {
    id: "step-5",
    stepNumber: "05",
    titleAr: "المراجعة والتسليم",
    titleEn: "Review and delivery",
    descriptionAr: "نرسل مسودة للمراجعة، نطبق الملاحظات المتفق عليها، ثم نسلم الملفات النهائية منظمة وجاهزة للنشر.",
    descriptionEn: "We send a review draft, apply agreed notes, then deliver organized final files ready to publish.",
    icon: "Send",
  },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "basic",
    titleAr: "جلسة صور منتجات أساسية",
    titleEn: "Essential Product Shoot",
    price: "2,500",
    pricePeriodAr: "جلسة تصوير",
    pricePeriodEn: "Session",
    descriptionAr: "مناسبة للمتاجر والبراندات التي تحتاج صور منتجات نظيفة للعرض والإعلانات.",
    descriptionEn: "Ideal for stores and brands that need clean product images for listings and ads.",
    featuresAr: [
      "تصوير منتجات صامتة حتى ١٥ لقطة مختلفة",
      "تعديل ومعالجة ٢٥ صورة مختارة",
      "خلفيتان مناسبتان للمتجر والإعلانات",
      "تسليم الملفات خلال ٥ أيام عمل بصيغ جاهزة للويب",
      "حقوق استخدام تجاري للصور المسلمة"
    ],
    featuresEn: [
      "Still product shoot (up to 15 unique items)",
      "Professional retouching for 25 high-res selected photos",
      "Two standard backdrops (Classic White + Plain Color)",
      "Standard 5 business days delivery in web formats",
      "Unlimited commercial imagery license"
    ],
    isPopular: false,
    accentColor: "#3b82f6", // Blue
  },
  {
    id: "portraits",
    titleAr: "جلسة بورتريه الشركة",
    titleEn: "Company Portrait Session",
    price: "3,200",
    pricePeriodAr: "جلسة بورتريه",
    pricePeriodEn: "Session",
    descriptionAr: "جلسة موحدة للمديرين والفريق لتحديث الموقع، العروض، والحسابات المهنية.",
    descriptionEn: "A consistent session for leaders and teams to update websites, presentations, and professional profiles.",
    featuresAr: [
      "جلسة تصوير بورتريه (حتى ٦ موظفين أو شركاء)",
      "تعديل وتصفية عالية الدقة لـ ١٢ صورة بورتريه كلاسيكية",
      "تحكم متكامل في الإضاءة المتنقلة أو إضاءة الاستوديو",
      "تسليم الملفات الرقمية بدقة جاهزة للطباعة والمواقع اللينكد إن",
      "حقوق استخدام وتحديث بلا حدود لصور الفريق"
    ],
    featuresEn: [
      "Professional portraits (up to 6 team members/partners)",
      "Premium high-fidelity retouching for 12 classic headshots",
      "Advanced studio or mobile light kit setup",
      "High resolution delivery ready for LinkedIn and print media",
      "Full digital rights for company profiles and websites"
    ],
    isPopular: false,
    accentColor: "#8b5cf6", // Violet
  },
  {
    id: "drone",
    titleAr: "خطة تصوير درون",
    titleEn: "Drone Coverage Pack",
    price: "5,000",
    pricePeriodAr: "جلسة تحليق وتصوير",
    pricePeriodEn: "Session",
    descriptionAr: "لقطات علوية واضحة للمواقع العقارية، المصانع، الفعاليات، والمساحات الواسعة.",
    descriptionEn: "Clear aerial coverage for real estate, factories, events, and wide spaces.",
    featuresAr: [
      "تصوير جوي سينمائي (ساعتان تحليق فعلي بالدرون)",
      "لقطات مجمعة بدقة 4K فائقة الوضوح مع تصحيح الألوان مسبقاً",
      "قائد درون مرخص ومحترف لضمان أمان وجمال المشهد",
      "تسليم ١٠ لقطات فيديو خام + ٥ صور فوتوغرافية جوية معدلة",
      "ترخيص تجاري وبث كامل للمواد المصورة بالدرون"
    ],
    featuresEn: [
      "Aerial drone cinematography (2 hours active flight time)",
      "Raw 4K ultra-detailed assets with pre-applied color profiling",
      "Licensed operator ensuring spectacular cinematic dynamic composition",
      "Delivery of 10 raw select video clips + 5 post-processed images",
      "Full commercial licensing for website and broadcast video"
    ],
    isPopular: false,
    accentColor: "#10b981", // Emerald
  },
  {
    id: "pro",
    titleAr: "خطة محتوى إعلاني",
    titleEn: "Ad Content Hybrid",
    price: "7,500",
    descriptionAr: "تجمع بين صور البيع وفيديوهات قصيرة جاهزة لريلز، تيك توك، وإعلانات الموبايل.",
    descriptionEn: "Combines sales photos with short vertical videos ready for Reels, TikTok, and mobile ads.",
    isPopular: true,
    pricePeriodAr: "جلسة إنتاج",
    pricePeriodEn: "Production Session",
    featuresAr: [
      "تصوير منتجات وسيناريو لايف (حتى ٢٥ لقطة للمنتجات)",
      "إنتاج وتصوير ٣ فيديوهات قصيرة (Reels/TikTok) شامل المونتاج",
      "موسيقى ومؤثرات مناسبة لطبيعة الإعلان",
      "لقطات استخدام أو كواليس حسب احتياج الحملة",
      "تسليم خلال ٣ إلى ٤ أيام مع مراجعتين"
    ],
    featuresEn: [
      "Live product and usage shoot up to 25 shots",
      "Production of 3 short-form videos (Reels/TikTok) with full editing",
      "Music and sound design matched to the ad context",
      "Usage or behind-the-scenes shots when needed",
      "Delivery in 3 to 4 days with two review rounds"
    ],
    accentColor: "#9d027c", // Magenta/Purple
  },
  {
    id: "cinematic",
    titleAr: "إنتاج حملة فيديو كاملة",
    titleEn: "Full Campaign Video Suite",
    price: "18,000",
    pricePeriodAr: "إنتاج كامل",
    pricePeriodEn: "Full Master Suite",
    descriptionAr: "للشركات التي تحتاج فيديو رئيسي مع نسخ قصيرة للإعلانات والمنصات، من الفكرة حتى التسليم.",
    descriptionEn: "For businesses that need a main video plus short ad and social cuts, from concept through delivery.",
    featuresAr: [
      "فيديو رئيسي من ٤٥ إلى ٩٠ ثانية مبني على رسالة واضحة",
      "نسخ قصيرة للإعلانات والسوشيال حسب المنصات المطلوبة",
      "فريق تصوير وإضاءة وصوت مناسب لحجم الإنتاج",
      "لقطات منتجات أو فريق حسب فكرة الحملة",
      "تصحيح ألوان وموسيقى ومونتاج نهائي",
      "تسليم منظم مع حقوق استخدام تجاري للمواد"
    ],
    featuresEn: [
      "Main 45 to 90 second video built around one clear message",
      "Short ad and social versions for the required platforms",
      "Production, lighting, and sound crew sized to the project",
      "Product or team shots based on the campaign concept",
      "Color, music, sound, and final editing",
      "Organized delivery with commercial usage rights"
    ],
    isPopular: false,
    accentColor: "#ffbc01", // Gold/Amber
  },
];

export const STUDIO_STATS: StatItem[] = [
  {
    id: "stat-projects",
    value: 247,
    suffix: "+",
    labelAr: "مشروع منجز",
    labelEn: "Projects Delivered",
    icon: "CheckCircle",
  },
  {
    id: "stat-photos",
    value: 4.8,
    suffix: "k+",
    labelAr: "صورة جاهزة للنشر",
    labelEn: "Publish-ready images",
    icon: "Image",
  },
  {
    id: "stat-satisfaction",
    value: 98,
    suffix: "%",
    labelAr: "نسبة رضا عملائنا",
    labelEn: "Client Satisfaction",
    icon: "Smile",
  },
  {
    id: "stat-hours",
    value: 500,
    suffix: "h+",
    labelAr: "ساعة تصوير ومونتاج",
    labelEn: "Shooting & Editing Hours",
    icon: "Clock",
  },
];
