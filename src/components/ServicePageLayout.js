'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

import WhatsAppWidget from '@/components/WhatsAppWidget';

export default function ServicePageLayout({
  title,
  subtitle,
  tagline,
  accentColor = '#3B82F6',
  methodology,
  standards,
  deliverables,
  timeline,
  pricing,
  engagementTypes,
  whyItMatters,
  faqs,
  children,
}) {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Hero */}
      <section style={{
        position: 'relative', padding: '60px 24px 48px', textAlign: 'center', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${accentColor}10 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <div className="cyber-grid" style={{ position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: `${accentColor}12`, border: `1px solid ${accentColor}30`,
            borderRadius: 100, padding: '6px 20px', marginBottom: 22,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: accentColor, boxShadow: `0 0 8px ${accentColor}80`, animation: 'pulse-glow 2s ease-in-out infinite' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '2.5px', color: accentColor, fontWeight: 600 }}>{tagline}</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, lineHeight: 1.15, color: 'var(--text-primary)', marginBottom: 16, letterSpacing: '-1px' }}>
            {title}
          </h1>
          <p style={{ maxWidth: 580, margin: '0 auto 28px', color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7 }}>
            {subtitle}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/request-assessment" className="btn-primary" style={{ fontSize: 14, padding: '13px 28px', textDecoration: 'none' }}>
              Request Assessment
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/dashboard/services" className="btn-ghost" style={{ fontSize: 14, padding: '13px 28px', textDecoration: 'none' }}>
              Browse Services
            </Link>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      {whyItMatters && (
        <section style={{ padding: '48px 24px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24, textAlign: 'center' }}>
              Why This Matters
            </h2>
            <div className="why-matters-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {whyItMatters.map((item, i) => (
                <div key={i} style={{
                  padding: '24px 20px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 16, textAlign: 'center', transition: 'all 0.3s ease', backdropFilter: 'blur(12px)',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = `rgba(255, 255, 255, 0.2)`; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: accentColor, marginBottom: 8, fontFamily: 'var(--font-mono)' }}>{item.stat}</div>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Methodology Table */}
      {methodology && (
        <section style={{ padding: '48px 24px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, textAlign: 'center' }}>
              Our Methodology
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 15, marginBottom: 36, maxWidth: 600, margin: '0 auto 36px' }}>
              A structured, repeatable approach that delivers consistent results
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {methodology.map((phase, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '60px 1fr', gap: 20,
                  padding: '24px', background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 16,
                  transition: 'all 0.3s ease', alignItems: 'start', backdropFilter: 'blur(12px)',
                }}
                  className="methodology-row"
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${accentColor}40`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: `${accentColor}10`, border: `1px solid ${accentColor}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: accentColor,
                  }}>
                    {i + 1}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{phase.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 10 }}>{phase.focus}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {phase.activities.map((a, j) => (
                        <span key={j} style={{
                          fontSize: 10, fontWeight: 500, padding: '3px 10px', borderRadius: 9999,
                          background: `${accentColor}08`, border: `1px solid ${accentColor}18`, color: accentColor,
                        }}>{a}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick Info Cards: Standards, Deliverables, Timeline, Pricing */}
      <section style={{ padding: '48px 24px', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div className="info-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {/* Standards */}
            <div style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 16, backdropFilter: 'blur(12px)' }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Standards & Frameworks</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {standards.map((s, i) => (
                  <span key={i} style={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 9999, background: `${accentColor}08`, border: `1px solid ${accentColor}18`, color: accentColor }}>{s}</span>
                ))}
              </div>
            </div>
            {/* Deliverables */}
            <div style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 16, backdropFilter: 'blur(12px)' }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Deliverables</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {deliverables.map((d, i) => (
                  <li key={i} style={{ fontSize: 13, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--c-green)" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
            {/* Timeline */}
            <div style={{ padding: '24px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 16, backdropFilter: 'blur(12px)' }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Timeline</h3>
              <div style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: accentColor, fontFamily: 'var(--font-mono)' }}>{timeline}</div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>From scoping call to final report</p>
            </div>
            {/* Pricing */}
            {/* <div style={{ padding: '24px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 14 }}>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Indicative Pricing</h3>
              <div style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: accentColor, fontFamily: 'var(--font-mono)' }}>{pricing}</div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Custom scoped quote available</p>
            </div> */}
          </div>
        </div>
      </section>

      {/* Engagement Types */}
      {engagementTypes && (
        <section style={{ padding: '48px 24px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 32 }}>Engagement Types</h2>
            <div className="engagement-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${engagementTypes.length}, 1fr)`, gap: 16 }}>
              {engagementTypes.map((type, i) => (
                <div key={i} style={{
                  padding: '28px 20px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                  borderRadius: 14, textAlign: 'center', transition: 'all 0.2s ease',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${accentColor}40`; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{type.name}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{type.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs (R15) */}
      {faqs && faqs.length > 0 && (
        <section style={{ padding: '48px 24px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 32, textAlign: 'center' }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{
                  background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                  borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.2s',
                  borderColor: openFaq === i ? `${accentColor}40` : 'var(--border-subtle)',
                }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: '100%', padding: '18px 20px', background: 'none', border: 'none',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'left',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    {faq.q}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round"
                      style={{ transition: 'transform 0.2s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)' }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <div style={{
                    maxHeight: openFaq === i ? 300 : 0, overflow: 'hidden',
                    transition: 'max-height 0.3s ease',
                  }}>
                    <p style={{ padding: '0 20px 18px', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Additional content */}
      {children}

      {/* CTA Banner */}
      <section style={{ padding: '48px 24px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>
            Ready to secure your systems?
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 28 }}>
            Get a comprehensive assessment scope details from our cybersecurity team.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/request-assessment" className="btn-primary" style={{ fontSize: 14, padding: '14px 28px', textDecoration: 'none' }}>
              Request Assessment
            </Link>
            <Link href="/services" className="btn-ghost" style={{ fontSize: 14, padding: '14px 28px', textDecoration: 'none' }}>
              View All Services
            </Link>
          </div>
        </div>
      </section>




      <WhatsAppWidget />

      <style>{`
        @media (max-width: 700px) {
          .why-matters-grid, .info-cards-grid { grid-template-columns: 1fr !important; }
          .engagement-grid { grid-template-columns: 1fr !important; }
          .methodology-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
