"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const SECTIONS = [
  { num: '01', id: 'scope', t: 'Engagement Scope & Authorization', c: 'All penetration testing and security assessment engagements are conducted strictly under a signed Statement of Work (SoW) and Rules of Engagement (RoE). Testing is limited to the systems, applications, and networks explicitly defined in the project scope.' },
  { num: '02', id: 'authorization', t: 'Legal Authority & Permissions', c: 'By engaging Aritaro, the client warrants that they own or have the explicit legal authorization to permit security testing on the target infrastructure. We never engage in testing without verified written consent.' },
  { num: '03', id: 'confidentiality', t: 'Confidentiality & Non-Disclosure', c: 'All vulnerabilities, network architectures, customer details, and final audit deliverables are treated as strictly confidential. Mutual NDAs are executed prior to scoping.' },
  { num: '04', id: 'liability', t: 'Non-Destructive Testing & Liability', c: 'Aritaro employs industry-standard non-destructive testing methodologies. In no event shall Aritaro\'s aggregate liability exceed the total fee paid for the specific engagement.' },
  { num: '05', id: 'deliverables', t: 'Deliverables & Retest Policy', c: 'Standard deliverables include a board-ready Executive Summary, CVSS 3.1 Technical Findings Report, and developer remediation checklists. A complimentary retest for critical and high findings is included.' },
  { num: '06', id: 'payment', t: 'Payment Terms & Milestones', c: 'Standard terms require a 50% milestone advance upon initiation and 50% upon delivery of the formal report, payable within Net-15 days unless customized in the SoW.' },
  { num: '07', id: 'ip', t: 'Intellectual Property Rights', c: 'Proprietary testing scripts, methodologies, and internal research tools remain the property of Aritaro. The client retains full ownership of the custom vulnerability report and audit deliverables.' },
  { num: '08', id: 'jurisdiction', t: 'Governing Law & Dispute Resolution', c: 'These terms are governed by the laws of India. Any disputes arising out of engagements shall be subject to arbitration under the Arbitration and Conciliation Act, 1996 in New Delhi, India.' },
];

export default function TermsClient() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);

  // ScrollSpy listening to window scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el) {
          if (el.offsetTop <= scrollPos) {
            setActiveId(SECTIONS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    setActiveId(id);
    const target = document.getElementById(id);
    if (target) {
      if (window.lenis) {
        window.lenis.scrollTo(target, { offset: -100, duration: 1.0 });
      } else {
        const y = target.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', position: 'relative' }}>
      {/* Ambient background accents */}
      <div className="cyber-grid" style={{ position: 'fixed', inset: 0, opacity: 0.12, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', top: '15%', right: '5%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '120px 24px 100px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 54 }}>
          <div className="section-label" style={{ display: 'inline-flex', marginBottom: 14 }}>
            LEGAL COMPLIANCE
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', marginBottom: 12, lineHeight: 1.15 }}>
            Terms of <span style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Service</span>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto' }}>
            Effective Date: Updated for 2026 • Governing all client security engagements and testing scopes
          </p>
        </div>

        {/* 2-Column Grid: Sticky Left TOC + Clean Right Content */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '290px 1fr', 
            gap: 40, 
            alignItems: 'start',
          }} 
          className="legal-split-layout"
        >
          {/* Left Table of Contents — Sticky to Top */}
          <aside 
            style={{ 
              position: 'sticky', 
              top: '100px', 
              maxHeight: 'calc(100vh - 130px)', 
              overflowY: 'auto',
              background: 'rgba(11, 17, 29, 0.85)', 
              border: '1px solid rgba(255, 255, 255, 0.08)', 
              borderRadius: 16, 
              padding: '20px 14px', 
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 12px 36px rgba(0,0,0,0.4)',
              display: 'flex',
              flexDirection: 'column',
            }}
            className="custom-scrollbar legal-sidebar"
          >
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 14, paddingLeft: 10 }}>
              Table of Contents
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {SECTIONS.map((s) => {
                const isActive = activeId === s.id;
                return (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={(e) => handleScrollTo(e, s.id)}
                    style={{ 
                      fontSize: 12.5, 
                      color: isActive ? '#ffffff' : 'var(--text-muted)', 
                      textDecoration: 'none', 
                      padding: '8px 10px', 
                      borderRadius: 8, 
                      transition: 'all 0.2s ease', 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 8,
                      lineHeight: 1.4,
                      background: isActive ? 'rgba(59,130,246,0.12)' : 'transparent',
                      borderLeft: isActive ? '3px solid #3B82F6' : '3px solid transparent',
                      fontWeight: isActive ? 600 : 400,
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => { 
                      if (!isActive) {
                        e.currentTarget.style.color = '#fff'; 
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; 
                      }
                    }}
                    onMouseLeave={(e) => { 
                      if (!isActive) {
                        e.currentTarget.style.color = 'var(--text-muted)'; 
                        e.currentTarget.style.background = 'transparent'; 
                      }
                    }}
                  >
                    <span style={{ 
                      fontSize: 10.5, 
                      fontWeight: 700, 
                      fontFamily: 'var(--font-mono)', 
                      color: isActive ? '#3B82F6' : 'rgba(255,255,255,0.3)',
                      minWidth: 18,
                    }}>
                      {s.num}
                    </span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.t}
                    </span>
                  </a>
                );
              })}
            </nav>

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <Link 
                href="/contact" 
                className="btn-primary" 
                style={{ 
                  display: 'block', 
                  textAlign: 'center', 
                  fontSize: 12, 
                  padding: '9px 12px', 
                  textDecoration: 'none', 
                  borderRadius: 8, 
                  fontWeight: 600,
                }}
              >
                Questions? Contact Legal
              </Link>
            </div>
          </aside>

          {/* Right Content Section */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {SECTIONS.map((s) => {
              const isActive = activeId === s.id;
              return (
                <div
                  key={s.id}
                  id={s.id}
                  style={{
                    background: isActive ? 'rgba(15, 23, 42, 0.6)' : 'rgba(15, 23, 42, 0.4)',
                    border: isActive ? '1px solid rgba(59,130,246,0.35)' : '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 16,
                    padding: '28px 32px',
                    backdropFilter: 'blur(10px)',
                    transition: 'border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease',
                    boxShadow: isActive ? '0 10px 30px rgba(59,130,246,0.06)' : 'none',
                    scrollMarginTop: '100px',
                  }}
                  onMouseEnter={(e) => { 
                    if (!isActive) e.currentTarget.style.borderColor = 'rgba(59,130,246,0.2)'; 
                  }}
                  onMouseLeave={(e) => { 
                    if (!isActive) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; 
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <span 
                      style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        width: 28, 
                        height: 28, 
                        borderRadius: 8, 
                        background: 'rgba(59, 130, 246, 0.12)', 
                        color: '#3B82F6', 
                        fontSize: 12, 
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        flexShrink: 0,
                      }}
                    >
                      {s.num}
                    </span>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      {s.t}
                    </h2>
                  </div>
                  <p style={{ fontSize: 14.5, color: 'var(--text-muted)', lineHeight: 1.8, margin: 0 }}>
                    {s.c}
                  </p>
                </div>
              );
            })}
          </section>
        </div>
      </main>

      <style>{`
        @media (max-width: 860px) {
          .legal-split-layout { grid-template-columns: 1fr !important; }
          .legal-sidebar { position: static !important; max-height: none !important; margin-bottom: 24px; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.35);
        }
      `}</style>
    </div>
  );
}
