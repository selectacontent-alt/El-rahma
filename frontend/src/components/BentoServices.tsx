"use client";

import React, { useState, useEffect, cloneElement } from 'react';
import { Megaphone, Code, Brain, CheckCircle, Check } from 'lucide-react';
import { servicesData, i18n } from '../i18n';
import { Language } from '../types';
import CardSwap, { Card } from './CardSwap';
import './BentoCTA.css';

const AnimatedText = ({ text, offset = 0 }: { text: string, offset?: number }) => {
  const chunks = text.split(' ');
  
  return (
    <>
      {chunks.map((chunk, index) => (
        <React.Fragment key={index}>
          <span style={{ '--i': index + offset } as React.CSSProperties}>
            {chunk}
          </span>
          {index < chunks.length - 1 && <span style={{ '--i': index + 0.5 + offset } as React.CSSProperties}>&nbsp;</span>}
        </React.Fragment>
      ))}
    </>
  );
};

export const AnimatedCTA = ({ text, textSent, className = '', onClick }: { text: string, textSent: string, className?: string, onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void }) => {
  return (
    <button className={`bento-btn ${className}`} onClick={onClick}>
      <div className="bento-outline"></div>
      <div className="bento-btn-state state--default">
        <div className="bento-icon">
          <svg
            width="1.2em"
            height="1.2em"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g style={{ filter: "url(#shadow)" }}>
              <path
                d="M19 4 L14 19 Q12.5 13 4 11 Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              ></path>
              <circle cx="7" cy="18" r="2.5" fill="currentColor"></circle>
            </g>
            <defs>
              <filter id="shadow">
                <feDropShadow
                  dx="0"
                  dy="1"
                  stdDeviation="0.6"
                  floodOpacity="0.5"
                ></feDropShadow>
              </filter>
            </defs>
          </svg>
        </div>
        <p>
          <AnimatedText text={text} offset={0} />
        </p>
      </div>
      <div className="bento-btn-state state--sent">
        <div className="bento-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            strokeWidth="0.5px"
            stroke="black"
          >
            <g style={{ filter: "url(#shadow)" }}>
              <path
                fill="currentColor"
                d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z"
              ></path>
              <path
                fill="currentColor"
                d="M10.5795 15.5801C10.3795 15.5801 10.1895 15.5001 10.0495 15.3601L7.21945 12.5301C6.92945 12.2401 6.92945 11.7601 7.21945 11.4701C7.50945 11.1801 7.98945 11.1801 8.27945 11.4701L10.5795 13.7701L15.7195 8.6301C16.0095 8.3401 16.4895 8.3401 16.7795 8.6301C17.0695 8.9201 17.0695 9.4001 16.7795 9.6901L11.1095 15.3601C10.9695 15.5001 10.7795 15.5801 10.5795 15.5801Z"
              ></path>
            </g>
          </svg>
        </div>
        <p>
          <AnimatedText text={textSent} offset={5} />
        </p>
      </div>
    </button>
  );
};

interface BentoServicesProps {
  currentLang: Language;
  setActiveTab?: (tab: string) => void;
}

