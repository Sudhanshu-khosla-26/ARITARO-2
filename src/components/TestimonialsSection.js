'use client';

import { useRef } from 'react';
import Link from 'next/link';

const testimonials = [
  {
    quote: "Aritaro's MDR platform detected and neutralized a sophisticated supply-chain attack within 90 seconds. Our previous provider didn't even have the telemetry to see it.",
    name: 'Alexandra Reeves',
    role: 'CISO',
    company: 'Global Fintech Group',
    tag: 'MDR',
    stars: 5,
  },
  {
    quote: "The red team engagement exposed 14 critical vulnerabilities across our OT environment that had been invisible for years. The debrief alone was worth the entire engagement.",
    name: 'Marcus T. Chen',
    role: 'VP Security',
    company: 'NexaEnergy Corp',
    tag: 'Red Team',
    stars: 5,
  },
  {
    quote: "From day one, Aritaro felt like an extension of our team. The CSPM tooling cut our cloud misconfiguration incidents by 94% in the first quarter alone.",
    name: 'Dr. Priya Nair',
    role: 'Head of IT Risk',
    company: 'MedBridge Health',
    tag: 'Cloud Security',
    stars: 5,
  },
  {
    quote: "When ransomware hit us, Aritaro had us contained and in recovery within 4 hours. The forensic report exceeded every regulatory requirement by a wide margin.",
    name: 'James O. Fitzgerald',
    role: 'CEO',
    company: 'Apex Legal Partners',
    tag: 'Incident Response',
    stars: 5,
  },
  {
    quote: "Their zero-trust implementation is the gold standard. We achieved SOC 2 Type II in record time. The ongoing compliance automation saves us 300+ hours per quarter.",
    name: 'Sarah Kowalski',
    role: 'CTO',
    company: 'CloudStack Ventures',
    tag: 'Compliance',
    stars: 5,
  },
  {
    quote: "AI-powered anomaly detection combined with 24/7 SOC monitoring gives our board the confidence that we're operating at the highest possible security maturity level.",
    name: 'Raymond Li',
    role: 'Director of Security',
    company: 'AsiaPacific Manufacturing',
    tag: 'AI Detection',
    stars: 5,
  },
  {
    quote: "We tested five vendors. Aritaro was the only one that proactively detected a misconfiguration in our staging environment during the evaluation period itself.",
    name: 'Yuki Tanaka',
    role: 'CISO',
    company: 'Nexus Digital Tokyo',
    tag: 'Zero-Trust',
    stars: 5,
  },
  {
    quote: "Post-merger security integration across three different tech stacks would have been a nightmare without Aritaro's identity fabric. They made it seamless.",
    name: 'Elena Vasquez',
    role: 'Chief Risk Officer',
    company: 'Meridian Capital Group',
    tag: 'Identity & Access',
    stars: 5,
  },
];

const row1Items = [...testimonials, ...testimonials];
const row2Items = [...testimonials.slice(4), ...testimonials.slice(0, 4), ...testimonials.slice(4), ...testimonials.slice(0, 4)];

