import React, { useState, useEffect, useRef } from "react";
import { JOURNEY_STEPS } from "./data";
import { ClipboardList, MapPin, Camera, Sliders, Send, Film, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { JourneyStep } from "./types";

interface ProductionTimelineProps {
  isAr: boolean;
}

interface TimelineRowProps {
  key?: React.Key;
  step: JourneyStep;
  index: number;
  isAr: boolean;
  isActive: boolean;
  getStepIcon: (iconName: string) => React.ReactNode;
  getDeliverables: (stepNum: string) => { ar: string[]; en: string[] };
}

function TimelineRow({ step, index, isAr, isActive, getStepIcon, getDeliverables }: TimelineRowProps) {
  const isEven = index % 2 === 0;
  const deliverables = getDeliverables(step.stepNumber);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 35, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      data-step-card={step.id}
      className={`flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 relative ${
        isEven ? "md:flex-row-reverse" : ""
      }`}
    >
      
      {/* 1. Content Card (Occupies left or right side) - Automatically glows/lights up when in view */}
      <div className="w-full md:w-[42%] text-right">
        <div 
          className={`bg-slate-900/40 border-2 rounded-2xl p-4.5 md:p-5 transition-all duration-500 relative group ${
            isActive 
              ? "border-media-pink-500 shadow-xl shadow-media-pink-500/10 -translate-y-1.5" 
              : "border-[#000000]/20 shadow-sm hover:shadow-lg hover:border-media-pink-500/80 hover:-translate-y-0.5"
          }`}
        >
          
          {/* Top edge colored glow highlight */}
          <div 
            className={`absolute top-0 left-6 right-6 h-1 rounded-b-full bg-gradient-to-r from-media-pink-500 to-media-rose-500 transition-opacity duration-300 pointer-events-none ${
              isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`} 
          />

          {/* Step tag number & Icon */}
          <div className="flex justify-between items-center mb-3">
            <div 
              className={`p-2.5 border rounded-xl transition-all duration-300 ${
                isActive 
                  ? "bg-gradient-to-br from-media-pink-50 to-media-rose-50 border-media-pink-300 text-media-pink-600 scale-105" 
                  : "bg-media-pink-50/50 border-media-pink-100/40 text-media-pink-600 group-hover:bg-gradient-to-br group-hover:from-media-pink-50 group-hover:to-media-rose-50"
              }`}
            >
              {getStepIcon(step.icon)}
            </div>
            <span className="font-mono text-3xl sm:text-4xl font-black bg-gradient-to-r from-media-pink-600 via-media-rose-500 to-media-amber-500 bg-clip-text text-transparent select-none tracking-tight">
              {step.stepNumber}
            </span>
          </div>

          <h3 
            className={`text-base font-bold transition-colors duration-300 ${
              isActive ? "text-media-pink-600" : "!text-black group-hover:text-media-pink-600"
            }`}
            style={{ color: isActive ? undefined : "#000000" }}
          >
            {isAr ? step.titleAr : step.titleEn}
          </h3>
          
          <p className="text-media-slate-500 text-[11px] sm:text-xs mt-2 leading-relaxed">
            {isAr ? step.descriptionAr : step.descriptionEn}
          </p>

          {/* Highly descriptive production deliverables/milestones replace simulated system status blocks */}
          <div className="mt-4 pt-3.5 border-t border-media-slate-100">
            <span className="block text-[9px] font-mono font-bold text-media-slate-400 tracking-wider mb-2 uppercase text-right">
              {isAr ? "مخرجات المرحلة" : "PHASE MILESTONES"}
            </span>
            <ul className="space-y-1 flex flex-col items-end">
              {(isAr ? deliverables.ar : deliverables.en).map((item, idx) => (
                <li key={idx} className="flex items-center gap-1.5 text-[10px] sm:text-xs text-media-slate-500 font-medium leading-normal">
                  <span className="text-media-slate-600">{item}</span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* 2. Central focal point connector (overlay on middle film tape) */}
      <div 
        className={`absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-slate-900/40 border-4 shadow-md flex items-center justify-center z-20 hidden md:flex cursor-default transition-all duration-300 ${
          isActive 
            ? "border-media-pink-500 scale-110 ring-4 ring-media-pink-100/50" 
            : "border-media-slate-900 ring-4 ring-media-pink-50 hover:scale-110"
        }`}
      >
        <span 
          className={`font-mono font-bold text-xs transition-colors duration-300 ${
            isActive ? "text-media-pink-600" : "text-white"
          }`}
        >
          {step.stepNumber}
        </span>
      </div>

      {/* Mobile Spacing filler */}
      <div className="w-full md:w-[42%] hidden md:block" />

    </motion.div>
  );
}

export default function ProductionTimeline({ isAr }: ProductionTimelineProps) {
  const [activeStepId, setActiveStepId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll("[data-step-card]");
      if (elements.length === 0) return;

      let closestId: string | null = null;
      let minDistance = Infinity;
      
      // Focus horizontal line at 45% of viewport height (near center of screen)
      const focalY = window.innerHeight * 0.45;

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elementCenterY = rect.top + rect.height / 2;
        const distance = Math.abs(elementCenterY - focalY);

        if (distance < minDistance) {
          minDistance = distance;
          closestId = el.getAttribute("data-step-card");
        }
      });

      if (closestId) {
        setActiveStepId(closestId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once at start to select initial closest element
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  const getStepIcon = (iconName: string) => {
    const props = { className: "w-4.5 h-4.5 text-media-pink-600" };
    switch (iconName) {
      case "ClipboardList": return <ClipboardList {...props} />;
      case "MapPin": return <MapPin {...props} />;
      case "Camera": return <Camera {...props} />;
      case "Sliders": return <Sliders {...props} />;
      case "Send": return <Send {...props} />;
      default: return <Camera {...props} />;
    }
  };

  // Human-readable, high-end actual production deliverable milestones for each step
  const getDeliverables = (stepNum: string) => {
    switch (stepNum) {
      case "01":
        return {
          ar: ["سيناريو والسيناريو البديل", "ميزانية المشروع والمخطط والمهام", "جدول زمني مفصل ومحدد"],
          en: ["Custom concept screenplay", "High fidelity budget framing", "Mapped milestone schedule"]
        };
      case "02":
        return {
          ar: ["اختيار ومعاينة مواقع التصوير", "توزيع وتخطيط الإضاءة المتكاملة", "اختيار وتجربة طاقم الكاستينج"],
          en: ["Architectural scout options", "Full multi-key light design", "Elite casting & rehearsals"]
        };
      case "03":
        return {
          ar: ["كاميرات سينمائية وتوجيه ذكي", "هندسة صوتية ورصد نقي ومحيطي", "تصوير وتغطية المشاهد بدقة 4K"],
          en: ["Modern cinematic lens sets", "Top quality clear field audio", "4K RAW visual assets master"]
        };
      case "04":
        return {
          ar: ["مونتاج ودمج سينمائي مذهل", "تصحيح ومعالجة ألوان متكاملة", "مؤثرات وهندسة صوت وموسيقى"],
          en: ["Precise storytelling cuts", "Grading studio color session", "Custom mixing & ambient synth"]
        };
      case "05":
        return {
          ar: ["تسليم سحابي متعدد الصيغ", "مراجعات تعديل مرنة وسريعة", "تصحيح ونشر وتجهيز رقمي"],
          en: ["Multi-format cloud delivery", "Infinite refinement support", "Platform optimization setup"]
        };
      default:
        return { ar: [], en: [] };
    }
  };

  return (
    <section id="journey" className="relative bg-slate-900/40 py-20 px-6 lg:px-20 overflow-hidden border-b border-media-slate-105">
      
      {/* Visual Guideline Backgrounds */}
      <div className="absolute top-0 bottom-0 left-1/2 w-48 -translate-x-1/2 bg-media-slate-50/40 pointer-events-none hidden md:block" />

      <div className="max-w-4xl mx-auto text-center mb-16 relative z-10 flex flex-col items-center">
        <h2 className="text-[clamp(1.85rem,4vw,2.65rem)] font-black text-white tracking-normal leading-[1.22] relative mb-2">
          <span className="bg-gradient-to-r from-media-slate-950 via-media-slate-800 to-media-pink-600 bg-clip-text text-transparent">
            {isAr ? "رحلة إنتاج واضحة من الفكرة للتسليم" : "A Clear Production Flow from Idea to Delivery"}
          </span>
        </h2>
        
        {/* Decorative line */}
        <div className="w-24 h-[3px] bg-gradient-to-r from-media-pink-500 to-media-amber-500 rounded-full mt-1 mb-4" />

        <p className="text-media-slate-500 mt-2 max-w-2xl mx-auto text-sm md:text-base leading-7 font-medium">
          {isAr
            ? "كل مرحلة لها مخرج محدد: فكرة، تحضير، تصوير، مونتاج، وتسليم. بهذه الطريقة تعرف ما الذي ستستلمه ومتى."
            : "Each stage has a clear output: concept, preparation, shooting, editing, and delivery. You know what you will receive and when."}
        </p>
      </div>

      {/* Timeline core tree */}
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* CENTER BLACK FILM STRIP RUNNING VERTICALLY (Desktop only) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-9 bg-media-slate-900 rounded-full flex flex-col justify-between items-center py-6 border border-media-slate-850 shadow-lg hidden md:flex select-none">
          {/* Loop of sprocket holes representing film reels */}
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="w-2 h-1.5 bg-media-slate-950 border border-media-slate-700/60 rounded-[1px]" />
          ))}
        </div>

        {/* Timeline Rows Map - Tightened spacing (space-y-6 md:space-y-8 instead of 12 / 20) */}
        <div className="space-y-6 md:space-y-8 relative">
          {JOURNEY_STEPS.map((step, index) => (
            <TimelineRow 
              key={step.id} 
              step={step} 
              index={index} 
              isAr={isAr} 
              isActive={step.id === activeStepId} 
              getStepIcon={getStepIcon} 
              getDeliverables={getDeliverables} 
            />
          ))}
        </div>

      </div>
    </section>
  );
}
