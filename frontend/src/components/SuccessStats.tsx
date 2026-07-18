import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Activity, CircleDollarSign, Flame, Clock } from 'lucide-react';
import { i18n } from '../i18n';
import { Language } from '../types';

interface SuccessStatsProps {
  currentLang: Language;
}

export default function SuccessStats({ currentLang }: SuccessStatsProps) {
  const t = i18n[currentLang];
  
  // Ref for scroll tracking
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // States of counters
  const [experience, setExperience] = useState(0);
  const [clients, setClients] = useState(0);
  const [campaigns, setCampaigns] = useState(0);
  const [projects, setProjects] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    // Simple incremental tickers for visual fluid feel
    const duration = 4500; // Slowed down significantly
    const steps = 100;
    const stepTime = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep += 1;
      
      setExperience(Math.floor((5 / steps) * currentStep));
      setClients(Math.floor((500 / steps) * currentStep));
      setCampaigns(Math.floor((5000 / steps) * currentStep));
      setProjects(Math.floor((2000 / steps) * currentStep));

      if (currentStep >= steps) {
        setExperience(5);
        setClients(500);
        setCampaigns(5000);
        setProjects(2000);
        clearInterval(interval);
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [isInView]);

  const statCards = [
    {
      id: 'stat-experience',
      value: `${experience}+`,
      label: t.hero.experience,
      meta: currentLang === 'ar' ? 'سنوات من الخبرة' : 'Years Experience',
    },
    {
      id: 'stat-clients',
      value: `${clients.toLocaleString('en-US')}+`,
      label: t.hero.clients,
      meta: currentLang === 'ar' ? 'شركاء النجاح' : 'Active Clients',
    },
    {
      id: 'stat-campaigns',
      value: `${campaigns.toLocaleString('en-US')}+`,
      label: t.hero.campaigns,
      meta: currentLang === 'ar' ? 'حملات بمردود ذهبي' : 'ROI Campaigns',
    },
    {
      id: 'stat-projects',
      value: `${projects.toLocaleString('en-US')}+`,
      label: t.hero.projects,
      meta: currentLang === 'ar' ? 'مشاريع مكتملة' : 'Successful Projects',
    }
  ];

  return (
    <div ref={containerRef} className="pt-4 pb-16 bg-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-y border-slate-800 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0 lg:divide-x rtl:lg:divide-x-reverse lg:divide-slate-800">
            {statCards.map((stat, idx) => (
              <motion.div
                key={stat.id}
                className="flex flex-col items-center justify-center text-center px-4 group cursor-default interactive-node"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <div className="text-5xl md:text-6xl lg:text-[4.5rem] font-black text-slate-200 tracking-tighter mb-4 transition-transform duration-500 group-hover:-translate-y-2">
                  {stat.value}
                </div>
                
                <div className="w-6 h-1 bg-slate-800 mb-6 transition-all duration-500 group-hover:w-12 group-hover:bg-[#9d027c]" />
                
                <div className="text-base font-bold text-slate-300 font-sans mb-1">
                  {stat.label}
                </div>
                
                <div className="text-[11px] text-slate-500 font-sans tracking-widest uppercase font-medium">
                  {stat.meta}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
