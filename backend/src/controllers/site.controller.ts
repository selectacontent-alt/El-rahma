import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { google } from 'googleapis';
import { ensureDefaultSocialMediaCategories } from '../utils/defaultSocialMediaCategories';
import { serviceSlug, toPublicService } from '../utils/publicService';

const prisma = new PrismaClient();

function getGoogleDriveClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'https://developers.google.com/oauthplayground'
  );
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return google.drive({ version: 'v3', auth: oauth2Client });
}

function parseSectionContent(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function parseJsonArray(value?: string | null) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return String(value).split('\n').map(item => item.trim()).filter(Boolean);
  }
}

function parseJsonSetting<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

const defaultSoftwareCustomPlanConfig = {
  enabled: true,
  titleAr: 'ابن خطة موقعك على مقاسك',
  titleEn: 'Build your website plan around your needs',
  leadAr: 'اختر ما تحتاجه لمشروعك، واكتب فكرتك، وسنراجعها معك كخطة تنفيذ واضحة.',
  leadEn: 'Choose what your project needs, describe your idea, and we will review it as a clear delivery plan.',
  buttonAr: 'ابدأ طلب الخطة',
  buttonEn: 'Start Plan Request',
  options: [
    { id: 'pages', labelAr: 'صفحات تعريفية', labelEn: 'Company pages', descriptionAr: 'الرئيسية والخدمات ومن نحن والتواصل', descriptionEn: 'Home, services, about, and contact pages' },
    { id: 'store', labelAr: 'متجر إلكتروني', labelEn: 'Online store', descriptionAr: 'منتجات وسلة وطلبات', descriptionEn: 'Products, cart, and orders' },
    { id: 'dashboard', labelAr: 'لوحة تحكم', labelEn: 'Admin dashboard', descriptionAr: 'إدارة المحتوى والطلبات', descriptionEn: 'Manage content and requests' },
    { id: 'booking', labelAr: 'حجز ومواعيد', labelEn: 'Booking', descriptionAr: 'حجوزات وتنبيهات منظمة', descriptionEn: 'Structured bookings and reminders' },
    { id: 'payments', labelAr: 'دفع إلكتروني', labelEn: 'Online payments', descriptionAr: 'تحصيل آمن وربط طرق الدفع', descriptionEn: 'Secure payments and integrations' },
    { id: 'crm', labelAr: 'CRM وعملاء', labelEn: 'CRM', descriptionAr: 'متابعة العملاء والفرص', descriptionEn: 'Customer and lead follow-up' },
    { id: 'automation', labelAr: 'أتمتة وربط', labelEn: 'Automation', descriptionAr: 'ربط الأنظمة والمهام المتكررة', descriptionEn: 'Connect systems and recurring work' },
    { id: 'seo', labelAr: 'SEO وتحليلات', labelEn: 'SEO and analytics', descriptionAr: 'ظهور أفضل وقياس التحويلات', descriptionEn: 'Search visibility and conversion tracking' },
  ],
};

function publicSoftwareCustomPlanConfig(value?: string) {
  const candidate = parseJsonSetting<unknown>(value, defaultSoftwareCustomPlanConfig);
  const source = candidate && typeof candidate === 'object' ? candidate as Record<string, unknown> : {};
  const text = (key: string, fallback: string) => typeof source[key] === 'string' && source[key].trim() ? source[key].trim().slice(0, 500) : fallback;
  const options = Array.isArray(source.options) ? source.options : defaultSoftwareCustomPlanConfig.options;
  const normalizedOptions = options
    .filter((option): option is Record<string, unknown> => !!option && typeof option === 'object')
    .map((option, index) => ({
      id: typeof option.id === 'string' && /^[a-z0-9-]{2,48}$/i.test(option.id) ? option.id : `option-${index + 1}`,
      labelAr: typeof option.labelAr === 'string' ? option.labelAr.trim().slice(0, 120) : '',
      labelEn: typeof option.labelEn === 'string' ? option.labelEn.trim().slice(0, 120) : '',
      descriptionAr: typeof option.descriptionAr === 'string' ? option.descriptionAr.trim().slice(0, 300) : '',
      descriptionEn: typeof option.descriptionEn === 'string' ? option.descriptionEn.trim().slice(0, 300) : '',
    }))
    .filter(option => option.labelAr && option.labelEn)
    .slice(0, 12);
  return {
    enabled: source.enabled !== false,
    titleAr: text('titleAr', defaultSoftwareCustomPlanConfig.titleAr),
    titleEn: text('titleEn', defaultSoftwareCustomPlanConfig.titleEn),
    leadAr: text('leadAr', defaultSoftwareCustomPlanConfig.leadAr),
    leadEn: text('leadEn', defaultSoftwareCustomPlanConfig.leadEn),
    buttonAr: text('buttonAr', defaultSoftwareCustomPlanConfig.buttonAr),
    buttonEn: text('buttonEn', defaultSoftwareCustomPlanConfig.buttonEn),
    options: normalizedOptions.length ? normalizedOptions : defaultSoftwareCustomPlanConfig.options,
  };
}

