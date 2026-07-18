/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { faqData } from '../data.ts';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { Language } from '../types.ts';

interface FAQAccordionProps {
  currentLang?: Language;
}

export default function FAQAccordion({ currentLang = 'ar' }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const isAr = currentLang === 'ar';

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className={`bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 md:p-8 shadow-sm ${
      isAr ? 'text-right' : 'text-left'
    }`}>
      <div className="max-w-xl mx-auto text-center mb-8">
        <h3 className="text-xl font-bold text-slate-100">
          {isAr ? "أسئلة وأجوبة تشغل تفكيرك دائماً" : "Frequently Asked Questions"}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {isAr 
            ? "الشفافية الكاملة هي كود الأمان لأعمالنا. إليك الإجابات الدقيقة على جميع الاستفسارات المتداولة."
            : "Complete transparency is our operating code. Here are direct answers to common questions."}
        </p>
      </div>

      <div className="space-y-3 max-w-4xl mx-auto">
        {faqData.map((faq) => {
          const isOpen = openId === faq.id;
          
          // Fallback translations if user requests English FAQs
          const displayQuestion = isAr ? faq.question : (faq.questionEn || faq.question);
          const displayAnswer = isAr ? faq.answer : (faq.answerEn || faq.answer);

          return (
            <div
              key={faq.id}
              className={`rounded-xl border transition-all overflow-hidden ${
                isOpen ? 'border-magenta/50 bg-slate-900/60 shadow-sm' : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
              }`}
              id={`faq-item-container-${faq.id}`}
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className={`w-full p-4 md:p-5 flex items-center justify-between gap-4 cursor-pointer ${
                  isAr ? 'text-right flex-row' : 'text-left flex-row-reverse'
                }`}
                id={`faq-trigger-${faq.id}`}
              >
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                    isOpen ? 'bg-magenta/20 text-magenta' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
                <div className={`flex items-center gap-3 ${
                  isAr ? 'justify-end text-right flex-row' : 'justify-start text-left flex-row-reverse'
                }`}>
                  <span className={`font-bold text-sm md:text-base leading-relaxed ${isOpen ? 'text-magenta' : 'text-slate-200'}`}>
                    {displayQuestion}
                  </span>
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isOpen ? 'bg-magenta' : 'bg-slate-800'}`} />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className={`px-5 pb-5 pt-1 text-sm text-slate-300 leading-relaxed bg-slate-950/40 ${
                      isAr ? 'pr-10 border-r-4 border-magenta text-right' : 'pl-10 border-l-4 border-magenta text-left'
                    }`}>
                      <p className={`font-medium text-xs md:text-sm whitespace-pre-line ${
                        isAr ? 'text-right' : 'text-left'
                      }`}>
                        {displayAnswer}
                      </p>
                    </div>
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
