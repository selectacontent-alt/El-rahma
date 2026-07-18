"use client";

import { useState, useMemo, useEffect, memo } from 'react';
import { Check, HelpCircle, TrendingUp, Info, Users, Award, Target } from 'lucide-react';
import { i18n } from '../i18n';
import { Language } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ROICalculatorProps {
  currentLang: Language;
}

interface AreaForecastChartProps {
  data: any[];
  currentLang: Language;
}

const AreaForecastChart = memo(({ data, currentLang }: AreaForecastChartProps) => {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9d027c" stopOpacity={0.25}/>
              <stop offset="95%" stopColor="#9d027c" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
          <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
          <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#9d027c', borderRadius: '12px', fontSize: '11px', color: '#1e293b', border: '1px solid rgba(157,2,124,0.4)' }} />
          <Area type="monotone" dataKey={currentLang === 'ar' ? 'العائد المتوقع' : 'Return Projections'} stroke="#9d027c" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
          <Area type="monotone" dataKey={currentLang === 'ar' ? 'الميزانية المتراكمة' : 'Gross Ad Spend'} stroke="#3b82f6" strokeWidth={1.5} fillOpacity={1} fill="url(#colorBudget)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

AreaForecastChart.displayName = 'AreaForecastChart';

export default function ROICalculator({ currentLang }: ROICalculatorProps) {
  const t = i18n[currentLang];

  const [sliderBudget, setSliderBudget] = useState(25000);
  const [debouncedBudget, setDebouncedBudget] = useState(25000);
  const [industry, setIndustry] = useState<'ecommerce' | 'services' | 'realestate' | 'medical' | 'tech'>('ecommerce');
  const [channels, setChannels] = useState<string[]>(['meta', 'google']);

  // Debounce the budget state so dragging the range slider is completely lag-free
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedBudget(sliderBudget);
    }, 100);
    return () => clearTimeout(handler);
  }, [sliderBudget]);

  const channelOptions = [
    { id: 'meta', label: 'Meta (FB/IG)', icon: '/logos/meta.png' },
    { id: 'google', label: 'Google Ads', isSvg: true },
    { id: 'tiktok', label: 'TikTok Ads', icon: '/logos/tiktok.png' },
    { id: 'snapchat', label: 'Snapchat', icon: '/logos/snapchat.png' },
  ];

  const toggleChannel = (id: string) => {
    if (channels.includes(id)) {
      if (channels.length > 1) {
        setChannels(channels.filter(c => c !== id));
      }
    } else {
      setChannels([...channels, id]);
    }
  };

  // Perform calculations based on inputs (uses debounced budget for extreme smoothness)
  const metrics = useMemo(() => {
    let baseCPC = 6;
    let baseCTR = 0.022;
    let conversionRate = 0.025;
    let customerValue = 3000;

    switch (industry) {
      case 'ecommerce':
        baseCPC = 5;
        baseCTR = 0.028;
        conversionRate = 0.03;
        customerValue = 1200;
        break;
      case 'services':
        baseCPC = 15;
        baseCTR = 0.032;
        conversionRate = 0.045;
        customerValue = 15000;
        break;
      case 'realestate':
        baseCPC = 30;
        baseCTR = 0.012;
        conversionRate = 0.008;
        customerValue = 85000;
        break;
      case 'medical':
        baseCPC = 12;
        baseCTR = 0.026;
        conversionRate = 0.038;
        customerValue = 8000;
        break;
      case 'tech':
        baseCPC = 20;
        baseCTR = 0.018;
        conversionRate = 0.022;
        customerValue = 5000;
        break;
    }

    let cpcSum = 0;
    channels.forEach(ch => {
      if (ch === 'meta') cpcSum += baseCPC * 0.9;
      if (ch === 'google') cpcSum += baseCPC * 1.2;
      if (ch === 'tiktok') cpcSum += baseCPC * 0.8;
      if (ch === 'snapchat') cpcSum += baseCPC * 0.75;
    });
    const avgCPC = cpcSum / channels.length || baseCPC;

    const clicks = Math.floor(debouncedBudget / avgCPC);
    const impressions = Math.floor(clicks / baseCTR);
    const leads = Math.floor(clicks * 0.85);
    const conversions = Math.floor(clicks * conversionRate);
    const revenue = conversions * customerValue;
    const netProfit = revenue - debouncedBudget;
    const roas = debouncedBudget > 0 ? (revenue / debouncedBudget).toFixed(1) : '0';
    const roiPercent = debouncedBudget > 0 ? Math.floor((netProfit / debouncedBudget) * 100) : 0;
    const cpl = leads > 0 ? Math.round(debouncedBudget / leads) : 0;
    const cac = conversions > 0 ? Math.round(debouncedBudget / conversions) : 0;

    // Platform breakdown calculations
    const share = 1 / channels.length;
    const channelBreakdown = channels.map(ch => {
      const chBudget = debouncedBudget * share;
      let chCPC = baseCPC;
      let chCTR = baseCTR;
      let chLabel = '';
      let chLogo = '';
      if (ch === 'meta') { chCPC = baseCPC * 0.9; chCTR = baseCTR * 1.1; chLabel = 'Meta'; chLogo = '/logos/meta.png'; }
      if (ch === 'google') { chCPC = baseCPC * 1.2; chCTR = baseCTR * 0.9; chLabel = 'Google'; chLogo = ''; }
      if (ch === 'tiktok') { chCPC = baseCPC * 0.8; chCTR = baseCTR * 1.2; chLabel = 'TikTok'; chLogo = '/logos/tiktok.png'; }
      if (ch === 'snapchat') { chCPC = baseCPC * 0.75; chCTR = baseCTR * 1.0; chLabel = 'Snapchat'; chLogo = '/logos/snapchat.png'; }

      const chClicks = Math.floor(chBudget / chCPC);
      const chConversions = Math.floor(chClicks * conversionRate);
      const chRevenue = chConversions * customerValue;
      const chNetProfit = chRevenue - chBudget;

      return {
        label: chLabel,
        logo: chLogo,
        isSvg: ch === 'google',
        budget: chBudget,
        clicks: chClicks,
        conversions: chConversions,
        revenue: chRevenue,
        netProfit: chNetProfit
      };
    });

    return {
      impressions,
      clicks,
      avgCPC,
      avgCTR: baseCTR * 100,
      leads,
      conversions,
      revenue,
      netProfit,
      roas,
      roiPercent,
      cpl,
      cac,
      channelBreakdown
    };
  }, [debouncedBudget, industry, channels]);

  // Compute 6 months projection data
  const chartData = useMemo(() => {
    let baseCPC = 6;
    let conversionRate = 0.025;
    let customerValue = 3000;

    switch (industry) {
      case 'ecommerce':
        baseCPC = 5;
        conversionRate = 0.03;
        customerValue = 1200;
        break;
      case 'services':
        baseCPC = 15;
        conversionRate = 0.045;
        customerValue = 15000;
        break;
      case 'realestate':
        baseCPC = 30;
        conversionRate = 0.008;
        customerValue = 85000;
        break;
      case 'medical':
        baseCPC = 12;
        conversionRate = 0.038;
        customerValue = 8000;
        break;
      case 'tech':
        baseCPC = 20;
        conversionRate = 0.022;
        customerValue = 5000;
        break;
    }

    let cpcSum = 0;
    channels.forEach(ch => {
      if (ch === 'meta') cpcSum += baseCPC * 0.9;
      if (ch === 'google') cpcSum += baseCPC * 1.2;
      if (ch === 'tiktok') cpcSum += baseCPC * 0.8;
      if (ch === 'snapchat') cpcSum += baseCPC * 0.75;
    });
    const avgCPC = cpcSum / channels.length || baseCPC;

    const clicks = Math.floor(debouncedBudget / avgCPC);
    const conversions = Math.floor(clicks * conversionRate);
    const revenue = conversions * customerValue;

    return Array.from({ length: 6 }, (_, i) => {
      const month = i + 1;
      const accumBudget = debouncedBudget * month;
      const optimizationFactor = 1 + (month - 1) * 0.12;
      const accumRevenue = Math.floor(revenue * month * optimizationFactor);
      return {
        name: currentLang === 'ar' ? `شهر ${month}` : `M${month}`,
        [currentLang === 'ar' ? 'الميزانية المتراكمة' : 'Gross Ad Spend']: accumBudget,
        [currentLang === 'ar' ? 'العائد المتوقع' : 'Return Projections']: accumRevenue,
      };
    });
  }, [debouncedBudget, industry, channels, currentLang]);

  return (
    <section id="calculator" className="py-24 bg-transparent border-t border-slate-800 relative overflow-hidden text-slate-350">
      {/* Light accent glow spheres */}
      <div className="absolute top-1/3 left-10 w-[400px] h-[400px] bg-[#9d027c]/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#9d027c]/10 border border-[#9d027c]/20 text-xs text-[#9d027c] font-sans tracking-wide mb-4 font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            {currentLang === 'ar' ? 'التحليلات والمحاكاة التفاعلية النخبوية' : 'ELITE INTERACTIVE METRICS SIMULATION'}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-200 tracking-tight mb-4 font-sans">
            {t.calculator.title}
          </h2>
          <p className="text-slate-650 text-sm sm:text-base max-w-2xl mx-auto font-sans leading-relaxed">
            {t.calculator.subtitle}
          </p>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 4-cols: Controls panel */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-xl shadow-slate-200/30 relative">
            
            {/* 1. Monthly Budget */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-[11px] sm:text-xs font-bold text-slate-650 font-sans tracking-wide uppercase flex items-center gap-1.5">
                  {t.calculator.monthlyBudget}
                </label>
                <span className="font-mono text-xs font-black text-[#9d027c] bg-[#9d027c]/5 px-2 py-0.5 rounded-lg border border-[#9d027c]/15">
                  {sliderBudget.toLocaleString()} {currentLang === 'ar' ? 'ج.م' : 'EGP'}
                </span>
              </div>
              <div className="relative mt-2">
                <input
                  type="range"
                  min="5000"
                  max="500000"
                  step="5000"
                  value={sliderBudget}
                  onChange={(e) => setSliderBudget(Number(e.target.value))}
                  className="w-full h-2 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-[#9d027c]"
                />
                <div className="flex justify-between text-[9px] text-slate-550 font-mono mt-1.5 px-1">
                  <span>5,000</span>
                  <span>100,000</span>
                  <span>250,000</span>
                  <span>500,000</span>
                </div>
              </div>
            </div>

            {/* 2. Industry selector */}
            <div className="space-y-2">
              <label className="text-[11px] sm:text-xs font-bold text-slate-650 font-sans tracking-wide uppercase block">
                {t.calculator.industry}
              </label>
              <div className="space-y-2.5">
                {(Object.keys(t.calculator.industries) as Array<keyof typeof t.calculator.industries>).map((key) => {
                  const isActive = industry === key;
                  let statsText = '';
                  if (key === 'ecommerce') statsText = currentLang === 'ar' ? 'نقرة: ~5 جم | تحويل: ~3%' : 'CPC: ~5 EGP | Conv: ~3%';
                  if (key === 'services') statsText = currentLang === 'ar' ? 'نقرة: ~15 جم | تحويل: ~4.5%' : 'CPC: ~15 EGP | Conv: ~4.5%';
                  if (key === 'realestate') statsText = currentLang === 'ar' ? 'نقرة: ~30 جم | تحويل: ~0.8%' : 'CPC: ~30 EGP | Conv: ~0.8%';
                  if (key === 'medical') statsText = currentLang === 'ar' ? 'نقرة: ~12 جم | تحويل: ~3.8%' : 'CPC: ~12 EGP | Conv: ~3.8%';
                  if (key === 'tech') statsText = currentLang === 'ar' ? 'نقرة: ~20 جم | تحويل: ~2.2%' : 'CPC: ~20 EGP | Conv: ~2.2%';

                  return (
                    <button
                      key={key}
                      onClick={() => setIndustry(key)}
                      className={`w-full text-right p-3 rounded-xl transition-all border text-xs cursor-pointer flex justify-between items-center ${
                        isActive
                          ? 'bg-[#9d027c]/5 text-[#9d027c] border-[#9d027c] font-bold'
                          : 'bg-slate-900 text-slate-650 border-slate-800 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex flex-col text-right">
                        <span className="font-sans text-xs">{t.calculator.industries[key]}</span>
                        <span className="font-mono text-[9px] text-slate-550 mt-0.5">{statsText}</span>
                      </div>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${isActive ? 'border-[#9d027c] bg-[#9d027c]' : 'border-slate-700'}`}>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Channels selector */}
            <div className="space-y-2">
              <label className="text-[11px] sm:text-xs font-bold text-slate-650 font-sans tracking-wide uppercase block">
                {t.calculator.channels}
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {channelOptions.map((opt) => {
                  const isChecked = channels.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleChannel(opt.id)}
                      className={`p-2.5 rounded-xl text-[10px] sm:text-xs transition-all flex items-center justify-between border cursor-pointer ${
                        isChecked
                          ? 'bg-[#9d027c]/5 text-[#9d027c] border-[#9d027c] font-bold'
                          : 'bg-slate-900 text-slate-500 border-slate-800 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {opt.isSvg ? (
                          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                          </svg>
                        ) : (
                          <img src={opt.icon} alt={opt.label} className="w-3.5 h-3.5 shrink-0 object-contain" />
                        )}
                        <span className="font-sans text-[10px]">{opt.label}</span>
                      </div>
                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all shrink-0 ${isChecked ? 'bg-[#9d027c] border-transparent text-white' : 'border-slate-700'}`}>
                        {isChecked && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* 8-cols: Outputs and detailed stats */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Giant Revenue Banner with Glassmorphism */}
            <div className="bg-gradient-to-br from-[#9d027c]/10 via-slate-900 to-slate-900 border border-[#9d027c]/20 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="space-y-1">
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest block font-sans">
                  {currentLang === 'ar' ? 'العائد المالي الإجمالي المتوقع شهرياً' : 'EXPECTED GROSS MONTHLY REVENUE'}
                </span>
                <span className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight block font-sans">
                  {metrics.revenue.toLocaleString()} <span className="text-sm font-semibold">{currentLang === 'ar' ? 'ج.م' : 'EGP'}</span>
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-slate-550 font-sans">{currentLang === 'ar' ? 'صافي الربح المتوقع:' : 'Net Profit Forecast:'}</span>
                  <span className="text-sm font-bold text-[#9d027c] font-mono">
                    {metrics.netProfit > 0 ? '+' : ''}{metrics.netProfit.toLocaleString()} {currentLang === 'ar' ? 'ج.م' : 'EGP'}
                  </span>
                </div>
              </div>

              <div className="shrink-0 flex items-center">
                <div className="px-5 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-center shadow-md">
                  <span className="text-[9px] font-bold text-purple-650 block tracking-wider uppercase font-sans mb-0.5">
                    {currentLang === 'ar' ? 'صافي العائد على الاستثمار' : 'NET RETURN ON INVEST'}
                  </span>
                  <span className="text-2xl font-black text-[#9d027c] font-mono block">
                    +{metrics.roiPercent}%
                  </span>
                  <span className="text-[10px] text-slate-550 font-sans block mt-0.5">
                    {metrics.roas}x ROAS
                  </span>
                </div>
              </div>
            </div>

            {/* Funnel Progress Cards - Rich Visual Dropoffs */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-sm">
              <span className="text-xs font-bold text-slate-655 text-slate-650 uppercase tracking-widest block font-sans">
                {currentLang === 'ar' ? 'التسلسل التحويلي ومراحل قمع المبيعات التفصيلي' : 'CONVERSION FUNNEL FLOW STAGE TELEMETRY'}
              </span>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* Stage 1: Impressions */}
                <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] text-slate-550 font-bold tracking-wider font-sans">{currentLang === 'ar' ? '1. الظهور الإعلاني' : '1. IMPRESSIONS'}</span>
                    <Target className="w-3.5 h-3.5 text-slate-550" />
                  </div>
                  <span className="text-lg sm:text-xl font-bold font-mono text-slate-100 block">
                    {metrics.impressions.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-slate-550 block mt-1 font-sans">
                    {currentLang === 'ar' ? 'مشاهدة مستهدفة للجمهور' : 'Targeted users reached'}
                  </span>
                </div>

                {/* Stage 2: Clicks */}
                <div className="bg-slate-955 border border-slate-850 p-4 rounded-2xl transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] text-blue-600 font-bold tracking-wider font-sans">{currentLang === 'ar' ? '2. الزيارات / النقرات' : '2. CLICKS'}</span>
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <span className="text-lg sm:text-xl font-bold font-mono text-slate-100 block">
                    {metrics.clicks.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-blue-600 block mt-1 font-sans flex justify-between">
                    <span>CTR: {metrics.avgCTR.toFixed(1)}%</span>
                    <span>CPC: {metrics.avgCPC.toFixed(1)} {currentLang === 'ar' ? 'ج.م' : 'EGP'}</span>
                  </span>
                </div>

                {/* Stage 3: Leads */}
                <div className="bg-slate-955 border border-slate-850 p-4 rounded-2xl transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] text-[#9d027c] font-bold tracking-wider font-sans">{currentLang === 'ar' ? '3. العملاء المهتمين' : '3. LEADS'}</span>
                    <HelpCircle className="w-3.5 h-3.5 text-[#9d027c]" />
                  </div>
                  <span className="text-lg sm:text-xl font-bold font-mono text-slate-100 block">
                    {metrics.leads.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-[#9d027c] block mt-1 font-sans flex justify-between">
                    <span>CPL: {metrics.cpl} {currentLang === 'ar' ? 'ج.م' : 'EGP'}</span>
                    <span>{currentLang === 'ar' ? 'معدل اهتمام: 85%' : 'Intent: 85%'}</span>
                  </span>
                </div>

                {/* Stage 4: Conversions */}
                <div className="bg-slate-955 border border-slate-850 p-4 rounded-2xl transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] text-amber-600 font-bold tracking-wider font-sans">{currentLang === 'ar' ? '4. مبيعات مؤكدة' : '4. SALES'}</span>
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <span className="text-lg sm:text-xl font-bold font-mono text-slate-100 block">
                    {metrics.conversions.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-amber-600 block mt-1 font-sans flex justify-between">
                    <span>CAC: {metrics.cac} {currentLang === 'ar' ? 'ج.م' : 'EGP'}</span>
                    <span>{currentLang === 'ar' ? 'معدل تحويل: ' : 'CR: '}{(metrics.conversions / metrics.clicks * 100).toFixed(1)}%</span>
                  </span>
                </div>

              </div>

              {/* Visual Funnel Scale Bar representation */}
              <div className="space-y-1.5 pt-2">
                <div className="w-full bg-slate-850 h-3 rounded-full overflow-hidden flex">
                  <div className="h-full bg-slate-700 transition-all duration-300" style={{ width: '100%' }} />
                  <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${Math.max(5, Math.min(100, (metrics.clicks / metrics.impressions) * 1000))}%` }} />
                  <div className="h-full bg-purple-500 transition-all duration-300" style={{ width: `${Math.max(3, Math.min(100, (metrics.leads / metrics.impressions) * 1000))}%` }} />
                  <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${Math.max(1.5, Math.min(100, (metrics.conversions / metrics.impressions) * 1000))}%` }} />
                </div>
                <div className="flex justify-between text-[9px] text-slate-550 font-mono">
                  <span>100% {currentLang === 'ar' ? 'ظهور' : 'Impressions'}</span>
                  <span>{currentLang === 'ar' ? 'زيارة' : 'Click'}</span>
                  <span>{currentLang === 'ar' ? 'عميل محتمل' : 'Lead'}</span>
                  <span>{currentLang === 'ar' ? 'شراء مؤكد' : 'Paid Customer'}</span>
                </div>
              </div>
            </div>

            {/* Platform-specific Breakdown Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <span className="text-xs font-bold text-slate-650 uppercase tracking-widest block font-sans">
                {currentLang === 'ar' ? 'توزيع الميزانية والأداء المتوقع لكل منصة إعلانية' : 'PER-PLATFORM ACTIVE BUDGET ALLOCATION FORECAST'}
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.channelBreakdown.map((ch, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-850 p-4 rounded-2xl flex flex-col justify-between hover:border-slate-800 transition-all">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-1.5">
                        {ch.isSvg ? (
                          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                          </svg>
                        ) : (
                          <img src={ch.logo} alt={ch.label} className="w-3.5 h-3.5 shrink-0 object-contain" />
                        )}
                        <span className="font-sans text-xs font-bold text-slate-200">{ch.label}</span>
                      </div>
                      <span className="font-mono text-[9px] text-slate-550 font-bold">
                        {ch.budget.toLocaleString()} {currentLang === 'ar' ? 'ج.م' : 'EGP'}
                      </span>
                    </div>

                    <div className="space-y-1 mt-1">
                      <div className="flex justify-between text-[9px]">
                        <span className="text-slate-550 font-sans">{currentLang === 'ar' ? 'النقرات المتوقعة:' : 'Expected Clicks:'}</span>
                        <span className="font-mono font-bold text-slate-200">{ch.clicks.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-[9px]">
                        <span className="text-slate-550 font-sans">{currentLang === 'ar' ? 'التحويلات المتوقعة:' : 'Sales:'}</span>
                        <span className="font-mono font-bold text-slate-200">{ch.conversions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-[9px] pt-1 border-t border-slate-800 mt-1">
                        <span className="text-slate-555 text-slate-650 font-sans font-bold">{currentLang === 'ar' ? 'العائد المتوقع:' : 'Revenue:'}</span>
                        <span className="font-mono font-bold text-emerald-600">{ch.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recharts Area Growth Chart */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-sm relative">
              <span className="font-sans text-[11px] text-slate-650 font-bold uppercase tracking-widest block mb-4">
                {currentLang === 'ar' ? 'منحنى تخطيط مضاعفة الأرباح المتوقعة وتراكم الميزانية (6 أشهر)' : '6-Month Optimization Cumulative Forecast Plan'}
              </span>
              <AreaForecastChart data={chartData} currentLang={currentLang} />
            </div>

            {/* Disclaimer info text card */}
            <div className="flex gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-[10px] text-slate-650 leading-relaxed font-sans shadow-sm">
              <Info className="w-4 h-4 text-[#9d027c] shrink-0 mt-0.5" />
              <span>{t.calculator.warning}</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
