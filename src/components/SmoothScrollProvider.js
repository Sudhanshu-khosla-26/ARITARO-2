'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollProvider({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 4), // ease-out-quart — snappy start, smooth land
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
      autoResize: true,
      autoRaf: false, // GSAP drives the ticker — one source of truth
    });

    window.lenis = lenis;

    // Keep ScrollTrigger in sync with Lenis eased scroll values
    lenis.on('scroll', ScrollTrigger.update);

    // GSAP drives Lenis — single RAF loop for everything
    const update = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(update);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  // Instant scroll reset on route change
  useEffect(() => {
    const lenis = window.lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname]);

  return children;
}