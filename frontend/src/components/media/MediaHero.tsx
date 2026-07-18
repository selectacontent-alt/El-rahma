import { useEffect, useMemo, useState } from "react";
import { Camera, Film, Heart, MessageCircle, Music, Share2, Zap } from "lucide-react";
import type { PublicMediaItem } from "../MediaServicePage";
import { publicDriveUrl } from "../../lib/siteApi";

interface MediaHeroProps {
  isAr: boolean;
  onLanguageToggle: () => void;
  reels?: PublicMediaItem[];
}

const fallbackFrames: PublicMediaItem[] = [
  {
    id: "fallback-fashion",
    titleAr: "ريلز جاهزة للإعلانات",
    titleEn: "Ad-ready reels",
    url: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=500&q=85",
    type: "image",
  },
  {
    id: "fallback-color",
    titleAr: "ألوان تعكس شخصية العلامة",
    titleEn: "Brand-led color grading",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=85",
    type: "image",
  },
  {
    id: "fallback-food",
    titleAr: "صوت وحركة تخدم الرسالة",
    titleEn: "Motion and sound with purpose",
    url: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=500&q=85",
    type: "image",
  },
  {
    id: "fallback-aerial",
    titleAr: "لقطات تشرح المكان والمنتج",
    titleEn: "Shots that explain place and product",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=85",
    type: "image",
  },
];

function isVideo(item: PublicMediaItem) {
  return item.mimeType?.startsWith("video/") || item.type === "video";
}

