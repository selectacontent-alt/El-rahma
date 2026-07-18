"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Film, 
  Play, 
  Camera, 
  Video, 
  Clapperboard, 
  Sparkles, 
  MoveRight,
  Focus,
  Aperture,
  Zap,
  MonitorPlay
} from "lucide-react";
import type { Language } from "../types";

interface PromotionalServicePageProps {
  currentLang: Language;
  setActiveTab?: (tab: string) => void;
}

const copy = {
  ar: {
    heroBadge: "الإنتاج الدعائي والتجاري",
    heroTitle: "فيديوهات دعائية تشرح العرض وتحرك قرار الشراء",
    heroDesc: "نكتب الفكرة، نخطط المشاهد، وننتج فيديو واضح يناسب الإعلانات والسوشيال وصفحات البيع، مع نسخ قصيرة قابلة للاختبار.",
    ctaPrimary: "ابدأ بريف الفيديو",
    ctaSecondary: "شاهد نماذج الأعمال",
    stats: [
      { label: "نسخ جاهزة للمنصات", value: "Multi" },
      { label: "سيناريو وCTA واضح", value: "1:1" },
      { label: "إنتاج وتسليم منظم", value: "360°" }
    ],
    servicesTitle: "حلول فيديو تناسب كل هدف",
    services: [
      {
        icon: Camera,
        title: "الإعلانات التجارية (Commercials)",
        desc: "فيديوهات قصيرة برسالة واضحة ونداء إجراء مباشر، مناسبة للحملات المدفوعة والمنصات."
      },
      {
        icon: Film,
        title: "الأفلام الوثائقية للشركات",
        desc: "نرتب قصة الشركة أو المشروع في فيلم قصير يشرح القيمة ويبني ثقة أكبر مع العميل."
      },
      {
        icon: MonitorPlay,
        title: "تغطية الفعاليات والمؤتمرات",
        desc: "توثيق مرتب للفعاليات والمؤتمرات مع لقطات تصلح للتقارير والسوشيال والإعلانات اللاحقة."
      },
      {
        icon: Aperture,
        title: "تصوير المنتجات بالفيديو",
        desc: "فيديوهات تعرض الاستخدام والتفاصيل والفوائد، حتى يفهم العميل المنتج قبل قرار الشراء."
      }
    ],
    processTitle: "كيف نصل من الفكرة لفيديو جاهز للنشر؟",
    process: [
      { step: "01", title: "الهدف والرسالة", desc: "نحدد الجمهور، العرض، الاعتراضات، والنتيجة المطلوبة من الفيديو." },
      { step: "02", title: "السيناريو والتحضير", desc: "نكتب النص، نرتب المشاهد، ونحدد المواقع والمعدات قبل يوم التصوير." },
      { step: "03", title: "التصوير والإنتاج", desc: "نصور اللقطات المطلوبة بإضاءة وصوت مناسبين لاستخدام الفيديو في الحملات." },
      { step: "04", title: "المونتاج والتسليم", desc: "نجهز النسخة الرئيسية ونسخ المنصات القصيرة مع ألوان وصوت وCTA واضح." }
    ],
    showcaseTitle: "مقتطفات من أعمالنا",
    contactBanner: "جاهز لتحويل فكرتك إلى فيديو يخدم الحملة؟",
    contactBtn: "ابدأ البريف"
  },
  en: {
    heroBadge: "Commercial & Promotional Production",
    heroTitle: "Promotional videos that explain the offer and move buying decisions",
    heroDesc: "We write the idea, plan the shots, and produce clear video assets for ads, social, and sales pages, with short cuts ready for testing.",
    ctaPrimary: "Start the Video Brief",
    ctaSecondary: "View Work Samples",
    stats: [
      { label: "Platform-ready cuts", value: "Multi" },
      { label: "Clear script and CTA", value: "1:1" },
      { label: "Organized production", value: "360°" }
    ],
    servicesTitle: "Video Solutions for Every Goal",
    services: [
      {
        icon: Camera,
        title: "Commercial Ads",
        desc: "Short videos with a focused message and direct CTA, ready for paid campaigns and social channels."
      },
      {
        icon: Film,
        title: "Corporate Documentaries",
        desc: "We structure your company or project story into a short film that explains value and builds trust."
      },
      {
        icon: MonitorPlay,
        title: "Event & Conference Coverage",
        desc: "Organized event coverage with shots that work for reports, social posts, and future campaigns."
      },
      {
        icon: Aperture,
        title: "Product Video Shoots",
        desc: "Videos that show usage, details, and benefits so customers understand the product before buying."
      }
    ],
    processTitle: "How We Move from Idea to Launch-ready Video",
    process: [
      { step: "01", title: "Goal and Message", desc: "We define the audience, offer, objections, and action the video should create." },
      { step: "02", title: "Script and Prep", desc: "We write the copy, arrange scenes, and set locations and gear before the shoot." },
      { step: "03", title: "Production", desc: "We capture the required shots with lighting and sound suited for campaign use." },
      { step: "04", title: "Editing and Delivery", desc: "We prepare the main video and short platform cuts with color, sound, and a clear CTA." }
    ],
    showcaseTitle: "Featured Showreels",
    contactBanner: "Ready to turn your idea into a campaign video?",
    contactBtn: "Start the Brief"
  }
};

