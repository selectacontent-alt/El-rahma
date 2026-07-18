"use client";

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  targetAlpha: number;
}

export default function InteractiveConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, radius: 140 });

  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 768);
    }
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const maxParticles = window.innerWidth < 768 ? 70 : 120; // Lowered significantly for performance
    const connectionDistance = window.innerWidth < 768 ? 70 : 110;
    const maxConnections = window.innerWidth < 768 ? 1 : 2; // Heavily restricted to keep 60fps with high particle count

    // Color palette matching the brand's purple and yellow only
    const colors = [
      'rgba(157, 2, 124,', // Purple brand #9d027c
      'rgba(245, 158, 11,' // Yellow/Amber
    ];

    let logoPoints: {x: number, y: number}[] = [];

    // --- LOGO PIXEL SCANNING ---
    // Loads the actual logo image and extracts its exact pixel map to use as targets
    const loadLogo = () => {
      const img = new Image();
      img.src = '/logo.png';
      img.onload = () => {
        const offCanvas = document.createElement('canvas');
        const offCtx = offCanvas.getContext('2d');
        if (!offCtx) return;
        
        const targetSize = 120; // Resolution of the pixel map
        offCanvas.width = targetSize;
        offCanvas.height = targetSize;
        
        const scale = Math.min(targetSize / img.width, targetSize / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (targetSize - w) / 2;
        const y = (targetSize - h) / 2;
        
        offCtx.drawImage(img, x, y, w, h);
        const imgData = offCtx.getImageData(0, 0, targetSize, targetSize).data;
        const points = [];
        
        for (let py = 0; py < targetSize; py += 2) {
          for (let px = 0; px < targetSize; px += 2) {
            const alpha = imgData[(py * targetSize + px) * 4 + 3];
            if (alpha > 128) {
              points.push({ x: px - targetSize / 2, y: py - targetSize / 2 });
            }
          }
        }
        
        // Shuffle points to distribute particles smoothly over the logo
        for (let i = points.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [points[i], points[j]] = [points[j], points[i]];
        }
        logoPoints = points;
      };
    };
    loadLogo();
    // ---------------------------

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const w = canvas.width;
      const h = canvas.height;
      for (let i = 0; i < maxParticles; i++) {
        const radius = Math.random() * 2 + 1.2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const startX = Math.random() * w;
        const startY = Math.random() * h;
        particles.push({
          x: startX,
          y: startY,
          baseX: startX,
          baseY: startY,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius,
          color,
          alpha: Math.random() * 0.5 + 0.1,
          targetAlpha: Math.random() * 0.5 + 0.1
        });
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const mouse = mouseRef.current;
      const timeIdle = Date.now() - lastMouseMoveTime;
      const isIdle = timeIdle > 500 && mouse.x !== -1000;
      const isHoveringBtn = (mouseRef.current as any).isHoveringButton;
      const isFormingShape = isHoveringBtn || isIdle;

      // Update and draw particles
      particles.forEach((p, idx) => {
        // Move base particle
        p.baseX += p.vx;
        p.baseY += p.vy;

        // Bounce base off edges
        if (p.baseX < 0 || p.baseX > w) p.vx *= -1;
        if (p.baseY < 0 || p.baseY > h) p.vy *= -1;

        // Interactive mouse push or pull
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        
        const shouldFormShape = isFormingShape && logoPoints.length > 0;

        if (shouldFormShape) {
          // Pixel-perfect mapping to the ACTUAL logo image
          const targetPt = logoPoints[idx % logoPoints.length];
          const scale = 1.3; // Adjust display size of the mapped logo
          const targetX = mouse.x + targetPt.x * scale;
          const targetY = mouse.y + targetPt.y * scale;

          // Smooth convergence: fast for button hover medium (~3s) for idle
          const convergenceSpeed = isHoveringBtn ? 0.18 : 0.02;
          p.x += (targetX - p.x) * convergenceSpeed;
          p.y += (targetY - p.y) * convergenceSpeed;
          p.alpha = Math.min(1, p.alpha + (isHoveringBtn ? 0.15 : 0.02)); // Glow intensely
        } else {
          // Rapidly return to wandering base position
          p.x += (p.baseX - p.x) * 0.15;
          p.y += (p.baseY - p.y) * 0.15;
          
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            p.x += Math.cos(angle) * force * 1.8;
            p.y += Math.sin(angle) * force * 1.8;
            p.alpha = Math.min(0.8, p.alpha + 0.05);
          } else {
            p.alpha += (p.targetAlpha - p.alpha) * 0.02;
          }
        }

        // Draw node dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * (isFormingShape ? 1.5 : 1), 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();
      });

      // Dynamic connection distance based on shape formation
      const currentConnDist = connectionDistance;
      const currentConnDistSq = currentConnDist * currentConnDist;

      // Draw connections - Skip O(N^2) line drawing when clumped into the logo to save extreme GPU/CPU
      if (!isFormingShape) {
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          let connCount = 0; // Track connections to eliminate lag
          for (let j = i + 1; j < particles.length; j++) {
            if (connCount > maxConnections) break; // CAP CONNECTIONS Prevents extreme lag when particles clump together
            
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            
            // Fast bounding box check
            if (dx > currentConnDist || dx < -currentConnDist) continue;
            
            const dy = p1.y - p2.y;
            if (dy > currentConnDist || dy < -currentConnDist) continue;
            
            const distSq = dx * dx + dy * dy;

            if (distSq < currentConnDistSq) {
              connCount++;
              const dist = Math.sqrt(distSq);
              
              const alpha = (1 - dist / currentConnDist) * 0.12 * Math.min(p1.alpha, p2.alpha);
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `${p1.color}${alpha})`; // Inherit particle color instead of grey
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }

          // Connect nodes to mouse directly for custom magnetic grid effect
          const dxMouse = p1.x - mouse.x;
          const dyMouse = p1.y - mouse.y;
          const distMouse = Math.hypot(dxMouse, dyMouse);
          if (distMouse < mouse.radius - 20) {
            const mouseConnAlpha = (1 - distMouse / (mouse.radius - 20)) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(157, 2, 124, ${mouseConnAlpha})`; // Purple magnetic bonds
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      } else {
        // Just draw connections to mouse when forming shape
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          const dxMouse = p1.x - mouse.x;
          const dyMouse = p1.y - mouse.y;
          const distMouse = Math.hypot(dxMouse, dyMouse);
          if (distMouse < mouse.radius - 20) {
            const mouseConnAlpha = (1 - distMouse / (mouse.radius - 20)) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(157, 2, 124, ${mouseConnAlpha})`; // Purple magnetic bonds
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Track mouse moves across window
    let lastMouseMoveTime = Date.now();
    let lastTargetCheckTime = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Canvas is fixed inset-0, so clientX/Y map 1:1 to canvas coordinates.
      // Avoid getBoundingClientRect() here to prevent layout thrashing.
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      lastMouseMoveTime = Date.now();

      // Check if mouse is hovering an interactive element, but throttle this heavy DOM operation
      if (Date.now() - lastTargetCheckTime > 50) {
        lastTargetCheckTime = Date.now();
        const target = e.target as HTMLElement;
        if (target && target.closest) {
          const isInteractive = target.closest('button') || target.closest('a') || target.closest('[role="button"]') || target.closest('.interactive-node');
          (mouseRef.current as any).isHoveringButton = !!isInteractive;
        }
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
      (mouseRef.current as any).isHoveringButton = false;
    };

    // Parent container resize tracking
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-100"
      style={{ zIndex: 0 }}
    />
  );
}
