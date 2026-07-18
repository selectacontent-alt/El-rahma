import { useState, useEffect, useRef } from "react";
import { STUDIO_STATS } from "./data";
import { CheckCircle, Image, Smile, Clock, Camera } from "lucide-react";

interface StudioStatsProps {
  isAr: boolean;
}

const STAT_DESIGNS: Record<string, {
  accentColor: string;
  glowColor: string;
  textColor: string;
  nodeCode: string;
  iconBg: string;
}> = {
  "stat-projects": {
    accentColor: "from-emerald-500 to-teal-400",
    glowColor: "hover:shadow-[0_20px_40px_rgba(16,185,129,0.08)] hover:border-emerald-300/60",
    textColor: "text-emerald-500",
    nodeCode: "REC_PRJ_247",
    iconBg: "bg-emerald-50 text-emerald-500 border-emerald-100"
  },
  "stat-photos": {
    accentColor: "from-media-purple-500 to-media-pink-500",
    glowColor: "hover:shadow-[0_20px_40px_rgba(168,85,247,0.08)] hover:border-media-purple-300/60",
    textColor: "text-media-purple-500",
    nodeCode: "REC_IMG_4.8K",
    iconBg: "bg-media-purple-50 text-media-purple-500 border-media-purple-100"
  },
  "stat-satisfaction": {
    accentColor: "from-media-amber-500 to-yellow-400",
    glowColor: "hover:shadow-[0_20px_40px_rgba(245,158,11,0.08)] hover:border-media-amber-300/60",
    textColor: "text-media-amber-500",
    nodeCode: "REC_QAL_98",
    iconBg: "bg-media-amber-50 text-media-amber-500 border-media-amber-100"
  },
  "stat-hours": {
    accentColor: "from-media-rose-500 to-orange-400",
    glowColor: "hover:shadow-[0_20px_40px_rgba(244,63,94,0.08)] hover:border-media-rose-300/60",
    textColor: "text-media-rose-500",
    nodeCode: "REC_HRS_500",
    iconBg: "bg-media-rose-50 text-media-rose-500 border-media-rose-100"
  }
};

export default function StudioStats({ isAr }: StudioStatsProps) {
  const [tickerCounts, setTickerCounts] = useState<{ [key: string]: number }>({
    "stat-projects": 0,
    "stat-photos": 0,
    "stat-satisfaction": 0,
    "stat-hours": 0,
  });

  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!hasAnimated) return;

    const targets = {
      "stat-projects": 247,
      "stat-photos": 48,
      "stat-satisfaction": 98,
      "stat-hours": 500,
    };

    const timers = Object.entries(targets).map(([key, target]) => {
      let current = 0;
      const step = Math.ceil(target / 40);
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        setTickerCounts((prev) => ({
          ...prev,
          [key]: current,
        }));
      }, 30);
      return interval;
    });

    return () => {
      timers.forEach((timer) => clearInterval(timer));
    };
  }, [hasAnimated]);

  const getStatIcon = (iconName: string, iconClass: string) => {
    const props = { className: iconClass };
    switch (iconName) {
      case "CheckCircle": return <CheckCircle {...props} />;
      case "Image": return <Image {...props} />;
      case "Smile": return <Smile {...props} />;
      case "Clock": return <Clock {...props} />;
      default: return <Camera {...props} />;
    }
  };

  return (
    <section ref={sectionRef} className="relative bg-transparent py-20 px-6 lg:px-20 border-b border-media-slate-100">
      
      {/* Absolute HUD grid lines for high tech architecture */}
      <div className="absolute top-0 bottom-0 left-10 right-10 border-x border-media-slate-900/[0.02] pointer-events-none" />
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-media-slate-900/[0.02] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Statistics slots layout resembling advanced technical readout screens */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STUDIO_STATS.map((stat) => {
            const currentVal = tickerCounts[stat.id] || 0;
            const formattedVal = stat.id === "stat-photos" 
              ? (currentVal / 10).toFixed(1) 
              : currentVal;

            const design = STAT_DESIGNS[stat.id] || STAT_DESIGNS["stat-projects"];

            return (
              <div 
                key={stat.id} 
                className={`bg-slate-900/40 border border-[#000000]/20 rounded-2xl p-6 transition-all duration-500 text-center flex flex-col items-center justify-between group relative overflow-hidden transform hover:-translate-y-2 ${design.glowColor}`}
              >
                
                {/* Radial ambient background glow */}
                <div className={`absolute -bottom-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br ${design.accentColor} opacity-[0.03] group-hover:opacity-10 blur-2xl transition-all duration-500 pointer-events-none`} />
                <div className={`absolute -top-10 -left-10 w-24 h-24 rounded-full bg-gradient-to-br ${design.accentColor} opacity-0 group-hover:opacity-[0.03] blur-2xl transition-all duration-500 pointer-events-none`} />

                {/* Corner tactical borders and node identity */}
                <span className="absolute top-2.5 right-3 text-[7.5px] font-mono text-media-slate-400 select-none tracking-widest">{design.nodeCode}</span>
                <div className="absolute top-3 left-3 w-1.5 h-1.5 border-t border-l border-media-slate-200 rounded-tl-xs group-hover:border-media-slate-300 transition-colors" />
                <div className="absolute bottom-3 right-3 w-1.5 h-1.5 border-b border-r border-media-slate-200 rounded-br-xs group-hover:border-media-slate-300 transition-colors" />

                {/* Animated high-definition Icon Badge */}
                <div className={`p-4 rounded-xl mb-4 border transition-all duration-300 group-hover:scale-110 shadow-xs ${design.iconBg}`}>
                  {getStatIcon(stat.icon, "w-6 h-6")}
                </div>

                {/* Dynamic numerical HUD flip display */}
                <div className="space-y-1 mb-2">
                  <div className="inline-flex items-baseline justify-center font-mono">
                    <span className="text-4xl sm:text-5xl font-black bg-gradient-to-b from-media-slate-900 via-media-slate-800 to-media-slate-950 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(0,0,0,0.01)] select-none">
                      {formattedVal}
                    </span>
                    <span className={`text-xl sm:text-2xl font-black bg-gradient-to-r ${design.accentColor} bg-clip-text text-transparent ml-1 selection:bg-transparent`}>
                      {stat.suffix}
                    </span>
                  </div>
                </div>

                {/* Human descriptive Label */}
                <h4 className="text-xs sm:text-sm font-black text-media-slate-700 tracking-wide transition-colors group-hover:text-white mt-1">
                  {isAr ? stat.labelAr : stat.labelEn}
                </h4>

                {/* Live systems heartbeat channel */}
                <div className="mt-5 pt-3.5 border-t border-media-slate-100 w-full flex justify-between items-center text-[8.5px] font-mono text-media-slate-400 select-none">
                  <span className="flex items-center gap-1.5 font-extrabold tracking-wider">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-media-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-media-rose-500"></span>
                    </span>
                    {isAr ? "نشط" : "ACTIVE"}
                  </span>
                  <span className="tracking-widest text-[7.5px] uppercase text-media-slate-450 group-hover:text-media-slate-600 transition-colors">
                    SYS_OK
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
