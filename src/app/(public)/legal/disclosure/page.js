import Link from 'next/link';

export const metadata = {
  title: 'Responsible Disclosure | Aritaro Cybersecurity Services',
  description: 'Aritaro Responsible Disclosure Policy — how to report security vulnerabilities in our systems.',
};

export default function DisclosurePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>

      <article style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px 80px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Responsible Disclosure Policy</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 32 }}>Last updated: June 2025</p>
        {[
          { t: 'Our Commitment', c: 'Aritaro takes security seriously — both for our clients and for our own systems. We welcome responsible disclosure of security vulnerabilities in our infrastructure and web properties.' },
          { t: 'Scope', c: 'This policy covers aritaro.com and any subdomains or services operated by Aritaro. It does not extend to client systems, which are governed by individual engagement agreements.' },
          { t: 'How to Report', c: 'Send vulnerability reports to security@aritaro.com. Include: (1) Description of the vulnerability, (2) Steps to reproduce, (3) Potential impact, (4) Your contact information. We use PGP for encrypted communication — our public key is available on request.' },
          { t: 'Our Promise', c: 'We will: acknowledge your report within 48 hours, provide an initial assessment within 5 business days, keep you informed of remediation progress, credit you publicly (if desired) once the issue is resolved.' },
          { t: 'Safe Harbor', c: 'We will not take legal action against researchers who: act in good faith, avoid accessing or modifying data belonging to others, do not disrupt our services, report findings promptly and allow reasonable time for remediation.' },
          { t: 'Out of Scope', c: 'The following are generally out of scope: social engineering attacks, denial of service attacks, spam or phishing, issues in third-party services, issues requiring physical access, automated scanner output without a working PoC.' },
          { t: 'Recognition', c: 'We maintain a Hall of Fame for researchers who responsibly disclose valid vulnerabilities. We do not currently operate a paid bug bounty programme, but we provide acknowledgment and reference letters.' },
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
