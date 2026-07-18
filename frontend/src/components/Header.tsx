import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Globe, Zap, Menu, X, ChevronDown, Palette, Laptop, Share2, Film, Video, Camera } from 'lucide-react';
import { i18n } from '../i18n';
import { Language } from '../types';

interface HeaderProps {
  currentLang: Language;
  setLang: (lang: Language) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Header({ currentLang, setLang, activeTab, setActiveTab }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projectsMenuOpen, setProjectsMenuOpen] = useState(false);
  const t = i18n[currentLang];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'services', label: t.nav.services },
    { id: 'projects', label: t.nav.projects },
    { id: 'news', label: currentLang === 'ar' ? 'أخبار' : 'News' },
    { id: 'portfolio', label: currentLang === 'ar' ? 'بورتفوليو' : 'Portfolio' },
    { id: 'contact', label: t.nav.contact },
  ];

  const handleNavClick = (id: string) => {
    if (id === 'projects') {
      setProjectsMenuOpen(!projectsMenuOpen);
      return;
    }
    if (id === 'testimonials') {
      setActiveTab('home');
      setMobileMenuOpen(false);
      setProjectsMenuOpen(false);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      return;
    }
    setActiveTab(id);
    setMobileMenuOpen(false);
    setProjectsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isLightSurface = activeTab === 'social' || activeTab === 'news' || activeTab === 'portfolio';
  const projectTabs = new Set([
    'projects',
    'projects-social',
    'projects-websites',
    'projects-animation',
    'projects-promotional',
    'projects-photography',
    'projects-branding',
  ]);

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? isLightSurface
            ? 'bg-white/90 backdrop-blur-md border-b border-gray-200 py-3 shadow-sm'
            : 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800 py-3 shadow-lg shadow-blue-500/5' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-row rtl:flex-row-reverse">
          {/* Logo Brand Area */}
          <div className="flex shrink-0 cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="group flex items-center" dir="ltr">
              <img
                src="/logo.svg"
                alt="S C Marketing Logo"
                className="h-[46px] w-auto max-w-[180px] object-contain transition-transform duration-300 group-hover:scale-[1.03] sm:h-[52px] sm:max-w-[220px]"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className={`hidden lg:flex items-center gap-1 p-1 rounded-full border ${
            isLightSurface 
              ? 'bg-white/80 border-gray-200 shadow-sm' 
              : 'bg-slate-900/50 border border-slate-800'
          }`}>
            {navItems.map((item) => {
              const isActive = item.id === 'projects' ? projectTabs.has(activeTab) : activeTab === item.id;
              
              if (item.id === 'projects') {
                return (
                  <div key={item.id} className="relative">
                    <button
                      id={`nav-link-${item.id}`}
                      onClick={() => handleNavClick(item.id)}
                      className={`px-4 py-1.5 flex items-center gap-1.5 rounded-full text-xs font-medium tracking-tight transition-all duration-300 relative cursor-pointer ${
                        isActive
                          ? isLightSurface
                            ? 'text-magenta bg-magenta/10 border border-magenta/20 font-semibold shadow-inner'
                            : 'text-blue-400 bg-slate-800/50 border border-slate-750 font-semibold shadow-inner'
                          : isLightSurface
                            ? 'text-gray-600 hover:text-[#9d027c] hover:bg-gray-100/50'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      <span className="relative z-10">{item.label}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${
                        projectsMenuOpen 
                          ? isLightSurface ? 'text-magenta -rotate-180' : 'text-blue-400 -rotate-180' 
                          : 'text-slate-500'
                      }`} />
                    </button>
                    
                    {/* Modern Glassmorphism Dropdown */}
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 transition-all duration-300 z-50 ${projectsMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                      <div className="w-[480px] bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-2xl shadow-blue-900/20 grid grid-cols-2 gap-2 relative overflow-hidden">
                        {/* Glow effect */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#9d027c]/20 rounded-full blur-3xl pointer-events-none" />
                        
                        <div onClick={() => handleNavClick('projects-branding')} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors group/item">
                          <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center border border-pink-500/20 group-hover/item:border-pink-500/40 transition-colors">
                            <Palette className="w-4 h-4 text-pink-400" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-200">{t.projectsMenu?.branding || 'هويات بصرية'}</span>
                        </div>
                        
                        <div onClick={() => handleNavClick('projects-websites')} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors group/item">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover/item:border-blue-500/40 transition-colors">
                            <Laptop className="w-4 h-4 text-blue-400" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-200">{t.projectsMenu?.websites || 'موقع الكتروني'}</span>
                        </div>
                        
                        <div onClick={() => handleNavClick('projects-social')} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors group/item">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover/item:border-emerald-500/40 transition-colors">
                            <Share2 className="w-4 h-4 text-emerald-400" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-200">{t.projectsMenu?.social || 'تصميمات سوشيال ميديا'}</span>
                        </div>
                        
                        <div onClick={() => handleNavClick('projects-animation')} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors group/item">
                          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover/item:border-purple-500/40 transition-colors">
                            <Video className="w-4 h-4 text-purple-400" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-200">{t.projectsMenu?.animation || 'فيديوهات الرسوم المتحركة'}</span>
                        </div>
                        
                        <div onClick={() => handleNavClick('projects-promotional')} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors group/item">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover/item:border-amber-500/40 transition-colors">
                            <Film className="w-4 h-4 text-amber-400" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-200">{t.projectsMenu?.promotional || 'فيديوهات مصورة دعائية'}</span>
                        </div>
                        
                        <div onClick={() => handleNavClick('projects-photography')} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/60 cursor-pointer transition-colors group/item">
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 group-hover/item:border-cyan-500/40 transition-colors">
                            <Camera className="w-4 h-4 text-cyan-400" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-200">{t.projectsMenu?.photography || 'تصوير فوتوغرافي للمنتجات'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-tight transition-all duration-300 relative cursor-pointer ${
                    isActive
                      ? isLightSurface
                        ? 'text-magenta bg-magenta/10 border border-magenta/20 font-semibold shadow-inner'
                        : 'text-blue-400 bg-slate-800/50 border border-slate-750 font-semibold shadow-inner'
                      : isLightSurface
                        ? 'text-gray-600 hover:text-[#9d027c] hover:bg-gray-100/50'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Translation and Secondary actions */}
          <div className="hidden sm:flex items-center gap-3">

            {/* Language Toggle Button */}
            <div className={`flex items-center gap-1 p-1 rounded-lg border flex-row rtl:flex-row-reverse ${
              isLightSurface ? 'bg-gray-100 border-gray-200' : 'bg-slate-900/50 border-slate-800'
            }`}>
              <button
                onClick={() => setLang('ar')}
                className={`px-3 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  currentLang === 'ar'
                    ? 'bg-[#9d027c] text-white'
                    : isLightSurface
                      ? 'text-gray-600 hover:text-[#9d027c] hover:bg-gray-200/50'
                      : 'text-slate-400 hover:text-[#9d027c] hover:bg-slate-800/50'
                }`}
              >
                العربية
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  currentLang === 'en'
                    ? 'bg-[#9d027c] text-white'
                    : isLightSurface
                      ? 'text-gray-600 hover:text-[#9d027c] hover:bg-gray-200/50'
                      : 'text-slate-400 hover:text-[#9d027c] hover:bg-slate-800/50'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Mobile Menu Action Area */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className={`flex items-center gap-1 p-0.5 rounded-lg border ${
              isLightSurface ? 'bg-gray-100 border-gray-200' : 'bg-slate-900/50 border border-slate-800'
            }`}>
              <button
                onClick={() => setLang(currentLang === 'ar' ? 'en' : 'ar')}
                className={`px-2 py-1 text-[10px] font-bold uppercase cursor-pointer ${
                  isLightSurface ? 'text-gray-600 hover:text-[#9d027c]' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {currentLang === 'ar' ? 'EN' : 'AR'}
              </button>
            </div>

            <button
              onClick={() => {
                if (mobileMenuOpen) {
                  setProjectsMenuOpen(false);
                }
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className={`p-1.5 rounded-lg cursor-pointer ${
                isLightSurface 
                  ? 'bg-white border border-gray-200 text-gray-700 hover:text-navy-deep shadow-sm' 
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer - Elegant & Compact */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            id="mobile-menu" 
            className={`lg:hidden absolute top-full left-0 right-0 backdrop-blur-xl border-b p-4 shadow-2xl flex flex-col gap-2 z-40 ${
              isLightSurface 
                ? 'bg-white/95 border-gray-200' 
                : 'bg-slate-950/95 backdrop-blur-xl border-slate-800'
            }`}
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item, index) => {
                const isActive = item.id === 'projects' ? projectTabs.has(activeTab) : activeTab === item.id;
                
                if (item.id === 'projects') {
                  return (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      key={item.id} 
                      className="flex flex-col gap-1"
                    >
                      <button
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full flex items-center justify-between py-3 px-4 rounded-lg text-sm font-bold transition-all duration-300 cursor-pointer ${
                          projectsMenuOpen 
                            ? isLightSurface
                              ? 'bg-magenta/10 text-magenta border-r-2 rtl:border-r-2 ltr:border-l-2 rtl:border-l-0 border-magenta'
                              : 'bg-[#9d027c]/10 text-[#9d027c] border-r-2 rtl:border-r-2 ltr:border-l-2 rtl:border-l-0 border-[#9d027c]' 
                            : isLightSurface
                              ? 'text-gray-700 hover:bg-gray-50 border-r-2 rtl:border-r-2 ltr:border-l-2 rtl:border-l-0 border-transparent'
                              : 'text-slate-300 hover:bg-slate-900 border-r-2 rtl:border-r-2 ltr:border-l-2 rtl:border-l-0 border-transparent'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                          projectsMenuOpen 
                            ? isLightSurface ? 'rotate-180 text-magenta' : 'rotate-180 text-[#9d027c]' 
                            : 'text-slate-500'
                        }`} />
                      </button>
                      
                      {/* Sub-projects list */}
                      <AnimatePresence>
                        {projectsMenuOpen && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className={`flex flex-col gap-1 pt-1 pb-2 px-2 border-r rtl:border-r ltr:border-l rtl:border-l-0 mr-4 rtl:mr-4 ltr:ml-4 rtl:ml-0 ${
                              isLightSurface ? 'border-gray-200' : 'border-slate-800/50'
                            }`}>
                              {[
                                { id: 'projects-branding', icon: Palette, label: t.projectsMenu?.branding || 'هويات بصرية' },
                                { id: 'projects-websites', icon: Laptop, label: t.projectsMenu?.websites || 'موقع الكتروني' },
                                { id: 'projects-social', icon: Share2, label: t.projectsMenu?.social || 'تصميمات سوشيال ميديا' },
                                { id: 'projects-animation', icon: Video, label: t.projectsMenu?.animation || 'فيديوهات الرسوم المتحركة' },
                                { id: 'projects-promotional', icon: Film, label: t.projectsMenu?.promotional || 'فيديوهات مصورة دعائية' },
                                { id: 'projects-photography', icon: Camera, label: t.projectsMenu?.photography || 'تصوير فوتوغرافي للمنتجات' },
                              ].map((sub, i) => (
                                <motion.button
                                  key={sub.id}
                                  initial={{ opacity: 0, x: -5 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.03 }}
                                  onClick={() => handleNavClick(sub.id)}
                                  className={`w-full flex items-center gap-3 text-right rtl:text-right ltr:text-left py-2 px-3 rounded-md text-xs font-medium cursor-pointer transition-colors group ${
                                    isLightSurface
                                      ? 'text-gray-600 hover:text-navy-deep hover:bg-gray-100'
                                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                                  }`}
                                >
                                  <sub.icon className={`w-3.5 h-3.5 transition-colors ${
                                    isLightSurface ? 'text-gray-400 group-hover:text-magenta' : 'text-slate-500 group-hover:text-[#9d027c]'
                                  }`} />
                                  <span>{sub.label}</span>
                                </motion.button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                }

                return (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full text-right cursor-pointer ${currentLang === 'en' ? 'text-left' : 'text-right'} py-3 px-4 rounded-lg text-sm font-bold transition-all duration-300 border-r-2 rtl:border-r-2 ltr:border-l-2 rtl:border-l-0 ${
                      isActive 
                        ? isLightSurface
                          ? 'bg-magenta/10 border-magenta text-magenta'
                          : 'bg-[#9d027c]/10 border-[#9d027c] text-[#9d027c]' 
                        : isLightSurface
                          ? 'border-transparent text-gray-700 hover:bg-gray-50 hover:text-navy-deep'
                          : 'border-transparent text-slate-300 hover:bg-slate-900 hover:text-slate-100'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                );
              })}
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

