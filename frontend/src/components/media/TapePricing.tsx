import { useMemo, useRef, useState } from "react";
import { PRICING_PLANS } from "./data";
import { Unlock, Lock, ArrowUpRight, Check, Sparkles, Flame, Eye, Video, Zap } from "lucide-react";
import type { PricingPlan } from "./types";
import type { PublicPricingPackage } from "../MediaServicePage";

interface TapePricingProps {
  isAr: boolean;
  plans?: PublicPricingPackage[];
  onRequest?: (plan: PricingPlan) => void;
}

const SHOT_PLAN_METRICS: Record<string, {
  colorGrad: string;
  glow: string;
  accentText: string;
  bgLight: string;
  speedRating: string;
  classTag: string;
  customIcon: any;
}> = {
  "basic": {
    colorGrad: "from-blue-600 to-indigo-500",
    glow: "shadow-[0_20px_40px_rgba(15,23,42,0.08)] hover:shadow-[0_25px_50px_rgba(59,130,246,0.18)] hover:border-blue-500/40",
    accentText: "text-blue-400",
    bgLight: "bg-blue-950/20",
    speedRating: "95MB/s",
    classTag: "I U1",
    customIcon: Eye
  },
  "portraits": {
    colorGrad: "from-media-purple-600 to-violet-600",
    glow: "shadow-[0_20px_40px_rgba(15,23,42,0.08)] hover:shadow-[0_25px_50px_rgba(139,92,246,0.18)] hover:border-media-purple-500/40",
    accentText: "text-media-purple-400",
    bgLight: "bg-media-purple-950/20",
    speedRating: "120MB/s",
    classTag: "I U3",
    customIcon: Sparkles
  },
  "drone": {
    colorGrad: "from-emerald-600 to-teal-500",
    glow: "shadow-[0_20px_40px_rgba(15,23,42,0.08)] hover:shadow-[0_25px_50px_rgba(16,185,129,0.18)] hover:border-emerald-500/40",
    accentText: "text-emerald-400",
    bgLight: "bg-emerald-950/20",
    speedRating: "170MB/s",
    classTag: "II U3",
    customIcon: Flame
  },
  "pro": {
    colorGrad: "from-media-pink-600 to-media-rose-500",
    glow: "shadow-[0_20px_40px_rgba(15,23,42,0.1)] hover:shadow-[0_25px_50px_rgba(236,72,153,0.22)] hover:border-media-pink-500/40",
    accentText: "text-media-pink-400",
    bgLight: "bg-media-pink-950/20",
    speedRating: "V30 / 200MB/s",
    classTag: "II U3 V30",
    customIcon: Zap
  },
  "cinematic": {
    colorGrad: "from-media-amber-600 to-orange-500",
    glow: "shadow-[0_20px_40px_rgba(15,23,42,0.08)] hover:shadow-[0_25px_50px_rgba(245,158,11,0.18)] hover:border-media-amber-500/40",
    accentText: "text-media-amber-400",
    bgLight: "bg-media-amber-950/20",
    speedRating: "V90 / 300MB/s",
    classTag: "II U3 V90",
    customIcon: Video
  }
};

const accents = ["#3b82f6", "#8b5cf6", "#10b981", "#9d027c", "#ffbc01", "#f43f5e"];

function cmsPlanToPricingPlan(plan: PublicPricingPackage, index: number): PricingPlan {
  const periodLabelAr: Record<string, string> = { monthly: "شهريا", yearly: "سنويا", once: "مرة واحدة" };
  const periodLabelEn: Record<string, string> = { monthly: "Monthly", yearly: "Yearly", once: "One time" };
  const originalPrice = Number(plan.originalPrice);
  const discountedPrice = Number(plan.price || 0);
  return {
    id: `cms-${plan.id}`,
    titleAr: plan.nameAr,
    titleEn: plan.nameEn,
    price: `${Number(plan.price || 0).toLocaleString()} ${plan.currency || "EGP"}`,
    originalPrice: Number.isFinite(originalPrice) && originalPrice > discountedPrice
      ? `${originalPrice.toLocaleString()} ${plan.currency || "EGP"}`
      : undefined,
    pricePeriodAr: plan.priceNoteAr || periodLabelAr[plan.period] || plan.period,
    pricePeriodEn: plan.priceNoteEn || periodLabelEn[plan.period] || plan.period,
    descriptionAr: plan.descriptionAr || plan.nameAr,
    descriptionEn: plan.descriptionEn || plan.nameEn,
    featuresAr: [...(plan.featuresAr || []), ...(plan.detailsAr || [])],
    featuresEn: [...(plan.featuresEn || []), ...(plan.detailsEn || [])],
    isPopular: !!plan.highlighted,
    ctaText: plan.ctaText || undefined,
    accentColor: accents[index % accents.length],
  };
}

