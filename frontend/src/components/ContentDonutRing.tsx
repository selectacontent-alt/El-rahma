/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { contentCategories } from '../data.ts';
import { ContentCategory, Language } from '../types.ts';
import { PieChart, Sparkles, BookOpen, HeartHandshake, Zap, Target } from 'lucide-react';

interface ContentDonutRingProps {
  currentLang?: Language;
}

export default function ContentDonutRing({ currentLang = 'ar' }: ContentDonutRingProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const activeCategory = contentCategories[activeIndex];
  const isAr = currentLang === 'ar';

  // Donut chart measurements
  const size = 260;
  const radius = 90;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;

  // Calculate cumulative percentages for offset
  let accumulatedPercentage = 0;

  const getIconForCategory = (id: string) => {
    switch (id) {
      case 'direct_sales':
        return <Target className="w-5 h-5 text-magenta" />;
      case 'brand_trust':
        return <HeartHandshake className="w-5 h-5 text-yellow-power" />;
      case 'education':
        return <BookOpen className="w-5 h-5 text-sky-accent" />;
      case 'trends':
        return <Zap className="w-5 h-5 text-emerald-success" />;
      default:
        return <PieChart className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
      <div className={`flex items-center justify-between mb-6 ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
        <span className="text-xs bg-[#9d027c]/10 text-[#9d027c] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          {isAr ? "البصمة الجينية للمحتوى" : "Content DNA"}
        </span>
        <h3 className="font-bold text-lg text-navy-deep">
          {isAr ? "تحليل تفجير التفاعل (Content DNA)" : "Engagement Boost Analysis (Content DNA)"}
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Aspect: Interactive SVG Donut Ring */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
          <div className="relative w-[280px] h-[280px] flex items-center justify-center">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="transform rotate-[-90deg] cursor-pointer"
            >
              {/* Filter for elegant subtle drop shadow */}
              <defs>
                <filter id="subtle-shadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.08" />
                </filter>
              </defs>

              {contentCategories.map((category, index) => {
                const strokeDashoffset = circumference - (category.percentage / 100) * circumference;
                const strokeDasharray = `${circumference} ${circumference}`;
                
                // Calculate starting angle of this segment for rotating the stroke correctly
                const rotation = (accumulatedPercentage / 100) * 360;
                accumulatedPercentage += category.percentage;

                const isCurrent = activeIndex === index;

                return (
                  <motion.circle
                    key={category.id}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={category.color}
                    strokeWidth={isCurrent ? strokeWidth + 6 : strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
                    strokeLinecap="round"
                    style={{
                      transition: 'stroke-width 0.3s ease, filter 0.3s ease',
                      filter: isCurrent ? 'url(#subtle-shadow)' : 'none',
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => setActiveIndex(index)}
                    className="hover:opacity-95"
                  />
                );
              })}
            </svg>

            {/* Content inside the donut holes */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-transparent pointer-events-none">
              <motion.span
                key={activeCategory.percentage}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl font-black font-mono text-navy-deep block leading-none"
                style={{ color: activeCategory.color }}
              >
                {activeCategory.percentage}%
              </motion.span>
              <motion.span
                key={activeCategory.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-semibold text-navy-deep mt-1 block"
              >
                {activeCategory.name}
              </motion.span>
              <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider block">
                {isAr ? "توزيع شهري مقترح" : "Suggested Monthly Split"}
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center mt-3 font-medium">
            {isAr 
              ? "مرر الماوس أو انقر فوق قطاعات الدائرة لاستكشاف تأثير كل نوع محتوى 💡" 
              : "Hover or click segments to explore each content type's effect 💡"}
          </p>
        </div>

        {/* Right Aspect: Category Details and Info Panel */}
        <div className="lg:col-span-6 space-y-4">
          <div className="space-y-2.5">
            {contentCategories.map((cat, index) => {
              const isSelected = activeIndex === index;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveIndex(index)}
                  className={`w-full p-3 rounded-xl border transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer ${
                    isAr ? 'text-right flex-row' : 'text-left flex-row-reverse'
                  } ${
                    isSelected
                      ? 'bg-white border-gray-200 shadow-md scale-[1.02]'
                      : 'bg-gray-50/70 border-transparent hover:bg-gray-50 hover:border-gray-100'
                  }`}
                  id={`btn-donut-cat-${cat.id}`}
                >
                  <div className={`flex items-center gap-3 ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform"
                      style={{ backgroundColor: `${cat.color}15` }}
                    >
                      {getIconForCategory(cat.id)}
                    </div>
                    <div className={isAr ? 'text-right' : 'text-left'}>
                      <h4 className="font-bold text-sm text-navy-deep">{cat.name}</h4>
                      <p className="text-xs text-gray-400 line-clamp-1">{cat.description}</p>
                    </div>
                  </div>
                  <span
                    className="text-base font-extrabold font-mono shrink-0 px-2.5 py-1 rounded-full text-sm bg-gray-100"
                    style={{ color: cat.color }}
                  >
                    {cat.percentage}%
                  </span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Example Box */}
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl p-4 bg-gray-50 border border-teal-500/10 mt-6 ${
              isAr ? 'border-r-4 text-right' : 'border-l-4 text-left'
            }`}
            style={{ 
              borderRightColor: isAr ? activeCategory.color : undefined, 
              borderLeftColor: !isAr ? activeCategory.color : undefined 
            }}
          >
            <div className={`flex items-center gap-1.5 text-navy-deep font-bold text-xs mb-1.5 ${
              isAr ? 'justify-start' : 'justify-end'
            }`}>
              <span>{isAr ? "فكـرة للمنشـور الذكي:" : "Smart Post Idea:"}</span>
            </div>
            <p className="text-xs text-navy-deep/80 italic font-medium leading-relaxed">
              {activeCategory.example}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
