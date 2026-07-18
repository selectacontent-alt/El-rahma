"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpenCheck,
  Brush,
  Camera,
  CalendarDays,
  CircleDot,
  Clapperboard,
  ClipboardList,
  Code2,
  Database,
  Download,
  FileDown,
  FileInput,
  Film,
  Gauge,
  Globe,
  ImagePlus,
  Images,
  Layers,
  Lightbulb,
  Map as MapIcon,
  MapPin,
  Megaphone,
  MessageSquareText,
  Mic2,
  MonitorSmartphone,
  MousePointerClick,
  Palette,
  PackageCheck,
  PanelsTopLeft,
  PenTool,
  Presentation,
  Rocket,
  Scissors,
  ScrollText,
  Search,
  Send,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Smartphone,
  Sun,
  SwatchBook,
  Type,
  Video,
  ShoppingCart,
  Users,
  UsersRound,
  Bot,
  Zap,
  TrendingUp,
  LayoutDashboard,
  Target,
  User,
  WandSparkles,
  Plane,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  portfolioPageCopy,
  portfolioProjectLinks,
  portfolioServiceNodes,
  portfolioTeamNodes,
} from '../portfolioData';
import { publicDriveUrl, siteFetch } from '../lib/siteApi';
import {
  Language,
  PortfolioProjectLink,
  PortfolioServiceNode,
  PortfolioTeamNode,
} from '../types';

const API_BASE = typeof window !== 'undefined' ? `http://${window.location.hostname}:5005` : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5005");

interface PortfolioNetworkPageProps {
  currentLang: Language;
  setActiveTab: (tab: string) => void;
}

interface StageOrigin {
  x: number;
  y: number;
}

interface PositionedNode extends PortfolioTeamNode {
  anchorX: number;
  anchorY: number;
}

interface AnimatedNodeState {
  currentX: number;
  currentY: number;
  offsetX: number;
  offsetY: number;
  seed: number;
}

interface NodeMetrics {
  width: number;
  portraitHeight: number;
  nameClass: string;
  titleClass: string;
  labelWidth: string;
}

interface NetworkNodeViewModel extends PositionedNode {
  name: string;
  title: string;
  accentColor: string;
  metrics: NodeMetrics;
  isActive: boolean;
  isClusterNode: boolean;
  priorityOpacity: number;
}

interface ServiceConstellationNodeProps {
  currentLang: Language;
  node: PortfolioServiceNode;
  isLeft?: boolean;
}

const STAGE_VIEWBOX = 1000;
const PALETTE = {
  porcelain: '#f4f6f8',
  porcelainGlow: '#eef3f8',
  graphite: '#11141b',
  graphiteSoft: '#2b3441',
  steel: '#6d7f90',
  steelSoft: '#c8d1db',
  plum: '#7a3ff2',
  gold: '#c79d5a',
  white: '#ffffff',
} as const;

const ICON_MAP = {
  Palette,
  Globe,
  Share2,
  Video,
  Film,
  Camera,
  Code2,
  ShoppingCart,
  Users,
  Bot,
  Zap,
  TrendingUp,
  LayoutDashboard,
  Target,
  User,
  Plane,
} as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace('#', '');
  const normalized = clean.length === 3
    ? clean.split('').map((char) => char + char).join('')
    : clean;

  const value = Number.parseInt(normalized, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getProjectTab(href: string, project?: PortfolioProjectLink) {
  if (project?.routeTab) return project.routeTab;
  if (href === '/websites') return 'projects-websites';
  if (href === '/social-media') return 'projects-social';
  if (href === '/branding') return 'branding';
  if (href === '/animation') return 'projects-animation';
  if (href === '/promotional') return 'projects-promotional';
  if (href === '/photography') return 'projects-photography';
  return '';
}

function getNodeMetrics(ring: PortfolioTeamNode['ring'], isMobile: boolean): NodeMetrics {
  if (ring === 0) {
    return isMobile
      ? { width: 100, portraitHeight: 108, nameClass: 'text-[13px]', titleClass: 'text-[8px]', labelWidth: '110px' }
      : { width: 156, portraitHeight: 168, nameClass: 'text-lg', titleClass: 'text-[10px]', labelWidth: '166px' };
  }

  if (ring === 1) {
    return isMobile
      ? { width: 56, portraitHeight: 60, nameClass: 'text-[8px]', titleClass: 'text-[6px]', labelWidth: '60px' }
      : { width: 96, portraitHeight: 102, nameClass: 'text-[11px]', titleClass: 'text-[9px]', labelWidth: '106px' };
  }

  if (ring === 2) {
    return isMobile
      ? { width: 42, portraitHeight: 46, nameClass: 'text-[6px]', titleClass: 'text-[5px]', labelWidth: '46px' }
      : { width: 82, portraitHeight: 88, nameClass: 'text-[10px]', titleClass: 'text-[8px]', labelWidth: '92px' };
  }

  return isMobile
    ? { width: 28, portraitHeight: 30, nameClass: 'text-[5px]', titleClass: 'text-[4px]', labelWidth: '32px' }
    : { width: 68, portraitHeight: 72, nameClass: 'text-[9px]', titleClass: 'text-[7px]', labelWidth: '78px' };
}

function getDetailDockLabel(currentLang: Language) {
  return currentLang === 'ar' ? 'شبكة القرار' : 'Decision weave';
}

function getMobileDockAction(currentLang: Language) {
  return currentLang === 'ar' ? 'اضغط للتفاصيل' : 'Tap for details';
}

function getServicePositions(isMobile: boolean) {
  const positions: Record<string, { x: number; y: number }> = {};
  
  if (isMobile) {
    portfolioServiceNodes.forEach(node => {
      positions[node.id] = { x: 50, y: 50 }; // We will use grid/flex layout on mobile instead of absolute
    });
    return positions;
  }

  const growthNodes = portfolioServiceNodes.filter(n => n.group === 'growth');
  const mediaNodes = portfolioServiceNodes.filter(n => n.group === 'media');
  const softwareNodes = portfolioServiceNodes.filter(n => n.group === 'software');

  const rings = [
    { nodes: growthNodes, radiusX: 18, radiusY: 20, offset: Math.PI / -2 },
    { nodes: mediaNodes, radiusX: 28, radiusY: 30, offset: Math.PI / -4 },
    { nodes: softwareNodes, radiusX: 38, radiusY: 40, offset: Math.PI / -6 }
  ];

  rings.forEach((ring, ringIndex) => {
    const count = ring.nodes.length;
    const angleStep = (Math.PI * 2) / count;
    ring.nodes.forEach((node, idx) => {
      const angle = ring.offset + idx * angleStep;
      positions[node.id] = {
        x: 50 + Math.cos(angle) * ring.radiusX,
        y: 50 + Math.sin(angle) * ring.radiusY
      };
    });
  });

  return positions;
}

function buildConnectionPath(origin: StageOrigin, x: number, y: number, ring: PortfolioTeamNode['ring']) {
  const dx = x - origin.x;
  const dy = y - origin.y;
  const distance = Math.max(Math.hypot(dx, dy), 1);
  const curve = ring === 1 ? 10 : ring === 2 ? 16 : 22;
  const normalX = (-dy / distance) * curve;
  const normalY = (dx / distance) * curve;
  const c1x = origin.x + dx * 0.26 + normalX * 0.26;
  const c1y = origin.y + dy * 0.2 + normalY * 0.2;
  const c2x = origin.x + dx * 0.78 + normalX;
  const c2y = origin.y + dy * 0.82 + normalY;
  return `M ${origin.x} ${origin.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x} ${y}`;
}

function buildServicePath(from: { x: number; y: number }, to: { x: number; y: number }) {
  const fX = from.x * 10;
  const fY = from.y * 10;
  const tX = to.x * 10;
  const tY = to.y * 10;
  const dx = tX - fX;
  const dy = tY - fY;
  const controlX = fX + dx * 0.5 + (dy > 0 ? -40 : 40);
  const controlY = fY + dy * 0.5 - (dx > 0 ? 40 : -40);
  return `M ${fX} ${fY} Q ${controlX} ${controlY} ${tX} ${tY}`;
}

function RingLegendChip({
  accent,
  label,
}: {
  accent: string;
  label: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em]"
      style={{
        borderColor: hexToRgba(accent, 0.18),
        backgroundColor: hexToRgba(PALETTE.white, 0.52),
        color: PALETTE.graphiteSoft,
        backdropFilter: 'blur(12px)',
      }}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: accent, boxShadow: `0 0 0 4px ${hexToRgba(accent, 0.12)}` }}
      />
      {label}
    </span>
  );
}

