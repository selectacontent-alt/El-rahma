import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { ensureDefaultSocialMediaCategories } from '../utils/defaultSocialMediaCategories';

const prisma = new PrismaClient();

const websiteSchema = z.object({
  nameAr: z.string().min(1),
  nameEn: z.string().min(1),
  descAr: z.string().optional().nullable(),
  descEn: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  logoFileId: z.string().optional().nullable(),
  screenshotId: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  order: z.coerce.number().int().default(0),
  isVisible: z.coerce.boolean().default(true),
});

const mediaSliderSchema = z.object({
  type: z.enum(['image', 'video']).default('image'),
  fileId: z.string().min(1),
  url: z.string().optional().nullable(),
  thumbnailUrl: z.string().optional().nullable(),
  originalName: z.string().optional().nullable(),
  driveName: z.string().optional().nullable(),
  mimeType: z.string().optional().nullable(),
  folder: z.string().optional().nullable(),
  titleAr: z.string().optional().nullable(),
  titleEn: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  order: z.coerce.number().int().default(0),
  isVisible: z.coerce.boolean().default(true),
});

const pricingSchema = z.object({
  section: z.enum(['software', 'social', 'media']),
  softwareCategory: z.enum(['web', 'commerce', 'crm', 'ai', 'automation', 'growth']).optional().nullable(),
  isCustomPlan: z.coerce.boolean().default(false),
  nameAr: z.string().min(1),
  nameEn: z.string().min(1),
  descriptionAr: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  badgeAr: z.string().optional().nullable(),
  badgeEn: z.string().optional().nullable(),
  price: z.coerce.number().nonnegative(),
  originalPrice: z.coerce.number().nonnegative().optional().nullable(),
  currency: z.string().default('EGP'),
  period: z.enum(['monthly', 'yearly', 'once']).default('monthly'),
  priceNoteAr: z.string().optional().nullable(),
  priceNoteEn: z.string().optional().nullable(),
  featuresAr: z.union([z.string(), z.array(z.string())]),
  featuresEn: z.union([z.string(), z.array(z.string())]),
  detailsAr: z.union([z.string(), z.array(z.string())]).optional().nullable(),
  detailsEn: z.union([z.string(), z.array(z.string())]).optional().nullable(),
  highlighted: z.coerce.boolean().default(false),
  ctaText: z.string().optional().nullable(),
  ctaLink: z.string().optional().nullable(),
  order: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
});

const socialMediaCategorySchema = z.object({
  nameAr: z.string().min(1),
  nameEn: z.string().optional().nullable(),
  keyword: z.string().min(1),
  descriptionAr: z.string().optional().nullable(),
  descriptionEn: z.string().optional().nullable(),
  images: z.union([z.string(), z.array(z.any())]).optional().nullable(),
  order: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
});

function listToJson(value: string | string[]) {
  if (Array.isArray(value)) return JSON.stringify(value);
  try {
    JSON.parse(value);
    return value;
  } catch {
    return JSON.stringify(value.split('\n').map(item => item.trim()).filter(Boolean));
  }
}

// ─── WEBSITES ────────────────────────────────────────────────────────────────
export const getWebsites = async (req: Request, res: Response) => {
  try {
    const hasPagination = req.query.page !== undefined || req.query.limit !== undefined || req.query.q !== undefined;
    const search = String(req.query.q || '').trim();
    const where: any = search ? { OR: [{ nameAr: { contains: search } }, { nameEn: { contains: search } }, { category: { contains: search } }] } : {};
    if (!hasPagination) return res.json(await prisma.website.findMany({ where, orderBy: { order: 'asc' } }));
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 25), 1), 100);
    const [items, total] = await Promise.all([
      prisma.website.findMany({ where, orderBy: { order: 'asc' }, skip: (page - 1) * limit, take: limit }),
      prisma.website.count({ where }),
    ]);
    res.json({ items, pagination: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) } });
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

export const createWebsite = async (req: Request, res: Response) => {
  try {
    const w = await prisma.website.create({ data: websiteSchema.parse(req.body) });
    res.json(w);
  } catch (e: any) { res.status(400).json({ message: e.message || 'Invalid website data' }); }
};

export const updateWebsite = async (req: Request, res: Response) => {
  try {
    const w = await prisma.website.update({ where: { id: Number(req.params.id) }, data: websiteSchema.partial().parse(req.body) });
    res.json(w);
  } catch (e: any) { res.status(400).json({ message: e.message || 'Invalid website data' }); }
};

