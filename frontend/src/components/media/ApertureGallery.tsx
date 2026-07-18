import { useState } from "react";
import { PORTFOLIO } from "./data";
import { Camera, ChevronRight, ChevronLeft, Eye } from "lucide-react";
import type { PublicMediaItem } from "../MediaServicePage";
import { publicDriveUrl } from "../../lib/siteApi";

interface ApertureGalleryProps {
  isAr: boolean;
  items?: PublicMediaItem[];
}

export default function ApertureGallery({ isAr, items = [] }: ApertureGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const cmsPortfolio = items.map((item, index) => ({
    id: String(item.id || index),
    titleAr: item.titleAr || item.originalName || item.driveName || `لقطة ${index + 1}`,
    titleEn: item.titleEn || item.originalName || item.driveName || `Shot ${index + 1}`,
    categoryAr: "لقطات من الكاميرا",
    categoryEn: "Camera shot",
    imageUrl: publicDriveUrl(item.fileId, item.thumbnailUrl || item.url),
    year: "2026",
    clientAr: "Select",
    clientEn: "Select",
    type: "photo" as const,
  })).filter(item => item.imageUrl);
  const galleryItems = cmsPortfolio.length ? cmsPortfolio : PORTFOLIO;
  const safeIndex = Math.min(selectedIndex, galleryItems.length - 1);
  const currentItem = galleryItems[safeIndex];

  // Specific Aperture f-values assigned to match each portfolio item's spirit
  const fStops = ["f/1.2", "f/1.4", "f/1.8", "f/2.2", "f/2.8", "f/4.0"];

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1));
  };

  return (
    <section id="gallery" className="relative bg-slate-900/40 py-24 px-6 lg:px-20 overflow-hidden border-b border-media-slate-100">
      
      {/* Absolute background visual grid lines simulating camera guidelines */}
      <div className="absolute inset-0 opacity-70 pointer-events-none select-none">
        <div className="absolute top-1/4 bottom-1/4 left-0 right-0 border-y border-media-slate-100" />
        <div className="absolute left-1/4 right-1/4 top-0 bottom-0 border-x border-media-slate-100" />
      </div>

      <div className="max-w-4xl mx-auto text-center mb-16 relative z-10 flex flex-col items-center">
        <h2 className="text-[clamp(1.9rem,4vw,3rem)] font-black leading-[1.18] tracking-normal text-white relative mb-2">
          <span className="bg-gradient-to-r from-media-slate-950 via-media-slate-800 to-media-pink-600 bg-clip-text text-transparent">
            {isAr ? "لقطات تثبت قيمة المنتج" : "Product shots built to sell the detail"}
          </span>
        </h2>
        
        {/* Decorative dynamic double line */}
        <div className="w-24 h-[3px] bg-gradient-to-r from-media-pink-500 to-media-amber-500 rounded-full mt-1 mb-4" />

        <p className="text-media-slate-500 mt-2 max-w-2xl mx-auto text-sm md:text-[15px] leading-relaxed font-semibold">
          {isAr
            ? "استعرض نماذج تصوير توضّح الخامة، الاستخدام، الحجم، والتفاصيل التي يحتاجها العميل قبل قرار الشراء."
            : "Browse photography samples that show material, use, scale, and the details customers need before buying."}
        </p>
      </div>

      {/* Main Beautiful Lens Board */}
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center relative z-10">
        
        {/* THE MASTER LENS COMPONENT */}
        <div className="relative group select-none">
          
          {/* Subtle outer lens ring shadow/glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-media-pink-500 to-media-amber-500 opacity-15 blur-2xl group-hover:opacity-25 transition-opacity duration-700" />

          {/* Master Physical Lens Ring barrel */}
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full border-[10px] sm:border-[14px] border-media-slate-900 bg-media-slate-950 shadow-2xl flex items-center justify-center overflow-hidden ring-4 ring-media-slate-200">
            
            {/* Outer Lens writing specs ring details */}
            <div className="absolute inset-2 border border-media-slate-800/80 rounded-full flex items-center justify-center pointer-events-none z-20">
              <span className="absolute top-1 text-[7px] sm:text-[9px] font-mono tracking-[0.25em] text-media-slate-500 uppercase">
                SC MARKETING PRIME PHOTO LENS • 50mm
              </span>
              <span className="absolute bottom-1 text-[7px] sm:text-[9px] font-mono tracking-[0.25em] text-media-pink-500 font-bold uppercase">
                {fStops[selectedIndex]} APO-ULTRALUX
              </span>
            </div>

            {/* Simulated camera grid marks (autofocus markers) */}
            <div className="absolute inset-8 sm:inset-12 border border-dashed border-white/10 rounded-full pointer-events-none z-20" />
            
            {/* Focal screen coordinates target marks */}
            <div className="absolute z-20 inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 border border-emerald-500/30 rounded-xs flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              </div>
            </div>

            {/* Dynamic Glass reflection shine overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/15 pointer-events-none z-10 mix-blend-overlay" />
            
            {/* The Lens Opening containing the Active Image */}
            <div className="w-full h-full p-2.5 sm:p-4 rounded-full overflow-hidden">
              <div className="w-full h-full rounded-full overflow-hidden relative">
                
                <img
                  src={currentItem.imageUrl}
                  alt={isAr ? currentItem.titleAr : currentItem.titleEn}
                  className="w-full h-full object-cover rounded-full scale-102 transition-transform duration-700 ease-out group-hover:scale-108"
                  key={currentItem.id} // Retrigger animation
                  referrerPolicy="no-referrer"
                />

                {/* Dark vignette to center focus */}
                <div className="absolute inset-0 bg-radial-[circle_at_center,_transparent_45%,_rgba(2,6,23,0.8)_100%] pointer-events-none" />
                
                {/* Micro reflection spots */}
                <div className="absolute top-10 left-12 w-16 h-16 rounded-full bg-cyan-400/10 blur-xl pointer-events-none" />
                <div className="absolute bottom-14 right-16 w-20 h-20 rounded-full bg-violet-500/10 blur-xl pointer-events-none" />
              </div>
            </div>

          </div>

          {/* Left/Right Absolute camera bezel navigations */}
          <button 
            onClick={handlePrev}
            className="absolute left-[-20px] sm:left-[-35px] top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-slate-900/40 border border-media-slate-200 hover:border-media-pink-500 text-media-slate-800 flex items-center justify-center shadow-md transition-all hover:scale-110 z-30 cursor-pointer active:scale-95"
            aria-label="Previous Project"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 hover:text-media-pink-600 transition-colors" />
          </button>

          <button 
            onClick={handleNext}
            className="absolute right-[-20px] sm:right-[-35px] top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-slate-900/40 border border-media-slate-200 hover:border-media-pink-500 text-media-slate-800 flex items-center justify-center shadow-md transition-all hover:scale-110 z-30 cursor-pointer active:scale-95"
            aria-label="Next Project"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 hover:text-media-pink-600 transition-colors" />
          </button>

        </div>

        {/* ACTIVE PROJECT INFO BLOCK - EXTREMELY CLEAN (Title, Client and Type Only as requested!) */}
        <div className="mt-10 text-center max-w-md mx-auto">
          <h3 className="mt-4 text-xl font-black leading-[1.2] tracking-normal text-white transition-all duration-300 sm:text-2xl">
            {isAr ? currentItem.titleAr : currentItem.titleEn}
          </h3>
          <p className="text-media-slate-600 text-sm mt-2 font-medium">
            {isAr ? `العميل: ${currentItem.clientAr}` : `Client: ${currentItem.clientEn}`}
          </p>
        </div>

        {/* ELEGANT MINI-THUMBNAV FILMSTRIP SLIDES - Zero clutter, pure visual click mapping */}
        <div className="mt-8 flex justify-center items-center gap-2.5 sm:gap-3 flex-wrap">
          {galleryItems.map((item, idx) => {
            const isSelected = idx === safeIndex;

            return (
              <button
                key={item.id}
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
                  isSelected 
                    ? "border-media-pink-500 scale-110 shadow-lg ring-2 ring-media-pink-500/25" 
                    : "border-media-slate-200 hover:border-media-slate-400 opacity-80 hover:opacity-100"
                }`}
                aria-label={`View item ${idx + 1}`}
              >
                <img
                  src={item.imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute inset-0 transition-all ${isSelected ? "bg-transparent" : "bg-slate-900/40"}`} />
              </button>
            );
          })}
        </div>

      </div>

    </section>
  );
}
