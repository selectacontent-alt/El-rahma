export interface ServiceItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string; // Lucide icon name or emoji
  category: "photo" | "video" | "drone" | "live" | "motion" | "design";
  accentColor: string;
  size: "2x1" | "1x2" | "1x1";
}

export interface PortfolioItem {
  id: string;
  titleAr: string;
  titleEn: string;
  categoryAr: string;
  categoryEn: string;
  imageUrl: string;
  year: string;
  clientAr: string;
  clientEn: string;
  type: "photo" | "video" | "cinematic" | "drone";
}

export interface JourneyStep {
  id: string;
  stepNumber: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
}

export interface PricingPlan {
  id: string;
  titleAr: string;
  titleEn: string;
  price: string;
  originalPrice?: string;
  pricePeriodAr: string;
  pricePeriodEn: string;
  descriptionAr: string;
  descriptionEn: string;
  featuresAr: string[];
  featuresEn: string[];
  isPopular?: boolean;
  ctaText?: string;
  accentColor: string;
}

export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  labelAr: string;
  labelEn: string;
  icon: string;
}
