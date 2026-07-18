import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import DomeGallery from './DomeGallery';
import { Language } from '../types';
import { Sparkles, Check } from 'lucide-react';
import { publicDriveUrl, siteFetch } from '../lib/siteApi';

interface Category {
  id: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  keyword: string;
  description?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  imageCount?: number;
  images?: Array<{
    fileId?: string;
    url?: string;
    thumbnailUrl?: string;
    originalName?: string;
    driveName?: string;
  }>;
}

const categories: Category[] = [
  { id: 'furniture', name: 'أثاث منزلي', keyword: 'furniture' },
  { id: 'kitchens', name: 'مطابخ', keyword: 'kitchen' },
  { id: 'gym', name: 'جيم ورياضة', keyword: 'gym' },
  { id: 'finance', name: 'بنوك وخدمات مالية', keyword: 'finance' },
  { id: 'medical', name: 'طب وعيادات', keyword: 'medical' },
  { id: 'beauty', name: 'تجميل وتخسيس', keyword: 'beauty' },
  { id: 'home_appliances', name: 'أدوات منزلية', keyword: 'appliance' },
  { id: 'salon', name: 'بيوتي سنتر وصالونات', keyword: 'salon' },
  { id: 'jewelry', name: 'مجوهرات', keyword: 'jewelry' },
  { id: 'tourism', name: 'سياحة', keyword: 'tourism' },
  { id: 'realestate', name: 'عقارات', keyword: 'realestate' },
  { id: 'pest_control', name: 'مكافحة حشرات', keyword: 'pest' },
  { id: 'decor', name: 'ديكورات', keyword: 'decor' },
  { id: 'electronics', name: 'أجهزة كهربائية', keyword: 'electronics' },
  { id: 'cars', name: 'خدمات سيارات', keyword: 'car' },
  { id: 'education', name: 'مؤسسات تعليمية', keyword: 'education' },
  { id: 'perfumes', name: 'عطور', keyword: 'perfume' },
  { id: 'software', name: 'تسويق وبرامج', keyword: 'software' },
  { id: 'furnishings', name: 'مفروشات ومراتب', keyword: 'bed' },
  { id: 'restaurants', name: 'مطاعم', keyword: 'restaurant' },
  { id: 'fashion', name: 'موضة وأزياء', keyword: 'fashion' },
  { id: 'delivery', name: 'شحن وتوصيل', keyword: 'delivery' },
  { id: 'religious', name: 'محتوى ديني', keyword: 'mosque' },
  { id: 'food_products', name: 'منتجات غذائية', keyword: 'food' },
  { id: 'water', name: 'مياه وفلاتر', keyword: 'water' },
  { id: 'glass_wood', name: 'أعمال زجاج وخشب', keyword: 'glass' },
  { id: 'accessories', name: 'إكسسوارات', keyword: 'accessories' },
  { id: 'office_furniture', name: 'أثاث مكتبي', keyword: 'office' },
  { id: 'agriculture', name: 'زراعة', keyword: 'agriculture' },
  { id: 'cleaning', name: 'تركيب وتنظيف', keyword: 'cleaning' },
  { id: 'construction', name: 'أعمال الكهرباء', keyword: 'construction' },
  { id: 'cosmetics', name: 'مستحضرات تجميل', keyword: 'cosmetics' },
  { id: 'industrial', name: 'أعمال صناعية', keyword: 'industrial' },
  { id: 'advertising', name: 'دعاية وإعلان', keyword: 'advertising' }
];

interface GalleryImage {
  src: string;
  fullSrc: string;
  alt: string;
}

interface CategoryImagesResponse {
  images: Array<{
    fileId?: string;
    url?: string;
    thumbnailUrl?: string;
    originalName?: string;
    driveName?: string;
  }>;
  nextOffset: number | null;
  hasMore: boolean;
}

interface SocialMediaPageProps {
  currentLang: Language;
}

interface SyncScrollingRowsProps {
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (id: string) => void;
}

