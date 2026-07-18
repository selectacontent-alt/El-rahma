import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const newsletterSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

function driveUrl(fileId?: string | null) {
  if (!fileId) return null;
  if (fileId.startsWith('http')) return fileId;
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

function parseTags(tags?: string | null) {
  if (!tags) return [];
  try {
    const parsed = JSON.parse(tags);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((tag: string, index: number) => ({
      id: index + 1,
      name_ar: tag,
      name_en: tag,
      slug: String(tag).toLowerCase().replace(/\s+/g, '-'),
    }));
  } catch {
    return String(tags).split(',').map((tag, index) => ({
      id: index + 1,
      name_ar: tag.trim(),
      name_en: tag.trim(),
      slug: tag.trim().toLowerCase().replace(/\s+/g, '-'),
    }));
  }
}

function parseAssetArray(value?: string | null) {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function categoryPayload(article: any) {
  return {
    id: article.categoryRef?.id,
    name_ar: article.categoryRef?.nameAr || article.category || 'S C News',
    name_en: article.categoryRef?.nameEn || article.category || 'S C News',
    slug: article.categoryRef?.slug || article.category || 'general',
    color: article.categoryRef?.color,
  };
}

function authorPayload(article: any) {
  if (!article.author) return null;
  return {
    name_ar: article.author.nameAr,
    name_en: article.author.nameEn || article.author.nameAr,
    bio_ar: article.author.bioAr,
    bio_en: article.author.bioEn,
    avatar_url: driveUrl(article.author.image),
  };
}

function articlePayload(article: any) {
  const gallery = parseAssetArray(article.images);
  const firstGalleryImage = gallery.find((item: any) => item?.url || item?.thumbnailUrl || item?.fileId);
  const featuredImage = driveUrl(article.image)
    || firstGalleryImage?.url
    || firstGalleryImage?.thumbnailUrl
    || driveUrl(firstGalleryImage?.fileId);
  return {
    id: article.id,
    title_ar: article.titleAr,
    title_en: article.titleEn,
    slug: article.slug,
    excerpt_ar: article.summaryAr || article.titleAr,
    excerpt_en: article.summaryEn || article.summaryAr || article.titleEn || article.titleAr,
    body_ar: article.contentAr,
    body_en: article.contentEn || article.contentAr,
    featured_image_url: featuredImage,
    gallery_images: gallery,
    image_alt_ar: article.imageAltAr || article.titleAr,
    image_alt_en: article.imageAltEn || article.titleEn || article.titleAr,
    category: categoryPayload(article),
    tags: parseTags(article.tags),
    author: authorPayload(article),
    article_type: article.category === 'videos' || article.category === 'video' ? 'video' : article.category === 'case-studies' || article.category === 'case_studies' ? 'case_study' : article.category === 'guides' || article.category === 'articles' ? 'guide' : 'news',
    is_featured: article.featured,
    is_breaking: article.breaking,
    is_trending: article.trending || article.featured,
    published_at: article.publishedAt?.toISOString?.() || article.publishedAt,
    updated_at: article.updatedAt?.toISOString?.() || article.updatedAt,
    created_at: article.createdAt?.toISOString?.() || article.createdAt,
    read_time_minutes: article.readTimeMinutes || Math.max(3, Math.ceil(String(article.contentAr || '').split(/\s+/).length / 180)),
    views_count: 0,
    source_name: article.sourceName,
    source_url: article.sourceUrl,
    video_url: article.videoUrl,
  };
}

async function categoryMap() {
  const categories = await prisma.newsCategory.findMany({ orderBy: { order: 'asc' } });
  return new Map(categories.map(category => [category.slug, category]));
}

async function publishedArticles(extraWhere: Record<string, unknown> = {}, take = 40) {
  const cats = await categoryMap();
  const articles = await prisma.newsArticle.findMany({
    where: { status: 'published', ...extraWhere },
    include: { author: true },
    orderBy: [{ homeOrder: 'asc' }, { publishedAt: 'desc' }],
    take,
  });
  return articles.map(article => ({ ...article, categoryRef: cats.get(article.category) }));
}

export const getNewsHome = async (_req: Request, res: Response) => {
  try {
    const [articles, categories, breaking] = await Promise.all([
      publishedArticles({}, 60),
      prisma.newsCategory.findMany({ orderBy: { order: 'asc' } }),
      prisma.breakingNews.findMany({ where: { isActive: true }, orderBy: { order: 'asc' }, take: 8 }),
    ]);
    const payload = articles.map(articlePayload);
    const byType = (slug: string) => payload.filter(article => article.category.slug === slug);
    res.json({
      status: 'success',
      data: {
        featured: payload.find(article => article.is_featured) || payload[0] || null,
        hero_side: payload.slice(1, 4),
        breaking: breaking.map(item => ({
          title_ar: item.textAr,
          title_en: item.textEn || item.textAr,
          slug: item.link || 'breaking-news',
          excerpt_ar: item.textAr,
          excerpt_en: item.textEn || item.textAr,
          category: { name_ar: 'عاجل', name_en: 'Breaking', slug: 'breaking' },
          article_type: 'news',
          published_at: item.createdAt.toISOString(),
        })),
        latest: payload,
        company_updates: byType('company-updates'),
        guides: byType('guides'),
        videos: byType('videos'),
        case_studies: byType('case-studies'),
        categories: categories.map(category => ({
          id: category.id,
          name_ar: category.nameAr,
          name_en: category.nameEn,
          slug: category.slug,
        })),
        trending: payload.filter(article => article.is_trending).slice(0, 8).concat(payload.slice(0, 8)).slice(0, 8),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getNewsArticleBySlug = async (req: Request, res: Response) => {
  try {
    const cats = await categoryMap();
    const article = await prisma.newsArticle.findFirst({
      where: { slug: req.params.slug, status: 'published' },
      include: { author: true },
    });
    if (!article) return res.status(404).json({ message: 'Article not found' });
    const latest = await publishedArticles({}, 6);
    const payload = articlePayload({ ...article, categoryRef: cats.get(article.category) });
    res.json({
      status: 'success',
      data: {
        ...payload,
        latest_articles: latest.map(articlePayload),
        trending_articles: latest.filter(item => item.featured).map(articlePayload),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getNewsCategoryArticles = async (req: Request, res: Response) => {
  try {
    const articles = await publishedArticles({ category: req.params.slug }, 30);
    res.json({ status: 'success', data: articles.map(articlePayload) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const subscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const data = newsletterSchema.parse(req.body);
    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email: data.email },
      update: { name: data.name, isActive: true },
      create: { email: data.email, name: data.name },
    });
    res.status(201).json({ status: 'success', data: subscriber });
  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message || 'Invalid email' });
  }
};
