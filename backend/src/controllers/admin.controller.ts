import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

function readPagination(query: Request['query']) {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.min(Math.max(Number(query.limit || 25), 1), 100);
  return { page, limit, skip: (page - 1) * limit };
}

function listEnvelope<T>(items: T[], total: number, page: number, limit: number) {
  return { items, pagination: { page, limit, total, totalPages: Math.max(Math.ceil(total / limit), 1) } };
}
const contactStatusSchema = z.object({
  status: z.enum(['new', 'read', 'in_progress', 'won', 'lost', 'archived']),
  adminNote: z.string().optional().nullable(),
});

const partnerSchema = z.object({
  name: z.string().trim().min(1, 'Partner name is required'),
  logoUrl: z.string().trim().min(1, 'Partner logo is required'),
  order: z.coerce.number().int().default(0),
});

const portfolioServiceSelect = {
  id: true,
  slug: true,
  titleAr: true,
  titleEn: true,
  icon: true,
} as const;

function parseServiceIds(value: unknown): number[] | undefined {
  if (value === undefined) return undefined;

  let input = value;
  if (typeof value === 'string') {
    try {
      input = JSON.parse(value);
    } catch {
      input = value.split(',').map(item => item.trim()).filter(Boolean);
    }
  }
  if (!Array.isArray(input)) {
    throw new z.ZodError([{ code: 'custom', path: ['serviceIds'], message: 'serviceIds must be an array.' }]);
  }

  const ids = input.map(item => Number(item));
  if (ids.some(id => !Number.isSafeInteger(id) || id <= 0)) {
    throw new z.ZodError([{ code: 'custom', path: ['serviceIds'], message: 'serviceIds must contain positive integer IDs.' }]);
  }
  return [...new Set(ids)];
}

async function ensureServiceIdsExist(serviceIds?: number[]) {
  if (!serviceIds?.length) return;
  const count = await prisma.service.count({ where: { id: { in: serviceIds } } });
  if (count !== serviceIds.length) {
    throw new z.ZodError([{ code: 'custom', path: ['serviceIds'], message: 'One or more selected services do not exist.' }]);
  }
}

function withPortfolioServiceIds(item: any) {
  const services = Array.isArray(item.services) ? item.services : [];
  return {
    ...item,
    serviceIds: services.map((service: { id: number }) => service.id),
    services,
  };
}

// ─── HOME PAGE ──────────────────────────────────────────────────────────────

