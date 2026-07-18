'use client';

/**
 * Public, price-free models shared by the growth surfaces.  Keep this file
 * deliberately tolerant while the CMS payload is being rolled out so an old
 * backend never breaks the public experience.
 */
export type GrowthGoalKey = 'sales' | 'brand' | 'platform' | 'content' | 'automation';

export interface PublicService {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  contentAr?: string | null;
  contentEn?: string | null;
  featuresAr?: string[];
  featuresEn?: string[];
  icon?: string | null;
  coverImage?: string | null;
  goalKeys: GrowthGoalKey[];
  themeKey?: string | null;
  destinationType?: 'dynamic' | 'internal' | string | null;
  destinationPath?: string | null;
  order: number;
  projects?: PublicPortfolioProject[];
}

export interface PublicPortfolioProject {
  id: string;
  slug?: string | null;
  titleAr: string;
  titleEn: string;
  summaryAr?: string | null;
  summaryEn?: string | null;
  coverImage?: string | null;
  serviceSlugs: string[];
  href?: string | null;
}

export interface PublicMetric {
  id: string;
  value: string;
  labelAr: string;
  labelEn: string;
  detailAr?: string | null;
  detailEn?: string | null;
}

export interface PublicTestimonial {
  id: string;
  quoteAr: string;
  quoteEn: string;
  nameAr: string;
  nameEn: string;
  roleAr?: string | null;
  roleEn?: string | null;
  companyAr?: string | null;
  companyEn?: string | null;
  avatar?: string | null;
}

export interface PublicPartner {
  id: string;
  name: string;
  logo?: string | null;
}

export interface PublicProcessStep {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
}

export interface PublicHomePayload {
  page?: unknown;
  services: PublicService[];
  portfolio: PublicPortfolioProject[];
  testimonials: PublicTestimonial[];
  partners: PublicPartner[];
  metrics: PublicMetric[];
}

type AnyRecord = Record<string, any>;

const asRecord = (value: unknown): AnyRecord | null => (
  value && typeof value === 'object' && !Array.isArray(value) ? value as AnyRecord : null
);

const asText = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
};

const localizedText = (value: unknown, lang: 'ar' | 'en') => {
  const record = asRecord(value);
  return asText(record?.[lang], record?.[lang === 'ar' ? 'arabic' : 'english']);
};

const localizedList = (value: unknown, lang: 'ar' | 'en') => {
  const direct = Array.isArray(value) ? value : asRecord(value)?.[lang] ?? asRecord(value)?.[lang === 'ar' ? 'arabic' : 'english'];
  if (Array.isArray(direct)) return direct.filter((item): item is string => typeof item === 'string' && Boolean(item.trim())).map((item) => item.trim());
  if (typeof direct === 'string' && direct.trim()) return direct.split('\n').map((item) => item.trim()).filter(Boolean);
  return [];
};

const goalAliases: Record<string, GrowthGoalKey> = {
  sales: 'sales',
  sale: 'sales',
  'increase-sales': 'sales',
  growth: 'sales',
  brand: 'brand',
  branding: 'brand',
  'build-brand': 'brand',
  platform: 'platform',
  web: 'platform',
  app: 'platform',
  'launch-platform': 'platform',
  content: 'content',
  'create-content': 'content',
  automation: 'automation',
  ai: 'automation',
  'automate-work': 'automation',
};

export function normalizeGoalKeys(value: unknown): GrowthGoalKey[] {
  const rawItems = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split(',')
      : [];
  const keys = rawItems
    .map((item) => typeof item === 'string' ? goalAliases[item.trim().toLowerCase()] : undefined)
    .filter((item): item is GrowthGoalKey => Boolean(item));
  return [...new Set(keys)];
}

