'use client';

import { useLayoutEffect, useRef, useCallback } from 'react';

/* ─────────────────────────────────────────────────────────
   ScrollStackItem – transparent positional wrapper only
───────────────────────────────────────────────────────── */
export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div className={`scroll-stack-card${itemClassName ? ` ${itemClassName}` : ''}`}>
    {children}
  </div>
);

/* ─────────────────────────────────────────────────────────
   ScrollStack
   
   KEY FIX: All element positions are cached at mount
   (absolute offsetTop from document top). The scroll
   handler does ZERO getBoundingClientRect calls — pure
   arithmetic only. No layout thrash, no flicker.

   Scroll is driven by native window scroll event,
   rAF-throttled to one write per paint frame.
───────────────────────────────────────────────────────── */
const ScrollStack = ({
  children,
  className = '',
  itemDistance      = 100,
  itemScale         = 0.03,
  itemStackDistance = 30,
  stackPosition     = '20%',
  scaleEndPosition  = '10%',
  baseScale         = 0.85,
  rotationAmount    = 0,
  blurAmount        = 0,
  useWindowScroll   = false,
  onStackComplete,
}) => {
  const containerRef   = useRef(null);
  const cardsRef       = useRef([]);
  const cardTopsRef    = useRef([]); // cached absolute offsetTops — no reflow on scroll
  const sentinelTopRef = useRef(0); // cached sentinel absoluteTop
  const completedRef   = useRef(false);
  const prevRef        = useRef([]); // [{ tY, sc, ro, bl }] last applied transforms
  const rafRef         = useRef(null);

  /* ── getAbsoluteTop: walks offsetParent chain. Zero reflow after mount ── */
  const getAbsoluteTop = (el) => {
    let top = 0;
    let cur = el;
    while (cur) {
      top += cur.offsetTop;
      cur = cur.offsetParent;
    }
    return top;
  };

  /* ── Cache all element positions (called at mount + on resize) ── */
  const measurePositions = useCallback(() => {
    const cards = cardsRef.current;
    cardTopsRef.current = cards.map(getAbsoluteTop);

    const sentinel = useWindowScroll
      ? document.querySelector('.scroll-stack-end')
      : containerRef.current?.querySelector('.scroll-stack-end');
    sentinelTopRef.current = sentinel ? getAbsoluteTop(sentinel) : 0;

    prevRef.current = cards.map(() => null); // invalidate cache after remeasure
  }, [useWindowScroll]);

  /* ── Core transform — ZERO getBoundingClientRect calls ── */
  const updateCards = useCallback(() => {
    rafRef.current = null;
    const cards    = cardsRef.current;
    const cardTops = cardTopsRef.current;
    if (!cards.length || !cardTops.length) return;

    const scrollTop   = window.scrollY;
    const vp          = window.innerHeight;
    const sentinelTop = sentinelTopRef.current;

    const parsePx = (v) =>
      typeof v === 'string' && v.includes('%')
        ? (parseFloat(v) / 100) * vp
        : parseFloat(v);

    const stackPx = parsePx(stackPosition);
    const endPx   = parsePx(scaleEndPosition);

    let topCardIdx = 0;

    cards.forEach((card, i) => {
      const cardTopAbs = cardTops[i];
      const pinStart   = cardTopAbs - stackPx - itemStackDistance * i;
      const pinEnd     = sentinelTop - vp / 2;
      const scaleStart = pinStart;
      const scaleEnd   = cardTopAbs - endPx;

      /* scale */
      const range      = Math.max(scaleEnd - scaleStart, 1);
      const scaleProg  = Math.min(1, Math.max(0, (scrollTop - scaleStart) / range));
      const targetScale = baseScale + i * itemScale;
      const scale       = 1 - scaleProg * (1 - targetScale);

      /* rotation */
      const rotation = rotationAmount ? i * rotationAmount * scaleProg : 0;

      /* sticky translateY */
      let translateY = 0;
      if (scrollTop >= pinStart && scrollTop <= pinEnd) {
        translateY = scrollTop - cardTopAbs + stackPx + itemStackDistance * i;
        topCardIdx = i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTopAbs + stackPx + itemStackDistance * i;
      }

      /* blur */
      const blur = blurAmount && i < topCardIdx ? (topCardIdx - i) * blurAmount : 0;

      /* sub-pixel rounding — prevents jitter from floating point drift */
      const tY = Math.round(translateY * 10) / 10;
      const sc = Math.round(scale      * 1000) / 1000;
      const ro = Math.round(rotation   * 100)  / 100;
      const bl = Math.round(blur       * 10)   / 10;

      const prev = prevRef.current[i];
      if (prev && prev.tY === tY && prev.sc === sc && prev.ro === ro && prev.bl === bl) return;

      /* single batched DOM write — no interleaved reads */
      card.style.transform = `translate3d(0,${tY}px,0) scale(${sc})${ro ? ` rotate(${ro}deg)` : ''}`;
      card.style.filter    = bl > 0 ? `blur(${bl}px)` : '';
      prevRef.current[i]   = { tY, sc, ro, bl };
    });

    /* onStackComplete */
    if (onStackComplete) {
      const pStart   = cardTops[cards.length - 1] - stackPx - itemStackDistance * (cards.length - 1);
      const pEnd     = sentinelTop - vp / 2;
      const inView   = scrollTop >= pStart && scrollTop <= pEnd;
      if ( inView && !completedRef.current) { completedRef.current = true;  onStackComplete(); }
      if (!inView &&  completedRef.current) { completedRef.current = false; }
    }
  }, [stackPosition, scaleEndPosition, itemStackDistance, baseScale,
      itemScale, rotationAmount, blurAmount, onStackComplete]);

  /* rAF gate — maximum one DOM write per paint frame */
  const scheduleUpdate = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(updateCards);
  }, [updateCards]);

  /* ── Setup ── */
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    /* collect card elements */
    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : container.querySelectorAll('.scroll-stack-card')
    );
    cardsRef.current = cards;

    /* initial card styles — compositor-only properties */
    cards.forEach((card, i) => {
      card.style.position          = 'relative';
      card.style.marginBottom      = i < cards.length - 1 ? `${itemDistance}px` : '0';
      card.style.willChange        = 'transform';
      card.style.transformOrigin   = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.zIndex            = String(100 + i);
      // GPU layer promotion — eliminates sub-pixel rounding flicker
      card.style.transform         = 'translateZ(0)';
    });

    /* measure once AFTER styles are applied */
    measurePositions();

    /* scroll listener — passive so browser doesn't wait for JS */
    window.addEventListener('scroll', scheduleUpdate, { passive: true });

    /* re-measure on resize, re-run transforms */
    const onResize = () => {
      measurePositions();
      scheduleUpdate();
    };
    window.addEventListener('resize', onResize, { passive: true });

    /* initial paint */
    scheduleUpdate();

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      cardsRef.current    = [];
      cardTopsRef.current = [];
      prevRef.current     = [];
      completedRef.current = false;
      rafRef.current      = null;
    };
  }, [
    itemDistance, itemStackDistance, stackPosition, scaleEndPosition,
    baseScale, itemScale, rotationAmount, blurAmount,
    useWindowScroll, measurePositions, scheduleUpdate,
  ]);

  return (
    <div
      ref={containerRef}
      className={`scroll-stack-root${className ? ` ${className}` : ''}`}
      style={{ position: 'relative', width: '100%', overflow: 'visible' }}
    >
      <div style={{ position: 'relative', width: '100%' }}>
        {children}
        {/* sentinel — its cached offsetTop tells ScrollStack when to release the pin */}
        <div
          className="scroll-stack-end"
          style={{ width: '100%', height: '1px', pointerEvents: 'none' }}
        />
      </div>
    </div>
  );
};

export default ScrollStack;
