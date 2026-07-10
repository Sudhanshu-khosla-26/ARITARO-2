import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Aritaro Cybersecurity Services',
  description: 'Aritaro Privacy Policy — how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>

      <article style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px 80px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 32 }}>Last updated: June 2025</p>
        {[
          { t: '1. Information We Collect', c: 'We collect information you voluntarily provide when contacting us, requesting services, or subscribing to our newsletter. This includes name, email address, company name, and application URLs submitted for assessment. We do not collect data beyond what is necessary for service delivery.' },
          { t: '2. How We Use Your Information', c: 'Your information is used exclusively to: (a) Deliver requested security assessment services, (b) Communicate about engagements and deliverables, (c) Send security advisories if you opt in, (d) Improve our services. We never sell, rent, or share your data with third parties for marketing purposes.' },
          { t: '3. Data Security', c: 'As a cybersecurity firm, we practice what we preach. All client data is encrypted at rest (AES-256) and in transit (TLS 1.3). Access is restricted on a need-to-know basis. We maintain audit logs of all data access.' },
          { t: '4. Data Retention', c: 'Engagement data is retained for the duration of the engagement plus 12 months for re-test purposes. After this period, all data is securely deleted. You may request earlier deletion at any time.' },
          { t: '5. Your Rights', c: 'You have the right to: access your personal data, request correction of inaccurate data, request deletion of your data, withdraw consent at any time. To exercise these rights, contact privacy@aritaro.com.' },
          { t: '6. Cookies', c: 'Our website uses only essential cookies required for functionality. We do not use tracking cookies or third-party analytics that identify individual users.' },
          { t: '7. Changes', c: 'We may update this policy periodically. Changes will be posted on this page with an updated "Last Updated" date.' },
          { t: '8. Contact', c: 'For privacy-related inquiries: privacy@aritaro.com' },
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
