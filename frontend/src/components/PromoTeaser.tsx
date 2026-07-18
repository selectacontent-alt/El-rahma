import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Gift, Sparkles, Zap } from 'lucide-react';
import { i18n } from '../i18n';
import { Language } from '../types';

interface PromoTeaserProps {
  currentLang: Language;
}

export default function PromoTeaser({ currentLang }: PromoTeaserProps) {
  const t = i18n[currentLang];

  // Simulated countdown values
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 14,
    minutes: 42,
    seconds: 59,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        } else {
          clearInterval(interval);
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handlePromonClick = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-transparent">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="rounded-3xl sm:rounded-[3rem] overflow-hidden relative shadow-[0_30px_100px_-20px_rgba(157,2,124,0.5)] border border-white/10"
        >
          {/* Deep Rich Purple Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#9d027c] via-[#7a0160] to-[#2d0022]" />
          
          {/* Stunning Light Leaks / Abstract Glowing Shapes - Highly Optimized (No Blur Filters) */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-40 pointer-events-none" style={{ background: 'radial-gradient(circle #ff4dcc 0% transparent 70%)' }} />
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle #ffb347 0% transparent 70%)' }} />
          
          <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />

          <div className="relative p-5 sm:p-12 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
            
            {/* Banner Text Content */}
            <div className="flex-1 text-center lg:text-right rtl:text-right ltr:text-left flex flex-col gap-3 sm:gap-6 relative z-10">


              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.3 }}
                className="text-2xl sm:text-5xl lg:text-[3.5rem] font-black text-white font-sans tracking-tight leading-[1.4] sm:leading-[1.1] drop-shadow-md"
              >
                {t.discount.title}
              </motion.h3>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.4 }}
                className="text-sm sm:text-xl text-white/80 leading-relaxed max-w-2xl font-sans font-medium mt-1 sm:mt-2"
              >
                {t.discount.subtitle}
              </motion.p>
            </div>

            {/* Glassmorphism Countdown Timer */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
              whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.4, type: "spring", stiffness: 80 }}
              style={{ perspective: 1000 }}
              className="flex flex-col items-center gap-6 sm:gap-8 bg-white/10 backdrop-blur-2xl border border-white/20 p-5 sm:p-12 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl min-w-0 sm:min-w-[360px] w-full lg:w-auto relative z-10"
            >
              <div className="flex items-center justify-center w-full">
                <span className="font-sans text-xs sm:text-sm text-white/70 uppercase font-bold tracking-widest flex items-center gap-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
                  <span>{t.discount.timerLabel}</span>
                </span>
              </div>

              {/* Timers Row */}
              <div className="flex items-center justify-between w-full gap-1 sm:gap-3 font-sans direction-ltr">
                <div className="flex flex-col items-center">
                  <span className="flex items-center justify-center text-2xl sm:text-5xl font-black bg-white/5 border border-white/10 h-14 w-14 sm:h-24 sm:w-24 rounded-xl sm:rounded-[1.5rem] text-white shadow-inner">
                    {timeLeft.days.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs text-white/60 font-bold uppercase mt-2 sm:mt-4 tracking-widest">
                    {t.discount.days}
                  </span>
                </div>
                <span className="text-white/30 font-black text-xl sm:text-4xl -mt-6 sm:-mt-8">:</span>
                <div className="flex flex-col items-center">
                  <span className="flex items-center justify-center text-2xl sm:text-5xl font-black bg-white/5 border border-white/10 h-14 w-14 sm:h-24 sm:w-24 rounded-xl sm:rounded-[1.5rem] text-white shadow-inner">
                    {timeLeft.hours.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs text-white/60 font-bold uppercase mt-2 sm:mt-4 tracking-widest">
                    {t.discount.hours}
                  </span>
                </div>
                <span className="text-white/30 font-black text-xl sm:text-4xl -mt-6 sm:-mt-8">:</span>
                <div className="flex flex-col items-center">
                  <span className="flex items-center justify-center text-2xl sm:text-5xl font-black bg-white/5 border border-white/10 h-14 w-14 sm:h-24 sm:w-24 rounded-xl sm:rounded-[1.5rem] text-white shadow-inner">
                    {timeLeft.minutes.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs text-white/60 font-bold uppercase mt-2 sm:mt-4 tracking-widest">
                    {t.discount.minutes}
                  </span>
                </div>
                <span className="text-white/30 font-black text-xl sm:text-4xl -mt-6 sm:-mt-8">:</span>
                <div className="flex flex-col items-center">
                  <span className="flex items-center justify-center text-2xl sm:text-5xl font-black bg-white/10 border border-yellow-300/30 h-14 w-14 sm:h-24 sm:w-24 rounded-xl sm:rounded-[1.5rem] text-yellow-300 shadow-[0_0_15px_rgba(253,224,71,0.2)]">
                    {timeLeft.seconds.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] sm:text-xs text-yellow-300 font-bold uppercase mt-2 sm:mt-4 tracking-widest">
                    {t.discount.seconds}
                  </span>
                </div>
              </div>

              {/* High Contrast CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePromonClick}
                className="w-full mt-2 sm:mt-4 py-4 sm:py-5 bg-white hover:bg-slate-50 text-[#9d027c] text-sm sm:text-base font-black rounded-xl sm:rounded-2xl transition-all cursor-pointer text-center shadow-[0_10px_30px_rgba(0,0,0,0.2)] uppercase tracking-wide border-2 border-white"
              >
                {t.discount.cta}
              </motion.button>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