function ReelFrame({ item, isAr }: { item: PublicMediaItem; isAr: boolean }) {
  const src = isVideo(item)
    ? item.url || publicDriveUrl(item.fileId, item.thumbnailUrl)
    : publicDriveUrl(item.fileId, item.thumbnailUrl || item.url);
  const title = isAr ? item.titleAr || item.titleEn : item.titleEn || item.titleAr;

  return (
    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[24px] border border-media-purple-500/40 bg-black/70 shadow-[0_18px_45px_rgba(15,23,42,0.35)]">
      {isVideo(item) ? (
        <video
          src={src}
          className="h-full w-full object-cover brightness-95"
          muted
          loop
          autoPlay
          playsInline
          onMouseEnter={event => event.currentTarget.pause()}
          onMouseLeave={event => event.currentTarget.play().catch(() => undefined)}
        />
      ) : (
        <img src={src} alt={title || "Reel"} className="h-full w-full object-cover brightness-95" referrerPolicy="no-referrer" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-media-slate-950/90 via-transparent to-transparent" />
      <div className="absolute bottom-3 left-3 right-8 text-right">
        <span className="inline-block rounded border border-media-purple-500/30 bg-media-purple-900/90 px-2 py-0.5 text-[9px] font-black text-white shadow-sm sm:text-[11px]">
          {title || (isAr ? "ريل من Drive" : "Drive reel")}
        </span>
        {item.driveName && (
          <div className="mt-1 truncate text-[7.5px] font-medium text-media-slate-300 sm:text-[8.5px]">
            {item.driveName}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MediaHero({ isAr, onLanguageToggle, reels = [] }: MediaHeroProps) {
  void onLanguageToggle;
  const [shutterCount, setShutterCount] = useState(1);
  const frames = useMemo(() => (reels.length ? reels : fallbackFrames), [reels]);
  const filmFrames = useMemo(() => [...frames, ...frames], [frames]);

  useEffect(() => {
    const target = 247;
    let current = 0;
    const interval = window.setInterval(() => {
      current += Math.ceil((target - current) / 15);
      if (current >= target) {
        current = target;
        window.clearInterval(interval);
      }
      setShutterCount(current);
    }, 40);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-slate-900/40 px-6 py-16 text-slate-950 lg:px-20">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scrollFilmTapeDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0%); }
        }
        .animate-film-scroll-down-rapid {
          animation: scrollFilmTapeDown 16s linear infinite;
        }
        .media-reel-chassis:hover .animate-film-scroll-down-rapid {
          animation-play-state: paused;
        }
      ` }} />

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div className={`order-2 flex flex-col space-y-6 lg:order-1 lg:col-span-7 ${isAr ? "text-right" : "text-left"}`}>
          <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-media-rose-200 bg-white/80 px-3 py-2 text-xs font-black text-media-rose-700 shadow-sm">
            <Film className="h-4 w-4" />
            <span>{isAr ? "إنتاج محتوى تجاري جاهز للنشر" : "Commercial content ready for launch"}</span>
          </div>

          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-[1.18] tracking-normal text-black">
            {isAr ? (
              <>
                محتوى مرئي <span className="bg-gradient-to-r from-media-pink-600 via-media-rose-500 to-media-amber-500 bg-clip-text text-transparent">يبني الثقة ويدفع للشراء</span>
              </>
            ) : (
              <>
                Visual content <span className="bg-gradient-to-r from-media-pink-600 via-media-rose-500 to-media-amber-500 bg-clip-text text-transparent">that builds trust and drives action</span>
              </>
            )}
          </h1>

          <p className="max-w-2xl text-base font-medium leading-8 text-media-slate-600 md:text-lg">
            {isAr
              ? "ننتج صوراً وفيديوهات مبنية على هدف الحملة: شرح المنتج، رفع الثقة، وتجهيز مواد تصلح للإعلانات والسوشيال والموقع."
              : "We produce photo and video assets around campaign goals: explain the product, build trust, and prepare material for ads, social, and the website."}
          </p>

          <div className="grid max-w-xl grid-cols-3 gap-3">
            {[
              { icon: Camera, label: isAr ? "لقطة" : "Shots", value: `${Math.max(frames.length, 4)}+` },
              { icon: Zap, label: isAr ? "مشروع" : "Projects", value: `${shutterCount}+` },
              { icon: Film, label: isAr ? "ريلز" : "Reels", value: reels.length ? `${reels.length}` : "Drive" },
            ].map(item => (
              <div key={item.label} className="rounded-lg border border-media-slate-200 bg-white/80 p-4 shadow-sm">
                <item.icon className="mb-3 h-5 w-5 text-media-rose-600" />
                <strong className="block text-xl font-black text-media-slate-950">{item.value}</strong>
                <span className="text-xs font-bold text-media-slate-500">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="flex w-full flex-wrap gap-4 pt-2">
            <a href="#pricing" className="flex-1 rounded-xl bg-gradient-to-r from-media-pink-600 via-media-rose-500 to-media-amber-500 px-8 py-4 text-center font-bold text-white shadow-lg shadow-media-pink-500/20 transition-all hover:shadow-media-pink-500/35 sm:flex-initial">
              {isAr ? "عرض خطط الإنتاج" : "Explore production plans"}
            </a>
            <a href="#portfolio" className="flex-1 rounded-xl border border-media-slate-200 bg-media-slate-100 px-8 py-4 text-center font-bold text-media-slate-700 transition-all hover:bg-media-slate-200 sm:flex-initial">
              {isAr ? "مشاهدة نماذج الأعمال" : "Browse work samples"}
            </a>
          </div>
        </div>

        <div className="order-1 flex items-center justify-center py-8 lg:order-2 lg:col-span-5">
          <div className="media-reel-chassis relative flex h-[520px] w-64 rotate-[-4deg] flex-col overflow-hidden rounded-[34px] border border-media-purple-500/30 bg-media-slate-950 shadow-[0_0_50px_rgba(168,85,247,0.25)] transition-transform duration-700 hover:rotate-0 sm:h-[640px] sm:w-[300px] lg:h-[700px]">
            <div className="absolute inset-0 z-10 bg-[linear-gradient(to_right,#a855f70a_1px,transparent_1px),linear-gradient(to_bottom,#a855f70a_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
            <div className="absolute left-4 top-1/2 z-30 flex -translate-y-1/2 flex-col items-center gap-4 text-white drop-shadow-lg">
              <Heart className="h-6 w-6 fill-white" />
              <MessageCircle className="h-6 w-6 fill-white" />
              <Share2 className="h-6 w-6" />
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-media-purple-600 to-media-rose-500">
                <Music className="h-4 w-4" />
              </div>
            </div>
            <div className="absolute bottom-10 left-14 right-5 z-30 text-right text-white">
              <strong className="block text-sm font-black">@SC_Marketing</strong>
              <p className="mt-1 text-xs font-bold leading-tight text-white/90">
                {isAr ? "محتوى واضح وجاهز للحملة" : "Clear campaign-ready content"}
              </p>
            </div>
            <div className="relative z-20 h-full overflow-hidden px-7 py-4">
              <div className="flex w-full flex-col gap-4 animate-film-scroll-down-rapid">
                {filmFrames.map((item, index) => (
                  <ReelFrame key={`${item.id}-${index}`} item={item} isAr={isAr} />
                ))}
              </div>
            </div>
            <div className="absolute inset-x-0 top-0 z-30 h-12 bg-gradient-to-b from-media-slate-950 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 z-30 h-12 bg-gradient-to-t from-media-slate-950 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
