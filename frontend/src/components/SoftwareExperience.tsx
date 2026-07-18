"use client";

import { useMemo, useRef, useState, useEffect, type CSSProperties, type ReactElement, type SVGProps } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  Code2,
  Cpu,
  DatabaseZap,
  Gauge,
  GitBranch,
  Globe2,
  Layers3,
  LockKeyhole,
  MonitorSmartphone,
  PackageCheck,
  PlugZap,
  Rocket,
  SearchCheck,
  ServerCog,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Workflow,
  Zap,
  type LucideIcon
} from 'lucide-react';
import { Language } from '../types';
import { siteFetch } from '../lib/siteApi';
import { addPlanToCart } from '../lib/planCart';

type ServiceId = 'web' | 'commerce' | 'crm' | 'ai' | 'automation' | 'growth';

interface SoftwareExperienceProps {
  currentLang: Language;
  setActiveTab?: (tab: string) => void;
}

interface ServicePackage {
  sourceId?: string;
  category?: ServiceId;
  nameAr: string;
  nameEn: string;
  priceAr: string;
  priceEn: string;
  originalPriceAr?: string;
  originalPriceEn?: string;
  priceValue?: number | null;
  originalPriceValue?: number | null;
  noteAr: string;
  noteEn: string;
  featuresAr: string[];
  featuresEn: string[];
  highlighted?: boolean;
  badgeAr?: string;
  badgeEn?: string;
  ctaText?: string;
  isCustomPlan?: boolean;
}

interface CmsPricingPackage {
  id: number;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  badgeAr?: string;
  badgeEn?: string;
  price: number;
  originalPrice?: number | null;
  currency: string;
  period: string;
  priceNoteAr?: string;
  priceNoteEn?: string;
  featuresAr: string[];
  featuresEn: string[];
  detailsAr?: string[];
  detailsEn?: string[];
  highlighted?: boolean;
  softwareCategory?: ServiceId | null;
  ctaText?: string;
  isCustomPlan?: boolean;
}

interface SoftwareService {
  id: ServiceId;
  icon: LucideIcon;
  accent: string;
  shortAr: string;
  shortEn: string;
  eyebrowAr: string;
  eyebrowEn: string;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  resultAr: string;
  resultEn: string;
  bulletsAr: string[];
  bulletsEn: string[];
  stack: string[];
  consoleAr: string[];
  consoleEn: string[];
  flowAr: string[];
  flowEn: string[];
  packages: ServicePackage[];
}

interface IconItem {
  icon: LucideIcon;
  titleAr: string;
  titleEn: string;
  textAr: string;
  textEn: string;
}

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

function cmsPackageToServicePackage(pkg: CmsPricingPackage): ServicePackage {
  const periodAr: Record<string, string> = { monthly: 'شهريا', yearly: 'سنويا', once: 'مرة واحدة' };
  const periodEn: Record<string, string> = { monthly: 'Monthly', yearly: 'Yearly', once: 'One time' };
  const numericPrice = Number(pkg.price || 0);
  const price = `${numericPrice.toLocaleString()} ${pkg.currency || 'EGP'}`;
  const customPriceAr = pkg.isCustomPlan && numericPrice <= 0 ? (pkg.priceNoteAr || 'عرض مخصص') : price;
  const customPriceEn = pkg.isCustomPlan && numericPrice <= 0 ? (pkg.priceNoteEn || 'Custom quote') : price;
  const originalPrice = Number(pkg.originalPrice);
  const hasDiscount = Number.isFinite(originalPrice) && originalPrice > Number(pkg.price || 0);
  const originalPriceText = hasDiscount ? `${originalPrice.toLocaleString()} ${pkg.currency || 'EGP'}` : undefined;
  return {
    sourceId: String(pkg.id),
    category: pkg.softwareCategory || 'web',
    nameAr: pkg.nameAr,
    nameEn: pkg.nameEn,
    priceAr: customPriceAr,
    priceEn: customPriceEn,
    originalPriceAr: originalPriceText,
    originalPriceEn: originalPriceText,
    priceValue: Number(pkg.price || 0),
    originalPriceValue: hasDiscount ? originalPrice : null,
    noteAr: pkg.priceNoteAr || pkg.descriptionAr || periodAr[pkg.period] || pkg.period,
    noteEn: pkg.priceNoteEn || pkg.descriptionEn || periodEn[pkg.period] || pkg.period,
    featuresAr: [...(pkg.featuresAr || []), ...(pkg.detailsAr || [])],
    featuresEn: [...(pkg.featuresEn || []), ...(pkg.detailsEn || [])],
    highlighted: !!pkg.highlighted,
    badgeAr: pkg.badgeAr,
    badgeEn: pkg.badgeEn,
    ctaText: pkg.ctaText,
    isCustomPlan: !!pkg.isCustomPlan,
  };
}

