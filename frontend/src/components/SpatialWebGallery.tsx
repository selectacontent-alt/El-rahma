"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionValueEvent } from 'motion/react';
import { Globe, Code2, Layers, X, Sparkles, ArrowRight, Activity, Zap } from 'lucide-react';
import InteractiveGrid from './InteractiveGrid';
import { publicDriveUrl, siteFetch } from '../lib/siteApi';

// --- Types & Data ---
interface Project {
  id: string;
  title: string;
  titleAr: string;
  category: string;
  categoryAr: string;
  image: string;
  description: string;
  descriptionAr: string;
  tech: string[];
  color: string;
  demoUrl: string;
}

const baseProjects: Project[] = [
  {
    id: 'e-commerce-pro',
    title: 'Nexus Commerce',
    titleAr: 'نيكسس للتجارة',
    category: 'E-Commerce',
    categoryAr: 'متجر ذكي',
    image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?q=80&w=1000&auto=format&fit=crop',
    description: 'A hyper-scale e-commerce platform built for massive concurrent users featuring AI-driven product recommendations',
    descriptionAr: 'منصة تجارة إلكترونية فائقة النطاق مصممة لاستيعاب عدد هائل من المستخدمين المتزامنين مع توصيات ذكية',
    tech: ['Next.js', 'Stripe'],
    color: '#9d027c',
    demoUrl: '/'
  },
  {
    id: 'fintech-dash',
    title: 'Aura Fintech',
    titleAr: 'أورا المالية',
    category: 'Fintech',
    categoryAr: 'تكنولوجيا مالية',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    description: 'Real-time financial analytics dashboard with socket-based data streaming and predictive charting',
    descriptionAr: 'لوحة تحكم للتحليلات المالية في الوقت الفعلي مع تدفق بيانات مبني على المقابس',
    tech: ['React', 'D3.js'],
    color: '#ffbc01',
    demoUrl: '/'
  },
  {
    id: 'med-tech',
    title: 'Pulse Health',
    titleAr: 'نبض للصحة',
    category: 'Healthcare',
    categoryAr: 'رعاية صحية',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop',
    description: 'Comprehensive hospital management system integrating patient portals and telemedicine',
    descriptionAr: 'نظام شامل لإدارة المستشفيات يدمج بوابات المرضى والتطبيب عن بعد',
    tech: ['TypeScript', 'AWS'],
    color: '#0ea5e9',
    demoUrl: '/'
  },
  {
    id: 'ai-saas',
    title: 'Cogni AI',
    titleAr: 'كوجني للذكاء الاصطناعي',
    category: 'AI SaaS',
    categoryAr: 'منصة ذكاء اصطناعي',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop',
    description: 'An intelligent writing assistant for enterprises featuring custom LLM deployment',
    descriptionAr: 'مساعد كتابة ذكي للمؤسسات يتميز بنشر نماذج لغوية كبيرة مخصصة',
    tech: ['Python', 'OpenAI'],
    color: '#8b5cf6',
    demoUrl: '/'
  },
  {
    id: 'crypto-exchange',
    title: 'BlockTrade',
    titleAr: 'بلوك تريد',
    category: 'Web3',
    categoryAr: 'تطبيق ويب 3',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f4fc286?q=80&w=1000&auto=format&fit=crop',
    description: 'Decentralized exchange interface with ultra-low latency order matching visualizers',
    descriptionAr: 'واجهة تبادل لامركزية مع مصورات مطابقة الأوامر ذات زمن انتقال منخفض للغاية',
    tech: ['Solidity', 'Web3.js'],
    color: '#10b981',
    demoUrl: '/'
  },
  {
    id: 'real-estate',
    title: 'Lumina Estates',
    titleAr: 'لومينا للعقارات',
    category: 'Real Estate',
    categoryAr: 'عقارات',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop',
    description: 'Interactive property viewing platform with 3D virtual tours and instant mortgage calculators',
    descriptionAr: 'منصة تفاعلية لعرض العقارات مع جولات افتراضية ثلاثية الأبعاد وحاسبات رهن عقاري فورية',
    tech: ['Three.js', 'Next.js'],
    color: '#f43f5e',
    demoUrl: '/'
  },
  {
    id: 'ed-tech',
    title: 'EduSphere',
    titleAr: 'إديو سفير',
    category: 'EdTech',
    categoryAr: 'تعليم إلكتروني',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop',
    description: 'Gamified learning management system with real-time video classrooms and AI grading',
    descriptionAr: 'نظام إدارة تعلم يعتمد على التلعيب مع فصول فيديو في الوقت الفعلي وتصحيح بالذكاء الاصطناعي',
    tech: ['React', 'WebRTC'],
    color: '#ec4899',
    demoUrl: '/'
  },
  {
    id: 'crm-system',
    title: 'Sync CRM',
    titleAr: 'سينك لخدمة العملاء',
    category: 'CRM',
    categoryAr: 'إدارة علاقات العملاء',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop',
    description: 'Automated workflow CRM that tracks customer journeys from lead acquisition to retention',
    descriptionAr: 'نظام CRM لسير العمل الآلي يتتبع رحلات العملاء من اكتساب العملاء المحتملين إلى الاحتفاظ بهم',
    tech: ['Vue.js', 'Node.js'],
    color: '#14b8a6',
    demoUrl: '/'
  },
  {
    id: 'cloud-infra',
    title: 'SkyGrid',
    titleAr: 'سكاي جريد',
    category: 'Cloud',
    categoryAr: 'بنية سحابية',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    description: 'Server management console for orchestrating Kubernetes clusters across multi-cloud environments',
    descriptionAr: 'وحدة تحكم لإدارة الخوادم لتنظيم مجموعات Kubernetes عبر بيئات سحابية متعددة',
    tech: ['Go', 'Kubernetes'],
    color: '#3b82f6',
    demoUrl: '/'
  },
  {
    id: 'ai-vision',
    title: 'Visionary',
    titleAr: 'فيجنري',
    category: 'AI Vision',
    categoryAr: 'رؤية حاسوبية',
    image: 'https://images.unsplash.com/photo-1682687981974-c5ef2111640c?q=80&w=1000&auto=format&fit=crop',
    description: 'Text-to-image AI platform utilizing custom stable diffusion pipelines for hyper-realistic renders',
    descriptionAr: 'منصة ذكاء اصطناعي لتحويل النص إلى صورة تستخدم خطوط انتشار مستقرة مخصصة لإنتاج صور واقعية للغاية',
    tech: ['PyTorch', 'Next.js'],
    color: '#eab308',
    demoUrl: '/'
  }
];

