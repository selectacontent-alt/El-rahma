/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, Users, MessageCircle, RotateCcw, AlertCircle, TrendingUp, Compass, Sparkles } from 'lucide-react';
import { Language } from '../types.ts';

interface StrategyTip {
  title: string;
  desc: string;
}

export default function BudgetPlanner({ onTriggerCustomPlan, currentLang = 'ar' }: { onTriggerCustomPlan: (budget: number) => void; currentLang?: Language }) {
  const [budget, setBudget] = useState<number>(30000);
  const isAr = currentLang === 'ar';

  // Split configurations
  const recruitRatio = 0.20; // 20%
  const convertRatio = 0.55; // 55%
  const retargetRatio = 0.25; // 25%

  const recruitVal = budget * recruitRatio;
  const convertVal = budget * convertRatio;
  const retargetVal = budget * retargetRatio;

  // Strategy suggestions depending on the selected budget level
  const getStrategyAdvice = (): StrategyTip => {
    if (budget < 20000) {
      return {
        title: isAr 
          ? 'استراتيجية التركيز المحلي وضمان التدفق النقدي الأساسي' 
          : 'Local Focus & Essential Cash Flow Strategy',
        desc: isAr
          ? 'ميزانية اقتصادية مثالية لاستهداف نطاق جغرافي ضيق مخصص وعملاء محليين مباشرين. يوصى بالتركيز على إعلانات الرسائل المباشرة وكتالوج المنتجات بفيسبوك وواتساب.'
          : 'An ideal entry-level budget to target narrow local markets. We recommend focusing on direct message ads, WhatsApp campaigns, and catalogue promotions.'
      };
    } else if (budget < 60000) {
      return {
        title: isAr 
          ? 'استراتيجية التوسع المكثف وقمع الشراء الذكي'
          : 'Active Scaling & Smart Funnels Strategy',
        desc: isAr
          ? 'نوصي بـ تشغيل متوازي للمحتوى المرئي (فيديو تيك توك ورييلز) مع حملات تجميع الرسائل المخصصة. يتأصل براندك هنا بقوة مع إبقاء تكلفة اقتناء المشتري منخفضة.'
          : 'We suggest running parallel video tracks (Reels/TikTok) alongside structured conversion funnels. This establishes brand authority while keeping customer acquisition cost low.'
      };
    } else {
      return {
        title: isAr
          ? 'استراتيجية السيطرة وقيادة السوق الإقليمية المتكاملة'
          : 'Total Domination & Regional Scaling Strategy',
        desc: isAr
          ? 'ميزانية قوية تطلق ذكاء خوارزميات ميتا وسناب شات. مخصصة لإطلاق أقماع مبيعات تتبع مخصصة متعددة الخطوات، حملات المشاهير وتوليد عملاء بجودة فائقة لـ B2B أو العقارات.'
          : 'A powerful tier to leverage Meta and Snapchat algorithms. Configured for multi-stage tracking funnels, influencer campaigns, and high-quality B2B or real-estate lead gen.'
      };
    }
  };

  const advice = getStrategyAdvice();

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm ${
      isAr ? 'text-right' : 'text-left'
    }`}>
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-gray-50 pb-5 ${
        isAr ? 'flex-row' : 'flex-row-reverse'
      }`}>
        <div className="space-y-1">
          <span className="text-xs bg-magenta/10 text-magenta font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1">
            <Wallet className="w-3.5 h-3.5" />
            {isAr ? "توزيع الميزانيات التفاعلي" : "Interactive Budget Allocation"}
          </span>
          <h3 className="text-xl font-bold text-navy-deep">
            {isAr ? "مخطط تقسيم الميزانية التسويقية المقترح" : "Suggested Marketing Budget Blueprint"}
          </h3>
        </div>
        <div className={`bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl font-mono ${
          isAr ? 'text-left' : 'text-right'
        }`}>
          <span className="text-2xl font-black text-magenta">{budget.toLocaleString()}</span>
          <span className="text-xs text-navy-deep font-bold mx-1">
            {isAr ? "ج.م / شهرياً" : "EGP / mo"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Slider input */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-navy-deep">
              {isAr ? "حدد الميزانية الشهرية المقدرة لحملاتك الممولة:" : "Determine estimated monthly budget for sponsored ads:"}
            </label>
            <p className="text-xs text-gray-500 leading-relaxed">
              {isAr 
                ? "حرك الشريط لمشاهدة توزيع أموال الإعلانات الممولة على الحملات المختلفة بما يحقق الأمان المالي وضمان أقصى مبيعات."
                : "Drag the slider to see how ad spend is optimally distributed to secure stable returns and maximize sales."}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <input
              type="range"
              min="10000"
              max="150000"
              step="5000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-magenta"
              id="main-planner-slider"
            />
            <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
              <span className="bg-gray-50 px-2 py-0.5 rounded-md">
                {isAr ? "150,000 ج.م" : "150,000 EGP"}
              </span>
              <span className="bg-gray-50 px-2 py-0.5 rounded-md">
                {isAr ? "75,000 ج.م" : "75,000 EGP"}
              </span>
              <span className="bg-gray-50 px-2 py-0.5 rounded-md">
                {isAr ? "10,000 ج.م" : "10,000 EGP"}
              </span>
            </div>
          </div>

          <div className="bg-magenta/5 border border-magenta/10 rounded-xl p-4 space-y-2">
            <div className={`flex items-center gap-1.5 text-navy-deep font-bold text-xs ${
              isAr ? 'flex-row' : 'flex-row-reverse'
            }`}>
              <Compass className="w-4 h-4 text-magenta" />
              <span>{isAr ? "توجيه الخبراء الفوري لتلك الميزانية:" : "Instant expert guidance for this budget:"}</span>
            </div>
            <h4 className="font-bold text-xs text-magenta">{advice.title}</h4>
            <p className="text-[11px] text-gray-600 leading-relaxed font-semibold">
              {advice.desc}
            </p>
          </div>
        </div>

        {/* Dynamic Split Progress bars and maps */}
        <div className="lg:col-span-7 space-y-4">
          <h4 className={`text-xs font-bold text-navy-deep mb-2 uppercase tracking-wide ${
            isAr ? 'text-right' : 'text-left'
          }`}>
            {isAr ? "خارطة توزيع الإعلانات الممولة:" : "Sponsored Ads Allocation Map:"}
          </h4>

          {/* Recruit - 20% */}
          <div className="bg-gray-50/70 rounded-xl p-4 border border-transparent hover:border-gray-100 transition-colors">
            <div className={`flex justify-between items-center mb-1.5 ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={isAr ? 'text-left' : 'text-right'}>
                <span className="text-sm font-bold font-mono text-magenta">
                  {recruitVal.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                </span>
                <span className="text-[10px] text-gray-400 font-mono font-medium mx-1">(20%)</span>
              </div>
              <div className={`flex items-center gap-2 ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
                <span className="text-xs font-bold text-navy-deep">
                  {isAr ? "جذب جمهور جديد واكتشاف مهتمين" : "New Audience Acquisition & Discovery"}
                </span>
                <div className="w-7 h-7 rounded-sm bg-magenta/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-magenta" />
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200/60 rounded-full h-2">
              <motion.div
                initial={{ width: '20%' }}
                animate={{ width: '20%' }}
                className="bg-magenta h-2 rounded-full"
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-1 leading-normal">
              {isAr 
                ? "إعلانات ترويجية أولية تبني وعياً بعلامتك التجارية لأول مرة لتوسيع دائرة معرفة العملاء الجدد بالنشاط."
                : "Top-of-funnel campaigns designed to build initial awareness and attract fresh leads to your ecosystem."}
            </p>
          </div>

          {/* Convert - 55% */}
          <div className="bg-gray-50/70 rounded-xl p-4 border border-transparent hover:border-gray-100 transition-colors">
            <div className={`flex justify-between items-center mb-1.5 ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={isAr ? 'text-left' : 'text-right'}>
                <span className="text-sm font-bold font-mono text-[#0ea5e9]">
                  {convertVal.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                </span>
                <span className="text-[10px] text-gray-400 font-mono font-medium mx-1">(55%)</span>
              </div>
              <div className={`flex items-center gap-2 ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
                <span className="text-xs font-bold text-navy-deep">
                  {isAr ? "تحويل مباشر (شراء، رسائل، اتصالات)" : "Direct Conversion (Sales, Messages, Leads)"}
                </span>
                <div className="w-7 h-7 rounded-sm bg-sky-accent/10 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-sky-accent" />
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200/60 rounded-full h-2">
              <motion.div
                initial={{ width: '55%' }}
                animate={{ width: '55%' }}
                className="bg-[#0ea5e9] h-2 rounded-full"
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-1 leading-normal">
              {isAr
                ? "الأساس الصلب للمبيعات من خلال إقناع الزبون وحثه المباشر على الحجز وطلب المنتج والتخاطب المباشر مع فريقك."
                : "The core revenue driver, optimized to nudge customers to purchase, submit leads, or message your sales team."}
            </p>
          </div>

          {/* Retarget - 25% */}
          <div className="bg-gray-50/70 rounded-xl p-4 border border-transparent hover:border-gray-100 transition-colors">
            <div className={`flex justify-between items-center mb-1.5 ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={isAr ? 'text-left' : 'text-right'}>
                <span className="text-sm font-bold font-mono text-[#10b981]">
                  {retargetVal.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                </span>
                <span className="text-[10px] text-gray-400 font-mono font-medium mx-1">(25%)</span>
              </div>
              <div className={`flex items-center gap-2 ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
                <span className="text-xs font-bold text-navy-deep">
                  {isAr ? "إعادة استهداف المهتمين مجدداً" : "Retargeting & Audience Re-engagement"}
                </span>
                <div className="w-7 h-7 rounded-sm bg-emerald-success/10 flex items-center justify-center">
                  <RotateCcw className="w-4 h-4 text-emerald-success" />
                </div>
              </div>
            </div>
            <div className="w-full bg-gray-200/60 rounded-full h-2">
              <motion.div
                initial={{ width: '25%' }}
                animate={{ width: '25%' }}
                className="bg-[#10b981] h-2 rounded-full"
              />
            </div>
            <p className="text-[10px] text-gray-500 mt-1 leading-normal">
              {isAr
                ? "إعادة تذكير لكل من زار موقعك أو تفاعل مع منشوراتك بخصومات وعروض ممتازة للتغلب على التردد وإشعال الرغبة."
                : "Nurture past visitors or engaged users with tailored offers, converting hesitation into completed purchases."}
            </p>
          </div>

          <div className={`pt-2 flex ${isAr ? 'justify-end' : 'justify-start'}`}>
            <button
              onClick={() => onTriggerCustomPlan(budget)}
              className="bg-navy-deep hover:bg-navy-deep/90 text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer hover:scale-[1.01]"
              id="planner-order-budget-btn"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-power" />
              {isAr ? "اعتمد هذه الميزانية وجهز خطتي مخصصة" : "Adopt This Budget & Plan My Campaign"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
