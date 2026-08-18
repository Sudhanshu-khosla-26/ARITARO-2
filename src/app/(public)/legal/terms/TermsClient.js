"use client";

import Link from 'next/link';

const SECTIONS = [
  { id: 'scope', t: '1. Engagement Scope & Authorization', c: 'All penetration testing and security assessment engagements are conducted strictly under a signed Statement of Work (SoW) and Rules of Engagement (RoE). Testing is limited to the systems, applications, and networks explicitly defined in the project scope.' },
  { id: 'authorization', t: '2. Legal Authority', c: 'By engaging Aritaro, the client warrants that they own or have the explicit legal authorization to permit security testing on the target infrastructure. We never engage in testing without verified written consent.' },
  { id: 'confidentiality', t: '3. Confidentiality & Non-Disclosure', c: 'All vulnerabilities, network architectures, customer details, and final audit deliverables are treated as strictly confidential. Mutual NDAs are executed prior to scoping.' },
  { id: 'liability', t: '4. Non-Destructive Testing & Liability', c: 'Aritaro employs industry-standard non-destructive testing methodologies. In no event shall Aritaro\'s aggregate liability exceed the total fee paid for the specific engagement.' },
  { id: 'deliverables', t: '5. Deliverables & Retest Policy', c: 'Standard deliverables include a board-ready Executive Summary, CVSS 3.1 Technical Findings Report, and developer remediation checklists. A complimentary retest for critical and high findings is included.' },
  { id: 'payment', t: '6. Payment Terms & Milestones', c: 'Standard terms require a 50% milestone advance upon initiation and 50% upon delivery of the formal report, payable within Net-15 days unless customized in the SoW.' },
  { id: 'ip', t: '7. Intellectual Property Rights', c: 'Proprietary testing scripts, methodologies, and internal research tools remain the property of Aritaro. The client retains full ownership of the custom vulnerability report and audit deliverables.' },
  { id: 'jurisdiction', t: '8. Governing Law & Dispute Resolution', c: 'These terms are governed by the laws of India. Any disputes arising out of engagements shall be subject to arbitration under the Arbitration and Conciliation Act, 1996 in New Delhi, India.' },
];

export default function TermsClient() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', position: 'relative', overflow: 'hidden' }}>
      <div className="cyber-grid" style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '10%', right: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '120px 24px 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-label" style={{ display: 'inline-flex', marginBottom: 16 }}>LEGAL COMPLIANCE</div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-1px', marginBottom: 12, lineHeight: 1.1 }}>
            Terms of <span style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Service</span>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            Effective Date: Updated for 2026 • Governing all client security engagements
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
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(59,130,246,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  {s.t}
                </a>
              ))}
            </nav>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
              <Link href="/contact" className="btn-primary" style={{ display: 'block', textAlign: 'center', fontSize: 12, padding: '8px 12px', textDecoration: 'none', borderRadius: 6 }}>
                Questions? Contact Legal
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
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
              >
                <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
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
