import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const articleSchema = z.object({
  titleAr: z.string().min(1),
  titleEn: z.string().optional().nullable(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  summaryAr: z.string().optional().nullable(),
  summaryEn: z.string().optional().nullable(),
  contentAr: z.string().min(1),
  contentEn: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  images: z.union([z.string(), z.array(z.any())]).optional().nullable(),
  imageAltAr: z.string().optional().nullable(),
  imageAltEn: z.string().optional().nullable(),
  category: z.string().default('general'),
  authorId: z.coerce.number().int().optional().nullable(),
  tags: z.union([z.string(), z.array(z.string())]).optional().nullable(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  featured: z.coerce.boolean().default(false),
  breaking: z.coerce.boolean().default(false),
  trending: z.coerce.boolean().default(false),
  homeSlot: z.string().optional().nullable(),
  homeOrder: z.coerce.number().int().default(0),
  metaTitle: z.string().optional().nullable(),
  metaDesc: z.string().optional().nullable(),
  seoKeywords: z.string().optional().nullable(),
  canonicalUrl: z.string().optional().nullable(),
  sourceName: z.string().optional().nullable(),
  sourceUrl: z.string().url().optional().nullable().or(z.literal('')),
  videoUrl: z.string().url().optional().nullable().or(z.literal('')),
  readTimeMinutes: z.coerce.number().int().optional().nullable(),
  publishedAt: z.coerce.date().optional(),
});

const categorySchema = z.object({
  nameAr: z.string().min(1),
  nameEn: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  color: z.string().default('#9d027c'),
  order: z.coerce.number().int().default(0),
});

const breakingSchema = z.object({
  textAr: z.string().min(1),
  textEn: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  isActive: z.coerce.boolean().default(true),
  order: z.coerce.number().int().default(0),
});

const authorSchema = z.object({
  nameAr: z.string().min(1),
  nameEn: z.string().optional(),
  bioAr: z.string().optional().nullable(),
  bioEn: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
});

function normalizeArticle(data: z.infer<typeof articleSchema>) {
  return {
    ...data,
    tags: Array.isArray(data.tags) ? JSON.stringify(data.tags) : data.tags,
    images: Array.isArray(data.images) ? JSON.stringify(data.images) : data.images,
  };
}

function normalizeAuthor(data: z.infer<typeof authorSchema>) {
  return {
    ...data,
    nameEn: data.nameEn || data.nameAr,
  };
}

// News Articles
export const getArticles = async (req: Request, res: Response) => {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 25), 1), 100);
    const { category, status, search } = req.query;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (category) where.category = category;
    if (status) where.status = status;
    if (search) where.OR = [
      { titleAr: { contains: String(search) } },
      { titleEn: { contains: String(search) } },
    ];

    const [articles, total] = await Promise.all([
      prisma.newsArticle.findMany({ where, orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }], skip, take: limit }),
      prisma.newsArticle.count({ where }),
    ]);
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    res.json({ items: articles, articles, pagination: { page, limit, total, totalPages }, total, page, totalPages });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getArticle = async (req: Request, res: Response) => {
  try {
    const a = await prisma.newsArticle.findUnique({ where: { id: Number(req.params.id) } });
    if (!a) return res.status(404).json({ message: 'Not found' });
    res.json(a);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createArticle = async (req: Request, res: Response) => {
  try {
    const parsed = articleSchema.parse(req.body);
    const a = await prisma.newsArticle.create({ data: normalizeArticle(parsed) });
    res.json(a);
  } catch (e: any) {
    res.status(400).json({ message: e.message || 'Invalid article data' });
  }
};

export const updateArticle = async (req: Request, res: Response) => {
  try {
    const parsed = articleSchema.partial().parse(req.body);
    const data: any = { ...parsed };
    if (Array.isArray(parsed.tags)) data.tags = JSON.stringify(parsed.tags);
    if (Array.isArray(parsed.images)) data.images = JSON.stringify(parsed.images);
    const a = await prisma.newsArticle.update({ where: { id: Number(req.params.id) }, data });
    res.json(a);
  } catch (e: any) {
    res.status(400).json({ message: e.message || 'Invalid article data' });
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  try {
    await prisma.newsArticle.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// News Categories
export const getNewsCategories = async (_req: Request, res: Response) => {
  try {
    const cats = await prisma.newsCategory.findMany({ orderBy: { order: 'asc' } });
    res.json(cats);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createNewsCategory = async (req: Request, res: Response) => {
  try {
    const c = await prisma.newsCategory.create({ data: categorySchema.parse(req.body) });
    res.json(c);
  } catch (e: any) {
    res.status(400).json({ message: e.message || 'Invalid category data' });
  }
};

export const updateNewsCategory = async (req: Request, res: Response) => {
  try {
    const c = await prisma.newsCategory.update({ where: { id: Number(req.params.id) }, data: categorySchema.partial().parse(req.body) });
    res.json(c);
  } catch (e: any) {
    res.status(400).json({ message: e.message || 'Invalid category data' });
  }
};

export const deleteNewsCategory = async (req: Request, res: Response) => {
  try {
    await prisma.newsCategory.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Breaking News
export const getBreakingNews = async (_req: Request, res: Response) => {
  try {
    const items = await prisma.breakingNews.findMany({ orderBy: { order: 'asc' } });
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createBreakingNews = async (req: Request, res: Response) => {
  try {
    const b = await prisma.breakingNews.create({ data: breakingSchema.parse(req.body) });
    res.json(b);
  } catch (e: any) {
    res.status(400).json({ message: e.message || 'Invalid breaking news data' });
  }
};

export const updateBreakingNews = async (req: Request, res: Response) => {
  try {
    const b = await prisma.breakingNews.update({ where: { id: Number(req.params.id) }, data: breakingSchema.partial().parse(req.body) });
    res.json(b);
  } catch (e: any) {
    res.status(400).json({ message: e.message || 'Invalid breaking news data' });
  }
};

export const deleteBreakingNews = async (req: Request, res: Response) => {
  try {
    await prisma.breakingNews.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Authors
export const getAuthors = async (_req: Request, res: Response) => {
  try {
    const authors = await prisma.newsAuthor.findMany();
    res.json(authors);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createAuthor = async (req: Request, res: Response) => {
  try {
    const a = await prisma.newsAuthor.create({ data: normalizeAuthor(authorSchema.parse(req.body)) });
    res.json(a);
  } catch (e: any) {
    res.status(400).json({ message: e.message || 'Invalid author data' });
  }
};

export const updateAuthor = async (req: Request, res: Response) => {
  try {
    const parsed = authorSchema.partial().parse(req.body);
    const data = {
      ...parsed,
      ...(parsed.nameEn === undefined && parsed.nameAr ? { nameEn: parsed.nameAr } : {}),
    };
    const a = await prisma.newsAuthor.update({ where: { id: Number(req.params.id) }, data });
    res.json(a);
  } catch (e: any) {
    res.status(400).json({ message: e.message || 'Invalid author data' });
  }
};

export const deleteAuthor = async (req: Request, res: Response) => {
  try {
    await prisma.newsAuthor.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// News Stats
export const getNewsStats = async (_req: Request, res: Response) => {
  try {
    const [total, published, drafts, breaking] = await Promise.all([
      prisma.newsArticle.count(),
      prisma.newsArticle.count({ where: { status: 'published' } }),
      prisma.newsArticle.count({ where: { status: 'draft' } }),
      prisma.breakingNews.count({ where: { isActive: true } }),
    ]);
    res.json({ total, published, drafts, breaking });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};
