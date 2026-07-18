import { Mail, Phone, MapPin, Award, ShieldCheck, Zap, Globe, MessageSquare, ArrowRight, Heart, Wallet, Landmark } from 'lucide-react';
import { i18n } from '../i18n';
import { Language } from '../types';
import { AnimatedCTA } from './BentoServices';

interface FooterProps {
  currentLang: Language;
  setActiveTab?: (tab: string) => void;
  activeTab?: string;
}

export default function Footer({ currentLang, setActiveTab, activeTab }: FooterProps) {
  const t = i18n[currentLang];
  const isLightSurface = activeTab === 'social' || activeTab === 'news' || activeTab === 'portfolio';
  const footerNavItems = [
    { id: 'home', label: t.nav.home },
    { id: 'news', label: t.nav.news },
    { id: 'services', label: t.nav.services },
    { id: 'portfolio', label: currentLang === 'ar' ? 'البورتفليو' : 'Portfolio' },
    { id: 'projects', label: t.nav.projects },
    { id: 'contact', label: t.nav.contact },
  ];

  const handleScrollToSection = (id: string) => {
    if (setActiveTab) {
      if (id === 'testimonials' || id === 'home') {
        setActiveTab('home');
        if (id !== 'home') {
          setTimeout(() => {
            const element = document.getElementById(id);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return;
      }
      setActiveTab(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://facebook.com',
      hoverClass: 'hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white hover:shadow-[0_6px_20px_rgba(24,119,242,0.35)]',
      path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com',
      hoverClass: 'hover:bg-[#E4405F] hover:border-[#E4405F] hover:text-white hover:shadow-[0_6px_20px_rgba(228,64,95,0.35)]',
      path: 'M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077'
    },
    {
      name: 'Snapchat',
      url: 'https://snapchat.com',
      hoverClass: 'hover:bg-[#FFFC00] hover:border-[#FFFC00] hover:text-black hover:shadow-[0_6px_20px_rgba(255,252,0,0.45)]',
      path: 'M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z'
    },
    {
      name: 'TikTok',
      url: 'https://tiktok.com',
      hoverClass: 'hover:bg-black hover:border-black hover:text-white hover:shadow-[0_6px_20px_rgba(0,0,0,0.45)]',
      path: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z'
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/201013100178',
      hoverClass: 'hover:bg-[#25D366] hover:border-[#25D366] hover:text-white hover:shadow-[0_6px_20px_rgba(37,211,102,0.35)]',
      path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z'
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com',
      hoverClass: 'hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white hover:shadow-[0_6px_20px_rgba(255,0,0,0.35)]',
      path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'
    }
  ];

  const hasCustomCta = false;

  return (
    <footer 
      id="footer" 
      className={`pt-16 relative overflow-hidden font-sans rounded-t-[40px] border-t transition-colors duration-300 ${
        isLightSurface 
          ? 'bg-[#fafafa] text-gray-600 border-gray-200' 
          : 'bg-transparent text-slate-300 border-slate-800'
      }`}
    >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Modern Minimalist CTA */}
        {!hasCustomCta && (
          <div className="text-center max-w-4xl mx-auto mb-20 pt-10 flex flex-col items-center">

          <style>{`
            @keyframes gradient-melt {
              0% { background-position: 0% 50%; }
              100% { background-position: 200% 50%; }
            }
          `}</style>
          <h2 
            className="mb-8 max-w-2xl text-[clamp(1.65rem,4vw,2.6rem)] font-black leading-[1.25] tracking-normal text-transparent bg-clip-text drop-shadow-md md:mb-10"
            style={{
              backgroundImage: 'linear-gradient(90deg, #9d027c, #f43f5e, #ffbc01, #f43f5e, #9d027c)',
              backgroundSize: '200% auto',
              animation: 'gradient-melt 4s linear infinite'
            }}
          >
            {currentLang === 'ar' ? 'جاهز لتحويل احتياجك إلى خطة تنفيذ واضحة؟' : 'Ready to turn your need into a clear execution plan?'}
          </h2>

          <div className="flex justify-center w-full">
            <AnimatedCTA 
              text={currentLang === 'ar' ? 'ابدأ طلب المشروع' : 'Start Project Request'} 
              textSent={currentLang === 'ar' ? 'جاري التحويل' : 'Loading...'} 
              onClick={() => handleScrollToSection('contact')} 
              className="scale-90 md:scale-100"
            />
          </div>
        </div>
      )}

        {/* Elegant 5-Column Layout */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 mb-16 border-t pt-16 transition-colors duration-300 ${
          isLightSurface ? 'border-gray-200' : 'border-slate-800'
        }`}>

          {/* Brand Info (Span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <img src="/logo.svg" alt="S C Marketing Logo" className="h-auto w-56 max-w-full object-contain drop-shadow-sm" />
            <p className={`text-sm leading-relaxed max-w-sm ${isLightSurface ? 'text-gray-600' : 'text-slate-300'}`}>
              {t.footer.desc}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-300 hover:bg-[#9d027c] hover:text-white hover:border-[#9d027c] hover:-translate-y-0.5 shadow-sm ${
                    isLightSurface 
                      ? 'bg-white border-gray-200 text-gray-500' 
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d={social.path} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Contact (Span 4) */}
          <div className="lg:col-span-4 flex flex-col gap-6 text-right rtl:text-right ltr:text-left">
            <h4 className={`font-bold text-base flex items-center gap-2 ${isLightSurface ? 'text-navy-deep' : 'text-slate-200'}`}>
              <span className="w-2 h-2 rounded-full bg-[#9d027c]" />
              {currentLang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </h4>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-yellow-500 shrink-0" />
                <span className={`text-sm font-bold font-mono tracking-wider select-all ${isLightSurface ? 'text-navy-deep' : 'text-slate-300'}`} dir="ltr">01013100178</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-yellow-500 shrink-0" />
                <span className={`text-sm font-medium font-sans select-all ${isLightSurface ? 'text-gray-700' : 'text-slate-300'}`}>info@selectcustomersmarketing.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <span className={`text-sm font-medium leading-relaxed font-sans max-w-[250px] ${isLightSurface ? 'text-gray-600' : 'text-slate-300'}`}>
                  شارع 15 مايو امام مطعم كنتاكي - شبرا الخيمة - القاهرة
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links (Span 2) */}
          <div className="lg:col-span-2 flex flex-col gap-6 text-right rtl:text-right ltr:text-left">
            <h4 className={`font-bold text-base flex items-center gap-2 ${isLightSurface ? 'text-navy-deep' : 'text-slate-200'}`}>
              <span className="w-2 h-2 rounded-full bg-[#9d027c]" />
              {t.footer.linksTitle}
            </h4>
            <div className="flex flex-col gap-4">
              {footerNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleScrollToSection(item.id)}
                  className={`text-right rtl:text-right ltr:text-left text-sm font-medium transition-all cursor-pointer ${
                    isLightSurface 
                      ? 'text-gray-500 hover:text-[#9d027c] hover:translate-x-1 rtl:hover:-translate-x-1' 
                      : 'text-slate-400 hover:text-[#9d027c] hover:translate-x-1 rtl:hover:-translate-x-1'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Trusted Partners (Span 2) */}
          <div className="lg:col-span-2 flex flex-col gap-6 text-right rtl:text-right ltr:text-left">
            <h4 className={`font-bold text-base flex items-center gap-2 ${isLightSurface ? 'text-navy-deep' : 'text-slate-200'}`}>
              <span className="w-2 h-2 rounded-full bg-[#9d027c]" />
              {currentLang === 'ar' ? 'شركاء النجاح' : 'Trusted Partners'}
            </h4>
            <div className="flex flex-col gap-3">
              <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border hover:border-[#9d027c] hover:shadow-md transition-all cursor-default ${
                isLightSurface ? 'bg-white border-gray-200' : 'bg-slate-900 border-slate-800'
              }`}>
                <svg className="w-5 h-5 text-blue-500 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                <span className={`text-xs font-bold tracking-wider ${isLightSurface ? 'text-gray-700' : 'text-slate-300'}`}>FACEBOOK PARTNER</span>
              </div>
              <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border hover:border-[#9d027c] hover:shadow-md transition-all cursor-default ${
                isLightSurface ? 'bg-white border-gray-200' : 'bg-slate-900 border-slate-800'
              }`}>
                <svg className="w-5 h-5 text-[#9d027c] shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.553 0-6.44-2.887-6.44-6.44s2.887-6.44 6.44-6.44c1.633 0 3.118.618 4.269 1.628l3.125-3.125C19.34 2.115 15.98 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-11.008 0-.74-.066-1.43-.189-2.187H12.24z" /></svg>
                <span className={`text-xs font-bold tracking-wider ${isLightSurface ? 'text-gray-700' : 'text-slate-300'}`}>GOOGLE PARTNER</span>
              </div>
              <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border hover:border-[#9d027c] hover:shadow-md transition-all cursor-default ${
                isLightSurface ? 'bg-white border-gray-200' : 'bg-slate-900 border-slate-800'
              }`}>
                <svg className="w-5 h-5 text-emerald-500 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>
                <span className={`text-xs font-bold tracking-wider ${isLightSurface ? 'text-gray-700' : 'text-slate-300'}`}>TIKTOK PARTNER</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className={`pt-6 pb-8 border-t flex flex-col md:flex-row items-center justify-between gap-6 transition-colors duration-300 ${
          isLightSurface ? 'border-gray-200' : 'border-slate-800'
        }`}>
          <p className={`text-xs font-medium text-center md:text-left rtl:md:text-right ${isLightSurface ? 'text-gray-400' : 'text-slate-500'}`}>
            {t.footer.rights}
          </p>

          <div className="flex flex-wrap justify-center items-center gap-2">
            {[
              { id: 'visa', src: '/custom-icons/visa.png', name: 'فيزا' },
              { id: 'mastercard', src: '/custom-icons/mastercard.png', name: 'ماستركارد' },
              { id: 'paypal', src: '/custom-icons/paypal.png', name: 'باي بال' },
              { id: 'meeza', src: '/custom-icons/meeza.png', name: 'ميزة' },
              { id: 'fawry', src: '/custom-icons/fawry.png', name: 'فوري' },
              { id: 'instapay', src: '/custom-icons/instapay.png', name: 'انستا باي' },
              { id: 'wallet', src: '/custom-icons/wallet.png', name: 'محفظة إلكترونية' },
              { id: 'bank', src: '/custom-icons/bank.png', name: 'تحويل بنكي' }
            ].map((method) => (
              <div key={method.id} className="w-14 h-10 bg-white rounded-lg flex items-center justify-center p-1.5 shadow-sm hover:scale-110 transition-transform cursor-pointer overflow-hidden border border-gray-100" title={method.name}>
                <img
                  src={method.src}
                  alt={method.name}
                  className={`max-w-full max-h-full object-contain mix-blend-multiply ${(method.id === 'instapay' || method.id === 'meeza') ? 'scale-[2]' : ''
                    }`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

