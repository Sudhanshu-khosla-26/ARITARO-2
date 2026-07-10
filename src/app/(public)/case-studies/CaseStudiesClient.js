'use client';

import Link from 'next/link';
import Image from 'next/image';

import WhatsAppWidget from '@/components/WhatsAppWidget';

const CASES = [
  {
    industry: 'FinTech',
    type: 'API Penetration Testing',
    challenge: 'A Series-B funded Indian FinTech with 2M+ users needed to validate API security ahead of RBI compliance audit.',
    findings: [
      '4 Critical IDOR vulnerabilities exposing user financial data',
      '2 High severity auth bypass via JWT confusion',
      'Broken rate limiting allowing account enumeration',
    ],
    impact: 'All critical findings remediated within 5 business days. Successfully passed RBI compliance audit.',
    stats: { vulns: '14', critical: '4', remediation: '5 days' },
    color: '#3B82F6',
  },
  {
    industry: 'HealthTech',
    type: 'Web App + Cloud Security',
    challenge: 'A healthcare platform processing sensitive patient data needed HIPAA-aligned security testing before US market launch.',
    findings: [
      'Stored XSS in patient messaging module',
      'S3 buckets with PHI accessible via object enumeration',
      'Over-privileged IAM roles with admin-level access',
    ],
    impact: 'Successfully secured the platform for US launch. 0 security incidents reported post-remediation.',
    stats: { vulns: '22', critical: '6', remediation: '8 days' },
    color: '#6366F1',
  },
  {
    industry: 'E-Commerce',
    type: 'Web Application PT',
    challenge: 'A rapidly growing e-commerce platform with ₹50Cr+ GMV needed pen testing after observing suspicious API behaviour.',
    findings: [
      'Price manipulation via cart API — discounts applied without valid coupon codes',
      'Mass assignment allowing users to modify order status',
      'Admin panel accessible via URL enumeration',
    ],
    impact: 'Prevented potential ₹2Cr+ in fraudulent transactions. Admin panel hardened with MFA.',
    stats: { vulns: '18', critical: '3', remediation: '7 days' },
    color: '#818CF8',
  },
  {
    industry: 'SaaS / AI',
    type: 'AI Penetration Testing',
    challenge: 'An AI SaaS startup deploying an LLM-powered customer support agent needed to verify guardrails before enterprise rollout.',
    findings: [
      'System prompt extraction via multi-turn role-play attack',
      'RAG poisoning allowing injection of malicious knowledge base entries',
      'Excessive tool permissions enabling data exfiltration via function calling',
    ],
    impact: 'Guardrails strengthened, tool permissions scoped. Successfully onboarded 3 enterprise clients post-assessment.',
    stats: { vulns: '9', critical: '5', remediation: '10 days' },
    color: '#A855F7',
  },
];

export default function CaseStudiesClient() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>


      {/* Hero */}
      <section style={{ padding: '80px 24px 40px', textAlign: 'center' }}>
        <div className="section-label" style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: 20 }}>REAL RESULTS</div>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16, lineHeight: 1.1 }}>Case Studies</h1>
        <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: 560, margin: '0 auto' }}>
          Anonymised real-world results from our penetration testing engagements. See the types of vulnerabilities we find — and the business impact of fixing them.
        </p>
      </section>

      {/* Cases */}
      <section style={{ padding: '20px 24px 64px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {CASES.map((c, i) => (
            <div key={i} style={{
              padding: '32px', background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)', borderRadius: 18,
              transition: 'all 0.2s ease',
              borderLeft: `4px solid ${c.color}`,
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${c.color}60`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.borderLeftColor = c.color; }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 9999, background: `${c.color}12`, color: c.color, border: `1px solid ${c.color}25` }}>
                  {c.industry}
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>{c.type}</span>
              </div>

              {/* Challenge */}
              <p style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.65, marginBottom: 16, fontWeight: 500 }}>
                {c.challenge}
              </p>

              {/* Key Findings */}
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>Key Findings</h3>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {c.findings.map((f, j) => (
                    <li key={j} style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: 8, lineHeight: 1.5 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 3 }}><circle cx="12" cy="12" r="1" fill={c.color} /><path d="M12 2L12 6M12 18L12 22M2 12L6 12M18 12L22 12" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Impact */}
              <div style={{ padding: '14px 18px', background: `${c.color}06`, border: `1px solid ${c.color}15`, borderRadius: 10, marginBottom: 16 }}>
                <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: c.color, marginBottom: 6 }}>Business Impact</h3>
                <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>{c.impact}</p>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {Object.entries(c.stats).map(([key, val]) => (
                  <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: c.color, fontFamily: 'var(--font-mono)' }}>{val}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{key}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '64px 24px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>Want results like these?</h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 28 }}>Book a free 30-minute scoping call. No sales pressure.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/#contact" className="btn-primary" style={{ fontSize: 14, padding: '14px 28px', textDecoration: 'none' }}>Book Free Assessment</Link>
            <Link href="/" className="btn-ghost" style={{ fontSize: 14, padding: '14px 28px', textDecoration: 'none' }}>← Back to Home</Link>
          </div>
        </div>
      </section>


      <WhatsAppWidget />
    </div>
  );
}
