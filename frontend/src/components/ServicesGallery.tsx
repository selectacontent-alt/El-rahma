import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Code2, Share2, Camera, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { Language } from '../types';
import type { PublicService } from '../lib/growthSite';
import { AnimatedCTA } from './BentoServices';

const ServiceShape = ({ id }: { id: string }) => {
  switch (id) {
    case 'branding':
      return (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-xl shadow-pink-500/20 border border-white/10">
          <Palette className="w-8 h-8 text-white drop-shadow-md" />
        </div>
      );
    case 'software':
      return (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-blue-500/20 border border-white/10">
          <Code2 className="w-8 h-8 text-white drop-shadow-md" />
        </div>
      );
    case 'social':
      return (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-xl shadow-orange-500/20 border border-white/10">
          <Share2 className="w-8 h-8 text-white drop-shadow-md" />
        </div>
      );
    case 'media':
      return (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/20 border border-white/10">
          <Camera className="w-8 h-8 text-white drop-shadow-md" />
        </div>
      );
    default:
      return (
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-fuchsia-600 to-violet-700 shadow-xl shadow-fuchsia-500/20">
          <Sparkles className="h-8 w-8 text-white drop-shadow-md" />
        </div>
      );
  }
};

const ServiceBackgroundIdea = ({ id, isActive }: { id: string, isActive: boolean }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
      <style>{`
        @keyframes subtleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {id === 'branding' && (
        <>
          {/* ===== DESIGN SOFTWARE MOCKUP ===== */}
          {/* Entire App Window - Scaled and anchored to top-left to avoid text overlap on mobile */}
          <div
            className="absolute left-0 md:-left-2 top-0 md:top-4 w-[260px] h-[220px] lg:w-[320px] lg:h-[280px] rounded-xl border border-white/10 bg-slate-900/90 flex flex-col overflow-hidden shadow-2xl opacity-70 transform scale-[0.85] origin-top-left md:scale-100"
            style={{ animation: 'subtleFloat 8s ease-in-out infinite' }}
          >
            {/* Top Menu Bar */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 border-b border-white/5 flex-shrink-0">
              {/* Traffic Lights */}
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
              {/* Menu Items */}
              <div className="flex gap-3 ml-3">
                {['File','Edit','Object','Type','View'].map((m, i) => (
                  <span key={m} className={`text-[7px] font-sans ${i === 0 ? 'text-slate-100' : 'text-slate-400'}`}>{m}</span>
                ))}
              </div>
            </div>

            {/* App Body */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Toolbar */}
              <div className="w-8 bg-slate-800/60 border-r border-white/5 flex flex-col items-center pt-2 gap-1.5 flex-shrink-0">
                {/* Tool Icons (abstract squares/shapes) */}
                {[
                  'bg-white/30','bg-white/20','bg-white/20',
                  'bg-white/20','bg-white/20','bg-white/20',
                  'bg-white/20','bg-white/20',
                ].map((cls, i) => (
                  <div key={i} className={`w-4 h-4 rounded-sm ${cls}`} />
                ))}
                {/* Color swatches at bottom */}
                <div className="mt-auto mb-2 flex flex-col items-center gap-1">
                  <div className="w-4 h-4 rounded-sm bg-pink-500/80 border border-white/10" />
                  <div className="w-3 h-3 rounded-sm bg-purple-500/80 border border-white/10" />
                </div>
              </div>

              {/* Main Canvas Area */}
              <div className="flex-1 bg-[#1a1a2e]/80 flex items-center justify-center relative overflow-hidden">
                {/* Canvas grid dots */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'radial-gradient(circle rgba(255,255,255,0.3) 1px transparent 1px)',
                    backgroundSize: '14px 14px',
                  }}
                />

                {/* Canvas 1: Logo being designed */}
                <div
                  className="absolute top-3 left-3 right-3 bottom-3 bg-white/5 rounded border border-white/10 flex items-center justify-center"
                >
                  {/* Social media post mockup on canvas */}
                  <div className="w-[70%] h-[70%] bg-gradient-to-br from-pink-600/30 to-purple-700/30 rounded border border-pink-400/20 flex flex-col items-center justify-center gap-2 relative">
                    {/* Logo circle */}
                    <div className="w-10 h-10 rounded-full border-[2.5px] border-pink-400/60 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-pink-400/40" />
                    </div>
                    {/* Brand name lines */}
                    <div className="w-12 h-1.5 rounded-full bg-white/30" />
                    <div className="w-8 h-1 rounded-full bg-white/20" />

                    {/* Selection handles (Illustrator style) */}
                    {[
                      'top-[-3px] left-[-3px]','top-[-3px] right-[-3px]',
                      'bottom-[-3px] left-[-3px]','bottom-[-3px] right-[-3px]',
                      'top-[-3px] left-1/2 -translate-x-1/2',
                      'bottom-[-3px] left-1/2 -translate-x-1/2',
                    ].map((pos, i) => (
                      <div
                        key={i}
                        className={`absolute w-2 h-2 bg-blue-400 border border-white rounded-[1px] ${pos}`}
                      />
                    ))}
                    {/* Dashed selection border */}
                    <div className="absolute inset-0 rounded border border-dashed border-blue-400/60" />
                  </div>
                </div>

                {/* Cursor */}
                <div
                  className="absolute bottom-6 right-8 w-[1px] h-3 bg-white/60"
                  style={{ animation: 'cursorBlink 1.2s step-end infinite' }}
                />
              </div>

              {/* Right Properties Panel */}
              <div className="w-16 bg-[#1e2030]/90 border-l border-white/10 flex flex-col pt-2 px-1.5 gap-1.5 flex-shrink-0">
                <span className="text-[6.5px] text-slate-300 font-sans uppercase tracking-widest mb-1">Properties</span>
                <div className="w-full h-[1px] bg-white/10 mb-0.5" />
                {/* Property rows */}
                {[
                  { label: 'X', val: '240' },
                  { label: 'Y', val: '180' },
                  { label: 'W', val: '320' },
                  { label: 'H', val: '320' },
                ].map(({ label, val }) => (
                  <div key={label} className="flex items-center justify-between gap-1">
                    <span className="text-[6px] text-pink-300 font-mono">{label}</span>
                    <span className="text-[6px] text-slate-100 font-mono bg-slate-700/80 px-1 py-0.5 rounded">{val}</span>
                  </div>
                ))}
                <div className="w-full h-[1px] bg-white/10 my-0.5" />
                {/* Fill & Stroke */}
                <span className="text-[6.5px] text-slate-300 font-sans">Fill</span>
                <div className="w-full h-3 rounded-sm bg-gradient-to-r from-pink-500 to-purple-500 shadow-[0_0_6px_rgba(236,72,153,0.5)]" />
                <span className="text-[6.5px] text-slate-300 font-sans">Stroke</span>
                <div className="w-full h-3 rounded-sm border border-pink-400/40 bg-transparent" />
                <div className="w-full h-[1px] bg-white/10 my-0.5" />
                <span className="text-[6.5px] text-slate-300 font-sans">Opacity</span>
                <div className="w-full h-1.5 rounded-full bg-slate-600 overflow-hidden">
                  <div className="h-full w-[85%] bg-gradient-to-r from-pink-400 to-purple-400 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {id === 'software' && (
        <>
          <style>{`
            @keyframes typeCode {
              0%   { width: 0ch; }
              100% { width: 22ch; }
            }
            @keyframes typeLine2 {
              0%, 40%  { width: 0ch; }
              100% { width: 18ch; }
            }
            @keyframes typeLine3 {
              0%, 65%  { width: 0ch; }
              100% { width: 14ch; }
            }
            @keyframes blinkCursor {
              0%, 100% { opacity: 1; }
              50%       { opacity: 0; }
            }
            @keyframes slideUp {
              0%   { transform: translateY(8px); opacity: 0; }
              100% { transform: translateY(0); opacity: 1; }
            }
          `}</style>

          {/* ===== IDE WINDOW ===== */}
          <div
            className="absolute left-0 md:-left-2 top-0 md:top-4 w-[260px] h-[220px] lg:w-[300px] lg:h-[260px] rounded-xl border border-slate-200/60 bg-white flex flex-col overflow-hidden shadow-2xl opacity-80 transform scale-[0.85] origin-top-left md:scale-100"
            style={{ animation: 'subtleFloat 9s ease-in-out infinite' }}
          >
            {/* Top tab bar */}
            <div className="flex items-center gap-0 bg-[#f3f3f3] border-b border-slate-200 flex-shrink-0">
              <div className="flex items-center gap-1.5 px-2 py-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/90" />
                <div className="w-2 h-2 rounded-full bg-yellow-400/90" />
                <div className="w-2 h-2 rounded-full bg-emerald-400/90" />
              </div>
              {/* Tabs */}
              <div className="flex text-[7px] font-mono mt-px">
                <span className="px-3 py-1.5 text-slate-700 bg-white border-t border-l border-r border-blue-400/60 -mb-px rounded-t font-semibold">main.ts</span>
                <span className="px-3 py-1.5 text-slate-400">api.ts</span>
                <span className="px-3 py-1.5 text-slate-400">config.json</span>
              </div>
            </div>

            {/* Editor body */}
            <div className="flex flex-1 overflow-hidden">
              {/* File Tree */}
              <div className="w-16 bg-[#f8f8f8] border-r border-slate-200 flex flex-col py-2 px-1.5 gap-0.5 flex-shrink-0">
                <span className="text-[6px] text-slate-400 uppercase tracking-widest font-sans mb-1">Explorer</span>
                {[
                  { name: 'src', indent: 0, isDir: true, open: true },
                  { name: 'api', indent: 1, isDir: true },
                  { name: 'main.ts', indent: 2, isDir: false, active: true },
                  { name: 'config', indent: 1, isDir: true },
                  { name: 'package.json', indent: 0, isDir: false },
                ].map((f, i) => (
                  <div key={i} className={`flex items-center gap-0.5 py-0.5`} style={{ paddingLeft: `${f.indent * 6}px` }}>
                    <span className={`text-[6px] font-mono ${f.isDir ? 'text-blue-500' : f.active ? 'text-slate-800 font-semibold bg-blue-50 px-0.5 rounded' : 'text-slate-500'}`}>
                      {f.isDir ? (f.open ? '▾' : '▸') : ''} {f.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Code Editor */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Line numbers + code */}
                <div className="flex-1 py-2 overflow-hidden font-mono text-[7px] leading-[1.6] bg-white">
                  {/* Line 1 */}
                  <div className="flex">
                    <span className="w-5 text-slate-300 text-right pr-1.5 flex-shrink-0 select-none">1</span>
                    <span className="text-violet-600">import </span>
                    <span className="text-slate-700 ml-1">&#123; </span>
                    <span className="text-sky-600">App</span>
                    <span className="text-slate-700"> &#125;</span>
                    <span className="text-violet-600 ml-1"> from</span>
                    <span className="text-amber-600 ml-1">'./core'</span>
                  </div>
                  {/* Line 2 */}
                  <div className="flex">
                    <span className="w-5 text-slate-300 text-right pr-1.5 flex-shrink-0 select-none">2</span>
                    <span className="text-slate-400 italic text-[6px]">// System Bootstrap</span>
                  </div>
                  {/* Line 3 - highlighted */}
                  <div className="flex bg-blue-50 w-full border-l-2 border-blue-400">
                    <span className="w-5 text-slate-300 text-right pr-1.5 flex-shrink-0 select-none">3</span>
                    <span className="text-violet-600">async </span>
                    <span className="text-sky-600 ml-0.5">function </span>
                    <span className="text-amber-700 ml-0.5">init</span>
                    <span className="text-slate-700">()</span>
                    <span className="text-slate-700 ml-0.5">&#123;</span>
                  </div>
                  {/* Line 4 */}
                  <div className="flex">
                    <span className="w-5 text-slate-300 text-right pr-1.5 flex-shrink-0 select-none">4</span>
                    <span className="ml-2">
                      <span className="text-violet-600">const </span>
                      <span className="text-slate-700">app </span>
                      <span className="text-slate-500">= </span>
                      <span className="text-violet-600">new </span>
                      <span className="text-emerald-600">App</span>
                      <span className="text-slate-700">();</span>
                    </span>
                  </div>
                  {/* Line 5 */}
                  <div className="flex">
                    <span className="w-5 text-slate-300 text-right pr-1.5 flex-shrink-0 select-none">5</span>
                    <span className="ml-2">
                      <span className="text-violet-600">await </span>
                      <span className="text-slate-700">app</span>
                      <span className="text-slate-400">.</span>
                      <span className="text-amber-700">start</span>
                      <span className="text-slate-700">();</span>
                    </span>
                  </div>
                  {/* Line 6 */}
                  <div className="flex">
                    <span className="w-5 text-slate-300 text-right pr-1.5 flex-shrink-0 select-none">6</span>
                    <span className="text-slate-700">&#125;</span>
                  </div>
                  {/* Line 7 - blinking cursor */}
                  <div className="flex items-center">
                    <span className="w-5 text-slate-300 text-right pr-1.5 flex-shrink-0 select-none">7</span>
                    <span className="text-violet-600">init</span>
                    <span className="text-slate-600">().catch(</span>
                    <span className="text-sky-600">console</span>
                    <span className="text-slate-600 inline-flex items-center">
                      .err
                      <span
                        className="inline-block w-[1px] h-3 bg-blue-500 ml-[1px]"
                        style={{ animation: 'blinkCursor 1s step-end infinite' }}
                      />
                    </span>
                  </div>
                </div>

                {/* Terminal Panel at bottom */}
                <div className="border-t border-slate-200 bg-[#1e1e1e] flex-shrink-0 h-[60px] px-2 py-1.5 overflow-hidden">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[6px] text-slate-500 uppercase tracking-widest">Terminal</span>
                    <div className="flex gap-1 ml-auto">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    </div>
                  </div>
                  {[
                    { prompt: '$', cmd: ' npm run build', color: 'text-slate-300' },
                    { prompt: '>', cmd: ' Compiling...', color: 'text-yellow-400' },
                    { prompt: '✓', cmd: ' Build success  1.2s', color: 'text-emerald-400' },
                  ].map((line, i) => (
                    <div
                      key={i}
                      className={`flex gap-1 text-[6.5px] font-mono ${line.color}`}
                      style={{ animation: `slideUp 0.4s ease both ${i * 0.3}s` }}
                    >
                      <span className="text-blue-400 flex-shrink-0">{line.prompt}</span>
                      <span>{line.cmd}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right mini panel - OS metrics */}
              <div className="w-14 bg-[#f8f8f8] border-l border-slate-200 flex flex-col py-2 px-1.5 gap-2 flex-shrink-0">
                <span className="text-[5.5px] text-slate-400 uppercase tracking-widest font-sans">System</span>
                {/* CPU */}
                <div>
                  <div className="flex justify-between mb-0.5">
                    <span className="text-[5.5px] text-slate-500 font-mono">CPU</span>
                    <span className="text-[5.5px] text-blue-500 font-mono">34%</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full w-[34%] bg-blue-500 rounded-full" />
                  </div>
                </div>
                {/* RAM */}
                <div>
                  <div className="flex justify-between mb-0.5">
                    <span className="text-[5.5px] text-slate-500 font-mono">RAM</span>
                    <span className="text-[5.5px] text-cyan-600 font-mono">67%</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full w-[67%] bg-cyan-500 rounded-full" />
                  </div>
                </div>
                {/* Disk */}
                <div>
                  <div className="flex justify-between mb-0.5">
                    <span className="text-[5.5px] text-slate-500 font-mono">DISK</span>
                    <span className="text-[5.5px] text-emerald-600 font-mono">82%</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full w-[82%] bg-emerald-500 rounded-full" />
                  </div>
                </div>
                <div className="w-full h-[1px] bg-slate-200 my-0.5" />
                {/* Processes */}
                <span className="text-[5.5px] text-slate-400 font-sans">Processes</span>
                {['node', 'ts-srv', 'nginx'].map((p) => (
                  <div key={p} className="flex items-center justify-between">
                    <span className="text-[5.5px] font-mono text-slate-500">{p}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_#22c55e]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      {id === 'social' && (
        <>
          <style>{`
            @keyframes sFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
            @keyframes pNet { 0%,100%{opacity:0.25} 50%{opacity:0.5} }
            @keyframes mUp { 0%{opacity:0; transform:translateY(10px) scale(0.8)} 20%{opacity:1;} 80%{opacity:1;} 100%{opacity:0; transform:translateY(-30px) scale(1.1)} }
          `}</style>

          {/* Network Mesh Background */}
          <div className="absolute top-0 left-0 w-full h-[55%] pointer-events-none">
            <svg className="w-full h-full" preserveAspectRatio="none">
              <g stroke="#9d027c" strokeWidth="1.5" strokeDasharray="4 4" style={{animation: 'pNet 3s infinite'}}>
                {/* Horizontal lines */}
                <line x1="25%" y1="25%" x2="50%" y2="25%" />
                <line x1="50%" y1="25%" x2="75%" y2="25%" />
                <line x1="15%" y1="65%" x2="35%" y2="65%" />
                <line x1="35%" y1="65%" x2="55%" y2="65%" />
                <line x1="55%" y1="65%" x2="75%" y2="65%" />
                
                {/* Diagonal/Vertical lines */}
                <line x1="25%" y1="25%" x2="15%" y2="65%" />
                <line x1="25%" y1="25%" x2="35%" y2="65%" />
                <line x1="50%" y1="25%" x2="35%" y2="65%" />
                <line x1="50%" y1="25%" x2="55%" y2="65%" />
                <line x1="75%" y1="25%" x2="55%" y2="65%" />
                <line x1="75%" y1="25%" x2="75%" y2="65%" />
              </g>
            </svg>
          </div>

          {/* Floating modern emojis */}
          <div className="absolute top-[8%] left-[40%] z-0" style={{animation: 'mUp 3s linear infinite 0s'}}>
             <div className="bg-white rounded-full p-[6px] shadow-md flex items-center justify-center border border-slate-100">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="#ef4444"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
             </div>
          </div>
          <div className="absolute top-[35%] left-[60%] z-0" style={{animation: 'mUp 3.5s linear infinite 1s'}}>
             <div className="bg-white rounded-full p-[6px] shadow-md flex items-center justify-center border border-slate-100">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="#3b82f6"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
             </div>
          </div>
          <div className="absolute top-[45%] left-[20%] z-0" style={{animation: 'mUp 3.2s linear infinite 0.5s'}}>
             <div className="bg-white rounded-full p-[6px] shadow-md flex items-center justify-center border border-slate-100">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 8c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zm-7 0c.83 0 1.5.67 1.5 1.5S9.33 13 8.5 13 7 12.33 7 11.5 7.67 10 8.5 10zm3.5 9.5c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z"/></svg>
             </div>
          </div>

          {/* Social Icons Container (Top half) */}
          <div className="absolute top-0 left-0 w-full h-[55%] pointer-events-none z-10">
            {/* ROW 1 (3 Icons) */}
            <div className="absolute top-[25%] left-[25%] -translate-x-1/2 -translate-y-1/2 drop-shadow-lg" style={{animation:'sFloat 4s ease-in-out infinite 0s'}}>
              <img src="/social-icons/icon1.png" alt="Social Icon 1" className="w-8 h-8 sm:w-[44px] sm:h-[44px] object-contain" />
            </div>

            <div className="absolute top-[25%] left-[50%] -translate-x-1/2 -translate-y-1/2 drop-shadow-lg" style={{animation:'sFloat 4.5s ease-in-out infinite 0.2s'}}>
              <img src="/social-icons/icon2.png" alt="Social Icon 2" className="w-8 h-8 sm:w-[44px] sm:h-[44px] object-contain" />
            </div>

            <div className="absolute top-[25%] left-[75%] -translate-x-1/2 -translate-y-1/2 drop-shadow-lg" style={{animation:'sFloat 4.2s ease-in-out infinite 0.4s'}}>
              <img src="/social-icons/icon3.png" alt="Social Icon 3" className="w-8 h-8 sm:w-[44px] sm:h-[44px] object-contain" />
            </div>

            {/* ROW 2 (4 Icons) */}
            <div className="absolute top-[65%] left-[15%] -translate-x-1/2 -translate-y-1/2 drop-shadow-lg" style={{animation:'sFloat 4.1s ease-in-out infinite 0.1s'}}>
              <img src="/social-icons/icon4.png" alt="Social Icon 4" className="w-8 h-8 sm:w-[44px] sm:h-[44px] object-contain" />
            </div>

            <div className="absolute top-[65%] left-[35%] -translate-x-1/2 -translate-y-1/2 drop-shadow-lg" style={{animation:'sFloat 3.8s ease-in-out infinite 0.3s'}}>
              <img src="/social-icons/icon5.png" alt="Social Icon 5" className="w-8 h-8 sm:w-[44px] sm:h-[44px] object-contain" />
            </div>

            <div className="absolute top-[65%] left-[55%] -translate-x-1/2 -translate-y-1/2 drop-shadow-lg" style={{animation:'sFloat 4.3s ease-in-out infinite 0.5s'}}>
              <img src="/social-icons/icon6.png" alt="Social Icon 6" className="w-8 h-8 sm:w-[44px] sm:h-[44px] object-contain" />
            </div>

            <div className="absolute top-[65%] left-[75%] -translate-x-1/2 -translate-y-1/2 drop-shadow-lg" style={{animation:'sFloat 4.0s ease-in-out infinite 0.6s'}}>
              <img src="/social-icons/icon7.png" alt="Social Icon 7" className="w-8 h-8 sm:w-[44px] sm:h-[44px] object-contain" />
            </div>
          </div>
        </>
      )}
      {id === 'media' && (
        <>
          <style>{`
            @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
          `}</style>
          
          {/* Viewfinder Container */}
          <div className="absolute top-0 left-0 w-full h-[50%] pointer-events-none p-5 z-10 flex flex-col justify-between font-mono text-black">
            
            {/* Large Frame Corners */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-[2px] border-l-[2px] border-black/80" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-[2px] border-r-[2px] border-black/80" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-[2px] border-l-[2px] border-black/80" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-[2px] border-r-[2px] border-black/80" />

            {/* Top Bar */}
            <div className="flex justify-between items-start text-[11px] font-bold px-1 pt-1">
              {/* REC Indicator */}
              <div className="flex items-center gap-1.5">
                <span className="tracking-widest">REC</span>
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" style={{ animation: 'blink 1.5s infinite' }} />
              </div>
              
              {/* Timer */}
              <div className="absolute left-1/2 -translate-x-1/2 tracking-[0.2em] font-medium text-[12px]">
                00:05:26
              </div>

              {/* Battery */}
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-3 border-[1.5px] border-black rounded-sm p-[1px] flex relative">
                  <div className="w-[80%] h-full bg-black rounded-[1px]" />
                  <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[2px] h-1.5 bg-black rounded-r-sm" />
                </div>
                <span className="tracking-tight text-[10px]">62 MIN</span>
              </div>
            </div>

            {/* Central Auto Focus */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-24 flex items-center justify-center">
              {/* Red brackets */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-[2px] border-l-[2px] border-red-500/90" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-[2px] border-r-[2px] border-red-500/90" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-[2px] border-l-[2px] border-red-500/90" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-[2px] border-r-[2px] border-red-500/90" />
              
              {/* Center Crosshair */}
              <div className="w-8 h-[1.5px] bg-black/80 absolute" />
              <div className="w-[1.5px] h-8 bg-black/80 absolute" />
            </div>

            {/* Bottom Bar */}
            <div className="flex justify-between items-end text-[10px] font-bold px-1 pb-1">
              {/* Left: FHD */}
              <div className="border-[1.5px] border-black/80 px-2 py-0.5 tracking-wider rounded-sm">
                FHD
              </div>
              
              {/* Center: Exposure Meter */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-5 flex flex-col items-center">
                <div className="text-[8px] mb-0.5 text-black">▼</div>
                <div className="flex items-center gap-1 text-[9px] tracking-widest text-black font-medium">
                  <span>-2</span>
                  <span className="opacity-50 tracking-[0.2em]">....</span>
                  <span>-1</span>
                  <span className="opacity-50 tracking-[0.2em]">....</span>
                  <span>0</span>
                  <span className="opacity-50 tracking-[0.2em]">....</span>
                  <span>1</span>
                  <span className="opacity-50 tracking-[0.2em]">....</span>
                  <span>2</span>
                </div>
              </div>

              {/* Right: HD 4K 25FPS */}
              <div className="flex gap-1.5 items-center">
                <div className="bg-black text-white px-1.5 py-0.5 rounded-sm">
                  HD
                </div>
                <div className="border-[1.5px] border-black/80 px-1.5 py-0.5 rounded-sm">
                  4K
                </div>
                <div className="tracking-wide ml-0.5">
                  25FPS
                </div>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
};


interface ServicesGalleryProps {
  currentLang: Language;
  setActiveTab?: (tab: string) => void;
  services?: PublicService[] | null;
  onContact?: (serviceSlugs?: string[]) => void;
}

function visualIdForService(service: PublicService) {
  const key = `${service.slug} ${service.themeKey || ''}`.toLowerCase();
  if (/(brand|graphic|identity|design)/.test(key)) return 'branding';
  if (/(web|app|software|platform|development)/.test(key)) return 'software';
  if (/(social|marketing|seo|growth|advert)/.test(key)) return 'social';
  return 'media';
}

function accentForService(service: PublicService) {
  const key = `${service.slug} ${service.themeKey || ''}`.toLowerCase();
  if (/(brand|graphic|identity|design)/.test(key)) return 'from-pink-600/40 to-slate-900';
  if (/(web|app|software|platform|development)/.test(key)) return 'from-blue-600/40 to-slate-900';
  if (/(social|marketing|seo|growth|advert)/.test(key)) return 'from-[#ffbc01]/40 to-slate-900';
  return 'from-emerald-600/40 to-slate-900';
}

export default function ServicesGallery({ currentLang, setActiveTab, services, onContact }: ServicesGalleryProps) {
  const [activeId, setActiveId] = useState(services?.[0]?.slug || 'branding');

  const fallbackServices = [
    {
      id: 'branding',
      titleAr: 'بناء الهوية التجارية',
      titleEn: 'Brand Strategy & Identity',
      descAr: 'نحوّل فكرتك إلى علامة واضحة: اسم، رسالة، شخصية بصرية، وقوالب تسويق يعرف العميل من خلالها لماذا يثق بك.',
      descEn: 'We turn your business idea into a clear brand system: message, visual identity, and marketing-ready assets customers can trust.',
      accent: 'from-pink-600/40 to-slate-900'
    },
    {
      id: 'software',
      titleAr: 'مواقع وأنظمة مبيعات',
      titleEn: 'Websites & Sales Systems',
      descAr: 'نصمم مواقع ومنصات سريعة تربط التسويق بالمبيعات: صفحات خدمات، نماذج طلب، لوحات إدارة، وتتبع للنتائج.',
      descEn: 'We build fast websites and platforms that connect marketing to sales: service pages, request forms, dashboards, and performance tracking.',
      accent: 'from-blue-600/40 to-slate-900'
    },
    {
      id: 'social',
      titleAr: 'إدارة السوشيال والإعلانات',
      titleEn: 'Social Media & Paid Ads',
      descAr: 'نخطط محتوى وإعلانات مبنية على الجمهور والعرض والميزانية، بهدف زيادة الطلبات وليس مجرد النشر اليومي.',
      descEn: 'We plan content and paid campaigns around audience, offer, and budget so your channels generate leads, not just posts.',
      accent: 'from-[#ffbc01]/40 to-slate-900'
    },
    {
      id: 'media',
      titleAr: 'تصوير وإنتاج محتوى',
      titleEn: 'Media Production',
      descAr: 'ننتج صور وفيديوهات جاهزة للإعلانات والمنصات، مع فكرة واضحة وسيناريو يخدم قرار الشراء.',
      descEn: 'We produce photo and video assets ready for ads and social channels, with a clear idea and script built for buying decisions.',
      accent: 'from-emerald-600/40 to-slate-900'
    }
  ];

  // The public services page intentionally presents four clear service families.
  // Admin services are grouped beneath the family instead of creating duplicate cards.
  const galleryServices = fallbackServices.map((fallback) => {
    const matches = (services || []).filter((service) => visualIdForService(service) === fallback.id);
    const primary = matches[0];
    return {
      ...fallback,
      visualId: fallback.id,
      id: fallback.id,
      slug: primary?.slug,
      serviceSlugs: matches.map((service) => service.slug),
      titleAr: fallback.titleAr,
      titleEn: fallback.titleEn,
      descAr: primary?.descAr || fallback.descAr,
      descEn: primary?.descEn || fallback.descEn,
      accent: primary ? accentForService(primary) : fallback.accent,
    };
  });

  useEffect(() => {
    if (galleryServices.length && !galleryServices.some((service) => service.id === activeId)) {
      setActiveId(galleryServices[0].id);
    }
  }, [activeId, galleryServices]);

  return (
    <div className="pt-28 md:pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-4xl mx-auto mb-16">
        <h2
          className="text-[clamp(2rem,5vw,3.5rem)] font-black tracking-normal leading-[1.18] mb-4 text-transparent bg-clip-text drop-shadow-md"
          style={{
            backgroundImage: 'linear-gradient(90deg, #9d027c, #f43f5e, #ffbc01, #f43f5e, #9d027c)',
            backgroundSize: '200% auto',
            animation: 'gradient-melt 4s linear infinite'
          }}
        >
          {currentLang === 'ar' ? 'خدمات نمو واضحة من أول خطوة' : 'Growth Services Built Around Clear Outcomes'}
        </h2>
        <p 
          className="text-sm sm:text-base md:text-lg font-semibold leading-8 max-w-3xl mx-auto text-transparent bg-clip-text drop-shadow-sm"
          style={{
            backgroundImage: 'linear-gradient(90deg, #9d027c, #f43f5e, #ffbc01, #f43f5e, #9d027c)',
            backgroundSize: '200% auto',
            animation: 'gradient-melt 4s linear infinite'
          }}
        >
          {currentLang === 'ar' 
            ? 'كل مسار هنا مصمم ليجاوب على سؤال عملي: كيف يظهر مشروعك بشكل أقوى، يجذب العميل المناسب، ويحوّل الاهتمام إلى طلبات قابلة للمتابعة؟'
            : 'Each track answers a practical question: how can your business look stronger, attract the right customer, and turn attention into trackable requests?'}
        </p>
      </div>

      {/* Dynamic Expanding Accordion Gallery */}
      <div className="flex flex-col lg:flex-row h-[700px] lg:h-[450px] gap-4 w-full">
        {galleryServices.map((service) => {
          const isActive = activeId === service.id;
          
          return (
            <motion.a
              href="#"
              key={service.id}
              onClick={(e) => {
                e.preventDefault();
                setActiveId(service.id);
              }}
              onMouseEnter={() => setActiveId(service.id)}
              animate={{ 
                flex: isActive ? 3.5 : 1,
              }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              className="relative rounded-3xl overflow-hidden cursor-pointer group flex-shrink-0 lg:flex-shrink flex flex-col justify-end p-6 border border-slate-200/80 bg-white/90 shadow-[0_14px_35px_rgba(15,23,42,0.08)] transition-colors duration-500 hover:border-[#9d027c]/35 hover:bg-white"
            >
              {/* Animated Gradient Background for active state */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${service.accent} transition-opacity duration-700 pointer-events-none ${
                  isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-30'
                }`} 
              />

              <ServiceBackgroundIdea id={service.visualId} isActive={isActive} />
              
              {/* Glassmorphism content container */}
              <div className={`relative z-10 flex flex-col ${isActive ? 'items-center lg:items-start w-full text-center lg:text-start' : 'items-center justify-center w-full h-full'}`}>
                
                {/* Icon scales down extremely small on desktop and mobile when active */}
                <motion.div 
                  layout
                  className={`transition-all duration-500 z-20 ${
                    isActive 
                      ? 'opacity-100 scale-[0.45] lg:scale-[0.55] origin-bottom lg:origin-bottom-left mb-1 lg:mb-2' 
                      : 'opacity-100 scale-100 origin-center mb-4 lg:mb-8 h-auto'
                  }`}
                >
                  <ServiceShape id={service.visualId} />
                </motion.div>

                <div className="flex-1 w-full overflow-hidden flex flex-col justify-end">
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="flex flex-col w-full whitespace-normal mt-auto bg-white/60 p-2 lg:p-5 rounded-lg lg:rounded-2xl border border-white/40 shadow-xl"
                      >
                        <h3 
                          className="text-base lg:text-2xl font-black text-black mb-1 lg:mb-2 tracking-normal"
                          style={{ color: '#000000' }}
                        >
                          {currentLang === 'ar' ? service.titleAr : service.titleEn}
                        </h3>
                        <p 
                          className="text-xs lg:text-sm font-semibold leading-5 lg:leading-7 line-clamp-3 mb-3 lg:mb-5 text-gray-900"
                          style={{ color: '#111827' }}
                        >
                          {currentLang === 'ar' ? service.descAr : service.descEn}
                        </p>
                        
                        <div className="flex justify-center lg:justify-start w-full">
                          <AnimatedCTA 
                            text={currentLang === 'ar' ? 'افتح تفاصيل المسار' : 'Open Service Details'}
                            textSent={currentLang === 'ar' ? 'جاري الفتح' : 'Opening...'}
                            className="scale-[0.6] lg:scale-90 origin-bottom lg:origin-left"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (setActiveTab) {
                                setActiveTab(service.visualId);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }
                            }} 
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Vertical title for inactive on desktop */}
                {!isActive && (
                  <div className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none opacity-100 transition-opacity">
                     <span 
                       className="text-xl font-black text-[#0f172a] whitespace-nowrap rotate-[-90deg] tracking-widest origin-center translate-y-12"
                       style={{ color: '#0f172a' }}
                     >
                       {currentLang === 'ar' ? service.titleAr : service.titleEn}
                     </span>
                  </div>
                )}
                {/* Horizontal title for inactive on mobile */}
                {!isActive && (
                  <div className="lg:hidden mt-2 pointer-events-none opacity-100 transition-opacity text-center w-full">
                     <span 
                       className="text-lg font-black text-[#0f172a] whitespace-nowrap tracking-wide"
                       style={{ color: '#0f172a' }}
                     >
                       {currentLang === 'ar' ? service.titleAr : service.titleEn}
                     </span>
                  </div>
                )}
              </div>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
