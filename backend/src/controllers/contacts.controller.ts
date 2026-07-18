import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { parsePhoneNumberFromString, validatePhoneNumberLength } from 'libphonenumber-js';
import { notifyNewContactRequest } from '../services/leadNotification.service';

const prisma = new PrismaClient();

const advertisingPlatformIds = new Set([
  'meta', 'instagram', 'tiktok', 'google', 'snapchat',
  'youtube', 'linkedin', 'x', 'whatsapp', 'other',
]);
const advertisingGoals = ['sales', 'leads', 'messages', 'awareness', 'traffic'] as const;

const advertisingDetailsSchema = z.object({
  campaignGoal: z.enum(advertisingGoals),
  platforms: z.array(z.string().trim().min(1)).min(1).max(10)
    .refine(platforms => platforms.every(platform => advertisingPlatformIds.has(platform)), 'Choose valid advertising platforms.')
    .refine(platforms => new Set(platforms).size === platforms.length, 'Advertising platforms cannot be duplicated.'),
}).passthrough();

const contactCreateSchema = z.object({
  requestType: z.enum(['contact', 'plan', 'advertising']).optional().default('contact'),
  name: z.string().trim().min(2),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  phoneCountry: z.string().regex(/^[A-Z]{2}$/).optional().nullable(),
  company: z.string().optional().nullable(),
  businessActivity: z.string().trim().max(5000).optional().nullable(),
  budget: z.coerce.number().optional().nullable(),
  planSection: z.string().trim().max(120).optional().nullable(),
  planId: z.string().trim().max(160).optional().nullable(),
  planTitle: z.string().trim().max(500).optional().nullable(),
  planPrice: z.coerce.number().finite().nonnegative().optional().nullable(),
  planCurrency: z.string().trim().max(20).optional().nullable(),
  requestDetails: z.unknown().optional().nullable(),
  selectedServices: z.union([z.string(), z.array(z.string())]).optional().nullable(),
  message: z.string().max(20000).optional().nullable(),
  source: z.string().optional(),
});

const contactStatusSchema = z.object({
  status: z.enum(['new', 'read', 'in_progress', 'won', 'lost', 'archived']),
  adminNote: z.string().optional().nullable(),
});

function selectedServiceTokens(value?: string | string[] | null): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(item => item.trim()).filter(Boolean);

  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string').map(item => item.trim()).filter(Boolean);
    }
  } catch {
    // Legacy clients used a comma-separated string.
  }
  return value.split(',').map(item => item.trim()).filter(Boolean);
}

function hasRealText(value: string | null | undefined, minimumLength = 2): value is string {
  return Boolean(value && value.trim().length >= minimumLength && /\p{L}/u.test(value));
}

function phoneDigits(value: string): string {
  const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
  const normalized = [...value].map(character => {
    const index = arabicDigits.indexOf(character);
    return index >= 0 ? String(index) : character;
  }).join('');
  return normalized.replace(/\D/g, '');
}

function normalizePhoneInput(value: string) {
  const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
  const easternArabicDigits = '۰۱۲۳۴۵۶۷۸۹';
  return [...value].map(character => {
    const arabicIndex = arabicDigits.indexOf(character);
    if (arabicIndex >= 0) return String(arabicIndex);
    const easternIndex = easternArabicDigits.indexOf(character);
    return easternIndex >= 0 ? String(easternIndex) : character;
  }).join('').replace(/[()\s.-]/g, '');
}

function validWhatsAppPhone(value: string | null | undefined, country = 'EG') {
  if (!value) return null;
  try {
    const normalized = normalizePhoneInput(value);
    if (validatePhoneNumberLength(normalized, country as any)) return null;
    const parsed = parsePhoneNumberFromString(normalized, country as any);
    if (!parsed?.isValid()) return null;
    if (country === 'EG' && /^1[0125]/.test(parsed.nationalNumber) && parsed.nationalNumber.length !== 10) return null;
    return parsed.number;
  } catch {
    return null;
  }
}

const defaultAdvertisingBudgetOptions = [10500, 15000, 20000, 25000, 30000];

async function advertisingBudgetOptions() {
  const settings = await prisma.setting.findMany({
    where: { key: { in: ['advertising_budget_options', 'advertising_budget_min', 'advertising_budget_max'] } },
  });
  const values = Object.fromEntries(settings.map(setting => [setting.key, setting.value]));
  try {
    const parsed = values.advertising_budget_options ? JSON.parse(values.advertising_budget_options) : null;
    const options = Array.isArray(parsed) ? [...new Set(parsed.map(Number))].filter(item => Number.isInteger(item) && item >= 10500).sort((a, b) => a - b) : [];
    if (options.length >= 2) return options;
  } catch {
    // Use the safe defaults when the admin value is malformed.
  }
  return defaultAdvertisingBudgetOptions;
}

function readSelectedServiceSlugs(value?: string | null): string[] {
  return selectedServiceTokens(value);
}

function contactResponse<T extends { selectedServices: string | null }>(item: T) {
  return {
    ...item,
    // Keep selectedServices untouched for old lead screens; this normalized
    // field lets new admin clients read both legacy strings and slug arrays.
    selectedServiceSlugs: readSelectedServiceSlugs(item.selectedServices),
  };
}

