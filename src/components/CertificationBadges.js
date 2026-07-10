'use client';

import { useEffect, useRef, useState } from 'react';

const BADGES = [
  { name: 'OSCP', full: 'Offensive Security Certified Professional' },
  { name: 'CEH', full: 'Certified Ethical Hacker' },
  { name: 'CISSP', full: 'Certified Information Systems Security Professional' },
  { name: 'ISO 27001', full: 'ISO/IEC 27001 Lead Implementer' },
  { name: 'CERT-In', full: 'CERT-In Empanelled Auditor' },
  { name: 'AWS Security', full: 'AWS Certified Security – Specialty' },
];

export default function CertificationBadges() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        marginTop: "32px",

      }}
    >
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}>


        <div
          className="cert-badges-row"
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {BADGES.map((badge, i) => (
            <div
              key={badge.name}
              title={badge.full}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 18px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(59,130,246,0.12)',
                borderRadius: 10,
                cursor: 'default',
                transition: 'all 0.3s ease',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(12px)',
                transitionDelay: `${i * 0.08}s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(59,130,246,0.1)';
                e.currentTarget.style.background = 'rgba(59,130,246,0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(59,130,246,0.12)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Shield icon */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--cta)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '0.02em',
              }}>
                {badge.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
