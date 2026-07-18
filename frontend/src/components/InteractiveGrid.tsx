"use client";
import React, { useEffect, useRef } from 'react';

export default function InteractiveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let mouse = { x: -1000, y: -1000 };
    
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    window.addEventListener('mousemove', onMouseMove);
    
    const gridSize = window.innerWidth < 768 ? 120 : 90;
    let points: {x: number, y: number, bx: number, by: number}[] = [];
    let cols = 0;
    let rows = 0;
    
    const initGrid = () => {
      points = [];
      // Add extra rows/cols to handle the scrolling translation
      cols = Math.floor(width / gridSize) + 3;
      rows = Math.floor(height / gridSize) + 3;
      
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * gridSize;
          const y = r * gridSize;
          points.push({ x, y, bx: x, by: y });
        }
      }
    };
    initGrid();

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initGrid();
    };
    window.addEventListener('resize', onResize);

    let animationFrameId: number;
    let startTime = Date.now();
    
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Calculate continuous scroll offset
      const elapsed = (Date.now() - startTime) / 1000; // seconds
      const speed = 25; // pixels per second
      
      // We want to translate by a negative amount to move the grid up/left.
      // So offset goes from 0 to gridSize
      const offsetX = (elapsed * speed) % gridSize;
      const offsetY = (elapsed * speed) % gridSize;
      
      // Adjust mouse to interact with the virtual grid coordinates
      const virtualMouseX = mouse.x + offsetX;
      const virtualMouseY = mouse.y + offsetY;
      
      // Update points physics
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        
        const dx = virtualMouseX - p.bx;
        const dy = virtualMouseY - p.by;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const maxDist = 200; 
        
        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          const pushX = (dx / dist) * force * 35;
          const pushY = (dy / dist) * force * 35;
          
          p.x = p.bx - pushX;
          p.y = p.by - pushY;
        } else {
          p.x += (p.bx - p.x) * 0.1;
          p.y += (p.by - p.y) * 0.1;
        }
      }

      ctx.save();
      // Translate canvas so the grid appears to move continuously
      ctx.translate(-offsetX, -offsetY);

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(157, 2, 124, 0.15)';
      ctx.lineWidth = 1;

      // Draw horizontal lines
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const p1 = points[r * cols + c];
          const p2 = points[r * cols + c + 1];
          if (p1 && p2) {
             ctx.moveTo(p1.x, p1.y);
             ctx.lineTo(p2.x, p2.y);
          }
        }
      }
      
      // Draw vertical lines
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows - 1; r++) {
          const p1 = points[r * cols + c];
          const p2 = points[(r + 1) * cols + c];
          if (p1 && p2) {
             ctx.moveTo(p1.x, p1.y);
             ctx.lineTo(p2.x, p2.y);
          }
        }
      }
      
      ctx.stroke();
      ctx.restore();
      
      // Draw a subtle glow exactly at the real mouse position
      if (mouse.x !== -1000 && mouse.y !== -1000) {
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 200);
        gradient.addColorStop(0, 'rgba(157, 2, 124, 0.15)'); 
        gradient.addColorStop(1, 'rgba(157, 2, 124, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(mouse.x - 200, mouse.y - 200, 400, 400);
      }

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (isMobile) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none" 
      style={{ zIndex: 0 }} 
    />
  );
}