const SyncScrollingCols = ({ categories, activeCategory, setActiveCategory }: SyncScrollingRowsProps) => {
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);
  const activeScrollSource = useRef<number | null>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Audio Context for the safe dial ticking sound
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastTickIndex = useRef<number>(0);

  const playTickSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Realistic Vault Dial Sound: Contains a mechanical "clack" and a metallic "ring"
      
      // Part 1: Primary Metallic Ring (The "Clink")
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(2500, ctx.currentTime);
      gain1.gain.setValueAtTime(0.6, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      // Part 2: Secondary Metallic Ring (Adds realistic metal dissonance)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(3800, ctx.currentTime);
      gain2.gain.setValueAtTime(0.3, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      // Part 3: The Mechanical "Knock" (The physical gear falling into place)
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.type = 'square';
      osc3.frequency.setValueAtTime(400, ctx.currentTime);
      osc3.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.01);
      gain3.gain.setValueAtTime(0.5, ctx.currentTime);
      gain3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.015);

      // Play all parts simultaneously
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.06);
      osc2.start(ctx.currentTime);
      osc2.stop(ctx.currentTime + 0.05);
      osc3.start(ctx.currentTime);
      osc3.stop(ctx.currentTime + 0.015);
    } catch (e) {
      // Ignore audio errors if browser blocks it before interaction
    }
  };

  // Divide the 34 categories into 3 chunks
  const cols = [
    categories.slice(0, 12),
    categories.slice(12, 23),
    categories.slice(23, 34)
  ];

  // Initialize Col 2 (the middle column) to the opposite scroll edge to prevent snap on first scroll
  useEffect(() => {
    const handleInitialLoad = () => {
      if (col2Ref.current) {
        const maxScroll = col2Ref.current.scrollHeight - col2Ref.current.clientHeight;
        if (maxScroll > 0) {
          col2Ref.current.scrollTop = maxScroll;
        }
      }
    };
    
    // Add small delay to ensure DOM is fully rendered
    setTimeout(handleInitialLoad, 100);

    // Auto-scroll animation logic
    let animationFrameId: number;
    let scrollDirection = 1;
    let exactScrollPos = 0;
    let isInitialized = false;

    const autoScroll = () => {
      if (col1Ref.current && activeScrollSource.current === null) {
        const target = col1Ref.current;
        const maxScroll = target.scrollHeight - target.clientHeight;
        
        if (maxScroll > 0) {
          if (!isInitialized) {
            exactScrollPos = target.scrollTop;
            isInitialized = true;
          }

          // If user manually scrolled, resync our float variable
          if (Math.abs(exactScrollPos - target.scrollTop) > 2) {
            exactScrollPos = target.scrollTop;
          }
          
          if (exactScrollPos >= maxScroll - 1) {
            scrollDirection = -1;
          } else if (exactScrollPos <= 1) {
            scrollDirection = 1;
          }
          
          // Move smoothly
          exactScrollPos += (scrollDirection * 0.8);
          
          // Pretend col 1 is scrolling to sync others
          activeScrollSource.current = 0;
          target.scrollTop = exactScrollPos;
          
          const scrollPercentage = exactScrollPos / maxScroll;
          
          if (col2Ref.current) {
            const t2 = col2Ref.current;
            const t2Max = t2.scrollHeight - t2.clientHeight;
            t2.scrollTop = (1 - scrollPercentage) * t2Max;
          }
          
          if (col3Ref.current) {
            const t3 = col3Ref.current;
            const t3Max = t3.scrollHeight - t3.clientHeight;
            t3.scrollTop = scrollPercentage * t3Max;
          }
          
          activeScrollSource.current = null;
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>, colIndex: number) => {
    if (activeScrollSource.current !== null && activeScrollSource.current !== colIndex) {
      return;
    }
    activeScrollSource.current = colIndex;

    const source = e.currentTarget;
    const maxScroll = source.scrollHeight - source.clientHeight;
    if (maxScroll <= 0) return;

    const scrollTop = source.scrollTop;
    const scrollPercentage = scrollTop / maxScroll;

    // Trigger tick sound every 25 pixels of scroll
    const currentTickIndex = Math.floor(scrollTop / 25);
    if (currentTickIndex !== lastTickIndex.current) {
      playTickSound();
      lastTickIndex.current = currentTickIndex;
    }

    const refs = [col1Ref, col2Ref, col3Ref];
    refs.forEach((ref, idx) => {
      if (idx === colIndex || !ref.current) return;
      const target = ref.current;
      const targetMaxScroll = target.scrollHeight - target.clientHeight;
      if (targetMaxScroll <= 0) return;

      const isSameDirection = (idx % 2 === colIndex % 2);
      const targetPercentage = isSameDirection ? scrollPercentage : (1 - scrollPercentage);

      target.scrollTop = targetPercentage * targetMaxScroll;
    });

    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      activeScrollSource.current = null;
    }, 50);
  };

  return (
    <>
      {cols.map((colCats, idx) => (
        <div 
          key={idx} 
          className="relative w-full max-w-[220px] h-[390px] rounded-[50px] border border-white/5 bg-slate-900/20 backdrop-blur-sm shadow-xl shadow-black/10 overflow-hidden transition-all"
        >
          <div
            ref={idx === 0 ? col1Ref : idx === 1 ? col2Ref : col3Ref}
            onScroll={(e) => handleScroll(e, idx)}
            className="flex flex-col overflow-y-auto hide-scrollbar gap-3 w-full h-full snap-y snap-mandatory px-3 py-[15px]"
            style={{ scrollBehavior: 'auto', WebkitOverflowScrolling: 'touch' }}
          >
            {colCats.map((cat, catIndex) => {
              const isActive = activeCategory === cat.id;
              return (
                <div key={cat.id} className="flex-shrink-0 snap-center w-full flex flex-col gap-1 relative z-20">
                  <button
                    onClick={() => {
                      setActiveCategory(cat.id);
                      
                      const targetScrollTop = (catIndex - 2) * 72;
                      const colRef = idx === 0 ? col1Ref : idx === 1 ? col2Ref : col3Ref;
                      
                      if (colRef.current) {
                        activeScrollSource.current = idx;
                        colRef.current.scrollTo({ top: Math.max(0, targetScrollTop), behavior: 'smooth' });
                      }
                    }}
                    className={`w-full h-[60px] px-2 text-[12px] sm:text-sm leading-tight font-bold transition-all duration-300 flex flex-col items-center justify-center gap-1 hover:scale-110 hover:z-30 ${
                      isActive
                        ? 'text-[#9d027c] scale-105 z-30'
                        : 'text-slate-400 hover:text-[#9d027c]'
                    }`}
                  >
                    <span className="text-center relative">
                      {cat.name}
                      {isActive && (
                        <motion.span 
                          layoutId="activeCategoryUnderline"
                          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-[#9d027c] rounded-full" 
                        />
                      )}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
};

export default function SocialMediaPage({ currentLang }: SocialMediaPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0].id);
  const [cmsCategories, setCmsCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [isGalleryLoading, setIsGalleryLoading] = useState(false);
  const [isGalleryLoadingMore, setIsGalleryLoadingMore] = useState(false);
  const [galleryError, setGalleryError] = useState(false);
  const galleryCacheRef = useRef(new Map<string, GalleryImage[]>());
  const galleryPagingRef = useRef(new Map<string, { nextOffset: number; hasMore: boolean }>());
  const galleryRequestRef = useRef<AbortController | null>(null);
  const activeKeywordRef = useRef<string | null>(null);
  const idleHandleRef = useRef<number | null>(null);
  const loadingMoreRef = useRef(false);

  const displayCategories = useMemo(() => {
    const source = cmsCategories.length ? cmsCategories : categories;
    return source.map(category => ({
      ...category,
      name: currentLang === 'ar' ? category.nameAr || category.name : category.nameEn || category.nameAr || category.name,
      description: currentLang === 'ar' ? category.descriptionAr || category.description : category.descriptionEn || category.descriptionAr || category.description,
    }));
  }, [cmsCategories, currentLang]);

  const activeCategoryData = useMemo(
    () => displayCategories.find(category => category.id === activeCategory) || displayCategories[0],
    [activeCategory, displayCategories]
  );

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const loadCategories = async () => {
      try {
        const data = await siteFetch<Category[]>('/social-media-categories?summary=1', {
          cache: 'force-cache',
          signal: controller.signal,
        });
        if (!active) return;
        if (data?.length) {
          const mapped = data.map(category => ({
            ...category,
            id: category.keyword || String(category.id),
            name: category.nameAr || category.nameEn || category.keyword,
            keyword: category.keyword || String(category.id),
          }));
          setCmsCategories(mapped);
          setActiveCategory(current => mapped.some(category => category.id === current) ? current : mapped[0].id);
        }
      } finally {
        if (active) {
          setIsLoading(false);
          setCategoriesLoaded(true);
        }
      }
    };
    loadCategories();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const cancelScheduledGalleryLoad = useCallback(() => {
    if (typeof window === 'undefined' || idleHandleRef.current === null) return;
    const browserWindow = window as Window & {
      cancelIdleCallback?: (handle: number) => void;
    };
    if (browserWindow.cancelIdleCallback) {
      browserWindow.cancelIdleCallback(idleHandleRef.current);
    } else {
      window.clearTimeout(idleHandleRef.current);
    }
    idleHandleRef.current = null;
  }, []);

  const loadGalleryPage = useCallback(async (keyword: string, offset: number, replace: boolean) => {
    if (!replace && loadingMoreRef.current) return false;
    const controller = new AbortController();
    galleryRequestRef.current?.abort();
    galleryRequestRef.current = controller;
    if (replace) {
      setIsGalleryLoading(true);
      setGalleryError(false);
    } else {
      loadingMoreRef.current = true;
      setIsGalleryLoadingMore(true);
    }

    try {
      const payload = await siteFetch<CategoryImagesResponse>(
        // Keep the first paint light; the remaining images are requested by the
        // idle pagination pass once the sphere is already interactive.
        `/social-media-categories/${encodeURIComponent(keyword)}/images?offset=${offset}&limit=12`,
        { cache: 'force-cache', signal: controller.signal }
      );
      if (!payload || controller.signal.aborted || activeKeywordRef.current !== keyword) return false;

      const pageImages = payload.images
        .map((image, index) => {
          const src = publicDriveUrl(image.fileId, image.thumbnailUrl || image.url, 'w320');
          const fullSrc = publicDriveUrl(image.fileId, image.url || image.thumbnailUrl, 'original') || src;
          return {
            src,
            fullSrc,
            alt: image.originalName || image.driveName || `${keyword} design ${offset + index + 1}`,
          };
        })
        .filter(image => image.src);
      const previousImages = replace ? [] : galleryCacheRef.current.get(keyword) || [];
      const mergedImages = Array.from(
        new Map([...previousImages, ...pageImages].map(image => [image.src, image])).values()
      );

      galleryCacheRef.current.set(keyword, mergedImages);
      galleryPagingRef.current.set(keyword, {
        nextOffset: payload.nextOffset ?? mergedImages.length,
        hasMore: payload.hasMore,
      });
      setGalleryImages(mergedImages);
      setGalleryError(false);
      return payload.hasMore;
    } catch {
      if (!controller.signal.aborted && activeKeywordRef.current === keyword) {
        setGalleryError(true);
      }
      return false;
    } finally {
      if (galleryRequestRef.current === controller) galleryRequestRef.current = null;
      if (activeKeywordRef.current === keyword) {
        setIsGalleryLoading(false);
        setIsGalleryLoadingMore(false);
      }
      loadingMoreRef.current = false;
    }
  }, []);

  const scheduleGalleryMore = useCallback((keyword: string) => {
    cancelScheduledGalleryLoad();
    if (typeof window === 'undefined') return;
    const run = async () => {
      idleHandleRef.current = null;
      if (activeKeywordRef.current !== keyword) return;
      const paging = galleryPagingRef.current.get(keyword);
      if (!paging?.hasMore) return;
      const hasMore = await loadGalleryPage(keyword, paging.nextOffset, false);
      if (hasMore && activeKeywordRef.current === keyword) scheduleGalleryMore(keyword);
    };
    const browserWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
    };
    idleHandleRef.current = browserWindow.requestIdleCallback
      ? browserWindow.requestIdleCallback(run, { timeout: 1800 })
      : window.setTimeout(run, 1400);
  }, [cancelScheduledGalleryLoad, loadGalleryPage]);

  const activeKeyword = activeCategoryData?.keyword || '';

  useEffect(() => {
    if (!categoriesLoaded || !activeKeyword) return;
    activeKeywordRef.current = activeKeyword;
    cancelScheduledGalleryLoad();
    galleryRequestRef.current?.abort();

    if (!cmsCategories.length) {
      setGalleryImages([]);
      setGalleryError(true);
      setIsGalleryLoading(false);
      return () => undefined;
    }

    const cachedImages = galleryCacheRef.current.get(activeKeyword);
    if (cachedImages) {
      setGalleryImages(cachedImages);
      setGalleryError(false);
      setIsGalleryLoading(false);
      if (galleryPagingRef.current.get(activeKeyword)?.hasMore) scheduleGalleryMore(activeKeyword);
    } else {
      setGalleryImages([]);
      setIsGalleryLoading(true);
      void loadGalleryPage(activeKeyword, 0, true).then(hasMore => {
        if (hasMore && activeKeywordRef.current === activeKeyword) scheduleGalleryMore(activeKeyword);
      });
    }

    return () => {
      cancelScheduledGalleryLoad();
      galleryRequestRef.current?.abort();
    };
  }, [activeKeyword, categoriesLoaded, cancelScheduledGalleryLoad, cmsCategories.length, loadGalleryPage, scheduleGalleryMore]);

  const handleCategorySelect = (id: string) => {
    setActiveCategory(id);
    // Smooth scroll down to gallery
    setTimeout(() => {
      const galleryEl = document.getElementById('gallery-section');
      if (galleryEl) {
        galleryEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const domeImages = galleryImages;

  return (
    <div className="pt-28 pb-20 min-h-screen bg-transparent flex flex-col items-center">
      
      {/* Premium Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-[radial-gradient(ellipse_at_top,#9d027c15_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* 1. Organized Header Area */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center mb-16 pt-10">
        
        <h1 
          className="text-[clamp(2rem,6vw,3.6rem)] font-black tracking-normal leading-[1.18] mb-6"
        >
          {currentLang === 'ar' ? (
            <>
              تصميمات <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9d027c] to-[#d6027a]">تخدم خطة المحتوى</span>
            </>
          ) : (
            <>
              Social Designs <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9d027c] to-[#d6027a]">Built for Content Plans</span>
            </>
          )}
        </h1>

        <p 
          className="text-slate-300 text-base md:text-lg max-w-3xl mx-auto leading-8 font-medium"
        >
          {currentLang === 'ar' 
            ? 'تصفح نماذج تصميمات مبنية على فكرة ورسالة واضحة لكل قطاع، تصلح للمنشورات، الحملات، والعروض الموسمية.'
            : 'Browse design samples built around clear ideas and messages for each sector, ready for posts, campaigns, and seasonal offers.'}
        </p>
      </div>

      {/* 2. Organized Category Navigation (Unified 3-Column View) */}
      <div className="w-full relative z-20 mb-10 overflow-hidden px-2">
        <div className="flex flex-row justify-center gap-3 sm:gap-6 w-full max-w-4xl mx-auto relative">
          <SyncScrollingCols 
              categories={displayCategories} 
              activeCategory={activeCategory} 
              setActiveCategory={handleCategorySelect} 
          />
        </div>
      </div>

      {/* 3. Dedicated Gallery Container (Seamless Background) */}
      <div id="gallery-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex-1 min-h-[600px] flex flex-col mt-4 pt-10">
        <div className="mb-5 flex flex-col items-center text-center">
          <h2 className="text-[clamp(1.75rem,4vw,2.65rem)] font-black tracking-normal leading-[1.22] text-transparent bg-clip-text bg-gradient-to-r from-[#9d027c] to-[#d6027a]">
            {activeCategoryData?.name}
          </h2>
        </div>
        <div className="w-full h-[650px] relative">
          
          <AnimatePresence mode="wait">
            {isLoading || isGalleryLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4"
              >
                <div className="w-10 h-10 border-4 border-[#9d027c]/20 border-t-[#9d027c] rounded-full animate-spin" />
                <span className="text-xs font-bold text-slate-400">
                  {currentLang === 'ar' ? 'جاري تحميل التصميمات...' : 'Loading designs...'}
                </span>
              </motion.div>
            ) : galleryError || !domeImages.length ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center px-6 text-center"
              >
                <div className="max-w-sm rounded-2xl border border-[#9d027c]/15 bg-white/45 px-6 py-5 text-sm font-bold text-slate-500 shadow-sm backdrop-blur-sm">
                  {galleryError
                    ? (currentLang === 'ar' ? 'تعذر تحميل تصميمات هذا التصنيف حاليًا.' : 'Designs for this category could not be loaded right now.')
                    : (currentLang === 'ar' ? 'لا توجد تصميمات متاحة لهذا التصنيف.' : 'No designs are available for this category.')}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <DomeGallery
                  images={domeImages}
                  fit={0.6}
                  minRadius={300}
                  maxVerticalRotationDeg={15}
                   segments={18}
                  dragSensitivity={8} 
                  dragDampening={0.9} 
                  overlayBlurColor="transparent"
                  overlayBlurTransparent="transparent"
                  openedImageWidth="600px"
                  openedImageHeight="600px"
                  imageBorderRadius="12px"
                  openedImageBorderRadius="24px"
                  grayscale={false}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hint Overlay inside the box */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-2.5 rounded-full border border-[#9d027c]/40 text-xs text-[#9d027c] font-bold pointer-events-none z-10 shadow-[0_4px_20px_rgba(157,2,124,0.15)] flex items-center gap-2">
            {isGalleryLoadingMore
              ? (currentLang === 'ar' ? 'جاري تحميل المزيد من التصميمات...' : 'Loading more designs...')
              : (currentLang === 'ar' ? 'اسحب الصور لتدوير المعرض، واضغط على أي تصميم لتكبيره' : 'Drag to rotate gallery, click to enlarge any design')}
          </div>

        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
