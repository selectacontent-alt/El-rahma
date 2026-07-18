import { Service, Testimonial } from './types';

export const servicesData: Service[] = [
  {
    id: 'marketing-advertising',
    icon: 'Megaphone',
    titleAr: 'التسويق والدعاية والإعلان',
    titleEn: 'Marketing Publicity & Advertising',
    descAr: 'هندسة متكاملة للحملات الإعلانية المدفوعة على منصات ميتا جوجل وتيك توك وتطوير قنوات الاستقطاب لخفض تكلفة العميل وضمان كفاءة ميزانية الإعلان',
    descEn: 'Engineering integrated paid advertising campaigns on Meta Google & TikTok optimizing acquisition funnels to lower client acquisition cost and maximize ad-spend efficiency',
    detailsAr: [
      'هندسة متكاملة لقموع المبيعات (Sales Funnels) مع واجهات مصممة خصيصاً للتحويل',
      'إدارة وتمويل الميزانيات الإعلانية بأساليب التخصيص والتحكم الذكي الديناميكي',
      'صياغة نصوص بيعية مبتكرة (Copywriting) وصناعة محتوى ترويجي يحرك المشاعر ويحفز على الشراء',
      'تحليلات دورية دقيقة لمتابعة العائد الفعلي على الإنفاق الإعلاني (ROAS)'
    ],
    detailsEn: [
      'Complete high-converting sales funnel engineering custom-built for scaling products',
      'Intelligent dynamic budget management and rigorous multi-platform media buying',
      'Scientific copywriting and persuasive high-impact advertorial/UGC creative structures',
      'Granular performance tracking and regular reporting on Return on Ad Spend (ROAS)'
    ],
    metricsAr: 'معدل قياسي لخفض تكلفة العميل (CPA): -35%',
    metricsEn: 'Avg Customer Acquisition Cost lowered by: -35%',
    color: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'artificial-intelligence',
    icon: 'Brain',
    titleAr: 'الذكاء الاصطناعي',
    titleEn: 'Artificial Intelligence',
    descAr: 'تطوير حلول استشارية وأنظمة ذكية مدعومة بالذكاء الاصطناعي لتطوير أداء عملك والرد المؤتمت الفوري على العملاء وتوليد استراتيجيات رقمية لحظية ونماذج نمو متطورة',
    descEn: 'Design and deployment of customized AI solutions automated customer communication funnels instant digital strategies and predictive workflow optimization engines',
    detailsAr: [
      'بناء أنظمة دردشة ومحادثة فورية (AI Agents) لتوجيه العملاء وحل استفساراتهم على مدار الساعة',
      'أتمتة العمليات الداخلية (Workflows CRM) لزيادة كفاءة وسرعة إتمام الخدمات والبيع',
      'تكامل المبيعات مع نماذج ذكية قادرة على تحليل تصرفات المشترين وزيادة القيمة المتوسطة للسلة (AOV)',
      'تدريب النماذج اللغوية على بيانات مشروعك لتقديم استشارات وخدمات مخصصة'
    ],
    detailsEn: [
      'Synthesizing persistent conversational AI Agents to capture and resolve leads 24/7.',
      'Intelligent workflow automations and CRM synchronization to eliminate operational friction',
      'Integration of predictive product recommendation modules to optimize cart values (AOV)',
      'Bespoke language model training tailored entirely to target business portfolios'
    ],
    metricsAr: 'زيادة سرعة العمليات والرد على العملاء: +120%',
    metricsEn: 'Boost in operational speed & instant response rate: +120%',
    color: 'from-violet-550 to-purple-600'
  },
  {
    id: 'web-design-dev',
    icon: 'Code',
    titleAr: 'تصميم وإنشاء المواقع',
    titleEn: 'Website Design & Creation',
    descAr: 'تصميم وبرمجة مواقع مخصصة منصات تجارة إلكترونية وصفحات هبوط تمتاز بسرعة تحميل فائقة ومتوافقة بنسبة 100% مع محركات البحث وتجربة المستخدم',
    descEn: 'Design development and system deployment of specialized corporate websites fast e-commerce portals and landing pages optimized for maximum performance and search ranking',
    detailsAr: [
      'تطوير وتصميم مواقع بصرية فاخرة تدعم سرعة فتح مذهلة (LCP < 1.2 ثانية)',
      'توفير لوحة تحكم مخصصة لإدارة المحتوى المنتجات والعمليات بسهولة مطلقة',
      'تصاميم متجاوبة بالكامل لتقديم تجربة حيوية ورائعة على جميع أجهزة الهاتف والمكتب',
      'تهيئة متكاملة لمحركات البحث (SEO Core Optimization) لضمان صدارة الكلمات البحثية'
    ],
    detailsEn: [
      'Premium high-performance visual coding guaranteeing incredible load times (LCP < 1.2s)',
      'Unified admin backends for intuitive management of resources catalogs and operations',
      'Fully responsive fluid layouts designed for seamless multi-screen compatibility',
      'Comprehensive structural SEO integration to maximize organic discoverable rank'
    ],
    metricsAr: 'نتائج سرعة وأداء تصفح موثقة: +98%',
    metricsEn: 'Verified speed & core vitals score: +98% score',
    color: 'from-emerald-500 to-teal-600'
  }
];

