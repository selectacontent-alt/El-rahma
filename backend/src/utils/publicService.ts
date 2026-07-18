export const GROWTH_GOAL_KEYS = ['sales', 'brand', 'platform', 'content', 'automation'] as const;

export const SERVICE_THEMES = ['plum', 'violet', 'gold', 'rose', 'ocean', 'forest', 'slate'] as const;

export type GrowthGoalKey = (typeof GROWTH_GOAL_KEYS)[number];
export type ServiceTheme = (typeof SERVICE_THEMES)[number];

type PortfolioSummarySource = {
  id: number;
  titleAr: string;
  titleEn: string;
  category: string;
  image: string;
  featured: boolean;
  isActive?: boolean;
};

type ServiceSource = {
  id: number;
  slug: string | null;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  detailsAr: string | null;
  detailsEn: string | null;
  image: string | null;
  features: string | null;
  goalKeys: string | null;
  theme: string;
  destinationType: string;
  internalPath: string | null;
  icon: string;
  order: number;
  portfolios?: PortfolioSummarySource[];
};

export type PublicService = {
  id: number;
  slug: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  detailsAr: string | null;
  detailsEn: string | null;
  image: string | null;
  imageUrl: string | null;
  icon: string;
  features: string[];
  benefits: string[];
  goalKeys: GrowthGoalKey[];
  growthGoals: GrowthGoalKey[];
  theme: ServiceTheme;
  destinationType: 'dynamic' | 'internal';
  internalPath: string | null;
  href: string;
  order: number;
  portfolios?: PublicServicePortfolio[];
};

export type PublicServicePortfolio = {
  id: number;
  titleAr: string;
  titleEn: string;
  category: string;
  image: string;
  imageUrl: string | null;
  featured: boolean;
};

export function parseStringArray(value?: string | null): string[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item): item is string => typeof item === 'string')
        .map(item => item.trim())
        .filter(Boolean);
    }
  } catch {
    // Old records sometimes use a newline-separated list instead of JSON.
  }

  return value.split('\n').map(item => item.trim()).filter(Boolean);
}

export function serializeStringArray(value: string[]): string | null {
  return value.length ? JSON.stringify(value) : null;
}

export function serviceSlug(service: Pick<ServiceSource, 'id' | 'slug'>): string {
  return service.slug || `service-${service.id}`;
}

export function serviceImageUrl(image?: string | null): string | null {
  if (!image) return null;
  if (image.startsWith('http') || image.startsWith('/uploads')) return image;
  return `https://drive.google.com/thumbnail?id=${encodeURIComponent(image)}&sz=w1200`;
}

function asGrowthGoals(value?: string | null): GrowthGoalKey[] {
  const allowed = new Set<string>(GROWTH_GOAL_KEYS);
  return parseStringArray(value).filter((item): item is GrowthGoalKey => allowed.has(item));
}

function asTheme(value: string): ServiceTheme {
  return (SERVICE_THEMES as readonly string[]).includes(value) ? value as ServiceTheme : 'plum';
}

function publicPortfolio(portfolio: PortfolioSummarySource): PublicServicePortfolio {
  return {
    id: portfolio.id,
    titleAr: portfolio.titleAr,
    titleEn: portfolio.titleEn,
    category: portfolio.category,
    image: portfolio.image,
    imageUrl: serviceImageUrl(portfolio.image),
    featured: portfolio.featured,
  };
}

/**
 * The only service shape returned from public endpoints. In particular, price
 * and isActive intentionally do not escape this boundary.
 */
export function toPublicService(service: ServiceSource): PublicService {
  const slug = serviceSlug(service);
  const destinationType = service.destinationType === 'internal' ? 'internal' : 'dynamic';
  const internalPath = destinationType === 'internal' && service.internalPath?.startsWith('/')
    ? service.internalPath
    : null;
  const features = parseStringArray(service.features);
  const goalKeys = asGrowthGoals(service.goalKeys);

  const dto: PublicService = {
    id: service.id,
    slug,
    titleAr: service.titleAr,
    titleEn: service.titleEn,
    descAr: service.descAr,
    descEn: service.descEn,
    detailsAr: service.detailsAr,
    detailsEn: service.detailsEn,
    image: service.image,
    imageUrl: serviceImageUrl(service.image),
    icon: service.icon,
    features,
    benefits: features,
    goalKeys,
    growthGoals: goalKeys,
    theme: asTheme(service.theme),
    destinationType,
    internalPath,
    href: internalPath || `/services/${slug}`,
    order: service.order,
  };

  if (service.portfolios) {
    dto.portfolios = service.portfolios.map(publicPortfolio);
  }

  return dto;
}