const softwareServices: SoftwareService[] = [
  {
    id: 'web',
    icon: MonitorSmartphone,
    accent: '#9d027c',
    shortAr: 'موقع شركة',
    shortEn: 'Website',
    eyebrowAr: 'مواقع سريعة',
    eyebrowEn: 'Fast websites',
    titleAr: 'موقع شركة يحول الزائر لعميل محتمل',
    titleEn: 'A company website that turns visitors into leads',
    summaryAr: 'نصمم ونبرمج موقع واضح، سريع، سهل الإدارة، ومتجهز للسيو والتحويلات من أول نسخة.',
    summaryEn: 'We design and build a clear, fast, editable website prepared for SEO and conversions from day one.',
    resultAr: 'موقع محترم يفتح بسرعة، يشرح عرضك، ويجمع طلبات العملاء بدون تعقيد.',
    resultEn: 'A polished website that loads fast, explains your offer, and captures customer requests cleanly.',
    bulletsAr: ['تصميم واجهة مخصص', 'لوحة إدارة محتوى', 'نماذج تواصل وتتبع', 'تهيئة SEO أساسية'],
    bulletsEn: ['Custom interface design', 'Content admin panel', 'Forms and tracking', 'Core SEO setup'],
    stack: ['Next.js', 'CMS', 'Forms', 'Analytics'],
    consoleAr: ['route /services/software', 'build landing + pages', 'connect forms + CRM', 'publish with analytics'],
    consoleEn: ['route /services/software', 'build landing + pages', 'connect forms + CRM', 'publish with analytics'],
    flowAr: ['بريف', 'واجهة', 'لوحة', 'نشر'],
    flowEn: ['Brief', 'Interface', 'Admin', 'Launch'],
    packages: [
      {
        nameAr: 'Landing Sprint',
        nameEn: 'Landing Sprint',
        priceAr: '9,990 جم',
        priceEn: 'EGP 9,990',
        noteAr: 'صفحة هبوط للإعلانات والتحويلات',
        noteEn: 'Landing page for ads and conversions',
        featuresAr: ['تصميم صفحة واحدة', 'نموذج تواصل', 'تتبع أساسي'],
        featuresEn: ['One-page design', 'Contact form', 'Basic tracking']
      },
      {
        nameAr: 'Corporate Engine',
        nameEn: 'Corporate Engine',
        priceAr: '19,990 جم',
        priceEn: 'EGP 19,990',
        noteAr: 'موقع شركة كامل قابل للإدارة',
        noteEn: 'Editable full company website',
        featuresAr: ['صفحات الخدمات', 'لوحة محتوى', 'تهيئة SEO'],
        featuresEn: ['Service pages', 'Content panel', 'SEO setup']
      },
      {
        nameAr: 'Web System',
        nameEn: 'Web System',
        priceAr: '34,990 جم',
        priceEn: 'EGP 34,990',
        noteAr: 'موقع متقدم بربط وتدفقات عمل',
        noteEn: 'Advanced website with integrations',
        featuresAr: ['ربط CRM', 'أتمتة طلبات', 'تقارير أداء'],
        featuresEn: ['CRM connection', 'Request automation', 'Performance reports']
      }
    ]
  },
  {
    id: 'commerce',
    icon: ShoppingCart,
    accent: '#f97316',
    shortAr: 'متجر',
    shortEn: 'Store',
    eyebrowAr: 'تجارة إلكترونية',
    eyebrowEn: 'Ecommerce',
    titleAr: 'متجر إلكتروني جاهز للبيع والتوسع',
    titleEn: 'An ecommerce store ready to sell and scale',
    summaryAr: 'نبني رحلة شراء مختصرة مع منتجات، سلة، دفع، شحن، كوبونات، وتقارير تساعدك تتابع المبيعات.',
    summaryEn: 'We build a short buying journey with products, cart, payments, shipping, coupons, and sales reporting.',
    resultAr: 'متجر منظم يقلل خطوات الشراء ويخلي إدارة الطلبات أوضح للفريق.',
    resultEn: 'A structured store that reduces checkout friction and gives the team clearer order operations.',
    bulletsAr: ['كتالوج منتجات', 'دفع وشحن', 'كوبونات وعروض', 'تقارير مبيعات'],
    bulletsEn: ['Product catalog', 'Payments and shipping', 'Coupons and offers', 'Sales reports'],
    stack: ['Catalog', 'Checkout', 'Payments', 'Orders'],
    consoleAr: ['sync products', 'secure checkout', 'route shipping rules', 'export sales report'],
    consoleEn: ['sync products', 'secure checkout', 'route shipping rules', 'export sales report'],
    flowAr: ['منتجات', 'سلة', 'دفع', 'طلبات'],
    flowEn: ['Products', 'Cart', 'Pay', 'Orders'],
    packages: [
      {
        nameAr: 'Store Start',
        nameEn: 'Store Start',
        priceAr: '24,990 جم',
        priceEn: 'EGP 24,990',
        noteAr: 'متجر بسيط بمنتجات ودفع أساسي',
        noteEn: 'Simple store with products and checkout',
        featuresAr: ['كتالوج', 'سلة شراء', 'إدارة طلبات'],
        featuresEn: ['Catalog', 'Cart', 'Order management']
      },
      {
        nameAr: 'Commerce Pro',
        nameEn: 'Commerce Pro',
        priceAr: '44,990 جم',
        priceEn: 'EGP 44,990',
        noteAr: 'متجر كامل بعروض وشحن وتقارير',
        noteEn: 'Full store with offers, shipping, reports',
        featuresAr: ['دفع إلكتروني', 'كوبونات', 'تقارير يومية'],
        featuresEn: ['Online payment', 'Coupons', 'Daily reports']
      },
      {
        nameAr: 'Marketplace Core',
        nameEn: 'Marketplace Core',
        priceAr: 'حسب التحليل',
        priceEn: 'Custom quote',
        noteAr: 'منصة متعددة البائعين أو الفروع',
        noteEn: 'Multi-vendor or multi-branch platform',
        featuresAr: ['صلاحيات', 'عمولات', 'لوحات متعددة'],
        featuresEn: ['Permissions', 'Commissions', 'Multiple dashboards']
      }
    ]
  },
  {
    id: 'crm',
    icon: DatabaseZap,
    accent: '#0ea5e9',
    shortAr: 'CRM',
    shortEn: 'CRM',
    eyebrowAr: 'إدارة العملاء',
    eyebrowEn: 'Customer ops',
    titleAr: 'CRM يلم الليدز والمتابعة في مكان واحد',
    titleEn: 'A CRM that keeps leads and follow-up in one place',
    summaryAr: 'نحول الاستفسارات لمسار واضح: مصدر العميل، حالة الصفقة، المهام، التذكيرات، وصلاحيات الفريق.',
    summaryEn: 'We turn inquiries into a clear pipeline: lead source, deal status, tasks, reminders, and team permissions.',
    resultAr: 'فريق البيع يعرف مين يتابع إيه، وإمتى، ومن غير شيتات متفرقة.',
    resultEn: 'Sales teams know who owns each follow-up, when it is due, and what changed without scattered sheets.',
    bulletsAr: ['Pipeline مبيعات', 'صلاحيات مستخدمين', 'مهام وتذكيرات', 'تقارير فريق'],
    bulletsEn: ['Sales pipeline', 'User permissions', 'Tasks and reminders', 'Team reports'],
    stack: ['Leads', 'Pipeline', 'Roles', 'Reports'],
    consoleAr: ['capture lead source', 'assign owner', 'set next action', 'daily sales pulse'],
    consoleEn: ['capture lead source', 'assign owner', 'set next action', 'daily sales pulse'],
    flowAr: ['ليد', 'متابعة', 'صفقة', 'تقرير'],
    flowEn: ['Lead', 'Follow', 'Deal', 'Report'],
    packages: [
      {
        nameAr: 'CRM Starter',
        nameEn: 'CRM Starter',
        priceAr: '24,990 جم',
        priceEn: 'EGP 24,990',
        noteAr: 'إدارة عملاء ومراحل بيع أساسية',
        noteEn: 'Customer management and core stages',
        featuresAr: ['إضافة عملاء', 'مراحل بيع', 'بحث وفلاتر'],
        featuresEn: ['Customer records', 'Sales stages', 'Search and filters']
      },
      {
        nameAr: 'Sales Ops',
        nameEn: 'Sales Ops',
        priceAr: '44,990 جم',
        priceEn: 'EGP 44,990',
        noteAr: 'CRM بمهام وتذكيرات وتقارير',
        noteEn: 'CRM with tasks, reminders, reports',
        featuresAr: ['مهام للفريق', 'تنبيهات', 'تقارير أداء'],
        featuresEn: ['Team tasks', 'Alerts', 'Performance reports']
      },
      {
        nameAr: 'Enterprise CRM',
        nameEn: 'Enterprise CRM',
        priceAr: 'حسب التحليل',
        priceEn: 'Custom quote',
        noteAr: 'صلاحيات وربط أنظمة داخلية',
        noteEn: 'Permissions and internal integrations',
        featuresAr: ['أدوار متعددة', 'ربط API', 'تخصيص كامل'],
        featuresEn: ['Multiple roles', 'API links', 'Full customization']
      }
    ]
  },
  {
    id: 'ai',
    icon: Bot,
    accent: '#7c3aed',
    shortAr: 'ذكاء اصطناعي',
    shortEn: 'AI',
    eyebrowAr: 'AI عملي',
    eyebrowEn: 'Practical AI',
    titleAr: 'مساعد ذكي يعرف مشروعك مش مجرد شات',
    titleEn: 'An AI assistant that knows your business, not just chat',
    summaryAr: 'نبني طبقة ذكاء اصطناعي ترد على العملاء، تلخص الطلبات، تقترح خطوات، وتتدرب على محتوى شركتك.',
    summaryEn: 'We build an AI layer that answers customers, summarizes requests, suggests actions, and learns from your content.',
    resultAr: 'ردود أسرع، ضغط أقل على الفريق، ومعرفة داخلية أسهل في الوصول.',
    resultEn: 'Faster replies, less team pressure, and internal knowledge that is easier to reach.',
    bulletsAr: ['Chatbot مخصص', 'تدريب على ملفاتك', 'تلخيص محادثات', 'اقتراح إجراءات'],
    bulletsEn: ['Custom chatbot', 'Training on your files', 'Conversation summaries', 'Action suggestions'],
    stack: ['RAG', 'Prompts', 'WhatsApp', 'Knowledge'],
    consoleAr: ['index knowledge base', 'answer with context', 'handoff to sales', 'log useful insights'],
    consoleEn: ['index knowledge base', 'answer with context', 'handoff to sales', 'log useful insights'],
    flowAr: ['معرفة', 'سؤال', 'إجابة', 'تحويل'],
    flowEn: ['Data', 'Ask', 'Answer', 'Handoff'],
    packages: [
      {
        nameAr: 'AI Advisor',
        nameEn: 'AI Advisor',
        priceAr: '29,990 جم',
        priceEn: 'EGP 29,990',
        noteAr: 'مساعد داخلي للأسئلة والتلخيص',
        noteEn: 'Internal assistant for Q&A and summaries',
        featuresAr: ['رفع ملفات', 'بحث ذكي', 'ملخصات'],
        featuresEn: ['File upload', 'Smart search', 'Summaries']
      },
      {
        nameAr: 'Sales Chatbot',
        nameEn: 'Sales Chatbot',
        priceAr: '39,990 جم',
        priceEn: 'EGP 39,990',
        noteAr: 'بوت مبيعات للموقع أو واتساب',
        noteEn: 'Sales bot for website or WhatsApp',
        featuresAr: ['أسئلة العملاء', 'تجميع بيانات', 'تحويل للمبيعات'],
        featuresEn: ['Customer Q&A', 'Data capture', 'Sales handoff']
      },
      {
        nameAr: 'Private AI Layer',
        nameEn: 'Private AI Layer',
        priceAr: 'حسب البيانات',
        priceEn: 'Data based quote',
        noteAr: 'طبقة AI مخصصة على أنظمة الشركة',
        noteEn: 'Custom AI layer over company systems',
        featuresAr: ['ربط داخلي', 'صلاحيات', 'حماية بيانات'],
        featuresEn: ['Internal links', 'Permissions', 'Data safeguards']
      }
    ]
  },
  {
    id: 'automation',
    icon: Workflow,
    accent: '#12b981',
    shortAr: 'أتمتة',
    shortEn: 'Automation',
    eyebrowAr: 'تدفقات عمل',
    eyebrowEn: 'Workflows',
    titleAr: 'أتمتة تشيل التكرار من يوم فريقك',
    titleEn: 'Automation that removes repetition from the team day',
    summaryAr: 'نربط النماذج، الإعلانات، واتساب، البريد، الشيتات، والـ CRM في مسار واحد يقلل العمل اليدوي.',
    summaryEn: 'We connect forms, ads, WhatsApp, email, sheets, and CRM into one flow that reduces manual work.',
    resultAr: 'كل طلب يدخل مكانه، يتوزع تلقائيا، والفريق ياخد إشعار واضح.',
    resultEn: 'Every request lands in the right place, gets routed automatically, and triggers clear team alerts.',
    bulletsAr: ['ربط APIs', 'توزيع Leads', 'إشعارات تلقائية', 'مراقبة الأخطاء'],
    bulletsEn: ['API connections', 'Lead routing', 'Automatic alerts', 'Error monitoring'],
    stack: ['APIs', 'Webhooks', 'Sheets', 'Alerts'],
    consoleAr: ['listen to form event', 'validate payload', 'route lead owner', 'notify channel'],
    consoleEn: ['listen to form event', 'validate payload', 'route lead owner', 'notify channel'],
    flowAr: ['حدث', 'تحقق', 'توزيع', 'تنبيه'],
    flowEn: ['Event', 'Check', 'Route', 'Alert'],
    packages: [
      {
        nameAr: 'Workflow Fix',
        nameEn: 'Workflow Fix',
        priceAr: '14,990 جم',
        priceEn: 'EGP 14,990',
        noteAr: 'أتمتة مسار واحد واضح',
        noteEn: 'Automation for one clear workflow',
        featuresAr: ['Webhook', 'تنبيه', 'توثيق المسار'],
        featuresEn: ['Webhook', 'Alert', 'Flow documentation']
      },
      {
        nameAr: 'Integration Stack',
        nameEn: 'Integration Stack',
        priceAr: '24,990 جم',
        priceEn: 'EGP 24,990',
        noteAr: 'ربط 3 إلى 5 أدوات مع مراقبة',
        noteEn: 'Connect 3 to 5 tools with monitoring',
        featuresAr: ['ربط أدوات', 'سجل أخطاء', 'اختبارات تشغيل'],
        featuresEn: ['Tool connections', 'Error log', 'Run tests']
      },
      {
        nameAr: 'Ops Autopilot',
        nameEn: 'Ops Autopilot',
        priceAr: '49,990 جم',
        priceEn: 'EGP 49,990',
        noteAr: 'أتمتة تشغيل كاملة لقسم أو عملية',
        noteEn: 'Full automation for a department or process',
        featuresAr: ['مسارات متعددة', 'صلاحيات', 'لوحة متابعة'],
        featuresEn: ['Multiple flows', 'Permissions', 'Monitoring panel']
      }
    ]
  },
  {
    id: 'growth',
    icon: Gauge,
    accent: '#ef4444',
    shortAr: 'تطوير',
    shortEn: 'Optimize',
    eyebrowAr: 'تحسين مستمر',
    eyebrowEn: 'Continuous growth',
    titleAr: 'تطوير موقعك الحالي بدون ما نهدمه',
    titleEn: 'Improve your existing website without tearing it down',
    summaryAr: 'نراجع الكود والتجربة والسرعة والسيو والحماية، ثم نعمل تحسينات محسوبة على مراحل.',
    summaryEn: 'We review code, UX, speed, SEO, and security, then ship measured improvements in stages.',
    resultAr: 'موقع أسرع، أوضح، وأقل مشاكل من غير إعادة بناء عشوائية.',
    resultEn: 'A faster, clearer, more stable website without a random rebuild.',
    bulletsAr: ['فحص كود', 'تحسين سرعة', 'إصلاح Bugs', 'تحسين UX وموبايل'],
    bulletsEn: ['Code audit', 'Speed optimization', 'Bug fixing', 'UX and mobile improvements'],
    stack: ['Audit', 'Vitals', 'SEO', 'QA'],
    consoleAr: ['scan bottlenecks', 'fix priority issues', 'measure before after', 'ship small releases'],
    consoleEn: ['scan bottlenecks', 'fix priority issues', 'measure before after', 'ship small releases'],
    flowAr: ['فحص', 'أولوية', 'إصلاح', 'قياس'],
    flowEn: ['Audit', 'Priority', 'Fix', 'Measure'],
    packages: [
      {
        nameAr: 'Code Audit',
        nameEn: 'Code Audit',
        priceAr: '6,990 جم',
        priceEn: 'EGP 6,990',
        noteAr: 'فحص شامل وخطة تطوير واضحة',
        noteEn: 'Full audit and practical improvement plan',
        featuresAr: ['تقرير مشاكل', 'ترتيب أولويات', 'خطة تنفيذ'],
        featuresEn: ['Issue report', 'Priorities', 'Execution plan']
      },
      {
        nameAr: 'Performance Push',
        nameEn: 'Performance Push',
        priceAr: '12,990 جم',
        priceEn: 'EGP 12,990',
        noteAr: 'تحسين سرعة وتجربة مستخدم أساسية',
        noteEn: 'Speed and essential UX improvements',
        featuresAr: ['Core Web Vitals', 'صور وكاش', 'تحسين موبايل'],
        featuresEn: ['Core Web Vitals', 'Images and cache', 'Mobile fixes']
      },
      {
        nameAr: 'Monthly Evolution',
        nameEn: 'Monthly Evolution',
        priceAr: 'من 8,990 جم / شهر',
        priceEn: 'From EGP 8,990 / month',
        noteAr: 'تطوير وصيانة وتحسينات شهرية',
        noteEn: 'Monthly development, maintenance, iteration',
        featuresAr: ['طلبات شهرية', 'مراقبة', 'تقرير تقدم'],
        featuresEn: ['Monthly tasks', 'Monitoring', 'Progress report']
      }
    ]
  }
];

