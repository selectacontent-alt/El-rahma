/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Check, Sparkles, X, Target, Heart, Layers, Eye, Smartphone, TrendingUp, Compass } from 'lucide-react';
import { Language } from '../types.ts';

interface StatsCounterProps {
  currentLang?: Language;
}

export default function StatsCounter({ currentLang = 'ar' }: StatsCounterProps) {
  const isAr = currentLang === 'ar';

  const featuresAr = [
    'إنشاء حساب إعلاني خاص بك ووضع خطة تسويقية كاملة',
    'إدارة الإعلانات للوصول للجمهور المستهدف',
    'دراسة المنافسين في المنطقة المستهدفة وإنتقاء جمهور مميز',
    'إستبعاد الفئة التي تستنزف الميزانية الإعلانية دون مردود',
    'العمل بإستمرار على تحسين الحملة الإعلانية',
    'إضافة محتوى جذاب يتناسب مع ثقافة وعمر الفئة المستهدفة من قبل الإعلان'
  ];

  const featuresEn = [
    'Create your dedicated advertising account and set up a full marketing strategy',
    'Manage campaigns to effectively reach your desired target audience',
    'Analyze local competitors and narrow down high-converting audiences',
    'Exclude low-intent demographics that waste budget without results',
    'Continuously monitor and optimize campaign bidding and assets',
    'Add engaging copy and creatives matching the culture and age of your audience'
  ];

  const features = isAr ? featuresAr : featuresEn;

  return (
    <div className={`bg-gradient-to-br from-slate-900/60 to-slate-950/40 rounded-3xl border border-slate-800/80 p-8 shadow-sm relative overflow-hidden ${
      isAr ? 'text-right' : 'text-left'
    }`}>
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-magenta/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-sky-accent/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="max-w-2xl mx-auto text-center mb-8 relative z-10">
        <h3 className="text-2xl md:text-3xl font-black text-slate-100 leading-tight">
          {isAr ? "لدينا خطط متميزة لإدارة الحملة الإعلانية" : "Our Core Strengths in Campaign Management"}
        </h3>
        <div className="w-16 h-1 bg-magenta mx-auto mt-3 rounded-full" />
      </div>

      {/* Main feature checklist */}
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className={`flex items-center gap-3.5 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 shadow-sm hover:border-magenta/40 hover:shadow-md transition-all duration-300 ${
              isAr ? 'justify-end' : 'justify-start'
            }`}
          >
            <span className={`text-xs md:text-sm font-semibold text-slate-200 leading-relaxed flex-1 ${
              isAr ? 'text-right' : 'text-left'
            }`}>
              {feature}
            </span>
            <span className="bg-emerald-success/10 text-emerald-success p-1 rounded-full shrink-0 flex items-center justify-center">
              <Check className="w-4 h-4" strokeWidth={3} />
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
