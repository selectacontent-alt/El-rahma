"use client";

import type { CSSProperties } from "react";
import type { Language } from "../types";

interface TechnologyPhoneShowcaseProps {
  lang: Language;
}

type BrandIcon = {
  name: string;
  src: string;
};

type MarqueeLaneProps = {
  label: string;
  icons: readonly BrandIcon[];
  direction: "left" | "right";
  accent: "social" | "programming" | "ai";
  duration: number;
};

const socialIcons: readonly BrandIcon[] = [
  { name: "Meta", src: "/technology-phone/social/meta.png" },
  { name: "Facebook", src: "/technology-phone/social/facebook.svg" },
  { name: "Google", src: "/technology-phone/social/google.svg" },
  { name: "Instagram", src: "/technology-phone/social/instagram.png" },
  { name: "TikTok", src: "/technology-phone/social/tiktok.png" },
  { name: "YouTube", src: "/technology-phone/social/youtube.svg" },
  { name: "WhatsApp", src: "/technology-phone/social/whatsapp.png" },
  { name: "Snapchat", src: "/technology-phone/social/snapchat.png" },
  { name: "X", src: "/technology-phone/social/x.png" },
];

const programmingIcons: readonly BrandIcon[] = [
  { name: "JavaScript", src: "/technology-phone/programming/javascript.svg" },
  { name: "TypeScript", src: "/technology-phone/programming/typescript.svg" },
  { name: "Python", src: "/technology-phone/programming/python.svg" },
  { name: "PHP", src: "/technology-phone/programming/php.svg" },
  { name: "Java", src: "/technology-phone/programming/java.svg" },
  { name: "C", src: "/technology-phone/programming/c.svg" },
  { name: "C++", src: "/technology-phone/programming/cplusplus.svg" },
  { name: "C#", src: "/technology-phone/programming/csharp.svg" },
  { name: "Go", src: "/technology-phone/programming/go.svg" },
  { name: "Rust", src: "/technology-phone/programming/rust.svg" },
  { name: "Kotlin", src: "/technology-phone/programming/kotlin.svg" },
  { name: "Swift", src: "/technology-phone/programming/swift.svg" },
  { name: "Dart", src: "/technology-phone/programming/dart.svg" },
  { name: "HTML5", src: "/technology-phone/programming/html5.svg" },
  { name: "CSS3", src: "/technology-phone/programming/css3.svg" },
];

const aiIcons: readonly BrandIcon[] = [
  { name: "ChatGPT", src: "/technology-phone/ai/openai.svg" },
  { name: "Claude", src: "/technology-phone/ai/claude.svg" },
  { name: "Gemini", src: "/technology-phone/ai/gemini.svg" },
  { name: "Microsoft Copilot", src: "/technology-phone/ai/copilot.svg" },
  { name: "Perplexity", src: "/technology-phone/ai/perplexity.svg" },
  { name: "Midjourney", src: "/technology-phone/ai/midjourney.svg" },
  { name: "DeepSeek", src: "/technology-phone/ai/deepseek.svg" },
  { name: "Hugging Face", src: "/technology-phone/ai/hugging-face.svg" },
];

function MarqueeGroup({ icons, duplicate }: { icons: readonly BrandIcon[]; duplicate: boolean }) {
  return (
    <div
      className={`technology-phone-track-group${duplicate ? " technology-phone-track-group--duplicate" : ""}`}
      aria-hidden={duplicate || undefined}
    >
      {icons.map((icon) => (
        <span className="technology-phone-icon-tile" key={`${icon.name}-${duplicate ? "copy" : "main"}`}>
          <img
            src={icon.src}
            alt={duplicate ? "" : icon.name}
            width={36}
            height={36}
            draggable={false}
            decoding="async"
          />
        </span>
      ))}
    </div>
  );
}