function normalizeService(value: unknown, index: number): PublicService | null {
  const item = asRecord(value);
  if (!item) return null;
  const titles = asRecord(item.title);
  const descriptions = asRecord(item.description);
  const content = asRecord(item.content ?? item.details);
  const features = item.features ?? item.featureList;
  const slug = asText(item.slug, item.id);
  const titleAr = asText(item.titleAr, localizedText(titles, 'ar'));
  const titleEn = asText(item.titleEn, localizedText(titles, 'en'), titleAr);
  if (!slug || !titleAr && !titleEn) return null;

  return {
    id: String(item.id ?? slug),
    slug,
    titleAr: titleAr || titleEn,
    titleEn: titleEn || titleAr,
    descAr: asText(item.descAr, item.descriptionAr, localizedText(descriptions, 'ar')),
    descEn: asText(item.descEn, item.descriptionEn, localizedText(descriptions, 'en')),
    contentAr: asText(item.contentAr, item.detailsAr, localizedText(content, 'ar')) || null,
    contentEn: asText(item.contentEn, item.detailsEn, localizedText(content, 'en')) || null,
    featuresAr: localizedList(item.featuresAr ?? features, 'ar'),
    featuresEn: localizedList(item.featuresEn ?? features, 'en'),
    icon: asText(item.icon, item.iconName) || null,
    coverImage: asText(item.coverImage, item.image, item.imageUrl, item.coverImageId) || null,
    goalKeys: normalizeGoalKeys(item.goalKeys ?? item.goals ?? item.growthGoals),
    themeKey: asText(item.themeKey, item.theme) || null,
    destinationType: asText(item.destinationType, item.destination?.type) || null,
    destinationPath: asText(item.destinationPath, item.destination?.path, item.internalPath) || null,
    order: Number.isFinite(Number(item.order)) ? Number(item.order) : index,
    // The public service endpoint calls its linked work `portfolios`, while
    // older surfaces used `projects`. Keep one client-side contract for both.
    projects: (Array.isArray(item.projects) ? item.projects : Array.isArray(item.portfolios) ? item.portfolios : [])
      .map(normalizeProject)
      .filter((project): project is PublicPortfolioProject => Boolean(project)),
  };
}

function serviceSlugsForProject(item: AnyRecord) {
  const candidates = item.serviceSlugs ?? item.services ?? item.serviceIds ?? [];
  const rawItems = Array.isArray(candidates) ? candidates : typeof candidates === 'string' ? candidates.split(',') : [];
  return [...new Set(rawItems.map((entry) => {
    if (typeof entry === 'string') return entry;
    const service = asRecord(entry);
    return asText(service?.slug, service?.id);
  }).filter(Boolean))];
}

export function normalizeProject(value: unknown): PublicPortfolioProject | null {
  const item = asRecord(value);
  if (!item) return null;
  const titles = asRecord(item.title);
  const summaries = asRecord(item.summary ?? item.description);
  const titleAr = asText(item.titleAr, localizedText(titles, 'ar'));
  const titleEn = asText(item.titleEn, localizedText(titles, 'en'), titleAr);
  if (!titleAr && !titleEn) return null;

  return {
    id: String(item.id ?? item.slug ?? `${titleAr}-${titleEn}`),
    slug: asText(item.slug) || null,
    titleAr: titleAr || titleEn,
    titleEn: titleEn || titleAr,
    summaryAr: asText(item.summaryAr, item.descriptionAr, localizedText(summaries, 'ar')) || null,
    summaryEn: asText(item.summaryEn, item.descriptionEn, localizedText(summaries, 'en')) || null,
    coverImage: asText(item.coverImage, item.image, item.imageUrl, item.coverImageId) || null,
    serviceSlugs: serviceSlugsForProject(item),
    href: asText(item.href, item.url, item.websiteUrl) || null,
  };
}

