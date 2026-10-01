'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: '20+', label: 'Enterprise Clients' },
  { value: '99.9%', label: 'Threat Detection' },
  { value: '< 2ms', label: 'Response Time' },
];

export default function AboutSection() {
  const sectionRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(leftRef.current, {
        scrollTrigger: { trigger: leftRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
        x: -60, opacity: 0, duration: 1.1, ease: 'power3.out',
      });
      gsap.from(rightRef.current.children, {
        scrollTrigger: { trigger: rightRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
        y: 40, opacity: 0, duration: 0.85, ease: 'power3.out', stagger: 0.1,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        background: 'var(--bg-primary)',
        padding: '80px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top gradient separator */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.18), transparent)',
      }} />

      {/* Subtle radial bg glow */}
      <div style={{
        position: 'absolute', top: '20%', right: '-10%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.04), transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>

        {/* ── Section badge + headline ── */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: 100, padding: '5px 18px', marginBottom: 20,
          }}>

            <span style={{
              fontFamily: 'var(--font-orbitron), monospace',
              fontSize: 9, letterSpacing: '2.5px', color: 'var(--hero-badge-text)', fontWeight: 600,
            }}>
              WHO WE ARE
            </span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-orbitron), monospace',
            fontSize: 'clamp(24px, 3.5vw, 36px)',
            fontWeight: 600, color: 'var(--text-primary)',
            letterSpacing: '-0.5px', lineHeight: 1.15,
          }}>
            Built on{' '}
            <span style={{
              background: 'linear-gradient(90deg, #6366F1, #818CF8, #a855f7, #FF3D5A, #00FF9C, #818CF8, #6366F1)',
              backgroundSize: '300% 100%',
              backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              animation: 'cyber-gradient-sweep 5s linear infinite',
            }}>
              Absolute Defense
            </span>
            . Proven by Results.
          </h2>
        </div>

        {/* ── Two-column layout ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 36,
          alignItems: 'center',
        }} className="about-grid">

          {/* ── LEFT: Video panel ── */}
          <div ref={leftRef} style={{ position: 'relative' }}>
            {/* Video container */}
            <div style={{
              borderRadius: 16,
              overflow: 'hidden',
              border: '1px solid var(--card-border)',
              boxShadow: 'var(--card-shadow)',
              position: 'relative',
              aspectRatio: '16/10',
            }}>
              {mounted && !videoFailed && (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onError={() => setVideoFailed(true)}
                  poster="/og-image.jpg"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transform: 'scale(1.08)',
                    transformOrigin: 'top left',
                  }}
                >
                  <source src="/grok-video-be4a4f39-a70b-41ec-af1d-5cf4d274b1aa.mp4" type="video/mp4" />
                </video>
              )}
              {videoFailed && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'radial-gradient(circle at 30% 20%, rgba(99,102,241,0.35), transparent 32%), linear-gradient(135deg, #070b17 0%, #111827 45%, #0f172a 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontFamily: 'var(--font-orbitron), monospace', letterSpacing: '0.18em',
                  fontSize: 12, textTransform: 'uppercase',
                }}>
                  Security overview
                </div>
              )}
              {/* Overlay tint */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(0,0,0,0.10), rgba(99,102,241,0.06))',
              }} />
              {/* Scan line */}
              <div style={{
                position: 'absolute', left: 0, right: 0, height: 2,
                background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)',
                animation: 'scanbeam 3s ease-in-out infinite',
              }} />
            </div>

            {/* ── Floating stat card (bottom-left) ── */}
            {/* <div style={{
              position: 'absolute',
              bottom: -24,
              left: -20,
              background: 'var(--glass-bg-dark)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid var(--glass-border)',
              borderRadius: 12,
              padding: '20px 24px',
              boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
              minWidth: 180,
              zIndex: 2,
            }}>
              <div style={{
                fontFamily: 'var(--font-orbitron), monospace',
                fontSize: 'clamp(28px,3vw,38px)', fontWeight: 900,
                color: '#6366F1', lineHeight: 1,
                textShadow: '0 0 20px rgba(99,102,241,0.45)',
                marginBottom: 6,
              }}>
                99.9%
              </div>
              <div style={{
                fontFamily: 'var(--font-space-grotesk), Inter, sans-serif',
                fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4,
              }}>
                Threat detection &amp;<br />prevention rate
              </div>
              {/* Active indicator */}
            {/* <div style={{
              display: 'flex', alignItems: 'center', gap: 6, marginTop: 10,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#00FF9C', boxShadow: '0 0 6px rgba(0,255,156,0.6)',
                animation: 'pulse-glow 2s ease-in-out infinite',
              }} />
              <span style={{
                fontFamily: 'var(--font-orbitron), monospace',
                fontSize: 8, letterSpacing: '1.5px', color: 'rgba(0,255,156,0.7)',
              }}>
                LIVE MONITORING
              </span>
            </div>
          </div> */}

            {/* ── Second floating card (top-right) ── */}
            {/* <div style={{
              position: 'absolute',
              top: -20,
              right: -20,
              background: 'var(--glass-bg-dark)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid var(--glass-border)',
              borderRadius: 10,
              padding: '14px 18px',
              zIndex: 2,
            }}>
              <div style={{
                fontFamily: 'var(--font-orbitron), monospace',
                fontSize: 'clamp(28px,3vw,38px)', fontWeight: 900,
                color: '#6366F1', letterSpacing: '-1px',
                lineHeight: 1, marginBottom: 4,
              }}>
                20+
              </div>
              <div style={{
                fontFamily: 'var(--font-space-grotesk), Inter, sans-serif',
                fontSize: 11, color: 'var(--text-secondary)',
              }}>
                Enterprise Clients
              </div>
            </div> */}
          </div>

          {/* ── RIGHT: Text content ── */}
          <div ref={rightRef} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

            <p style={{
              fontFamily: 'var(--font-space-grotesk), Inter, sans-serif',
              fontSize: 'clamp(15px,1.5vw,17px)', lineHeight: 1.85,
              color: 'var(--text-secondary)', marginBottom: 36,
            }}>
              Aritaro helps modern businesses strengthen their digital defense through advanced cybersecurity,
              intelligent automation, and trusted security expertise. We build solutions that protect operations,
              reduce exposure, and keep organisations ready for what&apos;s next.
            </p>

            {/* Mini stats row */}
            {/* <div style={{
              display: 'flex', gap: 28, flexWrap: 'wrap', marginBottom: 36,
              paddingBottom: 28,
              borderBottom: '1px solid rgba(99,102,241,0.08)',
            }}>
              {STATS.map(s => (
                <div key={s.label}>
                  <div style={{
                    fontFamily: 'var(--font-orbitron), monospace',
                    fontSize: 'clamp(20px,2vw,26px)', fontWeight: 800,
                    color: '#6366F1', textShadow: '0 0 14px rgba(99,102,241,0.4)',
                    lineHeight: 1, marginBottom: 5,
                  }}>{s.value}</div>
                  <div style={{
                    fontFamily: 'var(--font-space-grotesk), Inter, sans-serif',
                    fontSize: 11, color: 'rgba(159,176,195,0.65)',
                    letterSpacing: '1.2px', textTransform: 'uppercase',
                  }}>{s.label}</div>
                </div>
              ))}
            </div> */}

            {/* CTA */}
            <div>
              <button className="btn-primary" style={{ fontSize: 11, padding: '13px 28px' }}>
                Request Security Audit
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom separator */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.12), transparent)',
      }} />

      <style>{`
        @media (max-width: 860px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes scanbeam {
          0%   { top: 0%; opacity: 0.9; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </section >
  );
}