function PortraitFallback({
  accent,
  active,
  cluster,
  ring,
  name,
}: {
  accent: string;
  active: boolean;
  cluster: boolean;
  ring: PortfolioTeamNode['ring'];
  name: string;
}) {
  // Use a deterministic seed for each person so their photo stays the same
  const seed = encodeURIComponent(name);
  const imageUrl = `https://i.pravatar.cc/250?u=${seed}`;
  
  const shellShadow = active
    ? `0 18px 42px ${hexToRgba(accent, 0.25)}`
    : cluster
      ? `0 10px 28px ${hexToRgba(accent, 0.12)}`
      : '0 8px 18px rgba(17, 20, 27, 0.06)';

  // Scale border radius based on ring size
  const borderRadius = ring === 0 ? '36px' : ring === 1 ? '24px' : '16px';

  return (
    <div className="relative h-full w-full overflow-visible group">
      {/* Soft ambient glow behind the photo */}
      <div
        className="absolute -inset-1 blur-[14px] transition-all duration-500"
        style={{
          borderRadius,
          backgroundColor: hexToRgba(accent, active ? 0.35 : cluster ? 0.15 : 0),
          transform: active ? 'scale(1.05)' : 'scale(0.9)',
        }}
      />
      
      {/* Photo Container */}
      <div
        className="relative mx-auto h-full w-full overflow-hidden transition-all duration-500"
        style={{
          borderRadius,
          border: `2px solid ${active ? hexToRgba(accent, 0.8) : hexToRgba(PALETTE.steel, 0.2)}`,
          boxShadow: shellShadow,
          backgroundColor: PALETTE.white,
        }}
      >
        <img 
          src={imageUrl} 
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading={ring <= 1 ? 'eager' : 'lazy'}
          crossOrigin="anonymous"
        />
        
        {/* Very subtle color overlay to blend the photo with the node's accent color */}
        <div 
          className="absolute inset-0 mix-blend-color transition-opacity duration-500"
          style={{
            backgroundColor: accent,
            opacity: active ? 0.15 : 0.05
          }}
        />

        {/* Inner shadow for depth */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 20px rgba(0,0,0,0.1)`
          }}
        />
      </div>
    </div>
  );
}

function NetworkNodeButton({
  currentLang,
  node,
  onActivate,
  onOpenDetails,
  registerSpriteRef,
}: {
  currentLang: Language;
  node: NetworkNodeViewModel;
  onActivate: (nodeId: string) => void;
  onOpenDetails: (nodeId: string) => void;
  registerSpriteRef: (nodeId: string, element: HTMLDivElement | null) => void;
}) {
  const hasImage = Boolean(node.imagePng);
  const textColor = node.isActive ? PALETTE.graphite : PALETTE.graphiteSoft;
  const labelOpacity = node.priorityOpacity;

  return (
    <button
      type="button"
      className="absolute z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center bg-transparent text-center outline-none"
      style={{
        left: `${(node.anchorX / STAGE_VIEWBOX) * 100}%`,
        top: `${(node.anchorY / STAGE_VIEWBOX) * 100}%`,
        width: node.metrics.width,
        opacity: labelOpacity,
        zIndex: node.isActive ? 80 : node.isClusterNode ? 58 : 20 + node.ring * 6,
      }}
      onMouseEnter={() => onActivate(node.id)}
      onFocus={() => onActivate(node.id)}
      onClick={() => onOpenDetails(node.id)}
      aria-label={`${node.name} - ${node.title}`}
    >
      <div
        ref={(element) => registerSpriteRef(node.id, element)}
        className="will-change-transform"
        style={{ transform: 'translate3d(0, 0, 0)' }}
      >
        <div
          className="transition-transform duration-300"
          style={{
            transform: node.isActive ? 'scale(1.06)' : node.isClusterNode ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          <div style={{ height: node.metrics.portraitHeight }}>
            {hasImage ? (
              <img
                src={publicDriveUrl(node.imagePng, null, 'w1000')}
                alt={node.name}
                className="h-full w-full object-contain object-bottom"
                loading={node.ring <= 1 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
              />
            ) : (
              <PortraitFallback
                accent={node.accentColor}
                active={node.isActive}
                cluster={node.isClusterNode}
                ring={node.ring}
                name={node.name}
              />
            )}
          </div>

          <div
            className="mt-2 px-1"
            style={{
              width: node.metrics.labelWidth,
            }}
          >
            <div
              className={`truncate font-black leading-tight tracking-[0.01em] ${node.metrics.nameClass}`}
              style={{ color: textColor }}
            >
              {node.name}
            </div>
            <div
              className={`mt-1 leading-tight tracking-[0.12em] uppercase ${node.metrics.titleClass}`}
              style={{ color: node.isActive ? hexToRgba(node.accentColor, 0.92) : hexToRgba(PALETTE.steel, 0.92) }}
            >
              {node.title}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

function getProjectSceneCaption(project: PortfolioProjectLink, currentLang: Language) {
  if (currentLang === 'ar') {
    if (project.previewType === 'identity') return 'نظام هوية، ألوان، وتطبيقات جاهزة للعرض';
    if (project.previewType === 'website') return 'واجهة رقمية واضحة تعرض القوة التقنية';
    if (project.previewType === 'social') return 'حملة مرئية وشبكة محتوى جاهزة للنشر';
    if (project.previewType === 'motion') return 'فريمات حركة وتايملاين إنتاج بصري';
    if (project.previewType === 'video') return 'مشهد إنتاج إعلاني بكادرات منظمة';
    return 'لقطات منتجات وعدسة تصوير تجارية';
  }

  if (project.previewType === 'identity') return 'Identity system, palette, and launch-ready applications';
  if (project.previewType === 'website') return 'A digital interface that signals technical strength';
  if (project.previewType === 'social') return 'A campaign wall with polished content rhythm';
  if (project.previewType === 'motion') return 'Motion frames and a production timeline';
  if (project.previewType === 'video') return 'Commercial film production with controlled shots';
  return 'Product scenes and a commercial capture lens';
}

function ProjectPreviewScene({
  project,
  reduceMotion,
}: {
  project: PortfolioProjectLink;
  reduceMotion: boolean;
}) {
  const accent = project.accent;
  const previewType = project.previewType ?? 'identity';
  const loop = reduceMotion
    ? {}
    : {
        transition: {
          repeat: Infinity,
          repeatType: 'mirror' as const,
          duration: 3.2,
          ease: 'easeInOut' as const,
        },
      };

  return (
    <motion.div
      key={project.id}
      initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
      className="relative min-h-[300px] overflow-hidden rounded-[20px] border border-white/10 bg-[#08090d] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:min-h-[390px] sm:p-6 lg:min-h-[470px]"
    >
      <div
        className="absolute inset-0 opacity-95"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.08), transparent 22%), linear-gradient(110deg, rgba(255,255,255,0.05), transparent 42%), linear-gradient(180deg, #11131a 0%, #07080c 100%)',
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${hexToRgba(accent, 0.8)}, transparent)` }}
      />

      {previewType === 'identity' && (
        <div className="relative grid h-full min-h-[270px] gap-4 sm:min-h-[350px] sm:grid-cols-[1fr_0.72fr] lg:min-h-[430px]">
          <div className="relative overflow-hidden rounded-[18px] border border-white/10 bg-[#f7f2ea] p-5 text-[#161318]">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: accent }}>
                Brand System
              </span>
              <img src="/logo.png" alt="SELECT" className="h-8 w-auto object-contain" />
            </div>
            <div className="mt-10 grid place-items-center">
              <motion.div
                animate={reduceMotion ? undefined : { rotate: [-2, 2], scale: [1, 1.035] }}
                {...loop}
                className="grid h-32 w-32 place-items-center rounded-[32px] border border-[#1b171c]/10 bg-white shadow-[0_22px_60px_rgba(20,12,18,0.12)]"
              >
                <div className="h-16 w-16 rounded-full" style={{ backgroundColor: accent }} />
              </motion.div>
            </div>
            <div className="mt-10 grid grid-cols-4 gap-3">
              {[accent, '#11141b', '#f4f6f8', '#c79d5a'].map((color) => (
                <div key={color} className="h-16 rounded-[14px] border border-black/5" style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            {['Logo Suite', 'Brand Manual', 'Applications'].map((label, index) => (
              <div key={label} className="rounded-[18px] border border-white/10 bg-white/[0.055] p-4">
                <div className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">{label}</div>
                <div className="mt-5 flex items-end gap-3">
                  <div className="h-14 w-14 rounded-2xl" style={{ backgroundColor: hexToRgba(accent, 0.78) }} />
                  <div className="grid flex-1 gap-2">
                    <div className="h-2 rounded-full bg-white/30" />
                    <div className="h-2 w-2/3 rounded-full bg-white/14" />
                    <div className="h-2 w-1/2 rounded-full bg-white/10" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {previewType === 'website' && (
        <div className="relative grid h-full min-h-[270px] gap-5 sm:min-h-[350px] lg:min-h-[430px] lg:grid-cols-[1fr_0.32fr]">
          <div className="overflow-hidden rounded-[20px] border border-white/10 bg-[#f7f8fb] shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
            <div className="flex h-10 items-center gap-2 border-b border-black/5 bg-white px-4">
              <span className="h-2.5 w-2.5 rounded-full bg-[#e05252]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#e3b24c]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#4bb77a]" />
              <div className="mx-auto h-4 w-44 rounded-full bg-[#eef1f5]" />
            </div>
            <div className="grid min-h-[310px] gap-5 p-5 lg:grid-cols-[0.8fr_1fr]">
              <div className="rounded-[18px] p-5 text-white" style={{ backgroundColor: accent }}>
                <div className="h-2 w-20 rounded-full bg-white/45" />
                <div className="mt-8 h-8 w-48 rounded-lg bg-white/82" />
                <div className="mt-3 h-3 w-36 rounded-full bg-white/42" />
                <div className="mt-10 grid grid-cols-2 gap-3">
                  {[0, 1, 2, 3].map((item) => (
                    <motion.div
                      key={item}
                      animate={reduceMotion ? undefined : { y: item % 2 ? [0, -6] : [0, 6] }}
                      {...loop}
                      className="h-16 rounded-[14px] bg-white/16"
                    />
                  ))}
                </div>
              </div>
              <div className="grid gap-3">
                <div className="h-24 rounded-[18px] bg-white shadow-sm" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-32 rounded-[18px] bg-white shadow-sm" />
                  <div className="h-32 rounded-[18px] bg-white shadow-sm" />
                </div>
                <div className="h-14 rounded-[18px] bg-[#11141b]" />
              </div>
            </div>
          </div>
          <div className="hidden rounded-[24px] border border-white/10 bg-white/[0.055] p-4 lg:block">
            <div className="mx-auto h-full max-h-[390px] rounded-[28px] border-[8px] border-[#11141b] bg-[#f7f8fb] p-3">
              <div className="h-16 rounded-[16px]" style={{ backgroundColor: hexToRgba(accent, 0.24) }} />
              <div className="mt-4 grid gap-2">
                <div className="h-2 rounded-full bg-[#11141b]/25" />
                <div className="h-2 w-2/3 rounded-full bg-[#11141b]/16" />
              </div>
              <div className="mt-6 grid gap-3">
                {[0, 1, 2].map((item) => (
                  <div key={item} className="h-12 rounded-[14px] bg-white shadow-sm" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {previewType === 'social' && (
        <div className="relative grid min-h-[270px] gap-4 sm:min-h-[350px] lg:min-h-[430px] lg:grid-cols-[0.62fr_1fr]">
          <div className="rounded-[20px] border border-white/10 bg-white/[0.055] p-5">
            <div className="flex items-center gap-3">
              <img src="/logos/meta.png" alt="Meta" className="h-10 w-10 object-contain" />
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/45">Campaign Wall</div>
                <div className="mt-1 text-xl font-black text-white">SELECT Social</div>
              </div>
            </div>
            <div className="mt-8 grid gap-3">
              {['Reach', 'Creative', 'Messages'].map((item, index) => (
                <div key={item} className="rounded-[16px] border border-white/10 bg-black/16 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white/72">{item}</span>
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-white/10">
                    <motion.div
                      animate={reduceMotion ? undefined : { width: [`${48 + index * 10}%`, `${76 + index * 6}%`] }}
                      {...loop}
                      className="h-full rounded-full"
                      style={{ backgroundColor: accent }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <motion.div
                key={item}
                animate={reduceMotion ? undefined : { y: item % 2 ? [0, -8] : [0, 8] }}
                {...loop}
                className="min-h-[120px] rounded-[18px] border border-white/10 p-3"
                style={{
                  background:
                    item % 3 === 0
                      ? `linear-gradient(140deg, ${hexToRgba(accent, 0.82)}, rgba(255,255,255,0.1))`
                      : 'rgba(255,255,255,0.055)',
                }}
              >
                <div className="h-16 rounded-[12px] bg-white/18" />
                <div className="mt-4 h-2 rounded-full bg-white/32" />
                <div className="mt-2 h-2 w-2/3 rounded-full bg-white/16" />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {previewType === 'motion' && (
        <div className="relative min-h-[270px] sm:min-h-[350px] lg:min-h-[430px]">
          <div className="grid h-full gap-4 lg:grid-cols-[1fr_0.42fr]">
            <div className="rounded-[22px] border border-white/10 bg-white/[0.055] p-5">
              <div className="grid h-64 place-items-center overflow-hidden rounded-[18px] bg-[#11141b] lg:h-80">
                <div className="relative h-44 w-72">
                  {[0, 1, 2].map((item) => (
                    <motion.div
                      key={item}
                      animate={reduceMotion ? undefined : { x: [item * 18, item * 18 + 28], rotate: [-2, 3] }}
                      {...loop}
                      className="absolute h-28 w-40 rounded-[20px] border border-white/10"
                      style={{
                        left: item * 52,
                        top: item * 24,
                        backgroundColor: item === 0 ? accent : hexToRgba(accent, 0.18 + item * 0.12),
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full" style={{ backgroundColor: accent }} />
                <div className="h-2 flex-1 rounded-full bg-white/10">
                  <motion.div
                    animate={reduceMotion ? undefined : { width: ['24%', '92%'] }}
                    {...loop}
                    className="h-full rounded-full"
                    style={{ backgroundColor: accent }}
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-3">
              {['Storyboard', 'Animation', 'Export'].map((item, index) => (
                <div key={item} className="rounded-[18px] border border-white/10 bg-black/12 p-4">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">0{index + 1}</div>
                  <div className="mt-3 text-lg font-black text-white">{item}</div>
                  <div className="mt-4 h-14 rounded-[14px]" style={{ backgroundColor: hexToRgba(accent, 0.14 + index * 0.08) }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {previewType === 'video' && (
        <div className="relative grid min-h-[270px] gap-4 sm:min-h-[350px] lg:min-h-[430px] lg:grid-cols-[1fr_0.38fr]">
          <div className="rounded-[22px] border border-white/10 bg-[#050608] p-5">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/55">
              <span>REC</span>
              <span>4K / 25FPS</span>
            </div>
            <div className="mt-5 grid h-64 place-items-center rounded-[18px] border border-white/10 lg:h-80">
              <div className="relative h-40 w-72 rounded-[28px] border border-white/16 bg-white/[0.04]">
                <div className="absolute inset-5 rounded-[20px] border border-dashed border-white/18" />
                <div className="absolute left-1/2 top-1/2 h-16 w-24 -translate-x-1/2 -translate-y-1/2 rounded-[16px]" style={{ backgroundColor: hexToRgba(accent, 0.78) }} />
                <motion.div
                  animate={reduceMotion ? undefined : { opacity: [0.35, 1], scale: [0.94, 1.04] }}
                  {...loop}
                  className="absolute right-6 top-6 h-3 w-3 rounded-full bg-red-500"
                />
              </div>
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-[22px] border border-white/10 bg-white/[0.055] p-5">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">Clapper</div>
              <div className="mt-6 overflow-hidden rounded-[16px] border border-white/10">
                <div className="h-10" style={{ background: `repeating-linear-gradient(135deg, ${accent} 0 14px, #ffffff 14px 28px)` }} />
                <div className="bg-black/24 p-4">
                  <div className="h-2 rounded-full bg-white/34" />
                  <div className="mt-3 h-2 w-2/3 rounded-full bg-white/16" />
                </div>
              </div>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/[0.055] p-5">
              <div className="flex h-20 items-end gap-1">
                {[38, 72, 46, 90, 58, 68, 42, 78].map((height, index) => (
                  <motion.span
                    key={index}
                    animate={reduceMotion ? undefined : { height: [height * 0.6, height] }}
                    {...loop}
                    className="w-full rounded-t"
                    style={{ backgroundColor: hexToRgba(accent, 0.32 + (index % 3) * 0.12), height }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {previewType === 'camera' && (
        <div className="relative grid min-h-[270px] gap-4 sm:min-h-[350px] lg:min-h-[430px] lg:grid-cols-[0.4fr_1fr]">
          <div className="rounded-[22px] border border-white/10 bg-white/[0.055] p-5">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">Lens Control</div>
            <div className="mt-10 grid place-items-center">
              <motion.div
                animate={reduceMotion ? undefined : { scale: [1, 1.08] }}
                {...loop}
                className="grid h-36 w-36 place-items-center rounded-full border-[14px]"
                style={{ borderColor: hexToRgba(accent, 0.72) }}
              >
                <div className="grid h-20 w-20 place-items-center rounded-full border border-white/20 bg-black/34">
                  <div className="h-8 w-8 rounded-full" style={{ backgroundColor: hexToRgba(accent, 0.7) }} />
                </div>
              </motion.div>
            </div>
            <div className="mt-10 grid gap-3">
              {['ISO 100', '90mm Macro', 'F8 Sharp'].map((item) => (
                <div key={item} className="rounded-[14px] border border-white/10 bg-black/16 px-4 py-3 text-xs font-black text-white/72">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="rounded-[22px] border border-white/10 bg-[#f4f0ea] p-5">
                <div className="grid h-32 place-items-center rounded-[18px] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] lg:h-40">
                  <motion.div
                    animate={reduceMotion ? undefined : { y: item % 2 ? [0, -8] : [0, 8] }}
                    {...loop}
                    className="h-20 w-20 rounded-[24px]"
                    style={{ backgroundColor: item % 2 ? accent : hexToRgba(accent, 0.42) }}
                  />
                </div>
                <div className="mt-4 h-2 rounded-full bg-[#11141b]/16" />
                <div className="mt-2 h-2 w-2/3 rounded-full bg-[#11141b]/10" />
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

const DEFAULT_PLAN_TOOL_ICONS = [
  Target,
  Users,
  TrendingUp,
  Sparkles,
  Palette,
  Code2,
  LayoutDashboard,
  Globe,
  Bot,
  Camera,
  Film,
  Zap,
];

const PROJECT_PLAN_TOOL_ICONS = {
  branding: [
    Search,
    UsersRound,
    BarChart3,
    BadgeCheck,
    SwatchBook,
    Type,
    PenTool,
    Layers,
    Presentation,
    BookOpenCheck,
    ShieldCheck,
    FileDown,
  ],
  websites: [
    Target,
    MapIcon,
    MousePointerClick,
    MonitorSmartphone,
    Smartphone,
    Code2,
    Database,
    Gauge,
    FileInput,
    ShieldCheck,
    Rocket,
    BarChart3,
  ],
  social: [
    Megaphone,
    UsersRound,
    MessageSquareText,
    CalendarDays,
    Lightbulb,
    PanelsTopLeft,
    PenTool,
    Target,
    Send,
    TrendingUp,
    BarChart3,
    WandSparkles,
  ],
  animation: [
    ScrollText,
    Clapperboard,
    PanelsTopLeft,
    User,
    Images,
    Mic2,
    Sparkles,
    WandSparkles,
    Zap,
    Scissors,
    Download,
    PackageCheck,
  ],
  promotional: [
    Lightbulb,
    Target,
    ScrollText,
    ClipboardList,
    MapPin,
    Sun,
    Camera,
    CircleDot,
    Scissors,
    SlidersHorizontal,
    Film,
    PackageCheck,
  ],
  photography: [
    PackageCheck,
    Brush,
    Sun,
    Camera,
    CircleDot,
    ImagePlus,
    Images,
    Search,
    BadgeCheck,
    SlidersHorizontal,
    Download,
    FileDown,
  ],
} as const;

function ProjectPlanBoard({
  currentLang,
  project,
  reduceMotion,
}: {
  currentLang: Language;
  project: PortfolioProjectLink;
  reduceMotion: boolean;
}) {
  const Icon = ICON_MAP[project.icon as keyof typeof ICON_MAP] || Globe;
  const isAr = currentLang === 'ar';
  const steps = isAr ? project.planStepsAr : project.planStepsEn;
  const title = isAr ? project.titleAr : project.titleEn;
  const planTools =
    PROJECT_PLAN_TOOL_ICONS[project.id as keyof typeof PROJECT_PLAN_TOOL_ICONS] ?? DEFAULT_PLAN_TOOL_ICONS;

  return (
    <motion.div
      data-project-plan-board="true"
      data-project-id={project.id}
      key={project.id}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.28, ease: 'easeOut' }}
      className="relative min-h-[320px] overflow-hidden rounded-[26px] border border-[#e8edf3] bg-white p-4 text-[#11141b] shadow-[0_18px_54px_rgba(17,20,27,0.08)] sm:min-h-[380px] sm:p-6"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)` }}
      />
      <div className={`relative flex items-start justify-between gap-4 ${isAr ? 'text-right' : 'text-left'}`}>
        <div className="min-w-0">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7a8795]">
            {isAr ? 'خطة الصفحة' : 'Page Plan'}
          </div>
          <h4 className="mt-2 text-xl font-black leading-tight text-[#11141b] sm:text-2xl">{title}</h4>
        </div>
        <div
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border"
          style={{
            borderColor: hexToRgba(project.accent, 0.24),
            backgroundColor: hexToRgba(project.accent, 0.08),
          }}
        >
          <Icon className="h-5 w-5" style={{ color: project.accent }} />
        </div>
      </div>

      <div className="relative mt-6 overflow-hidden rounded-[24px] border border-[#e8edf3] bg-[#f8fafc] p-3 sm:p-5">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${hexToRgba(project.accent, 0.12)}, transparent 44%)`,
          }}
        />
        <div className="relative">
          <div className={`mb-4 flex items-center justify-between gap-3 ${isAr ? 'text-right' : 'text-left'}`}>
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7a8795]">
                {isAr ? 'صندوق الأدوات' : 'Toolbox'}
              </div>
              <div className="mt-1 text-sm font-black text-[#11141b]">
                {isAr ? 'كل أداة تمثل مرحلة عمل' : 'Each tool represents a work stage'}
              </div>
            </div>
            <div
              className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl"
              style={{ backgroundColor: hexToRgba(project.accent, 0.1) }}
            >
              <Icon className="h-5 w-5" style={{ color: project.accent }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
            {steps.slice(0, 12).map((step, index) => {
              const ToolIcon = planTools[index % planTools.length];
  
            return (
              <motion.div
                key={step}
                data-plan-step="true"
                initial={false}
                animate={reduceMotion ? undefined : { y: [0, -4, 0], rotate: [0, index % 2 ? 0.45 : -0.45, 0] }}
                transition={{
                  delay: reduceMotion ? 0 : index * 0.035,
                  duration: reduceMotion ? 0 : 3.2 + (index % 4) * 0.35,
                  repeat: reduceMotion ? 0 : Infinity,
                  ease: 'easeInOut',
                }}
                className="group relative min-h-[106px] overflow-hidden rounded-[20px] border bg-white p-3 shadow-[0_10px_24px_rgba(17,20,27,0.055)] transition hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(17,20,27,0.1)] sm:min-h-[118px] sm:p-4"
                style={{
                  borderColor: hexToRgba(project.accent, index === 0 ? 0.34 : 0.18),
                }}
              >
                <div className={`absolute -top-9 h-20 w-20 rounded-full ${isAr ? '-left-9' : '-right-9'}`} style={{ backgroundColor: hexToRgba(project.accent, 0.07) }} />
                <div
                  className={`absolute top-3 h-6 w-6 rounded-full border border-white/80 ${isAr ? 'left-3' : 'right-3'}`}
                  style={{ backgroundColor: hexToRgba(project.accent, 0.12) }}
                />
                <div className={`relative flex h-full flex-col justify-between gap-3 ${isAr ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-start justify-between gap-2 ${isAr ? 'flex-row-reverse' : ''}`}>
                    <span
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-[16px] text-white shadow-[0_10px_22px_rgba(17,20,27,0.12)] sm:h-12 sm:w-12"
                      style={{ backgroundColor: project.accent }}
                    >
                      <ToolIcon className="h-5 w-5" />
                    </span>
                    <span
                      className="rounded-full px-2 py-1 text-[9px] font-black"
                      style={{
                        backgroundColor: hexToRgba(project.accent, 0.1),
                        color: project.accent,
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div>
                    <div className="text-[13px] font-black leading-5 text-[#11141b] sm:text-sm sm:leading-6">{step}</div>
                    <div
                      className={`mt-2 h-1.5 w-10 rounded-full transition group-hover:w-14 ${isAr ? 'mr-auto' : ''}`}
                      style={{ backgroundColor: project.accent }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
          </div>
        </div>
      </div>

      <div className="relative mt-5 flex items-center justify-center gap-2">
        {steps.slice(0, 12).map((step, index) => (
          <span
            key={`${step}-dot`}
            className="h-2 w-5 rounded-full sm:w-8"
            style={{ backgroundColor: index === 0 ? project.accent : hexToRgba(project.accent, 0.18) }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function ExecutiveProjectShowroom({
  currentLang,
  projects,
  onNavigate,
  copy
}: {
  currentLang: Language;
  projects: PortfolioProjectLink[];
  onNavigate: (project: PortfolioProjectLink) => void;
  copy: any;
}) {
  const reduceMotion = useReducedMotion();
  const [activeProjectId, setActiveProjectId] = useState(projects[0]?.id ?? '');
  const activeProject = projects.find((project) => project.id === activeProjectId) ?? projects[0];
  const isAr = currentLang === 'ar';
  const ActiveIcon = activeProject ? (ICON_MAP[activeProject.icon as keyof typeof ICON_MAP] || Globe) : Globe;

  if (!activeProject) return null;

  return (
    <div
      data-showroom-section="true"
      className="relative mx-auto mt-12 overflow-hidden rounded-[28px] border border-[#e8edf3] bg-white p-4 text-[#11141b] shadow-[0_28px_70px_rgba(17,20,27,0.1)] sm:p-6 lg:p-8"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, rgba(199,157,90,0.12), transparent 32%), linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%)',
        }}
      />

      <div className="relative z-10">
        <div className={`mb-5 flex items-center justify-between gap-4 ${isAr ? 'text-right' : 'text-left'}`}>
          <div className="min-w-0">
            <div className="text-[10px] font-black uppercase tracking-[0.22em] text-[#c79d5a]">Project Showroom</div>
            <div className="mt-2 truncate text-xl font-black text-[#11141b] sm:text-2xl">SELECT</div>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#e8edf3] bg-white shadow-sm">
            <img src="/logo.png" alt="SELECT" className="h-8 w-auto object-contain" />
          </div>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-[#e8edf3] bg-white p-3 shadow-[0_22px_54px_rgba(17,20,27,0.08)] sm:p-4">
          <motion.div
            key={activeProject.id}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.32, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-[20px] border border-[#e8edf3] bg-white p-5 sm:p-7"
          >
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 50% 35%, ${hexToRgba(activeProject.accent, 0.1)}, transparent 38%), linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)`,
              }}
            />

            <div className="relative flex min-h-[470px] flex-col justify-between gap-6 sm:min-h-[540px] lg:min-h-[600px]">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-[#e8edf3] bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#7a8795] shadow-sm">
                  {activeProject.signalLabel}
                </span>
                <span
                  className="rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em]"
                  style={{
                    backgroundColor: hexToRgba(activeProject.accent, 0.14),
                    color: activeProject.accent,
                  }}
                >
                  {activeProject.status === 'live' ? copy.liveLabel : copy.soonLabel}
                </span>
              </div>

              <div className="mx-auto w-full max-w-[760px] flex-1">
                <ProjectPlanBoard
                  currentLang={currentLang}
                  project={activeProject}
                  reduceMotion={Boolean(reduceMotion)}
                />
              </div>

              <div className={`grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end ${isAr ? 'text-right' : 'text-left'}`}>
                <div>
                  <div className={`flex items-center gap-3 ${isAr ? 'flex-row-reverse justify-start' : ''}`}>
                    <span
                      className="grid h-11 w-11 place-items-center rounded-2xl border"
                      style={{ backgroundColor: hexToRgba(activeProject.accent, 0.12) }}
                    >
                      <ActiveIcon className="h-5 w-5" style={{ color: activeProject.accent }} />
                    </span>
                    <h3 className="text-2xl font-black leading-tight text-[#11141b] sm:text-3xl">
                      {isAr ? activeProject.titleAr : activeProject.titleEn}
                    </h3>
                  </div>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6f7a86]">
                    {getProjectSceneCaption(activeProject, currentLang)}
                  </p>
                </div>
                <button
                  type="button"
                  data-showroom-open="true"
                  data-active-project-href={activeProject.href}
                  onClick={() => onNavigate(activeProject)}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] px-5 py-3 text-sm font-black text-white shadow-[0_16px_36px_rgba(17,20,27,0.16)] transition duration-300 hover:-translate-y-0.5"
                  style={{ backgroundColor: activeProject.accent }}
                >
                  <span>{copy.openAction}</span>
                  <ArrowRight className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {projects.map((project) => {
            const Icon = ICON_MAP[project.icon as keyof typeof ICON_MAP] || Globe;
            const active = project.id === activeProject.id;
            const title = isAr ? project.titleAr : project.titleEn;

            return (
              <button
                key={project.id}
                type="button"
                data-project-selector="true"
                data-project-id={project.id}
                data-project-href={project.href}
                onClick={() => setActiveProjectId(project.id)}
                onMouseEnter={() => setActiveProjectId(project.id)}
                onFocus={() => setActiveProjectId(project.id)}
                aria-pressed={active}
                aria-label={title}
                title={title}
                className={`grid h-12 w-12 place-items-center rounded-2xl border transition duration-300 sm:h-14 sm:w-14 ${
                  active ? 'bg-white text-[#11141b] shadow-[0_10px_24px_rgba(17,20,27,0.08)]' : 'bg-[#f8fafc] text-[#6f7a86] hover:bg-white'
                }`}
                style={{ borderColor: active ? hexToRgba(project.accent, 0.5) : '#e8edf3' }}
              >
                <Icon className="h-5 w-5" style={{ color: active ? project.accent : 'currentColor' }} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ServiceConstellationNode({
  currentLang,
  node,
  isLeft = false,
}: ServiceConstellationNodeProps) {
  const Icon = ICON_MAP[node.icon as keyof typeof ICON_MAP] || Globe;
  const title = currentLang === 'ar' ? node.titleAr : node.titleEn;
  const summary = currentLang === 'ar' ? node.summaryAr : node.summaryEn;

  return (
    <Link href={node.href} className="group relative block h-10 w-10">
      <div
        className="absolute inset-0 flex items-center justify-center rounded-full border transition-transform duration-300 group-hover:scale-110 group-hover:bg-white"
        style={{
          borderColor: hexToRgba(node.accent, 0.4),
          backgroundColor: hexToRgba(PALETTE.white, 0.66),
          boxShadow: `0 8px 26px ${hexToRgba(node.accent, 0.15)}`,
          zIndex: 10,
        }}
      >
        <Icon className="h-4 w-4 transition-transform duration-300" style={{ color: node.accent }} />
      </div>

      <div 
        className={`pointer-events-none absolute top-1/2 -translate-y-1/2 w-[140px] lg:w-[160px] rounded-xl bg-white/40 px-3 py-2 backdrop-blur-sm transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:bg-white/90 ${
          isLeft ? 'right-[calc(100%+14px)] text-right' : 'left-[calc(100%+14px)] text-left'
        }`}
      >
        <h3 className="text-sm font-black leading-tight transition-colors duration-300" style={{ color: node.accent }}>{title}</h3>
        <p className="mt-1 text-[11px] leading-4" style={{ color: hexToRgba(PALETTE.graphiteSoft, 0.84) }}>
          {summary}
        </p>
      </div>
    </Link>
  );
}

export default function PortfolioNetworkPage({
  currentLang,
  setActiveTab,
}: PortfolioNetworkPageProps) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [dynamicTeamNodes, setDynamicTeamNodes] = useState<PortfolioTeamNode[]>(portfolioTeamNodes);
  const [cmsProjectLinks, setCmsProjectLinks] = useState<PortfolioProjectLink[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/team`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const parsedData = data.map((item: any) => ({
            ...item,
            id: item.id.toString(),
            projectTags: item.projectTags ? JSON.parse(item.projectTags) : [],
          }));
          setDynamicTeamNodes(parsedData);
        }
      })
      .catch(err => console.error('Failed to load team data:', err));
  }, []);

  useEffect(() => {
    let active = true;
    const loadPortfolioProjects = async () => {
      const data = await siteFetch<any[]>('/portfolio');
      if (!active || !data?.length) return;
      const accents = ['#9d027c', '#d4a24c', '#c98534', '#b45d76', '#5c7b78', '#556274'];
      setCmsProjectLinks(data.slice(0, 8).map((project, index) => {
        const isBranding = project.category === 'branding';
        const isWeb = project.category === 'web';
        const isSocial = project.category === 'social' || project.category === 'marketing';
        const href = project.link || (isBranding ? '/branding' : isWeb ? '/websites' : isSocial ? '/social-media' : '/portfolio');
        return {
          id: `cms-${project.id}`,
          titleAr: project.titleAr || project.titleEn || `مشروع ${index + 1}`,
          titleEn: project.titleEn || project.titleAr || `Project ${index + 1}`,
          href,
          status: 'live',
          icon: isBranding ? 'Palette' : isWeb ? 'Globe' : isSocial ? 'Share2' : 'Sparkles',
          accent: accents[index % accents.length],
          eyebrowAr: project.clientName || 'CMS Project',
          eyebrowEn: project.clientName || 'CMS Project',
          summaryAr: project.descAr || project.descEn || 'مشروع حقيقي من لوحة التحكم.',
          summaryEn: project.descEn || project.descAr || 'Real project from the admin panel.',
          planStepsAr: ['رفع الصور', 'تنظيم Drive', 'مراجعة المحتوى', 'النشر'],
          planStepsEn: ['Upload assets', 'Organize Drive', 'Review content', 'Publish'],
          previewType: isBranding ? 'identity' : isWeb ? 'website' : isSocial ? 'social' : 'camera',
          signalLabel: project.category || 'CMS',
          routeTab: isBranding ? 'branding' : isWeb ? 'projects-websites' : isSocial ? 'projects-social' : 'portfolio',
        } satisfies PortfolioProjectLink;
      }));
    };
    loadPortfolioProjects();
    return () => { active = false; };
  }, []);

  const [activeNodeId, setActiveNodeId] = useState(portfolioTeamNodes[0]?.id ?? '');
  const [hoveredServiceId, setHoveredServiceId] = useState<string | null>(null);
  const [mobileSheetNodeId, setMobileSheetNodeId] = useState<string | null>(null);
  const [pulseKey, setPulseKey] = useState(0);
  const copy = portfolioPageCopy[currentLang];
  const totalTeamCount = portfolioTeamNodes.length;
  const displayProjectLinks = cmsProjectLinks.length ? [...cmsProjectLinks, ...portfolioProjectLinks] : portfolioProjectLinks;

  const spriteRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const pulsePathRef = useRef<SVGPathElement | null>(null);
  const animatedStatesRef = useRef<Record<string, AnimatedNodeState>>({});
  
  const serviceSpriteRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const servicePathRefs = useRef<Record<string, SVGPathElement | null>>({});
  const serviceAnimatedStatesRef = useRef<Record<string, { offsetX: number; offsetY: number }>>({});
  
  const activeNodeIdRef = useRef(activeNodeId);

  useEffect(() => {
    activeNodeIdRef.current = activeNodeId;
  }, [activeNodeId]);

  useEffect(() => {
    const updateViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);


  useEffect(() => {
    if (!isMobile) {
      setMobileSheetNodeId(null);
    }
  }, [isMobile]);

  const stageOrigin = useMemo<StageOrigin>(() => (
    isMobile ? { x: 500, y: 486 } : { x: 532, y: 592 }
  ), [isMobile]);

  const positionedNodes = useMemo<PositionedNode[]>(() => {
    const grouped = new Map<PortfolioTeamNode['ring'], PortfolioTeamNode[]>();

    dynamicTeamNodes.forEach((node) => {
      const list = grouped.get(node.ring) ?? [];
      list.push(node);
      grouped.set(node.ring, list);
    });

    const ellipse = isMobile ? 0.74 : 0.82;
    const radii = isMobile
      ? { 0: 0, 1: 166, 2: 292, 3: 408 }
      : { 0: 0, 1: 186, 2: 314, 3: 440 };
    const offsets = isMobile
      ? { 0: -90, 1: -100, 2: -82, 3: -90 }
      : { 0: -90, 1: -102, 2: -78, 3: -88 };

    return Array.from(grouped.entries())
      .sort(([ringA], [ringB]) => ringA - ringB)
      .flatMap(([ring, nodes]) => {
        const ordered = [...nodes].sort((a, b) => a.order - b.order);
        if (ring === 0) {
          return ordered.map((node) => ({
            ...node,
            anchorX: stageOrigin.x,
            anchorY: stageOrigin.y,
          }));
        }

        const count = ordered.length;
        const angleStep = 360 / count;

        return ordered.map((node, index) => {
          const radialOffset =
            ring === 3
              ? (index % 2 === 0 ? -22 : 16)
              : ring === 2
                ? (index % 2 === 0 ? -12 : 10)
                : 0;
          const radius = radii[ring] + radialOffset;
          const angle = offsets[ring] + angleStep * index + (ring === 2 ? angleStep * 0.18 : 0);
          const radians = (angle * Math.PI) / 180;
          const anchorX = stageOrigin.x + Math.cos(radians) * radius;
          const anchorY = stageOrigin.y + Math.sin(radians) * radius * ellipse;

          return {
            ...node,
            anchorX,
            anchorY,
          };
        });
      });
  }, [isMobile, stageOrigin.x, stageOrigin.y, dynamicTeamNodes]);

  const interactionClusterMap = useMemo(() => {
    const map = new Map<string, string[]>();

    positionedNodes.forEach((node) => {
      const nearest = positionedNodes
        .filter((candidate) => candidate.id !== node.id)
        .sort((a, b) => {
          const distA = Math.hypot(a.anchorX - node.anchorX, a.anchorY - node.anchorY);
          const distB = Math.hypot(b.anchorX - node.anchorX, b.anchorY - node.anchorY);
          return distA - distB;
        })
        .slice(0, node.ring <= 1 ? 5 : 4)
        .map((candidate) => candidate.id);

      map.set(node.id, nearest);
    });

    return map;
  }, [positionedNodes]);

  const activeClusterIds = useMemo(() => (
    new Set(interactionClusterMap.get(activeNodeId) ?? [])
  ), [activeNodeId, interactionClusterMap]);

  const nodeViewModels = useMemo<NetworkNodeViewModel[]>(
    () =>
      positionedNodes.map((node) => ({
        ...node,
        name: currentLang === 'ar' ? node.nameAr : node.nameEn,
        title: currentLang === 'ar' ? node.titleAr : node.titleEn,
        accentColor: node.accent ?? PALETTE.plum,
        metrics: getNodeMetrics(node.ring, isMobile),
        isActive: node.id === activeNodeId,
        isClusterNode: activeClusterIds.has(node.id),
        priorityOpacity: isMobile
          ? node.id === activeNodeId
            ? 1
            : node.ring === 3
              ? 0.82
              : 0.94
          : node.ring === 3
            ? 0.94
            : 1,
      })),
    [activeClusterIds, activeNodeId, currentLang, isMobile, positionedNodes]
  );

  const activeNode = nodeViewModels.find((node) => node.id === activeNodeId) ?? nodeViewModels[0] ?? null;
  const activeMobileNode = nodeViewModels.find((node) => node.id === mobileSheetNodeId) ?? activeNode;

  const pulsePath = useMemo(() => {
    if (!activeNode || activeNode.ring === 0) return '';
    return buildConnectionPath(stageOrigin, activeNode.anchorX, activeNode.anchorY, activeNode.ring);
  }, [activeNode, stageOrigin]);

  const focusOrigin = activeNode
    ? `${(activeNode.anchorX / STAGE_VIEWBOX) * 100}% ${(activeNode.anchorY / STAGE_VIEWBOX) * 100}%`
    : '50% 50%';

  const stageScale = reduceMotion ? 1 : isMobile ? 1.02 : 1.01;
  const servicePositions = useMemo(() => getServicePositions(isMobile), [isMobile]);
  const serviceLines = useMemo(() => {
    if (isMobile) return [];
    
    const lines = [];
    portfolioServiceNodes.forEach((node) => {
      lines.push({
        accent: node.accent,
        from: { x: 50, y: 50 },
        id: `line-center-${node.id}`,
        to: servicePositions[node.id],
        nodeId: node.id,
        nodeId2: null,
      });
    });

    const groups = ['software', 'media', 'growth'];
    groups.forEach((group) => {
      const groupNodes = portfolioServiceNodes.filter((n) => n.group === group);
      for (let i = 0; i < groupNodes.length; i++) {
        const current = groupNodes[i];
        const next = groupNodes[(i + 1) % groupNodes.length];
        lines.push({
          accent: current.accent,
          from: servicePositions[current.id],
          id: `line-ring-${current.id}-${next.id}`,
          to: servicePositions[next.id],
          nodeId: current.id,
          nodeId2: next.id,
        });
      }
    });
    return lines;
  }, [isMobile, servicePositions]);

  const registerServiceSpriteRef = useCallback((nodeId: string, element: HTMLDivElement | null) => {
    serviceSpriteRefs.current[nodeId] = element;
  }, []);

  const registerServicePathRef = useCallback((lineId: string, element: SVGPathElement | null) => {
    servicePathRefs.current[lineId] = element;
  }, []);

  useEffect(() => {
    portfolioServiceNodes.forEach((node) => {
      if (!serviceAnimatedStatesRef.current[node.id]) {
        serviceAnimatedStatesRef.current[node.id] = { offsetX: 0, offsetY: 0 };
      }
    });
  }, []);

  const registerSpriteRef = useCallback((nodeId: string, element: HTMLDivElement | null) => {
    spriteRefs.current[nodeId] = element;
  }, []);

  const registerPathRef = useCallback((nodeId: string, element: SVGPathElement | null) => {
    pathRefs.current[nodeId] = element;
  }, []);

  useEffect(() => {
    const nextState: Record<string, AnimatedNodeState> = {};

    positionedNodes.forEach((node, index) => {
      const previous = animatedStatesRef.current[node.id];
      nextState[node.id] = previous ?? {
        currentX: node.anchorX,
        currentY: node.anchorY,
        offsetX: 0,
        offsetY: 0,
        seed: (index + 1) * 0.83,
      };
    });

    animatedStatesRef.current = nextState;
  }, [positionedNodes]);

  useEffect(() => {
    const applyImmediateState = () => {
      positionedNodes.forEach((node) => {
        const state = animatedStatesRef.current[node.id];
        if (!state) return;

        state.currentX = node.anchorX;
        state.currentY = node.anchorY;
        state.offsetX = 0;
        state.offsetY = 0;

        const sprite = spriteRefs.current[node.id];
        if (sprite) {
          sprite.style.transform = 'translate3d(0px, 0px, 0px)';
        }

        const path = pathRefs.current[node.id];
        if (path && node.ring !== 0) {
          path.setAttribute('d', buildConnectionPath(stageOrigin, node.anchorX, node.anchorY, node.ring));
        }
      });

      if (pulsePathRef.current && activeNode && activeNode.ring !== 0) {
        pulsePathRef.current.setAttribute('d', buildConnectionPath(stageOrigin, activeNode.anchorX, activeNode.anchorY, activeNode.ring));
      }
    };

    applyImmediateState();
    if (reduceMotion) return;

    let frameId = 0;

    const renderFrame = (time: number) => {
      const activeId = activeNodeIdRef.current;
      const activeCluster = new Set(interactionClusterMap.get(activeId) ?? []);
      const activeState = animatedStatesRef.current[activeId];
      const smoothedActiveState = activeState
        ? {
            x: activeState.currentX,
            y: activeState.currentY,
          }
        : null;

      positionedNodes.forEach((node) => {
        const state = animatedStatesRef.current[node.id];
        if (!state) return;

        const baseAmplitude = node.ring === 0 ? 1.35 : node.ring === 1 ? 4.8 : node.ring === 2 ? 2.9 : 1.75;
        const speed = node.ring === 0 ? 0.00018 : node.ring === 1 ? 0.00022 : node.ring === 2 ? 0.00016 : 0.00013;
        let targetX =
          Math.sin(time * speed + state.seed * 1.2) * baseAmplitude +
          Math.cos(time * speed * 0.62 + state.seed * 0.6) * baseAmplitude * 0.5;
        let targetY =
          Math.cos(time * speed * 0.86 + state.seed * 1.4) * baseAmplitude * 0.82 +
          Math.sin(time * speed * 0.48 + state.seed * 0.78) * baseAmplitude * 0.36;

        if (activeId === node.id) {
          targetX += Math.sin(time * 0.00145 + state.seed) * (node.ring === 0 ? 0.9 : 2.8);
          targetY += Math.cos(time * 0.0011 + state.seed * 1.6) * (node.ring === 0 ? 1.2 : 3.2);
        } else if (smoothedActiveState && activeCluster.has(node.id)) {
          const dx = smoothedActiveState.x - node.anchorX;
          const dy = smoothedActiveState.y - node.anchorY;
          const distance = Math.max(Math.hypot(dx, dy), 1);
          const pull = node.ring === 1 ? 5.6 : node.ring === 2 ? 4.2 : 3;
          targetX += (dx / distance) * pull;
          targetY += (dy / distance) * pull * 0.9;
        } else if (smoothedActiveState && node.ring === 3) {
          const dx = smoothedActiveState.x - node.anchorX;
          const dy = smoothedActiveState.y - node.anchorY;
          const distance = Math.max(Math.hypot(dx, dy), 1);
          const repel = clamp(120 / distance, 0, 0.6);
          targetX -= (dx / distance) * repel;
          targetY -= (dy / distance) * repel;
        }

        const damping = node.ring === 0 ? 0.08 : node.ring === 1 ? 0.092 : node.ring === 2 ? 0.082 : 0.074;
        state.offsetX += (targetX - state.offsetX) * damping;
        state.offsetY += (targetY - state.offsetY) * damping;
        state.currentX = node.anchorX + state.offsetX;
        state.currentY = node.anchorY + state.offsetY;

        const sprite = spriteRefs.current[node.id];
        if (sprite) {
          sprite.style.transform = `translate3d(${state.offsetX}px, ${state.offsetY}px, 0px)`;
        }

        const path = pathRefs.current[node.id];
        if (path && node.ring !== 0) {
          path.setAttribute('d', buildConnectionPath(stageOrigin, state.currentX, state.currentY, node.ring));
        }
      });

      if (pulsePathRef.current && activeId) {
        const node = positionedNodes.find((entry) => entry.id === activeId);
        const state = node ? animatedStatesRef.current[node.id] : null;
        if (node && state && node.ring !== 0) {
          pulsePathRef.current.setAttribute('d', buildConnectionPath(stageOrigin, state.currentX, state.currentY, node.ring));
        }
      }

      // -----------------------------------------------------
      // Floating animation for Services
      // -----------------------------------------------------
      portfolioServiceNodes.forEach((node, index) => {
        const type = index % 3;
        const durations = [12000, 14000, 16000];
        const duration = durations[type];
        const t = (time % duration) / duration;
        
        let offsetX = 0;
        let offsetY = 0;
        if (type === 0) {
           offsetX = Math.sin(t * Math.PI * 2) * 8;
           offsetY = Math.cos(t * Math.PI * 2) * 12;
        } else if (type === 1) {
           offsetX = Math.sin(t * Math.PI * 2) * -10;
           offsetY = Math.cos(t * Math.PI * 2) * -14;
        } else {
           offsetX = Math.sin(t * Math.PI * 2) * -14;
           offsetY = Math.cos(t * Math.PI * 2) * 10;
        }

        const state = serviceAnimatedStatesRef.current[node.id];
        if (state) {
          state.offsetX = offsetX;
          state.offsetY = offsetY;
        }

        const sprite = serviceSpriteRefs.current[node.id];
        if (sprite) {
          sprite.style.transform = `translate(-50%, -50%) translate3d(${offsetX}px, ${offsetY}px, 0)`;
        }
      });

      // Update Service Lines
      serviceLines.forEach((line) => {
        const path = servicePathRefs.current[line.id];
        if (path) {
          const toState = serviceAnimatedStatesRef.current[line.nodeId];
          const toX = line.to.x * 10 + (toState?.offsetX || 0) * 0.75; // Approx pixel to 1000 viewBox ratio
          const toY = line.to.y * 10 + (toState?.offsetY || 0) * 1.0;
          
          let fromX = 500, fromY = 500;
          if (line.nodeId2) {
             const fromState = serviceAnimatedStatesRef.current[line.nodeId2];
             fromX = line.from.x * 10 + (fromState?.offsetX || 0) * 0.75;
             fromY = line.from.y * 10 + (fromState?.offsetY || 0) * 1.0;
          }

          const dx = toX - fromX;
          const dy = toY - fromY;
          const controlX = fromX + dx * 0.5 + (dy > 0 ? -40 : 40);
          const controlY = fromY + dy * 0.5 - (dx > 0 ? 40 : -40);
          path.setAttribute('d', `M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`);
        }
      });

      frameId = window.requestAnimationFrame(renderFrame);
    };

    frameId = window.requestAnimationFrame(renderFrame);
    return () => window.cancelAnimationFrame(frameId);
  }, [activeNode, interactionClusterMap, positionedNodes, reduceMotion, stageOrigin]);

  const handleNodeActivate = useCallback((nodeId: string) => {
    setActiveNodeId((currentId) => {
      if (currentId !== nodeId) {
        setPulseKey((currentPulse) => currentPulse + 1);
        return nodeId;
      }

      return currentId;
    });
  }, []);

  const handleNodeOpenDetails = useCallback((nodeId: string) => {
    handleNodeActivate(nodeId);
    if (isMobile) {
      setMobileSheetNodeId(nodeId);
    }
  }, [handleNodeActivate, isMobile]);

  const handleProjectNavigation = useCallback((project: PortfolioProjectLink) => {
    if (/^https?:\/\//i.test(project.href)) {
      window.open(project.href, '_blank', 'noopener,noreferrer');
      return;
    }

    const targetTab = getProjectTab(project.href, project);
    if (targetTab) {
      setActiveTab(targetTab);
    }

    router.push(project.href);
  }, [setActiveTab, router]);

  return (
    <div className="relative overflow-hidden bg-[#f4f6f8] text-[#11141b]">
      <style>{`
        @keyframes portfolio-pulse-sweep {
          0% {
            opacity: 0;
            transform: translate3d(-14px, 10px, 0) scale(0.96);
          }
          42% {
            opacity: 0.16;
          }
          68% {
            opacity: 0.08;
          }
          100% {
            opacity: 0;
            transform: translate3d(18px, -14px, 0) scale(1.04);
          }
        }

        .portfolio-soft-sweep {
          animation: portfolio-pulse-sweep 18s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .portfolio-soft-sweep {
            animation: none !important;
          }
        }
      `}</style>

      <section className="relative overflow-hidden px-4 pb-24 pt-24 sm:px-6 lg:px-10 lg:pt-32">
        <div
          className="absolute inset-x-0 top-0 h-[60%]"
          style={{
            background:
              'linear-gradient(180deg, rgba(238,243,248,0.86) 0%, rgba(244,246,248,0) 100%)',
          }}
        />
        <div className="relative mx-auto max-w-[1320px]">
          <div className="max-w-3xl">
            <div className="text-[11px] font-black uppercase tracking-[0.24em] text-[#5b6978]">
              {currentLang === 'ar' ? 'شبكة الخدمات' : 'Service Network'}
            </div>
            <h2 className="mt-4 text-[clamp(1.85rem,4vw,2.65rem)] font-black tracking-normal leading-[1.22] text-[#11141b]">
              {copy.servicesTitle}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#465463] sm:text-base">
              {copy.servicesLead}
            </p>
          </div>

          <div className="relative mt-14 min-h-[560px] overflow-hidden rounded-[36px] border px-4 py-8 sm:px-8 lg:min-h-[800px]" style={{ borderColor: hexToRgba(PALETTE.steelSoft, 0.64) }}>
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.82), rgba(238,243,248,0.8) 44%, rgba(244,246,248,0.86) 100%)',
              }}
            />
            
            {!isMobile && (
              <>
                <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
                  <ellipse cx="500" cy="500" rx="180" ry="200" fill="none" stroke={hexToRgba(PALETTE.steel, 0.08)} strokeDasharray="4 12" />
                  <ellipse cx="500" cy="500" rx="280" ry="300" fill="none" stroke={hexToRgba(PALETTE.steel, 0.06)} strokeDasharray="4 16" />
                  <ellipse cx="500" cy="500" rx="380" ry="400" fill="none" stroke={hexToRgba(PALETTE.steel, 0.04)} strokeDasharray="4 20" />
                  
                  {serviceLines.map((line) => {
                    const isActive = hoveredServiceId === line.nodeId || hoveredServiceId === line.nodeId2;
                    return (
                      <path
                        key={line.id}
                        ref={(el) => registerServicePathRef(line.id, el)}
                        d={buildServicePath(line.from, line.to)}
                        fill="none"
                        stroke={isActive ? line.accent : hexToRgba(PALETTE.steel, 0.15)}
                        strokeWidth={isActive ? "2" : "1"}
                        strokeLinecap="round"
                        className="transition-all duration-300"
                        style={{ filter: isActive ? `drop-shadow(0 0 6px ${hexToRgba(line.accent, 0.4)})` : 'none' }}
                      />
                    );
                  })}
                </svg>

                <div 
                  className="absolute left-1/2 top-1/2 z-20 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white transition-all duration-500" 
                  style={{ 
                    boxShadow: hoveredServiceId ? `0 0 40px ${hexToRgba(PALETTE.steel, 0.15)}` : `0 20px 40px ${hexToRgba(PALETTE.steel, 0.1)}`,
                    border: `1px solid ${hexToRgba(PALETTE.steel, 0.1)}`
                  }}
                >
                  <img src="/logo.png" alt="SELECT" className="w-16 object-contain" />
                </div>

                {portfolioServiceNodes.map((node) => {
                  const pos = servicePositions[node.id];
                  const isLeft = pos ? pos.x < 50 : false;
                  return (
                    <div
                      key={node.id}
                      ref={(el) => registerServiceSpriteRef(node.id, el)}
                      className="absolute z-10 hover:z-30"
                      style={{
                        left: `${pos?.x}%`,
                        top: `${pos?.y}%`,
                        transform: hoveredServiceId && hoveredServiceId !== node.id ? 'translate(-50%, -50%) scale(0.95)' : 'translate(-50%, -50%) scale(1)'
                      }}
                      onMouseEnter={() => setHoveredServiceId(node.id)}
                      onMouseLeave={() => setHoveredServiceId(null)}
                    >
                      <ServiceConstellationNode currentLang={currentLang} node={node} isLeft={isLeft} />
                    </div>
                  );
                })}
              </>
            )}

            {isMobile && (
              <div className="relative z-10 mx-auto flex flex-col gap-10 pb-6 pt-4">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl">
                  <img src="/logo.png" alt="SELECT" className="w-12 object-contain" />
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  {portfolioServiceNodes.map((node) => (
                    <div key={node.id} className="flex justify-center w-full">
                      <ServiceConstellationNode currentLang={currentLang} node={node} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>



      <section className="relative overflow-hidden bg-[#f4f6f8]">
        <div
          className="absolute inset-0 opacity-100"
          style={{
            background:
              'linear-gradient(90deg, rgba(109,127,144,0.08) 1px, transparent 1px), linear-gradient(rgba(109,127,144,0.08) 1px, transparent 1px), radial-gradient(circle at 18% 26%, rgba(122,63,242,0.08), transparent 28%), radial-gradient(circle at 72% 20%, rgba(199,157,90,0.12), transparent 32%), radial-gradient(circle at 54% 58%, rgba(255,255,255,0.96), rgba(244,246,248,0.88) 48%, #eef2f5 100%)',
            backgroundSize: '72px 72px, 72px 72px, auto, auto, auto',
          }}
        />
        <div
          className="portfolio-soft-sweep pointer-events-none absolute inset-y-[14%] right-[12%] w-[26rem] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(122,63,242,0.12), transparent 72%)' }}
        />
        <div
          className="portfolio-soft-sweep pointer-events-none absolute left-[10%] top-[28%] h-[22rem] w-[22rem] rounded-full blur-3xl"
          style={{ animationDelay: '-7s', background: 'radial-gradient(circle, rgba(199,157,90,0.12), transparent 70%)' }}
        />

        <div className="relative mx-auto max-w-[1600px] px-4 pb-12 pt-16 sm:px-6 lg:px-10 lg:pb-16 lg:pt-20">
          <div className="relative lg:min-h-[calc(100svh-8rem)]">


            <div className="relative mt-10 min-h-[620px] lg:mt-0 lg:h-[calc(100svh-8rem)] lg:min-h-[900px]">
              <div className="relative h-full lg:absolute lg:inset-0">


                <div
                  className="relative h-[62svh] min-h-[560px] w-full sm:min-h-[720px] lg:h-full lg:min-h-[900px]"
                  style={{ touchAction: 'pan-y' }}
                >
                  <div
                    className="pointer-events-none absolute inset-[8%_3%_10%_3%] rounded-[40px]"
                    style={{
                      border: `1px solid ${hexToRgba(PALETTE.steelSoft, 0.46)}`,
                      background:
                        'linear-gradient(180deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.08) 100%)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.42)',
                    }}
                  />

                  <motion.div
                    className="absolute inset-0"
                    animate={{ scale: stageScale }}
                    style={{ transformOrigin: focusOrigin }}
                    transition={{ duration: reduceMotion ? 0 : 0.32, ease: 'easeOut' }}
                  >
                    <svg
                      viewBox={`0 0 ${STAGE_VIEWBOX} ${STAGE_VIEWBOX}`}
                      className="pointer-events-none absolute inset-0 h-full w-full"
                      aria-hidden="true"
                    >
                      <defs>
                        <radialGradient id="portfolio-center-glow" cx="50%" cy="50%" r="60%">
                          <stop offset="0%" stopColor={PALETTE.white} stopOpacity="0.92" />
                          <stop offset="45%" stopColor={PALETTE.gold} stopOpacity="0.1" />
                          <stop offset="100%" stopColor={PALETTE.gold} stopOpacity="0" />
                        </radialGradient>
                        <linearGradient id="portfolio-axis" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={hexToRgba(PALETTE.steel, 0)} />
                          <stop offset="50%" stopColor={hexToRgba(PALETTE.steel, 0.24)} />
                          <stop offset="100%" stopColor={hexToRgba(PALETTE.steel, 0)} />
                        </linearGradient>
                      </defs>

                      <circle cx={stageOrigin.x} cy={stageOrigin.y} r="122" fill="url(#portfolio-center-glow)" />
                      {[196, 328, 454].map((radius, index) => (
                        <ellipse
                          key={radius}
                          cx={stageOrigin.x}
                          cy={stageOrigin.y}
                          rx={radius}
                          ry={radius * (isMobile ? 0.78 : 0.82)}
                          fill="none"
                          stroke={index === 0 ? 'rgba(122,63,242,0.14)' : 'rgba(109,127,144,0.13)'}
                          strokeDasharray={index === 2 ? '4 20' : '8 24'}
                        />
                      ))}

                      <line
                        x1={stageOrigin.x - 420}
                        y1={stageOrigin.y}
                        x2={stageOrigin.x + 420}
                        y2={stageOrigin.y}
                        stroke="url(#portfolio-axis)"
                        strokeWidth="1"
                      />
                      <line
                        x1={stageOrigin.x}
                        y1={stageOrigin.y - 420}
                        x2={stageOrigin.x}
                        y2={stageOrigin.y + 420}
                        stroke="url(#portfolio-axis)"
                        strokeWidth="1"
                      />

                      {nodeViewModels
                        .filter((node) => node.ring !== 0)
                        .map((node) => (
                          <path
                            key={`line-${node.id}`}
                            ref={(element) => registerPathRef(node.id, element)}
                            d={buildConnectionPath(stageOrigin, node.anchorX, node.anchorY, node.ring)}
                            fill="none"
                            stroke={
                              node.isActive
                                ? hexToRgba(node.accentColor, 0.46)
                                : node.isClusterNode
                                  ? hexToRgba(node.accentColor, 0.28)
                                  : hexToRgba(PALETTE.steel, 0.18)
                            }
                            strokeWidth={node.isActive ? 2.6 : node.isClusterNode ? 1.6 : 1}
                            strokeLinecap="round"
                          />
                        ))}

                      {activeNode && activeNode.ring !== 0 && (
                        <motion.path
                          ref={pulsePathRef}
                          key={`${activeNode.id}-${pulseKey}`}
                          d={pulsePath}
                          fill="none"
                          stroke={hexToRgba(PALETTE.gold, 0.78)}
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeDasharray="14 28"
                          initial={{ opacity: 0, strokeDashoffset: 0 }}
                          animate={{ opacity: [0, 1, 0], strokeDashoffset: [0, -38] }}
                          transition={{ duration: 1.05, ease: 'easeOut' }}
                        />
                      )}
                    </svg>

                    {nodeViewModels.map((node) => (
                      <NetworkNodeButton
                        key={node.id}
                        currentLang={currentLang}
                        node={node}
                        onActivate={handleNodeActivate}
                        onOpenDetails={handleNodeOpenDetails}
                        registerSpriteRef={registerSpriteRef}
                      />
                    ))}
                  </motion.div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export function ProjectShowcaseSection({ currentLang, setActiveTab }: { currentLang: Language; setActiveTab: (tab: string) => void }) {
  const router = useRouter();
  const copy = portfolioPageCopy[currentLang];
  const displayProjectLinks = portfolioProjectLinks;

  const handleProjectNavigation = useCallback((project: PortfolioProjectLink) => {
    const targetTab = getProjectTab(project.href, project);
    if (targetTab) {
      setActiveTab(targetTab);
    }
    router.push(project.href);
  }, [setActiveTab, router]);

  return (
    <section className="relative px-4 py-20 sm:px-6 lg:px-10 lg:py-24 bg-transparent border-t border-violet-950/30" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-[1320px]">
        <div className="max-w-3xl">
          <div className="text-[11px] font-black uppercase tracking-[0.24em] text-violet-400">
            {currentLang === 'ar' ? 'تصفح مشروعاتنا' : 'Project Tracks'}
          </div>
          <h2 
            className="mt-4 text-[clamp(1.85rem,4vw,2.65rem)] font-black tracking-normal leading-[1.22] text-transparent bg-clip-text drop-shadow-md"
            style={{
              backgroundImage: 'linear-gradient(90deg, #9d027c, #f43f5e, #ffbc01, #f43f5e, #9d027c)',
              backgroundSize: '200% auto',
              animation: 'gradient-melt 4s linear infinite'
            }}
          >
            {copy.browseTitle}
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
            {copy.browseLead}
          </p>
        </div>

        <ExecutiveProjectShowroom 
          currentLang={currentLang} 
          projects={displayProjectLinks} 
          onNavigate={handleProjectNavigation} 
          copy={copy} 
        />
      </div>
    </section>
  );
}