export const getHomepageSettings = async (_req: Request, res: Response) => {
  try {
    const settings = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    settings.forEach(s => { map[s.key] = s.value; });
    res.json(map);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateHomepageSettings = async (req: Request, res: Response) => {
  try {
    const updates: Record<string, string> = { ...req.body };
    const currentBudgetSettings = await prisma.setting.findMany({
      where: { key: { in: ['advertising_budget_options', 'advertising_budget_min', 'advertising_budget_max', 'advertising_budget_step'] } },
    });
    const current = Object.fromEntries(currentBudgetSettings.map(setting => [setting.key, setting.value]));
    const budgetValues = { ...current, ...updates };
    const min = Number(budgetValues.advertising_budget_min);
    const max = Number(budgetValues.advertising_budget_max);
    const step = Number(budgetValues.advertising_budget_step);
    if (budgetValues.advertising_budget_options !== undefined) {
      let rawOptions: unknown = budgetValues.advertising_budget_options;
      try {
        rawOptions = JSON.parse(String(rawOptions));
      } catch {
        rawOptions = String(rawOptions).split(/[,،\n]+/);
      }
      const options = Array.isArray(rawOptions)
        ? [...new Set(rawOptions.map(Number))].filter(item => Number.isInteger(item) && item >= 10500).sort((a, b) => a - b)
        : [];
      if (options.length < 2) throw new Error('Add at least two valid advertising budget options starting from 10500.');
      updates.advertising_budget_options = JSON.stringify(options);
    }
    if (budgetValues.advertising_budget_min !== undefined || budgetValues.advertising_budget_max !== undefined || budgetValues.advertising_budget_step !== undefined) {
      if (!Number.isInteger(min) || min < 10500) throw new Error('Advertising minimum budget must be an integer of at least 10500.');
      if (!Number.isInteger(max) || max <= min) throw new Error('Advertising maximum budget must be greater than the minimum.');
      if (!Number.isInteger(step) || step <= 0) throw new Error('Advertising budget step must be a positive integer.');
      if ((max - min) % step !== 0) throw new Error('Advertising budget step must divide the full slider range.');
      updates.advertising_budget_min = String(min);
      updates.advertising_budget_max = String(max);
      updates.advertising_budget_step = String(step);
    }
    const ops = Object.entries(updates).map(([key, value]) =>
      prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } })
    );
    await Promise.all(ops);
    res.json({ message: 'Updated successfully' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────

export const getTestimonials = async (_req: Request, res: Response) => {
  try {
    const data = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(data.map(withPortfolioServiceIds));
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const t = await prisma.testimonial.create({ data: req.body });
    res.json(t);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTestimonial = async (req: Request, res: Response) => {
  try {
    const t = await prisma.testimonial.update({ where: { id: Number(req.params.id) }, data: req.body });
    res.json(t);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    await prisma.testimonial.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PARTNERS ────────────────────────────────────────────────────────────────

export const getPartners = async (_req: Request, res: Response) => {
  try {
    const data = await prisma.partner.findMany({ orderBy: { order: 'asc' } });
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createPartner = async (req: Request, res: Response) => {
  try {
    const data = partnerSchema.parse(req.body);
    const p = await prisma.partner.create({ data });
    res.json(p);
  } catch (e: any) {
    if (e instanceof z.ZodError) return res.status(400).json({ message: 'Invalid partner data', issues: e.issues });
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePartner = async (req: Request, res: Response) => {
  try {
    const data = partnerSchema.parse(req.body);
    const p = await prisma.partner.update({ where: { id: Number(req.params.id) }, data });
    res.json(p);
  } catch (e: any) {
    if (e instanceof z.ZodError) return res.status(400).json({ message: 'Invalid partner data', issues: e.issues });
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePartner = async (req: Request, res: Response) => {
  try {
    await prisma.partner.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── PORTFOLIO ───────────────────────────────────────────────────────────────

export const getPortfolioItems = async (req: Request, res: Response) => {
  try {
    const hasPagination = req.query.page !== undefined || req.query.limit !== undefined || req.query.q !== undefined;
    const search = String(req.query.q || '').trim();
    const where: any = search ? { OR: [{ titleAr: { contains: search } }, { titleEn: { contains: search } }, { clientName: { contains: search } }] } : {};
    if (!hasPagination) {
      const data = await prisma.portfolio.findMany({ where, orderBy: { createdAt: 'desc' }, include: { services: { select: portfolioServiceSelect } } });
      return res.json(data);
    }
    const { page, limit, skip } = readPagination(req.query);
    const [items, total] = await Promise.all([
      prisma.portfolio.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit, include: { services: { select: portfolioServiceSelect } } }),
      prisma.portfolio.count({ where }),
    ]);
    res.json(listEnvelope(items.map(withPortfolioServiceIds), total, page, limit));
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createPortfolioItem = async (req: Request, res: Response) => {
  try {
    const { serviceIds: rawServiceIds, services: _ignoredServices, ...portfolioData } = req.body as Record<string, unknown>;
    const serviceIds = parseServiceIds(rawServiceIds);
    await ensureServiceIdsExist(serviceIds);
    const item = await prisma.portfolio.create({
      data: {
        ...portfolioData,
        ...(serviceIds === undefined ? {} : { services: { connect: serviceIds.map(id => ({ id })) } }),
      } as any,
      include: { services: { select: portfolioServiceSelect } },
    });
    res.json(withPortfolioServiceIds(item));
  } catch (e: any) {
    if (e instanceof z.ZodError) return res.status(400).json({ message: 'Invalid portfolio service selection', issues: e.issues });
    res.status(500).json({ message: 'Server error' });
  }
};

export const updatePortfolioItem = async (req: Request, res: Response) => {
  try {
    const { serviceIds: rawServiceIds, services: _ignoredServices, ...portfolioData } = req.body as Record<string, unknown>;
    const serviceIds = parseServiceIds(rawServiceIds);
    await ensureServiceIdsExist(serviceIds);
    const item = await prisma.portfolio.update({
      where: { id: Number(req.params.id) },
      data: {
        ...portfolioData,
        ...(serviceIds === undefined ? {} : { services: { set: serviceIds.map(id => ({ id })) } }),
      } as any,
      include: { services: { select: portfolioServiceSelect } },
    });
    res.json(withPortfolioServiceIds(item));
  } catch (e: any) {
    if (e instanceof z.ZodError) return res.status(400).json({ message: 'Invalid portfolio service selection', issues: e.issues });
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePortfolioItem = async (req: Request, res: Response) => {
  try {
    await prisma.portfolio.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── SERVICES ────────────────────────────────────────────────────────────────

export const getServices = async (_req: Request, res: Response) => {
  try {
    const data = await prisma.service.findMany({ orderBy: { order: 'asc' } });
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const s = await prisma.service.create({ data: req.body });
    res.json(s);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const s = await prisma.service.update({ where: { id: Number(req.params.id) }, data: req.body });
    res.json(s);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    await prisma.service.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── CONTACTS ────────────────────────────────────────────────────────────────

export const getContacts = async (req: Request, res: Response) => {
  try {
    const where: any = {};
    if (req.query.status) where.status = String(req.query.status);
    if (req.query.requestType) where.requestType = String(req.query.requestType);
    const search = String(req.query.q || '').trim();
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { company: { contains: search } },
        { planTitle: { contains: search } },
      ];
    }
    const { page, limit, skip } = readPagination(req.query);
    const [items, total] = await Promise.all([
      prisma.contactRequest.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      prisma.contactRequest.count({ where }),
    ]);
    res.json(listEnvelope(items, total, page, limit));
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateContactStatus = async (req: Request, res: Response) => {
  try {
    const data = contactStatusSchema.parse(req.body);
    const c = await prisma.contactRequest.update({
      where: { id: Number(req.params.id) },
      data
    });
    res.json(c);
  } catch (e: any) {
    res.status(400).json({ message: e.message || 'Invalid status data' });
  }
};

export const deleteContact = async (req: Request, res: Response) => {
  try {
    await prisma.contactRequest.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── DASHBOARD STATS ─────────────────────────────────────────────────────────

export const getDashboardStats = async (_req: Request, res: Response) => {
  try {
    const [
      contacts,
      portfolio,
      testimonials,
      partners,
      services,
      websites,
      articles,
      pages,
      mediaAssets,
      newContacts,
      newPlanRequests,
      newAdvertisingRequests,
      draftArticles,
      publishedArticles,
      publishedPages,
      recentContacts,
      recentAudit,
    ] = await Promise.all([
      prisma.contactRequest.count(),
      prisma.portfolio.count(),
      prisma.testimonial.count(),
      prisma.partner.count(),
      prisma.service.count(),
      prisma.website.count(),
      prisma.newsArticle.count(),
      prisma.page.count(),
      prisma.mediaAsset.count(),
      prisma.contactRequest.count({ where: { status: 'new' } }),
      prisma.contactRequest.count({ where: { status: 'new', requestType: 'plan' } }),
      prisma.contactRequest.count({ where: { status: 'new', requestType: 'advertising' } }),
      prisma.newsArticle.count({ where: { status: 'draft' } }),
      prisma.newsArticle.count({ where: { status: 'published' } }),
      prisma.page.count({ where: { status: 'published' } }),
      prisma.contactRequest.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
      }),
      prisma.adminAuditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 6,
        include: { user: { select: { username: true } } },
      }),
    ]);
    res.json({
      contacts,
      portfolio,
      testimonials,
      partners,
      services,
      websites,
      articles,
      pages,
      mediaAssets,
      newContacts,
      newPlanRequests,
      newAdvertisingRequests,
      draftArticles,
      publishedArticles,
      publishedPages,
      recentContacts,
      recentAudit,
    });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
};
