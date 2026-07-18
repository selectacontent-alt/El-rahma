import { useState, useRef, MouseEvent } from "react";
import { SERVICES } from "./data";
import { ServiceItem } from "./types";
import { Camera, Video, Compass, User, Sparkles, Radio, Layers, Crosshair, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

interface ServicesLensGridProps {
  isAr: boolean;
}

export default function ServicesLensGrid({ isAr }: ServicesLensGridProps) {
  // Store mouse coordinates per card for the magnifying optical distortion
  const [coords, setCoords] = useState<{ [key: string]: { x: number; y: number } }>({});
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>, cardId: string) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCoords((prev) => ({
      ...prev,
      [cardId]: { x, y }
    }));
  };

  const getIcon = (iconName: string, color: string) => {
    const props = { className: "w-6 h-6", style: { color } };
    switch (iconName) {
      case "Camera": return <Camera {...props} />;
      case "Video": return <Video {...props} />;
      case "Compass": return <Compass {...props} />;
      case "User": return <User {...props} />;
      case "Sparkles": return <Sparkles {...props} />;
      case "Layers": return <Layers {...props} />;
      case "Radio": return <Radio {...props} />;
      default: return <Camera {...props} />;
    }
  };

  // Professional Cinematography Lens telemetry custom data to give the grid an authentic creative feeling
  const getSpecsForService = (id: string) => {
    switch (id) {
      case "product-photo":
        return {
          lens: "90mm f/2.8 Macro",
          sensor: "Sony H-Res 61MP",
          lights: "Profoto 3-Point Light Grid",
          speed: "1/200s • ISO 100",
          aperture: "f/8.0 Sharp Focus"
        };
      case "portrait-headshots":
        return {
          lens: "85mm f/1.4 Portrait",
          sensor: "Medium Format GFX",
          lights: "Octabox Key + Rim light",
          speed: "1/160s • ISO 200",
          aperture: "f/1.4 Creamy Bokeh"
        };
      case "drone-aerial":
        return {
          lens: "24mm f/2.8 Ultra-Wide",
          sensor: "Hasselblad 4/3 CMOS",
          lights: "Direct Sunlight Natural Diffuse",
          speed: "1/1000s • ND16 Polarized",
          aperture: "f/4.0 Infinite Focus"
        };
      case "motion-graphics":
        return {
          lens: "CGI Rasterizer Camera",
          sensor: "Cinema 4D • Redshift",
          lights: "Volumetric Vector Lighting",
          speed: "60 FPS Vector Render",
          aperture: "Optical Motion Blur"
        };
      case "commercial-video":
        return {
          lens: "35mm f/1.8 Anamorphic",
          sensor: "ARRI Alexa Mini LF",
          lights: "Arri SkyPanel Skyset Suite",
          speed: "1/48s • shutter 180°",
          aperture: "f/2.0 Cinematic Depth"
        };
      default:
        return {
          lens: "50mm f/1.2 Prime",
          sensor: "Red V-Raptor 8K",
          lights: "Aputure LED setup",
          speed: "1/50s • ISO 800",
          aperture: "f/2.8 Sweet Spot"
        };
    }
  };

  // Helper to resolve specific grid span styles for our creative asymmetric Bento layout
  const getBentoSpanClasses = (id: string) => {
    switch (id) {
      case "product-photo":
        return "col-span-1 lg:col-span-2";
      case "portrait-headshots":
        return "col-span-1";
      case "drone-aerial":
        return "col-span-1";
      case "motion-graphics":
        return "col-span-1 lg:col-span-2";
      case "commercial-video":
        return "col-span-1 lg:col-span-3";
      default:
        return "col-span-1";
    }
  };

  return (
    <section id="services" className="relative bg-slate-900/40 py-24 px-6 lg:px-20 overflow-hidden border-b border-media-slate-100">
      
      {/* Visual Blueprint Grid & Focal Lines to represent a technical movie drafting sheet */}
      <div className="absolute inset-0 opacity-40 pointer-events-none" 
        style={{
          backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.8) 1.5px, transparent 1.5px), linear-gradient(to bottom, rgba(0,0,0,0.8) 1.5px, transparent 1.5px)",
          backgroundSize: "60px 60px"
        }}
      />
      
      {/* Decorative center reticle mark representing viewport center */}
      <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-48 h-48 border border-dashed border-media-slate-200/80 rounded-full pointer-events-none flex items-center justify-center">
        <div className="w-16 h-16 border border-dashed border-media-slate-200/80 rounded-full flex items-center justify-center">
          <Crosshair className="w-4 h-4 text-media-slate-350" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center mb-16 relative z-10 flex flex-col items-center">
        <h2 id="services-headline" className="text-[clamp(1.85rem,4vw,2.65rem)] font-black text-white tracking-normal leading-[1.22] relative mb-2 font-sans">
          <span className="bg-gradient-to-r from-media-slate-950 via-media-slate-800 to-media-rose-600 bg-clip-text text-transparent">
            {isAr ? "خدمات إنتاج تخدم هدف الحملة" : "Production Services Built for Campaign Goals"}
          </span>
        </h2>
        
        {/* Decorative line */}
        <div className="w-24 h-[3px] bg-gradient-to-r from-media-rose-500 to-media-pink-500 rounded-full mt-1 mb-4" />

        <p className="text-media-slate-500 mt-2 max-w-2xl mx-auto text-sm md:text-base leading-7 font-medium">
          {isAr
            ? "اختار بين تصوير المنتجات، البورتريه، الدرون، الموشن، والفيديو التجاري حسب نوع الرسالة التي تريد إيصالها للعميل."
            : "Choose product photography, portraits, drone shots, motion, or commercial video according to the message you need customers to understand."}
        </p>
      </div>

      {/* Stunning Bento Asymmetrical Grid */}
      <div id="services-bento-grid" className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {SERVICES.map((service, index) => {
          const cardCoord = coords[service.id] || { x: 0, y: 0 };
          const isActive = hoveredCard === service.id;
          const bentoSpan = getBentoSpanClasses(service.id);
          const specs = getSpecsForService(service.id);

          return (
            <motion.div
              id={`service-card-${service.id}`}
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              onMouseMove={(e) => handleMouseMove(e, service.id)}
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`${bentoSpan} relative bg-slate-900/40 border-2 rounded-3xl p-6 sm:p-8 overflow-hidden transition-all duration-500 flex flex-col justify-between group cursor-default min-h-[260px] ${
                isActive 
                  ? "border-media-pink-500 shadow-xl shadow-media-pink-500/5 -translate-y-1.5" 
                  : "border-[#000000]/20 shadow-sm hover:border-[#000000]/40 hover:-translate-y-0.5"
              }`}
            >
              
              {/* INTERACTIVE LASER HALO / LENS FLARE EFFECT BASED ON DYNAMIC MOUSE POSITION */}
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-500 rounded-3xl"
                style={{
                  background: isActive
                    ? `radial-gradient(350px circle at ${cardCoord.x}px ${cardCoord.y}px, ${service.accentColor}12 0%, rgba(255,255,255,0) 70%)`
                    : "none",
                  opacity: isActive ? 1 : 0,
                }}
              />

              {/* TECHNICAL CAMERA VIEWFINDER ASPECT CORNERS (Shows beautifully and glows on hover) */}
              <div 
                className={`absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 transition-all duration-500 pointer-events-none ${
                  isActive ? "border-media-pink-500 scale-110" : "border-media-slate-200"
                }`} 
              />
              <div 
                className={`absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 transition-all duration-500 pointer-events-none ${
                  isActive ? "border-media-pink-500 scale-110" : "border-media-slate-200"
                }`} 
              />
              <div 
                className={`absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 transition-all duration-500 pointer-events-none ${
                  isActive ? "border-media-pink-500 scale-110" : "border-media-slate-200"
                }`} 
              />
              <div 
                className={`absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 transition-all duration-500 pointer-events-none ${
                  isActive ? "border-media-pink-500 scale-110" : "border-media-slate-200"
                }`} 
              />

              {/* TOP HEADER: Icon + Creative Mode Specs Tag */}
              <div className="flex justify-between items-start mb-6 z-10">
                <div 
                  className={`p-3 rounded-2xl border transition-all duration-300 ${
                    isActive 
                      ? "bg-gradient-to-br from-media-pink-50 to-media-rose-50 border-media-pink-300 scale-110 text-media-pink-600" 
                      : "bg-media-slate-50/50 border-media-slate-100 text-media-slate-400 group-hover:bg-media-slate-50"
                  }`}
                  style={{
                    boxShadow: isActive ? "0 4px 15px rgba(236,72,153,0.1)" : "none"
                  }}
                >
                  {getIcon(service.icon, isActive ? "#db2777" : service.accentColor)}
                </div>
                
                {/* Vintage camera screen battery or REC mode indicator */}
                <div className="flex items-center gap-2 font-mono text-[9px] text-media-slate-400 select-none">
                  <span className={`w-2 h-2 rounded-full ${isActive ? "bg-red-500 animate-ping" : "bg-media-slate-300"}`} />
                  <span>{isActive ? "LIVE_OP" : "OP_READY"}</span>
                  <span className="hidden sm:inline border border-media-slate-100 px-1.5 py-0.5 rounded text-media-slate-500 bg-media-slate-50 font-bold">
                    SEC_0{index + 1}
                  </span>
                </div>
              </div>

              {/* CORE CONTENT LAYOUT */}
              <div className="space-y-4 z-10 flex-grow text-right mb-6">
                <h3 className={`text-lg sm:text-xl font-extrabold tracking-tight transition-colors duration-300 ${
                  isActive ? "text-media-pink-600" : "!text-black group-hover:text-media-pink-600"
                }`} style={{ color: isActive ? undefined : "#000000" }}>
                  {isAr ? service.titleAr : service.titleEn}
                </h3>
                <p className="text-media-slate-500 text-xs sm:text-sm leading-relaxed max-w-2xl mr-0">
                  {isAr ? service.descriptionAr : service.descriptionEn}
                </p>
              </div>

              {/* BOTTOM STRIP: Real Cinematic Lens Telemetry & Specs */}
              <div className="border-t border-media-slate-100 pt-4 mt-auto z-10 flex justify-between items-center flex-wrap gap-2 select-none">
                
                {/* Compact focal and lens properties displayed dynamically inline */}
                <div className="flex items-center gap-3 font-mono text-[9px] text-media-slate-400 uppercase tracking-wider">
                  <div className="flex flex-col text-left">
                    <span className="text-media-slate-400 block text-[7px] leading-tight font-extrabold">{isAr ? "العدسة" : "LENS PROFILE"}</span>
                    <span className={`transition-colors duration-300 ${isActive ? "text-white" : "text-media-slate-500"}`}>{specs.lens}</span>
                  </div>
                  <div className="w-[1px] h-6 bg-media-slate-100" />
                  <div className="flex flex-col text-left">
                    <span className="text-media-slate-400 block text-[7px] leading-tight font-extrabold">{isAr ? "المستشعر" : "SENSOR BODY"}</span>
                    <span className={`transition-colors duration-300 ${isActive ? "text-white" : "text-media-slate-500"}`}>{specs.sensor}</span>
                  </div>
                </div>

                {/* Right side showing micro details */}
                <div className="flex items-center gap-1 font-mono text-[9px] text-media-pink-600 bg-media-pink-50 px-2 py-1 rounded-md border border-media-pink-100">
                  <span className="animate-pulse">●</span>
                  <span className="text-media-slate-650 uppercase">{specs.aperture}</span>
                </div>

              </div>

            </motion.div>
          );
        })}
      </div>

    </section>
  );
}