const pageCopy = {
  ar: {
    heroLabel: 'SELECT SOFTWARE STUDIO',
    heroTitle: 'نطوّر مواقع وأنظمة تربط التسويق بالمبيعات والتشغيل.',
    heroLead: 'نحوّل احتياجك إلى منتج رقمي واضح: صفحات تقنع، نماذج تجمع العملاء، لوحة إدارة تريح الفريق، وربط يساعدك تتابع الأداء بعد الإطلاق.',
    primaryCta: 'ابدأ تحليل المشروع',
    secondaryCta: 'استعرض الأنظمة',
    heroMetricOne: 'تجربة موبايل سريعة',
    heroMetricTwo: 'ربط مع أدوات العمل',
    heroMetricThree: 'تتبع وتحسين بعد النشر',
    switchLabel: 'خريطة الخدمات',
    switchTitle: 'اختر نوع النظام وشاهد نطاق التنفيذ المناسب',
    switchLead: 'كل مشروع له منطق مختلف في الصفحات، قواعد البيانات، الصلاحيات، الربط، والتقارير. نعرض لك الشكل الأقرب قبل طلب الخطة.',
    resultLabel: 'النتيجة',
    includesLabel: 'يشمل',
    stackLabel: 'Stack مناسب',
    packagesLabel: 'خطط مقترحة',
    requestPackage: 'ابدأ طلب الخطة',
    modulesTitle: 'إضافات تجعل النظام مفيداً بعد الإطلاق',
    modulesLead: 'لا نسلم صفحات فقط. نراجع مسار الطلب، طريقة الإدارة، البيانات المطلوبة، والتنبيهات التي تجعل الفريق أسرع.',
    processTitle: 'تنفيذ على مراحل مفهومة',
    processLead: 'نقسم المشروع إلى مخرجات قصيرة: هيكل، تصميم، تطوير، ربط، اختبار. في كل مرحلة تعرف ما الذي تم وما الذي سيحدث بعدها.',
    qualityTitle: 'معايير جودة قبل التسليم',
    qualityLead: 'نراجع السرعة، الأمان، السيو، نماذج التواصل، وتجربة المستخدم قبل أن يتحول المشروع إلى أصل فعلي للشركة.',
    finalTitle: 'جاهز لتحويل الفكرة إلى نظام عامل؟',
    finalLead: 'أرسل تفاصيل المشروع وسنرجع لك بنطاق تقني، مراحل تنفيذ، وخطة تناسب الحجم المطلوب.',
    finalCta: 'كلم الفريق'
  },
  en: {
    heroLabel: 'SELECT SOFTWARE STUDIO',
    heroTitle: 'We build websites and systems that connect marketing, sales, and operations.',
    heroLead: 'We turn your need into a clear digital product: persuasive pages, lead capture, team dashboards, and integrations that help you track performance after launch.',
    primaryCta: 'Start project analysis',
    secondaryCta: 'See systems',
    heroMetricOne: 'Fast mobile experience',
    heroMetricTwo: 'Connected work tools',
    heroMetricThree: 'Track and improve after launch',
    switchLabel: 'Service map',
    switchTitle: 'Choose a system type and see the right execution scope',
    switchLead: 'Each project has a different logic for pages, data, roles, integrations, and reports. We show the closest scope before you request a plan.',
    resultLabel: 'Result',
    includesLabel: 'Includes',
    stackLabel: 'Suggested stack',
    packagesLabel: 'Suggested plans',
    requestPackage: 'Start Plan Request',
    modulesTitle: 'Additions that make the system useful after launch',
    modulesLead: 'We do not just ship pages. We review the request path, admin workflow, required data, and alerts that make the team faster.',
    processTitle: 'Execution in clear stages',
    processLead: 'We split the project into concrete outputs: structure, design, development, integrations, and testing. You always know what is done and what is next.',
    qualityTitle: 'Quality standards before handoff',
    qualityLead: 'We review speed, security, SEO, forms, and user experience before the project becomes a working business asset.',
    finalTitle: 'Ready to turn the idea into a working system?',
    finalLead: 'Send the project details and we will return with a technical breakdown and a plan that fits the required scope.',
    finalCta: 'Talk to the team'
  }
};