export const testimonialsData: Testimonial[] = [
  {
    id: '1',
    nameAr: 'م أحمد الشمراني',
    nameEn: 'Eng Ahmed Al-Shahrani',
    roleAr: 'المدير التنفيذي',
    roleEn: 'CEO',
    companyAr: 'مجموعة المشرق اللوجستية',
    companyEn: 'Al-Mashreq Logistics Group',
    textAr: 'تعاملنا مع S C MARKTING لتطوير منصتنا الرقمية وحل تراجع المبيعات حصلنا على موقع فائق السرعة واستراتيجية إعلانية قللت تكلفتنا بنسبة 40% وضاعفت طلباتنا فريق احترافي يعامل مشروعك كأنه مِلكه',
    textEn: 'We partnered with S C MARKTING to build our digital portal and restructure our sales pipeline We received an ultra-fast site and an ad strategy that slashed our CPA by 40% A masterclass in agency execution',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=facearea&facepad=2&w=256&h=256&q=80',
    rating: 5
  },
  {
    id: '2',
    nameAr: 'سارة المهيري',
    nameEn: 'Sarah Al-Mheiri',
    roleAr: 'رئيسة التسويق',
    roleEn: 'VP of Marketing',
    companyAr: 'بريق للذهب والمجوهرات',
    companyEn: 'Bareeq Jewelry',
    textAr: 'الهوية البصرية وإدارة منصات التواصل غيرت نظرة العملاء لعلامتنا بالكامل التصاميم تمتاز بالفخامة والدقة والحملات أصبحت تستقطب شريحتنا المخملية المستهدفة بدقة مذهلة ومبيعات قياسية',
    textEn: 'The brand identity overhaul and social strategy completely redefined how luxury buyers perceive our products Elegant patterns premium visual density and highly granular targeting brought us our ideal wealthy demographic',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=facearea&facepad=2&w=256&h=256&q=80',
    rating: 5
  },
  {
    id: '3',
    nameAr: 'د فيصل القحطاني',
    nameEn: 'Dr Faisal Al-Qahtani',
    roleAr: 'المؤسس',
    roleEn: 'Founder',
    companyAr: 'عيادات ديرما لايف التخصصية',
    companyEn: 'DermaLife Specialty Clinics',
    textAr: 'كنا نعاني من عشوائية الحملات الإعلانية وصعوبة جذب الحجوزات الطبية المؤكدة بفضل هندسة قمع المبيعات وحملات جوجل المتخصصة من قبلهم تعمل عياداتنا بكامل طاقتها الاستيعابية الآن بنسبة رضا عملاء خيالية',
    textEn: 'We struggled with poor lead quality and low hospital booking rates Thanks to their advanced sales funnel setup and search network domination our clinics are operating at 100% capacity with great ROAS',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=facearea&facepad=2&w=256&h=256&q=80',
    rating: 5
  }
];