export default function PromotionalServicePage({ currentLang, setActiveTab }: PromotionalServicePageProps) {
  const t = copy[currentLang];
  const isAr = currentLang === 'ar';

  return (
    <div className="min-h-screen bg-transparent text-slate-200 selection:bg-violet-500/30">
      {/* Background Ambience */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(157,2,124,0.06)_0%,transparent_70%)] blur-[100px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(109,40,217,0.05)_0%,transparent_70%)] blur-[100px]" />
        {/* Cinematic Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="relative z-10 pt-32 pb-24">
        {/* HERO SECTION */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-bold text-violet-400 uppercase tracking-widest backdrop-blur-md mb-8"
          >
            <Clapperboard className="w-4 h-4" />
            {t.heroBadge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[clamp(2rem,6vw,3.75rem)] font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-100 via-white to-violet-100 mb-6 tracking-normal leading-[1.16]"
          >
            {t.heroTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto max-w-3xl text-base text-slate-400 mb-12 leading-8 sm:text-lg"
          >
            {t.heroDesc}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={() => {
                setActiveTab?.('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#9d027c] to-violet-600 text-white font-bold text-sm tracking-wide shadow-[0_0_40px_rgba(157,2,124,0.3)] hover:shadow-[0_0_60px_rgba(157,2,124,0.5)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Video className="w-4 h-4" />
              {t.ctaPrimary}
            </button>
            <button 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm tracking-wide hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              {t.ctaSecondary}
            </button>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto border-y border-white/5 py-10"
          >
            {t.stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center justify-center gap-2">
                <div className="text-4xl font-black text-violet-500">{stat.value}</div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* SERVICES SECTION */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(1.85rem,4vw,2.65rem)] font-black leading-[1.22] text-slate-100 mb-6">
              {t.servicesTitle}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#9d027c] to-transparent mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {t.services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative p-8 rounded-3xl bg-slate-900/40 border border-violet-950/30 hover:bg-slate-900/60 transition-colors overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl group-hover:bg-violet-500/20 transition-all" />
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9d027c]/20 to-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                    <service.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-100">{service.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{service.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* PROCESS SECTION */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(1.85rem,4vw,2.65rem)] font-black leading-[1.22] text-slate-100 mb-6">
              {t.processTitle}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#9d027c] to-transparent mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {t.process.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative p-6 rounded-2xl bg-slate-900/30 border border-violet-950/30 flex flex-col gap-4"
              >
                <div className="text-5xl font-black text-white/5 absolute top-4 right-4">{step.step}</div>
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-sm font-bold mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-100 mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* SHOWCASE TEASER */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(1.85rem,4vw,2.65rem)] font-black leading-[1.22] text-slate-100 mb-6">
              {t.showcaseTitle}
            </h2>
          </div>
          
          <div className="relative rounded-3xl overflow-hidden aspect-video bg-slate-900/60 border border-violet-950/40 group cursor-pointer flex items-center justify-center">
             <div className="absolute inset-0 bg-gradient-to-tr from-violet-900/20 to-transparent opacity-50" />
             {/* Simulated video thumbnail abstract UI */}
             <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-[#9d027c] transition-all z-10 shadow-[0_0_50px_rgba(157,2,124,0.3)]">
               <Play className="w-8 h-8 ml-1" />
             </div>
             
             {/* Overlay frame lines */}
             <div className="absolute inset-8 border border-white/10 pointer-events-none rounded-xl" />
             <div className="absolute top-1/2 left-4 w-4 h-px bg-white/20" />
             <div className="absolute top-1/2 right-4 w-4 h-px bg-white/20" />
             <div className="absolute left-1/2 top-4 w-px h-4 bg-white/20" />
             <div className="absolute left-1/2 bottom-4 w-px h-4 bg-white/20" />
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-32">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#9d027c] to-indigo-900 p-10 md:p-16 text-center shadow-[0_20px_60px_rgba(157,2,124,0.3)] border border-violet-500/20">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
            <h2 className="text-[clamp(1.85rem,4vw,2.65rem)] font-black leading-[1.22] text-white mb-8 relative z-10">
              {t.contactBanner}
            </h2>
            <button 
              onClick={() => {
                setActiveTab?.('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="relative z-10 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#9d027c] font-bold text-sm tracking-wide shadow-xl hover:scale-105 active:scale-95 transition-transform"
            >
              <Zap className="w-4 h-4" />
              {t.contactBtn}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