export const deleteWebsite = async (req: Request, res: Response) => {
  try {
    await prisma.website.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

// ─── MEDIA SLIDER ────────────────────────────────────────────────────────────
export const getMediaSlider = async (_req: Request, res: Response) => {
  try {
    const data = await prisma.mediaSliderItem.findMany({ orderBy: { order: 'asc' } });
    res.json(data);
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

export const createMediaSliderItem = async (req: Request, res: Response) => {
  try {
    const m = await prisma.mediaSliderItem.create({ data: mediaSliderSchema.parse(req.body) });
    res.json(m);
  } catch (e: any) { res.status(400).json({ message: e.message || 'Invalid media data' }); }
};

export const updateMediaSliderItem = async (req: Request, res: Response) => {
  try {
    const m = await prisma.mediaSliderItem.update({ where: { id: Number(req.params.id) }, data: mediaSliderSchema.partial().parse(req.body) });
    res.json(m);
  } catch (e: any) { res.status(400).json({ message: e.message || 'Invalid media data' }); }
};

export const deleteMediaSliderItem = async (req: Request, res: Response) => {
  try {
    await prisma.mediaSliderItem.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

// ─── PRICING PACKAGES ────────────────────────────────────────────────────────
export const getPricingPackages = async (req: Request, res: Response) => {
  try {
    const { section } = req.query;
    const where = section ? { section: String(section) } : {};
    const data = await prisma.pricingPackage.findMany({ where, orderBy: { order: 'asc' } });
    res.json(data);
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

export const createPricingPackage = async (req: Request, res: Response) => {
  try {
    const parsed = pricingSchema.parse(req.body);
    if (parsed.section === 'software' && !parsed.softwareCategory) {
      throw new Error('Software category is required for software plans');
    }
    const p = await prisma.pricingPackage.create({
      data: {
        ...parsed,
        softwareCategory: parsed.section === 'software' ? parsed.softwareCategory : null,
        isCustomPlan: parsed.section === 'software' && parsed.isCustomPlan,
        ctaLink: parsed.section === 'software' && parsed.isCustomPlan ? '/custom-plan' : '/checkout',
        featuresAr: listToJson(parsed.featuresAr),
        featuresEn: listToJson(parsed.featuresEn),
        detailsAr: parsed.detailsAr == null ? null : listToJson(parsed.detailsAr),
        detailsEn: parsed.detailsEn == null ? null : listToJson(parsed.detailsEn),
      },
    });
    res.json(p);
  } catch (e: any) { res.status(400).json({ message: e.message || 'Invalid pricing data' }); }
};

export const updatePricingPackage = async (req: Request, res: Response) => {
  try {
    const parsed = pricingSchema.partial().parse(req.body);
    const data: any = { ...parsed };
    const existing = await prisma.pricingPackage.findUnique({ where: { id: Number(req.params.id) } });
    const nextSection = parsed.section || existing?.section;
    if (!existing) throw new Error('Pricing plan not found');
    if (nextSection === 'software' && parsed.softwareCategory === null) {
      throw new Error('Software category is required for software plans');
    }
    const nextIsCustomPlan = nextSection === 'software' ? (parsed.isCustomPlan ?? existing.isCustomPlan) : false;
    if (nextSection !== 'software') data.softwareCategory = null;
    data.isCustomPlan = nextIsCustomPlan;
    if (parsed.ctaLink !== undefined || parsed.isCustomPlan !== undefined || parsed.section !== undefined) {
      data.ctaLink = nextIsCustomPlan ? '/custom-plan' : '/checkout';
    }
    if (parsed.featuresAr !== undefined) data.featuresAr = listToJson(parsed.featuresAr);
    if (parsed.featuresEn !== undefined) data.featuresEn = listToJson(parsed.featuresEn);
    if (parsed.detailsAr !== undefined) data.detailsAr = parsed.detailsAr == null ? null : listToJson(parsed.detailsAr);
    if (parsed.detailsEn !== undefined) data.detailsEn = parsed.detailsEn == null ? null : listToJson(parsed.detailsEn);
    const p = await prisma.pricingPackage.update({ where: { id: Number(req.params.id) }, data });
    res.json(p);
  } catch (e: any) { res.status(400).json({ message: e.message || 'Invalid pricing data' }); }
};

export const deletePricingPackage = async (req: Request, res: Response) => {
  try {
    await prisma.pricingPackage.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

// ─── SOCIAL MEDIA CATEGORIES ─────────────────────────────────────────────────
export const getSocialMediaCategories = async (_req: Request, res: Response) => {
  try {
    await ensureDefaultSocialMediaCategories(prisma);
    const data = await prisma.socialMediaCategory.findMany({ orderBy: { order: 'asc' } });
    res.json(data);
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
};

export const createSocialMediaCategory = async (req: Request, res: Response) => {
  try {
    const parsed = socialMediaCategorySchema.parse(req.body);
    const c = await prisma.socialMediaCategory.create({
      data: { ...parsed, images: parsed.images == null ? null : (typeof parsed.images === 'string' ? parsed.images : JSON.stringify(parsed.images)) },
    });
    res.json(c);
  } catch (e: any) { res.status(400).json({ message: e.message || 'Invalid category data' }); }
};

export const updateSocialMediaCategory = async (req: Request, res: Response) => {
  try {
    const parsed = socialMediaCategorySchema.partial().parse(req.body);
    const data: any = { ...parsed };
    if (parsed.images !== undefined) data.images = parsed.images == null ? null : (typeof parsed.images === 'string' ? parsed.images : JSON.stringify(parsed.images));
    const c = await prisma.socialMediaCategory.update({ where: { id: Number(req.params.id) }, data });
    res.json(c);
  } catch (e: any) { res.status(400).json({ message: e.message || 'Invalid category data' }); }
};

export const deleteSocialMediaCategory = async (req: Request, res: Response) => {
  try {
    await prisma.socialMediaCategory.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: 'Server error' }); }
};
