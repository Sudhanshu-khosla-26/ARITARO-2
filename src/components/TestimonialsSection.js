'use client';

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

// Double the items for seamless infinite scrolling
const row1Items = [...testimonials, ...testimonials];
const row2Items = [...testimonials.slice(4), ...testimonials.slice(0, 4), ...testimonials.slice(4), ...testimonials.slice(0, 4)];

function StarRating({ count }) {
  return (
    <div style={{ display: 'flex', gap: '3px', marginBottom: '16px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#FBBF24" opacity="0.9">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t }) {
  return (
    <div
      style={{
        flexShrink: 0,
        width: 'min(340px, 82vw)', // responsive fluid scaling on mobile viewports
        margin: '0 12px',
        borderRadius: '14px',
        padding: '24px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease',
      }}
    >
      <StarRating count={t.stars} />

      {/* Tag */}
      <div style={{
        display: 'inline-flex',
        background: 'rgba(99, 102, 241, 0.08)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: '6px',
        padding: '4px 10px',
        marginBottom: '14px',
      }}>
        <span style={{
          fontFamily: 'var(--font-sans), monospace',
          fontSize: '9px',
          letterSpacing: '1.5px',
          color: '#3B82F6',
          fontWeight: '600',
        }}>
          {t.tag}
        </span>
      </div>

      {/* Quote symbol */}
      <div style={{
        fontFamily: 'Georgia, serif',
        fontSize: '40px',
        color: '#1C1F26',
        lineHeight: '0.6',
        marginBottom: '10px',
        userSelect: 'none',
      }}>
        &ldquo;
      </div>

      <p style={{
        fontFamily: 'var(--font-sans), sans-serif',
        fontSize: '13.5px',
        lineHeight: '1.7',
        color: '#94A3B8',
        marginBottom: '24px',
        fontStyle: 'italic',
      }}>
        {t.quote}
      </p>

      {/* Author details */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        paddingTop: '16px',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        <div style={{
          width: '36px', height: '36px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-sans)',
          fontSize: '12px',
          fontWeight: '700',
          color: '#fff',
          flexShrink: 0,
        }}>
          {t.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-sans), sans-serif',
            fontSize: '13.5px', fontWeight: '600',
            color: '#F9FAFB',
            lineHeight: 1.2,
          }}>
            {t.name}
          </div>
          <div style={{
            fontFamily: 'var(--font-sans), sans-serif',
            fontSize: '11.5px',
            color: '#6B7280',
            marginTop: '3px',
          }}>
            {t.role} · <span style={{ color: '#3B82F6' }}>{t.company}</span>
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
      {/* Background radial soft light */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%', maxWidth: '1200px', height: '600px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.02) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header Container */}
      <div style={{ textAlign: 'center', marginBottom: '40px', padding: '0 32px', position: 'relative', zIndex: 2 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '100px',
          padding: '6px 18px', marginBottom: '20px',
        }}>
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '10px', letterSpacing: '2.5px',
            color: '#3B82F6', fontWeight: '600',
          }}>
            TESTIMONIALS
          </span>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(22px, 3.5vw, 32px)',
          fontWeight: '600', lineHeight: '1.2',
          color: '#F9FAFB', marginBottom: '14px',
        }}>
          Trusted by cybersecurity{' '}
          <span style={{
            background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
            backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            leaders globally
          </span>
        </h2>

        <p style={{
          fontFamily: 'var(--font-sans), sans-serif',
          fontSize: '15px',
          color: '#6B7280',
          maxWidth: '480px', margin: '0 auto', lineHeight: '1.6',
        }}>
          Over 500 enterprises protected. Read what security professionals say about our services.
        </p>
      </div>

      {/* Marquee Wrapper */}
      <div className="testimonials-wrapper" style={{ position: 'relative', zIndex: 2 }}>
        {/* Left Fade Overlay */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '15%',
          background: 'linear-gradient(90deg, var(--bg-base) 0%, transparent 100%)',
          zIndex: 10, pointerEvents: 'none',
        }} />
        {/* Right Fade Overlay */}
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '15%',
          background: 'linear-gradient(-90deg, var(--bg-base) 0%, transparent 100%)',
          zIndex: 10, pointerEvents: 'none',
        }} />

        {/* Row 1 (Scrolling Left) */}
        <div style={{ overflow: 'hidden', marginBottom: '24px' }}>
          <div className="marquee-track-left">
            {row1Items.map((t, i) => (
              <TestimonialCard key={`r1-${i}`} t={t} />
            ))}
          </div>
        </div>

        {/* Row 2 (Scrolling Right) */}
        <div style={{ overflow: 'hidden' }}>
          <div className="marquee-track-right">
            {row2Items.map((t, i) => (
              <TestimonialCard key={`r2-${i}`} t={t} />
            ))}
          </div>
        </div>
      </div>

      {/* CSS Keyframes declaration */}
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        
        .marquee-track-left {
          display: flex;
          width: max-content;
          animation: marquee-left 40s linear infinite;
        }
        
        .marquee-track-right {
          display: flex;
          width: max-content;
          animation: marquee-right 45s linear infinite;
        }

        @media (max-width: 768px) {
          .testimonials-wrapper { padding: 0 8px; }
          .testimonials-wrapper > div { gap: 12px !important; }
        }
        @media (max-width: 480px) {
          .testimonials-wrapper > div > div:last-child { display: none; }
        }
      `}</style>
    </section>
  );
}
