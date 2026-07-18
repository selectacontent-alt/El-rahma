import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, BrainCircuit, Play, Loader2, RefreshCw, Layers, Compass, HelpCircle, CheckCircle } from 'lucide-react';
import { i18n } from '../i18n';
import { Language, AIPlanResponse } from '../types';

interface AIAdvisorProps {
  currentLang: Language;
}

export default function AIAdvisor({ currentLang }: AIAdvisorProps) {
  const t = i18n[currentLang];

  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('25000');
  const [target, setTarget] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AIPlanResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'audience' | 'timeline'>('summary');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !description) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/strategy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brand,
          description,
          budget: Number(budget),
          target,
          lang: currentLang
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned an error status');
      }

      const data = await response.json();
      setResult(data);
      setActiveTab('summary');
    } catch (err) {
      console.error(err);
      setError(t.aiAdvisor.error);
    } finally {
      setLoading(false);
    }
  };

  const budgetOptions = [
    { value: '25000', label: currentLang === 'ar' ? '١٥k - ٤٥k جم' : '15k - 45k EGP' },
    { value: '85000', label: currentLang === 'ar' ? '٤٥k - ١٥٠k جم' : '45k - 150k EGP' },
    { value: '250000', label: currentLang === 'ar' ? '١٥٠k - ٥٠٠k جم' : '150k - 500k EGP' },
  ];

  const resultTabs = [
    { id: 'summary', name: currentLang === 'ar' ? 'الملخص والتوصيات' : 'Executive Summary' },
    { id: 'audience', name: currentLang === 'ar' ? 'الجمهور والقنوات' : 'Audience & Channels' },
    { id: 'timeline', name: currentLang === 'ar' ? 'مراحل الإطلاق والمهام' : 'Launch Timeline' },
  ] as const;

  return (
    <section id="ai-advisor" className="py-24 bg-transparent border-t border-slate-900 relative overflow-hidden">
      {/* Background radial soft light */}
      <div className="absolute top-0 right-1/4 w-[450px] h-[450px] bg-[#9d027c]/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-indigo-950/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         
         {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#9d027c]/10 text-[#ffbc01] border border-[#9d027c]/20 text-xs font-sans mb-4 font-bold tracking-wide">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>{currentLang === 'ar' ? 'مستشار التخطيط والاستراتيجية الذكي AI' : 'Elite AI Strategy Advisor'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-200 mb-4 font-sans uppercase">
            {t.aiAdvisor.title}
          </h2>
          <div className="w-16 h-1 bg-[#9d027c] mx-auto mb-5 rounded-full" />
          <p className="text-xs text-slate-400 font-sans leading-relaxed">
            {t.aiAdvisor.subtitle}
          </p>
        </div>

        {/* Form and Result Grid container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Inputs Panel Container */}
          <motion.form 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onSubmit={handleGenerate}
            className="lg:col-span-5 bg-slate-950/40 border border-slate-900 p-6 rounded-2xl flex flex-col gap-5 shadow-xl relative"
          >
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#9d027c]/60 to-transparent" />
            
            {/* Input 1: Brand Name */}
            <div>
              <label className="block text-[10px] font-sans font-black text-slate-300 uppercase tracking-widest mb-2">
                {t.aiAdvisor.brandLabel} *
              </label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder={t.aiAdvisor.brandPlaceholder}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 focus:ring-1 focus:ring-[#9d027c]/40 focus:border-[#9d027c]/95 focus:outline-none transition-all duration-300 placeholder:text-slate-550"
              />
            </div>

            {/* Input 2: Budget selection */}
            <div>
              <label className="block text-[10px] font-sans font-black text-slate-300 uppercase tracking-widest mb-2">
                {t.aiAdvisor.budgetLabel}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {budgetOptions.map((opt) => {
                  const isActive = budget === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setBudget(opt.value)}
                      className={`px-1 py-2.5 rounded-xl text-[10px] font-sans font-bold transition-all border cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-br from-[#9d027c]/20 to-[#9d027c]/5 text-white border-[#9d027c] shadow-[0_0_12px_rgba(157,2,124,0.15)] scale-102'
                          : 'bg-slate-900 text-slate-550 border-slate-800 hover:bg-slate-850 hover:text-slate-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input 3: Targeted audience */}
            <div>
              <label className="block text-[10px] font-sans font-black text-slate-300 uppercase tracking-widest mb-2">
                {t.aiAdvisor.targetLabel}
              </label>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder={t.aiAdvisor.targetPlaceholder}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 focus:ring-1 focus:ring-[#9d027c]/40 focus:border-[#9d027c]/95 focus:outline-none transition-all duration-300 placeholder:text-slate-550"
              />
            </div>

            {/* Input 4: Describe value chain */}
            <div>
              <label className="block text-[10px] font-sans font-black text-slate-300 uppercase tracking-widest mb-2">
                {t.aiAdvisor.industryLabel} *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.aiAdvisor.industryPlaceholder}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 focus:ring-1 focus:ring-[#9d027c]/40 focus:border-[#9d027c]/95 focus:outline-none transition-all duration-300 resize-none leading-relaxed placeholder:text-slate-550"
              />
            </div>

            {/* Action triggering submit - Deluxe Glowing Gradient Callout */}
            <motion.button
               whileTap={{ scale: 0.98 }}
               type="submit"
               disabled={loading || !brand || !description}
               className={`w-full py-4 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-2.5 cursor-pointer border ${
                 loading || !brand || !description
                   ? 'bg-slate-900/60 border-slate-850 text-slate-600 cursor-not-allowed'
                   : 'bg-gradient-to-r from-[#9d027c] via-[#ffbc01] to-[#9d027c] bg-[length:200%_auto] hover:bg-right text-black hover:text-white shadow-xl shadow-[#9d027c]/20 hover:shadow-[#9d027c]/45 border-[#ffbc01]/35 font-black'
               }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{t.aiAdvisor.generating}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#fdf4ff] fill-white/10" />
                  <span>{t.aiAdvisor.btnGenerate}</span>
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Results Output Canvas (Right Section) */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7 bg-slate-950/40 border border-slate-900 rounded-2xl p-6 relative min-h-[480px] flex flex-col shadow-xl"
          >
            {/* Empty view state */}
            {!loading && !result && !error && (
              <div className="text-center max-w-sm mx-auto md:my-auto py-16">
                <div className="relative inline-block mb-6">
                  {/* Glowing background halo of the AI brain */}
                  <div className="absolute inset-0 bg-[#9d027c]/30 rounded-full blur-xl animate-pulse" />
                  <BrainCircuit className="w-14 h-14 text-[#ffbc01] mx-auto position relative" />
                </div>
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-2.5">
                  {currentLang === 'ar' ? 'بانتظار البيانات المدخلة' : 'AWAITING PARAMETERS'}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  {currentLang === 'ar' 
                    ? 'أدخل اسم علامتك التجارية والميزانية التسويقية المقترحة واكتب لمحة سريعة لإنتاج مصفوفة الإطلاق التجاري الشاملة' 
                    : 'Enter target metrics brand metadata and describe operations on the left sidebar to generate a customized commercial launch matrix'}
                </p>
              </div>
            )}

            {/* Loading state indicator */}
            {loading && (
              <div className="text-center py-20 m-auto flex flex-col items-center justify-center gap-5">
                <RefreshCw className="w-11 h-11 text-[#ffbc01] animate-spin" />
                <div className="flex flex-col gap-2">
                  <span className="font-sans text-[10px] text-[#ffbc01] font-black tracking-widest">
                    {currentLang === 'ar' ? 'جاري التحضير عبر نموذج GOOGLE GEMINI' : 'ACTIVE MODEL RUNTIME: GEMINI KEYWORD OPTIMIZER'}
                  </span>
                  <p className="text-xs text-slate-300 font-sans max-w-xs mx-auto animate-pulse">
                    {t.aiAdvisor.generating}
                  </p>
                </div>
              </div>
            )}

            {/* Error display */}
            {error && (
              <div className="p-4 rounded-xl border border-rose-955/60 bg-rose-955/10 text-slate-350 text-xs leading-relaxed my-auto text-center font-sans">
                {error}
              </div>
            )}

            {/* Realized AI Result layout with Tabbed navigation */}
            {result && (
              <div className="flex flex-col gap-6 text-slate-300 text-[11px] leading-relaxed select-none h-full">
                
                {/* Result header title */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-900">
                  <h3 className="font-sans font-bold text-slate-100 flex items-center gap-2.5 text-xs sm:text-sm">
                    <CheckCircle className="w-4 h-4 text-[#ffbc01] shrink-0" />
                    <span>{t.aiAdvisor.resultTitle} {brand}</span>
                  </h3>
                  <span className="font-sans text-[9px] text-[#ffbc01] font-bold bg-[#9d027c]/15 border border-[#9d027c]/40 px-2.5 py-1 rounded-full shadow-sm shrink-0">
                    {currentLang === 'ar' ? 'الخطة الاستراتيجية جاهزة' : 'Ad Plan Ready'}
                  </span>
                </div>

                {/* Animated Navigation Tabs */}
                <div className="flex border-b border-slate-900 gap-1 sm:gap-2 overflow-x-auto scroller-none pb-0.5">
                  {resultTabs.map((tab) => {
                    const isSelected = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative py-2.5 px-3.5 text-[11px] cursor-pointer font-extrabold transition-all shrink-0 uppercase tracking-wider ${
                          isSelected ? 'text-[#ffbc01]' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {tab.name}
                        {isSelected && (
                          <motion.div
                            layoutId="activeAdvisorTab"
                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#ffbc01]"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Tab content screens */}
                <div className="flex-1 mt-1">
                  <AnimatePresence mode="wait">
                    {activeTab === 'summary' && (
                      <motion.div
                        key="summary"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-5 bg-transparent"
                      >
                        {/* Summary description */}
                        <div>
                          <h4 className="font-sans text-[10px] uppercase text-[#ffbc01] font-black mb-1.5 tracking-wider">
                            {t.aiAdvisor.summary}
                          </h4>
                          <p className="font-sans text-slate-300 leading-relaxed text-xs">
                            {result.executiveSummary}
                          </p>
                        </div>

                        {/* Secret ROI & tactical tips */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-900 font-sans">
                          <div className="p-4 rounded-xl bg-gradient-to-br from-[#9d027c]/15 to-transparent border border-[#9d027c]/25 shadow-sm">
                            <span className="font-bold text-[10px] text-[#ffbc01] uppercase tracking-wider block mb-1.5">{t.aiAdvisor.estimatedRoiTitle}</span>
                            <span className="font-medium text-slate-200 text-xs leading-relaxed block">{result.estimatedRoi}</span>
                          </div>
                          <div className="p-4 rounded-xl bg-gradient-to-br from-[#9d027c]/15 to-transparent border border-[#9d027c]/25 shadow-sm">
                            <span className="font-bold text-[10px] text-[#ffbc01] uppercase tracking-wider block mb-1.5">{t.aiAdvisor.tacticalTipTitle}</span>
                            <span className="font-medium text-slate-200 text-xs leading-relaxed block">{result.tacticalTip}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'audience' && (
                      <motion.div
                        key="audience"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-5"
                      >
                        {/* Target segments */}
                        <div>
                          <h4 className="font-sans text-[10px] uppercase text-[#ffbc01] font-black mb-3 tracking-wider">
                            {t.aiAdvisor.audience}
                          </h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {result.targetAudience.map((item, idx) => (
                              <li key={idx} className="flex gap-2.5 items-center bg-slate-900/40 border border-slate-900 px-3.5 py-2.5 rounded-xl text-xs font-sans text-slate-200">
                                <span className="w-2 h-2 bg-gradient-to-br from-[#9d027c] to-[#ffbc01] rounded-full shrink-0 shadow-sm" />
                                <span className="tracking-tight">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Allocated channels with budget bar */}
                        <div>
                          <h4 className="font-sans text-[10px] uppercase text-[#ffbc01] font-black mb-3 tracking-wider">
                            {t.aiAdvisor.channels}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {result.channels.map((chan, idx) => (
                              <div key={idx} className="p-4 bg-slate-900/30 border border-slate-900 rounded-xl flex flex-col gap-2">
                                <div className="flex justify-between items-center pb-1.5 border-b border-slate-900/60">
                                  <span className="font-bold text-slate-100 text-xs">{chan.name}</span>
                                  <span className="text-[10px] text-[#ffbc01] font-bold bg-[#9d027c]/10 px-2 py-0.5 rounded border border-[#9d027c]/25">{chan.budgetAllocation}</span>
                                </div>
                                <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{chan.description}</p>
                                <span className="text-[9px] text-[#ffbc01] font-bold mt-1 uppercase tracking-wider">
                                  KPI: {chan.keyMetrics}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'timeline' && (
                      <motion.div
                        key="timeline"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-4"
                      >
                        <h4 className="font-sans text-[10px] uppercase text-[#ffbc01] font-black mb-2 tracking-wider">
                          {t.aiAdvisor.phases}
                        </h4>
                        
                        {/* Step matrix map layout */}
                        <div className="flex flex-col gap-3.5">
                          {result.phases.map((phase, idx) => (
                            <div key={idx} className="p-4 bg-slate-900 border border-slate-800/60 rounded-xl flex flex-col sm:flex-row gap-3 sm:items-center">
                              <div className="sm:w-1/3 shrink-0">
                                <span className="font-black text-xs text-[#ffbc01] uppercase tracking-wider block mb-0.5">{phase.name}</span>
                                <span className="text-[10px] text-slate-500 font-sans font-bold block">{phase.duration}</span>
                              </div>
                              <ul className="flex flex-wrap gap-2 sm:w-2/3 h-full items-center">
                                {phase.tasks.map((task, tIdx) => (
                                  <li key={tIdx} className="bg-[#9d027c]/10 border border-[#9d027c]/30 px-2.5 py-1 rounded-lg text-[10px] text-slate-300 font-sans font-semibold">
                                    {task}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer disclaimer details */}
                <div className="pt-3 border-t border-slate-900 text-[9px] font-sans text-slate-500 font-medium">
                  {t.aiAdvisor.disclaimer}
                </div>

              </div>
            )}
          </motion.div>

        </div>

      </div>
    </section>
  );
}
