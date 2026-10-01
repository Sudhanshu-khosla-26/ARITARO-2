"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const SECTIONS = [
  { 
    num: '01',
    id: 'collection', 
    t: 'Information We Collect', 
    c: 'We collect personal and technical information necessary to respond to your inquiries, schedule discovery consultations, and deliver authorized cybersecurity engagements. This includes: (a) Contact Information: Full name, business email address, personal email, and Phone Number provided via contact forms, scoping requests, or direct communications; (b) Message & Inquiry Content: Project details, architectural descriptions, scoping requirements, problem statements, and questions submitted via our contact, assessment, and WhatsApp channels; (c) Account & Credentials: User name, email, encrypted password hash, and company name when accessing our client portal; (d) Technical Engagement Data: Authorized target host IP addresses, CIDR blocks, API documentation, domain names, and cryptographic keys necessary to execute penetration tests; (e) Recruitment Data: Resumes, portfolios, contact phone numbers, and career history for job applicants. We do not sell, rent, or monetize personal data or telemetry.' 
  },
  { 
    num: '02',
    id: 'usage', 
    t: 'How We Use Your Data & Messages', 
    c: 'We utilize collected phone numbers, email addresses, and message contents to: (a) Directly communicate with you regarding your inquiry, quote request, or security concerns; (b) Verify organizational authorization before initiating intrusive security assessments; (c) Coordinate findings debriefs, executive presentations, and re-testing schedules; (d) Deliver critical security alerts and incident notifications; (e) Comply with legal obligations under applicable cybersecurity and data protection legislation.' 
  },
  { 
    num: '03',
    id: 'security', 
    t: 'Enterprise Data Protection & Encryption', 
    c: 'As an elite cybersecurity firm, we hold ourselves to rigorous defense-in-depth standards. All web traffic, form transmissions, and telemetry are secured via TLS 1.3 encryption in transit. Data at rest (including contact inquiries, reports, and database records) is protected with AES-256 encryption. Access to customer contact details and assessment artifacts is restricted via Zero-Trust least-privilege role-based access control (RBAC).' 
  },
  { 
    num: '04',
    id: 'retention', 
    t: 'Data Retention & Sanitization Schedule', 
    c: 'We practice strict data minimization and enforce automated lifecycle retention periods: (a) Contact Inquiries & Leads (Name, Phone, Email, Message): Retained for up to 2 years from last contact for active business relationship management, after which they are permanently deleted; (b) Assessment Raw Telemetry & Proof-of-Concept Exploits: Securely wiped within 30 days of the final re-test verification window; (c) Final Executive Audit Reports: Retained for 3 years to support client compliance and warranty audits, accessible only to designated client admins; (d) Career Applications: Purged after 12 months unless applicant consents to future pool consideration.' 
  },
  { 
    num: '05',
    id: 'disclosure', 
    t: 'Subprocessors, Vendors & Third Parties', 
    c: 'Aritaro does not outsource penetration testing executions to unvetted third parties. We utilize vetted, contractually bound cloud infrastructure and service vendors (including AWS, Vercel, MongoDB Atlas, and transactional email providers) operating under signed Data Processing Agreements (DPAs) with strict confidentiality and security clauses. We never disclose findings or client records to regulatory bodies or external parties without explicit, written customer directive, except where strictly mandated by statutory cyber law (such as CERT-In incident reporting frameworks).' 
  },
  { 
    num: '06',
    id: 'rights', 
    t: 'Your Rights (DPDPA 2023 & Global Standards)', 
    c: 'Under India’s Digital Personal Data Protection Act (DPDPA 2023), GDPR, and applicable privacy regulations, you possess full rights to: (a) Access: Request a copy of all personal data (including phone, email, and messages) we hold about you; (b) Correction: Request updates to inaccurate or incomplete contact records; (c) Erasure ("Right to be Forgotten"): Request permanent deletion of your phone number, messages, and contact records from our active databases; (d) Grievance Redressal: Lodge an inquiry with our designated Data Protection Officer. All requests are processed within 15 business days free of charge.' 
  },
  { 
    num: '07',
    id: 'cookies', 
    t: 'Cookies, Sessions & Browser Protections', 
    c: 'Our platform uses strictly necessary HttpOnly, Secure, and SameSite session tokens to authenticate clients and protect against cross-site scripting (XSS) and cross-site request forgery (CSRF). We do not deploy third-party advertising tracking pixels or commercial marketing trackers.' 
  },
  { 
    num: '08',
    id: 'contact', 
    t: 'Privacy Office & Grievance Officer', 
    c: 'For data privacy queries, data subject access requests (DSAR), or compliance verification, contact our Data Protection and Grievance Officer directly at privacy@aritaro.com or via postal correspondence to Aritaro Private Limited, Corporate Security & Legal Compliance Division.' 
  },
];

export default function PrivacyClient() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);

  // ScrollSpy using window scroll listener with high accuracy
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
      <div style={{ position: 'fixed', top: '15%', left: '5%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '120px 24px 100px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 54 }}>
          <div className="section-label" style={{ display: 'inline-flex', marginBottom: 14 }}>
            DATA GOVERNANCE
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px', marginBottom: 12, lineHeight: 1.15 }}>
            Privacy <span style={{ background: 'linear-gradient(135deg, #06B6D4, #3B82F6)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Policy</span>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto' }}>
            Effective Date: 2026 • Enterprise confidentiality standards and DPDPA 2023 compliance
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
                      background: isActive ? 'rgba(6,182,212,0.12)' : 'transparent',
                      borderLeft: isActive ? '3px solid #06B6D4' : '3px solid transparent',
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
                      color: isActive ? '#06B6D4' : 'rgba(255,255,255,0.3)',
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
                Contact Privacy Officer
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
                    border: isActive ? '1px solid rgba(6,182,212,0.35)' : '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 16,
                    padding: '28px 32px',
                    backdropFilter: 'blur(10px)',
                    transition: 'border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease',
                    boxShadow: isActive ? '0 10px 30px rgba(6,182,212,0.06)' : 'none',
                    scrollMarginTop: '100px',
                  }}
                  onMouseEnter={(e) => { 
                    if (!isActive) e.currentTarget.style.borderColor = 'rgba(6,182,212,0.2)'; 
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
                        background: 'rgba(6, 182, 212, 0.12)', 
                        color: '#06B6D4', 
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
          background: rgba(6, 182, 212, 0.35);
        }
      `}</style>
    </div>
  );
}