function StarRating({ count }) {
  return (
    <div style={{ display: 'flex', gap: '3px', marginBottom: '16px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="#FBBF24" opacity="0.9">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t }) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glow.style.background = `radial-gradient(300px circle at ${x}px ${y}px, rgba(6,182,212,0.10), transparent 70%)`;
  };

  const handleMouseLeave = () => {
    if (glowRef.current) glowRef.current.style.background = 'transparent';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        flexShrink: 0,
        width: 'min(340px, 82vw)',
        margin: '0 10px',
        borderRadius: '16px',
        padding: '24px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
        transition: 'border-color 0.2s ease',
        cursor: 'default',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(6,182,212,0.25)')}
    >
      {/* Mouse-follow glow — positioned absolutely, pointer-events none */}
      <div
        ref={glowRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          borderRadius: 'inherit',
          transition: 'background 0.1s ease',
        }}
      />

      {/* Content — sits on top of glow */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <StarRating count={t.stars} />

        {/* Tag */}
        <div style={{
          display: 'inline-flex',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '6px',
          padding: '3px 10px',
          marginBottom: '14px',
        }}>
          <span style={{
            fontSize: '9px',
            letterSpacing: '1.5px',
            color: 'rgba(255,255,255,0.45)',
            fontWeight: '600',
            fontFamily: 'var(--font-mono, monospace)',
            textTransform: 'uppercase',
          }}>
            {t.tag}
          </span>
        </div>

        {/* Large open-quote */}
        <div style={{
          fontFamily: 'Georgia, serif',
          fontSize: '52px',
          color: 'rgba(255,255,255,0.06)',
          lineHeight: '0.7',
          marginBottom: '10px',
          userSelect: 'none',
        }}>
          &ldquo;
        </div>

        <p style={{
          fontSize: '13.5px',
          lineHeight: '1.75',
          color: 'rgba(148,163,184,0.85)',
          marginBottom: '22px',
          fontStyle: 'italic',
        }}>
          {t.quote}
        </p>

        {/* Author */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            width: '36px', height: '36px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: '700', color: 'rgba(255,255,255,0.7)',
            flexShrink: 0,
            fontFamily: 'var(--font-mono, monospace)',
          }}>
            {t.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
          </div>
          <div>
            <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#F1F5F9', lineHeight: 1.2 }}>
              {t.name}
            </div>
            <div style={{ fontSize: '11.5px', color: 'rgba(100,116,139,0.9)', marginTop: '3px' }}>
              {t.role} · <span style={{ color: 'rgba(255,255,255,0.45)' }}>{t.company}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      style={{
        position: 'relative',
        padding: '80px 0',
        background: 'var(--bg-base)',
        overflow: 'hidden',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      {/* Soft ambient glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px', height: '500px',
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px', padding: '0 32px', position: 'relative', zIndex: 2 }}>
        {/* Muted mono kicker — matches company logos section */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 14,
          marginBottom: '20px',
        }}>
          <span style={{ width: 25, height: 1, background: 'rgba(255,255,255,0.12)', display: 'block' }} />
          <span style={{
            fontSize: '10px',
            letterSpacing: '0.22em',
            color: 'rgba(255,255,255,0.28)',
            fontFamily: 'var(--font-mono, monospace)',
            textTransform: 'uppercase',
          }}>
            Client Testimonials
          </span>
          <span style={{ width: 25, height: 1, background: 'rgba(255,255,255,0.12)', display: 'block' }} />
        </div>

        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 52px)',
          fontWeight: '750',
          lineHeight: '1.05',
          letterSpacing: '-0.04em',
          color: '#ffffff',
          marginBottom: '10px',
        }}>
          Trusted by cybersecurity
          <br />
          <span style={{ color: 'rgba(255,255,255,0.32)' }}>leaders globally.</span>
        </h2>

        <p style={{
          fontSize: '15px',
          color: 'rgba(148,163,184,0.75)',
          maxWidth: '440px',
          margin: '16px auto 0',
          lineHeight: '1.7',
        }}>
          Over 500 enterprises protected. Read what security professionals say about our work.
        </p>
      </div>

      {/* Marquee Wrapper */}
      <div className="testimonials-wrapper" style={{ position: 'relative', zIndex: 2 }}>
        {/* Fade masks */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '180px',
          background: 'linear-gradient(90deg, var(--bg-base) 0%, transparent 100%)',
          zIndex: 10, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '180px',
          background: 'linear-gradient(-90deg, var(--bg-base) 0%, transparent 100%)',
          zIndex: 10, pointerEvents: 'none',
        }} />

        {/* Row 1 */}
        <div style={{ overflow: 'hidden', marginBottom: '20px' }}>
          <div className="marquee-track-left" style={{ display: 'flex', width: 'max-content', alignItems: 'stretch' }}>
            {row1Items.map((t, i) => <TestimonialCard key={`r1-${i}`} t={t} />)}
          </div>
        </div>

        {/* Row 2 */}
        <div style={{ overflow: 'hidden' }}>
          <div className="marquee-track-right" style={{ display: 'flex', width: 'max-content', alignItems: 'stretch' }}>
            {row2Items.map((t, i) => <TestimonialCard key={`r2-${i}`} t={t} />)}
          </div>
        </div>
      </div>

      {/* Mobile Swipeable Track */}
      <div className="mobile-only-track" style={{ position: 'relative', zIndex: 2, display: 'none' }}>
        <div
          style={{
            display: 'flex', overflowX: 'auto',
            scrollSnapType: 'x mandatory', gap: '16px',
            padding: '0 24px 20px', WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
          className="no-scrollbar"
        >
          {testimonials.map((t, i) => (
            <div key={`mob-${i}`} style={{ scrollSnapAlign: 'center', flexShrink: 0 }}>
              <TestimonialCard t={t} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-track-left {
          animation: marquee-left 50s linear infinite;
        }
        .marquee-track-right {
          animation: marquee-right 55s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @media (max-width: 768px) {
          .testimonials-wrapper { display: none !important; }
          .mobile-only-track   { display: block !important; }
        }
      `}</style>
    </section>
  );
}