function driveUrl(fileId?: string | null, size = 'w1200') {
  if (!fileId) return null;
  if (fileId.startsWith('http')) return fileId;
  if (fileId.startsWith('/uploads')) return fileId;
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=${size}`;
}

function driveViewUrl(fileId?: string | null) {
  if (!fileId) return null;
  if (fileId.startsWith('http') || fileId.startsWith('/uploads')) return fileId;
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

function normalizeDriveImageSize(value: unknown) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (String(raw || '').toLowerCase() === 'original') return 'original';
  const match = String(raw || '').match(/^w(\d{2,4})$/);
  if (!match) return 'w1200';
  const width = Math.min(Math.max(Number(match[1]), 64), 4096);
  return `w${width}`;
}

function looksLikeDriveFileId(value: string) {
  return /^[A-Za-z0-9_-]{10,}$/.test(value);
}

export const proxyDriveImage = async (req: Request, res: Response) => {
  try {
    const fileId = String(req.params.fileId || '').trim();
    if (!looksLikeDriveFileId(fileId)) {
      return res.status(400).json({ message: 'Invalid Drive file id' });
    }

    const size = normalizeDriveImageSize(req.query.size);
    if (size === 'original') {
      try {
        const drive = getGoogleDriveClient();
        if (drive) {
          const original = await drive.files.get(
            { fileId, alt: 'media', supportsAllDrives: true },
            { responseType: 'arraybuffer' }
          );
          const originalType = String(original.headers['content-type'] || '');
          if (originalType.startsWith('image/')) {
            const originalBuffer = Buffer.from(original.data as ArrayBuffer);
            res.setHeader('Content-Type', originalType);
            res.setHeader('Content-Length', String(originalBuffer.byteLength));
            res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
            return res.end(originalBuffer);
          }
        }
      } catch {
        // Fall through to Drive's public original-view URLs when API auth is unavailable.
      }
    }

    const upstreamUrls = [
      ...(size === 'original'
        ? []
        : [`https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=${encodeURIComponent(size)}`]),
      ...(size === 'original'
        ? [`https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`]
        : []),
      `https://drive.google.com/uc?export=view&id=${encodeURIComponent(fileId)}`,
    ];

    for (const url of upstreamUrls) {
      const upstream = await fetch(url, { redirect: 'follow' });
      const contentType = upstream.headers.get('content-type') || '';
      if (!upstream.ok || !contentType.startsWith('image/')) continue;

      const buffer = Buffer.from(await upstream.arrayBuffer());
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Length', String(buffer.byteLength));
      res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
      return res.end(buffer);
    }

    return res.status(404).json({ message: 'Drive image not available' });
  } catch (error) {
    return res.status(502).json({ message: 'Drive image proxy failed' });
  }
};

function normalizeAsset(asset: any) {
  return {
    ...asset,
    url: asset.url || driveViewUrl(asset.fileId),
    thumbnailUrl: asset.thumbnailUrl || driveUrl(asset.fileId),
    driveName: asset.driveName || asset.fileName,
    originalName: asset.originalName || null,
  };
}

const publicPortfolioServiceSelect = {
  id: true,
  slug: true,
  titleAr: true,
  titleEn: true,
  icon: true,
} as const;

function toPublicPortfolio(item: any) {
  const services = Array.isArray(item.services) ? item.services : [];
  return {
    ...item,
    imageUrl: driveUrl(item.image),
    imageViewUrl: driveViewUrl(item.image),
    images: parseJsonArray(item.images).map(normalizeAsset),
    serviceIds: services.map((service: { id: number }) => service.id),
    serviceSlugs: services.map((service: { id: number; slug: string | null }) => serviceSlug(service)),
    services: services.map((service: { id: number; slug: string | null; titleAr: string; titleEn: string; icon: string }) => ({
      id: service.id,
      slug: serviceSlug(service),
      titleAr: service.titleAr,
      titleEn: service.titleEn,
      icon: service.icon,
    })),
  };
}

const defaultHomeHero = {
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
};

function publicHomeConfig(settings: Record<string, string>) {
  const process = parseJsonSetting<unknown[]>(settings['home.process'], []);
  return {
    hero: parseJsonSetting(settings['home.hero'], defaultHomeHero),
    sections: parseJsonSetting<Record<string, unknown>>(settings['home.sections'], {}),
    process,
    // Keep an explicit alias while frontends migrate from the original naming.
    workSteps: process,
    metrics: parseJsonSetting<unknown[]>(settings['home.metrics'], []),
  };
}

