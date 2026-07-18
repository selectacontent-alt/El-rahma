"use client";

import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import './CardSwap.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`card ${customClass ?? ''} ${rest.className ?? ''}`.trim()} />
));
Card.displayName = 'Card';

const makeSlot = (i: number, distX: number, distY: number, total: number) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * Math.abs(distX) * 1.5,
  zIndex: total - i
});

const placeNow = (el: HTMLElement | null, slot: any, skew: number) =>
  el && gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: 'linear' | 'elastic';
  children: React.ReactNode;
}

const CardSwap = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = 'elastic',
  children
}: CardSwapProps) => {
  const config =
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          durDrop: 1.2,
          durMove: 1.2,
          durReturn: 1.2,
          promoteOverlap: 0.9,
          returnDelay: 0.05
        }
      : {
          ease: 'power1.inOut',
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2
        };

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef<HTMLDivElement>()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number | undefined>(undefined);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      if (!elFront) return;

      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        y: '+=500',
        duration: config.durDrop,
        ease: config.ease
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        if (!el) return;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease
          },
          `promote+=${i * 0.15}`
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        'return'
      );
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease
        },
        'return'
      );

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    swap();
    intervalRef.current = window.setInterval(swap, delay);

    let isPaused = false;

    const pause = () => {
      isPaused = true;
      tlRef.current?.pause();
      clearInterval(intervalRef.current);
    };

    const resume = () => {
      if (!isPaused) return;
      isPaused = false;
      
      clearInterval(intervalRef.current);

      if (tlRef.current && tlRef.current.paused()) {
        tlRef.current.play();
      }

      intervalRef.current = window.setInterval(swap, delay);
    };

    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.changedTouches[0].screenX;
      startY = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].screenX;
      const endY = e.changedTouches[0].screenY;
      
      const diffX = startX - endX;
      const diffY = startY - endY;

      // If swipe is horizontal and significant (> 40px)
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        // Swipe detected (left or right)
        clearInterval(intervalRef.current);
        
        // Force complete current animation if active
        if (tlRef.current && tlRef.current.isActive()) {
          tlRef.current.progress(1);
        }
        
        swap(); // Trigger the flip to next card
        
        if (!isPaused) {
          intervalRef.current = window.setInterval(swap, delay);
        }
      }
    };

    const handleInteraction = (e: Event) => {
      // Toggle pause/play on click
      if (e.type === 'click') {
        if (isPaused) resume();
        else pause();
      }
    };

    const node = container.current;
    
    if (pauseOnHover && node) {
      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);
    }
    
    if (node) {
      node.addEventListener('click', handleInteraction);
      node.addEventListener('touchstart', handleTouchStart as EventListener, { passive: true });
      node.addEventListener('touchend', handleTouchEnd as EventListener, { passive: true });
    }

    return () => {
      clearInterval(intervalRef.current);
      if (node) {
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
        node.removeEventListener('click', handleInteraction);
        node.removeEventListener('touchstart', handleTouchStart as EventListener);
        node.removeEventListener('touchend', handleTouchEnd as EventListener);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child as React.ReactElement<any>, {
          key: i,
          ref: refs[i],
          style: { width, height: 'auto', minHeight: height, ...((child as React.ReactElement<any>).props.style ?? {}) },
          onClick: (e: any) => {
            (child as React.ReactElement<any>).props.onClick?.(e);
            onCardClick?.(i);
          },
          onMouseEnter: (e: any) => {
            (child as React.ReactElement<any>).props.onMouseEnter?.(e);
            if (refs[i].current) gsap.to(refs[i].current, { scale: 1.03, duration: 0.3, ease: 'power2.out' });
          },
          onMouseLeave: (e: any) => {
            (child as React.ReactElement<any>).props.onMouseLeave?.(e);
            if (refs[i].current) gsap.to(refs[i].current, { scale: 1, duration: 0.3, ease: 'power2.out' });
          }
        })
      : child
  );

  return (
    <div ref={container} className="card-swap-container" style={{ width, height }}>
      {rendered}
    </div>
  );
};

export default CardSwap;