export default function BentoServices({ currentLang, setActiveTab }: BentoServicesProps) {
  const t = i18n[currentLang];
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dynamic theme parameters for each division (Unified to Brand Color)
  const getTheme = (id: string) => {
    switch (id) {
      case 'marketing-advertising':
        return {
          icon: <Megaphone className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#9d027c]" />,
          glow: 'bg-[#9d027c]/10 border-[#9d027c]/10 text-[#9d027c]',
          border: 'hover:border-[#9d027c]/25',
          accent: 'from-[#9d027c] to-purple-600',
          shadow: 'hover:shadow-[0_20px_40px_rgba(157,2,124,0.04)]',
          badge: 'text-[#9d027c] bg-[#9d027c]/5 border-[#9d027c]/10'
        };
      case 'artificial-intelligence':
        return {
          icon: <Brain className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-500" />,
          glow: 'bg-amber-500/10 border-amber-500/10 text-amber-600',
          border: 'hover:border-amber-500/25',
          accent: 'from-amber-400 to-yellow-500',
          shadow: 'hover:shadow-[0_20px_40px_rgba(245,158,11,0.04)]',
          badge: 'text-amber-600 bg-amber-500/5 border-amber-500/10'
        };
      case 'web-design-dev':
        return {
          icon: <Code className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#9d027c]" />,
          glow: 'bg-[#9d027c]/10 border-[#9d027c]/10 text-[#9d027c]',
          border: 'hover:border-[#9d027c]/25',
          accent: 'from-[#9d027c] to-pink-600',
          shadow: 'hover:shadow-[0_20px_40px_rgba(157,2,124,0.04)]',
          badge: 'text-[#9d027c] bg-[#9d027c]/5 border-[#9d027c]/10'
        };
      default:
        return {
          icon: <Megaphone className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#9d027c]" />,
          glow: 'bg-[#9d027c]/10 border-[#9d027c]/10 text-[#9d027c]',
          border: 'hover:border-[#9d027c]/25',
          accent: 'from-[#9d027c] to-purple-500',
          shadow: 'hover:shadow-[0_20px_40px_rgba(157,2,124,0.04)]',
          badge: 'text-[#9d027c] bg-[#9d027c]/5 border-[#9d027c]/10'
        };
    }
  };

  return (
    <section id="services" className="py-24 bg-transparent relative overflow-hidden">
      {/* Background radial soft light - highly optimized */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(157,2,124,0.08) 0%, transparent 70%)' }} />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-start">
          
          {/* Section Header (Left/Right side) */}
          <div className="hidden lg:flex flex-col relative z-20 text-right rtl:text-right ltr:text-left pt-8 lg:pt-12">
            
            {/* Decorative Element */}
            <div className="self-start w-16 h-1.5 bg-gradient-to-r from-[#9d027c] to-purple-500 mb-8 rounded-full shadow-[0_0_15px_rgba(157,2,124,0.4)]" />

            <h2 
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight mb-6 leading-relaxed font-sans drop-shadow-md w-full text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(90deg, #9d027c, #f43f5e, #ffbc01, #f43f5e, #9d027c)',
                backgroundSize: '200% auto',
                animation: 'gradient-melt 4s linear infinite'
              }}
            >
              {t.services.title}
            </h2>
            
            {/* Editorial Quote Style Paragraph */}
            <div className="relative pl-6 rtl:pl-0 rtl:pr-6 border-l-4 rtl:border-l-0 rtl:border-r-4 border-[#9d027c] mt-2 mb-12">
              <p className="text-lg sm:text-xl text-slate-300 font-sans leading-relaxed max-w-lg font-medium">
                {t.services.subtitle}
              </p>
            </div>
            
            {/* High-end Interactive CTA (Hidden on Mobile only) */}
            <div className="self-start mt-4 hidden lg:block">
              <AnimatedCTA 
                text={currentLang === 'ar' ? 'ابدأ مشروعك الآن' : 'Start Your Project Now'} 
                textSent={currentLang === 'ar' ? 'تم الاختيار' : 'Selected!'} 
                onClick={(e) => {
                  e.preventDefault();
                  setTimeout(() => {
                    if (setActiveTab) setActiveTab('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 1600);
                }}
              />
            </div>

          </div>

          {/* CardSwap Animated Stack (Other side) */}
          <div className={`w-full flex flex-col items-center relative z-10 ${isMobile ? 'min-h-[460px]' : 'min-h-[650px]'} lg:-mt-4`}>
            <CardSwap
              width={isMobile ? 280 : 420}
              height={isMobile ? 440 : 650}
              cardDistance={isMobile ? -20 : -40}
              verticalDistance={isMobile ? 20 : 40}
              delay={2500}
              pauseOnHover={true}
              skewAmount={isMobile ? 0 : -3}
            >
              {servicesData.map((service, index) => {
                const title = currentLang === 'ar' ? service.titleAr : service.titleEn;
                const desc = currentLang === 'ar' ? service.descAr : service.descEn;
                const details = currentLang === 'ar' ? service.detailsAr : service.detailsEn;
                const metrics = currentLang === 'ar' ? service.metricsAr : service.metricsEn;
                const theme = getTheme(service.id);

                return (
                  <Card
                    key={service.id}
                    className={`overflow-hidden flex flex-col justify-between p-3.5 sm:p-8 rounded-[20px] sm:rounded-[24px] border border-slate-800 bg-slate-900/40 backdrop-blur-sm shadow-2xl shadow-slate-950/5 cursor-grab active:cursor-grabbing text-right rtl:text-right ltr:text-left`}
                  >
                    {/* Top Border Accent Glow */}
                    <div className={`absolute top-0 left-0 right-0 h-[2px] sm:h-[5px] bg-gradient-to-r ${theme.accent}`} />

                    {/* Corner radial glow blur watermark - Optimized */}
                    <div className={`absolute -right-10 -bottom-10 w-20 h-20 sm:w-40 sm:h-40 bg-gradient-to-br ${theme.accent} opacity-[0.08] rounded-full pointer-events-none`} style={{ filter: 'drop-shadow(0 0 20px rgba(157,2,124,0.1))' }} />

                    {/* Card Header */}
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2.5 sm:mb-6">
                        <div className={`p-2 sm:p-3 rounded-lg sm:rounded-2xl border ${theme.glow}`}>
                          {cloneElement(theme.icon as React.ReactElement<any>, { className: "w-4 h-4 sm:w-6 sm:h-6" })}
                        </div>
                      </div>

                      <h3 className="text-base sm:text-2xl font-black text-slate-100 font-sans tracking-tight mb-1 sm:mb-3">
                        {title}
                      </h3>

                      <p className="text-[9px] sm:text-xs text-slate-400 font-sans leading-relaxed mb-2.5 sm:mb-6 line-clamp-2 sm:line-clamp-none">
                        {desc}
                      </p>
                    </div>

                    {/* Details Canvas */}
                    <div className="border-t border-slate-800 pt-2.5 sm:pt-5 mt-auto relative z-10 flex-1 flex flex-col justify-end">
                      
                      {/* Modern list items displayed vertically */}
                      <ul className="grid grid-cols-1 gap-1 sm:gap-2.5 mb-2.5 sm:mb-5">
                        {details.map((detail, dIdx) => (
                          <li 
                            key={dIdx} 
                            className="flex gap-1.5 sm:gap-2.5 items-start text-[8px] sm:text-[11px] text-slate-300 leading-tight bg-slate-950/30 p-1.5 sm:p-3 rounded-lg sm:rounded-xl border border-slate-800"
                          >
                            <CheckCircle className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-[#9d027c] shrink-0 mt-[1px]" />
                            <span className="font-sans font-medium">{detail}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Targeted KPI Performance Badge */}
                      <div className="p-1.5 sm:p-3.5 rounded-lg sm:rounded-xl bg-slate-950/40 backdrop-blur-sm border border-slate-800 flex items-center justify-between shadow-sm mt-auto">
                        <span className="text-[8px] sm:text-[10px] font-sans text-slate-500 font-bold uppercase tracking-widest">
                          {t.services.metricsLabel}
                        </span>
                        <span className="text-[9px] sm:text-[11px] font-sans text-[#9d027c] font-black px-2 sm:px-3 py-0.5 sm:py-1 bg-[#9d027c]/10 border border-[#9d027c]/20 rounded-full">
                          {metrics}
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </CardSwap>

            {/* High-end Interactive CTA (Mobile only - below cards) */}
            <div className="hidden">
              <AnimatedCTA 
                text={currentLang === 'ar' ? 'ابدأ مشروعك الآن' : 'Start Your Project Now'} 
                textSent={currentLang === 'ar' ? 'تم الاختيار' : 'Selected!'} 
                onClick={(e) => {
                  e.preventDefault();
                  setTimeout(() => {
                    if (setActiveTab) setActiveTab('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 1600);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
