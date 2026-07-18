import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z, ZodError } from 'zod';
import {
  GROWTH_GOAL_KEYS,
  SERVICE_THEMES,
  parseStringArray,
  serializeStringArray,
  toPublicService,
} from '../utils/publicService';

const prisma = new PrismaClient();

const publicPortfolioSelect = {
  id: true,
  titleAr: true,
  titleEn: true,
  category: true,
  image: true,
  featured: true,
} as const;

const adminPortfolioSelect = {
  id: true,
  titleAr: true,
  titleEn: true,
  image: true,
  isActive: true,
} as const;

const trimNullableString = (max: number) => z.preprocess(
  value => typeof value === 'string' && value.trim() === '' ? null : value,
  z.string().trim().max(max).nullable().optional(),
);

const stringList = (maxItems: number, maxItemLength: number) => z.preprocess(value => {
  if (typeof value !== 'string') return value;
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Accept the old newline-separated editor format as well as JSON arrays.
  }
  return value.split('\n').map(item => item.trim()).filter(Boolean);
}, z.array(z.string().trim().min(1).max(maxItemLength)).max(maxItems));

const optionalBoolean = z.preprocess(value => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
}, z.boolean().optional());

const optionalPrice = z.preprocess(value => {
  if (value === '' || value === undefined) return null;
  return value;
}, z.coerce.number().finite().nonnegative().nullable().optional());

