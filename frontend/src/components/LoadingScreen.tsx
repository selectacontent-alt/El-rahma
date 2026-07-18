"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // We should NOT show the loading screen on /social
  const isSocialPage = pathname === "/social" || pathname?.startsWith("/social/");

  useEffect(() => {
    // Only run on the very first initial mount of the website
    if (isSocialPage) {
      setIsLoading(false);
      return;
    }

    // Show loading on initial load
    setIsLoading(true);
    setIsFadingOut(false);

    // The animation inside the SVG lasts exactly 8.9 seconds (CURSOR_DELAY 2.18s + CURSOR_DURATION 6.72s)
    const fadeTimeout = setTimeout(() => {
      setIsFadingOut(true);
      // Finish loading after fade transition (500ms)
      const endTimeout = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(endTimeout);
    }, 8900);

    return () => clearTimeout(fadeTimeout);
  }, []);

  if (!isLoading || isSocialPage) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#fafafa] transition-opacity duration-500 ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Light Mode Abstract Glowing Backgrounds */}
      <div className="absolute top-1/4 left-1/4 h-[350px] w-[350px] rounded-full bg-[#9d027c]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] rounded-full bg-[#ffbc01]/5 blur-[120px] pointer-events-none" />

      {/* Animated Logo Container */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Soft light mode glow */}
        <div className="absolute inset-0 -m-10 bg-radial-gradient from-[#9d027c]/10 via-transparent to-transparent blur-3xl rounded-full animate-pulse pointer-events-none" />
        
        {/* The SVG Logo */}
        <object
          type="image/svg+xml"
          data="/logo-loading.svg"
          className="w-52 h-52 relative z-10 drop-shadow-[0_4px_20px_rgba(157,2,124,0.15)]"
          aria-label="Loading logo"
        />

        {/* Premium text indicator */}
        <div className="mt-8 relative z-10 flex flex-col items-center">
          <span className="text-sm font-bold tracking-[0.25em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#9d027c] via-[#f43f5e] to-[#ffbc01] animate-pulse">
            Select Customers
          </span>
          <div className="mt-3 h-0.5 w-16 bg-gradient-to-r from-[#9d027c] to-[#ffbc01] rounded-full opacity-60 animate-[loading-bar_1.8s_ease-in-out_infinite]" />
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { transform: scaleX(0.3); opacity: 0.3; }
          50% { transform: scaleX(1); opacity: 1; }
          100% { transform: scaleX(0.3); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