// Web Audio API context for the mechanical tick sound
let audioCtx: AudioContext | null = null;
const playTick = () => {
  if (typeof window === 'undefined') return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.03);
    
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime); 
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
    
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.03);
  } catch (e) {
    // Ignore audio errors gracefully (e.g. before user interaction)
  }
};

// --- NUCLEAR PERFORMANCE FIXES ---
// 1. Swapped <motion.div> for a native <div> with standard CSS transition.
// 2. Offloaded scale and shadow animations to CSS engine (GPU) instead of Framer JS calculations.
// 3. Removed preserve-3d to stop compositing layer explosion on mobile.
const ProjectCard = React.memo(({ 
  project, 
  index, 
  isActive, 
  isHidden,
  angle, 
  radius, 
  cardSize, 
  isArabic, 
  onClick 
}: {
  project: Project;
  index: number;
  isActive: boolean;
  isHidden: boolean;
  angle: number;
  radius: number;
  cardSize: { width: number; height: number };
  isArabic: boolean;
  onClick: () => void;
}) => {
  return (
    <div 
      className="absolute flex items-center justify-center"
      style={{ 
        transform: `rotateZ(${angle}deg)`,
        opacity: isHidden ? 0 : 1, // Instantly hide when modal opens to allow the modal to "take over"
        pointerEvents: isHidden ? 'none' : 'auto',
        zIndex: isActive ? 50 : 10, // Apply z-index to the outermost wrapper that creates the stacking context
      }}
    >
      <div
        className="relative flex flex-col items-center justify-center rounded-xl md:rounded-2xl overflow-hidden border pointer-events-auto cursor-pointer bg-slate-900 transition-all duration-300 ease-out"
        style={{ 
          transform: `translateY(${-radius}px) scale(${isActive ? 1.25 : 0.9})`,
          width: cardSize.width,
          height: cardSize.height,
          borderColor: isActive ? `${project.color}` : 'rgba(255,255,255,0.15)',
          boxShadow: isActive ? `0 0 20px ${project.color}50` : '0 5px 15px rgba(0,0,0,0.5)',
          willChange: 'transform'
        }}
        onClick={onClick}
      >
        <img 
          src={project.image} 
          alt={project.title} 
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
        <div className="relative z-10 w-full h-full p-3 flex flex-col items-center text-center justify-between">
          <div 
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-950 border border-white/20 flex items-center justify-center shadow-lg transition-colors duration-300"
            style={{ boxShadow: isActive ? `0 0 15px ${project.color}40` : 'none' }}
          >
            <Layers className="w-4 h-4 md:w-5 md:h-5 transition-colors duration-300" style={{ color: project.color }} />
          </div>
          <div className="flex flex-col items-center bg-slate-950/90 px-2 py-1.5 rounded-lg border border-white/5 w-full">
            <span className="text-[8px] md:text-[9px] font-mono tracking-wider font-bold mb-0.5 text-slate-400 transition-colors duration-300">
              {isArabic ? project.categoryAr : project.category}
            </span>
            <h3 
              className="text-[10px] md:text-sm font-black leading-tight drop-shadow-md transition-colors duration-300"
              style={{ color: project.color }}
            >
              {isArabic ? project.titleAr : project.title}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
});

export default function SpatialWebGallery({ lang = 'ar' }: { lang?: 'en' | 'ar' }) {
  const isArabic = lang === 'ar';
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [cmsProjects, setCmsProjects] = useState<Project[]>([]);
  
  // Responsive measurements
  const [radius, setRadius] = useState(280);
  const [cardSize, setCardSize] = useState({ width: 140, height: 210 });
  const [isMobile, setIsMobile] = useState(false);
  const [windowHeight, setWindowHeight] = useState(800);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setRadius(mobile ? 140 : 280);
      setCardSize(mobile ? { width: 90, height: 135 } : { width: 140, height: 210 });
      setWindowHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let active = true;
    const loadProjects = async () => {
      const data = await siteFetch<any[]>('/websites');
      if (!active || !data?.length) return;
      const mapped = data.map((project, index) => ({
        id: `cms-${project.id}`,
        title: project.nameEn || project.nameAr || `Project ${index + 1}`,
        titleAr: project.nameAr || project.nameEn || `مشروع ${index + 1}`,
        category: project.category || 'Website',
        categoryAr: project.category || 'موقع إلكتروني',
        image: publicDriveUrl(project.screenshotId || project.logoFileId, project.screenshotUrl || project.logoUrl || 'https://images.unsplash.com/photo-1661956602116-aa6865609028?q=80&w=1000&auto=format&fit=crop', 'w1400'),
        description: project.descEn || project.descAr || 'Website project managed from the admin panel.',
        descriptionAr: project.descAr || project.descEn || 'مشروع موقع إلكتروني من لوحة التحكم.',
        tech: ['CMS', 'Drive'],
        color: ['#9d027c', '#ffbc01', '#0ea5e9', '#10b981', '#f43f5e'][index % 5],
        demoUrl: project.url || '/',
      }));
      setCmsProjects(mapped);
      setActiveIndex(0);
    };
    loadProjects();
    return () => { active = false; };
  }, []);

  const displayProjects = cmsProjects.length
    ? [...cmsProjects, ...cmsProjects.map(project => ({ ...project, id: `${project.id}-clone` }))]
    : [...baseProjects, ...baseProjects.map(project => ({ ...project, id: `${project.id}-clone` }))];
  const totalCards = displayProjects.length;
  const anglePerCard = 360 / totalCards;

  // Highly performant 60fps wheel rotation state
  const dragX = useMotionValue(0);
  const smoothDragX = useSpring(dragX, { stiffness: 40, damping: 25, mass: 1 });
  const wheelRotation = useTransform(smoothDragX, (x) => x * 0.3);

  const [activeIndex, setActiveIndex] = useState(0);

  // Determine which card is exactly at the top (active)
  useMotionValueEvent(wheelRotation, "change", (latest) => {
    let normalized = latest % 360;
    if (normalized > 0) normalized -= 360;
    
    const targetI = Math.round(-normalized / anglePerCard);
    const wrappedI = ((targetI % totalCards) + totalCards) % totalCards;
    
    if (wrappedI !== activeIndex) {
      setActiveIndex(wrappedI);
    }
  });

  // Play tick sound when active index changes (gear effect)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // Only play audio ticks on non-mobile devices to prevent GC pauses on phones
    if (window.innerWidth >= 768) {
      playTick();
    }
  }, [activeIndex]);

  const handleWheel = (e: React.WheelEvent) => {
    dragX.set(dragX.get() - e.deltaY * 1.5);
  };

  const jumpToCard = useCallback((i: number) => {
    const currentRot = wheelRotation.get();
    const currentI = Math.round(-currentRot / anglePerCard);
    
    const diff = i - (currentI % totalCards);
    let shortestDiff = diff;
    if (diff > totalCards / 2) shortestDiff -= totalCards;
    if (diff < -totalCards / 2) shortestDiff += totalCards;
    
    const newI = currentI + shortestDiff;
    dragX.set(-newI * anglePerCard / 0.3);
  }, [wheelRotation, dragX, anglePerCard, totalCards]);

  const currentProject = displayProjects[activeIndex] || displayProjects[0];
  const centerTop = radius + (isMobile ? 320 : 360);
  
  // Calculate exact physical distance from the screen center to the top card for the fly-out animation
  const cardAbsoluteY = centerTop - radius;
  const screenCenterY = windowHeight / 2;
  const initialAnimationY = cardAbsoluteY - screenCenterY;

  return (
    <div 
      className="relative w-full min-h-[850px] md:min-h-[1200px] overflow-hidden bg-transparent font-sans text-slate-200 flex flex-col items-center select-none"
      onWheel={handleWheel}
    >
      {/* Restored the grid background across all screens per user request */}
      <div className="absolute inset-0 z-0 opacity-20 md:opacity-40 pointer-events-none">
        <InteractiveGrid />
      </div>

      <motion.div 
        className="absolute w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full pointer-events-none z-0"
        style={{ 
          top: `${centerTop}px`, left: '50%', transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${currentProject.color} 0%, transparent 70%)`
        }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 0.5 }}
      />

      <div className="absolute top-24 z-30 pointer-events-none text-center w-full px-4">
        {/* Animated melting gradient style */}
        <style>{`
          @keyframes gradient-melt {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
        `}</style>
        <div className="flex flex-col items-center justify-center text-center gap-1 sm:gap-2">
          <h2 
            className="text-[clamp(1.9rem,5vw,3.1rem)] font-black tracking-normal text-transparent bg-clip-text drop-shadow-md leading-[1.18]"
            style={{
              backgroundImage: 'linear-gradient(90deg, #9d027c, #f43f5e, #ffbc01, #f43f5e, #9d027c)',
              backgroundSize: '200% auto',
              animation: 'gradient-melt 4s linear infinite'
            }}
          >
            {isArabic ? 'نماذج مواقع ومنصات رقمية' : 'Website and Platform Work Samples'}
          </h2>
          <h3 
            className="text-sm sm:text-base md:text-lg font-semibold leading-7 text-transparent bg-clip-text drop-shadow-md"
            style={{
              backgroundImage: 'linear-gradient(90deg, #9d027c, #f43f5e, #ffbc01, #f43f5e, #9d027c)',
              backgroundSize: '200% auto',
              animation: 'gradient-melt 4s linear infinite'
            }}
          >
            {isArabic ? 'تصميم يشرح العرض ويقود الزائر للطلب' : 'Design that explains the offer and leads visitors to act'}
          </h3>
        </div>
      </div>

      <motion.div 
        className="relative w-full flex-1 flex items-center justify-center z-20 cursor-default"
        onPan={(e, info) => { dragX.set(dragX.get() + info.delta.x); }}
        style={{ touchAction: 'pan-y' }}
      >
        <div 
          className="absolute left-1/2 flex items-center justify-center pointer-events-none z-50 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          style={{ top: `${centerTop}px`, transform: 'translate(-50%, -50%)' }}
        >
          <img src="/logo.png" alt="Select Logo" className="w-16 h-16 md:w-36 md:h-36 object-contain" />
        </div>

        <motion.div
          className="absolute flex items-center justify-center pointer-events-none"
          style={{ 
            rotateZ: wheelRotation,
            top: `${centerTop}px`,
            willChange: 'transform'
          }}
        >
          {displayProjects.map((project, i) => (
            <ProjectCard 
              key={`${project.id}-${i}`}
              project={project}
              index={i}
              isActive={i === activeIndex}
              isHidden={activeProject !== null && i === activeIndex}
              angle={i * anglePerCard}
              radius={radius}
              cardSize={cardSize}
              isArabic={isArabic}
              onClick={() => {
                if (i === activeIndex) {
                  setActiveProject(project);
                } else {
                  jumpToCard(i);
                }
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Expanded Modal */}
      <AnimatePresence>
        {activeProject && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(10px)' }} 
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4 md:p-8 pointer-events-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setActiveProject(null);
            }}
          >
            <motion.div 
              initial={{ y: initialAnimationY, scale: 0.15, opacity: 0, rotateZ: -5 }}
              animate={{ y: 0, scale: 1, opacity: 1, rotateZ: 0 }}
              exit={{ y: initialAnimationY, scale: 0.15, opacity: 0, rotateZ: 5 }}
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              style={{ transformOrigin: 'center center' }}
              className={`w-full h-full max-h-[90vh] max-w-6xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl relative z-50 flex flex-col md:flex-row overflow-hidden ${isArabic ? 'rtl' : 'ltr'}`}
            >
              <button 
                onClick={() => setActiveProject(null)}
                className={`absolute top-4 ${isArabic ? 'left-4' : 'right-4'} flex items-center justify-center w-10 h-10 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all rounded-full border border-slate-600 z-50 shadow-lg`}
              >
                <X className="w-5 h-5" />
              </button>

              <div className={`w-full md:w-1/3 p-6 md:p-8 flex flex-col overflow-y-auto bg-slate-900 z-10 ${isArabic ? 'text-right' : 'text-left'}`}>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 mb-5 shadow-inner ${isArabic ? 'self-start' : 'self-start'}`}>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeProject.color }} />
                  <span className="text-[10px] md:text-xs font-mono text-slate-300 tracking-wider">
                    {isArabic ? activeProject.categoryAr : activeProject.category}
                  </span>
                </div>

                <h2 className="text-[clamp(1.85rem,4vw,2.65rem)] font-black text-white mb-4 leading-[1.22] drop-shadow-md">
                  {isArabic ? activeProject.titleAr : activeProject.title}
                </h2>

                <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed mb-6">
                  {isArabic ? activeProject.descriptionAr : activeProject.description}
                </p>

                <div className="flex flex-col gap-3 mb-8">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {isArabic ? 'المحركات والتقنيات الأساسية' : 'Core Engines & Tech'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.tech.map((t, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-[10px] md:text-xs font-mono font-bold flex items-center gap-2"
                      >
                        <Zap className="w-3 h-3" style={{ color: activeProject.color }} />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto">
                  <a 
                    href={activeProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 md:py-4 text-slate-950 font-black text-sm rounded-xl hover:scale-[1.02] transition-transform shadow-lg relative overflow-hidden group"
                    style={{ backgroundColor: activeProject.color }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full h-full -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-12" />
                    <Globe className="w-4 h-4 relative z-10" />
                    <span className="relative z-10 tracking-wide uppercase">{isArabic ? 'زيارة الموقع الحي' : 'Visit Live Site'}</span>
                    <ArrowRight className={`w-4 h-4 relative z-10 ${isArabic ? 'rotate-180' : ''}`} />
                  </a>
                </div>
              </div>

              <div className="w-full md:w-2/3 h-[50vh] md:h-full bg-slate-950 relative border-t md:border-t-0 md:border-r border-white/10 overflow-hidden group flex flex-col">
                <div className="w-full h-10 bg-slate-900/90 backdrop-blur-md border-b border-white/10 flex-shrink-0 flex items-center px-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="mx-auto bg-slate-950 px-4 py-1 rounded-full border border-white/5 text-[10px] text-slate-400 font-mono flex items-center gap-2">
                    <Globe className="w-3 h-3" />
                    Live Interactive Demo
                  </div>
                </div>

                <iframe 
                  src={activeProject.demoUrl}
                  title={activeProject.title}
                  className="w-full flex-1 border-0 bg-slate-950"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
