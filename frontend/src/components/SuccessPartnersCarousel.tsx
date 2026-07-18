'use client';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { PublicPartner } from '../lib/growthSite';
import { publicDriveUrl } from '../lib/siteApi';

export interface SuccessPartnersCarouselProps {
  partners: PublicPartner[];
  title: string;
  subtitle?: string;
  lang: 'ar' | 'en';
}

interface PartnerWithLogo extends PublicPartner {
  logoUrl: string;
}

const ROTATION_INTERVAL_MS = 3000;
const SWIPE_THRESHOLD_PX = 48;

function PartnerLogo({ partner }: { partner: PartnerWithLogo }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [partner.logoUrl]);

  return (
    <div
      role="listitem"
      tabIndex={0}
      className="group flex h-20 min-w-0 items-center justify-center px-3 outline-none sm:h-24 sm:px-6 lg:h-28 lg:px-8 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9d027c]"
    >
      {partner.logoUrl && !failed ? (
        <img
          src={partner.logoUrl}
          alt={partner.name}
          draggable={false}
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full max-h-10 w-full max-w-[140px] select-none object-contain opacity-95 transition-[filter,opacity,transform] duration-300 [filter:brightness(0)_saturate(100%)_invert(14%)_sepia(86%)_saturate(5038%)_hue-rotate(301deg)_brightness(83%)_contrast(103%)] group-hover:scale-[1.03] group-hover:opacity-100 group-hover:[filter:none] group-focus-visible:scale-[1.03] group-focus-visible:opacity-100 group-focus-visible:[filter:none] sm:max-h-12 sm:max-w-[170px] lg:max-h-14 lg:max-w-[190px]"
        />
      ) : (
        <span className="max-w-full select-none truncate text-center text-sm font-black tracking-tight text-[#9d027c] sm:text-base">
          {partner.name}
        </span>
      )}
    </div>
  );
}