function MarqueeLane({ label, icons, direction, accent, duration }: MarqueeLaneProps) {
  const marqueeStyle = {
    "--technology-phone-duration": `${duration}s`,
  } as CSSProperties;

  return (
    <div
      className={`technology-phone-lane technology-phone-lane--${accent}`}
      aria-label={label}
    >
      <span className="sr-only">{label}</span>

      <div className="technology-phone-marquee-mask">
        <div
          className={`technology-phone-marquee technology-phone-marquee--${direction}`}
          style={marqueeStyle}
          dir="ltr"
        >
          <MarqueeGroup icons={icons} duplicate={false} />
          <MarqueeGroup icons={icons} duplicate />
        </div>
      </div>
    </div>
  );
}

export default function TechnologyPhoneShowcase({ lang }: TechnologyPhoneShowcaseProps) {
  const isArabic = lang === "ar";

  return (
    <figure
      className="technology-phone-stage relative mt-10 flex min-h-[460px] w-full items-center justify-center lg:col-span-6 lg:mt-0 lg:min-h-[560px]"
      dir="ltr"
    >
      <figcaption className="sr-only">
        {isArabic
          ? "هاتف يعرض منصات التواصل ولغات البرمجة وأدوات الذكاء الاصطناعي"
          : "A phone showcasing social platforms, programming languages, and artificial intelligence tools"}
      </figcaption>

      <div className="technology-phone-halo technology-phone-halo--purple" aria-hidden="true" />
      <div className="technology-phone-halo technology-phone-halo--yellow" aria-hidden="true" />
      <div className="technology-phone-orbit technology-phone-orbit--one" aria-hidden="true" />
      <div className="technology-phone-orbit technology-phone-orbit--two" aria-hidden="true" />
      <span className="technology-phone-particle technology-phone-particle--one" aria-hidden="true" />
      <span className="technology-phone-particle technology-phone-particle--two" aria-hidden="true" />
      <span className="technology-phone-particle technology-phone-particle--three" aria-hidden="true" />

      <div className="technology-phone-float">
        <div className="technology-phone-ground-shadow" aria-hidden="true" />
        <span className="technology-phone-side-button technology-phone-side-button--left" aria-hidden="true" />
        <span className="technology-phone-side-button technology-phone-side-button--right-top" aria-hidden="true" />
        <span className="technology-phone-side-button technology-phone-side-button--right-bottom" aria-hidden="true" />

        <div className="technology-phone-shell">
          <div className="technology-phone-bezel">
            <div className="technology-phone-screen">
              <div className="technology-phone-speaker" aria-hidden="true">
                <span />
              </div>

              <div className="technology-phone-content">
                <div className="technology-phone-logo-zone">
                  <div className="technology-phone-logo-card">
                    <object
                      type="image/svg+xml"
                      data="/animated-s-logo.svg"
                      aria-label="Select"
                      tabIndex={-1}
                    />
                  </div>
                </div>

                <div className="technology-phone-lanes">
                  <MarqueeLane
                    label={isArabic ? "منصات التواصل الاجتماعي" : "Social media platforms"}
                    icons={socialIcons}
                    direction="left"
                    accent="social"
                    duration={22}
                  />
                  <MarqueeLane
                    label={isArabic ? "لغات البرمجة" : "Programming languages"}
                    icons={programmingIcons}
                    direction="right"
                    accent="programming"
                    duration={34}
                  />
                  <MarqueeLane
                    label={isArabic ? "أدوات الذكاء الاصطناعي" : "Artificial intelligence tools"}
                    icons={aiIcons}
                    direction="left"
                    accent="ai"
                    duration={24}
                  />
                </div>
              </div>

              <div className="technology-phone-screen-protector" aria-hidden="true" />
              <span className="technology-phone-home-indicator" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .technology-phone-stage {
          isolation: isolate;
          perspective: 1400px;
        }

        .technology-phone-halo {
          position: absolute;
          border-radius: 999px;
          filter: blur(10px);
          pointer-events: none;
          z-index: -4;
        }

        .technology-phone-halo--purple {
          width: min(86vw, 390px);
          height: min(86vw, 390px);
          background: radial-gradient(circle, rgba(157, 2, 124, 0.24), rgba(157, 2, 124, 0.04) 56%, transparent 72%);
        }

        .technology-phone-halo--yellow {
          width: 210px;
          height: 210px;
          right: 8%;
          bottom: 4%;
          background: radial-gradient(circle, rgba(255, 188, 1, 0.18), transparent 70%);
        }

        .technology-phone-orbit {
          position: absolute;
          left: 50%;
          top: 50%;
          border: 1px solid rgba(157, 2, 124, 0.12);
          border-radius: 50%;
          pointer-events: none;
          z-index: -3;
        }

        .technology-phone-orbit--one {
          width: min(96vw, 440px);
          height: min(68vw, 310px);
          transform: translate(-50%, -50%) rotate(-18deg);
        }

        .technology-phone-orbit--two {
          width: min(76vw, 350px);
          height: min(106vw, 490px);
          transform: translate(-50%, -50%) rotate(14deg);
          border-color: rgba(255, 188, 1, 0.14);
        }

        .technology-phone-particle {
          position: absolute;
          display: block;
          border-radius: 999px;
          pointer-events: none;
          box-shadow: 0 0 18px currentColor;
          animation: technologyPhoneParticle 5.5s ease-in-out infinite;
          z-index: -1;
        }

        .technology-phone-particle--one {
          width: 8px;
          height: 8px;
          top: 13%;
          right: 13%;
          color: #9d027c;
          background: currentColor;
        }

        .technology-phone-particle--two {
          width: 6px;
          height: 6px;
          bottom: 18%;
          left: 13%;
          color: #ffbc01;
          background: currentColor;
          animation-delay: -1.7s;
        }

        .technology-phone-particle--three {
          width: 5px;
          height: 5px;
          top: 34%;
          left: 8%;
          color: #9d027c;
          background: currentColor;
          animation-delay: -3.1s;
        }

        .technology-phone-float {
          position: relative;
          width: min(78vw, 277px);
          aspect-ratio: 9.35 / 16.35;
          animation: technologyPhoneFloat 7s ease-in-out infinite;
          transform-origin: 50% 50%;
          transform-style: preserve-3d;
        }

        .technology-phone-ground-shadow {
          position: absolute;
          left: 50%;
          bottom: -17px;
          width: 78%;
          height: 24px;
          transform: translateX(-50%);
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(15, 23, 42, 0.35), rgba(157, 2, 124, 0.13) 45%, transparent 72%);
          filter: blur(7px);
          z-index: -1;
        }

        .technology-phone-shell {
          position: relative;
          width: 100%;
          height: 100%;
          padding: 3px;
          overflow: visible;
          border-radius: clamp(38px, 11vw, 52px);
          background: transparent;
          border: 3px solid #aeb8c7;
          box-shadow:
            0 32px 55px rgba(15, 23, 42, 0.24),
            0 12px 22px rgba(157, 2, 124, 0.15),
            inset 1px 1px 2px rgba(255, 255, 255, 0.95),
            inset -1px -1px 2px rgba(15, 23, 42, 0.8);
        }

        .technology-phone-shell::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 0 36%, rgba(255, 255, 255, 0.52) 45%, transparent 53% 100%);
          transform: translateX(-105%);
          animation: technologyPhoneSheen 7.5s ease-in-out infinite 1.2s;
          pointer-events: none;
          z-index: 5;
        }

        .technology-phone-bezel {
          width: 100%;
          height: 100%;
          padding: 0;
          border-radius: clamp(34px, 10vw, 48px);
          background: transparent;
          border: 5px solid #050609;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);
        }

        .technology-phone-screen {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: clamp(29px, 8.8vw, 40px);
          background: transparent;
          box-shadow: none;
        }

        .technology-phone-screen-protector {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 8;
          overflow: hidden;
          border-radius: inherit;
          border: 1px solid rgba(255, 255, 255, 0.36);
          background:
            linear-gradient(116deg, rgba(255, 255, 255, 0.19) 0%, rgba(255, 255, 255, 0.055) 17%, transparent 35% 68%, rgba(255, 255, 255, 0.06) 100%),
            linear-gradient(180deg, rgba(255, 255, 255, 0.08), transparent 22% 76%, rgba(157, 2, 124, 0.035));
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.34),
            inset 0 -16px 28px rgba(157, 2, 124, 0.06),
            inset 0 0 22px rgba(255, 255, 255, 0.04);
          pointer-events: none;
        }

        .technology-phone-screen-protector::before {
          content: "";
          position: absolute;
          left: -23%;
          top: 7%;
          width: 146%;
          height: 7%;
          transform: rotate(-18deg);
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.34) 46%, transparent 58%);
          opacity: 0.72;
          animation: technologyPhoneProtectorSheen 8s ease-in-out infinite;
          pointer-events: none;
        }

        .technology-phone-screen-protector::after {
          content: "";
          position: absolute;
          inset: 5px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: calc(clamp(29px, 8.8vw, 40px) - 5px);
          pointer-events: none;
        }

        .technology-phone-speaker {
          position: absolute;
          top: 10px;
          left: 50%;
          width: 63px;
          height: 15px;
          transform: translateX(-50%);
          border-radius: 999px;
          background: #020204;
          border: 1px solid rgba(255, 255, 255, 0.07);
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.95), 0 1px 0 rgba(255, 255, 255, 0.05);
          z-index: 9;
        }

        .technology-phone-speaker::before {
          content: "";
          position: absolute;
          left: 19px;
          top: 6px;
          width: 24px;
          height: 3px;
          border-radius: 999px;
          background: #181c24;
          box-shadow: inset 0 0 2px #000;
        }

        .technology-phone-speaker span {
          position: absolute;
          right: 7px;
          top: 5px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #253b62, #05070b 70%);
          box-shadow: 0 0 4px rgba(59, 130, 246, 0.45);
        }

        .technology-phone-content {
          position: absolute;
          inset: 31px 0 22px;
          display: flex;
          min-height: 0;
          flex-direction: column;
          z-index: 2;
        }

        .technology-phone-logo-zone {
          position: relative;
          display: flex;
          min-height: 0;
          flex: 1 1 auto;
          align-items: center;
          justify-content: center;
          padding: 12px 0 10px;
        }

        .technology-phone-logo-card {
          position: relative;
          display: grid;
          width: clamp(76px, 14vw, 112px);
          aspect-ratio: 17 / 27;
          place-items: center;
          background: transparent;
          z-index: 1;
        }

        .technology-phone-logo-card object {
          display: block;
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 5px 8px rgba(157, 2, 124, 0.2));
          pointer-events: none;
        }

        .technology-phone-lanes {
          flex: 0 0 auto;
          border-top: 1px solid rgba(255, 255, 255, 0.13);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          background: transparent;
          box-shadow: none;
        }

        .technology-phone-lane {
          --technology-phone-accent: 157, 2, 124;
          position: relative;
          height: clamp(64px, 10.5vw, 78px);
          display: flex;
          align-items: center;
          overflow: visible;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .technology-phone-lane:last-child {
          border-bottom: 0;
        }

        .technology-phone-lane--programming {
          --technology-phone-accent: 14, 165, 233;
        }

        .technology-phone-lane--ai {
          --technology-phone-accent: 255, 188, 1;
        }

        .technology-phone-marquee-mask {
          width: 100%;
          overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 10%, #000 90%, transparent 100%);
          mask-image: linear-gradient(90deg, transparent 0%, #000 10%, #000 90%, transparent 100%);
        }

        .technology-phone-marquee {
          display: flex;
          width: max-content;
          align-items: center;
          transform: translate3d(0, 0, 0);
          will-change: transform;
          animation-duration: var(--technology-phone-duration);
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .technology-phone-marquee--left {
          animation-name: technologyPhoneMarqueeLeft;
        }

        .technology-phone-marquee--right {
          animation-name: technologyPhoneMarqueeRight;
        }

        .technology-phone-track-group {
          display: flex;
          min-width: max-content;
          flex: 0 0 auto;
          align-items: center;
          gap: 12px;
          padding-inline-end: 12px;
        }

        .technology-phone-icon-tile {
          display: grid;
          width: clamp(40px, 8vw, 48px);
          height: clamp(40px, 8vw, 48px);
          flex: 0 0 auto;
          place-items: center;
          background: transparent;
          transition: transform 220ms ease;
        }

        .technology-phone-icon-tile img {
          width: 72%;
          height: 72%;
          object-fit: contain;
          user-select: none;
        }

        .technology-phone-lane:hover .technology-phone-icon-tile {
          transform: translateY(-1px);
        }

        .technology-phone-home-indicator {
          position: absolute;
          bottom: 8px;
          left: 50%;
          width: 34%;
          height: 4px;
          transform: translateX(-50%);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.65);
          box-shadow: 0 0 7px rgba(255, 255, 255, 0.12);
          z-index: 9;
        }

        .technology-phone-side-button {
          position: absolute;
          width: 3px;
          border: 1px solid rgba(255, 255, 255, 0.45);
          background: linear-gradient(to right, #1f2937, #d1d5db 48%, #374151);
          box-shadow: 1px 2px 5px rgba(15, 23, 42, 0.32);
          z-index: -1;
        }

        .technology-phone-side-button--left {
          left: -2px;
          top: 22%;
          height: 47px;
          border-radius: 4px 0 0 4px;
        }

        .technology-phone-side-button--right-top {
          right: -2px;
          top: 19%;
          height: 31px;
          border-radius: 0 4px 4px 0;
        }

        .technology-phone-side-button--right-bottom {
          right: -2px;
          top: 29%;
          height: 58px;
          border-radius: 0 4px 4px 0;
        }

        .technology-phone-stage:hover .technology-phone-marquee,
        .technology-phone-stage:hover .technology-phone-float {
          animation-play-state: paused;
        }

        @keyframes technologyPhoneMarqueeLeft {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }

        @keyframes technologyPhoneMarqueeRight {
          from { transform: translate3d(-50%, 0, 0); }
          to { transform: translate3d(0, 0, 0); }
        }

        @keyframes technologyPhoneFloat {
          0%, 100% { transform: translate3d(0, 0, 0) rotateX(0deg) rotateY(9deg); }
          50% { transform: translate3d(0, -8px, 0) rotateX(0.4deg) rotateY(6deg); }
        }

        @keyframes technologyPhoneParticle {
          0%, 100% { transform: translateY(0) scale(0.82); opacity: 0.5; }
          50% { transform: translateY(-11px) scale(1.12); opacity: 1; }
        }

        @keyframes technologyPhoneLogoPulse {
          0%, 100% { transform: scale(0.92); opacity: 0.68; }
          50% { transform: scale(1.08); opacity: 1; }
        }

        @keyframes technologyPhoneSheen {
          0%, 58% { transform: translateX(-105%); opacity: 0; }
          67% { opacity: 0.72; }
          82%, 100% { transform: translateX(110%); opacity: 0; }
        }

        @keyframes technologyPhoneProtectorSheen {
          0%, 58% { transform: translateX(-32%) rotate(-18deg); opacity: 0; }
          68% { opacity: 0.72; }
          84%, 100% { transform: translateX(32%) rotate(-18deg); opacity: 0; }
        }

        @media (min-width: 640px) {
          .technology-phone-float {
            width: 299px;
          }
        }

        @media (min-width: 1024px) {
          .technology-phone-float {
            width: 309px;
          }
        }

        @media (min-width: 1280px) {
          .technology-phone-float {
            width: 318px;
          }
        }

        @media (max-width: 359px) {
          .technology-phone-stage {
            min-height: 440px;
          }

          .technology-phone-float {
            width: min(76vw, 239px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .technology-phone-float,
          .technology-phone-particle,
          .technology-phone-shell::before,
          .technology-phone-screen-protector::before {
            animation: none !important;
          }

          .technology-phone-marquee {
            animation: none !important;
            transform: none !important;
          }

          .technology-phone-track-group--duplicate {
            display: none;
          }

          .technology-phone-marquee-mask {
            overflow-x: auto;
            overscroll-behavior-inline: contain;
            scrollbar-width: thin;
            -webkit-mask-image: none;
            mask-image: none;
          }

        }
      `}</style>
    </figure>
  );
}
