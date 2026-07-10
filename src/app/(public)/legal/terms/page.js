import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Aritaro Cybersecurity Services',
  description: 'Aritaro Terms of Service — the terms and conditions governing the use of our services.',
};

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>

      <article style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px 80px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Terms of Service</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 32 }}>Last updated: June 2025</p>
        {[
          { t: '1. Engagement Scope', c: 'All penetration testing and security assessment engagements are conducted under a signed Statement of Work (SoW) and Rules of Engagement (RoE). Testing is limited strictly to the systems, applications, and networks defined in the SoW.' },
          { t: '2. Authorization', c: 'By engaging Aritaro, you confirm that you have legal authority to authorize security testing of the specified systems. Aritaro will not test any systems without explicit written authorization.' },
          { t: '3. Confidentiality', c: 'All engagement data, findings, and reports are treated as strictly confidential. Aritaro signs NDAs as standard practice. Reports are encrypted and transmitted via secure channels.' },
          { t: '4. Liability', c: 'While Aritaro uses non-destructive testing techniques, security testing inherently carries risk. Aritaro liability is limited to the total engagement fee. We recommend testing in staging environments where possible.' },
          { t: '5. Deliverables', c: 'Standard deliverables include an Executive Summary, Full Technical Report with CVSS scoring, Remediation Tracker, and Developer Fix Guide. One free re-test for critical and high severity findings is included.' },
          { t: '6. Payment Terms', c: '50% advance payment is required before engagement starts. Remaining 50% is due upon delivery of the final report. Payment terms are net-15 days.' },
          { t: '7. Intellectual Property', c: 'All proprietary testing tools, methodologies, and frameworks remain the intellectual property of Aritaro. The client owns all deliverables and reports produced for their engagement.' },
          { t: '8. Governing Law', c: 'These terms are governed by the laws of India. Any disputes shall be resolved through arbitration in accordance with the Arbitration and Conciliation Act, 1996.' },
        ].map((s, i) => (
          <div key={i} style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{s.t}</h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75 }}>{s.c}</p>
          </div>
        ))}
      </article>
    </div>
  );
}
