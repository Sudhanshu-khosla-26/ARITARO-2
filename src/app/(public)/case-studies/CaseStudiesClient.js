'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import { listCaseStudies } from '@/actions/admin.actions';

const CASES = [
  {
    industry: 'FinTech',
    type: 'API Penetration Testing',
    challenge: 'A Series-B funded Indian FinTech with 2M+ active users required exhaustive API vulnerability testing ahead of mandatory RBI regulatory compliance.',
    findings: [
      '4 Critical IDOR (BOLA) flaws exposing confidential customer bank statements',
      '2 High severity auth bypass via JWT algorithm confusion',
      'Unrestricted endpoint rate limits enabling automated account credential enumeration',
    ],
    impact: 'All critical vulnerabilities remediated in 5 days. Zero data leakage, successfully cleared RBI compliance audit.',
    stats: { vulns: '14', critical: '4', remediation: '5 Days', roi: '100% Passed' },
    color: '#3B82F6',
  },
  {
    industry: 'HealthTech',
    type: 'Web App + Cloud Security',
    challenge: 'A global telemedicine platform managing 500K+ patient electronic health records (EHR) required HIPAA-aligned security validation before US expansion.',
    findings: [
      'Stored XSS vulnerability within patient communication module',
      'Misconfigured AWS S3 buckets containing unencrypted PHI records',
      'Over-privileged IAM execution roles allowing lateral container traversal',
    ],
    impact: 'Hardened cloud infrastructure and patched web vectors. 0 security incidents or data breaches recorded post-launch.',
    stats: { vulns: '22', critical: '6', remediation: '8 Days', roi: 'Zero Breaches' },
    color: '#06B6D4',
  },
  {
    industry: 'E-Commerce',
    type: 'Web Application Pentest',
    challenge: 'An omnichannel retail platform handling ₹50Cr+ GMV suffered anomalous checkout discrepancies and coupon exploitation attacks.',
    findings: [
      'Cart price tampering vulnerability allowing zero-value order creation',
      'Mass-assignment vulnerability permitting customer order status manipulation',
      'Exposed administrative endpoints accessible without MFA protection',
    ],
    impact: 'Prevented an estimated ₹2.4Cr in fraudulent coupon theft. Implemented automated transaction integrity validation.',
    stats: { vulns: '18', critical: '3', remediation: '7 Days', roi: '₹2.4Cr Saved' },
    color: '#818CF8',
  },
  {
    industry: 'Enterprise AI',
    type: 'AI & LLM Security',
    challenge: 'An enterprise SaaS firm deploying an autonomous LLM customer support agent needed adversarial red-teaming against jailbreaking and prompt injection.',
    findings: [
      'System prompt and API key extraction via recursive role-play injection',
      'RAG vector database poisoning resulting in unauthorized knowledge disclosure',
      'Unchecked tool execution permissions enabling arbitrary database extraction',
    ],
    impact: 'Enforced defensive guardrails and least-privilege tool execution scopes. Successfully onboarded 3 Tier-1 enterprise accounts.',
    stats: { vulns: '9', critical: '5', remediation: '10 Days', roi: '3 Ent. Clients' },
    color: '#A855F7',
  },
];

export default function CaseStudiesClient() {
  const [casesList, setCasesList] = useState(CASES);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await listCaseStudies();
        if (res.success && res.cases && res.cases.length > 0) {
          const pub = res.cases.filter(c => c.isPublished);
          if (pub.length > 0) setCasesList(pub);
        }
      } catch (err) {}
      setLoading(false);
    }
    loadData();
  }, []);

  const industries = ['All', ...Array.from(new Set(casesList.map(c => c.industry)))];
  const filteredCases = activeFilter === 'All' ? casesList : casesList.filter(c => c.industry === activeFilter);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', position: 'relative', overflow: 'hidden' }}>
      <div className="cyber-grid" style={{ position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Hero */}
      <section style={{ padding: '120px 24px 40px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div className="section-label" style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: 16 }}>
          PROVEN IMPACT & REAL RESULTS
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 5.5vw, 56px)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-1.5px', marginBottom: 16, lineHeight: 1.1 }}>
          Anonymised <span style={{ background: 'linear-gradient(135deg, #3B82F6, #06B6D4)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Case Studies</span>
        </h1>
        <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: 620, margin: '0 auto' }}>
          Explore how Aritaro uncovers high-impact vulnerabilities before adversaries do — and how our targeted remediation helps engineering teams ship securely.
        </p>

        {/* Filter Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32, flexWrap: 'wrap' }}>
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => setActiveFilter(ind)}
              style={{
                padding: '7px 18px',
                borderRadius: 100,
                border: activeFilter === ind ? '1px solid rgba(59,130,246,0.5)' : '1px solid var(--border-subtle)',
                background: activeFilter === ind ? 'rgba(59,130,246,0.15)' : 'rgba(15,23,42,0.4)',
                color: activeFilter === ind ? '#3B82F6' : 'var(--text-muted)',
                fontSize: 12.5,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {ind}
            </button>
          ))}
        </div>
      </section>

      {/* Case Grid */}
      <section style={{ padding: '24px 24px 80px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 24 }} className="case-studies-grid">
          {filteredCases.map((c, i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 16,
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${c.color || '#3B82F6'}50`;
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = `0 12px 36px ${c.color || '#3B82F6'}15`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Header Badges */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 9999, background: `${c.color || '#3B82F6'}15`, color: c.color || '#3B82F6', border: `1px solid ${c.color || '#3B82F6'}30` }}>
                    {c.industry}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>
                    {c.type}
                  </span>
                </div>

                {/* Challenge */}
                <p style={{ fontSize: 14.5, color: 'var(--text-primary)', lineHeight: 1.65, marginBottom: 20, fontWeight: 500 }}>
                  {c.challenge}
                </p>

                {/* Key Findings */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.color || '#3B82F6' }} />
                    Critical Findings & Vectors
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {c.findings?.map((f, j) => (
                      <li key={j} style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: 10, lineHeight: 1.5 }}>
                        <span style={{ color: c.color || '#3B82F6', fontWeight: 800 }}>›</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Business Impact Box */}
                <div style={{ padding: '14px 16px', background: `${c.color || '#3B82F6'}08`, border: `1px solid ${c.color || '#3B82F6'}20`, borderRadius: 10, marginBottom: 20 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: c.color || '#3B82F6', marginBottom: 4 }}>
                    Outcome & Value Delivered
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.55, margin: 0 }}>
                    {c.impact}
                  </p>
                </div>
              </div>

              {/* Bottom Metrics Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, paddingTop: 16, borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                {Object.entries(c.stats || {}).map(([key, val]) => (
                  <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: c.color || 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                      {val}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                      {key}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Scoping CTA */}
      <section style={{ padding: '64px 24px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-surface)', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12 }}>
            Protect Your Organization Today
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 28 }}>
            Get deep, actionable penetration testing reports tailored to your stack and compliance requirements.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/request-assessment" className="btn-primary" style={{ fontSize: 14, padding: '12px 28px', textDecoration: 'none', borderRadius: 8 }}>
              Request Scoping Assessment →
            </Link>
            <Link href="/services" className="btn-ghost" style={{ fontSize: 14, padding: '12px 24px', textDecoration: 'none', borderRadius: 8 }}>
              Explore All Services
            </Link>
          </div>
        </div>
      </section>

      <WhatsAppWidget />
    </div>
  );
}
