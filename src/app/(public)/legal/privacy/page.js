import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Aritaro Cybersecurity Services',
  description: 'Aritaro Privacy Policy — how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <article style={{ maxWidth: 860, margin: '0 auto', padding: '96px 24px 80px' }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.5)', border: '1px solid var(--border-subtle)', borderRadius: 18, padding: '32px 24px', boxShadow: '0 20px 60px rgba(15, 23, 42, 0.25)' }}>
          <div className="section-label" style={{ display: 'inline-flex', marginBottom: 12 }}>Legal</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>Privacy Policy</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28 }}>Last updated: June 2025</p>
          {[
            { t: '1. Information We Collect', c: 'We collect information you voluntarily provide when contacting us, requesting services, or subscribing to our newsletter. This includes name, email address, company name, and details related to your assessment request. We do not collect data beyond what is necessary for service delivery.' },
            { t: '2. How We Use Your Information', c: 'Your information is used to deliver requested security assessment services, communicate about engagements, send operational or security updates when you opt in, and improve the quality of our service. We do not sell or rent your information for marketing purposes.' },
            { t: '3. Data Security', c: 'As a cybersecurity firm, we practice what we preach. Client data is protected with encryption in transit and at rest, access is restricted on a need-to-know basis, and our systems maintain operational audit trails.' },
            { t: '4. Data Retention', c: 'Engagement data is retained for the duration of the engagement and a reasonable post-engagement period to support re-testing, compliance review, or legal obligations. We securely delete or anonymize data when no longer required.' },
            { t: '5. Your Rights', c: 'You may request access to, correction of, or deletion of your personal data, and you may withdraw consent at any time. Please email privacy@aritaro.com to exercise these rights.' },
            { t: '6. Cookies', c: 'Our website uses only essential cookies required for functionality. We do not use tracking cookies or third-party analytics that identify individual users.' },
            { t: '7. Changes', c: 'We may update this policy periodically. Changes will be posted on this page and reflected by the updated “Last Updated” date.' },
            { t: '8. Contact', c: 'For privacy-related inquiries, please contact privacy@aritaro.com.' },
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
