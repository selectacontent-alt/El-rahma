import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();

const pageSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  titleAr: z.string().min(1),
  titleEn: z.string().optional().nullable(),
  metaTitleAr: z.string().optional().nullable(),
  metaTitleEn: z.string().optional().nullable(),
  metaDescAr: z.string().optional().nullable(),
  metaDescEn: z.string().optional().nullable(),
  status: z.enum(['draft', 'published']).optional(),
});

const sectionSchema = z.object({
  key: z.string().min(1).regex(/^[a-z0-9_.-]+$/),
  labelAr: z.string().min(1),
  labelEn: z.string().optional().nullable(),
  type: z.string().default('content'),
  content: z.union([z.string(), z.record(z.any()), z.array(z.any())]),
  draftContent: z.union([z.string(), z.record(z.any()), z.array(z.any())]).optional().nullable(),
  order: z.coerce.number().int().default(0),
  isVisible: z.coerce.boolean().default(true),
});

const sectionUpdateSchema = sectionSchema.partial();

const userCreateSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(10),
  role: z.enum(['admin', 'editor']).default('editor'),
  isActive: z.boolean().default(true),
  mustChangePassword: z.boolean().default(true),
});

const userUpdateSchema = z.object({
  role: z.enum(['admin', 'editor']).optional(),
  isActive: z.boolean().optional(),
  mustChangePassword: z.boolean().optional(),
});

const resetPasswordSchema = z.object({
  password: z.string().min(10),
  mustChangePassword: z.boolean().default(true),
});

const mediaAssetSchema = z.object({
  fileId: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  thumbnailUrl: z.string().optional().nullable(),
  fileName: z.string().min(1),
  originalName: z.string().optional().nullable(),
  driveName: z.string().optional().nullable(),
  mimeType: z.string().optional().nullable(),
  folder: z.string().optional().nullable(),
  scope: z.string().optional().nullable(),
  driveFolderId: z.string().optional().nullable(),
  driveFolderPath: z.string().optional().nullable(),
  sizeBytes: z.coerce.number().int().optional().nullable(),
  kind: z.string().optional().nullable(),
  altAr: z.string().optional().nullable(),
  altEn: z.string().optional().nullable(),
});

function asContent(value: unknown) {
  return typeof value === 'string' ? value : JSON.stringify(value ?? {});
}

export const listPages = async (_req: Request, res: Response) => {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { slug: 'asc' },
      include: { _count: { select: { sections: true } } },
    });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPage = async (req: Request, res: Response) => {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: req.params.slug },
      include: { sections: { orderBy: { order: 'asc' } } },
    });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createPage = async (req: Request, res: Response) => {
  try {
    const data = pageSchema.parse(req.body);
    const page = await prisma.page.create({ data });
    res.status(201).json(page);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Invalid page data' });
  }
};

export const updatePage = async (req: Request, res: Response) => {
  try {
    const data = pageSchema.partial().omit({ slug: true }).parse(req.body);
    const page = await prisma.page.update({ where: { slug: req.params.slug }, data });
    res.json(page);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Invalid page data' });
  }
};