const ideaModules: IconItem[] = [
  {
    icon: PlugZap,
    titleAr: 'ربط واتساب وCRM',
    titleEn: 'WhatsApp and CRM links',
    textAr: 'الطلبات تدخل تلقائيا وتظهر للفريق في مكان واضح.',
    textEn: 'Requests flow automatically into a clear team workspace.'
  },
  {
    icon: BarChart3,
    titleAr: 'لوحة قياس حقيقية',
    titleEn: 'Real measurement dashboard',
    textAr: 'مبيعات، مصادر العملاء، وتحويلات الصفحات بدون تخمين.',
    textEn: 'Sales, lead sources, and page conversions without guessing.'
  },
  {
    icon: LockKeyhole,
    titleAr: 'صلاحيات للفريق',
    titleEn: 'Team permissions',
    textAr: 'كل عضو يشوف اللي يخصه، والإدارة تشوف الصورة الكاملة.',
    textEn: 'Each member sees their scope while management sees the full picture.'
  },
  {
    icon: Bot,
    titleAr: 'مساعد AI مخصص',
    titleEn: 'Custom AI assistant',
    textAr: 'يرد، يلخص، ويحول الطلب للخطوة المناسبة.',
    textEn: 'It answers, summarizes, and routes the request to the right next step.'
  },
  {
    icon: ShieldCheck,
    titleAr: 'أساس أمان واضح',
    titleEn: 'Clear security base',
    textAr: 'حماية نماذج، صلاحيات، نسخ احتياطي، ومراجعة نشر.',
    textEn: 'Form protection, permissions, backups, and release review.'
  },
  {
    icon: PackageCheck,
    titleAr: 'تسليم قابل للتطوير',
    titleEn: 'Scalable handoff',
    textAr: 'كود منظم وتوثيق مختصر يسهل التطوير بعد الإطلاق.',
    textEn: 'Clean code and concise documentation for easier evolution.'
  }
];

const processSteps: IconItem[] = [
  {
    icon: SearchCheck,
    titleAr: 'تحليل',
    titleEn: 'Discovery',
    textAr: 'نحدد الهدف، المستخدم، المسارات، والبيانات المطلوبة.',
    textEn: 'We define the goal, user, journeys, and required data.'
  },
  {
    icon: Layers3,
    titleAr: 'تصميم نظام',
    titleEn: 'System design',
    textAr: 'نرسم الواجهة، لوحة الإدارة، الربط، وصلاحيات التشغيل.',
    textEn: 'We map the interface, admin, integrations, and operating roles.'
  },
  {
    icon: Code2,
    titleAr: 'برمجة وتجربة',
    titleEn: 'Build and test',
    textAr: 'سبرنتات قصيرة مع مراجعة حقيقية على الموبايل والديسكتوب.',
    textEn: 'Short sprints with real review on mobile and desktop.'
  },
  {
    icon: Rocket,
    titleAr: 'نشر وتحسين',
    titleEn: 'Launch and improve',
    textAr: 'نشر، مراقبة، قياس، وتحسينات بعد الاستخدام الأول.',
    textEn: 'Launch, monitor, measure, and improve after first usage.'
  }
];

const qualityItems: IconItem[] = [
  {
    icon: Gauge,
    titleAr: 'سرعة وأداء',
    titleEn: 'Speed and performance',
    textAr: 'تحميل سريع، صور محسنة، وتجربة ثابتة على الموبايل.',
    textEn: 'Fast loading, optimized assets, and stable mobile experience.'
  },
  {
    icon: ShieldCheck,
    titleAr: 'أمان وصلاحيات',
    titleEn: 'Security and roles',
    textAr: 'صلاحيات واضحة، حماية للمدخلات، ونشر محسوب.',
    textEn: 'Clear permissions, input protection, and careful deployment.'
  },
  {
    icon: Globe2,
    titleAr: 'SEO وتجربة قراءة',
    titleEn: 'SEO and readability',
    textAr: 'بنية صفحات وعناوين ومحتوى يساعد العميل ومحركات البحث.',
    textEn: 'Page structure, headings, and content for people and search engines.'
  },
  {
    icon: ServerCog,
    titleAr: 'تشغيل ومراقبة',
    titleEn: 'Operations and monitoring',
    textAr: 'قياس أخطاء، تتبع طلبات، ومؤشرات تساعد على التطوير.',
    textEn: 'Error visibility, request tracking, and metrics for improvement.'
  }
];

type TechIcon = (props: SVGProps<SVGSVGElement>) => ReactElement;

interface TechStackItem {
  name: string;
  color: string;
  logoSrc: string;
}

const ReactMark: TechIcon = (props) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
    <circle cx="24" cy="24" r="4.2" fill="currentColor" />
    <ellipse cx="24" cy="24" rx="19" ry="7.4" stroke="currentColor" strokeWidth="2.6" />
    <ellipse cx="24" cy="24" rx="19" ry="7.4" stroke="currentColor" strokeWidth="2.6" transform="rotate(60 24 24)" />
    <ellipse cx="24" cy="24" rx="19" ry="7.4" stroke="currentColor" strokeWidth="2.6" transform="rotate(120 24 24)" />
  </svg>
);

const NextMark: TechIcon = (props) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
    <circle cx="24" cy="24" r="20" fill="currentColor" />
    <path d="M16 15h5.2l12.4 18.2V15H38v18h-5.1L20.4 14.9V33H16V15Z" fill="white" />
  </svg>
);

const NodeMark: TechIcon = (props) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
    <path d="M24 4.5 40.9 14v20L24 43.5 7.1 34V14L24 4.5Z" fill="currentColor" />
    <path d="M15 31V17h4.2l7.8 9.7V17H31v14h-4.1l-7.9-9.8V31H15Z" fill="white" />
  </svg>
);

const PythonMark: TechIcon = (props) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
    <path d="M24.3 5c-8.2 0-9 3.6-9 3.6v6.9h9.2v2.1H11.6S5 16.8 5 27s5.8 9.8 5.8 9.8h3.5v-5s-.2-5.8 5.7-5.8h9.1s5.1.1 5.1-5V10.2S35 5 24.3 5Z" fill="#3776AB" />
    <path d="M23.7 43c8.2 0 9-3.6 9-3.6v-6.9h-9.2v-2.1h12.9S43 31.2 43 21s-5.8-9.8-5.8-9.8h-3.5v5s.2 5.8-5.7 5.8h-9.1s-5.1-.1-5.1 5v10.8S13 43 23.7 43Z" fill="#FFD43B" />
    <circle cx="19" cy="10.5" r="1.8" fill="white" />
    <circle cx="29" cy="37.5" r="1.8" fill="#243447" />
  </svg>
);

