'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const securityFeatures = [
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
        <polygon points="24,4 42,13 42,35 24,44 6,35 6,13" stroke="#00ff7f" strokeWidth="1.5" fill="rgba(0,255,127,0.06)" />
        <path d="M24 18 L24 30 M18 22 Q24 14 30 22" stroke="#00ff7f" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="24" cy="32" r="2.5" fill="#00ff7f" />
      </svg>
    ),
    title: 'Zero-Trust Architecture',
    desc: 'Never trust, always verify. Every access request is authenticated, authorized, and encrypted — regardless of network origin.',
    tag: 'CORE',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
        <rect x="8" y="8" width="32" height="32" rx="4" stroke="#00ff7f" strokeWidth="1.5" fill="rgba(0,255,127,0.06)" />
        <path d="M16 24 L22 30 L32 18" stroke="#00ff7f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="36" cy="12" r="6" fill="#020407" stroke="#00ff7f" strokeWidth="1.5" />
        <circle cx="36" cy="12" r="2.5" fill="#00ff7f" />
      </svg>
    ),
    title: 'AI Threat Detection',
    desc: 'Machine-learning models analyze 10M+ events/second, detecting anomalies and neutralizing threats before they escalate.',
    tag: 'AI-POWERED',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
        <circle cx="24" cy="24" r="18" stroke="#00ff7f" strokeWidth="1.5" fill="rgba(0,255,127,0.06)" strokeDasharray="4 2" />
        <circle cx="24" cy="24" r="10" stroke="#00ff7f" strokeWidth="1" fill="none" />
        <circle cx="24" cy="24" r="3" fill="#00ff7f" />
        <line x1="24" y1="6" x2="24" y2="14" stroke="#00ff7f" strokeWidth="1.5" />
        <line x1="42" y1="24" x2="34" y2="24" stroke="#00ff7f" strokeWidth="1.5" />
        <line x1="24" y1="42" x2="24" y2="34" stroke="#00ff7f" strokeWidth="1.5" />
        <line x1="6" y1="24" x2="14" y2="24" stroke="#00ff7f" strokeWidth="1.5" />
      </svg>
    ),
    title: 'Global SOC Operations',
    desc: '24/7 Security Operations Centers across 3 continents, with elite analysts monitoring your assets around the clock.',
    tag: 'ENTERPRISE',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
        <path d="M8 16 L24 8 L40 16 L40 26 C40 34 32 41 24 44 C16 41 8 34 8 26 Z" stroke="#00ff7f" strokeWidth="1.5" fill="rgba(0,255,127,0.06)" />
        <path d="M17 24 L22 29 L31 20" stroke="#00ff7f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Compliance & Governance',
    desc: 'ISO 27001, SOC 2 Type II, GDPR, HIPAA — automated compliance reporting keeps you audit-ready at all times.',
    tag: 'COMPLIANCE',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
        <path d="M6 24 C6 13.5 13.5 6 24 6" stroke="#00ff7f" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M42 24 C42 34.5 34.5 42 24 42" stroke="#00ff7f" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="20" y="14" width="8" height="20" rx="4" stroke="#ff2d55" strokeWidth="1.5" fill="rgba(255,45,85,0.06)" />
        <circle cx="24" cy="24" r="2" fill="#ff2d55" />
      </svg>
    ),
    title: 'Red Team Operations',
    desc: 'Elite penetration testing and adversarial simulations expose vulnerabilities before attackers can exploit them.',
    tag: 'OFFENSIVE',
  },
  {
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
        <rect x="6" y="10" width="36" height="28" rx="3" stroke="#00ff7f" strokeWidth="1.5" fill="rgba(0,255,127,0.06)" />
        <path d="M14 18 L34 18 M14 24 L28 24 M14 30 L22 30" stroke="#00ff7f" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="32" y="22" width="8" height="10" rx="2" stroke="#00ff7f" strokeWidth="1.2" fill="rgba(0,255,127,0.15)" />
        <path d="M34 27 L38 27" stroke="#00ff7f" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Incident Response',
    desc: 'Sub-2-minute mean time to respond. Our DFIR team contains breaches, preserves evidence, and restores operations fast.',
    tag: 'RESPONSE',
  },
];

