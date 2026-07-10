'use client';

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, useCallback } from 'react';
import { gsap } from 'gsap';
import dynamic from 'next/dynamic';

const FloatingLines = dynamic(() => import('./FloatingLines'), { ssr: false });

const HERO_VISUAL_VIDEO_SRC = '/grok-video-be4a4f39-a70b-41ec-af1d-5cf4d274b1aa.mp4';

function BlendedHeroVideo({ theme }) {
  const [failed, setFailed] = useState(false);

  if (failed) return <LayeredShield />;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'relative',
        width: 420,
        height: 420,
        borderRadius: 28,
        overflow: 'hidden',
        background: theme === 'light'
          ? 'linear-gradient(135deg, rgba(0, 120, 150, 0.08), rgba(255, 255, 255, 0.35))'
          : 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(5, 7, 13, 0.35))',
        border: theme === 'light'
          ? '1px solid rgba(0, 120, 150, 0.18)'
          : '1px solid rgba(99, 102, 241, 0.14)',
        boxShadow: theme === 'light'
          ? '0 30px 90px rgba(0,0,0,0.10)'
          : '0 30px 110px rgba(0,0,0,0.55)',
      }}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={() => setFailed(true)}
        onStalled={() => setFailed(true)}
        src={HERO_VISUAL_VIDEO_SRC}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: theme === 'light' ? 0.75 : 0.85,
          mixBlendMode: theme === 'light' ? 'multiply' : 'screen',
          filter: theme === 'light'
            ? 'contrast(1.05) saturate(1.05)'
            : 'contrast(1.08) saturate(1.15)',
          transform: 'scale(1.06)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, #000 58%, transparent 78%)',
          maskImage: 'radial-gradient(circle at 50% 50%, #000 58%, transparent 78%)',
        }}
      />

      {/* edge fade + subtle glass sheen */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: theme === 'light'
            ? 'radial-gradient(circle at 50% 45%, transparent 40%, rgba(245,247,250,0.55) 78%, rgba(245,247,250,0.85) 100%)'
            : 'radial-gradient(circle at 50% 45%, transparent 40%, rgba(5,7,13,0.65) 78%, rgba(5,7,13,0.92) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '12%',
          right: '12%',
          height: 1,
          background: theme === 'light'
            ? 'linear-gradient(90deg, transparent, rgba(0, 120, 150, 0.35), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.35), transparent)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

function subscribeTheme(callback) {
  if (typeof window === 'undefined') return () => { };

  const obs = new MutationObserver(() => callback());
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  return () => obs.disconnect();
}

function getThemeSnapshot() {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.getAttribute('data-theme') || 'dark';
}

function ShieldCore() {
  return (
    <div className="shield-core" aria-hidden="true">
      <svg viewBox="0 0 200 200" width="200" height="200" focusable="false">
        <defs>
          <linearGradient id="shieldStroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--cyan-primary)" />
            <stop offset="0.55" stopColor="var(--cyan-secondary)" />
            <stop offset="1" stopColor="var(--cyan-secondary)" />
          </linearGradient>
          <radialGradient id="shieldFill" cx="50%" cy="20%" r="80%">
            <stop offset="0" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="0.35" stopColor="rgba(99,102,241,0.08)" />
            <stop offset="1" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>

        <path
          d="M100 18c22 16 47 20 66 22v66c0 42-27 64-66 78-39-14-66-36-66-78V40c19-2 44-6 66-22z"
          fill="url(#shieldFill)"
          stroke="url(#shieldStroke)"
          strokeWidth="3.25"
          strokeLinejoin="round"
        />

        <path
          d="M70 96a30 30 0 0 1 60 0v20c0 14-12 26-30 26s-30-12-30-26V96z"
          fill="rgba(99,102,241,0.06)"
          stroke="rgba(99,102,241,0.55)"
          strokeWidth="2"
        />
        <path
          d="M86 96a14 14 0 0 1 28 0"
          fill="none"
          stroke="rgba(99,102,241,0.55)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M100 108c6 0 10 4 10 10 0 4-2 7-5 9v8h-10v-8c-3-2-5-5-5-9 0-6 4-10 10-10z"
          fill="rgba(99,102,241,0.14)"
          stroke="rgba(99,102,241,0.55)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* ══════════════════════════════════════════════
   STACKED PANEL SHIELD
   Visual concept from Figma:
   - 4 clearly-visible stacked rounded panels
   - Each backing panel: lighter, offset upper-left
   - Front panel: darkest, most opaque, has the logo
   - Attack beam → front panel flies off → reforms
══════════════════════════════════════════════ */
function LayeredShield() {
  const [phase, setPhase] = useState('idle');
  const timers = useRef([]);

  const runCycle = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [
      setTimeout(() => setPhase('incoming'), 0),
      setTimeout(() => setPhase('impact'), 900),
      setTimeout(() => setPhase('broken'), 1200),
      setTimeout(() => setPhase('reform'), 3000),
      setTimeout(() => setPhase('idle'), 4500),
    ];
  }, []);

  useEffect(() => {
    let iv;
    const boot = setTimeout(() => {
      runCycle();
      iv = setInterval(runCycle, 7000);
    }, 2000);

    return () => {
      clearTimeout(boot);
      if (iv) clearInterval(iv);
      timers.current.forEach(clearTimeout);
    };
  }, [runCycle]);

  const isIncoming = phase === 'incoming';
  const isImpact = phase === 'impact';
  const isBroken = phase === 'broken' || phase === 'reform';
  const isReform = phase === 'reform';

  /* Panel core dimensions */
  const PW = 270, PH = 340, BR = 22;
  /* Each backing layer offset from the one in front of it */
  const DX = 22, DY = 18;
  /* Container must accommodate all 4 panels */
  const CW = PW + DX * 3 + 16;
  const CH = PH + DY * 3 + 16;

  /*
    Panel positions (stacked: back = top-left, front = bottom-right):
    Panel 0 (back):  (0,   0)
    Panel 1:         (DX,  DY)
    Panel 2:         (DX*2,DY*2)
    Panel 3 (front): (DX*3,DY*3)  ← this one breaks
  */
  const BACK_PANELS = [
    { x: 0, y: 0, bg: 'var(--shield-layer-1-bg)', bd: 'var(--shield-layer-1-border)', sh: 'var(--shield-layer-1-shadow)' },
    { x: DX, y: DY, bg: 'var(--shield-layer-2-bg)', bd: 'var(--shield-layer-2-border)', sh: 'var(--shield-layer-2-shadow)' },
    { x: DX * 2, y: DY * 2, bg: 'var(--shield-layer-3-bg)', bd: 'var(--shield-layer-3-border)', sh: 'var(--shield-layer-3-shadow)' },
  ];
  const FX = DX * 3, FY = DY * 3;  // front panel position

  return (
    <div style={{ position: 'relative', width: CW, height: CH }}>

      {/* ── Orbital rings centred on the front panel ── */}
      {[380, 300, 230].map((d, i) => (
        <div key={d} style={{
          position: 'absolute',
          width: d, height: d, borderRadius: '50%',
          border: `1px ${i === 1 ? 'dashed' : 'solid'} rgba(99,102,241,${0.08 + i * 0.05})`,
          top: FY + PH / 2 - d / 2,
          left: FX + PW / 2 - d / 2,
          animation: `rotate-slow ${22 + i * 9}s linear infinite ${i % 2 ? 'reverse' : ''}`,
          pointerEvents: 'none',
        }} />
      ))}

      {/* ── Backing panels (never break) ── */}
      {BACK_PANELS.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: p.x, top: p.y,
          width: PW, height: PH, borderRadius: BR,
          background: p.bg,
          border: `1px solid ${p.bd}`,
          boxShadow: p.sh,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }} />
      ))}

      {/* ── FRONT PANEL (breaks on attack) ── */}
      <div style={{
        position: 'absolute',
        left: FX, top: FY,
        width: PW, height: PH, borderRadius: BR,
        /* When breaking: fly to upper-right + rotate */
        transform: isBroken
          ? `translate(340px, -110px) rotate(26deg)`
          : isReform
            ? `translate(340px, -110px) rotate(26deg)`
            : 'translate(0,0) rotate(0deg)',
        opacity: isBroken ? 0 : 1,
        transition: isBroken
          ? 'transform 0.75s cubic-bezier(0.4,0,1,1), opacity 0.6s ease'
          : isReform
            ? 'none'
            : 'transform 1.3s cubic-bezier(0.16,1,0.3,1), opacity 1s ease',
        background: isImpact ? 'var(--shield-front-impact-bg)' : 'var(--shield-front-bg)',
        border: `1px solid ${isImpact ? 'var(--shield-front-impact-border)' : 'var(--shield-front-border)'}`,
        boxShadow: isImpact ? 'var(--shield-front-impact-shadow)' : 'var(--shield-front-shadow)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        transition: isBroken
          ? 'transform 0.75s cubic-bezier(0.4,0,1,1), opacity 0.6s ease, background 0.25s, border-color 0.25s, box-shadow 0.25s'
          : isReform
            ? 'none'
            : 'transform 1.3s cubic-bezier(0.16,1,0.3,1), opacity 1s ease, background 0.4s, border-color 0.4s, box-shadow 0.4s',
      }}>
        {/* Top inner highlight */}
        <div style={{
          position: 'absolute', top: 0, left: '12%', right: '12%', height: 1,
          background: `linear-gradient(90deg, transparent, rgba(${isImpact ? '255,100,80' : '99,102,241'},0.55), transparent)`,
        }} />
        {/* Scan beam */}
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, transparent, rgba(${isImpact ? '255,100,80' : '0,200,255'},0.7), transparent)`,
          animation: 'scanbeam 2.8s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        {/* Core glyph (no brand logo; navbar already has it) */}
        <div style={{
          width: 200, height: 200, flexShrink: 0,
          animation: !isBroken ? 'shield-float 6s ease-in-out infinite' : 'none',
          transition: 'filter 0.3s ease',
          filter: isImpact ? 'var(--shield-core-impact-filter)' : 'var(--shield-core-filter)',
        }}>
          <ShieldCore />
        </div>
      </div>

      {/* ── Attack beam (right → front panel) ── */}
      <div style={{
        position: 'absolute',
        top: FY + PH / 2 - 1.5,
        right: 0,
        width: isIncoming ? FX + 40 : 0,
        height: 3, borderRadius: 2,
        background: 'linear-gradient(to left, transparent, rgba(255,61,90,0.9), rgba(255,130,60,0.5))',
        boxShadow: '0 0 14px rgba(255,61,90,0.8)',
        transition: 'width 0.85s cubic-bezier(0.4,0,1,1)',
        pointerEvents: 'none', zIndex: 20,
      }} />
      {/* Attack head dot */}
      {isIncoming && (
        <div style={{
          position: 'absolute',
          top: FY + PH / 2 - 5,
          right: isIncoming ? FX - 5 : 0,
          width: 10, height: 10, borderRadius: '50%',
          background: '#FF3D5A',
          boxShadow: '0 0 12px rgba(255,61,90,1)',
          pointerEvents: 'none', zIndex: 21,
          transition: 'right 0.85s cubic-bezier(0.4,0,1,1)',
        }} />
      )}

      {/* ── Layer status dots (right side) ── */}
      <div style={{
        position: 'absolute',
        right: -36, top: FY + PH / 2 - 42,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {[
          { l: 'L3', ok: !isBroken },
          { l: 'L2', ok: true },
          { l: 'L1', ok: true },
        ].map(({ l, ok }) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: ok ? '#6366F1' : '#FF3D5A',
              boxShadow: `0 0 8px rgba(${ok ? '99,102,241' : '255,61,90'},0.8)`,
              transition: 'all 0.4s',
            }} />
            <span style={{
              fontFamily: 'var(--font-orbitron), monospace',
              fontSize: 7, letterSpacing: '1px',
              color: ok ? 'rgba(99,102,241,0.55)' : 'rgba(255,61,90,0.8)',
              transition: 'color 0.4s',
            }}>{l}</span>
          </div>
        ))}
      </div>

      {/* ── Status label ── */}
      <div style={{
        position: 'absolute', bottom: -24,
        left: FX, width: PW,
        display: 'flex', justifyContent: 'space-between',
        fontFamily: 'var(--font-orbitron), monospace',
        fontSize: 8, letterSpacing: '1.5px',
        color: isBroken ? '#FF3D5A' : 'rgba(0,200,255,0.45)',
        transition: 'color 0.4s',
        pointerEvents: 'none',
      }}>
        <span>{isBroken ? '⚠ BREACHED' : '✓ SECURED'}</span>
        <span style={{ color: 'rgba(0,200,255,0.2)' }}>LAYERED SHIELD</span>
      </div>

      <style>{`
        @keyframes shield-float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes scanbeam {
          0%   { top: 0%; opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN HERO
══════════════════════════════════════════════ */
export default function HomePage() {
  const rightRef = useRef(null);
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, () => 'dark');
  const linesGradient = useMemo(() => {
    if (typeof window === 'undefined') {
      return ['#6366F1', '#1e6fff', '#a855f7', '#0050ff'];
    }

    const styles = getComputedStyle(document.documentElement);
    const cyan = styles.getPropertyValue('--cyan-primary').trim() || '#6366F1';
    const cyan2 = styles.getPropertyValue('--cyan-secondary').trim() || '#818CF8';
    const green = styles.getPropertyValue('--accent-green').trim() || '#00FF9C';
    const red = styles.getPropertyValue('--accent-red').trim() || '#FF3D5A';

    return theme === 'light'
      ? [cyan, green, cyan2, red]
      : [cyan, '#1e6fff', '#a855f7', cyan2];
  }, [theme]);

  useEffect(() => {
    if (!rightRef.current) return;
    const tl = gsap.timeline({ delay: 0.5 });
    tl.fromTo(
      Array.from(rightRef.current.children),
      { y: 36, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.11 }
    );
    return () => tl.kill();
  }, []);

  return (
    <section id="hero" style={{
      position: 'relative',
      minHeight: '100vh',
      background: 'var(--hero-bg)',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
    }}>

      {/* Neon wave background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        opacity: theme === 'light' ? 0.22 : 0.38,
        filter: theme === 'light' ? 'saturate(1.05) contrast(1.02)' : 'saturate(1.15) contrast(1.06)',
      }}>
        <FloatingLines
          linesGradient={linesGradient}
          enabledWaves={['top', 'middle', 'bottom']}
          lineCount={[6, 8, 5]}
          lineDistance={[5, 4, 6]}
          animationSpeed={0.65}
          interactive={true}
          bendRadius={5.0}
          bendStrength={-0.5}
          parallax={true}
          parallaxStrength={0.15}
          mixBlendMode={theme === 'light' ? 'normal' : 'screen'}
          backgroundColor={theme === 'light' ? '#ffffff' : '#000000'}
        />
      </div>

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'var(--hero-vignette)',
      }} />
      <div className="cyber-grid" style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: 0.3, pointerEvents: 'none' }} />

      {/* ── Main content ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: '100%', maxWidth: 1260,
        margin: '0 auto',
        padding: '100px 48px 86px',
        display: 'flex',
        alignItems: 'center',
        gap: 72,
      }} className="hero-flex">

        {/* LEFT: Content (no logo — navbar has it) */}
        <div
          ref={rightRef}
          className="hero-content"
          style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
        >

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--hero-badge-bg)',
            border: '1px solid var(--hero-badge-border)',
            borderRadius: 100, padding: '5px 18px', marginBottom: 24,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#00FF9C', animation: 'pulse-glow 2s ease-in-out infinite',
              boxShadow: '0 0 8px rgba(0,255,156,0.7)', flexShrink: 0,
            }} />
            <span style={{
              fontFamily: 'var(--font-orbitron), monospace',
              fontSize: 9, letterSpacing: '2.5px',
              color: 'var(--hero-badge-text)',
              fontWeight: 600,
            }}>AI-POWERED CYBERSECURITY</span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontFamily: 'var(--font-orbitron), monospace',
            fontWeight: 900, lineHeight: 1.02,
            letterSpacing: '-0.5px', marginBottom: 20,
            fontSize: 'clamp(42px, 5.8vw, 78px)',
          }}>
            <span style={{ display: 'block', color: 'var(--text-primary)' }}>Modern</span>
            <span style={{
              display: 'block',
              background: 'linear-gradient(90deg, var(--cyan-primary), var(--cyan-secondary), var(--cyan-primary))',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: theme === 'light'
                ? 'drop-shadow(0 12px 26px rgba(79, 70, 229, 0.12))'
                : 'drop-shadow(0 0 22px rgba(99,102,241,0.22))',
            }}>Cyber Defense</span>
            <span style={{ display: 'block', color: 'var(--text-primary)', opacity: 0.9 }}>for Enterprises</span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontFamily: 'Inter, var(--font-space-grotesk), sans-serif',
            fontSize: 'clamp(14px,1.4vw,17px)', lineHeight: 1.85,
            color: 'var(--hero-subtitle)', marginBottom: 34, maxWidth: 440,
          }}>
            AI-powered monitoring, detection, and response for a world of persistent threats.{" "}
            <span style={{ color: 'var(--cyan-primary)', fontWeight: 600 }}>Zero-trust. Zero-compromise.</span>
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 42 }}>
            <button className="btn-primary" style={{ fontSize: 11, padding: '14px 32px' }}>
              START FREE AUDIT &nbsp;→
            </button>
            <button className="btn-outline" style={{ fontSize: 11, padding: '13px 31px' }}>
              WATCH DEMO &nbsp;▶
            </button>
          </div>

          {/* Stats */}
          {/* <div style={{
            display: 'flex', gap: 'clamp(18px,3.5vw,44px)', flexWrap: 'wrap',
            paddingTop: 26, borderTop: '1px solid rgba(0,180,255,0.12)', width: '100%',
          }}>
            {[
              { v: '500+',   l: 'Clients Protected', c: '#6366F1' },
              { v: '99.9%',  l: 'Detection Rate',    c: '#818CF8' },
              { v: '< 2ms',  l: 'Threat Response',   c: '#00FF9C' },
              { v: '24/7',   l: 'SOC Monitoring',    c: '#6366F1' },
            ].map(s => (
              <div key={s.l}>
                <div style={{
                  fontFamily: 'var(--font-orbitron), monospace',
                  fontSize: 'clamp(18px,2.2vw,24px)', fontWeight: 800,
                  color: s.c, textShadow: `0 0 16px ${s.c}55`,
                  lineHeight: 1, marginBottom: 5,
                }}>{s.v}</div>
                <div style={{
                  fontFamily: 'Inter, var(--font-space-grotesk), sans-serif',
                  fontSize: 10, color: 'var(--hero-stat-label)',
                  letterSpacing: '1.4px', textTransform: 'uppercase',
                }}>{s.l}</div>
              </div>
            ))}
          </div> */}
        </div>

        {/* RIGHT: Hero visual (video blend; falls back to LayeredShield if it fails) */}
        <div
          className="hero-visual"
          style={{
            flex: '0 0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: theme === 'light' ? 'scale(0.98)' : 'scale(1)',
            transformOrigin: 'center',
          }}
        >
          <BlendedHeroVideo theme={theme} />
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: 28, right: 32, zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0.4,
      }}>
        <span style={{
          fontFamily: 'var(--font-orbitron), monospace',
          fontSize: 8, letterSpacing: '3px', color: '#6366F1', writingMode: 'vertical-rl',
        }}>SCROLL</span>
        <div style={{
          width: 1, height: 36,
          background: 'linear-gradient(to bottom,#6366F1,transparent)',
          animation: 'pulse-glow 2s ease-in-out infinite',
        }} />
      </div>

      {/* Particles */}
      {[...Array(10)].map((_, i) => (
        <div key={i} className="hero-particle" style={{
          left: `${(i * 10) % 100}%`, bottom: '0%',
          animationDuration: `${9 + (i * 3.3) % 10}s`,
          animationDelay: `${(i * 2.1) % 7}s`,
        }} />
      ))}

      <style>{`
        @media (max-width: 860px) {
          .hero-flex {
            flex-direction: column !important;
            padding: 100px 24px 60px !important;
            gap: 48px !important;
            align-items: center !important;
          }
          .hero-content { align-items: center !important; text-align: center !important; }
          .hero-visual { transform: scale(0.92) !important; }
        }
      `}</style>
    </section>
  );
}