async function selectedServiceSlugs(value?: string | string[] | null): Promise<string | null> {
  const tokens = [...new Set(selectedServiceTokens(value))];
  if (!tokens.length) return null;

  const services = await prisma.service.findMany({
    where: { isActive: true },
    select: { id: true, slug: true, titleAr: true, titleEn: true },
  });
  const byToken = new Map<string, string>();
  for (const service of services) {
    const stableSlug = service.slug || `service-${service.id}`;
    byToken.set(stableSlug.toLowerCase(), stableSlug);
    byToken.set(String(service.id), stableSlug);
    byToken.set(service.titleEn.trim().toLowerCase(), stableSlug);
    byToken.set(service.titleAr.trim(), stableSlug);
  }

  const slugs: string[] = [];
  for (const token of tokens) {
    const slug = byToken.get(token.toLowerCase()) || byToken.get(token);
    if (!slug) {
      throw new z.ZodError([{ code: 'custom', path: ['selectedServices'], message: `Unknown or inactive service: ${token}` }]);
    }
    if (!slugs.includes(slug)) slugs.push(slug);
  }
  return JSON.stringify(slugs);
}

export const getAll = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const where = status ? { status: String(status) } : {};
    const items = await prisma.contactRequest.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json(items.map(contactResponse));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const item = await prisma.contactRequest.findUnique({ where: { id: Number(req.params.id) } });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(contactResponse(item));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const data = contactCreateSchema.parse(req.body);
    let normalizedPhone = data.phone || null;
    if (data.requestType !== 'contact') {
      if (!hasRealText(data.name, 2)) {
        throw new z.ZodError([{ code: 'custom', path: ['name'], message: 'Enter a real name.' }]);
      }
      const whatsappPhone = validWhatsAppPhone(data.phone, data.phoneCountry || 'EG');
      if (!whatsappPhone) {
        throw new z.ZodError([{ code: 'custom', path: ['phone'], message: 'Enter a valid WhatsApp number for the selected country.' }]);
      }
      normalizedPhone = whatsappPhone;
      if (!hasRealText(data.businessActivity, 3) && !hasRealText(data.company, 2)) {
        throw new z.ZodError([{ code: 'custom', path: ['businessActivity'], message: 'Business activity is required for plan requests.' }]);
      }
    }
    if (data.requestType === 'plan' && !hasRealText(data.planTitle, 2)) {
      throw new z.ZodError([{ code: 'custom', path: ['planTitle'], message: 'A valid plan title is required.' }]);
    }
    if (data.requestType === 'advertising') {
      const details = data.requestDetails && typeof data.requestDetails === 'object'
        ? data.requestDetails as Record<string, unknown>
        : {};
      const budget = Number(data.budget ?? details.monthlyBudget);
      let validatedDetails: z.infer<typeof advertisingDetailsSchema>;
      try {
        validatedDetails = advertisingDetailsSchema.parse(details);
      } catch (error) {
        if (error instanceof z.ZodError) throw error;
        throw new z.ZodError([{ code: 'custom', path: ['requestDetails'], message: 'Campaign details are invalid.' }]);
      }
      const budgetOptions = await advertisingBudgetOptions();
      if (!Number.isInteger(budget) || !budgetOptions.includes(budget)) {
        throw new z.ZodError([{ code: 'custom', path: ['budget'], message: `Choose one of the configured advertising budgets: ${budgetOptions.join(', ')}.` }]);
      }
      // Keep this explicit so TypeScript and future edits cannot accidentally
      // drop validation of the normalized campaign details.
      if (!validatedDetails.platforms.length) throw new z.ZodError([{ code: 'custom', path: ['requestDetails', 'platforms'], message: 'Select at least one advertising platform.' }]);
    }
    const normalizedServices = await selectedServiceSlugs(data.selectedServices);
    const requestBudget = data.requestType === 'advertising'
      ? Number(data.budget ?? (data.requestDetails && typeof data.requestDetails === 'object'
        ? (data.requestDetails as Record<string, unknown>).monthlyBudget
        : null))
      : data.budget;
    const item = await prisma.contactRequest.create({
      data: {
        requestType: data.requestType,
        name: data.name,
        email: data.email || null,
        phone: normalizedPhone,
        company: data.company || null,
        businessActivity: data.businessActivity || null,
        budget: Number.isFinite(requestBudget) ? requestBudget : null,
        planSection: data.planSection || null,
        planId: data.planId || null,
        planTitle: data.planTitle || null,
        planPrice: data.planPrice ?? null,
        planCurrency: data.planCurrency || null,
        requestDetails: data.requestDetails ?? undefined,
        selectedServices: normalizedServices,
        message: data.message?.trim() || data.planTitle || data.businessActivity || 'Website lead',
        source: data.source || 'website',
      },
    });
    try {
      const notificationSettings = await prisma.setting.findMany({
        where: {
          key: {
            in: ['lead_notification_email', 'admin_email', 'contact_email', 'email'],
          },
        },
      });
      await notifyNewContactRequest(item, notificationSettings);
    } catch (notificationError: any) {
      console.error('Lead notification failed:', notificationError?.message || notificationError);
    }
    res.status(201).json(contactResponse(item));
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Invalid contact data' });
  }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const data = contactStatusSchema.parse(req.body);
    const item = await prisma.contactRequest.update({
      where: { id: Number(req.params.id) },
      data,
    });
    res.json(contactResponse(item));
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Invalid status data' });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await prisma.contactRequest.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
