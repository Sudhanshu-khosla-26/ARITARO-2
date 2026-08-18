"use client";

import Link from 'next/link';

const SECTIONS = [
  { id: 'collection', t: '1. Information We Collect', c: 'We strictly collect information necessary to scope and deliver authorized penetration testing engagements. This includes technical points of contact, authorized corporate domains, target host IP addresses, and encrypted communication keys. We do not sell or monetize client telemetry.' },
  { id: 'usage', t: '2. How We Use Assessment Data', c: 'Client information is solely utilized to execute agreed Statement of Work (SoW) deliverables, coordinate secure findings debriefs, and provide post-remediation verification.' },
  { id: 'security', t: '3. Enterprise Data Protection & Encryption', c: 'As a security organization, we enforce zero-trust policies: all vulnerability artifacts and reports are protected via AES-256 encryption at rest and TLS 1.3 in transit. Access is limited on a strict need-to-know basis.' },
  { id: 'retention', t: '4. Data Sanitization & Retention', c: 'Assessment raw telemetry and proof-of-concept exploits are securely purged 30 days following the conclusion of the final re-test verification window, unless requested earlier in writing by the client.' },
  { id: 'disclosure', t: '5. Third-Party Disclosures & Subcontractors', c: 'Aritaro does not outsource pentest executions to unvetted third parties. We never share findings with regulatory bodies or external parties without explicit, written customer directive.' },
  { id: 'rights', t: '6. Client Rights & Data Portability', c: 'Corporate clients have the right to request comprehensive data audits, immediate file purge confirmation, or encrypted copies of all communication records by contacting our Data Protection Officer.' },
  { id: 'cookies', t: '7. Cookies & Tracking Technologies', c: 'Our digital platform utilizes only strictly essential session tokens for authenticated client portal access. We do not employ third-party tracking or behavioral advertising pixels.' },
  { id: 'contact', t: '8. Privacy Office & Inquiries', c: 'For data privacy queries or specific compliance inquiries (GDPR, HIPAA, DPDPA), reach our Data Protection team directly at privacy@aritaro.com.' },
];

export default function PrivacyClient() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', position: 'relative', overflow: 'hidden' }}>
      <div className="cyber-grid" style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '120px 24px 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-label" style={{ display: 'inline-flex', marginBottom: 16 }}>DATA GOVERNANCE</div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-1px', marginBottom: 12, lineHeight: 1.1 }}>
            Privacy <span style={{ background: 'linear-gradient(135deg, #06B6D4, #3B82F6)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Policy</span>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Effective Date: 2026 • Rigorous data confidentiality standards for security engagements
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 36, alignItems: 'start' }} className="legal-layout">
          {/* Quick Nav Sidebar */}
          <aside style={{ position: 'sticky', top: 100, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 14, padding: 20, backdropFilter: 'blur(12px)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 14 }}>
              Table of Contents
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  style={{ fontSize: 12.5, color: 'var(--text-muted)', textDecoration: 'none', padding: '6px 8px', borderRadius: 6, transition: 'all 0.2s ease', display: 'block', lineHeight: 1.4 }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(6,182,212,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  {s.t}
                </a>
              ))}
            </nav>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
              <Link href="/contact" className="btn-primary" style={{ display: 'block', textAlign: 'center', fontSize: 12, padding: '8px 12px', textDecoration: 'none', borderRadius: 6 }}>
                Contact Privacy Officer
              </Link>
            </div>
          </aside>

          {/* Main Legal Content */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {SECTIONS.map((s) => (
              <div
                key={s.id}
                id={s.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.45)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 14,
                  padding: '24px 28px',
                  backdropFilter: 'blur(8px)',
                  transition: 'border-color 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
              >
                <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#06B6D4' }} />
                  {s.t}
                </h2>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.75, margin: 0 }}>
                  {s.c}
                </p>
              </div>
            ))}
          </section>
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .legal-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