export const i18n = {
  ar: {
    dir: 'rtl',
    brandName: 'S C MARKTING',
    brandSub: 'للتسويق والحلول الرقمية العليا',
    nav: {
      home: 'الرئيسية',
      news: 'S C News',
      services: 'خدماتنا',
      calculator: 'مستشار الميزانية والـ ROI',
      aiAdvisor: 'خبير الاستراتيجية الذكي AI',
      testimonials: 'وثقوا بنا',
      contact: 'ابدأ مشروعك',
      projects: 'مشروعاتنا',
    },
    hero: {
      badge: 'إدارة وحلول تسويقية مبنية على البيانات والذكاء الاصطناعي',
      mainTitle: 'انضم إلى عائلتنا',
      subtitle: 'تحكّم بمسارك التسويقي في السوق المنافس بانضمامك إلى عائلتنا .. ليس لطموحنا سقف!',
      ctaPrimary: 'ابدأ مشروعك معنا',
      ctaSecondary: 'استشر الذكاء الاصطناعي الآن',
      experience: 'خبرة 5 سنوات',
      campaigns: 'حملة إعلانية',
      clients: 'عميل',
      projects: 'مشروعات',
    },
    projectsMenu: {
      branding: 'هويات بصرية',
      websites: 'موقع الكتروني',
      social: 'تصميمات سوشيال ميديا',
      animation: 'فيديوهات الرسوم المتحركة',
      promotional: 'فيديوهات مصورة دعائية',
      photography: 'تصوير فوتوغرافي للمنتجات'
    },
    services: {
      title: 'خدمات هندسية رائدة لنموك الرقمي المتصاعد',
      subtitle: 'لا نطلق إعلانات عشوائية بل نبني معماريات تسويقية دقيقة قائمة على دراسة عميقة لعميلك وتحليل صارم لمنافسيك مع خطوط مرنة لتعظيم أرباحك',
      ctaDetail: 'عرض التفاصيل والمنهجية الفنية',
      metricsLabel: 'المعايير المكتسبة:',
      back: 'إغلاق التفاصيل'
    },
    calculator: {
      title: 'محاكي العائد على الاستثمار والنمو التنافسي (ROI)',
      subtitle: 'اسحب منزلقات الميزانية وحدد قنواتك الإعلانية المفضلة لمشاهدة استشراف فوري للأرباح المتوقعة والعدد التقديري للعملاء المستهدفين ومخاطر السوق',
      monthlyBudget: 'الميزانية الإعلانية الشهرية المتوقعة (جم)',
      industry: 'مجال نشاطك التجاري المنافس',
      industries: {
        ecommerce: 'تجارة إلكترونية وتجزئة (E-Commerce)',
        services: 'خدمات مهنية واستشارية (B2B / Services)',
        realestate: 'عقارات ومشاريع سكنية (Real Estate)',
        medical: 'رعاية صحية وتجميل وخدمات طبية (Medical)',
        tech: 'برمجيات وتقنيات ناشئة (SaaS / Tech)'
      },
      channels: 'القنوات التسويقية المفضلة لديك',
      metrics: {
        estImpressions: 'الظهور المتوقع شهرياً',
        estLeads: 'الزيارات / العملاء المهتمين',
        estConversions: 'المبيعات / التحويلات المؤكدة',
        estRevenue: 'العائد المتوقع شهرياً',
        roas: 'معدل العائد على الإعلانات المتوقع (ROAS)'
      },
      warning: 'ملاحظة: البيانات المعروضة مبنية على متوسط معدلات الأداء التاريخية في السوق الإقليمي وقد تختلف محلياً بحسب جودة منتجك وعرضك التجاري الحالي'
    },
    aiAdvisor: {
      title: 'مستشار الاستراتيجية التسويقية الذكي (AI Generative Planning)',
      subtitle: 'نظام توليد الخطط الأوتوماتيكي المدعوم بنموذج Gemini 3.5. اكتب تفاصيل عملك ميزانيتك وجمهورك المستهدف وسيبني لك خبيرنا المطور استراتيجية نمو شاملة ومكثفة قابلة للتنفيذ الفوري بكافة معاييرها الفنية وبخطوط صغيرة دقيقة',
      brandLabel: 'اسم مشروعك أو شركتك',
      brandPlaceholder: 'مثال: متجر بريق للمجوهرات',
      industryLabel: 'شرح بسيط لنشاطك ومنتجاتك',
      industryPlaceholder: 'مثال: نبيع مجوهرات فاخرة مصنعة يدوياً من الذهب الخالص عيار 21 ونستهدف النساء في الخليج العربي...',
      budgetLabel: 'الميزانية التسويقية الكلية المستهدفة للشهور الثلاثة القادمة (جم)',
      targetLabel: 'الجمهور المستهدف الأساسي للنشاط',
      targetPlaceholder: 'مثال: سيدات الأعمال المهتمات بالفخامة والقطع الفردية من عمر 25-50',
      btnGenerate: 'توليد الاستراتيجية الفنية الفورية باستخدام الذكاء الاصطناعي',
      generating: 'يتم الآن تحليل السوق وصياغة الاستراتيجية بالكامل يرجى الانتظار...',
      error: 'حدث خطأ أثناء الاتصال بخادم الذكاء الاصطناعي يرجى المحاولة لاحقاً والتأكد من تهيئة مفتاح API الخاص بك بـ Secrets',
      resultTitle: 'الخطة الاستراتيجية التكتيكية لمشروعك:',
      summary: 'الملخص التنفيذي والاستنتاج المالي:',
      audience: 'دراسة وتحديد نقاط استهداف الجمهور:',
      channels: 'تخصيص القنوات التسويقية المثلى مع رصد دقيق للميزانية:',
      phases: 'المراحل التكتيكية للتنفيذ (توزيع على 3 شهور):',
      estimatedRoiTitle: 'العائد التقديري والتحليلات المتوقعة للنجاح:',
      tacticalTipTitle: 'توصية الخبير النخبوي السريّة:',
      disclaimer: 'تستند هذه الاستراتيجية التوليدية إلى ذكاء اصطناعي تفاعلي دقيق لتعطيك فكرة ناضجة وأفكاراً مبتكرة تبدأ بها هجومك التسويقي في بضع ثوانٍ'
    },
    discount: {
      badge: 'حملة حصرية محدودة الوقت',
      title: 'احصل على خصم 50% فوري لتصوير وإنتاج الفيديو الديجيتال الدعائي الاحترافي',
      subtitle: 'المحتوى المرئي هو الملك في العصر الحالي لا تفوت فرصتك بصناعة فيديو إعلاني احترافي يحكي قصة مشروعك ويأسر قلوب جمهورك ويحرك محركات مبيعاتك بكفاءة قصوى',
      timerLabel: 'ينتهي هذا العرض الحصري بعد:',
      days: 'أيام',
      hours: 'ساعات',
      minutes: 'دقائق',
      seconds: 'ثواني',
      cta: 'احجز العرض النخبوي الآن وثبّت الخصم'
    },
    testimonials: {
      title: 'شركاء صنعنا معهم أرقاماً استثنائية ونمواً لا يتوقف',
      subtitle: 'نسعد بكوننا جزءاً ملهماً من مسارات نمو كبرى الشركات والعيادات الطبية بالمنطقة اقرأ شهادات أصحاب القرار الحقيقية والمدعمة بأدلة نجاح ملموسة'
    },
    partners: {
      title: 'شركاء النجاح الاستراتيجيين',
      subtitle: 'كيانات كبرى وثقت بمعماريتنا الفنية وحققت قفزات نوعية في مبيعاتها وتوسعها الجغرافي'
    },
    contact: {
      title: 'ابدأ بطلب واضح لمشروعك',
      subtitle: 'اختر الخدمة واكتب هدفك التجاري وسنراجع التفاصيل لنقترح نطاق عمل يناسب المرحلة والميزانية.',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      company: 'اسم الشركة أو النشاط',
      budget: 'الميزانية التقريبية',
      servicePlaceholder: 'اختر الخدمة المطلوبة',
      message: 'ما الهدف أو التحدي الذي تريد حله؟',
      submit: 'إرسال الطلب للفريق',
      success: 'وصلنا طلبك بنجاح. سنراجع التفاصيل ونتواصل معك لتأكيد الاحتياج والخطوة التالية.',
      cards: {
        addressTitle: 'مقر العمل',
        addressDesc: 'شارع 15 مايو امام مطعم كنتاكي، شبرا الخيمة، القاهرة',
        phoneTitle: 'تواصل مباشر',
        phoneDesc: '+01013100178',
        paymentTitle: 'التعاقد والدفع',
        paymentDesc: 'تأكيد طريقة الدفع والتعاقد يتم بعد مراجعة نطاق العمل'
      }
    },
    footer: {
      desc: 'وكالة تسويق وحلول رقمية تجمع الاستراتيجية، المحتوى، الإعلانات، والمواقع لمساعدة الشركات على تحويل الظهور إلى طلبات.',
      rights: 'جميع الحقوق محفوظة لوكالة S C MARKTING للتسويق والحلول الرقمية © 2026.',
      linksTitle: 'الأقسام',
      browseTitle: 'الخدمات',
    }
  },
  en: {
    dir: 'ltr',
    brandName: 'S C MARKTING',
    brandSub: 'High-Performance Marketing & Web Architectures',
    nav: {
      home: 'Home',
      news: 'S C News',
      services: 'Our Services',
      calculator: 'Budget & ROI Simulator',
      aiAdvisor: 'AI Strategy Advisor',
      testimonials: 'Client Proof',
      contact: 'Start Project',
      projects: 'Our Projects',
    },
    hero: {
      badge: 'Data-driven AI-integrated digital marketing architectures',
      mainTitle: 'Join Our Family',
      subtitle: 'Become part of our success cohort and completely command your industry with modern server platforms hyper-performing media buying funnels and precision customer acquisition networks',
      ctaPrimary: 'Start Your Project With Us',
      ctaSecondary: 'Query AI Planner',
      experience: 'Years of Experience',
      campaigns: 'Ad Campaigns',
      clients: 'Happy Clients',
      projects: 'Successful Projects',
    },
    projectsMenu: {
      branding: 'Visual Identities',
      websites: 'Websites & Portals',
      social: 'Social Media Designs',
      animation: 'Animated Videos',
      promotional: 'Promotional Filmed Videos',
      photography: 'Product Photography'
    },
    services: {
      title: 'Architectured Services Driving Exponential Inbound Cycles',
      subtitle: 'We do not engage in erratic ad buying; we design highly-detailed consumer workflows driven by psychological intent and aggressive algorithmic deployment',
      ctaDetail: 'Reveal Technical Methodology',
      metricsLabel: 'Acquired KPIs:',
      back: 'Close Methodology'
    },
    calculator: {
      title: 'High-Density ROI & Competitive Market Simulator',
      subtitle: 'Interact with ad budget targets and primary domains to immediately project financial yield structures conversions forecasting and dynamic target acquisition risk arrays',
      monthlyBudget: 'Estimated Monthly Active Ad Spend (EGP)',
      industry: 'Competitive Corporate Sector',
      industries: {
        ecommerce: 'E-Commerce & Digital Retail (E-Commerce)',
        services: 'Consultative & Professional (B2B / Services)',
        realestate: 'Real Estate & Urban Land Ventures (Real Estate)',
        medical: 'Specialty Healthcare & Aesthetics (Medical)',
        tech: 'Software Architectures & Emerging SaaS (Tech)'
      },
      channels: 'Target Acquisition Channels',
      metrics: {
        estImpressions: 'Projected Impressions',
        estLeads: 'Inbound Actionable Leads',
        estConversions: 'Confirmed Conversion Events',
        estRevenue: 'Estimated Gross Channel Revenue',
        roas: 'Target Ad Spend Return Rate (ROAS)'
      },
      warning: 'Notice: Analytics models utilize aggregate historic regional platform telemetry Client deliverables adjust depending on landing conversion factors and unique sales value propositions'
    },
    aiAdvisor: {
      title: 'AI Generative Strategy Architecture Engine',
      subtitle: 'Autonomous strategic generation powered by Gemini-3.5-Flash Inputs your operational model active target demographics and gross scaling capital to synthesize a hyper-detailed technical 3-month growth blueprint with narrow modern typography styling',
      brandLabel: 'Project Name / Corporate Entity',
      brandPlaceholder: 'eg Bareeq Fine Handcrafted Gold',
      industryLabel: 'Brief Description of Value Chain & Offers',
      industryPlaceholder: 'eg Crafting premium artisanal 21-karat solid gold jewelry targeting affluent women in the Gulf Cooperation Council region...',
      budgetLabel: 'Target Digital Growth Capital allocated for Next Q1 (EGP)',
      targetLabel: 'Selected Target Consumer Profile',
      targetPlaceholder: 'eg Elite corporate women valuing individual custom jewelry items aged 25-50',
      btnGenerate: 'Synthesize Instant Technical Engine Blueprint via AI',
      generating: 'Algorithmic market synthesis active Compiling detailed strategy blocks please wait...',
      error: 'API channel mismatch Ensure your Gemini API project key is fully configured in your Settings secrets array',
      resultTitle: 'Assembled Operational Roadmap Blueprint:',
      summary: 'Executive & Capital Efficiency Synthesis:',
      audience: 'Target Consumer Demographic Mapping:',
      channels: 'Dynamic Marketing Channel Budget Layouts:',
      phases: 'Granular Operational Phases (3-Month Rollout Tasks):',
      estimatedRoiTitle: 'Anticipated Inbound Metrics & Business Vitality Outcomes:',
      tacticalTipTitle: 'Deep Insider Strategy Core Directive:',
      disclaimer: 'Generated strategic advice acts as a high-density automated digital advisory blueprint designed to accelerate your tactical launch workflow in seconds'
    },
    discount: {
      badge: 'Limited Epoch Offer',
      title: 'Claim Your 50% Campaign Discount for Premium Cinematic Digital Video Production',
      subtitle: 'High-concept vertical and cinematic storytelling is the supreme visual conversion accelerator Secure premium product and founder portraits to capture organic algorithms',
      timerLabel: 'Offer window remaining:',
      days: 'Days',
      hours: 'Hours',
      minutes: 'Mins',
      seconds: 'Secs',
      cta: 'Lock In My Campaign Discount Now'
    },
    testimonials: {
      title: 'Partners Engaged in Disruptive Unstoppable Ascents',
      subtitle: 'Explore active proof from board-level founders and chief operations officers who successfully restructured their marketing margins through our advanced protocols'
    },
    partners: {
      title: 'Our Strategic Business Enterprise Network',
      subtitle: 'Prestigious industry actors who trusted our technical systems and recorded massive regional gains'
    },
    contact: {
      title: 'Start with a clear project request',
      subtitle: 'Choose the service, share your business goal, and we will review the details to suggest a scope that fits your stage and budget.',
      name: 'Full name',
      email: 'Email address',
      company: 'Company or business name',
      budget: 'Estimated budget',
      servicePlaceholder: 'Choose the requested service',
      message: 'What goal or challenge do you want to solve?',
      submit: 'Send request to the team',
      success: 'We received your request. Our team will review the details and contact you to confirm the need and next step.',
      cards: {
        addressTitle: 'Office location',
        addressDesc: '15 May Street, in front of KFC, Shubra El Kheima, Cairo',
        phoneTitle: 'Direct contact',
        phoneDesc: '+01013100178',
        paymentTitle: 'Agreement and payment',
        paymentDesc: 'Payment and agreement details are confirmed after reviewing the work scope.'
      }
    },
    footer: {
      desc: 'A marketing and digital solutions agency combining strategy, content, ads, and websites to help businesses turn visibility into real requests.',
      rights: '© 2026 S C MARKTING. All rights reserved.',
      linksTitle: 'Sections',
      browseTitle: 'Services',
    }
  }
};
