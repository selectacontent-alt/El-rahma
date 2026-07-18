"use client";

import React, { useState, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { Language } from './types';
import { i18n } from './i18n';
import Header from './components/Header';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import HomePage from './components/HomePage';
import ServicesGallery from './components/ServicesGallery';
import ContactStartPage from './components/ContactStartPage';
import { siteFetch } from './lib/siteApi';
import { normalizePublicServices, type PublicService } from './lib/homeApi';
import { PLAN_CART_ITEM_ADDED_EVENT, PLAN_CART_UPDATED_EVENT, readPlanCart, type PlanCartItem } from './lib/planCart';
import dynamic from 'next/dynamic';

const SocialMediaPage = dynamic(() => import('./components/SocialMediaPage'), { ssr: false });
const SocialMediaServicePage = dynamic(() => import('./components/SocialMediaServicePage'), { ssr: false });
const BrandingServicePage = dynamic(() => import('./components/BrandingServicePage'), { ssr: false });
const BrandingProjectsPage = dynamic(() => import('./components/BrandingProjectsPage'), { ssr: false });
const PortfolioNetworkPage = dynamic(() => import('./components/PortfolioNetworkPage'), { ssr: false });
const SCNewsPage = dynamic(() => import('./components/SCNewsPage'), { ssr: false });
const InteractiveGrid = dynamic(() => import('./components/InteractiveGrid'), { ssr: false });
const InteractiveConstellation = dynamic(() => import('./components/InteractiveConstellation'), { ssr: false });
const SpatialWebGallery = dynamic(() => import('./components/SpatialWebGallery'), { ssr: false });
const SoftwareExperience = dynamic(() => import('./components/SoftwareExperience'), { ssr: false });
const MediaServicePage = dynamic(() => import('./components/MediaServicePage'), { ssr: false });
const PlanCheckoutPage = dynamic(() => import('./components/PlanCheckoutPage'), { ssr: false });
const CustomPlanPage = dynamic(() => import('./components/CustomPlanPage'), { ssr: false });
const PromotionalServicePage = dynamic(() => import('./components/PromotionalServicePage'), { ssr: false });
const API_BASE = typeof window !== 'undefined' ? `http://${window.location.hostname}:5005` : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005');

const pathToTab = (path: string) => {
  const cleanPath = path.replace(/\/$/, '') || '/';
  if (cleanPath === '/') return 'home';
  if (cleanPath === '/portfolio') return 'portfolio';
  if (cleanPath === '/services') return 'services';
  if (cleanPath === '/projects') return 'projects';
  if (cleanPath === '/social-media') return 'projects-social';
  if (cleanPath === '/websites') return 'projects-websites';
  if (cleanPath === '/animation') return 'projects-animation';
  if (cleanPath === '/promotional') return 'projects-promotional';
  if (cleanPath === '/photography') return 'projects-photography';
  if (cleanPath === '/branding-projects') return 'projects-branding';
  if (cleanPath === '/contact') return 'contact';
  if (cleanPath === '/news' || cleanPath.startsWith('/news/')) return 'news';
  if (['/branding', '/software', '/social', '/media', '/checkout', '/custom-plan'].includes(cleanPath)) return cleanPath.substring(1);
  return 'home';
};

const tabToPath = (tab: string) => {
  if (tab === 'home') return '/';
  if (tab === 'portfolio') return '/portfolio';
  if (tab === 'services') return '/services';
  if (tab === 'projects') return '/projects';
  if (tab === 'projects-social') return '/social-media';
  if (tab === 'projects-websites') return '/websites';
  if (tab === 'projects-animation') return '/animation';
  if (tab === 'projects-promotional') return '/promotional';
  if (tab === 'projects-photography') return '/photography';
  if (tab === 'projects-branding') return '/branding-projects';
  if (tab === 'contact') return '/contact';
  if (tab === 'news') return '/news';
  return `/${tab}`;
};

const SERVICE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function selectedServiceSlugsFromSearch(search: string): string[] {
  const params = new URLSearchParams(search);
  const values = [...params.getAll('service'), ...params.getAll('services')]
    .flatMap(value => value.split(','))
    .map(value => value.trim().toLowerCase())
    .filter(value => SERVICE_SLUG_PATTERN.test(value));
  return [...new Set(values)];
}

interface AppProps {
  initialPath?: string;
}

export default function App({ initialPath }: AppProps) {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('site_lang');
      if (saved === 'ar' || saved === 'en') return saved as Language;
      
      const browserLang = navigator.language || (navigator as any).userLanguage || '';
      if (browserLang.toLowerCase().startsWith('ar')) {
        return 'ar';
      }

      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const arabicTimezones = [
          // 22 Arab Countries Timezones
          'Africa/Cairo', 'Africa/Casablanca', 'Africa/Algiers', 'Africa/Tunis', 'Africa/Tripoli', 
          'Africa/Khartoum', 'Africa/Nouakchott', 'Africa/Mogadishu', 'Africa/Djibouti', 'Indian/Comoro',
          'Asia/Riyadh', 'Asia/Dubai', 'Asia/Muscat', 'Asia/Kuwait', 'Asia/Qatar', 'Asia/Bahrain',
          'Asia/Amman', 'Asia/Damascus', 'Asia/Beirut', 'Asia/Baghdad', 'Asia/Jerusalem', 'Asia/Gaza', 
          'Asia/Hebron', 'Asia/Aden'
        ];
        if (arabicTimezones.includes(tz)) {
          return 'ar';
        }
      } catch (e) {
        // ignore
      }

      // Default to English for international users
      return 'en';
    }
    return 'ar';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('site_lang', lang);
    }
  }, [lang]);

  const [activeTab, setActiveTabState] = useState<string>(() => {
    if (initialPath) {
      return pathToTab(initialPath);
    }
    if (typeof window !== 'undefined') {
      return pathToTab(window.location.pathname);
    }
    return 'home';
  });
  const [socialTypingDone, setSocialTypingDone] = useState(false);
  const [publicServices, setPublicServices] = useState<PublicService[] | null | undefined>(undefined);
  const [cartCount, setCartCount] = useState(0);
  const [cartNotice, setCartNotice] = useState<PlanCartItem | null>(null);

  useEffect(() => {
    const refreshCartCount = () => setCartCount(readPlanCart().length);
    refreshCartCount();
    window.addEventListener(PLAN_CART_UPDATED_EVENT, refreshCartCount);
    return () => window.removeEventListener(PLAN_CART_UPDATED_EVENT, refreshCartCount);
  }, []);

  useEffect(() => {
    let dismissTimer: number | undefined;
    const showCartNotice = (event: Event) => {
      const plan = (event as CustomEvent<PlanCartItem>).detail;
      if (!plan) return;
      if (dismissTimer) window.clearTimeout(dismissTimer);
      setCartNotice(plan);
      dismissTimer = window.setTimeout(() => setCartNotice(null), 4200);
    };
    window.addEventListener(PLAN_CART_ITEM_ADDED_EVENT, showCartNotice);
    return () => {
      window.removeEventListener(PLAN_CART_ITEM_ADDED_EVENT, showCartNotice);
      if (dismissTimer) window.clearTimeout(dismissTimer);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    siteFetch<unknown>('/services', { signal: controller.signal })
      .then((payload) => {
        if (!controller.signal.aborted) {
          setPublicServices(payload ? normalizePublicServices(payload) : null);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setPublicServices(null);
      });
    return () => controller.abort();
  }, []);

  // Sync / Reset typing done status when tab changes
  useEffect(() => {
    if (activeTab !== 'social') {
      setSocialTypingDone(true);
    } else {
      setSocialTypingDone(false);
    }
  }, [activeTab]);

  // Form parameters
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [requestDetails, setRequestDetails] = useState<{data?: any, summary?: string}>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'contact') return;
    setSubmitted(false);
    setSubmitting(false);
    setSubmitError(null);
  }, [activeTab]);

  const t = i18n[lang];

  // Sync URL to State on mount and history changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initialTab = pathToTab(window.location.pathname);
      setActiveTabState(initialTab);

      const applyContactSelection = () => {
        const requested = selectedServiceSlugsFromSearch(window.location.search);
        if (requested.length) {
          setSelectedServices(current => [...new Set([...current, ...requested])]);
        }
      };
      applyContactSelection();

      const handlePopState = () => {
        setActiveTabState(pathToTab(window.location.pathname));
        applyContactSelection();
      };
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);

  // Custom setter that updates the URL
  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    if (typeof window !== 'undefined') {
      const newPath = tabToPath(tab);
      if (window.location.pathname !== newPath) {
        window.history.pushState({}, '', newPath);
      }
    }
  };

  // Dynamically set HTML tag direction on language change
  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = lang;
  }, [lang, t.dir]);

  const serviceOptions = publicServices || [];
  const servicesLoading = publicServices === undefined;
  const requiresServiceSelection = serviceOptions.length > 0;
  const isContactReady = Boolean(name.trim() && email.trim() && (!requiresServiceSelection || selectedServices.length));

  useEffect(() => {
    if (!publicServices) return;
    const activeSlugs = new Set(publicServices.map(service => service.slug));
    setSelectedServices(current => current.filter(slug => activeSlugs.has(slug)));
  }, [publicServices]);

  const openContact = (serviceSlugs: string[] = []) => {
    if (serviceSlugs.length) {
      setSelectedServices((current) => [...new Set([...current, ...serviceSlugs])]);
    }
    setSubmitted(false);
    setSubmitting(false);
    setSubmitError(null);
    setActiveTab('contact');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleServiceSelect = (id: string) => {
    setSubmitError(null);
    setSelectedServices((current) => current.includes(id)
      ? current.filter((serviceId) => serviceId !== id)
      : [...current, id]
    );
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !name.trim() || !email.trim() || (requiresServiceSelection && !selectedServices.length)) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const fullMessage = [
        message,
        requestDetails.summary ? `\n--- تفاصيل الخطط والخيارات ---\n${requestDetails.summary}` : ''
      ].filter(Boolean).join('\n');

      const response = await fetch(`${API_BASE}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company,
          selectedServices,
          message: fullMessage || selectedServices.join(', ') || 'Website lead',
          source: 'website-contact-form',
          requestDetails: requestDetails.data
        }),
      });

      if (!response.ok) {
        throw new Error(`Contact request failed with status ${response.status}`);
      }

      setSubmitted(true);
      setTimeout(() => {
        setName('');
        setEmail('');
        setCompany('');
        setSelectedServices([]);
        setMessage('');
        setRequestDetails({});
      }, 2500);
    } catch {
      setSubmitError(lang === 'ar'
        ? 'تعذر إرسال الطلب الآن. راجع اتصالك وحاول مرة أخرى.'
        : 'We could not send your request right now. Check your connection and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderComingSoonProjectPage = (titleAr: string, titleEn: string, leadAr: string, leadEn: string) => (
    <section className="relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(157,2,124,0.1),transparent_38%)]" />
      <div className="relative mx-auto max-w-5xl rounded-lg border border-[#dccab6] bg-white/80 p-8 text-center shadow-[0_24px_54px_rgba(33,28,36,0.08)] sm:p-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#d8c5ad] bg-[#fff9f1] px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#8a6f59]">
          <Sparkles className="h-3.5 w-3.5 text-[#9d027c]" />
          <span>{lang === 'ar' ? 'قريبًا في المعرض' : 'Portfolio lane in progress'}</span>
        </div>
        <h1 className="mt-6 text-[clamp(2rem,4vw,3rem)] font-black leading-[1.18] tracking-normal text-[#211c24]">
          {lang === 'ar' ? titleAr : titleEn}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#5b4c55] sm:text-base">
          {lang === 'ar' ? leadAr : leadEn}
        </p>
      </div>
    </section>
  );

  const isLightPage = activeTab === 'news' || activeTab === 'portfolio' || activeTab === 'contact';
  const useCustomCursor = !isLightPage || activeTab === 'portfolio';

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('custom-cursor-on', useCustomCursor);
    document.documentElement.classList.toggle('native-cursor-page', !useCustomCursor);
    return () => {
      document.documentElement.classList.remove('custom-cursor-on');
      document.documentElement.classList.remove('native-cursor-page');
    };
  }, [useCustomCursor]);

  return (
    <div className={`relative min-h-screen font-sans overflow-x-hidden antialiased selection:bg-[#9d027c]/25 selection:text-slate-900 transition-colors duration-300 ${
      useCustomCursor ? 'lg:cursor-none' : ''
    } ${
      isLightPage ? 'bg-[#fafafa] text-slate-900' : 'bg-slate-950 text-slate-100'
    }`}>
      
      {/* Dynamic Glowing Custom Cursor element */}
      {useCustomCursor && <CustomCursor />}

      {/* Keep the original grid interaction, but neutralize its canvas layer so
          the translucent violet strokes stay legible on the light site surface. */}
      {!isLightPage && (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 grayscale opacity-45">
          <InteractiveGrid />
        </div>
      )}

      {/* Interactive Constellation Dots globally visible across scroll */}
      {!isLightPage && <InteractiveConstellation />}
      {/* Header element with translation capability and tab control */}
      <motion.div
        initial={activeTab === 'social' ? { opacity: 0, y: -100 } : { opacity: 1, y: 0 }}
        animate={socialTypingDone ? { opacity: 1, y: 0 } : { opacity: 0, y: -100 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <Header 
          currentLang={lang} 
          setLang={setLang} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      </motion.div>

      {/* Dynamic SPA tab domains with Framer Motion AnimatePresence */}
      <main className="relative z-20 min-h-[75vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {activeTab === 'home' && (
              <HomePage currentLang={lang} onContact={openContact} />
            )}
            {activeTab === 'services' && (
              <ServicesGallery currentLang={lang} services={publicServices} onContact={openContact} setActiveTab={setActiveTab} />
            )}

            {activeTab === 'portfolio' && (
              <PortfolioNetworkPage currentLang={lang} setActiveTab={setActiveTab} />
            )}

            {activeTab === 'software' && (
              <SoftwareExperience currentLang={lang} setActiveTab={setActiveTab} />
            )}

            {activeTab === 'social' && (
              <SocialMediaServicePage 
                currentLang={lang} 
                setActiveTab={setActiveTab} 
                onTypingComplete={() => setSocialTypingDone(true)} 
              />
            )}

            {activeTab === 'branding' && (
              <BrandingServicePage currentLang={lang} setActiveTab={setActiveTab} />
            )}

            {activeTab === 'projects-branding' && (
              <BrandingProjectsPage currentLang={lang} setActiveTab={setActiveTab} />
            )}

            {activeTab === 'news' && (
              <SCNewsPage currentLang={lang} setActiveTab={setActiveTab} />
            )}

            {activeTab === 'projects-social' && (
              <SocialMediaPage currentLang={lang} />
            )}

            {activeTab === 'projects-websites' && (
              <SpatialWebGallery lang={lang} />
            )}

            {activeTab === 'projects-animation' && (
              renderComingSoonProjectPage(
                'فيديوهات الرسوم المتحركة',
                'Animated Videos',
                'نعمل على عرض نماذج موشن تشرح الفكرة بسرعة وتصلح للحملات، صفحات الهبوط، والسوشيال ميديا.',
                'We are preparing motion samples that explain ideas quickly for campaigns, landing pages, and social media.'
              )
            )}

            {activeTab === 'projects-promotional' && (
              <PromotionalServicePage currentLang={lang} setActiveTab={setActiveTab} />
            )}

            {activeTab === 'projects-photography' && (
              renderComingSoonProjectPage(
                'التصوير الفوتوغرافي',
                'Product Photography',
                'نعمل على ترتيب نماذج تصوير توضح المنتج، الاستخدام، والتفاصيل التي تساعد العميل على اتخاذ قرار الشراء.',
                'We are arranging photography samples that show the product, usage, and details customers need before buying.'
              )
            )}

            {activeTab === 'projects' && (
              <div className="pt-32 pb-24 min-h-[75vh] flex flex-col items-center justify-center text-center">
                 <h1 
                   className="mb-6 text-[clamp(2rem,4vw,3rem)] font-black leading-[1.18] tracking-normal text-transparent bg-clip-text drop-shadow-md"
                   style={{
                     backgroundImage: 'linear-gradient(90deg, #9d027c, #f43f5e, #ffbc01, #f43f5e, #9d027c)',
                          backgroundSize: '200% auto',
                              animation: 'gradient-melt 4s linear infinite'
                   }}
                 >
                    {lang === 'ar' ? 'مشروعات تخدم أهداف النمو' : 'Projects built around growth goals'}
                  </h1>
                  <p className="max-w-2xl px-4 text-base leading-8 text-slate-400 sm:text-lg">{lang === 'ar' ? 'نجهز عرضاً منظماً للأعمال حسب نوع الخدمة، الهدف التجاري، والنتيجة التي حققها كل مشروع.' : 'We are preparing a clearer showcase organized by service type, business goal, and the outcome each project delivered.'}</p>
              </div>
            )}

            {activeTab === 'media' && (
              <MediaServicePage currentLang={lang} setActiveTab={setActiveTab} />
            )}

            {activeTab === 'checkout' && (
              <PlanCheckoutPage currentLang={lang} setActiveTab={setActiveTab} />
            )}

            {activeTab === 'custom-plan' && (
              <CustomPlanPage currentLang={lang} setActiveTab={setActiveTab} />
            )}

            {activeTab === 'contact' && (
              <ContactStartPage
                lang={lang}
                copy={t.contact}
                services={serviceOptions}
                servicesLoading={servicesLoading}
                selectedServices={selectedServices}
                submitted={submitted}
                submitting={submitting}
                submitError={submitError}
                isReady={isContactReady}
                name={name}
                email={email}
                company={company}
                message={message}
                onServiceToggle={handleServiceSelect}
                onNameChange={setName}
                onEmailChange={setEmail}
                onCompanyChange={setCompany}
                onMessageChange={setMessage}
                onSubmit={handleContactSubmit}
                onRequestDetailsChange={setRequestDetails}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {cartCount > 0 && activeTab !== 'checkout' && (
        <button type="button" onClick={() => setActiveTab('checkout')} className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[60] inline-flex h-12 min-w-12 items-center justify-center gap-2 rounded-full bg-[#9d027c] px-3 text-sm font-black text-white shadow-[0_16px_35px_rgba(157,2,124,.32)] transition hover:-translate-y-0.5 hover:bg-[#820267] sm:bottom-5 sm:right-5 sm:h-auto sm:min-w-0 sm:rounded-2xl sm:px-4 sm:py-3" aria-label={lang === 'ar' ? 'فتح طلب الخطط' : 'Open plan request'}>
          <ShoppingBag size={18} />
          <span className="hidden sm:inline">{lang === 'ar' ? 'طلبك' : 'Request'}</span>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ffbc01] px-1 text-[11px] text-[#221523]">{cartCount}</span>
        </button>
      )}

      <AnimatePresence>
        {cartNotice && activeTab !== 'checkout' && (
          <motion.div initial={{ opacity: 0, y: 18, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18, scale: .96 }} className="fixed bottom-[5.5rem] right-4 z-[61] flex w-[calc(100%-2rem)] max-w-sm items-center gap-3 rounded-2xl border border-white/20 bg-[#101828]/95 p-3.5 text-white shadow-[0_20px_50px_rgba(15,23,42,.35)] backdrop-blur sm:bottom-24 sm:right-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300"><CheckCircle2 size={20} /></span>
            <span className="min-w-0 flex-1"><strong className="block truncate text-sm">{lang === 'ar' ? 'تمت إضافة الخطة للطلب' : 'Plan added to your request'}</strong><small className="mt-0.5 block truncate text-xs text-slate-300">{cartNotice.title}</small></span>
            <button type="button" onClick={() => { setCartNotice(null); setActiveTab('checkout'); }} className="shrink-0 rounded-xl bg-[#ffbc01] px-3 py-2 text-xs font-black text-[#211c24] transition hover:bg-[#ffd04d]">{lang === 'ar' ? 'فتح' : 'View'}</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styled Footer */}
      <motion.div
        initial={activeTab === 'social' ? { opacity: 0, y: 100 } : { opacity: 1, y: 0 }}
        animate={socialTypingDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        <Footer currentLang={lang} setActiveTab={setActiveTab} activeTab={activeTab} />
      </motion.div>

    </div>
  );
}
