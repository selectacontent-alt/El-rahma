import { useEffect, useState, useRef } from 'react';

type CursorMode = 'default' | 'pointer' | 'text' | 'not-allowed' | 'grab' | 'grabbing';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorMode, setCursorMode] = useState<CursorMode>('default');
  const [ripples, setRipples] = useState<{ id: number }[]>([]);
  const rippleIdRef = useRef(0);

  // References for direct high-performance DOM translation
  const cursorRef = useRef<HTMLDivElement>(null);
  const activeTargetRef = useRef<HTMLElement | null>(null);
  const isMouseDownRef = useRef(false);

  useEffect(() => {
    // If touchscreen/mobile device, hide the custom cursor to preserve standard touch mechanics
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    setIsVisible(true);

    const evaluateCursorMode = (target: HTMLElement, mouseDownState: boolean): CursorMode => {
      if (!target) return 'default';

      const classList = target.classList;
      const tagName = target.tagName ? target.tagName.toLowerCase() : '';

      // 1. Detect Forbidden / Not-allowed zones
      const isForbidden = 
        target.closest('[disabled]') || 
        target.closest('[aria-disabled="true"]') ||
        classList?.contains('cursor-not-allowed');

      if (isForbidden) return 'not-allowed';

      // 2. Detect Text Writing Areas
      const typeAttr = target.getAttribute('type')?.toLowerCase();
      const isTextTag = tagName === 'textarea' || target.closest('[contenteditable="true"]') || classList?.contains('cursor-text');
      const isTextInput = tagName === 'input' && (
        !typeAttr || 
        ['text', 'email', 'tel', 'number', 'password', 'search'].includes(typeAttr)
      );

      if (isTextTag || isTextInput) {
        return 'text';
      }

      // 3. Detect Drag / Grab / Grabbing
      const isRangeInput = tagName === 'input' && typeAttr === 'range';
      const isGrabClass = classList?.contains('cursor-grab') || classList?.contains('cursor-grabbing');
      const isDraggable = target.getAttribute('draggable') === 'true';

      if (isRangeInput || isGrabClass || isDraggable) {
        return mouseDownState ? 'grabbing' : 'grab';
      }

      // 4. Detect clickable components
      const isClickableTag = tagName === 'button' || tagName === 'a' || tagName === 'select' || target.closest('[role="button"]');
      const isPointerClass = classList?.contains('cursor-pointer');

      if (isClickableTag || isPointerClass) {
        return 'pointer';
      }

      return 'default';
    };

    // Position coordinates directly inside requestAnimationFrame for maximum optimization
    let currentX = -100;
    let currentY = -100;
    let animatedX = -100;
    let animatedY = -100;
    let initialRender = true;
    let animationFrameId: number;

    const updateDOM = () => {
      if (cursorRef.current) {
        // Blend 90% of current coordinate
        animatedX = animatedX + (currentX - animatedX) * 0.95;
        animatedY = animatedY + (currentY - animatedY) * 0.95;
        
        // Skip DOM update if movement is microscopic (eliminates idle lag)
        if (initialRender || Math.abs(currentX - animatedX) > 0.1 || Math.abs(currentY - animatedY) > 0.1) {
          initialRender = false;
          cursorRef.current.style.transform = `translate3d(${animatedX}px, ${animatedY}px, 0)`;
        }
      }
      animationFrameId = requestAnimationFrame(updateDOM);
    };

    animationFrameId = requestAnimationFrame(updateDOM);

    const moveCursor = (e: MouseEvent) => {
      currentX = e.clientX;
      currentY = e.clientY;
      
      const target = e.target as HTMLElement;
      // CRITICAL OPTIMIZATION: Only evaluate state & re-render if the hovered target has changed
      if (target && target !== activeTargetRef.current) {
        activeTargetRef.current = target;
        const newMode = evaluateCursorMode(target, isMouseDownRef.current);
        setCursorMode(newMode);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target !== activeTargetRef.current) {
        activeTargetRef.current = target;
        const newMode = evaluateCursorMode(target, isMouseDownRef.current);
        setCursorMode(newMode);
      }
    };

    const handleMouseDown = () => {
      isMouseDownRef.current = true;
      if (activeTargetRef.current) {
        const newMode = evaluateCursorMode(activeTargetRef.current, true);
        setCursorMode(newMode);
      }

      const id = rippleIdRef.current++;
      setRipples(prev => [...prev, { id }]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 400);
    };

    const handleMouseUp = () => {
      isMouseDownRef.current = false;
      if (activeTargetRef.current) {
        const newMode = evaluateCursorMode(activeTargetRef.current, false);
        setCursorMode(newMode);
      }
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div
        ref={cursorRef}
        id="select-brand-cursor"
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-normal will-change-transform"
      >
        {/* Click ripples */}
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="absolute rounded-full border-2 border-[#9d027c] animate-ping"
            style={{
              width: 30,
              height: 30,
              left: -15, // center at the tip
              top: -15,
              opacity: 0.8,
              animationIterationCount: 1,
              animationDuration: '400ms'
            }}
          />
        ))}

        {/* Render writing insertion text cursor */}
        {cursorMode === 'text' && (
          <svg
            width="14"
            height="22"
            viewBox="-10 -15 20 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* White halo contour */}
            <line x1="0" y1="-11" x2="0" y2="11" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="-5" y1="-11" x2="5" y2="-11" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="-5" y1="11" x2="5" y2="11" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />

            {/* Core caret colored SELECT purple */}
            <line x1="0" y1="-11" x2="0" y2="11" stroke="#9d027c" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="-5" y1="-11" x2="5" y2="-11" stroke="#9d027c" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="-5" y1="11" x2="5" y2="11" stroke="#9d027c" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}

        {/* Render forbidden forbidden/not-allowed visual */}
        {cursorMode === 'not-allowed' && (
          <svg
            width="24"
            height="24"
            viewBox="-15 -15 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transform: 'translate(-50%, -50%)',
            }}
          >
            <circle cx="0" cy="0" r="11" fill="#ffffff" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="9" stroke="#9d027c" strokeWidth="2.5" />
            <line x1="-6" y1="6" x2="6" y2="-6" stroke="#9d027c" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        )}

        {/* Render grab/range slider cursor - Elegant capsule with horizontal sliding arrows and a core dot */}
        {cursorMode === 'grab' && (
          <svg
            width="38"
            height="26"
            viewBox="-30 -20 60 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* White halo contour */}
            <rect x="-24" y="-10" width="48" height="20" rx="10" fill="#ffffff" stroke="#ffffff" strokeWidth="2.5" />
            <rect x="-24" y="-10" width="48" height="20" rx="10" fill="#9d027c" />
            {/* Drag indicators */}
            <path d="M-15 0 L-9 -4 L-9 4 Z" fill="#ffffff" />
            <path d="M15 0 L9 -4 L9 4 Z" fill="#ffffff" />
            {/* Core Brand Dot */}
            <circle cx="0" cy="0" r="4" fill="#ffffff" />
          </svg>
        )}

        {/* Render grabbing/dragging active state cursor - capsule compresses horizontally under pressure */}
        {cursorMode === 'grabbing' && (
          <svg
            width="32"
            height="26"
            viewBox="-30 -20 60 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="scale-95"
            style={{
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Compressed Squeezed Contour */}
            <rect x="-18" y="-11" width="36" height="22" rx="11" fill="#ffffff" stroke="#ffffff" strokeWidth="2.5" />
            <rect x="-18" y="-11" width="36" height="22" rx="11" fill="#9d027c" />
            {/* Center squeeze ribbed lines representing high tactile friction */}
            <line x1="-5" y1="-5" x2="-5" y2="5" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="0" y1="-5" x2="0" y2="5" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="5" y1="-5" x2="5" y2="5" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        )}

        {/* Render standard brand pointers slanted beautifully to the left (inverted) */}
        {(cursorMode === 'default' || cursorMode === 'pointer') && (
          <svg
            width={cursorMode === 'pointer' ? "26" : "21"}
            height={cursorMode === 'pointer' ? "28" : "23"}
            viewBox="-20 -10 80 85"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              // With (0,0) as the tip of the arrow, this scales and translates it mathematically to keep the tip perfectly on-target
              transform: 'translate(-25%, -11.8%)', 
            }}
          >
            {/* Main Pointer Arrow Head matching the exact purple SELECT brand shape from user image, scaled and sleek */}
            <path
              d="M 0 0 L 46 34 Q 24 30 11 51 L 0 0 Z"
              fill="#9d027c"
              stroke="#ffffff"
              strokeWidth="2.8"
              strokeLinejoin="round"
            />
            {/* Below-tail custom brand dot supporting the cursor, positioned symmetrically under its curve */}
            <circle
              cx="26"
              cy="48"
              r="7"
              fill="#9d027c"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
          </svg>
        )}
      </div>
    </>
  );
}
