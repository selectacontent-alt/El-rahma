import React, { useState, useEffect, useRef, useMemo } from 'react';

interface ShapeGridProps {
  speed?: number;
  squareSize?: number;
  direction?: 'diagonal' | 'horizontal' | 'vertical';
  borderColor?: string;
  hoverFillColor?: string;
  shape?: 'square' | 'circle' | 'hexagon';
  hoverTrailAmount?: number;
  className?: string;
}

export default function ShapeGrid({
  speed = 0.4,
  squareSize = 28,
  direction = 'diagonal',
  borderColor = '#b344a7',
  hoverFillColor = '#f69bfa',
  shape = 'square',
  hoverTrailAmount = 8,
  className = '',
}: ShapeGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredIndexes, setHoveredIndexes] = useState<number[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const cols = Math.floor(dimensions.width / squareSize) + 1;
  const rows = Math.floor(dimensions.height / squareSize) + 1;
  const totalShapes = cols * rows;

  const handleMouseEnter = (index: number) => {
    setHoveredIndexes((prev) => {
      const newHovered = [...prev, index];
      if (newHovered.length > hoverTrailAmount) {
        return newHovered.slice(newHovered.length - hoverTrailAmount);
      }
      return newHovered;
    });
  };

  useEffect(() => {
    if (hoveredIndexes.length > 0) {
      const timer = setTimeout(() => {
        setHoveredIndexes((prev) => prev.slice(1));
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [hoveredIndexes]);

  const shapes = useMemo(() => {
    if (totalShapes <= 0) return [];
    return Array.from({ length: totalShapes }).map((_, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      let delay = 0;
      if (direction === 'diagonal') delay = (row + col) * speed * 0.1;
      else if (direction === 'horizontal') delay = col * speed * 0.1;
      else if (direction === 'vertical') delay = row * speed * 0.1;

      return { index, delay };
    });
  }, [totalShapes, cols, direction, speed]);

  if (totalShapes === 0) return <div ref={containerRef} className={`w-full h-full absolute inset-0 ${className}`} />;

  let clipPath = 'none';
  if (shape === 'hexagon') {
    clipPath = 'polygon(50% 0% 100% 25% 100% 75% 50% 100% 0% 75% 0% 25%)';
  }

  let borderRadius = '0%';
  if (shape === 'circle') borderRadius = '50%';

  return (
    <>
      <style>{`
        @keyframes shapePulse {
          0% { opacity: 0.2; }
          100% { opacity: 0.8; }
        }
      `}</style>
      <div 
        ref={containerRef} 
        className={`w-full h-full absolute inset-0 overflow-hidden ${className}`}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'flex-start',
        }}
      >
        {shapes.map(({ index, delay }) => {
          const isHovered = hoveredIndexes.includes(index);
          return (
            <div
              key={index}
              onMouseEnter={() => handleMouseEnter(index)}
              style={{
                width: squareSize,
                height: squareSize,
                border: `1px solid ${borderColor}`,
                backgroundColor: isHovered ? hoverFillColor : 'transparent',
                borderRadius,
                clipPath,
                transition: isHovered ? 'none' : 'background-color 1s ease',
                animation: `shapePulse ${3 / speed}s infinite alternate`,
                animationDelay: `${delay}s`,
                boxSizing: 'border-box'
              }}
            />
          );
        })}
      </div>
    </>
  );
}