const internalPathSchema = z.string().trim()
  .min(1)
  .max(240)
  .regex(/^\/(?!\/)(?!.*\.\.)[A-Za-z0-9_/?=&%#.-]*$/, 'Internal paths must be safe relative paths.');

const serviceFieldsSchema = z.object({
  titleAr: z.string().trim().min(1).max(160),
  titleEn: z.string().trim().min(1).max(160),
  descAr: z.string().trim().min(1).max(2000),
  descEn: z.string().trim().min(1).max(2000),
  detailsAr: trimNullableString(20000),
  detailsEn: trimNullableString(20000),
  image: trimNullableString(1024),
  features: stringList(30, 300).optional(),
  goalKeys: stringList(5, 32).pipe(z.array(z.enum(GROWTH_GOAL_KEYS)).max(5)).optional(),
  theme: z.enum(SERVICE_THEMES).optional(),
  destinationType: z.enum(['dynamic', 'internal']).optional(),
  internalPath: z.preprocess(
    value => typeof value === 'string' && value.trim() === '' ? null : value,
    internalPathSchema.nullable().optional(),
  ),
  icon: z.string().trim().min(1).max(80).optional(),
  price: optionalPrice,
  order: z.coerce.number().int().min(0).max(100000).optional(),
  isActive: optionalBoolean,
});

const slugSchema = z.string().trim().toLowerCase().min(2).max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must use lowercase letters, numbers, and hyphens only.');

const portfolioIdsSchema = z.preprocess(value => {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value.split(',').map(item => item.trim()).filter(Boolean);
  }
}, z.array(z.coerce.number().int().positive()).max(100));

const serviceCreateSchema = serviceFieldsSchema.extend({
  slug: slugSchema.optional(),
  portfolioIds: portfolioIdsSchema.optional(),
}).strict();

const serviceUpdateSchema = serviceFieldsSchema.partial().extend({
  slug: slugSchema.optional(),
  portfolioIds: portfolioIdsSchema.optional(),
}).strict();

function serviceId(req: Request): number | null {
  const id = Number(req.params.id);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function isKnownRequestError(error: unknown, code: string): boolean {
  return Boolean(error && typeof error === 'object' && 'code' in error && (error as { code?: string }).code === code);
}

function sendServiceError(res: Response, error: unknown) {
  if (error instanceof ZodError) {
    return res.status(400).json({ message: 'Invalid service data', issues: error.issues });
  }
  if (isKnownRequestError(error, 'P2002')) {
    return res.status(409).json({ message: 'A service with this slug already exists.' });
  }
  if (isKnownRequestError(error, 'P2025')) {
    return res.status(404).json({ message: 'Service or linked portfolio not found.' });
  }
  console.error('Service request failed:', error);
  return res.status(500).json({ message: 'Server error' });
}

function slugBase(value: string): string {
  const base = value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
  return base || 'service';
}

async function nextAvailableSlug(titleEn: string): Promise<string> {
  const base = slugBase(titleEn);
  let candidate = base;
  let suffix = 2;

  while (await prisma.service.findUnique({ where: { slug: candidate }, select: { id: true } })) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

async function ensurePortfolioIdsExist(portfolioIds?: number[]) {
  if (!portfolioIds?.length) return;
  const distinctIds = [...new Set(portfolioIds)];
  const count = await prisma.portfolio.count({ where: { id: { in: distinctIds } } });
  if (count !== distinctIds.length) {
    const error = new ZodError([{ code: 'custom', path: ['portfolioIds'], message: 'One or more selected portfolios do not exist.' }]);
    throw error;
  }
}

function toAdminService(service: any) {
  const portfolios = Array.isArray(service.portfolios) ? service.portfolios : [];
  return {
    ...service,
    features: parseStringArray(service.features),
    goalKeys: parseStringArray(service.goalKeys),
    portfolioIds: portfolios.map((portfolio: { id: number }) => portfolio.id),
    portfolios,
  };
}

function serviceDataFromInput(input: z.infer<typeof serviceCreateSchema> | z.infer<typeof serviceUpdateSchema>) {
  const { portfolioIds: _portfolioIds, features, goalKeys, internalPath, destinationType, ...serviceFields } = input;
  const type = destinationType === 'internal' ? 'internal' : destinationType === 'dynamic' ? 'dynamic' : undefined;

  return {
    ...serviceFields,
    ...(features !== undefined ? { features: serializeStringArray(features) } : {}),
    ...(goalKeys !== undefined ? { goalKeys: serializeStringArray(goalKeys) } : {}),
    ...(type ? { destinationType: type, internalPath: type === 'internal' ? internalPath ?? null : null } : {}),
    ...(destinationType === undefined && internalPath !== undefined ? { internalPath } : {}),
  };
}

function validateDestination(destinationType: string, internalPath: string | null | undefined) {
  if (destinationType === 'internal' && !internalPath) {
    throw new ZodError([{ code: 'custom', path: ['internalPath'], message: 'An internal destination requires an internalPath.' }]);
  }
}

// ─── Public service DTOs ─────────────────────────────────────────────────────

async function findActivePublicServices() {
  return prisma.service.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    include: {
      portfolios: {
        where: { isActive: true },
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        select: publicPortfolioSelect,
      },
    },
  });
}

export const getPublicServices = async (_req: Request, res: Response) => {
  try {
    const services = await findActivePublicServices();
    res.json({ status: 'success', data: services.map(toPublicService) });
  } catch (error) {
    sendServiceError(res, error);
  }
};

export const getPublicServiceBySlug = async (req: Request, res: Response) => {
  try {
    const slug = String(req.params.slug || '').trim().toLowerCase();
    if (!slug) return res.status(404).json({ message: 'Service not found' });

    const include = {
      portfolios: {
        where: { isActive: true },
        orderBy: [{ featured: 'desc' as const }, { createdAt: 'desc' as const }],
        select: publicPortfolioSelect,
      },
    };
    const service = await prisma.service.findFirst({ where: { slug, isActive: true }, include });

    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ status: 'success', data: toPublicService(service) });
  } catch (error) {
    sendServiceError(res, error);
  }
};

export const getPublicServiceById = async (req: Request, res: Response) => {
  try {
    const id = serviceId(req);
    if (!id) return res.status(404).json({ message: 'Service not found' });
    const service = await prisma.service.findFirst({
      where: { id, isActive: true },
      include: {
        portfolios: {
          where: { isActive: true },
          orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
          select: publicPortfolioSelect,
        },
      },
    });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(toPublicService(service));
  } catch (error) {
    sendServiceError(res, error);
  }
};