function normalizeMetric(value: unknown, index: number): PublicMetric | null {
  const item = asRecord(value);
  if (!item) return null;
  const label = asRecord(item.label);
  const detail = asRecord(item.detail);
  const valueText = asText(item.value, item.number, item.metric);
  const labelAr = asText(item.labelAr, localizedText(label, 'ar'));
  const labelEn = asText(item.labelEn, localizedText(label, 'en'), labelAr);
  if (!valueText || !labelAr && !labelEn) return null;
  return {
    id: String(item.id ?? index),
    value: valueText,
    labelAr: labelAr || labelEn,
    labelEn: labelEn || labelAr,
    detailAr: asText(item.detailAr, localizedText(detail, 'ar')) || null,
    detailEn: asText(item.detailEn, localizedText(detail, 'en')) || null,
  };
}

function normalizeTestimonial(value: unknown, index: number): PublicTestimonial | null {
  const item = asRecord(value);
  if (!item) return null;
  const quote = asRecord(item.quote ?? item.text);
  const names = asRecord(item.name);
  const roles = asRecord(item.role);
  const companies = asRecord(item.company);
  const quoteAr = asText(item.quoteAr, item.textAr, localizedText(quote, 'ar'));
  const quoteEn = asText(item.quoteEn, item.textEn, localizedText(quote, 'en'), quoteAr);
  const nameAr = asText(item.nameAr, localizedText(names, 'ar'));
  const nameEn = asText(item.nameEn, localizedText(names, 'en'), nameAr);
  if (!quoteAr && !quoteEn || !nameAr && !nameEn) return null;
  return {
    id: String(item.id ?? index),
    quoteAr: quoteAr || quoteEn,
    quoteEn: quoteEn || quoteAr,
    nameAr: nameAr || nameEn,
    nameEn: nameEn || nameAr,
    roleAr: asText(item.roleAr, localizedText(roles, 'ar')) || null,
    roleEn: asText(item.roleEn, localizedText(roles, 'en')) || null,
    companyAr: asText(item.companyAr, localizedText(companies, 'ar')) || null,
    companyEn: asText(item.companyEn, localizedText(companies, 'en')) || null,
    avatar: asText(item.avatar, item.avatarUrl, item.image, item.imageUrl) || null,
  };
}

function normalizePartner(value: unknown, index: number): PublicPartner | null {
  const item = asRecord(value);
  if (!item) return null;
  const name = asText(item.name, item.title);
  if (!name) return null;
  return {
    id: String(item.id ?? index),
    name,
    logo: asText(item.logo, item.logoUrl, item.image, item.imageUrl) || null,
  };
}

export function normalizePublicServices(value: unknown): PublicService[] {
  const record = asRecord(value);
  const items = Array.isArray(value)
    ? value
    : Array.isArray(record?.services)
      ? record.services
      : Array.isArray(record?.data)
        ? record.data
        : [];
  const services = items.map(normalizeService).filter((service): service is PublicService => Boolean(service));
  return services.sort((a, b) => a.order - b.order);
}

export function normalizeHomePayload(value: unknown): PublicHomePayload {
  const payload = asRecord(value) ?? {};
  const home = asRecord(payload.home) ?? {};
  const services = normalizePublicServices(payload.services ?? home.services);
  const portfolio = (Array.isArray(payload.portfolio)
    ? payload.portfolio
    : Array.isArray(payload.portfolios)
      ? payload.portfolios
      : Array.isArray(payload.projects)
        ? payload.projects
        : Array.isArray(home.portfolio)
          ? home.portfolio
          : Array.isArray(home.portfolios)
            ? home.portfolios
            : Array.isArray(home.projects)
              ? home.projects
              : [])
    .map(normalizeProject)
    .filter((project): project is PublicPortfolioProject => Boolean(project));

  return {
    page: payload.page ?? home.page ?? payload.home ?? null,
    services,
    portfolio,
    testimonials: (Array.isArray(payload.testimonials) ? payload.testimonials : Array.isArray(home.testimonials) ? home.testimonials : [])
      .map(normalizeTestimonial)
      .filter((testimonial): testimonial is PublicTestimonial => Boolean(testimonial)),
    partners: (Array.isArray(payload.partners) ? payload.partners : Array.isArray(home.partners) ? home.partners : [])
      .map(normalizePartner)
      .filter((partner): partner is PublicPartner => Boolean(partner)),
    metrics: (Array.isArray(payload.metrics) ? payload.metrics : Array.isArray(home.metrics) ? home.metrics : [])
      .map(normalizeMetric)
      .filter((metric): metric is PublicMetric => Boolean(metric)),
  };
}

