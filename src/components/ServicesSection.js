'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSession } from 'next-auth/react';
import { useCart } from './CartContext';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    number: '01',
    title: 'API Penetration Testing',
    desc: 'Deep, manual and automated testing of REST, GraphQL, gRPC & SOAP APIs. OWASP API Security Top 10 coverage with code-level remediation.',
    features: ['REST/GraphQL', 'JWT/OAuth', 'BOLA/IDOR', 'OWASP API Top 10'],
    color: '#3B82F6',
    href: '/services/api-pt',
    icon: (
      <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="3" width="22" height="22" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 14h4l2-4 2 6 2-3h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="21" cy="7" r="3" fill="currentColor" opacity="0.3" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Web Application PT',
    desc: 'Comprehensive OWASP-based security assessment of web applications. Manual, logic-aware testing that finds what automated scanners miss.',
    features: ['OWASP Top 10', 'Auth Bypass', 'Business Logic', 'XSS/SQLi'],
    color: '#6366F1',
    href: '/services/wap-pt',
    icon: (
      <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
        <rect x="2" y="5" width="24" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 10h24" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <circle cx="6" cy="7.5" r="1" fill="currentColor" opacity="0.5" />
        <circle cx="9.5" cy="7.5" r="1" fill="currentColor" opacity="0.5" />
        <circle cx="13" cy="7.5" r="1" fill="currentColor" opacity="0.5" />
        <path d="M8 17l3-3 3 3 4-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Cloud Security Assessment',
    desc: 'Adversarial review of AWS, Azure & GCP environments. Identify misconfigurations, exposed storage, and over-privileged IAM policies.',
    features: ['AWS/Azure/GCP', 'IAM Review', 'CIS Benchmarks', 'Attack Paths'],
    color: '#818CF8',
    href: '/services/cloud',
    icon: (
      <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
        <path d="M20 13h-1.26A7.5 7.5 0 108 19h12a4.5 4.5 0 000-9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M14 3L4 7v8c0 5.25 4.4 9.8 10 11 5.6-1.2 10-5.75 10-11V7L14 3z" stroke="currentColor" strokeWidth="1" opacity="0.2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'AI Penetration Testing',
    desc: 'Dedicated AI/LLM security testing — prompt injection, data exfiltration, model attacks & agentic AI security. One of few firms in India.',
    features: ['LLM Top 10', 'Prompt Injection', 'RAG Poisoning', 'Agent Security'],
    color: '#A855F7',
    href: '/services/ai-pt',
    icon: (
      <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="4" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.1" />
        <path d="M14 4v6M14 18v6M4 14h6M18 14h6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        <circle cx="14" cy="14" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
];

/* ─── Spring-physics tilt card ──────────────────────── */
/*
  Uses a per-frame lerp loop so rotX/rotY *chase* the target
  at ~8% per frame — giving a smooth, elastic follow-through
  instead of instant snap.
*/
function SpringTiltCard({ service, cardRef: externalRef }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const shimRef = useRef(null);
  const rafRef = useRef(null);
  const stateRef = useRef({
    active: false,
    targetX: 0, targetY: 0,
    currentX: 0, currentY: 0,
    glowX: 50, glowY: 50,
  });

  const isThreat = false;
  const accentRGB = '99,102,241';

  /* spring loop — runs only while hovered */
  const springLoop = useCallback(() => {
    const s = stateRef.current;
    if (!s.active) return;

    const LERP = 0.09; // ← smaller = more lag = smoother
    s.currentX += (s.targetX - s.currentX) * LERP;
    s.currentY += (s.targetY - s.currentY) * LERP;

    if (cardRef.current) {
      cardRef.current.style.transform =
        `perspective(800px) rotateX(${s.currentX}deg) rotateY(${s.currentY}deg) translateZ(8px) scale3d(1.015,1.015,1)`;
    }

    if (glowRef.current) {
      glowRef.current.style.background =
        `radial-gradient(circle at ${s.glowX}% ${s.glowY}%, rgba(${accentRGB},0.18) 0%, transparent 65%)`;
    }

    // keep running until we're visually settled
    const settled =
      Math.abs(s.currentX) < 0.02 &&
      Math.abs(s.currentY) < 0.02 &&
      Math.abs(s.targetX) < 0.02 &&
      Math.abs(s.targetY) < 0.02;
    if (!settled) rafRef.current = requestAnimationFrame(springLoop);
  }, [accentRGB]);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 → 1
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    const s = stateRef.current;
    s.targetX = -ny * 11;
    s.targetY = nx * 11;
    s.glowX = ((nx + 1) / 2) * 100;
    s.glowY = ((ny + 1) / 2) * 100;
  }, []);

  const handleEnter = useCallback(() => {
    stateRef.current.active = true;
    if (shimRef.current) shimRef.current.style.opacity = '1';
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(springLoop);
  }, [springLoop]);

  const handleLeave = useCallback(() => {
    const s = stateRef.current;
    s.active = false;
    s.targetX = 0;
    s.targetY = 0;

    if (shimRef.current) shimRef.current.style.opacity = '0';
    if (glowRef.current) glowRef.current.style.background = 'none';

    // let spring settle back to zero
    const settleBack = () => {
      const LERP = 0.09;
      s.currentX += (0 - s.currentX) * LERP;
      s.currentY += (0 - s.currentY) * LERP;

      if (cardRef.current) {
        cardRef.current.style.transform =
          `perspective(800px) rotateX(${s.currentX}deg) rotateY(${s.currentY}deg) translateZ(0) scale3d(1,1,1)`;
      }

      if (Math.abs(s.currentX) > 0.02 || Math.abs(s.currentY) > 0.02) {
        rafRef.current = requestAnimationFrame(settleBack);
      } else {
        if (cardRef.current) {
          cardRef.current.style.transform = '';
        }
      }
    };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(settleBack);
  }, []);

  // merge external ref (for gsap scroll anim) + internal ref
  const setRef = useCallback((el) => {
    cardRef.current = el;
    if (typeof externalRef === 'function') externalRef(el);
    else if (externalRef) externalRef.current = el;
  }, [externalRef]);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  return (
    <div
      ref={setRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        position: 'relative',
        background: '',
        border: `1px solid var(--service-card-border)`,
        borderRadius: 16,
        padding: '26px 22px',
        cursor: 'default',
        willChange: 'transform',
        transformStyle: 'preserve-3d',
        overflow: 'hidden',
        boxShadow: 'var(--service-card-shadow)',
        /* border transition handled by CSS class */
      }}
      className="s-card"
    >
      {/* Spotlight glow (cursor tracked) */}
      <div ref={glowRef} style={{
        position: 'absolute', inset: 0,
        borderRadius: 'inherit',
        pointerEvents: 'none',
        transition: 'background 0.04s',
      }} />

      {/* Hover border overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: 'inherit',
        border: `1px solid rgba(${accentRGB},0)`,
        pointerEvents: 'none',
        transition: 'border-color 0.35s ease',
      }} className="s-card-border" />

      {/* Bottom shimmer line */}
      <div ref={shimRef} style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, rgba(${accentRGB},0.8), transparent)`,
        borderRadius: '0 0 16px 16px',
        opacity: 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none',
      }} />

      {/* Card content */}
      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Number badge */}
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9, fontWeight: 700,
          color: 'rgba(99,102,241,0.35)',
          letterSpacing: '1px',
          display: 'block',
          marginBottom: 12,
        }}>
          {service.number}
        </span>

        {/* Icon */}
        <div
          className="s-icon"
          style={{
            width: 44, height: 44,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: service.color,
            background: 'rgba(99,102,241,0.07)',
            border: '1px solid rgba(99,102,241,0.15)',
            marginBottom: 16,
            transition: 'all 0.35s ease',
          }}
        >
          {service.icon}
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(12px, 1.2vw, 14px)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 10,
          lineHeight: 1.35,
        }}>
          {service.title}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: 12,
          color: 'var(--text-muted)',
          lineHeight: 1.75,
          marginBottom: 16,
        }}>
          {service.desc}
        </p>

        {/* Feature tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {service.features.map((f) => (
            <span
              key={f}
              className="feature-tag"
              style={{}}
            >
              {f}
            </span>
          ))}
        </div>

        {/* Bottom accent line */}
        <div style={{
          marginTop: 18, height: 1,
          background: 'linear-gradient(90deg, rgba(99,102,241,0.2), transparent 70%)',
          marginBottom: 14,
        }} />

        {/* Add to Cart button */}
        <CartButton service={service} />
      </div>
    </div>
  );
}

function CartButton({ service }) {
  const { isInCart, addToCart, removeFromCart, openCart } = useCart();
  const added = isInCart(service.number);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (added) {
          removeFromCart(service.number);
        } else {
          addToCart(service);
          openCart(); // Show the cart panel immediately on add for rich interactive experience!
        }
      }}
      style={{
        width: '100%',
        fontSize: 11,
        fontWeight: 600,
        padding: '9px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        border: '1px solid',
        borderColor: added ? '#3B82F6' : 'rgba(255,255,255,0.08)',
        color: added ? '#3B82F6' : '#94A3B8',
        background: added ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255, 255, 255, 0.02)',
        cursor: 'pointer',
        borderRadius: 8,
        transition: 'all 0.2s ease-in-out',
        fontFamily: 'var(--font-sans)',
      }}
      onMouseEnter={(e) => {
        if (!added) {
          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)';
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.background = 'rgba(59, 130, 246, 0.04)';
        }
      }}
      onMouseLeave={(e) => {
        if (!added) {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
          e.currentTarget.style.color = '#94A3B8';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
        }
      }}
    >
      {added ? (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Added
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add to Cart
        </>
      )}
    </button>
  );
}

/* ─── Section ───────────────────────────────────────── */
export default function ServicesSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        scrollTrigger: { trigger: headingRef.current, start: 'top 82%', toggleActions: 'play none none reverse' },
        y: 60, opacity: 0, duration: 1.1, ease: 'power3.out',
      });

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none reverse' },
          y: 70, opacity: 0, duration: 0.85,
          delay: (i % 4) * 0.10,
          ease: 'power3.out',
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
    <section
      id="services"
      ref={sectionRef}
      style={{
        position: 'relative',
        padding: '110px 0 120px',
        background: 'var(--bg-primary)',
        overflow: 'hidden',
      }}
    >
      {/* Bg decorations */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.15), transparent)',
      }} />
      <div className="cyber-grid" style={{ position: 'absolute', inset: 0, opacity: 0.2, pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>

        {/* Section heading */}
        <div ref={headingRef} style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            borderRadius: 100, padding: '6px 20px',
            marginBottom: 22,
            backdropFilter: 'blur(12px)',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--cyan-primary)',
              boxShadow: '0 0 8px rgba(99,102,241,0.5)',
              animation: 'pulse-glow 2s ease-in-out infinite',
              flexShrink: 0,
            }} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10, letterSpacing: '2.5px',
              color: 'var(--hero-badge-text)', fontWeight: 600,
            }}>
              OFFENSIVE SECURITY
            </span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(28px, 5vw, 54px)',
            fontWeight: 900, lineHeight: 1.1,
            letterSpacing: '-0.5px',
            color: 'var(--text-primary)',
            marginBottom: 18,
          }}>
            Security that{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 60%, #6366F1 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 12px rgba(99,102,241,0.35))',
            }}>
              protects
            </span>
          </h2>

          <p style={{
            maxWidth: 540, margin: '0 auto',
            color: 'var(--text-muted)',
            fontSize: 16, lineHeight: 1.75,
          }}>
            Expert penetration testing across APIs, web applications, cloud infrastructure, and AI systems 
            certified, transparent, and built for India&apos;s most security-conscious enterprises.
          </p>
        </div>

        {/* Cards grid — show all 4 services */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }} className="services-grid">
          {services.map((service, i) => (
            <a
              key={service.number}
              href={service.href}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <SpringTiltCard
                service={service}
                cardRef={(el) => { cardsRef.current[i] = el; }}
              />
            </a>
          ))}
        </div>

        {/* View All Services CTA */}
        {/* <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          marginTop: 64,
          padding: '48px 32px',
          background: 'rgba(99,102,241,0.04)',
          border: '1px solid rgba(99,102,241,0.12)',
          borderRadius: 24,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '-50%', left: '50%',
            transform: 'translateX(-50%)',
            width: '60%', height: '200%',
            background: 'radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <p style={{
            fontSize: 15,
            color: '#64748B',
            textAlign: 'center',
            lineHeight: 1.7,
            maxWidth: 480,
            position: 'relative',
            zIndex: 1,
          }}>
            Need a{' '}
            <span style={{ color: '#818CF8', fontWeight: 600 }}>
              custom security assessment
            </span>
            ? We scope engagements to your exact needs —<br />
            from single API testing to full red team operations.
          </p>

          <button
            onClick={() => {
              const el = document.querySelector('#contact');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            style={{
              position: 'relative',
              zIndex: 1,
              fontSize: 15,
              fontWeight: 700,
              padding: '15px 40px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
              border: 'none',
              borderRadius: 12,
              color: '#fff',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              boxShadow: '0 6px 28px rgba(99,102,241,0.4)',
              transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 48px rgba(99,102,241,0.55)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 28px rgba(99,102,241,0.4)';
            }}
          >
            Book Free Assessment
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div> */}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .services-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .services-grid { grid-template-columns: 1fr !important; }
        }

        /* hover states driven by CSS for instant border feedback */
        .s-card:hover {
          border-color: transparent !important;
          box-shadow: 0 20px 60px rgba(0,0,0,0.45), 0 0 0 1px rgba(99,102,241,0.3) !important;
        }
        .s-card:hover .s-card-border {
          border-color: rgba(99,102,241,0.5) !important;
        }
        .s-card:hover .s-icon {
          background: rgba(99,102,241,0.15) !important;
          border-color: rgba(99,102,241,0.4) !important;
          box-shadow: 0 0 20px rgba(99,102,241,0.2) !important;
        }
      `}</style>
    </section>
    </>
  );
}
