/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowUpRight,
  Check,
  Activity,
} from 'lucide-react';

import { marketingPlans, advertisingPlans } from '../data';
import { Plan, PlanType, Language } from '../types';

// Child components
import { addPlanToCart } from '../lib/planCart';
import AdvertisingCampaignDashboard from './AdvertisingCampaignDashboard';
import PlatformOrbit from './PlatformOrbit';
import StatsCounter from './StatsCounter';
import FAQAccordion from './FAQAccordion';

interface SocialMediaServicePageProps {
  currentLang: Language;
  setActiveTab?: (tab: string) => void;
  onTypingComplete?: () => void;
}

export default function SocialMediaServicePage({ currentLang, setActiveTab, onTypingComplete }: SocialMediaServicePageProps) {
  const [planType, setPlanType] = useState<PlanType>('advertising');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('m4'); // default recommended marketing plan

  // Dynamic Typewriting states in the Hero Section
  const [typedTitle, setTypedTitle] = useState<string>('');
  const [typedSubtitle, setTypedSubtitle] = useState<string>('');
  const [typingStep, setTypingStep] = useState<number>(0);

  const isAr = currentLang === 'ar';

  const titleText = isAr
    ? "سوشيال ميديا وإعلانات تتحول إلى طلبات حقيقية"
    : "Social media and ads that turn attention into real requests";

  const subtitleText = isAr
    ? "نخطط المحتوى، نضبط الاستهداف، نجهز الكرياتيف، ونراجع الأرقام باستمرار حتى تعرف أين تذهب الميزانية وما الذي يرجع منها."
    : "We plan content, tune targeting, prepare creative, and review the numbers so you know where the budget goes and what it brings back.";

  // Type title first
  useEffect(() => {
    let titleIndex = 0;
    const titleInterval = setInterval(() => {
      if (titleIndex <= titleText.length) {
        setTypedTitle(titleText.slice(0, titleIndex));
        titleIndex++;
      } else {
        clearInterval(titleInterval);
        setTypingStep(1);
      }
    }, 20);

    return () => clearInterval(titleInterval);
  }, [titleText]);

  // Type subtitle second
  useEffect(() => {
    if (typingStep === 1) {
      let subtitleIndex = 0;
      const subInterval = setInterval(() => {
        if (subtitleIndex <= subtitleText.length) {
          setTypedSubtitle(subtitleText.slice(0, subtitleIndex));
          subtitleIndex += 3;
        } else {
          setTypedSubtitle(subtitleText);
          clearInterval(subInterval);
          setTypingStep(2);
          if (onTypingComplete) {
            onTypingComplete();
          }
        }
      }, 8);

      return () => clearInterval(subInterval);
    }
  }, [typingStep, subtitleText, onTypingComplete]);

  // Handle deep-linking after typing completes
  useEffect(() => {
    if (typingStep === 2 && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const planQuery = params.get('planType');
      if (planQuery === 'advertising') {
        setPlanType('advertising');
        setSelectedPlanId('m4');
        setTimeout(() => {
          document.getElementById('advertising-plans-row')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      } else if (planQuery === 'marketing') {
        // Legacy links now land on the campaign dashboard; package pricing is no longer shown here.
        setPlanType('advertising');
        setTimeout(() => {
          document.getElementById('advertising-plans-row')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }, [typingStep]);

  // Get active plans list based on selected toggle type
  const activePlans = marketingPlans;
  const currentPlan = activePlans.find((p) => p.id === selectedPlanId) || activePlans[0];

  // Set the default plan when toggling between Marketing and Advertising
  const handleTogglePlanType = (type: PlanType) => {
    setPlanType(type);
    if (type === 'marketing') {
      setSelectedPlanId('m4'); // Recommended Smart Growth Plan
      setTimeout(() => {
        document.getElementById('marketing-plans-row')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    } else {
      setSelectedPlanId('m4');
      setTimeout(() => {
        document.getElementById('advertising-plans-row')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }
  };

  const handleSelectPlan = (id: string) => {
    setSelectedPlanId(id);
    setPlanType(id.startsWith('m') ? 'marketing' : 'advertising');
  };

  const triggerModalWithPlan = (plan: Plan) => {
    setSelectedPlanId(plan.id);
    setPlanType(plan.id.startsWith('m') ? 'marketing' : 'advertising');
    addPlanToCart({
      section: 'social',
      id: plan.id,
      title: plan.title,
      price: plan.price,
      currency: plan.currency,
      description: plan.description,
      features: plan.features,
      details: { planType: plan.id.startsWith('m') ? 'marketing' : 'advertising', postsCountText: plan.postsCountText },
    });
  };

  // BudgetPlanner triggers a custom plan order with custom budget
  const handleTriggerCustomPlan = (budgetVal: number) => {
    addPlanToCart({
      section: 'social',
      id: 'custom',
      title: isAr ? 'خطة إعلانية مخصصة' : 'Custom advertising plan',
      price: null,
      currency: 'EGP',
      details: { monthlyBudget: budgetVal, planType: 'advertising' },
    });
  };

  const handleScrollToPlans = () => {
    const el = document.getElementById('advertising-plans-row') || document.getElementById('plans-pricing-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-transparent text-slate-100 relative selection:bg-magenta/20 overflow-x-hidden pt-24 pb-16"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* BACKGROUND DECORATIVE PATTERN */}
      <div className="absolute inset-0 bg-[radial-gradient(#9d027c_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.02] pointer-events-none" />

      {/* SECTION 1 — HERO / GROWTH CONSOLE */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-transparent min-h-[65vh] flex items-center">
        {/* Abstract lights decorative background and dots */}
        <div className="absolute right-1/4 top-10 w-96 h-96 bg-magenta/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 bottom-10 w-[450px] h-[450px] bg-yellow-power/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto flex flex-col items-center text-center space-y-8 relative z-10 w-full py-8">
          
          {/* Main Text / Branding block - ALWAYS Centered */}
          <div className="text-center max-w-3xl mx-auto space-y-6 flex flex-col items-center justify-center w-full">

            <h1 className="text-center text-[clamp(2rem,6vw,3.55rem)] font-black text-slate-100 leading-[1.18] pr-1 min-h-[92px] sm:min-h-[116px] lg:min-h-[132px] w-full transition-all duration-1000">
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#9d027c] via-magenta to-pink-500 block">
                {typedTitle || (isAr ? "تجاوز الجاذبية الرقمية..." : "Overcoming Digital Gravity...")}
              </span>
              {typingStep === 0 && (
                <span className="inline-block w-1.5 h-10 bg-magenta animate-pulse ml-1" />
              )}
            </h1>

            <p className="text-center mx-auto text-sm sm:text-base md:text-lg text-slate-300 leading-8 max-w-3xl font-medium min-h-[64px] transition-all duration-1000">
              {typedSubtitle}
              {typingStep === 1 && (
                <span className="inline-block w-1.5 h-5 bg-magenta animate-pulse ml-1" />
              )}
              {typingStep === 2 && !typedSubtitle && (
                <span className="text-gray-400">{isAr ? "تحميل التفاصيل..." : "Loading..."}</span>
              )}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-4 justify-center pr-1 pt-2 w-full">
              <AnimatePresence mode="wait">
                {typingStep === 2 ? (
                  <motion.div 
                    key="actions"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-wrap items-center gap-4 justify-center"
                  >
                    <button
                      onClick={handleScrollToPlans}
                      className="bg-magenta hover:bg-magenta/90 text-white font-extrabold px-8 py-4 rounded-xl transition-all shadow-lg shadow-magenta/25 cursor-pointer text-sm sm:text-base transform hover:scale-[1.02] active:scale-[0.98]"
                      id="hero-order-plan-btn"
                    >
                      {isAr ? "اطلب خطة حملة واضحة" : "Request a Clear Campaign Plan"}
                    </button>
                    
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

          </div>

        </div>
      </section>

      {/* SECTIONS BELOW FOLD - APPEAR ONLY AFTER TYPING COMPLETED */}
      <AnimatePresence>
        {typingStep === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* SECTION 2 — PLATFORM ORBIT COOP (GRID & TOOLTIPS) */}
            <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <PlatformOrbit currentLang={currentLang} />
            </section>

            {/* SECTION 3 — PLANS & PRICING (TOGGLE + CARDS + ANIMATIONS) */}
            <section id="plans-pricing-section" className="py-20 md:py-28 bg-transparent border-y border-slate-900 relative overflow-hidden">
              {/* Decorative backgrounds */}
              <div className="absolute right-0 top-1/4 w-96 h-96 bg-magenta/5 rounded-full filter blur-3xl pointer-events-none" />
              <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-sky-accent/5 rounded-full filter blur-3xl pointer-events-none" />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
                  <h2 className="text-[clamp(1.85rem,4vw,3rem)] font-black text-slate-100 leading-[1.22]">
                    {isAr ? "ابدأ بإعلان مبني على هدف وميزانية" : "Start with an ad brief built around goal and budget"}
                  </h2>
                  <p className="text-sm sm:text-base font-medium text-slate-400 mt-4 max-w-2xl mx-auto leading-7">
                    {isAr 
                      ? "اكتب نشاطك، هدف الحملة، الجمهور، المنصات، والميزانية الشهرية. سنحوّلها إلى بريف جاهز للمراجعة والتنفيذ."
                      : "Share your business, campaign goal, audience, platforms, and monthly media spend. We turn it into a review-ready execution brief."}
                  </p>

                </div>

                 {/* Unified 10 Plans Grid */}
                 <div className="space-y-12 pt-4">
                   
                   {/* Row 1: Marketing / Content Plans */}
                    {false && planType === 'marketing' && (
                     <div className="space-y-4" id="marketing-plans-row">
                        <div className="social-pricing-track grid grid-flow-col gap-3 overflow-x-auto scroll-smooth pb-4 sm:gap-4 items-stretch">
                         {marketingPlans.map((plan) => {
                           const isSelected = selectedPlanId === plan.id;
                           return (
                             <motion.div
                               key={plan.id}
                               whileHover={{ y: -6, scale: 1.01 }}
                               onClick={() => handleSelectPlan(plan.id)}
                               className={`rounded-2xl p-4 text-right flex flex-col justify-between transition-all relative cursor-pointer overflow-hidden bg-white border ${
                                 isSelected
                                   ? 'border-2 border-magenta shadow-lg shadow-magenta/5 ring-4 ring-magenta/10 z-10 scale-[1.01]'
                                   : 'border-gray-200/80 hover:border-magenta/30 hover:shadow-md'
                               }`}
                               id={`plan-card-item-${plan.id}`}
                             >
                               {/* Subtle top ambient gradient line on selected cards */}
                               {isSelected && (
                                 <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-l from-magenta to-sky-accent" />
                               )}

                               <div className="space-y-3">
                                 <div>
                                   {plan.badge && (
                                     <span className="inline-block bg-magenta/10 text-magenta font-black text-[9px] px-2 py-0.5 rounded-full mb-1.5">
                                       {plan.badge}
                                     </span>
                                   )}
                                   <h3 className="font-extrabold text-navy-deep text-sm tracking-tight">{plan.title}</h3>
                                   <p className="text-[10px] text-gray-500 font-bold leading-normal mt-1 min-h-[40px]">
                                     {plan.description}
                                   </p>
                                 </div>

                                 {/* Price and Post count tag */}
                                 <div className="bg-gray-50/80 rounded-xl p-2.5 flex flex-col gap-1 border border-gray-100">
                                   <div className="flex justify-between items-center w-full">
                                     <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-magenta' : 'bg-gray-300'}`} />
                                     <span className="text-[9px] font-black text-magenta">{plan.postsCountText}</span>
                                   </div>
                                   
                                   <div className="flex items-baseline justify-end gap-0.5 font-sans">
                                     <span className="text-lg font-extrabold text-navy-deep font-mono tracking-tight leading-none">
                                       {plan.price.toLocaleString()}
                                     </span>
                                     <span className="text-[10px] font-black text-navy-deep">{plan.currency}</span>
                                     <span className="text-[9px] text-gray-400 font-bold mr-1">/ {isAr ? "شهر" : "mo"}</span>
                                   </div>
                                 </div>

                                 {/* Features checklist */}
                                 <div className="pt-1">
                                   <ul className="space-y-1 text-right">
                                     {plan.features.map((feature, idx) => (
                                       <li key={idx} className="flex items-start gap-1 justify-end text-[9px] leading-relaxed font-bold text-gray-600 hover:text-navy-deep transition-colors">
                                         <span className="text-right flex-1 text-pretty">{feature}</span>
                                         <span className="bg-emerald-success/10 text-emerald-success p-0.5 rounded-full mt-0.5 shrink-0 block">
                                           <Check className="w-2.5 h-2.5" strokeWidth={4} />
                                         </span>
                                       </li>
                                     ))}
                                   </ul>
                                 </div>
                               </div>

                               {/* Button CTA */}
                               <div className="pt-3 mt-3 border-t border-gray-100">
                                 <button
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     triggerModalWithPlan(plan);
                                   }}
                                   className={`w-full py-2 px-2 rounded-lg font-black text-[10px] transition-all flex items-center justify-center gap-1 cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${
                                     isSelected
                                       ? 'bg-gradient-to-r from-magenta to-[#b5038f] text-white hover:opacity-95 shadow-sm shadow-magenta/15'
                                       : 'bg-navy-deep text-white hover:bg-navy-deep/90'
                                   }`}
                                   id={`order-btn-plan-${plan.id}`}
                                  >
                                   <ArrowUpRight className="w-3 h-3 text-yellow-power shrink-0" />
                                   {isAr ? "ابدأ طلب الخطة" : "Start Plan Request"}
                                 </button>
                               </div>
                             </motion.div>
                           );
                         })}
                        </div>
                     </div>
                   )}

                    {/* Advertising campaign dashboard — media spend only, no service/package pricing. */}
                    {planType === 'advertising' && <AdvertisingCampaignDashboard currentLang={currentLang} />}
                    {/* Legacy price cards remain as data compatibility only and are never rendered. */}
                    {planType === 'advertising' && false && (
                     <div className="space-y-4" id="advertising-plans-row">
                        <div className="social-pricing-track grid grid-flow-col gap-3 overflow-x-auto scroll-smooth pb-4 sm:gap-4 items-stretch">
                         {advertisingPlans.map((plan) => {
                           const isSelected = selectedPlanId === plan.id;
                           return (
                             <motion.div
                               key={plan.id}
                               whileHover={{ y: -6, scale: 1.01 }}
                               onClick={() => handleSelectPlan(plan.id)}
                               className={`rounded-2xl p-4 text-right flex flex-col justify-between transition-all relative cursor-pointer overflow-hidden bg-white border ${
                                 isSelected
                                   ? 'border-2 border-magenta shadow-lg shadow-magenta/5 ring-4 ring-magenta/10 z-10 scale-[1.01]'
                                   : 'border-gray-200/80 hover:border-magenta/30 hover:shadow-md'
                               }`}
                               id={`plan-card-item-${plan.id}`}
                             >
                               {/* Subtle top ambient gradient line on selected cards */}
                               {isSelected && (
                                 <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-l from-magenta to-sky-accent" />
                               )}

                               <div className="space-y-3">
                                 <div>
                                   {plan.badge && (
                                     <span className="inline-block bg-magenta/10 text-magenta font-black text-[9px] px-2 py-0.5 rounded-full mb-1.5">
                                       {plan.badge}
                                     </span>
                                   )}
                                   <h3 className="font-extrabold text-navy-deep text-sm tracking-tight">{plan.title}</h3>
                                   <p className="text-[10px] text-gray-500 font-bold leading-normal mt-1 min-h-[40px]">
                                     {plan.description}
                                   </p>
                                 </div>

                                 {/* Price and Post count tag */}
                                 <div className="bg-gray-50/80 rounded-xl p-2.5 flex flex-col gap-1 border border-gray-100">
                                   <div className="flex justify-between items-center w-full">
                                     <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-magenta' : 'bg-gray-300'}`} />
                                     <span className="text-[9px] font-black text-magenta">{plan.postsCountText}</span>
                                   </div>
                                   
                                   <div className="flex items-baseline justify-end gap-0.5 font-sans">
                                     <span className="text-lg font-extrabold text-navy-deep font-mono tracking-tight leading-none">
                                       {plan.price.toLocaleString()}
                                     </span>
                                     <span className="text-[10px] font-black text-navy-deep">{plan.currency}</span>
                                     <span className="text-[9px] text-gray-400 font-bold mr-1">/ {isAr ? "شهر" : "mo"}</span>
                                   </div>
                                 </div>

                                 {/* Features checklist */}
                                 <div className="pt-1">
                                   <ul className="space-y-1 text-right">
                                     {plan.features.map((feature, idx) => (
                                       <li key={idx} className="flex items-start gap-1 justify-end text-[9px] leading-relaxed font-bold text-gray-600 hover:text-navy-deep transition-colors">
                                         <span className="text-right flex-1 text-pretty">{feature}</span>
                                         <span className="bg-emerald-success/10 text-emerald-success p-0.5 rounded-full mt-0.5 shrink-0 block">
                                           <Check className="w-2.5 h-2.5" strokeWidth={4} />
                                         </span>
                                       </li>
                                     ))}
                                   </ul>
                                 </div>
                               </div>

                               {/* Button CTA */}
                               <div className="pt-3 mt-3 border-t border-gray-100">
                                 <button
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     triggerModalWithPlan(plan);
                                   }}
                                   className={`w-full py-2 px-2 rounded-lg font-black text-[10px] transition-all flex items-center justify-center gap-1 cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${
                                     isSelected
                                       ? 'bg-gradient-to-r from-magenta to-[#b5038f] text-white hover:opacity-95 shadow-sm shadow-magenta/15'
                                       : 'bg-navy-deep text-white hover:bg-navy-deep/90'
                                   }`}
                                   id={`order-btn-plan-${plan.id}`}
                                  >
                                   <ArrowUpRight className="w-3 h-3 text-yellow-power shrink-0" />
                                   {isAr ? "ابدأ طلب الخطة" : "Start Plan Request"}
                                 </button>
                               </div>
                             </motion.div>
                           );
                         })}
                        </div>
                     </div>
                   )}

                 </div>

              </div>
            </section>

            {/* DYNAMIC SIMULATOR, PREVIEW PANEL & CONTENT DNA SECTIONS REMOVED */}

            {/* SECTION 6 — RESULTS & CASES COUNTERSWALL */}
            <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-16">
              <StatsCounter currentLang={currentLang} />
            </section>

            {/* SECTION 7 — FAQ ACCORDION PANEL */}
            <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
              <FAQAccordion currentLang={currentLang} />
            </section>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