// ─── Admin service CRUD ─────────────────────────────────────────────────────

export const getAdminServices = async (_req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
      include: { portfolios: { select: adminPortfolioSelect } },
    });
    res.json(services.map(toAdminService));
  } catch (error) {
    sendServiceError(res, error);
  }
};

export const createAdminService = async (req: Request, res: Response) => {
  try {
    const input = serviceCreateSchema.parse(req.body);
    const slug = input.slug || await nextAvailableSlug(input.titleEn);
    const destinationType = input.destinationType || 'dynamic';
    const internalPath = destinationType === 'internal' ? input.internalPath : null;
    validateDestination(destinationType, internalPath);
    await ensurePortfolioIdsExist(input.portfolioIds);

    const service = await prisma.service.create({
      data: {
        ...serviceDataFromInput({ ...input, slug, destinationType, internalPath }),
        icon: input.icon || 'Sparkles',
        theme: input.theme || 'plum',
        destinationType,
        internalPath,
        price: input.price ?? null,
        order: input.order ?? 0,
        isActive: input.isActive ?? true,
        portfolios: input.portfolioIds === undefined
          ? undefined
          : { connect: [...new Set(input.portfolioIds)].map(id => ({ id })) },
      } as any,
      include: { portfolios: { select: adminPortfolioSelect } },
    });
    res.status(201).json(toAdminService(service));
  } catch (error) {
    sendServiceError(res, error);
  }
};

export const updateAdminService = async (req: Request, res: Response) => {
  try {
    const id = serviceId(req);
    if (!id) return res.status(404).json({ message: 'Service not found' });
    const input = serviceUpdateSchema.parse(req.body);
    const current = await prisma.service.findUnique({ where: { id } });
    if (!current) return res.status(404).json({ message: 'Service not found' });

    if (input.slug && current.slug && input.slug !== current.slug) {
      return res.status(409).json({ message: 'Slug changes are blocked to protect existing service links.' });
    }
    if (input.slug && input.slug !== current.slug) {
      const duplicate = await prisma.service.findFirst({ where: { slug: input.slug, NOT: { id } }, select: { id: true } });
      if (duplicate) return res.status(409).json({ message: 'A service with this slug already exists.' });
    }

    const destinationType: 'dynamic' | 'internal' = input.destinationType
      || (current.destinationType === 'internal' ? 'internal' : 'dynamic');
    const internalPath = destinationType === 'internal'
      ? (input.internalPath === undefined ? current.internalPath : input.internalPath)
      : null;
    validateDestination(destinationType, internalPath);
    await ensurePortfolioIdsExist(input.portfolioIds);

    const data: any = {
      ...serviceDataFromInput({ ...input, destinationType, internalPath }),
      destinationType,
      internalPath,
    };
    if (input.portfolioIds !== undefined) {
      data.portfolios = { set: [...new Set(input.portfolioIds)].map(id => ({ id })) };
    }

    const service = await prisma.service.update({
      where: { id },
      data,
      include: { portfolios: { select: adminPortfolioSelect } },
    });
    res.json(toAdminService(service));
  } catch (error) {
    sendServiceError(res, error);
  }
};

export const deleteAdminService = async (req: Request, res: Response) => {
  try {
    const id = serviceId(req);
    if (!id) return res.status(404).json({ message: 'Service not found' });
    await prisma.service.delete({ where: { id } });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    sendServiceError(res, error);
  }
};

// Existing /api/services routes remain available, now using the safe public DTO
// for reads and the same validated service writes for authenticated admins.
export const getAll = async (_req: Request, res: Response) => {
  try {
    const services = await findActivePublicServices();
    res.json(services.map(toPublicService));
  } catch (error) {
    sendServiceError(res, error);
  }
};
export const getOne = getPublicServiceById;
export const create = createAdminService;
export const update = updateAdminService;
export const remove = deleteAdminService;