const GoMark: TechIcon = (props) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
    <path d="M6 18h13M3 24h13M8 30h10" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
    <path d="M28 34c-6 0-10-3.9-10-9.8C18 18 22.4 14 28.8 14h5.8c5.9 0 9.4 3.6 9.4 8.8 0 6.8-4.6 11.2-11.3 11.2H28Zm1-6.1h4c2.8 0 4.7-1.8 4.7-4.6 0-2-1.4-3.3-3.7-3.3h-5.2c-2.9 0-4.6 1.7-4.6 4.1 0 2.3 1.8 3.8 4.8 3.8Z" fill="currentColor" />
  </svg>
);

const PostgresMark: TechIcon = (props) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
    <path d="M12 34c-2.8-4.1-3.8-10.7-1.1-16.2C14 11.6 20.5 8 27 9c7.8 1.2 12.8 7.2 12.8 14.6 0 4.8-2.1 9.3-5.8 12.2-2.2 1.7-4.9 2.6-7.8 2.6h-3.1l-4.8 4.1.4-5.5c-2.7-.3-4.9-1.3-6.7-3Z" fill="currentColor" />
    <path d="M24 18c-3.2 0-5.3 2.2-5.3 5.4 0 3.1 2.1 5.4 5.3 5.4h4.7c1.7 0 3-1.3 3-3V21c0-1.7-1.3-3-3-3H24Z" fill="white" opacity=".92" />
    <path d="M24.2 22h4v3.8h-4c-1.2 0-1.9-.7-1.9-1.9s.7-1.9 1.9-1.9Z" fill="currentColor" />
  </svg>
);

const MongoMark: TechIcon = (props) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
    <path d="M25.1 4.5s11.2 8.2 11.2 20.5c0 9-5.1 14.9-10.2 18.5-.7-6.5-.9-12.9-1-19.2-.1-7.5 0-19.8 0-19.8Z" fill="currentColor" />
    <path d="M23.1 43.5C18 39.9 12 34 12 25 12 12.7 23.1 4.5 23.1 4.5s.2 12.3.1 19.8c-.1 6.3-.3 12.7-.1 19.2Z" fill="currentColor" opacity=".58" />
    <path d="M24 42.5c.5-7.2.5-14.2.3-21" stroke="#0f172a" strokeOpacity=".22" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const GraphqlMark: TechIcon = (props) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
    <path d="m24 6 15.6 9v18L24 42 8.4 33V15L24 6Z" stroke="currentColor" strokeWidth="3" />
    <path d="M24 6v18l15.6 9M24 24 8.4 33M8.4 15 24 24l15.6-9" stroke="currentColor" strokeWidth="2.4" />
    <circle cx="24" cy="6" r="3.4" fill="currentColor" />
    <circle cx="39.6" cy="15" r="3.4" fill="currentColor" />
    <circle cx="39.6" cy="33" r="3.4" fill="currentColor" />
    <circle cx="24" cy="42" r="3.4" fill="currentColor" />
    <circle cx="8.4" cy="33" r="3.4" fill="currentColor" />
    <circle cx="8.4" cy="15" r="3.4" fill="currentColor" />
  </svg>
);

const ApiMark: TechIcon = (props) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
    <path d="M17 18h14M17 30h14M24 11v26" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
    <circle cx="12" cy="18" r="5" fill="currentColor" />
    <circle cx="36" cy="18" r="5" fill="currentColor" />
    <circle cx="12" cy="30" r="5" fill="currentColor" />
    <circle cx="36" cy="30" r="5" fill="currentColor" />
  </svg>
);

const CloudMark: TechIcon = (props) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
    <path d="M17 35h19.2c4.4 0 7.8-3.2 7.8-7.3 0-4.2-3.4-7.4-7.7-7.4h-.8C34 13.6 29.7 10 24 10c-6.6 0-11.3 4.6-12 11-4.4.8-8 3.7-8 7.7C4 32.4 7 35 11.3 35H17Z" fill="currentColor" />
    <path d="M16 25h15M20 30h12" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity=".9" />
  </svg>
);

const AutomationMark: TechIcon = (props) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
    <path d="M15 17a9 9 0 0 1 15.4-6.3L34 14M33 31A9 9 0 0 1 17.6 37.3L14 34" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M34 6v8h-8M14 42v-8h8" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="24" cy="24" r="5.5" fill="currentColor" />
  </svg>
);

