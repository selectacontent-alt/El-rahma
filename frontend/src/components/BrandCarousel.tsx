"use client";

import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { i18n } from '../i18n';
import { Language } from '../types';

interface BrandCarouselProps {
  currentLang: Language;
}

export default function BrandCarousel({ currentLang }: BrandCarouselProps) {
  const t = i18n[currentLang];

  // Config array: You can add as many partners as you want here!
  const partners = [
    {
      nameAr: 'بريق للمجوهرات',
      nameEn: 'Bareeq Jewelry',
      descAr: 'تصميم وصياغة الذهب الفاخر عيار 21',
      descEn: 'Premium 21-karat handcrafted gold solutions',
      logo: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=150&h=80&fit=crop&q=80'
    },
    {
      nameAr: 'الشمراني للنقل اللوجستي',
      nameEn: 'Al-Shahrani Logistics',
      descAr: 'إدارة سلاسل الإمداد والشحن الإقليمي',
      descEn: 'Regional freight forwarding & distribution cargo',
      logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&h=80&fit=crop&q=80'
    },
    {
      nameAr: 'عيادات ديرما لايف',
      nameEn: 'DermaLife Medical',
      descAr: 'خدمات التجميل ورعاية البشرة المتكاملة',
      descEn: 'Advanced dermatology & aesthetic skin care',
      logo: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=150&h=80&fit=crop&q=80'
    },
    {
      nameAr: 'سند للتكنولوجيا السحابية',
      nameEn: 'Sanad Cloud Tech',
      descAr: 'أنظمة إدارة المؤسسات والبرمجيات الذكية',
      descEn: 'Enterprise business intelligence & cloud software',
      logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=150&h=80&fit=crop&q=80'
    },
    {
      nameAr: 'نماء للاستثمار العقاري',
      nameEn: 'Namaa Real Estate',
      descAr: 'تطوير وتسويق المجمعات السكنية النخبوية',
      descEn: 'Marketing & development of premium compounds',
      logo: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=150&h=80&fit=crop&q=80'
    },
    {
      nameAr: 'وصال للمواد الغذائية',
      nameEn: 'Wessal Food Group',
      descAr: 'توزيع وتصنيع المواد الاستهلاكية الكبرى',
      descEn: 'FMCG distribution & supply chain group',
      logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&h=80&fit=crop&q=80'
    }
  ];

  // Repeat the array 3 times to ensure the track is wider than ultra-wide monitors
  const extendedPartners = [...partners, ...partners, ...partners];

  // Center-scaling effect removed to prevent layout thrashing and massive FPS drops.

  return (
    <section id="partners" className="py-20 bg-transparent border-t border-slate-800/80 overflow-hidden relative">
      {/* Background ambient lighting - Optimized */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(157,2,124,0.08) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center relative z-10">
        <h2 
          className="text-3xl md:text-5xl font-black tracking-tight leading-relaxed py-2 mb-2 text-transparent bg-clip-text drop-shadow-md"
          style={{
            backgroundImage: 'linear-gradient(90deg, #9d027c, #f43f5e, #ffbc01, #f43f5e, #9d027c)',
            backgroundSize: '200% auto',
            animation: 'gradient-melt 4s linear infinite'
          }}
        >
          {t.partners.title}
        </h2>
        <p className="text-xs text-slate-650 max-w-lg mx-auto leading-relaxed font-sans font-medium">
          {t.partners.subtitle}
        </p>
      </div>

      {/* Endless Scroll Bar Ribbon Container (Forced LTR for consistent infinite marquee movement) */}
      <div className="relative flex overflow-x-hidden py-8 border-y border-slate-800 bg-slate-900/40 backdrop-blur-sm" dir="ltr">
        {/* Soft fading overlays on edges */}
        <div className="absolute top-0 bottom-0 left-0 w-28 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-28 bg-gradient-to-l from-slate-950 via-slate-950/70 to-transparent z-20 pointer-events-none" />

        {/* Seamless Infinite Marquee Track Container */}
        <motion.div 
          className="flex w-max"
          animate={{ x: [0, '-50%'] }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            duration: 80, // Slower duration because the track is now 3x longer
            ease: 'linear'
          }}
        >
          {/* Track 1 */}
          <div className="flex gap-4 sm:gap-6 px-2 sm:px-3">
            {extendedPartners.map((partner, idx) => (
              <div
                key={`p1-${idx}`}
                className="flex flex-col items-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900 border border-slate-800 w-[110px] sm:w-[160px] select-none transition-all duration-300 origin-center hover:scale-[1.15] hover:z-10 hover:shadow-[0_20px_40px_rgba(157,2,124,0.15)] hover:border-[#9d027c]/40 will-change-transform"
              >
                {/* Logo Container */}
                <div className="h-12 sm:h-16 w-full flex items-center justify-center bg-slate-950 rounded-lg sm:rounded-xl border border-slate-850 p-1.5 sm:p-2 mb-2 sm:mb-3 overflow-hidden">
                  <img
                    src={partner.logo}
                    alt={currentLang === 'ar' ? partner.nameAr : partner.nameEn}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=80&fit=crop&q=80';
                    }}
                    className="h-full w-full object-contain filter transition-all duration-300"
                  />
                </div>

                {/* Text Content */}
                <div className="text-center w-full flex-1 flex flex-col justify-center">
                  <span className="font-sans text-[9px] sm:text-[11px] font-black text-slate-100 tracking-wide block whitespace-normal break-words">
                    {currentLang === 'ar' ? partner.nameAr : partner.nameEn}
                  </span>
                  <span className="font-sans text-[7px] sm:text-[9px] text-slate-550 leading-tight sm:leading-relaxed block mt-1 sm:mt-1.5 h-6 sm:h-8 overflow-hidden text-ellipsis whitespace-normal">
                    {currentLang === 'ar' ? partner.descAr : partner.descEn}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Track 2 (Identical Clone) */}
          <div className="flex gap-4 sm:gap-6 px-2 sm:px-3">
            {extendedPartners.map((partner, idx) => (
              <div
                key={`p2-${idx}`}
                className="flex flex-col items-center p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900 border border-slate-800 w-[110px] sm:w-[160px] select-none transition-all duration-300 origin-center hover:scale-[1.15] hover:z-10 hover:shadow-[0_20px_40px_rgba(157,2,124,0.15)] hover:border-[#9d027c]/40 will-change-transform"
              >
                {/* Logo Container */}
                <div className="h-12 sm:h-16 w-full flex items-center justify-center bg-slate-950 rounded-lg sm:rounded-xl border border-slate-850 p-1.5 sm:p-2 mb-2 sm:mb-3 overflow-hidden">
                  <img
                    src={partner.logo}
                    alt={currentLang === 'ar' ? partner.nameAr : partner.nameEn}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=80&fit=crop&q=80';
                    }}
                    className="h-full w-full object-contain filter transition-all duration-300"
                  />
                </div>

                {/* Text Content */}
                <div className="text-center w-full flex-1 flex flex-col justify-center">
                  <span className="font-sans text-[9px] sm:text-[11px] font-black text-slate-100 tracking-wide block whitespace-normal break-words">
                    {currentLang === 'ar' ? partner.nameAr : partner.nameEn}
                  </span>
                  <span className="font-sans text-[7px] sm:text-[9px] text-slate-550 leading-tight sm:leading-relaxed block mt-1 sm:mt-1.5 h-6 sm:h-8 overflow-hidden text-ellipsis whitespace-normal">
                    {currentLang === 'ar' ? partner.descAr : partner.descEn}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
