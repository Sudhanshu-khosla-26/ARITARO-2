import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Aritaro Cybersecurity Services',
  description: 'Aritaro Terms of Service — the terms and conditions governing the use of our services.',
};

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <article style={{ maxWidth: 860, margin: '0 auto', padding: '96px 24px 80px' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid var(--border-subtle)', borderRadius: 18, padding: '32px 24px', boxShadow: '0 20px 60px rgba(15, 23, 42, 0.25)' }}>
          <div className="section-label" style={{ display: 'inline-flex', marginBottom: 12 }}>Legal</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Terms of Service</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28 }}>Last updated: June 2025</p>
          {[
            { t: '1. Engagement Scope', c: 'All penetration testing and security assessment engagements are conducted under a signed Statement of Work (SoW) and Rules of Engagement (RoE). Testing is limited to the systems, applications, and networks explicitly agreed in the project scope.' },
            { t: '2. Authorization', c: 'By engaging Aritaro, you confirm that you have the legal authority to authorize testing of the specific systems. We do not test any systems without explicit written authorization.' },
            { t: '3. Confidentiality', c: 'All engagement data, findings, and reports are treated as strictly confidential. Aritaro signs NDAs as standard practice and uses secure communication channels for delivery.' },
            { t: '4. Liability', c: 'While Aritaro uses non-destructive testing techniques, security testing inherently carries risk. Our liability is limited to the total fee paid for the engagement, and testing should ideally be conducted in a staging environment where possible.' },
            { t: '5. Deliverables', c: 'Standard deliverables include an executive summary, technical report with findings and risk ratings, remediation guidance, and a review checklist or retest support. The exact scope is defined in the signed engagement agreement.' },
            { t: '6. Payment Terms', c: '50% advance payment is required before engagement starts. The remaining amount is due upon delivery of the final report. Payment terms are net-15 days unless otherwise agreed in writing.' },
            { t: '7. Intellectual Property', c: 'Our proprietary methods, frameworks, and tooling remain our intellectual property. The client owns the deliverables produced specifically for the engagement and retains rights to those materials.' },
            { t: '8. Governing Law', c: 'These terms are governed by the laws of India. Any disputes shall be resolved under the Arbitration and Conciliation Act, 1996.' },
          ].map((s, i) => (
            <div key={i} style={{ marginBottom: 28, paddingBottom: i < 7 ? 20 : 0, borderBottom: i < 7 ? '1px solid var(--border-subtle)' : 'none' }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{s.t}</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.75, margin: 0 }}>{s.c}</p>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