export function readHomeText(page: unknown, sectionKey: string, field: string, lang: 'ar' | 'en', fallback: string) {
  const record = asRecord(page);
  const sections = Array.isArray(record?.sections) ? record?.sections : [];
  const section = sections.find((item: unknown) => asRecord(item)?.key === sectionKey);
  const sectionContent = asRecord(asRecord(section)?.content);
  const direct = asRecord(record?.[sectionKey]);
  const content = direct ?? sectionContent;
  const localized = asRecord(content?.[lang]) ?? content;
  const aliases: Record<string, string[]> = {
    eyebrow: ['eyebrow', 'kicker', 'label'],
    title: ['title', 'heading'],
    subtitle: ['subtitle', 'description', 'body'],
    choosePath: ['choosePath', 'servicesCta', 'primaryCta', 'ctaPrimary'],
    startProject: ['startProject', 'contactCta', 'secondaryCta', 'ctaSecondary'],
    cta: ['cta', 'buttonText', 'primaryCta', 'ctaPrimary'],
  };
  const fields = aliases[field] ?? [field];
  return asText(...fields.flatMap((field) => [localized?.[field], content?.[field]])) || fallback;
}

export function readHomeSteps(page: unknown, sectionKey = 'process'): PublicProcessStep[] {
  const record = asRecord(page);
  const sections = Array.isArray(record?.sections) ? record?.sections : [];
  const section = sections.find((item: unknown) => asRecord(item)?.key === sectionKey);
  const content = asRecord(record?.[sectionKey]) ?? asRecord(asRecord(section)?.content);
  const arContent = asRecord(content?.ar) ?? content ?? {};
  const enContent = asRecord(content?.en) ?? content ?? {};
  // HomeControlCenter intentionally uses a friendly one-line-per-step editor.
  // Accept that form alongside the richer array shape returned by older CMSes.
  const asSteps = (value: unknown): unknown[] => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return value.split(/\r?\n/).map(item => item.trim()).filter(Boolean);
    return [];
  };
  const arSteps = asSteps(arContent.steps ?? content?.steps);
  const enSteps = asSteps(enContent.steps);
  const count = Math.max(arSteps.length, enSteps.length);

  return Array.from({ length: count }, (_, index) => {
    const arValue = arSteps[index];
    const enValue = enSteps[index];
    const arItem = asRecord(arValue) ?? {};
    const enItem = asRecord(enValue) ?? {};
    const arTitle = asText(
      typeof arValue === 'string' ? arValue : undefined,
      arItem.titleAr,
      arItem.title,
      localizedText(asRecord(arItem.title), 'ar'),
      asRecord(arItem.ar)?.title,
    );
    const enTitle = asText(
      typeof enValue === 'string' ? enValue : undefined,
      enItem.titleEn,
      enItem.title,
      localizedText(asRecord(enItem.title), 'en'),
      asRecord(enItem.en)?.title,
      arTitle,
    );
    const arDescription = asText(
      arItem.descriptionAr,
      arItem.descAr,
      arItem.description,
      localizedText(asRecord(arItem.description), 'ar'),
      asRecord(arItem.ar)?.description,
    );
    const enDescription = asText(
      enItem.descriptionEn,
      enItem.descEn,
      enItem.description,
      localizedText(asRecord(enItem.description), 'en'),
      asRecord(enItem.en)?.description,
      arDescription,
    );
    return {
      titleAr: arTitle || enTitle,
      titleEn: enTitle || arTitle,
      descriptionAr: arDescription,
      descriptionEn: enDescription,
    };
  }).filter((step: PublicProcessStep) => Boolean(step.titleAr || step.titleEn));
}