export default function SuccessPartnersCarousel({
  partners,
  title,
  subtitle,
  lang,
}: SuccessPartnersCarouselProps) {
  const headingId = useId();
  const reduceMotion = Boolean(useReducedMotion());
  // Keep the initial server/client markup identical; the media-query effect
  // fills the extra tablet/desktop slots immediately after hydration.
  const [slotCount, setSlotCount] = useState(2);
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [pointerActive, setPointerActive] = useState(false);
  const [documentHidden, setDocumentHidden] = useState(false);
  const swipeStartX = useRef<number | null>(null);
  const preloadedImages = useRef<HTMLImageElement[]>([]);

  const normalizedPartners = useMemo<PartnerWithLogo[]>(() => {
    const seen = new Set<string>();

    return partners.reduce<PartnerWithLogo[]>((result, partner) => {
      const identity = partner.id || `${partner.name}-${partner.logo || ''}`;
      if (seen.has(identity)) return result;
      seen.add(identity);

      result.push({
        ...partner,
        logoUrl: partner.logo ? publicDriveUrl(partner.logo, partner.logo, 'w600') : '',
      });
      return result;
    }, []);
  }, [partners]);

  const pageCount = normalizedPartners.length > slotCount
    ? Math.ceil(normalizedPartners.length / slotCount)
    : 1;

  const visiblePartners = useMemo(() => {
    if (normalizedPartners.length <= slotCount) return normalizedPartners;

    const start = (pageIndex * slotCount) % normalizedPartners.length;
    return Array.from(
      { length: slotCount },
      (_, index) => normalizedPartners[(start + index) % normalizedPartners.length],
    );
  }, [normalizedPartners, pageIndex, slotCount]);

  const showNext = useCallback(() => {
    if (pageCount <= 1) return;
    setDirection(1);
    setPageIndex((current) => (current + 1) % pageCount);
  }, [pageCount]);

  const showPrevious = useCallback(() => {
    if (pageCount <= 1) return;
    setDirection(-1);
    setPageIndex((current) => (current - 1 + pageCount) % pageCount);
  }, [pageCount]);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const tabletQuery = window.matchMedia('(min-width: 640px)');
    const updateSlots = () => setSlotCount(desktopQuery.matches ? 5 : tabletQuery.matches ? 3 : 2);

    updateSlots();
    desktopQuery.addEventListener('change', updateSlots);
    tabletQuery.addEventListener('change', updateSlots);
    return () => {
      desktopQuery.removeEventListener('change', updateSlots);
      tabletQuery.removeEventListener('change', updateSlots);
    };
  }, []);

  useEffect(() => {
    setPageIndex(0);
    setDirection(1);
  }, [normalizedPartners.length, slotCount]);

  useEffect(() => {
    const handleVisibilityChange = () => setDocumentHidden(document.hidden);
    handleVisibilityChange();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    preloadedImages.current = normalizedPartners
      .map((partner) => partner.logoUrl)
      .filter(Boolean)
      .map((url) => {
        const image = new window.Image();
        image.src = url;
        return image;
      });

    return () => {
      preloadedImages.current = [];
    };
  }, [normalizedPartners]);

  const paused = hovered || focusWithin || pointerActive || documentHidden;

  useEffect(() => {
    if (reduceMotion || paused || pageCount <= 1) return;
    const timer = window.setInterval(showNext, ROTATION_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [pageCount, paused, reduceMotion, showNext]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    setPointerActive(true);
    swipeStartX.current = event.clientX;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    const startX = swipeStartX.current;
    const deltaX = startX === null ? 0 : event.clientX - startX;

    if (slotCount === 2 && Math.abs(deltaX) >= SWIPE_THRESHOLD_PX) {
      const isNextGesture = lang === 'ar'
        ? deltaX > SWIPE_THRESHOLD_PX
        : deltaX < -SWIPE_THRESHOLD_PX;
      if (isNextGesture) showNext();
      else showPrevious();
    }

    swipeStartX.current = null;
    setPointerActive(false);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const cancelPointerInteraction = () => {
    swipeStartX.current = null;
    setPointerActive(false);
  };

  if (!normalizedPartners.length) return null;

  const resolvedTitle = title.trim() || (lang === 'ar' ? 'شركاء النجاح' : 'Success Partners');
  const enterOffset = direction * (lang === 'ar' ? -18 : 18);

  return (
    <section
      aria-labelledby={headingId}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="relative w-full overflow-hidden bg-[#f2effb] py-12 text-[#17131a] sm:py-14 lg:py-16"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(157,2,124,0.055),transparent_32%),radial-gradient(circle_at_88%_92%,rgba(255,188,1,0.07),transparent_30%)]" />

      <div className="relative mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <header className="mx-auto max-w-2xl text-center">
          <h2 id={headingId} className="text-[clamp(1.65rem,4vw,3rem)] font-black leading-[1.2] tracking-tight text-[#241526]">
            {resolvedTitle}
          </h2>
          {subtitle?.trim() ? (
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#655b69] sm:text-base">
              {subtitle.trim()}
            </p>
          ) : null}
        </header>

        {reduceMotion ? (
          <div
            role="list"
            aria-live="off"
            className="mt-8 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-10"
            style={{
              msOverflowStyle: 'none',
              justifyContent: normalizedPartners.length <= slotCount ? 'center' : 'flex-start',
            }}
          >
            {normalizedPartners.map((partner) => (
              <div key={partner.id} className="min-w-[50%] basis-1/2 snap-start sm:min-w-[33.3333%] sm:basis-1/3 lg:min-w-[20%] lg:basis-1/5">
                <PartnerLogo partner={partner} />
              </div>
            ))}
          </div>
        ) : (
          <div
            aria-live="off"
            aria-atomic="true"
            className="mt-8 touch-pan-y select-none overflow-hidden sm:mt-10"
            onPointerEnter={(event) => {
              if (event.pointerType === 'mouse') setHovered(true);
            }}
            onPointerLeave={(event) => {
              if (event.pointerType === 'mouse') setHovered(false);
            }}
            onFocusCapture={() => setFocusWithin(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusWithin(false);
            }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={cancelPointerInteraction}
            onLostPointerCapture={cancelPointerInteraction}
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={`${slotCount}-${pageIndex}`}
                role="list"
                initial={{ opacity: 0, x: enterOffset }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -enterOffset }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="grid"
                style={{ gridTemplateColumns: `repeat(${visiblePartners.length}, minmax(0, 1fr))` }}
              >
                {visiblePartners.map((partner, index) => (
                  <PartnerLogo key={`${pageIndex}-${partner.id}-${index}`} partner={partner} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