export default function TapePricing({ isAr, plans = [], onRequest }: TapePricingProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const activePlans = useMemo(() => (plans.length ? plans.map(cmsPlanToPricingPlan) : PRICING_PLANS), [plans]);
  // Track expanded state per card ID
  const [expandedPlans, setExpandedPlans] = useState<{ [key: string]: boolean }>({
    basic: false,
    portraits: false,
    drone: false,
    pro: false, 
    live: false,
    cinematic: false,
  });

  const togglePlan = (id: string) => {
    setExpandedPlans((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const scrollPlans = (direction: 1 | -1) => {
    trackRef.current?.scrollBy({
      left: direction * trackRef.current.clientWidth * 0.85,
      behavior: "smooth",
    });
  };

  return (
    <section id="pricing" className="relative bg-transparent py-24 px-4 sm:px-6 lg:px-12 xl:px-16 overflow-hidden border-b border-media-rose-100/40">
      
      {/* Visual background guide marks */}
      <div className="absolute top-0 bottom-0 left-10 right-10 border-x border-media-slate-900/[0.02] pointer-events-none" />
      <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-media-slate-900/[0.02] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center mb-16 relative z-10 flex flex-col items-center font-sans">
        <h2 className="text-[clamp(1.85rem,4vw,2.65rem)] font-black text-white tracking-normal leading-[1.22] relative mb-2">
          <span className="bg-gradient-to-r from-media-slate-950 via-media-slate-800 to-media-rose-600 bg-clip-text text-transparent">
            {isAr ? "خطط إنتاج سهلة المقارنة" : "Production Plans You Can Compare"}
          </span>
        </h2>
        
        {/* Decorative line */}
        <div className="w-24 h-[3px] bg-gradient-to-r from-media-rose-500 to-media-amber-500 rounded-full mt-1 mb-4" />

        <p className="text-media-slate-500 mt-2 max-w-2xl mx-auto text-sm md:text-base leading-7 font-medium">
          {isAr
            ? "قارن نطاق كل خطة من حيث عدد اللقطات، المونتاج، التسليم، والاستخدام التجاري قبل إرسال طلبها."
            : "Compare each plan by shots, editing, delivery, and commercial usage before sending your request."}
        </p>
      </div>

      <div className="relative z-10 mx-auto mb-5 flex max-w-7xl justify-end gap-2">
        {activePlans.length > 3 && (
          <>
            <button type="button" className="rounded-lg border border-media-slate-200 bg-white/80 px-3 py-2 text-sm font-black text-media-slate-700 shadow-sm hover:border-media-rose-400" onClick={() => scrollPlans(-1)}>
              {isAr ? "السابق" : "Prev"}
            </button>
            <button type="button" className="rounded-lg border border-media-slate-200 bg-white/80 px-3 py-2 text-sm font-black text-media-slate-700 shadow-sm hover:border-media-rose-400" onClick={() => scrollPlans(1)}>
              {isAr ? "التالي" : "Next"}
            </button>
          </>
        )}
      </div>

      {/* SD Card layout container - 3 visible on mobile, 5 visible on desktop, swipeable when more are added */}
      <div ref={trackRef} className="media-pricing-track relative z-10 mx-auto grid max-w-7xl grid-flow-col gap-3 overflow-x-auto scroll-smooth pb-4 sm:gap-4 lg:gap-6">
        {activePlans.map((plan, index) => {
          const isExpanded = !!expandedPlans[plan.id];
          const design = SHOT_PLAN_METRICS[plan.id] || Object.values(SHOT_PLAN_METRICS)[index % Object.values(SHOT_PLAN_METRICS).length] || SHOT_PLAN_METRICS["basic"];
          const CardIcon = design.customIcon;

          return (
            <div
              key={plan.id}
              onClick={() => togglePlan(plan.id)}
              className={`relative bg-[#0d1020] text-white rounded-2xl p-4 border transition-all duration-500 select-none cursor-pointer transform ${
                plan.isPopular 
                  ? "border-media-pink-500/80 ring-2 ring-media-pink-500/20" 
                  : "border-media-slate-800 hover:border-media-slate-700"
              } ${isExpanded ? "scale-[1.03]" : "hover:-translate-y-1"} ${design.glow}`}
              style={{
                clipPath: "polygon(0 0, 84% 0, 100% 12%, 100% 100%, 0 100%)"
              }}
            >
              {/* Popular recommend stripe tag inside the offset clip path */}
              {plan.isPopular && (
                <div className="absolute top-2 left-2 pb-0.5 bg-gradient-to-r from-media-pink-600 to-media-rose-500 text-white text-[7.5px] font-black px-2 py-0.5 rounded-full tracking-wider z-25 shadow-sm transform rotate-[-1deg]">
                  {isAr ? "الأكثر طلباً" : "RECOMMENDED"}
                </div>
              )}

              {/* SD CARD PHYSICAL LOOK & CONNECTOR PINS */}
              <div className="flex justify-between items-start mb-4">
                
                {/* Physical Golden Metallic Connector pins on SD Card */}
                <div className="flex gap-1 pt-1 opacity-95 select-none">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-1 h-5.5 rounded-b-[1px] transition-all duration-500 ${
                        isExpanded 
                          ? "bg-media-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.55)]" 
                          : "bg-media-amber-500/20"
                      } bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#b45309]`}
                    />
                  ))}
                </div>

                {/* SD Card mechanical LOCK notch switch on left margin */}
                <div className="flex flex-col items-center bg-[#151c31] px-1 py-0.5 rounded border border-media-slate-800 text-[5px] font-mono font-black text-media-slate-400 leading-none">
                  <span className="text-[5px] text-media-slate-500">LOCK</span>
                  <div className="relative w-2.5 h-6 bg-[#090d1a] rounded-full border border-media-slate-800 my-0.5 flex flex-col justify-between p-0.5">
                    {/* The physical click switcher */}
                    <div 
                      className={`w-1.5 h-1.5 rounded-full transition-all duration-300 absolute left-0.5 ${
                        isExpanded 
                          ? "translate-y-0.5 bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" 
                          : "translate-y-2.5 bg-media-amber-500"
                      }`} 
                    />
                  </div>
                </div>

              </div>

              {/* CARD FRONT STICKER DESIGN */}
              <div className="bg-[#070914] border border-media-slate-800/80 rounded-xl p-3 select-none flex flex-col justify-between min-h-[175px] shadow-inner relative overflow-hidden">
                
                {/* Subtle digital pattern background inside the label */}
                <div className="absolute top-0 right-0 left-0 h-10 bg-[#0c0e17] border-b border-media-slate-800/20 flex justify-between items-center px-2">
                  <span className="text-[6.5px] text-media-slate-500 font-mono tracking-widest uppercase">HD COMPACT</span>
                  <CardIcon className="w-3 h-3 text-media-slate-500 opacity-60" />
                </div>

                {/* SD Group and Pack Title - Centered */}
                <div className="text-center pt-8">
                  <span className="text-[7px] text-media-slate-500 font-mono block tracking-widest leading-none mb-1">SC PRO RES</span>
                  <h3 className="text-xs sm:text-xs font-black text-white tracking-normal leading-snug min-h-[34px] flex items-center justify-center text-center">
                    {isAr ? plan.titleAr : plan.titleEn}
                  </h3>
                </div>

                {/* Price block - Centered with high intensity design */}
                <div className="mt-2 flex flex-col items-center justify-center gap-1.5 relative w-full">
                  <div className={`bg-gradient-to-r ${design.colorGrad} rounded-lg px-3 py-1.5 text-center text-white min-w-[95px] leading-none shrink-0 shadow-lg transform group-hover:scale-[1.03] transition-transform duration-300`}>
                    <span className="block text-[7px] font-mono tracking-wider font-black opacity-80 uppercase">
                      {isAr ? "جنيه مصرى" : "EGP PRICE"}
                    </span>
                    {plan.originalPrice && <span className="mt-0.5 block text-[8px] font-bold opacity-70 line-through">{plan.originalPrice}</span>}
                    <span className="text-sm sm:text-sm font-black font-mono tracking-tight block mt-0.5">
                      {plan.price}
                    </span>
                  </div>
                  <span className="text-[7.5px] text-media-slate-500 font-bold font-mono tracking-widest">{design.classTag}</span>
                </div>

                {/* SD Spec certifications indicating speed rates */}
                <div className="mt-2.5 pt-2 border-t border-media-slate-800/80 flex justify-between items-center text-[7.5px] font-mono text-media-slate-500">
                  <span className="font-bold flex items-center gap-1">
                    {isExpanded ? (
                      <span className="text-emerald-400 flex items-center gap-0.5 font-bold">
                        <Unlock className="w-2.5 h-2.5" /> {isAr ? "مفتوح" : "OPEN"}
                      </span>
                    ) : (
                      <span className="text-media-slate-450 flex items-center gap-0.5 font-bold">
                        <Lock className="w-2.5 h-2.5" /> {isAr ? "اضغط" : "TAP CARD"}
                      </span>
                    )}
                  </span>
                  <span className="text-[6.5px] text-media-slate-500 font-bold uppercase">{design.speedRating}</span>
                </div>

              </div>

              {/* Action trigger button designed with high fidelity */}
              <div className="mt-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlan(plan.id);
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all duration-300 text-xs shadow-xs border ${
                    isExpanded
                      ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30 font-black"
                      : "bg-[#141829] hover:bg-[#1a1f33] text-media-slate-200 border-media-slate-800/80"
                  }`}
                >
                  {isExpanded ? (
                    <>
                      <Unlock className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                      <span>{isAr ? "عرض تفاصيل الخطة" : "Plan Details Opened"}</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-media-slate-450" />
                      <span>{isAr ? "افتح كارت السعر" : "Read Included Specs"}</span>
                    </>
                  )}
                </button>
              </div>

              {/* CARD DETAILS WRAPPER WITH RETRACTABLE SMOOTH COLLAPSE TRANSITION */}
              <div 
                className={`transition-all duration-500 overflow-hidden text-right ${
                  isExpanded ? "max-h-[380px] opacity-100 mt-3 py-2 border-t border-media-slate-800/60" : "max-h-0 opacity-0 pointer-events-none"
                }`}
              >
                {/* Real interactive descriptive specification features listed beautifully */}
                <div className="pt-1.5 text-right">
                  <p className="text-[10px] sm:text-[11px] text-media-slate-400 mb-3.5 leading-relaxed font-semibold">
                    {isAr ? plan.descriptionAr : plan.descriptionEn}
                  </p>
                  
                  {/* Detailed specs table */}
                  <span className="block text-[8px] font-mono font-bold text-media-slate-500 mb-2 uppercase text-right tracking-wider">
                    {isAr ? "📋 محتويات ومزايا الخطة" : "📋 PLAN DELIVERABLES"}
                  </span>
                  
                  <ul className="space-y-1.5 flex flex-col items-end mb-4">
                    {(isAr ? plan.featuresAr : plan.featuresEn).map((feat, idx) => (
                      <li key={idx} className="flex items-start justify-end gap-1.5 text-right w-full">
                        <span className="text-[10px] sm:text-[11px] text-media-slate-300 font-medium leading-normal">{feat}</span>
                        <Check className="w-3 h-3 text-emerald-400 mt-1 shrink-0" />
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#cta"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onRequest?.(plan);
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl font-black flex items-center justify-center gap-1.5 cursor-pointer transition-all text-[11px] sm:text-xs shadow-md ${
                      plan.isPopular
                        ? "bg-gradient-to-r from-media-pink-600 to-media-rose-500 text-white hover:opacity-95"
                        : "bg-media-slate-800 hover:bg-media-slate-700 text-white border border-media-slate-700"
                    }`}
                  >
                    <span>{plan.ctaText || (isAr ? "ابدأ طلب الخطة" : "Start Plan Request")}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>

                  <p className="text-center text-[7px] font-mono text-media-slate-500 mt-2">
                    SC MARKETING CO_UHS_II_CARD
                  </p>
                </div>

              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}
