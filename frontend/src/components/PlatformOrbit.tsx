/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { platformsData } from '../data.ts';
import { Platform, Language } from '../types.ts';
import { Facebook, Instagram, Music, Ghost, Youtube, Twitter, MessageSquare, Info } from 'lucide-react';

interface PlatformOrbitProps {
  currentLang?: Language;
}

export default function PlatformOrbit({ currentLang = 'ar' }: PlatformOrbitProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const isAr = currentLang === 'ar';

  const getPlatformIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case 'Facebook':
        return (
          <img src="/logos/meta.png" className="w-8 h-8 object-contain" alt="Meta" />
        );
      case 'Instagram':
        return (
          <img src="/logos/instagram.png" className="w-8 h-8 object-contain" alt="Instagram" />
        );
      case 'Music': // TikTok
        return (
          <img src="/logos/tiktok.png" className="w-8 h-8 object-contain" alt="TikTok" />
        );
      case 'Ghost': // Snapchat
        return (
          <img src="/logos/snapchat.png" className="w-8 h-8 object-contain" alt="Snapchat" />
        );
      case 'Youtube':
        return (
          <img src="/social-icons/icon5.png" className="w-8 h-8 object-contain" alt="YouTube" />
        );
      case 'Twitter': // X
        return (
          <img src="/logos/x.png" className="w-8 h-8 object-contain" alt="X" />
        );
      case 'MessageSquare': // WhatsApp
        return (
          <img src="/logos/whatsapp.png" className="w-8 h-8 object-contain" alt="WhatsApp" />
        );
      default:
        return <Info className="w-7 h-7 text-gray-400" />;
    }
  };

  return (
    <div className={`bg-slate-900/40 rounded-2xl border border-slate-800/80 p-8 shadow-sm ${isAr ? 'text-right' : 'text-left'}`}>
      <div className="max-w-xl mx-auto text-center mb-8">
        <h3 className="text-xl font-bold text-slate-100">
          {isAr ? "نغطيلك جميع المنصات التي يتواجد عليها زبائنك" : "We Cover All Channels Where Your Customers Congregate"}
        </h3>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          {isAr
            ? "لا نؤمن بالحل الموحد للجميع. كل مشروع تجاري له خريطة انتشار مخصصة لتحقيق أفضل تكلفة استقطاب عميل. مرر لرؤية دور كل منصة في مصر والدول العربية."
            : "We don't believe in one-size-fits-all. Every business has a tailored channel mix to ensure the lowest acquisition cost. Hover to see the role of each channel."}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        {platformsData.map((plat) => {
          const isHovered = hoveredId === plat.id;
          return (
            <div
              key={plat.id}
              className="relative"
              onMouseEnter={() => setHoveredId(plat.id)}
              onMouseLeave={() => setHoveredId(null)}
              id={`platform-container-${plat.id}`}
            >
              {/* Platform block indicator */}
              <motion.div
                whileHover={{ y: -4 }}
                className={`flex flex-col items-center justify-center p-5 rounded-xl border transition-all duration-200 cursor-pointer text-center bg-slate-950/40 ${
                  isHovered
                    ? 'border-magenta bg-slate-900/60 shadow-md'
                    : 'border-slate-800/60 hover:border-slate-700/60 bg-slate-950/20'
                }`}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-3 bg-slate-950 shadow-xs"
                  style={{ border: isHovered ? `2px solid ${plat.color}` : '1px solid #1e293b' }}
                >
                  {getPlatformIcon(plat.iconName, plat.color)}
                </div>
                <h4 className="text-xs font-bold text-slate-200">{isAr ? plat.nameArabic : plat.name}</h4>
              </motion.div>

              {/* Tooltip Statistics Card */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-64 p-4 rounded-xl bg-navy-deep text-white shadow-xl pointer-events-none ${
                      isAr ? 'text-right' : 'text-left'
                    }`}
                  >
                    {/* Small arrow marker */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1.5 w-3 h-3 bg-navy-deep rotate-45" />

                    <h5 className={`font-bold text-xs flex items-center gap-1.5 text-yellow-power mb-1 ${
                      isAr ? 'justify-end' : 'justify-start'
                    }`}>
                      {isAr ? plat.nameArabic : plat.name}
                      <span className="w-2 h-2 rounded-full bg-yellow-power animate-ping" />
                    </h5>
                    <p className="text-[11px] font-semibold text-gray-200 mb-2 leading-snug">
                      🎯 {plat.stats}
                    </p>
                    <p className="text-[10px] text-gray-300 leading-relaxed border-t border-gray-700/60 pt-2 font-medium">
                      {plat.usageArabic}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