export default function SecuredSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      });

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          y: 60,
          opacity: 0,
          duration: 0.8,
          delay: (i % 3) * 0.1,
          ease: 'power3.out',
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Anchor for "About" navbar link */}
      <div id="about" style={{ position: 'absolute', top: '-72px' }} />
      <section
        id="secured"
        ref={sectionRef}
      style={{
        position: 'relative',
        padding: '120px 0',
        background: 'linear-gradient(180deg, #020407 0%, #040d08 50%, #020407 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Background decorations */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '-10%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,255,127,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,45,85,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(0,255,127,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,127,0.02) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
        {/* Heading */}
        <div ref={headingRef} style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 255, 127, 0.06)',
            border: '1px solid rgba(0, 255, 127, 0.15)',
            borderRadius: '100px',
            padding: '6px 16px',
            marginBottom: '24px',
          }}>
            <span style={{
              fontFamily: 'var(--font-orbitron), monospace',
              fontSize: '10px',
              letterSpacing: '2.5px',
              color: '#00ff7f',
              fontWeight: '600',
            }}>
              END-TO-END SECURED
            </span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-orbitron), monospace',
            fontSize: 'clamp(32px, 5vw, 64px)',
            fontWeight: '800',
            lineHeight: '1.1',
            letterSpacing: '-0.5px',
            marginBottom: '20px',
          }}>
            <span style={{ color: '#f0fff4' }}>Security that</span>{' '}
            <span style={{
              background: 'linear-gradient(135deg, #00ff7f 0%, #00c45a 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>never sleeps</span>
          </h2>

          <p style={{
            maxWidth: '580px',
            margin: '0 auto',
            color: 'rgba(240,255,244,0.6)',
            fontSize: '17px',
            lineHeight: '1.7',
            fontFamily: 'var(--font-space-grotesk), sans-serif',
          }}>
            From perimeter defense to endpoint protection, we cover every attack surface with layered, adaptive security controls.
          </p>
        </div>

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
        }}>
          {securityFeatures.map((feature, i) => (
            <div
              key={feature.title}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="liquid-glass"
              style={{
                borderRadius: '12px',
                padding: '32px',
                cursor: 'default',
                transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = 'rgba(0,255,127,0.3)';
                e.currentTarget.style.boxShadow = '0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,255,127,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(0,255,127,0.2)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Tag */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{
                  background: i === 4 ? 'rgba(255,45,85,0.1)' : 'rgba(0,255,127,0.07)',
                  border: `1px solid ${i === 4 ? 'rgba(255,45,85,0.2)' : 'rgba(0,255,127,0.15)'}`,
                  borderRadius: '4px',
                  padding: '3px 10px',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-orbitron), monospace',
                    fontSize: '9px',
                    letterSpacing: '1.5px',
                    color: i === 4 ? '#ff2d55' : '#00ff7f',
                    fontWeight: '600',
                  }}>
                    {feature.tag}
                  </span>
                </div>
                {feature.icon}
              </div>

              <h3 style={{
                fontFamily: 'var(--font-orbitron), monospace',
                fontSize: '16px',
                fontWeight: '700',
                letterSpacing: '0.5px',
                color: '#f0fff4',
                marginBottom: '12px',
              }}>
                {feature.title}
              </h3>

              <p style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontSize: '14px',
                lineHeight: '1.7',
                color: 'rgba(240,255,244,0.6)',
              }}>
                {feature.desc}
              </p>

              {/* Bottom border accent */}
              <div style={{
                marginTop: '24px',
                height: '1px',
                background: i === 4
                  ? 'linear-gradient(90deg, rgba(255,45,85,0.3), transparent)'
                  : 'linear-gradient(90deg, rgba(0,255,127,0.3), transparent)',
              }} />
            </div>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}