export const getPageSections = async (req: Request, res: Response) => {
  try {
    const page = await prisma.page.findUnique({ where: { slug: req.params.slug } });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    const sections = await prisma.pageSection.findMany({
      where: { pageId: page.id },
      orderBy: { order: 'asc' },
    });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createPageSection = async (req: Request, res: Response) => {
  try {
    const page = await prisma.page.findUnique({ where: { slug: req.params.slug } });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    const parsed = sectionSchema.parse(req.body);
    const section = await prisma.pageSection.create({
      data: {
        ...parsed,
        pageId: page.id,
        content: asContent(parsed.content),
        draftContent: parsed.draftContent === undefined || parsed.draftContent === null ? null : asContent(parsed.draftContent),
      },
    });
    res.status(201).json(section);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Invalid section data' });
  }
};

export const updatePageSection = async (req: Request, res: Response) => {
  try {
    const parsed = sectionUpdateSchema.parse(req.body);
    const data: any = { ...parsed };
    if ('content' in data) data.content = asContent(data.content);
    if ('draftContent' in data) data.draftContent = data.draftContent === null ? null : asContent(data.draftContent);
    const section = await prisma.pageSection.update({
      where: { id: Number(req.params.sectionId) },
      data,
    });
    res.json(section);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Invalid section data' });
  }
};

export const deletePageSection = async (req: Request, res: Response) => {
  try {
    await prisma.pageSection.delete({ where: { id: Number(req.params.sectionId) } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const publishPage = async (req: Request, res: Response) => {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: req.params.slug },
      include: { sections: true },
    });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    await prisma.$transaction([
      ...page.sections
        .filter(section => section.draftContent !== null)
        .map(section => prisma.pageSection.update({
          where: { id: section.id },
          data: { content: section.draftContent as string, draftContent: null },
        })),
      prisma.page.update({
        where: { slug: page.slug },
        data: { status: 'published', publishedAt: new Date() },
      }),
    ]);
    const updated = await prisma.page.findUnique({
      where: { slug: page.slug },
      include: { sections: { orderBy: { order: 'asc' } } },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const listAuditLogs = async (req: Request, res: Response) => {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 50), 1), 100);
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.adminAuditLog.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { user: { select: { username: true, role: true } } },
      }),
      prisma.adminAuditLog.count(),
    ]);
    const totalPages = Math.max(Math.ceil(total / limit), 1);
    res.json({ items, pagination: { page, limit, total, totalPages }, total, page, totalPages });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const listAdminUsers = async (req: Request, res: Response) => {
  try {
    const select = { id: true, username: true, role: true, isActive: true, mustChangePassword: true, lastLoginAt: true, createdAt: true } as const;
    const hasPagination = req.query.page !== undefined || req.query.limit !== undefined || req.query.q !== undefined;
    const search = String(req.query.q || '').trim();
    const where = search ? { username: { contains: search } } : {};
    if (!hasPagination) return res.json(await prisma.user.findMany({ where, orderBy: { createdAt: 'desc' }, select }));
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 25), 1), 100);
    const [items, total] = await Promise.all([
      prisma.user.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit, select }),
      prisma.user.count({ where }),
    ]);
    res.json({ items, pagination: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createAdminUser = async (req: Request, res: Response) => {
  try {
    const data = userCreateSchema.parse(req.body);
    const user = await prisma.user.create({
      data: {
        ...data,
        password: await bcrypt.hash(data.password, 12),
      },
      select: { id: true, username: true, role: true, isActive: true, mustChangePassword: true, createdAt: true },
    });
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Invalid user data' });
  }
};

export const updateAdminUser = async (req: Request, res: Response) => {
  try {
    const data = userUpdateSchema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data,
      select: { id: true, username: true, role: true, isActive: true, mustChangePassword: true, lastLoginAt: true },
    });
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Invalid user data' });
  }
};

export const resetAdminUserPassword = async (req: Request, res: Response) => {
  try {
    const data = resetPasswordSchema.parse(req.body);
    await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: {
        password: await bcrypt.hash(data.password, 12),
        passwordUpdatedAt: new Date(),
        mustChangePassword: data.mustChangePassword,
      },
    });
    await prisma.adminSession.updateMany({
      where: { userId: Number(req.params.id), revokedAt: null },
      data: { revokedAt: new Date() },
    });
    res.json({ message: 'Password reset successfully' });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Invalid password data' });
  }
};

export const listMediaAssets = async (req: Request, res: Response) => {
  try {
    const where: any = req.query.folder ? { folder: String(req.query.folder) } : {};
    const search = String(req.query.q || '').trim();
    if (search) {
      where.OR = [
        { fileName: { contains: search } },
        { originalName: { contains: search } },
        { driveName: { contains: search } },
      ];
    }
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 25), 1), 100);
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.mediaAsset.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      prisma.mediaAsset.count({ where }),
    ]);
    res.json({ items, pagination: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createMediaAsset = async (req: Request, res: Response) => {
  try {
    const data = mediaAssetSchema.parse(req.body);
    const asset = await prisma.mediaAsset.create({ data });
    res.status(201).json(asset);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Invalid media asset data' });
  }
};

export const updateMediaAsset = async (req: Request, res: Response) => {
  try {
    const data = mediaAssetSchema.partial().parse(req.body);
    const asset = await prisma.mediaAsset.update({ where: { id: Number(req.params.id) }, data });
    res.json(asset);
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Invalid media asset data' });
  }
};

export const deleteMediaAsset = async (req: Request, res: Response) => {
  try {
    await prisma.mediaAsset.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