export const getPublicPage = async (req: Request, res: Response) => {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: req.params.slug },
      include: {
        sections: {
          where: { isVisible: true },
          orderBy: { order: 'asc' },
        },
      },
    });
    if (!page || page.status !== 'published') {
      return res.status(404).json({ message: 'Page not found' });
    }
    res.json({
      status: 'success',
      data: {
        ...page,
        sections: page.sections.map(section => ({
          ...section,
          content: parseSectionContent(section.content),
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSiteBootstrap = async (_req: Request, res: Response) => {
  try {
    const [settings, translations, services, portfolio, testimonials, partners, pages] = await Promise.all([
      prisma.setting.findMany(),
      prisma.translation.findMany(),
      prisma.service.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
        include: {
          portfolios: {
            where: { isActive: true },
            orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
            select: {
              id: true,
              titleAr: true,
              titleEn: true,
              category: true,
              image: true,
              featured: true,
            },
          },
        },
      }),
      prisma.portfolio.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        take: 12,
        include: { services: { where: { isActive: true }, select: publicPortfolioServiceSelect } },
      }),
      prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' }, take: 12 }),
      prisma.partner.findMany({ orderBy: { order: 'asc' } }),
      prisma.page.findMany({
        where: { status: 'published' },
        include: { sections: { where: { isVisible: true }, orderBy: { order: 'asc' } } },
      }),
    ]);
    res.json({
      status: 'success',
      data: {
        settings: Object.fromEntries(settings.map(item => [item.key, item.value])),
        translations,
        services: services.map(toPublicService),
        portfolio: portfolio.map(toPublicPortfolio),
        testimonials,
        partners,
        pages: pages.map(page => ({
          ...page,
          sections: page.sections.map(section => ({
            ...section,
            content: parseSectionContent(section.content),
          })),
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Focused homepage payload used by the Growth Command Center. It deliberately
 * exposes only active services and actual admin-managed trust content.
 */
export const getPublicHome = async (_req: Request, res: Response) => {
  try {
    const [settings, services, portfolio, testimonials, partners, page] = await Promise.all([
      prisma.setting.findMany(),
      prisma.service.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
        include: {
          portfolios: {
            where: { isActive: true },
            orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
            select: {
              id: true,
              titleAr: true,
              titleEn: true,
              category: true,
              image: true,
              featured: true,
            },
          },
        },
      }),
      prisma.portfolio.findMany({
        where: { isActive: true },
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        include: { services: { where: { isActive: true }, select: publicPortfolioServiceSelect } },
      }),
      prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.partner.findMany({ orderBy: { order: 'asc' } }),
      prisma.page.findFirst({
        where: { slug: 'home', status: 'published' },
        include: {
          sections: {
            where: { isVisible: true },
            orderBy: { order: 'asc' },
          },
        },
      }),
    ]);

    const settingsMap = Object.fromEntries(settings.map(item => [item.key, item.value]));
    const home = publicHomeConfig(settingsMap);
    res.json({
      status: 'success',
      data: {
        settings: settingsMap,
        home,
        metrics: home.metrics,
        page: page ? {
          ...page,
          sections: page.sections.map(section => ({
            ...section,
            content: parseSectionContent(section.content),
          })),
        } : null,
        services: services.map(toPublicService),
        portfolio: portfolio.map(toPublicPortfolio),
        testimonials,
        partners,
      },
    });
  } catch (error) {
    console.error('Homepage payload failed:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPublicPricing = async (req: Request, res: Response) => {
  try {
    const where: any = { isActive: true };
    if (req.query.section) where.section = String(req.query.section);
    const packages = await prisma.pricingPackage.findMany({ where, orderBy: { order: 'asc' } });
    res.json({
      status: 'success',
      data: packages.map(item => ({
        ...item,
        featuresAr: parseJsonArray(item.featuresAr),
        featuresEn: parseJsonArray(item.featuresEn),
        detailsAr: parseJsonArray(item.detailsAr),
        detailsEn: parseJsonArray(item.detailsEn),
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPublicSoftwareCustomPlan = async (_req: Request, res: Response) => {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: 'software_custom_plan_config' } });
    res.json({ status: 'success', data: publicSoftwareCustomPlanConfig(setting?.value) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const defaultAdvertisingBudgetConfig = {
  options: [10500, 15000, 20000, 25000, 30000],
};

function parseAdvertisingBudgetOptions(value: string | undefined) {
  if (!value) return [...defaultAdvertisingBudgetConfig.options];
  try {
    const parsed = JSON.parse(value);
    const options = Array.isArray(parsed) ? parsed.map(Number) : [];
    const valid = [...new Set(options)].filter(item => Number.isInteger(item) && item >= 10500).sort((a, b) => a - b);
    return valid.length >= 2 ? valid : [...defaultAdvertisingBudgetConfig.options];
  } catch {
    const options = value.split(/[,،\n]+/).map(Number);
    const valid = [...new Set(options)].filter(item => Number.isInteger(item) && item >= 10500).sort((a, b) => a - b);
    return valid.length >= 2 ? valid : [...defaultAdvertisingBudgetConfig.options];
  }
}

function publicAdvertisingBudgetConfig(settings: Array<{ key: string; value: string }>) {
  const values = Object.fromEntries(settings.map(item => [item.key, item.value]));
  const options = parseAdvertisingBudgetOptions(values.advertising_budget_options);
  return { options, min: options[0], max: options[options.length - 1], step: options[1] - options[0] };
}

export const getPublicAdvertisingBudget = async (_req: Request, res: Response) => {
  try {
    const settings = await prisma.setting.findMany({
      where: { key: { in: ['advertising_budget_options', 'advertising_budget_min', 'advertising_budget_max', 'advertising_budget_step'] } },
      select: { key: true, value: true },
    });
    res.json({ status: 'success', data: publicAdvertisingBudgetConfig(settings) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPublicMediaSlider = async (req: Request, res: Response) => {
  try {
    const where: any = { isVisible: true };
    if (req.query.type) where.type = String(req.query.type);
    const items = await prisma.mediaSliderItem.findMany({ where, orderBy: { order: 'asc' } });
    res.json({
      status: 'success',
      data: items.map(item => ({
        ...item,
        url: item.url || driveViewUrl(item.fileId),
        thumbnailUrl: item.thumbnailUrl || driveUrl(item.fileId),
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPublicMediaAssets = async (req: Request, res: Response) => {
  try {
    const where: any = {};
    if (req.query.folder) where.folder = String(req.query.folder);
    if (req.query.kind) where.kind = String(req.query.kind);
    const items = await prisma.mediaAsset.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json({ status: 'success', data: items.map(normalizeAsset) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPublicSocialMediaCategories = async (req: Request, res: Response) => {
  try {
    await ensureDefaultSocialMediaCategories(prisma);
    const summaryOnly = String(req.query.summary || '') === '1' || String(req.query.summary || '') === 'true';
    const categories = await prisma.socialMediaCategory.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json({
      status: 'success',
      data: categories.map(category => {
        const images = parseJsonArray(category.images);
        return summaryOnly
          ? {
              id: category.id,
              nameAr: category.nameAr,
              nameEn: category.nameEn,
              keyword: category.keyword,
              descriptionAr: category.descriptionAr,
              descriptionEn: category.descriptionEn,
              order: category.order,
              imageCount: images.length,
            }
          : {
              ...category,
              images: images.map(normalizeAsset),
            };
      }),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPublicSocialMediaCategoryImages = async (req: Request, res: Response) => {
  try {
    await ensureDefaultSocialMediaCategories(prisma);
    const keyword = String(req.params.keyword || '').trim();
    const offset = Math.max(0, Number.parseInt(String(req.query.offset || '0'), 10) || 0);
    const requestedLimit = Number.parseInt(String(req.query.limit || '18'), 10) || 18;
    const limit = Math.min(Math.max(requestedLimit, 1), 18);
    const category = await prisma.socialMediaCategory.findFirst({
      where: { keyword, isActive: true },
    });

    if (!category) {
      return res.status(404).json({ message: 'Social media category not found' });
    }

    const allImages = parseJsonArray(category.images);
    const pageImages = allImages.slice(offset, offset + limit).map(normalizeAsset);
    const nextOffset = offset + pageImages.length;
    const hasMore = nextOffset < allImages.length;

    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=1800');
    return res.json({
      status: 'success',
      data: {
        category: {
          id: category.id,
          nameAr: category.nameAr,
          nameEn: category.nameEn,
          keyword: category.keyword,
          descriptionAr: category.descriptionAr,
          descriptionEn: category.descriptionEn,
          imageCount: allImages.length,
        },
        images: pageImages,
        offset,
        limit,
        nextOffset: hasMore ? nextOffset : null,
        hasMore,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getPublicWebsites = async (_req: Request, res: Response) => {
  try {
    const websites = await prisma.website.findMany({
      where: { isVisible: true },
      orderBy: { order: 'asc' },
    });
    res.json({
      status: 'success',
      data: websites.map(item => ({
        ...item,
        logoUrl: driveUrl(item.logoFileId),
        screenshotUrl: driveUrl(item.screenshotId),
      })),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPublicPortfolio = async (req: Request, res: Response) => {
  try {
    const where: any = { isActive: true };
    if (req.query.category) where.category = String(req.query.category);
    const items = await prisma.portfolio.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      include: { services: { where: { isActive: true }, select: publicPortfolioServiceSelect } },
    });
    res.json({
      status: 'success',
      data: items.map(toPublicPortfolio),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
