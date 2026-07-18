/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plan, Language } from '../types.ts';
import { Instagram, Facebook, Music, Heart, MessageCircle, Send, Bookmark, Sparkles, TrendingUp, Award, ShieldCheck } from 'lucide-react';

interface LiveSocialPreviewCardProps {
  currentPlan: Plan;
  consoleStats: {
    reach: string;
    reachPercent: number;
    postsWeekly: string;
    reports: string;
    channels: string[];
    strategy: string;
  };
  currentLang?: Language;
}

type PlatformTab = 'instagram' | 'tiktok' | 'facebook';

export default function LiveSocialPreviewCard({ currentPlan, consoleStats, currentLang = 'ar' }: LiveSocialPreviewCardProps) {
  const [activeTab, setActiveTab] = useState<PlatformTab>('instagram');
  const [liked, setLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(1420);

  const handleLike = () => {
    if (liked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setLiked(!liked);
  };

  // Mock data for social posts depending on tab
  const getPostContent = () => {
    switch (activeTab) {
      case 'instagram':
        return {
          title: 'Instagram Feed Mirror',
          sub: 'visual_identity_shoot',
          bgGradient: 'from-purple-600 via-pink-600 to-yellow-500',
          caption: 'تصميم وبناء الهوية البصرية الفريدة لمشروعك ليست مجرد شعار، بل قصة متكاملة ترتبط بوجدان عميلك وتترجم إلى مبيعات ملموسة. 🎨✨',
          engagement: 'تفاعل ممتاز • استهداف نشط',
          commentUser: 'ahmed_reda',
          commentText: 'التصميم البصري ممتاز جداً والتناسق رهيب! فعلاً شغل محترفين. 👏🔥'
        };
      case 'tiktok':
        return {
          title: 'TikTok Reels Loop',
          sub: 'viral_short_story',
          bgGradient: 'from-neutral-900 via-slate-800 to-neutral-950',
          caption: 'كيف تضاعف مبيعاتك في أقل من ٣٠ يوم باستخدام منصة تيك توك وسيناريوهات الفيديو القصير التفاعلية؟ شاهد الفيديو الكامل! 📈🎥',
          engagement: 'وصول واسع • انتشار فيروسي',
          commentUser: 'nour_lifestyle',
          commentText: 'السيناريو مشوق والمونتاج سريع يخليك تشوف الفيديو للآخر! 😍❤️'
        };
      case 'facebook':
        return {
          title: 'Facebook Page Post',
          sub: 'sponsored_growth_campaign',
          bgGradient: 'from-blue-700 to-[#121212]',
          caption: 'أنظمة إدارة الإعلانات الممولة وإقماع المبيعات المتعددة لضبط نسبة العائد على الاستثمار الإعلاني والرسائل المباشرة بجودة حقيقية وموثوقة. 📊🚀',
          engagement: 'اهتمام فائق • تحويلات مؤكدة',
          commentUser: 'kamal_branding',
          commentText: 'ربط البكسل وتتبع الـ API ضبط عنائ في قنوات المبيعات بشكل خرافي!'
        };
    }
  };

  const post = getPostContent();

  const isAr = currentLang === 'ar';

  return (
    <div className={`bg-white border border-[#9d027c]/10 text-[#0f172a] rounded-3xl p-6 md:p-8 shadow-[0_24px_50px_-12px_rgba(157,2,124,0.06)] space-y-6 relative overflow-hidden ${
      isAr ? 'text-right' : 'text-left'
    }`}>
      
      {/* Background radial effects */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-magenta/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-yellow-power/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className={`flex justify-between items-center pb-4 border-b border-gray-100 relative z-10 ${
        isAr ? 'flex-row' : 'flex-row-reverse'
      }`}>
        <div className="text-left font-mono">
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-600 text-[10px] px-2.5 py-1 rounded-lg font-bold">
            <Sparkles className="w-3.5 h-3.5 text-magenta animate-pulse" />
            <span>PREVIEW // ACTIVE_PLAN</span>
          </div>
        </div>
        
        <div className={isAr ? 'text-right' : 'text-left'}>
          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">
            {isAr ? "معاينة بنية المنشور والمحتوى" : "Structure & Content Preview"}
          </span>
          <h3 className="font-extrabold text-base text-navy-deep mt-0.5">{currentPlan.title}</h3>
        </div>
      </div>

      {/* Tabs list for platform toggle */}
      <div className={`flex bg-gray-50 p-1 rounded-2xl border border-gray-100 relative z-10 w-fit ${
        isAr ? 'mr-auto' : 'ml-auto'
      }`}>
        <button
          onClick={() => setActiveTab('facebook')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'facebook' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Facebook className="w-3.5 h-3.5" />
          <span>Facebook</span>
        </button>

        <button
          onClick={() => setActiveTab('tiktok')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'tiktok' ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>TikTok</span>
        </button>

        <button
          onClick={() => setActiveTab('instagram')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'instagram' ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Instagram className="w-3.5 h-3.5" />
          <span>Instagram</span>
        </button>
      </div>

      {/* Simulation Feed Output Frame (Premium Mobile UI styling) */}
      <div className="bg-gray-50 rounded-2xl border border-gray-150/40 p-4 relative z-10 space-y-4 shadow-inner max-w-sm mx-auto">
        
        {/* Mock Post Profile Header */}
        <div className={`flex items-center justify-between ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-gray-500 font-bold">
              {isAr ? "نشط حالاً" : "Active Now"}
            </span>
          </div>

          <div className={`flex items-center gap-2 ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
            <div className={isAr ? 'text-right' : 'text-left'}>
              <span className={`text-xs font-bold text-navy-deep block leading-tight flex items-center gap-1 ${
                isAr ? 'justify-end' : 'justify-start'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
                social.growth.sys
              </span>
              <span className="text-[9px] text-gray-400 block leading-none">{post.sub}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-magenta flex items-center justify-center text-[10px] text-white font-black">
              SG
            </div>
          </div>
        </div>

        {/* Mock Post Image/Video Stage */}
        <div className={`relative h-48 w-full rounded-xl bg-gradient-to-tr ${
          post.bgGradient
        } overflow-hidden flex flex-col justify-between p-4 text-white font-bold ${
          isAr ? 'text-right' : 'text-left'
        }`}>
          {/* Subtle noise pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-[0.06] pointer-events-none" />
          
          <div className={`flex justify-between items-start w-full relative z-10 ${
            isAr ? 'flex-row' : 'flex-row-reverse'
          }`}>
            <span className="text-[9px] bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-widest text-[#ffbc01] font-mono">
              LIVE PREVIEW
            </span>
            <span className="text-[9px] bg-white/15 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-white font-medium">
              {isAr ? "بصمة الهوية التجارية" : "Brand Identity"}
            </span>
          </div>

          {/* Abstract visual center */}
          <div className="space-y-1 relative z-10">
            <p className="text-[10px] uppercase text-yellow-power tracking-widest font-mono">HIGH CONVERSION ART</p>
            <h4 className="text-base font-black leading-snug drop-shadow-sm">
              {isAr ? "تصميم بصري بلمسات حركية رائدة" : "Visual design with motion features"}
            </h4>
          </div>

          <div className={`flex justify-between items-center w-full relative z-10 text-[10px] text-white/90 ${
            isAr ? 'flex-row' : 'flex-row-reverse'
          }`}>
            <span className="font-mono">SOCIAL.GROWTH // SYSTEM_2026</span>
            <span className={`flex items-center gap-1 font-semibold ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
              <Award className="w-3.5 h-3.5 text-yellow-power" />
              {isAr ? "معد خصيصاً لمشروعك" : "Tailored for your project"}
            </span>
          </div>
        </div>

        {/* Action icons block */}
        <div className={`flex items-center justify-between text-gray-600 px-1 ${
          isAr ? 'flex-row' : 'flex-row-reverse'
        }`}>
          <Bookmark className="w-4 h-4 hover:text-navy-deep cursor-pointer transition-colors" />
          
          <div className={`flex items-center gap-3 ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
            <Send className="w-4 h-4 hover:text-navy-deep cursor-pointer transition-colors" />
            <MessageCircle className="w-4 h-4 hover:text-navy-deep cursor-pointer transition-colors" />
            <button onClick={handleLike} className="cursor-pointer transition-transform duration-200 active:scale-125">
              <Heart className={`w-4.5 h-4.5 ${liked ? 'text-rose-500 fill-rose-500' : 'hover:text-red-500'}`} />
            </button>
          </div>
        </div>

        {/* Caption & Metadata text */}
        <div className={`space-y-1.5 px-1 ${isAr ? 'text-right' : 'text-left'}`}>
          <span className="text-[11px] font-black text-navy-deep block font-mono">
            {likesCount.toLocaleString()} {isAr ? (liked ? 'تسجيل إعجاب' : 'تسجيلات إعجاب تفاعلية') : (liked ? 'like' : 'interactive likes')}
          </span>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            {post.caption}
          </p>
        </div>

        {/* Live client feedback preview widget */}
        <div className={`bg-white rounded-xl p-2.5 border border-gray-150/50 space-y-1 ${
          isAr ? 'text-right' : 'text-left'
        }`}>
          <div className={`flex justify-between items-center ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
            <span className="text-[9px] text-gray-400 font-mono">
              {isAr ? "منذ دقيقتين" : "2m ago"}
            </span>
            <span className={`text-[10px] font-black text-[#9d027c] flex items-center gap-0.5 ${
              isAr ? 'flex-row' : 'flex-row-reverse'
            }`}>
              @{post.commentUser}
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </span>
          </div>
          <p className="text-[11px] text-gray-600 leading-snug">
            {post.commentText}
          </p>
        </div>

      </div>

      {/* Recommended Strategy summary block */}
      <div className={`bg-gradient-to-l from-magenta/5 to-white border border-magenta/10 rounded-2xl p-4 shadow-sm space-y-2 ${
        isAr ? 'text-right' : 'text-left'
      }`}>
        <div className={`flex justify-between items-baseline ${isAr ? 'flex-row' : 'flex-row-reverse'}`}>
          <span className="text-xs font-black text-magenta font-mono">
            {consoleStats.reach} {isAr ? 'حساب' : 'accounts'}
          </span>
          <span className="text-[10px] text-[#9d027c] font-black uppercase tracking-wider block">
            {isAr ? "الاستراتيجية البصرية والوصول المستهدف:" : "Visual Strategy & Target Reach:"}
          </span>
        </div>
        <p className="text-xs text-navy-deep block font-bold leading-relaxed">
          🎯 {consoleStats.strategy}
        </p>
        <div className={`flex flex-wrap gap-1.5 pt-1.5 border-t border-gray-100/60 mt-2 ${
          isAr ? 'justify-end' : 'justify-start'
        }`}>
          {consoleStats.channels.map((ch, i) => (
            <span key={i} className="text-[9px] bg-gray-50 text-gray-500 border border-gray-100 px-2 py-0.5 rounded-md font-bold">
              {ch}
            </span>
          ))}
        </div>
      </div>

      {/* Pricing summary widget and booking button */}
      <div className={`flex items-center justify-between pt-4 border-t border-gray-100 relative z-10 ${
        isAr ? 'flex-row' : 'flex-row-reverse'
      }`}>
        <button
          onClick={() => {
            const btn = document.getElementById('hero-order-plan-btn');
            if (btn) btn.click();
          }}
          className="bg-magenta hover:bg-magenta/90 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-magenta/15 hover:scale-[1.02] active:scale-[0.98]"
        >
          {isAr ? "ابدأ طلب الخطة" : "Start Plan Request"}
        </button>
        
        <div className={isAr ? 'text-right' : 'text-left'}>
          <span className="text-[10px] text-gray-400 block font-bold">
            {isAr ? "الاستثمار المالي المقدر:" : "Estimated Monthly Investment:"}
          </span>
          <span className="text-base font-black text-navy-deep font-mono">
            {currentPlan.price.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
            <span className="text-[10px] text-gray-400 ml-1 mr-1">/ {isAr ? 'شهر' : 'mo'}</span>
          </span>
        </div>
      </div>

    </div>
  );
}
