import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Smartphone, 
  Video, 
  Megaphone, 
  Sparkles, 
  Award, 
  CheckCircle, 
  ArrowRight, 
  ChevronRight, 
  TrendingUp, 
  Laptop,
  Check,
  Zap,
  Play,
  Volume2,
  VolumeX,
  Layers,
  Search,
  Grid,
  Heart,
  Eye,
  Lock,
  DollarSign
} from 'lucide-react';
import { Language } from '../types';
import SpatialWebGallery from './SpatialWebGallery';

interface ShowcaseHubProps {
  currentLang: Language;
  onSelectService?: (serviceName: string) => void;
  setActiveTab?: (tab: string) => void;
}

export default function ShowcaseHub({ currentLang, onSelectService, setActiveTab }: ShowcaseHubProps) {
  const [activeShowcaseSection, setActiveShowcaseSection] = useState<'branding' | 'web' | 'smm' | 'motion' | 'photos'>('branding');
  
  // Before-After photography slider state (value range 0 to 100)
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isSliding, setIsSliding] = useState<boolean>(false);

  // Video interactive simulator states
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [videoTimer, setVideoTimer] = useState<number>(12);

  // Website preview modal state
  const [activeWebsitePreview, setActiveWebsitePreview] = useState<any | null>(null);

  // Localization resources
  const textDict = {
    ar: {
      sectionTitle: 'معرض التفوق وحلولنا التاريخية',
      sectionSubtitle: 'تأخذك هذه الجولة داخل عروق أعمالنا الموثقة حدد القسم الذي ينطبق عليه نشاطك لاستعراض الحلول التفصيلية تصاميم عملائنا السابقة والمعماريات البيعية عالية الربحية',
      tabs: {
        branding: 'الهوية البصرية واللوجو',
        web: 'سرعة وبرمجة المواقع',
        smm: 'إعلانات السوشيال ميديا',
        motion: 'فيديوهات الموشن جرافيك',
        photos: 'تصوير المنتجات الاحترافي'
      },
      branding: {
        intro: 'ما هي الهوية البصرية؟',
        introDesc: 'هي تصميم يتضمن أي شيء مرئي يعبر عن علامتك التجارية ويستخدم في تكوين صورة تعبر عن المنتج أو الخدمة التي تقدمها وتميزك عن منافسيك',
        whyTitle: 'أهمية الهوية البصرية بالنسبة للشركات:',
        whyItems: [
          {
            title: 'شهادة ميلاد للنشاط الأسير',
            desc: 'تعد بمثابة توثيق استراتيجي لأصل عملك يساعدك في سوق مليء بوسائل الإعلانات والمنافسين الصاخبين'
          },
          {
            title: 'بناء جسور الثقة المتكاملة',
            desc: 'بناء ولاء متين لدى الجمهور المستهدف من عملائك الحاليين والمشترين المستقبليين فور تصفح منشوراتك'
          },
          {
            title: 'سهولة التذكر والالتصاق الذهني',
            desc: 'شعار ذكي وتوليفة ألوان متناسقة تترك أثراً دائماً يصعب نسيانه أو الخلط بينك وبين المنافسين'
          },
          {
            title: 'محفز تسويقي لخفض تكلفة العملاء',
            desc: 'تحسين نسبة نقر الإعلانات وتحويل حركة المرور لعوائد نقدية بفعل ثقة المظهر ورقيه البصري'
          }
        ],
        howTitle: 'خطواتنا العلمية لبناء هويتك البصرية المذهلة:',
        howSteps: [
          { num: '01', title: 'دراسة الأهداف وجوهر البراند', desc: 'نجلس معك لتحليل شخصية علامتك التجارية ومعرفة الأهداف التكتيكية والرسالة الموجهة للعملاء' },
          { num: '02', title: 'تحليل دقيق للمنافسين بالسوق', desc: 'نقوم بتشريح بصري لهويات المنافسين لتلافي محاكاة تصاميمهم وبناء رمزية مستقلة تنافس بقوة' },
          { num: '03', title: 'هندسة الشعار والشبكة الهندسية', desc: 'تصميم الشعار باحتساب النسب الجمالية والذهبية ليعمل بمرونة على كروت العمل والمطبوعات والأشرطة الرقمية' },
          { num: '04', title: 'دمج قنوات السوشيال ميديا والتوجيه', desc: 'تسليمك ملفاً متكاملاً (Brand Book) يوضح خطوط التصوير وصور الاستوري وتناسق المنشورات عبر كافة الشبكات' }
        ],
        claimAction: 'ابدأ تصميم هويتك البصرية الآن'
      },
      web: {
        intro: 'سلسلة منصاتنا الإلكترونية وتصميم المواقع عالية التحويل',
        desc: 'اضغط على أي موقع تالي لمشاهدة معايير الأداء والسرعة محاكاة تصفح لوحة التحكم ومعدل التحويل المتوقع',
        plansTitle: 'خطط وأسعار البرمجة المتكاملة لدينا:',
        mockPlans: [
          { name: 'خطة الهبوط السريعة', price: '9,990 جم', desc: 'صفحة هبوط فائقة السرعة مهيأة للإعلانات الفورية وبكسل التتبع', features: ['سيرفر مستضاف مجاناً', 'سرعة تصفح < 1 ثانية', 'تكامل بكسل ميتا وتيك توك', 'تصميم متجاوب 100%'] },
          { name: 'خطة الشركات الاحترافية', price: '19,990 جم', desc: 'موقع تعريفي متكامل لخدمات شركتك وإنجازاتك مع ربط فني ومقالات SEO', features: ['لوحة تحكم لإدارته بنفسك', 'أوراق عمل ونماذج تواصل', 'شهادة أمان مدى الحياة SSL', 'تهيئة الكلمات المفتاحية بجوجل'] },
          { name: 'منصة التجارة المتكاملة', price: '34,990 جم', desc: 'متجر إلكتروني ذكي متقدم يدعم بوابات الدفع والشحن وسلات الشراء المهجورة تلقائياً', features: ['ربط بوابات الدفع ومدى وتابي', 'دعم لوجستي لشركات الشحن', 'أتمتة كوبونات الخصم', 'تقارير الأرباح والمبيعات الفورية'] }
        ],
        btnRequest: 'اطلب موقعك الآن وثبت السعر'
      },
      smm: {
        subtitle: 'فريقنا المتخصص يتولى صياغة قنوات الاستقطاب وإدارة حساباتك وتوجيه ميزانية إعلاناتك لضمان تحقيق أعلى ربحية',
        networksTitle: 'المنصات الإعلانية النشطة وقدراتها الفنية الاستثنائية:',
        cards: [
          { name: 'إعلانات فيسبوك', platform: 'Meta', desc: 'هندسة كاملة لقموع المبيعات استهداف الفئات ذات الملاءة المالية وجذب عملاء محتملين مؤهلين مهتمين بالخدمة', roas: '4.8x', cost: 'منخفضة', color: 'from-blue-600 to-sky-700' },
          { name: 'إعلانات انستجرام', platform: 'Meta Visuals', desc: 'صناعة ترويج مرئي يبرز جمالية منتجك ويغري العملاء المتابعين باتخاذ قرار شراء مباشر وسريع عبر الصور الخلابة', roas: '5.2x', cost: 'متوسطة', color: 'from-pink-600 to-purple-600' },
          { name: 'إعلانات تويتر / إكس', platform: 'X Premium', desc: 'استهداف النخب الاقتصادية والسياسية وأصحاب القرار في المملكة والخليج للأنشطة العقارية وB2B الفاخرة', roas: '3.5x', cost: 'مرتفعة', color: 'from-slate-900 to-neutral-800' },
          { name: 'إعلانات تيك توك', platform: 'TikTok Video', desc: 'صناعة محتوى ترويجي يحاكي الفيديوهات العضوية (UGC) لكسر جمود المشاهدة وجلب تدفق مبيعات انفجاري', roas: '6.1x', cost: 'اقتصادية جداً', color: 'from-slate-900 via-teal-900 to-black' },
          { name: 'إعلانات سناب شات', platform: 'Snapchat', desc: 'عدسات وفلاتر وخرائط تفاعلية متطورة لإثارة اهتمام الفئة الشابة النشطة والحصول على صفقات تجارية سريعة', roas: '4.5x', cost: 'متوسطة', color: 'from-yellow-500 to-amber-600' },
          { name: 'إعلانات جوجل أدز', platform: 'Google Search', desc: 'التواجد فوق رؤوس جميع المنافسين عندما يبحث مستخدم فوري بجوجل عن خدمتك لضمان أعلى جودة تواصل', roas: '5.5x', cost: 'بحسب المنافسة', color: 'from-blue-500 via-red-500 to-yellow-500' },
          { name: 'إعلانات يوتيوب', platform: 'YouTube', desc: 'إعلانات فيديو وثائقية لعلامتك التجارية تبني مهابة وثقة هائلة تدوم لسنوات وتصفي جودة الملاك', roas: '3.9x', cost: 'متوسطة-مرتفعة', color: 'from-red-600 to-rose-700' },
          { name: 'إعلانات شبكة التطبيقات', platform: 'AdMob', desc: 'الانتشار الصامت داخل الألعاب ومسارات التطبيقات لإبقاء هويتك البصرية محفورة في لاوعي عملائك', roas: '3.1x', cost: 'اقتصادية', color: 'from-emerald-600 to-teal-700' }
        ],
        btnGetOffer: 'احصل على عرض سعر السوشيال ميديا الآن'
      },
      motion: {
        subtitle: 'المحتوى المرئي والرسوم المتحركة تنقل فكرة مشروعك المعقد لعميلك في 30 ثانية مشوّقة ومحفّزة للتمويل',
        playInstruction: 'انقر على أي نموذج لمشاهدة المخطط الزمني لمحاكاة الفيديو وصناعة الصوت التعبيري:',
        features: {
          scenarist: 'كتابة السيناريو والحبكة البيعية المشوقة',
          voiceOver: 'تسجيل تعليق صوتي بالنبرة العربية المفضلة (رسمي ترويجي خليجي وثاقي)',
          animation: 'تحريك الرسوم بدقة 2D/3D وسرعة إطارات مستقرة ورشيقة',
          soundEffects: 'المطابقة الحركية للمؤثرات والموسيقى التصويرية الذكية'
        },
        bannerPromo: 'خصم 50% - عرض فيديو موشن جرافيك نخبوي',
        bannerSubtitle: 'نصنع لعملك فيديو ترويجي يظهر احترافيتك ويأسر ملاك الشركات للتواصل العاجل معك',
        btnClaimMotion: 'اتصل بنا واحجز الفيديو بخصم 50%'
      },
      photos: {
        intro: 'المقارنة التفاعلية لمعالجة وتعديل وتصوير المنتجات النخبوية',
        desc: 'اسحب مقبض المنزلق وسط الصورة لمقارنة لقطة الهاتف التقليدية المظلمة (في اليسار) بلقطة ستوديوهاتنا الاحترافية ذات الإضاءة والتحرير الرائد (في اليمين)',
        beforeTag: 'تصوير تقليدي بالهاتف',
        afterTag: 'تعديل وتصوير استوديو SELECT المضاء',
        importance: 'لماذا يعد تصوير المنتجات الاستوديو ضروري لمتجرك؟',
        p1: 'قد تبدو معالجة وتصوير المنتجات خطوة كمالية ولكن الدراسات تؤكد أن 82% من مشتري المتاجر يقررون الدفع بناءً على نقاء ووضوح تفاصيل صور المنتج وخلفياتها الاحترافية المعزولة',
        p2: 'نحن لا نلتقط صورة تقليدية فحسب بل نهيئ الإضاءة السينمائية ونصحح توازن الألوان وندمج الظلال الطبيعية لتجعل السلعة حية تبهر زائر المتجر الرقمي وتحثه بقوة على الشراء فبل غلق التبويب',
        btnBookShooting: 'ابدأ تحسين وتصوير منتجاتك اليوم'
      }
    },
    en: {
      sectionTitle: 'Our Historic Solutions & Showcase Hub',
      sectionSubtitle: 'Take a close look inside our meticulously documented past campaigns and structures Choose the department that fits your goals to inspect live layouts and strategies',
      tabs: {
        branding: 'Visual Identity & Logos',
        web: 'Web Engineering & Speed',
        smm: 'Social Media Advertising',
        motion: 'Cinematic Motion Graphics',
        photos: 'Studio Product Photography'
      },
      branding: {
        intro: 'What is Visual Identity',
        introDesc: 'It is a calculated design system consisting of everything visual that represents your brand framing a solid memory in the minds of your audience and making you stand out beautifully',
        whyTitle: 'Why Brand Identity is Vital for Scaling:',
        whyItems: [
          {
            title: 'Your Business Birth Certificate',
            desc: 'Acts as strategic verification of your original values anchoring your corporate standing in noisy markets'
          },
          {
            title: 'Generating Absolute Core Trust',
            desc: 'Fosters organic consumer loyalty letting prospects feel the premier standard of your products instantly'
          },
          {
            title: 'Unforgettable Mind Recall',
            desc: 'A gorgeous mark and harmonious palette ensure your brand stays in the minds of prospects'
          },
          {
            title: 'Lowering Customer Costs',
            desc: 'Clean corporate visuals increase organic click-through rates and optimize ad-spend paths'
          }
        ],
        howTitle: 'Our Methodology in Building Masterpiece Guidelines:',
        howSteps: [
          { num: '01', title: 'Goals & Philosophy Audit', desc: "We sit down with you to explore your corporate values goals and core target demographics" },
          { num: '02', title: 'Granular Market & Competitor Analysis', desc: 'We dissect competitor brands to ensure your identity remains entirely distinct and legally original' },
          { num: '03', title: 'Geometric Logo Synthesis', desc: 'Crafting responsive logos utilizing golden ratios ensuring perfect legibility from app icons to sky billboards' },
          { num: '04', title: 'Complete Brand Integration Guidelines', desc: 'Delivering a master Brand Book covering styling codes social templates typography and visual rules' }
        ],
        claimAction: 'Craft Your Premium Brand Identity'
      },
      web: {
        intro: 'High-Converting Web Platforms & Speed Showcases',
        desc: 'Click on any mockup below to inspect performance vitals simulated admin dashboards and expected margins',
        plansTitle: 'Our Full-Stack Coding & Development Plans:',
        mockPlans: [
          { name: 'Fast Landing Funnel', price: 'EGP 9,990', desc: 'Super-cached single page built for prompt traffic acquisition and seamless social tracking', features: ['Free Hosted Server', 'Load time < 1.0s guaranteed', 'Meta & TikTok Pixel integration', '100% responsive fluid grid'] },
          { name: 'Corporate SEO Website', price: 'EGP 19,990', desc: 'Bespoke corporate platform detailing your firm services past cases blog engine and lead captures', features: ['Direct CMS Content Admin panel', 'Dynamic contact forms & widgets', 'Lifetime SSL encryption certificate', 'Initial core SEO indexing'] },
          { name: 'Unified E-Commerce Portal', price: 'EGP 34,990', desc: 'Mighty digital store with automated cart recovery multi-tier checkout and seamless shipping synchronicity', features: ['Built-in stripe / Paypal / local gateways', 'Robust courier logs & address maps', 'Dynamic coupon generator', 'Interactive financial reporting'] }
        ],
        btnRequest: 'Deploy Your Web platform Now'
      },
      smm: {
        subtitle: 'Our dedicated performance buyers manage your capital and networks to secure high ROAS and persistent margins',
        networksTitle: 'Active Marketing Networks & Ad Specialties:',
        cards: [
          { name: 'Facebook Campaigns', platform: 'Meta', desc: 'Comprehensive sales funnel architectures targeting high-income users and capturing secure high-intent leads', roas: '4.8x', cost: 'Low Core', color: 'from-blue-600 to-sky-700' },
          { name: 'Instagram Campaigns', platform: 'Meta Visuals', desc: 'Beautiful visual placements lifestyle storytelling and instant checkout loops designed to trigger immediate aesthetic actions', roas: '5.2x', cost: 'Moderate', color: 'from-pink-600 to-purple-600' },
          { name: 'Twitter / X Campaigns', platform: 'X Premium', desc: 'Placements targeting corporate stakeholders and high-net-worth individuals across GCC financial markets', roas: '3.5x', cost: 'Premium Cost', color: 'from-slate-900 to-neutral-800' },
          { name: 'TikTok Campaigns', platform: 'TikTok Video', desc: 'Acoustic user-generated video formulas (UGC) built to break down buyer resistance and cause instant cart-adds', roas: '6.1x', cost: 'Extremely economic', color: 'from-slate-900 via-teal-900 to-black' },
          { name: 'Snapchat Campaigns', platform: 'Snapchat', desc: 'Dynamic face lenses and immersive vertical ads aimed directly at the hyper-active youth demographic inside GCC', roas: '4.5x', cost: 'Moderate', color: 'from-yellow-500 to-amber-600' },
          { name: 'Google Ads Search', platform: 'Google Search', desc: 'Vigilant keywords capture placing your business on top of Google searches exact moment a customer inputs your service', roas: '5.5x', cost: 'Variable', color: 'from-blue-500 via-red-500 to-yellow-500' },
          { name: 'YouTube Campaigns', platform: 'YouTube', desc: 'Cinematic pre-rolls that convey absolute authority establishing trust that pays compounding dividends over decades', roas: '3.9x', cost: 'Moderate-High', color: 'from-red-600 to-rose-700' },
          { name: 'In-App Networks', platform: 'AdMob', desc: 'Ambient native placements inside mobile apps and games keeping your visual trademark active in user subconsciousness', roas: '3.1x', cost: 'Economic', color: 'from-emerald-600 to-teal-700' }
        ],
        btnGetOffer: 'Get a Professional Social Campaign Offer'
      },
      motion: {
        subtitle: 'High-end animation translates complex business systems into elegant easy and persuasive 30-second spectacles',
        playInstruction: 'Click any template below to preview simulated audio timelines and script flows:',
        features: {
          scenarist: 'Copywriting & high-impact narrative planning',
          voiceOver: 'Studio voice-over recorded with matching Arabic or English target accents',
          animation: '2D/3D visual mechanics rendered on standard dynamic frame lines',
          soundEffects: 'Acoustic integration and tailor-made score design'
        },
        bannerPromo: 'Claim 50% Off - Elite Motion Graphic Promo',
        bannerSubtitle: 'We craft high-converting business showcases that establish trust and separate your product from market noise',
        btnClaimMotion: 'Claim 50% Off & Design Video Now'
      },
      photos: {
        intro: 'Product Photography Visual Processing Comparison Studio',
        desc: 'Drag the handle in the center horizontally to compare a standard dark mobile shot (on Left) with our fully illuminated studio treated photo (on Right)',
        beforeTag: 'Raw Mobile Capture',
        afterTag: 'Edited SELECT Studio Treatment',
        importance: 'Why Custom Studio Product Photography is Crucial:',
        p1: 'Processing raw images might feel optional but verified ecommerce data proves that 82% of shoppers decide to buy based on crisp shadow-rendered product aesthetics and clean environments',
        p2: 'We do not just take photos; we configure cinematic light levels correct ambient color balances and render soft micro-shadows that make your products feel alive and extremely tangible',
        btnBookShooting: 'Engage Studio Photography Today'
      }
    }
  };

  const t = textDict[currentLang];

  // Old webpages raw project items for Mock Gallery (Screenshot 2)
  const webDesignPortfolio = [
    {
      id: 1,
      titleAr: 'موقع عيادة أسنان وتجميل غامرة',
      titleEn: 'Flawless Aesthetic Dental Hub',
      descAr: 'تصميم فائق لعيادات الأسنان يدعم حجز مواعيد فوري مع ملفات المرضى المتكاملة',
      descEn: 'Stunning dentist system featuring instant appointments and modern patient profiles',
      pagespeed: '99%',
      conversionRate: '12.4%',
      clientAr: 'عيادات السن الذهبي',
      clientEn: 'Golden Tooth Clinics',
      mockImage: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80',
      category: 'medical',
    },
    {
      id: 2,
      titleAr: 'المملكة للاستثمارات العقارية والمقاولات',
      titleEn: 'Kingdom Prime Real Estate Solutions',
      descAr: 'خرائط عقارية متكاملة وتناغم مذهل للأبراج وعرض الأبعاد بنسبة نقر ممتازة',
      descEn: 'Fully indexed property database containing interactive architectural visuals',
      pagespeed: '98%',
      conversionRate: '8.1%',
      clientAr: 'المملكة للمقاولات',
      clientEn: 'Kingdom Contracting',
      mockImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
      category: 'realestate',
    },
    {
      id: 3,
      titleAr: 'متجر روتانا للبدلات الرجالية والفاخرة',
      titleEn: 'Rotana Premium Sartorial Suit Store',
      descAr: 'متجر تجارة إلكترونية سلس لعرض خطوط الموضة والأقمشة المخصصة للدفع والتعاقد',
      descEn: 'Sleek luxury fashion e-shop engineered with responsive checkout processes',
      pagespeed: '99%',
      conversionRate: '14.8%',
      clientAr: 'روتانا للأقمشة',
      clientEn: 'Rotana Textiles',
      mockImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
      category: 'ecommerce',
    },
    {
      id: 4,
      titleAr: 'منظومة درع البيئة لمكافحة وإبادة الحشرات',
      titleEn: 'EcoShield Pest Elimination Portal',
      descAr: 'صفحة هبوط سريعة جداً تم تصميمها لجلب اتصالات عاجلة لطلبات المكافحة المنزلية',
      descEn: 'Rapid responsive landing page built with custom CTA panels for local leads',
      pagespeed: '100%',
      conversionRate: '19.2%',
      clientAr: 'درع البيئة مصر',
      clientEn: 'EcoShield Egypt',
      mockImage: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80',
      category: 'services',
    },
    {
      id: 5,
      titleAr: 'بوابة فراري لبيع وبوابة تأجير السيارات النادرة',
      titleEn: 'Ferrari Elite Luxury Auto Rental',
      descAr: 'سرد مرئي فريد للسيارات السريعة يدمج الدفع الفوري وتحديد موقع استلام الآلية',
      descEn: 'Aesthetic fluid fleet catalog supporting real-time physical calendar locks',
      pagespeed: '98%',
      conversionRate: '9.3%',
      clientAr: 'فراري السعودية',
      clientEn: 'Ferrari Saudi',
      mockImage: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80',
      category: 'ecommerce',
    },
    {
      id: 6,
      titleAr: 'متجر مائدتي للأثاث وقطع الديكور والرخام',
      titleEn: 'Maedati Luxury Furniture & Marble Emporium',
      descAr: 'تصميم بوهيمي راقي يعرض القطع الفاخرة للقصور والفلل مع حساب تكلفة النقل الدقيق',
      descEn: 'Stunning minimalist design store displaying hand-crafted luxury furniture lines',
      pagespeed: '99%',
      conversionRate: '11.1%',
      clientAr: 'أثاث مائدتي',
      clientEn: 'Maedati Furniture',
      mockImage: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80',
      category: 'ecommerce',
    }
  ];

  // Animated / Motion videos Mock Portfolio (Screenshot 4)
  const motionVideos = [
    {
      id: 1, 
      titleAr: 'فيديو ترويجي لشركة فاست للشحن اللوجستي', 
      titleEn: 'Fast Logistics Animated Brand Video',
      duration: '0:45',
      scriptAr: 'مستعد تبسط لعملائك خدمة شحنك؟ موشن جرافيك يظهر شبكة التوصيل المتكاملة وسرعة التوفير والأسعار المنافسة',
      scriptEn: 'Ready to simplify your dispatch services Explaining complex routing networks and fleet operations in under 45 seconds',
      voiceOverAr: 'نبرة تفاعلية بحماس دافئ وعالي',
      voiceOverEn: 'Upbeat corporate narrative with punchy sound design',
      likes: '1.2k',
      thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 2, 
      titleAr: 'فيديو لعيادة رويال الطبية وجذب حجوزات طبيب الأسنان', 
      titleEn: 'Royal Dental Center Booking Booster Video',
      duration: '1:00',
      scriptAr: 'ابتسامة صحيحة بدون خوف محاكاة كرتونية لخطوات العلاج الرقيقة وشرح كفاءة التعقيم لإقناع المريض القلق',
      scriptEn: 'A healthy smile without fear Cozy illustration displaying ultra-gentle dental actions and automated booking links',
      voiceOverAr: 'صوت طبيب دافئ وهادئ وموثوق',
      voiceOverEn: 'Soothing professional tone conveying safety and hygiene',
      likes: '942',
      thumbnail: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 3, 
      titleAr: 'إعلان موشن جرافيك لتطبيق سكن لبيع وشراء العقار', 
      titleEn: 'Sakan Mobile App Feature Explainer',
      duration: '0:30',
      scriptAr: 'كيف تلاقي بيت أحلامك بلمسة واحدة؟ شرح رحلة تصفح وتحديد الموقع وشات مباشر مع الوسيط من داخل التطبيق',
      scriptEn: 'How to discover your future house in one tap Displaying filter features and localized secure property searches',
      voiceOverAr: 'لهجة خليجية بيعية مفعمة بالحيوية والذكاء',
      voiceOverEn: 'Warm dialect narrative optimized for active Gulf markets',
      likes: '2.1k',
      thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 4, 
      titleAr: 'فيديو أتمتة لمكتب الاتحاد للمقاولات والمشاريع الكبرى', 
      titleEn: 'Union Construction Engineering Portfolio Motion',
      duration: '1:15',
      scriptAr: 'أقوى هيكل خرساني ومقاييس حماية فائقة وثائقي موشن جرافيك للآليات الثقيلة وحجم المشاريع السكنية المكتملة',
      scriptEn: 'Exceptional structural safety Elegant infographics tracking mechanical scales and completed commercial milestones',
      voiceOverAr: 'نبرة رسمية وقورة تظهر الضخامة والأمان',
      voiceOverEn: 'Commanding theatrical voice depicting power and reliability',
      likes: '811',
      thumbnail: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const handleDrag = (e: any) => {
    if (!isSliding) return;
    const container = document.getElementById('before-after-container');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const executeTabScroll = () => {
    if (setActiveTab) {
      setActiveTab('contact');
      setTimeout(() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const getPlatformLogo = (platform: string) => {
    switch (platform) {
      case 'Meta': // Meta (formerly Facebook)
        return (
          <img src="/logos/meta.png" alt="Meta" className="w-5.5 h-5.5 shrink-0 object-contain" />
        );
      case 'Meta Visuals': // Instagram
        return (
          <img src="/logos/instagram.png" alt="Instagram" className="w-5 h-5 shrink-0 object-contain" />
        );
      case 'X Premium': // X (formerly Twitter)
        return (
          <svg className="w-4 h-4 shrink-0 text-black" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case 'TikTok Video': // TikTok
        return (
          <img src="/logos/tiktok.png" alt="TikTok" className="w-5 h-5 shrink-0 object-contain" />
        );
      case 'Snapchat': // Snapchat
        return (
          <img src="/logos/snapchat.png" alt="Snapchat" className="w-5.5 h-5.5 shrink-0 object-contain" />
        );
      case 'Google Search': // Google Ads
        return (
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
        );
      case 'YouTube': // YouTube
        return (
          <svg className="w-4 h-4 shrink-0 text-[#FF0000]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'AdMob': // AdMob
        return (
          <svg className="w-4 h-4 shrink-0 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
            <line x1="12" y1="18" x2="12.01" y2="18"/>
            <circle cx="12" cy="10" r="3" fill="currentColor" fillOpacity="0.2"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section id="showcase-hub" className="py-24 bg-transparent border-t border-slate-900 relative overflow-hidden">
      {/* Visual background flares - Optimized without blurs */}
      <div className="absolute top-1/4 left-10 w-[300px] h-[300px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)' }} />
      <div className="absolute bottom-1/4 right-10 w-[250px] h-[250px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(234,179,8,0.08) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Modern Header section with visual badge */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 
            className="text-3xl md:text-5xl font-black tracking-tight mb-4 leading-relaxed font-sans drop-shadow-md text-transparent bg-clip-text py-2"
            style={{
              backgroundImage: 'linear-gradient(90deg, #9d027c, #f43f5e, #ffbc01, #f43f5e, #9d027c)',
              backgroundSize: '200% auto',
              animation: 'gradient-melt 4s linear infinite'
            }}
          >
            {t.sectionTitle}
          </h2>
          <p className="text-sm text-slate-400 max-w-3xl mx-auto font-sans leading-relaxed">
            {t.sectionSubtitle}
          </p>
        </div>

        {/* Dynamic 5-Department navigation tags row */}
        <div className="flex overflow-x-auto hide-scrollbar sm:flex-wrap sm:justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 pb-2 px-1 -mx-4 sm:mx-0 snap-x">
          {Object.keys(t.tabs).map((tabKey) => {
            const isTabActive = activeShowcaseSection === tabKey;
            const tabLabel = (t.tabs as any)[tabKey];
            
            // Icon assignment based on tab key
            let tabIcon = <Sparkles className="w-4 h-4 shrink-0" />;
            if (tabKey === 'branding') tabIcon = <Award className="w-4 h-4 shrink-0" />;
            if (tabKey === 'web') tabIcon = <Laptop className="w-4 h-4 shrink-0" />;
            if (tabKey === 'smm') tabIcon = <Megaphone className="w-4 h-4 shrink-0" />;
            if (tabKey === 'motion') tabIcon = <Video className="w-4 h-4 shrink-0" />;
            if (tabKey === 'photos') tabIcon = <Camera className="w-4 h-4 shrink-0" />;

            return (
              <button
                key={tabKey}
                onClick={() => {
                  setActiveShowcaseSection(tabKey as any);
                  // stop video on tab swap
                  setIsPlaying(false);
                  setActiveVideo(null);
                }}
                className={`shrink-0 snap-start flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs font-bold transition-all duration-300 pointer-events-auto cursor-pointer border ${
                  isTabActive
                    ? 'bg-yellow-400 text-slate-950 border-yellow-400 shadow-lg shadow-yellow-400/10'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-850'
                }`}
              >
                {tabIcon}
                <span className="whitespace-nowrap">{tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Tab viewport displaying exact screenshots items */}
        <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-4 sm:p-6 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-sm">
          <AnimatePresence mode="wait">
            
            {/* BRANDING IDENTITY TAB */}
            {activeShowcaseSection === 'branding' && (
              <motion.div
                key="branding"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
              >
                {/* Visual Identity Details */}
                <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-2 leading-tight">
                      {t.branding.intro}
                    </h3>
                    <p className="text-sm text-slate-300 font-sans leading-relaxed">
                      {t.branding.introDesc}
                    </p>
                  </div>

                  <div className="border-t border-slate-800/80 pt-5 sm:pt-6">
                    <h4 className="text-sm font-mono tracking-wider font-bold text-slate-200 mb-4 uppercase">
                      {t.branding.whyTitle}
                    </h4>
                    {/* Horizontal scroll on mobile for cards */}
                    <div className="flex overflow-x-auto hide-scrollbar sm:grid sm:grid-cols-2 gap-3 sm:gap-4 pb-4 sm:pb-0 snap-x">
                      {t.branding.whyItems.map((item, id) => (
                        <div key={id} className="min-w-[240px] sm:min-w-0 snap-start p-4 bg-slate-950/60 border border-slate-850 rounded-2xl flex flex-col gap-2 hover:border-yellow-400/20 transition-colors">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-yellow-400 shrink-0" />
                            <span className="text-xs font-bold text-slate-200">{item.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Construction step by step (Screenshot 1 bottom right list) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col gap-5">
                    <h4 className="text-xs font-mono font-bold text-slate-400 tracking-wider uppercase border-b border-slate-850 pb-2">
                      {t.branding.howTitle}
                    </h4>
                    
                    <div className="flex flex-col gap-4">
                      {t.branding.howSteps.map((step) => (
                        <div key={step.num} className="flex gap-4">
                          <span className="font-mono text-xs font-extrabold text-yellow-400 bg-yellow-400/5 px-2 py-1 rounded h-fit">
                            {step.num}
                          </span>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-200">{step.title}</span>
                            <span className="text-[11px] text-slate-400 font-sans leading-relaxed mt-1">{step.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={executeTabScroll}
                      className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5"
                    >
                      <span>{t.branding.claimAction}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* WEB DESIGN SAMPLES GRID TAB */}
            {activeShowcaseSection === 'web' && (
              <motion.div
                key="web"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-10"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                    <h3 className="text-xl sm:text-2xl font-bold text-emerald-400">
                      {t.web.intro}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 font-sans max-w-2xl">
                    {t.web.desc}
                  </p>
                </div>

                {/* Grid of Portfolio (Screenshot 2 style) */}
                <div className="flex overflow-x-auto hide-scrollbar sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-4 sm:pb-0 snap-x">
                  {webDesignPortfolio.map((item) => {
                    const title = currentLang === 'ar' ? item.titleAr : item.titleEn;
                    const desc = currentLang === 'ar' ? item.descAr : item.descEn;
                    const client = currentLang === 'ar' ? item.clientAr : item.clientEn;

                    return (
                      <div 
                        key={item.id}
                        className="min-w-[280px] sm:min-w-0 snap-start group bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between"
                      >
                        <div className="relative aspect-video overflow-hidden">
                          <img 
                            src={item.mockImage} 
                            alt={title} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                            <button
                              onClick={() => setActiveWebsitePreview(item)}
                              className="px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-emerald-400 transition-colors pointer-events-auto cursor-pointer"
                            >
                              {currentLang === 'ar' ? 'تصفح هذا الموقع' : 'Browse This Site'}
                            </button>
                          </div>
                          
                          <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-slate-800 text-[9px] font-mono text-emerald-400">
                            Pagespeed: {item.pagespeed}
                          </div>
                        </div>

                        <div className="p-4 sm:p-5 flex flex-col gap-2 sm:gap-3">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">{client}</span>
                            <span className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800 font-sans">
                              {item.category.toUpperCase()}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
                            {title}
                          </h4>
                          <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed font-sans">
                            {desc}
                          </p>
                        </div>

                        <div className="px-4 sm:px-5 py-3 sm:py-3.5 bg-slate-900/40 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-slate-500">{currentLang === 'ar' ? 'نسبة التحويل المتوقعة:' : 'Conv Rate:'}</span>
                          <span className="text-emerald-400 font-bold">{item.conversionRate}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Sub-section: Packaging Prices plans from client screenshots */}
                <div className="border-t border-slate-800/60 pt-6 sm:pt-10 mt-4">
                  <h4 className="text-sm font-semibold text-slate-200 text-center mb-6 sm:mb-8">
                    {t.web.plansTitle}
                  </h4>
                  <div className="flex overflow-x-auto hide-scrollbar sm:grid sm:grid-cols-3 gap-4 sm:gap-6 pb-4 sm:pb-0 snap-x">
                    {t.web.mockPlans.map((plan, index) => (
                      <div 
                        key={index} 
                        className={`min-w-[260px] sm:min-w-0 snap-start p-5 sm:p-6 rounded-2xl border flex flex-col justify-between ${
                          index === 1 
                            ? 'bg-slate-950 border-emerald-500/20 shadow-xl shadow-emerald-500/5' 
                            : 'bg-slate-950/40 border-slate-850'
                        }`}
                      >
                        <div className="flex flex-col gap-3">
                          <span className="text-xs font-bold text-slate-100">{plan.name}</span>
                          <span className="text-xl font-bold text-emerald-400 font-mono">{plan.price}</span>
                          <p className="text-[11px] text-slate-400 font-sans leading-relaxed border-b border-slate-905 pb-3 border-opacity-30">
                            {plan.desc}
                          </p>
                          <ul className="flex flex-col gap-2 text-[10px] text-slate-300 font-sans pt-1">
                            {plan.features.map((feat, i) => (
                              <li key={i} className="flex items-center gap-1.5">
                                <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <button 
                          onClick={executeTabScroll}
                          className="w-full mt-6 py-2 border border-slate-800 hover:border-emerald-500 hover:text-emerald-400 text-slate-400 rounded-lg text-[10px] font-bold transition-all"
                        >
                          {t.web.btnRequest}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* SOCIAL MEDIA NETWORK AD CARDS TAB */}
            {activeShowcaseSection === 'smm' && (
              <motion.div
                key="smm"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-8"
              >
                <div className="max-w-3xl">
                  <h3 className="text-xl sm:text-2xl font-bold text-blue-400 mb-2">
                    {currentLang === 'ar' ? 'إعلانات على مواقع التواصل الاجتماعي وبوابات النمو' : 'Social Platforms Digital campaigns'}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {t.smm.subtitle}
                  </p>
                </div>

                {/* Network Cards Grid (Screenshot 3 style) */}
                <div className="flex overflow-x-auto hide-scrollbar sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pb-4 sm:pb-0 snap-x">
                  {t.smm.cards.map((card, idx) => (
                    <div 
                      key={idx}
                      className="min-w-[260px] sm:min-w-0 snap-start group bg-slate-950 border border-slate-850 rounded-2xl p-4 sm:p-5 hover:border-blue-500/35 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="flex flex-col gap-3 sm:gap-4">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-900 border border-slate-850 shadow-inner shrink-0">
                              {getPlatformLogo(card.platform)}
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 font-sans">
                              {card.platform}
                            </span>
                          </div>

                        </div>
                        <h4 className="text-xs font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                          {card.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-sans leading-relaxed min-h-[40px] sm:min-h-[50px]">
                          {card.desc}
                        </p>
                      </div>

                      <div className="border-t border-slate-900/60 pt-3 mt-3 flex items-center justify-between text-[10px]">
                        <span className="text-slate-500">{currentLang === 'ar' ? 'التكلفة الاستيعابية:' : 'Avg Cost:'}</span>
                        <span className="text-slate-300 font-bold font-sans">{card.cost}</span>
                      </div>

                      <button 
                        onClick={executeTabScroll}
                        className="w-full mt-4 py-2 bg-blue-600/10 hover:bg-blue-600 hover:text-white text-blue-400 text-[10px] font-bold rounded-lg border border-blue-900/30 transition-all pointer-events-auto cursor-pointer"
                      >
                        {currentLang === 'ar' ? 'احصل على عرض سعر الآن' : 'Get Proposal'}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CINEMATIC MOTION GRAPHICS TAB */}
            {activeShowcaseSection === 'motion' && (
              <motion.div
                key="motion"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12"
              >
                
                {/* Simulated interactive player viewport */}
                <div className="lg:col-span-7 flex flex-col gap-5">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-purple-400 mb-1">
                      {currentLang === 'ar' ? 'محرر محاكاة الموشن جرافيك والمونتاج' : 'Digital motion explainer editor showcase'}
                    </h3>
                    <p className="text-xs text-slate-400 font-sans">
                      {t.motion.playInstruction}
                    </p>
                  </div>

                  {/* Interactive simulated player layout (Screen 4 reference, with realistic buttons) */}
                  <div className="relative aspect-video bg-black rounded-3xl border border-slate-800 overflow-hidden flex flex-col justify-between group shadow-xl">
                    
                    {/* Render matching background corresponding to active video */}
                    {activeVideo !== null ? (
                      <div className="absolute inset-0">
                        <img 
                          src={motionVideos[activeVideo].thumbnail} 
                          alt="Video Showcase" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover filter brightness-50"
                        />
                        {/* Audio animated waveform when "playing" */}
                        {isPlaying && (
                          <div className="absolute bottom-16 right-5 flex items-end gap-0.5 h-6">
                            {[1, 2, 3, 4, 3, 2, 4, 5, 3, 4, 2, 1, 3, 5, 2].map((i) => (
                              <motion.span 
                                key={i} 
                                className="w-[1.5px] bg-purple-400 rounded-full"
                                animate={{ height: [4, i * 6, 4] }}
                                transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.4 }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950">
                        <Video className="w-10 h-10 text-slate-700 mb-2 animate-bounce" />
                        <span className="text-xs font-bold text-slate-300">{currentLang === 'ar' ? 'حدد مسودة عمل بالأسفل لتشغيل العرض التفاعلي' : 'Choose a layout template below to preview'}</span>
                      </div>
                    )}

                    {/* Upper overlay strip */}
                    <div className="absolute top-0 inset-x-0 p-3 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>{activeVideo !== null ? motionVideos[activeVideo].titleAr : 'SC_MOTION_RENDERER'}</span>
                      <span>{activeVideo !== null ? `00:${videoTimer}` : '0:00'}</span>
                    </div>

                    {/* Middle big play button indicator */}
                    {activeVideo !== null && !isPlaying && (
                      <button 
                        onClick={() => {
                          setIsPlaying(true);
                          // simulate a simple audio countdown timer
                          const interval = setInterval(() => {
                            setVideoTimer((prev) => (prev > 0 ? prev - 1 : 12));
                          }, 1000);
                          return () => clearInterval(interval);
                        }}
                        className="absolute inset-0 m-auto w-14 h-14 bg-purple-500 text-slate-950 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20 hover:scale-110 hover:bg-purple-400 transition-all pointer-events-auto cursor-pointer z-20"
                      >
                        <Play className="w-6 h-6 fill-slate-950 ml-1" />
                      </button>
                    )}

                    {/* Bottom overlay controls */}
                    <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between z-10">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setIsPlaying(!isPlaying)}
                          disabled={activeVideo === null}
                          className="p-1 px-2.5 bg-slate-900 border border-slate-800 rounded text-[9px] font-mono text-slate-300 hover:text-white"
                        >
                          {isPlaying ? 'PAUSE' : 'PLAY'}
                        </button>
                        <button 
                          onClick={() => setIsMuted(!isMuted)}
                          disabled={activeVideo === null}
                          className="p-1 bg-slate-900 border border-slate-800 rounded text-slate-300 hover:text-white"
                        >
                          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="h-1 flex-1 mx-6 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 transition-all duration-1000" 
                          style={{ width: activeVideo !== null ? `${((12 - videoTimer) / 12) * 100}%` : '0%' }}
                        />
                      </div>

                      <span className="text-[10px] text-slate-400 font-mono">
                        {activeVideo !== null ? motionVideos[activeVideo].duration : '00:00'}
                      </span>
                    </div>
                  </div>

                  {/* Subtitle / Timeline simulation content from client screenshots */}
                  {activeVideo !== null && (
                    <motion.div 
                      className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="flex items-center gap-1.5 text-xs text-purple-400 font-bold">
                        <Layers className="w-3.5 h-3.5" />
                        <span>{currentLang === 'ar' ? 'السيناريو المرسل للشرح والتعليق الصوتي:' : 'Target voice script flow:'}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                        {currentLang === 'ar' ? motionVideos[activeVideo].scriptAr : motionVideos[activeVideo].scriptEn}
                      </p>
                      <div className="border-t border-slate-900 pt-2.5 mt-1 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-500">{currentLang === 'ar' ? 'نبرة التسجيل المعتمدة:' : 'Acoustic Tone:'}</span>
                        <span className="text-purple-400">{currentLang === 'ar' ? motionVideos[activeVideo].voiceOverAr : motionVideos[activeVideo].voiceOverEn}</span>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Left side list of motion videos and claim offer */}
                <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
                  
                  {/* Selectors */}
                  <div className="flex flex-col gap-3">
                    {motionVideos.map((video, idx) => (
                      <button
                        key={video.id}
                        onClick={() => {
                          setActiveVideo(idx);
                          setIsPlaying(true);
                          setVideoTimer(12);
                        }}
                        className={`p-3.5 rounded-xl border flex items-center justify-between text-right leading-relaxed transition-all duration-300 relative ${
                          activeVideo === idx
                            ? 'bg-purple-950/20 border-purple-500/40 text-purple-400'
                            : 'bg-slate-950 border-slate-850 hover:border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 text-right">
                          <Play className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span className="text-[11px] font-bold text-slate-100 font-sans line-clamp-1">
                            {currentLang === 'ar' ? video.titleAr : video.titleEn}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">{video.duration}</span>
                      </button>
                    ))}
                  </div>

                  {/* Banner claim corresponding to Screenshot 4 bottom offer */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-yellow-400/10 via-amber-400/5 to-transparent border border-yellow-400/20 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-yellow-400 text-slate-950 text-[9px] font-extrabold uppercase rounded font-mono">
                        PROMO 50%
                      </span>
                      <h4 className="text-xs font-bold text-yellow-400">
                        {t.motion.bannerPromo}
                      </h4>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                      {t.motion.bannerSubtitle}
                    </p>
                    <button 
                      onClick={executeTabScroll}
                      className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold text-[10px] rounded-lg transition-all"
                    >
                      {t.motion.btnClaimMotion}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* PRODUCT PHOTOGRAPHY INTERACTIVE CONTAINER */}
            {activeShowcaseSection === 'photos' && (
              <motion.div
                key="photos"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
              >
                
                {/* Drag-based Before/After Slider Mockup (High visual asset processing, Screenshot 5) */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  <div className="flex flex-col">
                    <h3 className="text-xl font-extrabold text-slate-100 mb-2 leading-snug font-sans">
                      {t.photos.intro}
                    </h3>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                      {t.photos.desc}
                    </p>
                  </div>

                  {/* Before/After comparison box */}
                  <div 
                    id="before-after-container"
                    onMouseMove={handleDrag}
                    onTouchMove={handleDrag}
                    onMouseDown={() => setIsSliding(true)}
                    onTouchStart={() => setIsSliding(true)}
                    onMouseUp={() => setIsSliding(false)}
                    onTouchEnd={() => setIsSliding(false)}
                    onMouseLeave={() => setIsSliding(false)}
                    className="relative aspect-video rounded-2xl border border-slate-850 overflow-hidden cursor-ew-resize select-none shadow-2xl bg-slate-950 group"
                  >
                    
                    {/* Professional Studio edited (After) */}
                    <div className="absolute inset-0">
                      <img 
                        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80" 
                        alt="Edited Professional footwear" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover filter saturate-105 contrast-105 shadow-inner pointer-events-none select-none"
                        draggable={false}
                      />
                      <div className="absolute bottom-4 right-4 bg-slate-950/75 backdrop-blur-md text-white border border-[#9d027c]/20 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wide z-10 flex items-center gap-1.5 shadow-lg select-none font-sans">
                        <Sparkles className="w-3.5 h-3.5 text-[#9d027c] shrink-0" />
                        <span>{t.photos.afterTag}</span>
                      </div>
                    </div>

                    {/* Raw mobile shot (Before) clipped by sliderPosition state */}
                    <div 
                      className="absolute inset-0"
                      style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=60" 
                        alt="Raw Mobile capturing" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover filter brightness-50 contrast-75 saturate-100 pointer-events-none select-none"
                        draggable={false}
                      />
                      <div className="absolute bottom-4 left-4 bg-slate-950/75 backdrop-blur-md text-white border border-white/10 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wide z-10 flex items-center gap-1.5 shadow-lg select-none font-sans">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                        <span>{t.photos.beforeTag}</span>
                      </div>
                    </div>

                    {/* Sliding drag line separator */}
                    <div 
                      className="absolute inset-y-0 w-[3px] bg-gradient-to-b from-[#9d027c]/30 via-[#9d027c] to-[#9d027c]/30 pointer-events-none shadow-[0_0_8px_rgba(157,2,124,0.5)]"
                      style={{ left: `${sliderPosition}%` }}
                    />

                    {/* Sliding drag handle */}
                    <div 
                      className="absolute inset-y-0 flex items-center justify-center pointer-events-none transition-all duration-200"
                      style={{ left: `calc(${sliderPosition}% - 20px)`, width: '40px' }}
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-950/90 border-2 border-[#9d027c] shadow-[0_0_15px_rgba(157,2,124,0.5)] flex items-center justify-center backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
                        <div className="flex items-center gap-0.5 text-[#9d027c]">
                          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product photography descriptions from Screenshot 5 details */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-850 flex flex-col gap-4">
                    <h4 className="text-xs font-sans font-bold text-slate-400 tracking-wider uppercase border-b border-slate-850 pb-2 leading-relaxed">
                      {t.photos.importance}
                    </h4>
                    
                    <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                      {t.photos.p1}
                    </p>

                    <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                      {t.photos.p2}
                    </p>

                    <button 
                      onClick={executeTabScroll}
                      className="w-full mt-2 py-3 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 pointer-events-auto cursor-pointer font-sans"
                    >
                      <Camera className="w-4 h-4 shrink-0" />
                      <span>{t.photos.btnBookShooting}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* Website Preview Live Simulation Dialog */}
      {activeWebsitePreview && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div 
            className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[80vh]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {/* Mock browser header bar */}
            <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span className="w-3 h-3 bg-emerald-500 rounded-full" />
                <div className="ml-4 bg-slate-900 border border-slate-800/80 rounded px-3 py-0.5 text-[10px] font-mono text-slate-400 whitespace-nowrap overflow-hidden max-w-md">
                  https://selectcustomers.com/demo/web-hub/{activeWebsitePreview.id}
                </div>
              </div>
              <button 
                onClick={() => setActiveWebsitePreview(null)}
                className="text-xs font-mono font-bold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1 rounded"
              >
                CLOSE [X]
              </button>
            </div>

            {/* Preview Frame content */}
            <div className="flex-1 bg-slate-950 relative overflow-hidden flex flex-col justify-between p-6 overflow-y-auto">
              <div>
                <span className="px-2 py-0.5 bg-emerald-400 text-slate-950 text-[9px] font-extrabold uppercase rounded font-mono">
                  DEMO BRAND VISUALIZER
                </span>
                <h3 className="text-xl font-bold text-slate-100 mt-2 mb-3">
                  {currentLang === 'ar' ? activeWebsitePreview.titleAr : activeWebsitePreview.titleEn}
                </h3>
                <p className="text-xs text-slate-300 font-sans leading-relaxed max-w-2xl mb-6">
                  {currentLang === 'ar' ? activeWebsitePreview.descAr : activeWebsitePreview.descEn}
                </p>

                {/* Large aesthetic screen preview mockup graphics */}
                <div className="aspect-video w-full rounded-2xl border border-slate-850 bg-slate-900 relative overflow-hidden flex flex-col justify-between p-4">
                  <div className="flex justify-between items-center bg-slate-950/80 p-2.5 rounded-lg border border-slate-850">
                    <span className="text-xs font-bold text-slate-200">LOGO DEMO</span>
                    <div className="flex gap-3 text-[9px] text-slate-400 font-medium">
                      <span>Home</span>
                      <span>Services</span>
                      <span>Contact</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 p-4 items-center text-center">
                    <span className="text-lg sm:text-xl font-bold text-slate-100 uppercase tracking-tight">
                      {currentLang === 'ar' ? 'البوابة المهيأة للتحويل' : 'PREMIUM FUNNEL'}
                    </span>
                    <p className="text-[10px] text-slate-400 max-w-sm">
                      {currentLang === 'ar' ? 'صفحة برمجية فائقة الأداء مسلحة بأعلى تكتيكات الاستقطاب والتتبع والبرق الرقمي' : 'Uncompromising performance structures keeping page index scores near 100% on google'}
                    </p>
                    <button className="px-4 py-1.5 bg-emerald-400 text-slate-950 text-[10px] font-extrabold rounded-full mt-2">
                      {currentLang === 'ar' ? 'اتصل بمندوبنا الآني' : 'CONNECT CLOUD'}
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((cardId) => (
                      <div key={cardId} className="bg-slate-950/70 p-2 rounded border border-slate-850 text-center">
                        <span className="text-[9px] block text-slate-400 font-mono">CORE_VITALS_0{cardId}</span>
                        <span className="text-[11px] font-bold text-emerald-400 font-mono">99%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Call action */}
              <div className="border-t border-slate-800 pt-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-400 font-sans">
                  {currentLang === 'ar' ? 'أعجبك هذا العمل؟ اطلب نسختك المخصصة الآن' : 'Impressed with this interface Launch yours now'}
                </span>
                <button
                  onClick={() => {
                    setActiveWebsitePreview(null);
                    executeTabScroll();
                  }}
                  className="px-6 py-2.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl"
                >
                  {currentLang === 'ar' ? 'اطلب موقعك ومستشارك الفني الآن' : 'Initiate Launch Order'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </section>
  );
}
