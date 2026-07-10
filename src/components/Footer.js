'use client';

import Image from 'next/image';

const footerLinks = {
  Services: [
    { label: 'API Pen Testing', href: '/services/api-pt' },
    { label: 'Web App PT', href: '/services/wap-pt' },
    { label: 'Cloud Security', href: '/services/cloud' },
    { label: 'AI Pen Testing', href: '/services/ai-pt' },
    { label: 'All Services', href: '/services' },
    { label: 'Free Audit', href: '/free-audit' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/#contact' },
  ],
  Resources: [
    { label: 'Free Security Audit', href: '/free-audit' },
    { label: 'Case Studies', href: '/case-studies' },
    { label: 'Blog', href: '/blog' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/legal/privacy' },
    { label: 'Terms of Service', href: '/legal/terms' },
    { label: 'Responsible Disclosure', href: '/legal/disclosure' },
  ],
};

export default function Footer() {
  return (
    <footer
      id="footer"
      style={{
        position: 'relative',
        background: 'var(--footer-bg)',
        borderTop: '1px solid var(--border-subtle)',
        overflow: 'hidden',
      }}
    >

      {/* CTA Banner */}
      <div style={{
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '64px 32px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(22px, 4vw, 40px)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 14,
            lineHeight: 1.2,
          }}>
            Ready to{' '}
            <span style={{ color: 'var(--accent)' }}>secure</span>{' '}
            your organization?
          </h2>
          <p style={{
            fontSize: 16,
            color: 'var(--text-muted)',
            marginBottom: 32,
            lineHeight: 1.7,
          }}>
            Book a free 30-minute security assessment with our elite team.
            No sales pressure — just expertise.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => { const el = document.querySelector('#contact'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}>
              Schedule Free Assessment
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button className="btn-ghost" onClick={() => { const el = document.querySelector('#contact'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}>
              Talk to an Expert
            </button>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '56px 32px 36px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '260px repeat(4, 1fr)',
            gap: '40px',
            marginBottom: 48,
          }}
          className="footer-grid"
        >
          {/* Brand — matches Navbar exactly */}
          <div>
            {/* Logo row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, position: 'relative', flexShrink: 0 }}>
                <Image
                  src="/aritaro-logo.png"
                  alt="Aritaro"
                  fill
                  sizes="36px"
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <span style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: '0.05em',
                color: 'var(--text-primary)',
              }}>
                ARITARO
              </span>
            </div>

            <p style={{
              fontSize: 14,
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              marginBottom: 20,
            }}>
              Elite cybersecurity for enterprises that can&apos;t afford to fail.
              Defending digital assets since 2014.
            </p>

            {/* Cert badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['ISO 27001', 'SOC 2', 'GDPR', 'HIPAA'].map((cert) => (
                <span key={cert} style={{
                  fontSize: 11,
                  padding: '3px 10px',
                  background: 'rgba(59,130,246,0.07)',
                  border: '1px solid rgba(59,130,246,0.15)',
                  borderRadius: 9999,
                  color: 'var(--accent)',
                  fontWeight: 500,
                }}>
                  {cert}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                marginBottom: 18,
              }}>
                {section}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      style={{
                        fontSize: 14,
                        color: 'var(--text-muted)',
                        textDecoration: 'none',
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: 24,
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            © 2025 Aritaro Pvt Limited. All rights reserved.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              width: 6, height: 6,
              borderRadius: '50%',
              background: 'var(--c-green)',
              boxShadow: '0 0 8px var(--c-green)',
              animation: 'pulse-glow 2s ease-in-out infinite',
            }} />
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              All systems operational
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