const AiAgentMark: TechIcon = (props) => (
  <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" {...props}>
    <rect x="10" y="14" width="28" height="24" rx="9" fill="currentColor" />
    <path d="M18 25h.1M30 25h.1" stroke="white" strokeWidth="4" strokeLinecap="round" />
    <path d="M20 32c2.4 1.6 5.6 1.6 8 0" stroke="white" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M24 14V8M18 8h12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M8 25H5M43 25h-3" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const techStack: TechStackItem[] = [
  { name: 'React', color: '#61DAFB', logoSrc: 'https://cdn.simpleicons.org/react/61DAFB' },
  { name: 'Next.js', color: '#111827', logoSrc: 'https://cdn.simpleicons.org/nextdotjs/111827' },
  { name: 'Node.js', color: '#539E43', logoSrc: 'https://cdn.simpleicons.org/nodedotjs/539E43' },
  { name: 'Python', color: '#3776AB', logoSrc: 'https://cdn.simpleicons.org/python/3776AB' },
  { name: 'Go', color: '#00ADD8', logoSrc: 'https://cdn.simpleicons.org/go/00ADD8' },
  { name: 'PostgreSQL', color: '#336791', logoSrc: 'https://cdn.simpleicons.org/postgresql/336791' },
  { name: 'MongoDB', color: '#47A248', logoSrc: 'https://cdn.simpleicons.org/mongodb/47A248' },
  { name: 'HTML5', color: '#E34F26', logoSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
  { name: 'CSS3', color: '#1572B6', logoSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' },
  { name: 'JavaScript', color: '#F7DF1E', logoSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
  { name: 'AWS Cloud', color: '#FF9900', logoSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
  { name: 'Zapier', color: '#FF4A00', logoSrc: 'https://cdn.simpleicons.org/zapier/FF4A00' },
  { name: 'Laravel', color: '#FF2D20', logoSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg' }
];

function CommandCenter({ service, isAr }: { service: SoftwareService; isAr: boolean }) {
  const [lines, setLines] = useState<{text: string, isCommand: boolean}[]>([]);
  const [currentLine, setCurrentLine] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setLines([]);
    setCurrentLine('');
    setCurrentPrompt('');
    setIsTyping(true);

    const activeConsole = isAr ? service.consoleAr : service.consoleEn;
    const activeFlow = isAr ? service.flowAr : service.flowEn;

    const script = [
      { type: 'log', text: `Microsoft Windows [Version 10.0.22631.4602]` },
      { type: 'log', text: `(c) Select Marketing. All rights reserved.` },
      { type: 'command', prompt: 'C:\\Select\\Studio>', text: `select-engine.exe /build /target:${service.id} /mode:production` },
      { type: 'log', text: `Select Engine for Windows v4.2.0 x64` },
      { type: 'log', text: `Loading profile: ${isAr ? service.shortAr : service.shortEn} ... OK` },
      { type: 'log', text: `Checking project files ... OK` },
      { type: 'log', text: `Restoring local dependencies ... OK` },
      { type: 'log', text: `[####################] 100%` },
      ...activeConsole.map(cmd => ({ type: 'log', text: `Running ${cmd} ... OK` })),
      { type: 'log', text: `Building workflow steps:` },
      ...activeFlow.map((node, i) => ({ type: 'log', text: `   ${i + 1}. ${node} ... OK` })),
      { type: 'log', text: `Applying WAF and SSL settings ... OK` },
      { type: 'log', text: `Build succeeded. Ready for deployment.` },
      { type: 'prompt', prompt: 'C:\\Select\\Studio>', text: '' }
    ];

    let lineIndex = 0;
    let charIndex = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const typeWriter = () => {
      if (lineIndex < script.length) {
        const item = script[lineIndex];
        
        if (item.type === 'log') {
          setCurrentPrompt('');
          setLines(prev => [...prev, { text: item.text, isCommand: false }]);
          lineIndex++;
          const delay = item.text.startsWith('   ') ? 40 : 100 + Math.random() * 150;
          timeoutId = setTimeout(typeWriter, delay);
        } else if (item.type === 'command') {
          setCurrentPrompt(item.prompt);
          if (charIndex < item.text.length) {
            setCurrentLine(item.text.substring(0, charIndex + 1));
            charIndex++;
            timeoutId = setTimeout(typeWriter, 30 + Math.random() * 40);
          } else {
            setLines(prev => [...prev, { text: `${item.prompt} ${item.text}`, isCommand: true }]);
            setCurrentLine('');
            setCurrentPrompt('');
            charIndex = 0;
            lineIndex++;
            timeoutId = setTimeout(typeWriter, 400);
          }
        } else if (item.type === 'prompt') {
          setCurrentPrompt(item.prompt);
          setLines(prev => [...prev, { text: item.prompt, isCommand: true }]);
          lineIndex++;
          setIsTyping(false);
        }
      }
    };

    timeoutId = setTimeout(typeWriter, 400);

    return () => clearTimeout(timeoutId);
  }, [service, isAr]);

  return (
    <div className="relative mx-auto w-full max-w-[760px] overflow-hidden rounded-xl border border-slate-700/70 bg-[#0c0c0c] shadow-[0_28px_80px_rgba(2,6,23,0.38)]" dir="ltr">
      
      {/* CMD Top Bar */}
      <div className="relative z-[60] flex h-10 items-center justify-between border-b border-[#d7d7d7] bg-[#f3f3f3] text-[#1f2937] select-none">
        <div className="flex items-center gap-3 pl-4">
          <div className="flex items-center justify-center">
             <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="15" height="15" fill="#0c0c0c" stroke="#737373" strokeWidth="1" />
                <path d="M4 5L7 8L4 11" stroke="#f3f3f3" strokeWidth="1.2" strokeLinecap="square" />
                <rect x="8" y="10" width="5" height="1.2" fill="#f3f3f3" />
             </svg>
          </div>
          <span className="mt-0.5 font-sans text-[12px] font-medium tracking-normal text-[#1f2937]">Command Prompt - select-engine.exe</span>
        </div>
        <div className="flex h-full">
          <div className="flex h-full w-12 cursor-pointer items-center justify-center text-[#1f2937] transition-colors hover:bg-black/10">
            <svg width="10" height="1" viewBox="0 0 10 1" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <rect width="10" height="1" fill="currentColor" />
            </svg>
          </div>
          <div className="flex h-full w-12 cursor-pointer items-center justify-center text-[#1f2937] transition-colors hover:bg-black/10">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="9" height="9" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
          <div className="group flex h-full w-12 cursor-pointer items-center justify-center rounded-tr-xl text-[#1f2937] transition-colors hover:bg-[#E81123] hover:text-white">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
        </div>
      </div>

      {/* CMD Body */}
      <div className="relative min-h-[460px] bg-[#0c0c0c] p-5 font-mono text-[13px] leading-relaxed text-[#cccccc] sm:p-7 sm:text-[14px]">
        
        <div className="relative z-10">
          {lines.map((line, i) => {
             if (!isTyping && i === lines.length - 1) return null;
             
             return (
              <div key={i} className={line.isCommand ? "mt-4 font-normal text-[#f2f2f2] first:mt-0" : "text-[#cccccc]"}>
                {line.text.endsWith('OK') ? (
                  <>
                    {line.text.slice(0, -2)}
                    <span className="font-bold text-[#6ee7b7]">OK</span>
                  </>
                ) : line.text.includes('Build succeeded') ? (
                  <span className="mt-2 inline-block bg-[#1f2937] px-2 py-0.5 font-bold text-[#f2f2f2]">
                    {line.text}
                  </span>
                ) : line.text.startsWith('[####################]') ? (
                  <span className="font-bold text-[#f2f2f2]">
                    {line.text}
                  </span>
                ) : (
                  <span className="opacity-90">{line.text}</span>
                )}
              </div>
             );
          })}
          
          {isTyping && currentPrompt && (
            <div className="mt-4 font-normal text-[#f2f2f2]">
              <span className="mr-2">{currentPrompt}</span>
              <span>{currentLine}</span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="ml-0.5 inline-block h-[14px] w-[8px] bg-[#f2f2f2] align-middle"
              />
            </div>
          )}
          
          {!isTyping && (
             <div className="mt-4 font-normal text-[#f2f2f2]">
               <span className="mr-2">{lines[lines.length - 1]?.text}</span>
               <motion.span
                 animate={{ opacity: [1, 0, 1] }}
                 transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                 className="ml-0.5 inline-block h-[14px] w-[8px] bg-[#f2f2f2] align-middle"
               />
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TechMarquee() {
  const seamlessStack = [...techStack, ...techStack, ...techStack, ...techStack];

  const renderStackGroup = (copyIndex: number) => (
    <div className="software-marquee-group flex min-w-max shrink-0 items-center gap-10 pr-10 sm:gap-14 sm:pr-14 lg:gap-20 lg:pr-20" dir="ltr" aria-hidden={copyIndex === 1}>
      {seamlessStack.map((item, itemIndex) => {
        return (
          <span
            key={`${item.name}-${copyIndex}-${itemIndex}`}
            className="software-tech-item inline-flex shrink-0 items-center gap-3 text-slate-300"
            style={{ '--tech-color': item.color } as CSSProperties}
          >
            <img
              src={item.logoSrc}
              alt=""
              loading="lazy"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
              className="h-7 max-w-16 object-contain sm:h-8 sm:max-w-20"
            />
            <span className="whitespace-nowrap text-base font-black tracking-normal sm:text-lg" style={{ color: item.color }}>
              {item.name}
            </span>
          </span>
        );
      })}
    </div>
  );

  return (
    <div className="relative bg-slate-900/40 py-7 backdrop-blur" dir="ltr">
      <div className="software-marquee-mask mx-auto w-full max-w-[100vw] overflow-hidden">
        <div className="software-marquee flex w-max items-center" dir="ltr">
          {renderStackGroup(0)}
          {renderStackGroup(1)}
        </div>
      </div>
    </div>
  );
}

function TypewriterText({ text, className, speed = 40 }: { text: string; className?: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let currentText = '';
    let currentIndex = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const typeNextChar = () => {
      if (currentIndex < text.length) {
        currentText += text[currentIndex];
        setDisplayedText(currentText);
        currentIndex++;
        timeout = setTimeout(typeNextChar, speed + Math.random() * 30);
      } else {
        setIsTyping(false);
      }
    };

    timeout = setTimeout(typeNextChar, 300);
    return () => clearTimeout(timeout);
  }, [text, speed]);

  return (
    <>
      <span className={className}>{displayedText}</span>
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        className="inline-block w-[3px] h-[0.9em] mx-1 align-middle bg-[#f97316]"
      />
    </>
  );
}

export default function SoftwareExperience({ currentLang, setActiveTab }: SoftwareExperienceProps) {
  const isAr = currentLang === 'ar';
  const text = pageCopy[currentLang];
  const [activeServiceId, setActiveServiceId] = useState<ServiceId>('web');
  const [cmsPackages, setCmsPackages] = useState<ServicePackage[]>([]);
  const pricingTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const service = params.get('service') as ServiceId | null;
      if (service && softwareServices.some((s) => s.id === service)) {
        setActiveServiceId(service);
        // Scroll to systems block after a short delay
        setTimeout(() => {
          document.getElementById('software-systems')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    const loadPricing = async () => {
      const data = await siteFetch<CmsPricingPackage[]>('/pricing?section=software');
      if (!active) return;
      setCmsPackages(data?.length ? data.map(cmsPackageToServicePackage) : []);
    };
    loadPricing();
    return () => { active = false; };
  }, []);

  const activeService = useMemo(
    () => softwareServices.find((service) => service.id === activeServiceId) ?? softwareServices[0],
    [activeServiceId]
  );
  const cmsPackagesForActiveService = cmsPackages.filter(pkg => (pkg.category || 'web') === activeServiceId);
  const displayPackages = cmsPackagesForActiveService.length ? cmsPackagesForActiveService : activeService.packages;

  const scrollPackages = (direction: 1 | -1) => {
    pricingTrackRef.current?.scrollBy({
      left: direction * pricingTrackRef.current.clientWidth * 0.85,
      behavior: 'smooth',
    });
  };

  const goToContact = (pkg?: ServicePackage, index = 0) => {
    if (pkg) {
      if (pkg.isCustomPlan) {
        goToCustomPlan(pkg);
        return;
      }
      const shownPrice = pkg.priceValue ?? Number((isAr ? pkg.priceAr : pkg.priceEn).replace(/[^0-9.]/g, ''));
      const originalPrice = pkg.originalPriceValue ?? Number((isAr ? pkg.originalPriceAr : pkg.originalPriceEn || '').replace(/[^0-9.]/g, ''));
      addPlanToCart({
        section: 'software',
        id: pkg.sourceId || `${activeServiceId}-${index}-${pkg.nameEn}`,
        title: isAr ? pkg.nameAr : pkg.nameEn,
        price: Number.isFinite(shownPrice) && shownPrice > 0 ? shownPrice : null,
        originalPrice: Number.isFinite(originalPrice) && originalPrice > shownPrice ? originalPrice : null,
        currency: 'EGP',
        description: isAr ? pkg.noteAr : pkg.noteEn,
        features: isAr ? pkg.featuresAr : pkg.featuresEn,
        details: { serviceId: activeServiceId, softwareCategory: pkg.category || activeServiceId, priceAr: pkg.priceAr, priceEn: pkg.priceEn, noteAr: pkg.noteAr, noteEn: pkg.noteEn, featuresAr: pkg.featuresAr, featuresEn: pkg.featuresEn },
      });
      return;
    }
    if (setActiveTab) {
      setActiveTab('contact');
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (typeof window !== 'undefined') {
      window.location.href = '/contact';
    }
  };

  const goToCustomPlan = (pkg?: ServicePackage) => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams({ service: activeServiceId });
      if (pkg?.sourceId) params.set('package', pkg.sourceId);
      if (pkg) params.set('title', isAr ? pkg.nameAr : pkg.nameEn);
      window.location.assign(`/custom-plan?${params.toString()}`);
    }
  };

  const scrollToSystems = () => {
    if (typeof document !== 'undefined') {
      document.getElementById('software-systems')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const arrowIcon = isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />;

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="relative overflow-hidden bg-transparent text-slate-200">
      <style>{`
        .software-blueprint {
          background-image:
            linear-gradient(rgba(16, 24, 40, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 24, 40, 0.06) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: linear-gradient(to bottom, black 0%, black 74%, transparent 100%);
        }

        .software-command::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(135deg, rgba(157, 2, 124, 0.08), transparent 28%),
            linear-gradient(315deg, rgba(255, 188, 1, 0.08), transparent 30%);
        }

        .software-console-grid {
          background-image:
            linear-gradient(rgba(255,255,255,0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.055) 1px, transparent 1px),
            linear-gradient(135deg, rgba(255,255,255,0.04), transparent 45%);
          background-size: 24px 24px, 24px 24px, 100% 100%;
        }

        .software-flow-node {
          animation: softwareNode 3.2s ease-in-out infinite;
        }

        .software-bar {
          transform-origin: left center;
          animation: softwareBar 2.8s ease-in-out infinite;
        }

        [dir="rtl"] .software-bar {
          transform-origin: right center;
        }

        .software-marquee-mask {
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 9%, #000 91%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0%, #000 9%, #000 91%, transparent 100%);
        }

        .software-marquee {
          will-change: transform;
          transform: translate3d(0, 0, 0);
          animation: softwareMarquee 78s linear infinite;
        }

        .software-marquee-mask:hover .software-marquee {
          animation-play-state: paused;
        }

        .software-tech-item {
          transform: translateZ(0);
          transition: opacity 220ms ease, transform 220ms ease;
        }

        .software-tech-item:hover {
          transform: translateY(-2px) translateZ(0);
        }

        .software-card-sweep::before {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-120%);
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent);
          animation: softwareSweep 4.8s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes softwareNode {
          0%, 100% { transform: translateY(0); opacity: 0.78; }
          50% { transform: translateY(-3px); opacity: 1; }
        }

        @keyframes softwareBar {
          0%, 100% { transform: scaleX(0.74); }
          50% { transform: scaleX(1); }
        }

        @keyframes softwareMarquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }

        @keyframes softwareSweep {
          0%, 60% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .software-flow-node,
          .software-bar,
          .software-marquee,
          .software-card-sweep::before {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      <section className="relative overflow-hidden pt-28 pb-12 sm:pt-32 lg:pt-36">
        <div className="software-blueprint absolute inset-0 opacity-70" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#9d027c]/35 to-transparent" />

        <div className="relative mx-auto grid max-w-[1440px] items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            {false && <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-violet-950/30 bg-slate-900/40 px-3 py-2 text-[11px] font-black text-slate-400 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#ffbc01]" />
              <span>{text.heroLabel}</span>
            </div>}

            <h1 className="max-w-3xl text-[clamp(2rem,5vw,3.5rem)] font-black leading-[1.18] tracking-normal">
              <TypewriterText 
                text={text.heroTitle} 
                className="bg-gradient-to-r from-[#101828] via-[#9d027c] to-[#f97316] bg-clip-text text-transparent" 
                speed={50} 
              />
            </h1>

            <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-slate-300 sm:text-lg">
              <TypewriterText text={text.heroLead} speed={25} />
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={scrollToSystems}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#101828] px-5 py-3 text-sm font-black text-white shadow-[0_14px_30px_rgba(0,0,0,0.5)] transition duration-300 hover:bg-[#9d027c] active:scale-[0.98]"
              >
                <Rocket className="h-4 w-4" />
                <span>{text.primaryCta}</span>
              </button>

              {false && <button
                onClick={scrollToSystems}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-violet-950/30 bg-slate-900/40 px-5 py-3 text-sm font-black text-slate-200 transition duration-300 hover:border-[#ffbc01] hover:text-[#9d027c] active:scale-[0.98]"
              >
                <Layers3 className="h-4 w-4" />
                <span>{text.secondaryCta}</span>
                {arrowIcon}
              </button>}
            </div>

            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[text.heroMetricOne, text.heroMetricTwo, text.heroMetricThree].map((metric, index) => (
                <div key={metric} className="rounded-lg border border-violet-950/30 bg-slate-900/40 p-4 shadow-sm">
                  <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-md bg-slate-900/40 text-[#9d027c]">
                    {[MonitorSmartphone, PlugZap, BarChart3].map((Icon, iconIndex) => (
                      iconIndex === index ? <Icon key={metric} className="h-4 w-4" /> : null
                    ))}
                  </span>
                  <strong className="block text-sm leading-6 text-slate-200">{metric}</strong>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            <CommandCenter service={activeService} isAr={isAr} />
          </motion.div>
        </div>
      </section>

      <TechMarquee />

      <section id="software-systems" className="relative py-16 sm:py-24 text-slate-200">
        {/* Subtle darkening layer to ensure text readability while keeping blueprint dots visible */}
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]" />
        
        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          
          <div className="mb-12 text-center max-w-2xl mx-auto">
            <h2 className="text-[clamp(1.85rem,4vw,2.65rem)] font-black leading-[1.22] text-slate-100">
              {text.switchTitle}
            </h2>
            <p className="mt-4 text-sm font-medium leading-7 text-slate-400 sm:text-base">
              {text.switchLead}
            </p>
          </div>

          {/* Horizontal Compact Tabs */}
          <div className="-mx-4 mb-10 flex snap-x snap-mandatory flex-nowrap justify-start gap-2 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:mx-0 sm:mb-14 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0">
            {softwareServices.map((service) => {
              const Icon = service.icon;
              const isActive = service.id === activeServiceId;

              return (
                <button
                  key={service.id}
                  onClick={() => setActiveServiceId(service.id)}
                  aria-pressed={isActive}
                  className={cx(
                    'relative flex shrink-0 snap-start items-center gap-2 rounded-xl px-4 py-3 text-sm font-black transition-all duration-300 active:scale-95 backdrop-blur-sm sm:px-5',
                    isActive 
                      ? 'bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/20' 
                      : 'bg-slate-900/40 text-slate-400 border border-violet-950/30 hover:bg-slate-800/60 hover:text-slate-200 hover:border-violet-900/50'
                  )}
                  style={isActive ? { color: service.accent, textShadow: `0 0 10px ${service.accent}60` } : undefined}
                >
                  <Icon className="h-4 w-4" style={{ color: isActive ? service.accent : '#94a3b8' }} />
                  <span>{isAr ? service.shortAr : service.shortEn}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="softwareActiveTab"
                      className="absolute -bottom-1.5 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full shadow-[0_0_12px_currentColor]"
                      style={{ backgroundColor: service.accent, color: service.accent }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeService.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.28 }}
              className="grid gap-8 lg:grid-cols-12 lg:items-start"
            >
              {/* Service Profile Card */}
              <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
                <div className="rounded-2xl border border-violet-950/30 bg-slate-900/40 backdrop-blur-md p-6 shadow-xl">
                  <div className="mb-6 flex items-center gap-4">
                    <span
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${activeService.accent}15`, color: activeService.accent }}
                    >
                      <activeService.icon className="h-6 w-6" />
                    </span>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {isAr ? activeService.eyebrowAr : activeService.eyebrowEn}
                      </span>
                      <h3 className="text-xl font-black leading-snug text-slate-100 sm:text-2xl">
                        {isAr ? activeService.titleAr : activeService.titleEn}
                      </h3>
                    </div>
                  </div>

                  <p className="mb-6 text-sm font-medium leading-relaxed text-slate-300">
                    {isAr ? activeService.summaryAr : activeService.summaryEn}
                  </p>

                  <div className="mb-6 rounded-xl border border-white/5 bg-slate-950/50 p-4">
                    <span className="mb-2 block text-[10px] font-black uppercase tracking-wider text-slate-400">{text.resultLabel}</span>
                    <p className="text-sm font-bold text-slate-200">
                      {isAr ? activeService.resultAr : activeService.resultEn}
                    </p>
                  </div>

                  <div className="mb-6">
                    <span className="mb-3 block text-[10px] font-black uppercase tracking-wider text-slate-400">{text.includesLabel}</span>
                    <div className="grid gap-2">
                      {(isAr ? activeService.bulletsAr : activeService.bulletsEn).map((item) => (
                        <div key={item} className="flex items-start gap-2 text-sm font-bold text-slate-300">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: activeService.accent }} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="mb-3 block text-[10px] font-black uppercase tracking-wider text-slate-400">{text.stackLabel}</span>
                    <div className="flex flex-wrap gap-2">
                      {activeService.stack.map((item) => (
                        <span key={item} className="rounded-md border border-white/5 bg-slate-900/60 px-2.5 py-1 text-[10px] font-black text-slate-300">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Lane */}
              <div className="lg:col-span-8 xl:col-span-9">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-xl font-black text-slate-100">{text.packagesLabel}</h3>
                  <div className="flex items-center gap-2">
                    {displayPackages.length > 3 && (
                      <>
                        <button type="button" className="rounded-md border border-white/10 bg-slate-900/60 px-3 py-1.5 text-[10px] font-black text-slate-200 transition hover:border-[#ffbc01]" onClick={() => scrollPackages(-1)}>
                          {isAr ? 'السابق' : 'Prev'}
                        </button>
                        <button type="button" className="rounded-md border border-white/10 bg-slate-900/60 px-3 py-1.5 text-[10px] font-black text-slate-200 transition hover:border-[#ffbc01]" onClick={() => scrollPackages(1)}>
                          {isAr ? 'التالي' : 'Next'}
                        </button>
                      </>
                    )}

                  </div>
                </div>

                <div ref={pricingTrackRef} className="software-pricing-track grid grid-flow-col gap-3 overflow-x-auto scroll-smooth pt-6 pb-4 md:gap-4 px-1">
                  {displayPackages.map((pkg, index) => {
                    const isRecommended = pkg.highlighted ?? index === 1;
                    const isCustom = pkg.isCustomPlan;

                    return (
                      <div
                        key={`${pkg.nameEn}-${index}`}
                        className={cx(
                          'group relative flex flex-col justify-between rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 backdrop-blur-md',
                          isCustom
                            ? 'border border-transparent bg-slate-900/30 shadow-none hover:bg-slate-800/30'
                            : isRecommended
                              ? 'border border-slate-600/50 bg-slate-900/60 shadow-[0_8px_30px_rgba(0,0,0,0.4)]'
                              : 'border border-violet-950/30 bg-slate-900/40 shadow-sm hover:border-slate-600/40 hover:bg-slate-800/40'
                        )}
                      >
                        {/* Interactive hover border */}
                        {!isCustom && (
                          <div className="absolute inset-0 -z-10 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ boxShadow: `0 0 0 1px ${activeService.accent}60` }} />
                        )}

                        {isRecommended && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#ffbc01] px-3 py-0.5 text-[10px] font-black text-black shadow-sm">
                            {(isAr ? pkg.badgeAr : pkg.badgeEn) || (isAr ? 'موصى به' : 'Recommended')}
                          </div>
                        )}

                        <div>
                          <div className="mb-4 flex items-center justify-between">
                            <h4 className="text-base font-black text-slate-100">{isAr ? pkg.nameAr : pkg.nameEn}</h4>
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-colors group-hover:text-slate-200">
                              <PackageCheck className="h-4 w-4" />
                            </span>
                          </div>

                          <p className="min-h-[50px] text-xs font-medium leading-5 text-slate-400">
                            {isAr ? pkg.noteAr : pkg.noteEn}
                          </p>

                           <div className="my-6">
                             {(isAr ? pkg.originalPriceAr : pkg.originalPriceEn) && (
                               <div className="mb-1 text-xs font-bold text-slate-500 line-through">
                                 {isAr ? pkg.originalPriceAr : pkg.originalPriceEn}
                               </div>
                             )}
                             <motion.div
                               initial={{ opacity: 0, scale: 0.9 }}
                               animate={{ opacity: 1, scale: 1 }}
                               transition={{ duration: 0.4, delay: index * 0.1 }}
                               className="text-2xl font-black"
                               style={{ color: activeService.accent }}
                             >
                               {isAr ? pkg.priceAr : pkg.priceEn}
                             </motion.div>
                          </div>

                          <div className="space-y-3">
                            {(isAr ? pkg.featuresAr : pkg.featuresEn).map((feature) => (
                              <div key={feature} className="flex items-start gap-2 text-xs font-bold text-slate-300 transition-colors group-hover:text-slate-100">
                                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 transition-colors" style={{ color: activeService.accent }} />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => goToContact(pkg, index)}
                          className={cx(
                            "mt-8 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl text-xs font-black transition-all duration-300 active:scale-95",
                            isRecommended
                              ? "bg-[#9d027c] text-white shadow-md hover:bg-[#8a026e]"
                              : "bg-slate-950 text-slate-300 hover:bg-[#9d027c] hover:text-white border border-white/5"
                          )}
                        >
                          <span>{pkg.ctaText || (pkg.isCustomPlan ? (isAr ? 'ابدأ بناء الخطة' : 'Build Your Plan') : text.requestPackage)}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="border-y border-violet-950/30 bg-transparent py-16 sm:py-20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="mb-10 grid gap-5 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-12">
              <h2 className="text-[clamp(1.85rem,4vw,2.65rem)] font-black leading-[1.22] text-slate-200">
                {text.modulesTitle}
              </h2>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ideaModules.map((item, index) => {
              const Icon = item.icon;
              const accent = ['#9d027c', '#0ea5e9', '#f97316', '#7c3aed', '#12b981', '#ef4444'][index];

              return (
                <motion.article
                  key={item.titleEn}
                  className="rounded-lg border border-violet-950/30 bg-slate-900/40 p-5 shadow-sm"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.18) }}
                >
                  <span className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${accent}14`, color: accent }}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-black text-slate-200">{isAr ? item.titleAr : item.titleEn}</h3>
                  <p className="mt-3 text-sm font-medium leading-7 text-slate-400">{isAr ? item.textAr : item.textEn}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-900/40 py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-4">
            <h2 className="text-[clamp(1.85rem,4vw,2.65rem)] font-black leading-[1.22] text-slate-200">
              {text.processTitle}
            </h2>
            <p className="mt-4 text-sm font-medium leading-7 text-slate-400">
              {text.processLead}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              const accent = ['#9d027c', '#f97316', '#0ea5e9', '#12b981'][index];

              return (
                <article key={step.titleEn} className="rounded-lg border border-violet-950/30 bg-slate-900/40 p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-sm font-black" style={{ color: accent }}>
                      0{index + 1}
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900/40 text-slate-200 shadow-sm">
                      <Icon className="h-4 w-4" />
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-200">{isAr ? step.titleAr : step.titleEn}</h3>
                  <p className="mt-3 text-sm font-medium leading-7 text-slate-400">{isAr ? step.textAr : step.textEn}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-violet-950/30 bg-slate-950 py-16 text-slate-200 sm:py-20">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="mb-10 grid gap-5 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-12">
                <h2 className="text-[clamp(1.85rem,4vw,2.65rem)] font-black leading-[1.22]">
                {text.qualityTitle}
              </h2>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {qualityItems.map((item, index) => {
              const Icon = item.icon;
              const accent = ['#ffbc01', '#12b981', '#0ea5e9', '#f97316'][index];

              return (
                <article key={item.titleEn} className="rounded-lg border border-white/10 bg-slate-900/40/[0.05] p-5">
                  <span className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900/40/[0.08]" style={{ color: accent }}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-base font-black text-slate-200">{isAr ? item.titleAr : item.titleEn}</h3>
                  <p className="mt-3 text-sm font-medium leading-7 text-slate-200/60">{isAr ? item.textAr : item.textEn}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
