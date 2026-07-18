export type Language = 'ar' | 'en';

export interface Service {
  id: string;
  icon: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  detailsAr: string[];
  detailsEn: string[];
  metricsAr: string;
  metricsEn: string;
  color: string;
}

export interface Testimonial {
  id: string;
  nameAr: string;
  nameEn: string;
  roleAr: string;
  roleEn: string;
  companyAr: string;
  companyEn: string;
  textAr: string;
  textEn: string;
  avatar: string;
  rating: number;
}

export interface Partner {
  name: string;
  logo: string; // Base64 or elegant SVG or URL placeholder
}

export interface QuoteRequest {
  name: string;
  email: string;
  company: string;
  services: string[];
  budget: number;
  message: string;
}

export interface AIPlanResponse {
  executiveSummary: string;
  targetAudience: string[];
  channels: {
    name: string;
    description: string;
    budgetAllocation: string;
    keyMetrics: string;
  }[];
  phases: {
    name: string;
    duration: string;
    tasks: string[];
  }[];
  estimatedRoi: string;
  tacticalTip: string;
}

export interface Platform {
  id: string;
  name: string;
  nameArabic: string;
  iconName: string;
  usageArabic: string;
  stats: string;
  color: string;
}

export type PlanType = 'marketing' | 'advertising';

export interface Plan {
  id: string;
  title: string;
  price: number;
  currency: string;
  badge?: string;
  description: string;
  postsCountText: string;
  features: string[];
  recommended: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  questionEn?: string;
  answerEn?: string;
}

export interface ContentCategory {
  id: string;
  name: string;
  percentage: number;
  color: string;
  description: string;
  example: string;
}

export interface ClientRequest {
  id: string;
  clientName: string;
  businessName: string;
  phone: string;
  selectedPlanId: string;
  selectedPlanType: PlanType;
  budget: number;
  notes: string;
  createdAt: string;
}

export interface PortfolioTeamNode {
  id: string;
  ring: 0 | 1 | 2 | 3;
  order: number;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  bioAr: string;
  bioEn: string;
  departmentAr: string;
  departmentEn: string;
  imagePng: string;
  accent?: string;
  projectTags?: string[];
}

export interface PortfolioProjectLink {
  id: string;
  titleAr: string;
  titleEn: string;
  href: string;
  status: 'live' | 'soon';
  icon: string;
  accent: string;
  eyebrowAr: string;
  eyebrowEn: string;
  summaryAr: string;
  summaryEn: string;
  planStepsAr: string[];
  planStepsEn: string[];
  orbit?: number;
  previewType?: 'identity' | 'website' | 'social' | 'motion' | 'video' | 'camera';
  signalLabel?: string;
  routeTab?: string;
}

export interface PortfolioServiceNode {
  id: string;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  accent: string;
  icon: string;
  href: string;
  group: 'software' | 'growth' | 'media';
  connections?: string[];
}
