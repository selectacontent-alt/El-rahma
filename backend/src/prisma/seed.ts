import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const seedPassword = process.env.ADMIN_PASSWORD || 'ChangeMeAdmin123!';
  if (process.env.NODE_ENV === 'production' && !process.env.ADMIN_PASSWORD) {
    throw new Error('ADMIN_PASSWORD is required when seeding production');
  }
  const adminPassword = await bcrypt.hash(seedPassword, 12);
  const adminUpdate = process.env.ADMIN_PASSWORD
    ? {
        password: adminPassword,
        mustChangePassword: true,
        passwordUpdatedAt: new Date(),
        isActive: true,
      }
    : {
        isActive: true,
      };

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: adminUpdate,
    create: {
      username: 'admin',
      password: adminPassword,
      role: 'admin',
      mustChangePassword: true,
      passwordUpdatedAt: new Date(),
    },
  });

  const services = [
    { titleAr: 'تصميم المواقع', titleEn: 'Web Design', descAr: 'نصمم مواقع احترافية متجاوبة مع جميع الأجهزة باستخدام أحدث التقنيات', descEn: 'We design professional responsive websites using the latest technologies', icon: 'Globe', price: 1500, order: 1 },
    { titleAr: 'التسويق الإلكتروني', titleEn: 'Digital Marketing', descAr: 'استراتيجيات تسويق متكاملة لزيادة وصولك لجمهورك المستهدف', descEn: 'Integrated marketing strategies to increase your reach to target audience', icon: 'Megaphone', price: 2000, order: 2 },
    { titleAr: 'تحسين محركات البحث', titleEn: 'SEO Optimization', descAr: 'رفع ترتيب موقعك في محركات البحث وجذب زوار عضويين', descEn: 'Boost your site ranking in search engines and attract organic visitors', icon: 'Search', price: 1200, order: 3 },
    { titleAr: 'إدارة السوشيال ميديا', titleEn: 'Social Media Management', descAr: 'إدارة احترافية لحسابات التواصل الاجتماعي مع محتوى مميز', descEn: 'Professional social media accounts management with premium content', icon: 'Share2', price: 1800, order: 4 },
    { titleAr: 'تصميم الجرافيك', titleEn: 'Graphic Design', descAr: 'تصاميم إبداعية للهوية البصرية والمطبوعات والمواد التسويقية', descEn: 'Creative designs for visual identity, prints and marketing materials', icon: 'Palette', price: 800, order: 5 },
    { titleAr: 'تطوير التطبيقات', titleEn: 'App Development', descAr: 'بناء تطبيقات موبايل عالية الأداء لنظامي iOS و Android', descEn: 'Build high-performance mobile apps for iOS and Android', icon: 'Smartphone', price: 3000, order: 6 },
  ];

  // Match existing rows by their stable English title while moving the old
  // order-based seed to public, unique slugs. This makes db push + seed safe
  // for databases that already contain the original six service records.
  const serviceEnhancements: Record<string, {
    slug: string;
    goalKeys: string[];
    theme: string;
    destinationType: 'dynamic' | 'internal';
    internalPath: string | null;
  }> = {
    'Web Design': {
      slug: 'web-design',
      goalKeys: ['platform', 'sales'],
      theme: 'ocean',
      destinationType: 'internal',
      internalPath: '/software',
    },
    'Digital Marketing': {
      slug: 'digital-marketing',
      goalKeys: ['sales', 'brand'],
      theme: 'gold',
      destinationType: 'internal',
      internalPath: '/social',
    },
    'SEO Optimization': {
      slug: 'seo-optimization',
      goalKeys: ['sales'],
      theme: 'forest',
      destinationType: 'dynamic',
      internalPath: null,
    },
    'Social Media Management': {
      slug: 'social-media-management',
      goalKeys: ['content', 'brand'],
      theme: 'rose',
      destinationType: 'internal',
      internalPath: '/social',
    },
    'Graphic Design': {
      slug: 'graphic-design',
      goalKeys: ['brand', 'content'],
      theme: 'plum',
      destinationType: 'internal',
      internalPath: '/branding',
    },
    'App Development': {
      slug: 'app-development',
      goalKeys: ['platform', 'automation'],
      theme: 'violet',
      destinationType: 'internal',
      internalPath: '/software',
    },
  };

  for (const service of services) {
    const enhancement = serviceEnhancements[service.titleEn];
    const data = {
      ...service,
      ...enhancement,
      detailsAr: service.descAr,
      detailsEn: service.descEn,
      features: null,
      image: null,
      goalKeys: JSON.stringify(enhancement.goalKeys),
    };
    const existing = await prisma.service.findFirst({
      where: {
        OR: [
          { slug: enhancement.slug },
          { titleEn: service.titleEn },
        ],
      },
      orderBy: { id: 'asc' },
    });

    if (existing) {
      // Only upgrade a legacy row that has not been assigned a public slug.
      // Once an admin has a slug/configuration, seed must never overwrite it.
      if (!existing.slug) {
        await prisma.service.update({ where: { id: existing.id }, data });
      }
    } else {
      await prisma.service.create({ data });
    }
  }

  const translations = [
    { key: 'nav.home', ar: 'الرئيسية', en: 'Home' },
    { key: 'nav.services', ar: 'الخدمات', en: 'Services' },
    { key: 'nav.portfolio', ar: 'أعمالنا', en: 'Portfolio' },
    { key: 'nav.about', ar: 'من نحن', en: 'About' },
    { key: 'nav.contact', ar: 'تواصل معنا', en: 'Contact' },
    { key: 'nav.dashboard', ar: 'لوحة التحكم', en: 'Dashboard' },
    { key: 'nav.login', ar: 'تسجيل الدخول', en: 'Login' },
    { key: 'hero.title', ar: 'وكالتك الرقمية المتكاملة', en: 'Your Integrated Digital Agency' },
    { key: 'hero.subtitle', ar: 'نحوّل أفكارك إلى واقع رقمي متميز', en: 'We turn your ideas into a distinguished digital reality' },
    { key: 'hero.cta', ar: 'انضم إلينا', en: 'Join Us' },
    { key: 'services.title', ar: 'خدماتنا', en: 'Our Services' },
    { key: 'services.subtitle', ar: 'نقدم مجموعة متكاملة من الخدمات الرقمية', en: 'We offer a comprehensive range of digital services' },
    { key: 'offer.title', ar: 'خصم 50% على أول طلب', en: '50% Off Your First Order' },
    { key: 'offer.subtitle', ar: 'احصل على خصم نصف السعر على أي خدمة كعميل جديد', en: 'Get half price on any service as a new client' },
    { key: 'offer.cta', ar: 'اطلب الآن', en: 'Order Now' },
    { key: 'partners.title', ar: 'شركاؤنا', en: 'Our Partners' },
    { key: 'stats.clients', ar: 'عميل', en: 'Clients' },
    { key: 'stats.projects', ar: 'مشروع', en: 'Projects' },
    { key: 'stats.years', ar: 'سنوات خبرة', en: 'Years Experience' },
    { key: 'stats.reviews', ar: 'تقييم', en: 'Reviews' },
    { key: 'testimonials.title', ar: 'ماذا قالوا عنا', en: 'What They Said' },
    { key: 'cta.title', ar: 'مستعد لبدء مشروعك؟', en: 'Ready to Start Your Project?' },
    { key: 'cta.subtitle', ar: 'تواصل معنا اليوم واحصل على استشارة مجانية', en: 'Contact us today for a free consultation' },
    { key: 'cta.button', ar: 'احجز الآن', en: 'Book Now' },
    { key: 'footer.rights', ar: 'جميع الحقوق محفوظة', en: 'All Rights Reserved' },
    { key: 'contact.title', ar: 'تواصل معنا', en: 'Contact Us' },
    { key: 'contact.name', ar: 'الاسم', en: 'Name' },
    { key: 'contact.email', ar: 'البريد الإلكتروني', en: 'Email' },
    { key: 'contact.phone', ar: 'رقم الهاتف', en: 'Phone' },
    { key: 'contact.message', ar: 'الرسالة', en: 'Message' },
    { key: 'contact.send', ar: 'إرسال', en: 'Send' },
    { key: 'contact.address', ar: 'القاهرة، مصر', en: 'Cairo, Egypt' },
    { key: 'about.title', ar: 'من نحن', en: 'About Us' },
    { key: 'about.story', ar: 'نحن وكالة تسويق رقمية متخصصة في تقديم حلول مبتكرة', en: 'We are a digital marketing agency specialized in providing innovative solutions' },
    { key: 'portfolio.title', ar: 'أعمالنا', en: 'Our Portfolio' },
    { key: 'dashboard.title', ar: 'لوحة التحكم', en: 'Dashboard' },
  ];

  for (const t of translations) {
    await prisma.translation.upsert({
      where: { key: t.key },
      update: {},
      create: t,
    });
  }

  const settings = [
    { key: 'site_name', value: 'Digital Agency' },
    { key: 'site_description', value: 'وكالة تسويق رقمية متكاملة' },
    { key: 'phone', value: '+201234567890' },
    { key: 'email', value: 'info@digitalagency.com' },
    { key: 'address', value: 'القاهرة، مصر' },
    { key: 'whatsapp', value: '201234567890' },
    { key: 'facebook', value: '#' },
    { key: 'twitter', value: '#' },
    { key: 'instagram', value: '#' },
    { key: 'linkedin', value: '#' },
    { key: 'logo_text', value: 'Digital Agency' },
    {
      key: 'home.hero',
      value: JSON.stringify({
        ar: {
          title: 'انضم إلى عائلتنا',
          typingLines: 'صمم موقعك الاحترافي برمجة خاصة\nصمم هويتك البصرية باحتراف\nاطلب خطة تسويقية مجانا\nصور منتجاتك باحترافية\nصمم فيديوهات احترافية لتطوير نشاطك التجاري\nصمم تطبيق موبايل احترافي\nصمم CRM احترافي لتطوير ادارة نشاطك',
          primaryCta: 'اختار مسار نموك',
          secondaryCta: 'ابدأ مشروعك',
        },
        en: {
          title: 'Not separate services — one complete growth system for your business.',
          typingLines: 'Design your custom website\nDesign your visual identity\nRequest a free marketing plan\nPhotograph your products professionally\nCreate promo videos for your business\nDesign a mobile app\nDesign a custom CRM system',
          primaryCta: 'Choose your growth path',
          secondaryCta: 'Start your project',
        },
      }),
    },
    {
      key: 'home.sections',
      value: JSON.stringify({
        ar: {
          servicesTitle: 'اختار مسار نموك',
          servicesSubtitle: 'كل خدمة جزء من منظومة متصلة لتحقيق هدفك.',
          portfolioTitle: 'أعمال مرتبطة بالنتيجة',
          processTitle: 'من التشخيص إلى نمو مستمر',
          ctaTitle: 'جاهز تبني مسار نموك؟',
        },
        en: {
          servicesTitle: 'Choose your growth path',
          servicesSubtitle: 'Every service is part of one connected growth system.',
          portfolioTitle: 'Work connected to outcomes',
          processTitle: 'From diagnosis to continuous growth',
          ctaTitle: 'Ready to build your growth path?',
        },
      }),
    },
    {
      key: 'home.process',
      value: JSON.stringify([
        { key: 'diagnose', titleAr: 'تشخيص', titleEn: 'Diagnose' },
        { key: 'design', titleAr: 'تصميم الحل', titleEn: 'Design the solution' },
        { key: 'launch', titleAr: 'الإطلاق', titleEn: 'Launch' },
        { key: 'measure', titleAr: 'القياس والتحسين', titleEn: 'Measure and improve' },
      ]),
    },
    // Deliberately empty: only verified metrics entered in admin may appear publicly.
    { key: 'home.metrics', value: '[]' },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }

  const cmsPages = [
    { slug: 'home', titleAr: 'الصفحة الرئيسية', titleEn: 'Home' },
    { slug: 'services', titleAr: 'الخدمات', titleEn: 'Services' },
    { slug: 'portfolio', titleAr: 'البورتفوليو', titleEn: 'Portfolio' },
    { slug: 'software', titleAr: 'البرمجة', titleEn: 'Software' },
    { slug: 'social', titleAr: 'السوشيال ميديا', titleEn: 'Social Service' },
    { slug: 'branding', titleAr: 'البراندينج', titleEn: 'Branding' },
    { slug: 'media', titleAr: 'الميديا', titleEn: 'Media' },
    { slug: 'websites', titleAr: 'المواقع', titleEn: 'Websites' },
    { slug: 'news', titleAr: 'الأخبار', titleEn: 'News' },
    { slug: 'contact', titleAr: 'تواصل معنا', titleEn: 'Contact' },
  ];

  for (const page of cmsPages) {
    const saved = await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: { ...page, status: 'published', publishedAt: new Date() },
    });
    await prisma.pageSection.upsert({
      where: { pageId_key: { pageId: saved.id, key: 'hero' } },
      update: {},
      create: {
        pageId: saved.id,
        key: 'hero',
        labelAr: 'القسم الرئيسي',
        labelEn: 'Hero',
        type: 'hero',
        order: 1,
        content: JSON.stringify({
          ar: {
            title: page.titleAr,
            subtitle: 'يمكن تعديل هذا القسم من لوحة الأدمن.',
            cta: 'ابدأ الآن',
          },
          en: {
            title: page.titleEn,
            subtitle: 'This section can be edited from the admin panel.',
            cta: 'Start now',
          },
        }),
      },
    });
  }

  // The old CMS created a generic `home` hero. Promote only that untouched
  // legacy content, then create the structured command-centre sections. Any
  // real admin edits remain untouched on future seed runs.
  const homePage = await prisma.page.findUnique({ where: { slug: 'home' } });
  if (homePage) {
    const commandCenterSections = [
      {
        key: 'hero',
        labelAr: 'واجهة النمو',
        labelEn: 'Growth hero',
        type: 'home',
        order: 1,
        content: {
          ar: {
            eyebrow: 'منظومة نمو متكاملة',
            title: 'انضم إلى عائلتنا',
            subtitle: 'نبدأ من هدفك، ونربط كل خدمة بالخطوة التي تقرّب مشروعك من النتيجة.',
            typingLines: 'صمم موقعك الاحترافي برمجة خاصة\nصمم هويتك البصرية باحتراف\nاطلب خطة تسويقية مجانا\nصور منتجاتك باحترافية\nصمم فيديوهات احترافية لتطوير نشاطك التجاري\nصمم تطبيق موبايل احترافي\nصمم CRM احترافي لتطوير ادارة نشاطك',
            primaryCta: 'اختار مسار نموك',
            secondaryCta: 'ابدأ مشروعك',
          },
          en: {
            eyebrow: 'A connected growth system',
            title: 'Not isolated services. One connected growth system for your business.',
            subtitle: 'From brand and content to software and performance, every step connects to real momentum.',
            typingLines: 'Design your custom website\nDesign your visual identity\nRequest a free marketing plan\nPhotograph your products professionally\nCreate promo videos for your business\nDesign a mobile app\nDesign a custom CRM system',
            primaryCta: 'Choose your growth path',
            secondaryCta: 'Start your project',
          },
        },
      },
      {
        key: 'growth',
        labelAr: 'مركز النمو',
        labelEn: 'Growth centre',
        type: 'home',
        order: 2,
        content: {
          ar: { eyebrow: 'مسارات النمو', title: 'اختار هدفك وشوف المنظومة المناسبة', subtitle: 'كل خدمة هنا مرتبطة بهدف واضح في نمو مشروعك.' },
          en: { eyebrow: 'Growth paths', title: 'Choose your goal and see the right system', subtitle: 'Every service here is connected to a clear business outcome.' },
        },
      },
      {
        key: 'process',
        labelAr: 'طريقة العمل',
        labelEn: 'How we work',
        type: 'home',
        order: 5,
        content: {
          ar: { eyebrow: 'منهجية واضحة', title: 'من التشخيص للقياس والتحسين', subtitle: 'نحوّل المطلوب لمسار عملي قابل للقياس.', steps: 'تشخيص\nتصميم الحل\nالإطلاق\nالقياس والتحسين' },
          en: { eyebrow: 'A clear method', title: 'From diagnosis to optimisation', subtitle: 'We turn the brief into a measurable operating path.', steps: 'Diagnose\nDesign the solution\nLaunch\nMeasure and improve' },
        },
      },
      {
        key: 'finalCta',
        labelAr: 'الدعوة الختامية',
        labelEn: 'Closing CTA',
        type: 'home',
        order: 8,
        content: {
          ar: { title: 'جاهز نبني مسار النمو الخاص بمشروعك؟', subtitle: 'ابدأ بتحديد الخدمة الأقرب لهدفك، أو احكِ لنا عن مشروعك وسنساعدك في ترتيب الأولويات.', cta: 'ابدأ مشروعك' },
          en: { title: 'Ready to build your growth path?', subtitle: 'Start with the service closest to your goal, or tell us about your project and we will help arrange the priorities.', cta: 'Start your project' },
        },
      },
    ];

    for (const section of commandCenterSections) {
      const existing = await prisma.pageSection.findUnique({
        where: { pageId_key: { pageId: homePage.id, key: section.key } },
      });
      if (!existing) {
        await prisma.pageSection.create({
          data: { ...section, pageId: homePage.id, content: JSON.stringify(section.content), isVisible: true },
        });
        continue;
      }

      if (section.key === 'hero') {
        let existingContent: any = null;
        try { existingContent = JSON.parse(existing.content); } catch { /* Legacy text is treated as custom. */ }
        const arTitle = existingContent?.ar?.title;
        const enTitle = existingContent?.en?.title;
        const isUntouchedLegacyHero = (
          (arTitle === 'الصفحة الرئيسية' && (!enTitle || enTitle === 'Home'))
          || (!arTitle && enTitle === 'Home')
        );
        if (isUntouchedLegacyHero) {
          await prisma.pageSection.update({
            where: { id: existing.id },
            data: { ...section, content: JSON.stringify(section.content), isVisible: true },
          });
        }
      }
    }
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
