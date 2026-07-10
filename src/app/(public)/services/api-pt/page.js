import ServicePageLayout from '@/components/ServicePageLayout';

export const metadata = {
  title: 'API Penetration Testing | Aritaro Cybersecurity Services',
  description: 'Deep, manual and automated security testing of REST, GraphQL, gRPC, and SOAP APIs. OWASP API Security Top 10 coverage. Certified experts, actionable reports.',
  keywords: 'API penetration testing, API security testing, OWASP API Top 10, REST API security, GraphQL security, API pentest India',
};

const methodology = [
  { title: 'Recon & Scope', focus: 'Surface mapping and endpoint inventory', activities: ['Swagger/OpenAPI', 'JS Analysis', 'Burp Crawl', 'Auth Scheme ID', 'Data Flow Mapping'] },
  { title: 'Auth & Authorization', focus: 'Access control testing', activities: ['JWT Confusion', 'BOLA/IDOR', 'BFLA', 'OAuth 2.0 Leakage', 'PKCE Bypass'] },
  { title: 'Injection & Logic', focus: 'Exploitation testing', activities: ['SQLi/NoSQLi', 'Command Injection', 'GraphQL Abuse', 'Mass Assignment', 'Workflow Bypass'] },
  { title: 'Rate Limiting & Abuse', focus: 'Resilience testing', activities: ['Auth Rate Limits', 'GraphQL Exhaustion', 'Account Enumeration', 'Timing Attacks'] },
  { title: 'Reporting', focus: 'Comprehensive deliverables', activities: ['Executive Summary', 'CVSS 3.1 Scoring', 'PoC Steps', 'Code-Level Fixes', 'Re-test'] },
];

const faqs = [
  { q: 'What types of APIs do you test?', a: 'We test REST, GraphQL, gRPC, and SOAP APIs. Whether your API serves a mobile app, SPA, microservices architecture, or third-party integrations, our methodology covers all attack surfaces.' },
  { q: 'What is the difference between Black Box, Grey Box, and White Box testing?', a: 'Black Box simulates a real attacker with no prior knowledge. Grey Box provides partial access (API docs, auth credentials). White Box includes full source code access for the deepest analysis.' },
  { q: 'How long does an API penetration test take?', a: 'Typically 5–10 business days depending on the number of endpoints, complexity of auth mechanisms, and engagement type. We provide a precise timeline after the scoping call.' },
  { q: 'Will testing affect our production systems?', a: 'We use non-destructive testing techniques. For production environments, we coordinate maintenance windows and use rate-limited testing. We can also test staging environments.' },
  { q: 'What standards do you follow?', a: 'Our methodology is built on OWASP API Security Top 10 (2023), PTES (Penetration Testing Execution Standard), and NIST SP 800-115. All findings are scored using CVSS 3.1.' },
  { q: 'Do you provide remediation guidance?', a: 'Yes. Every finding includes code-level remediation recommendations, not just vulnerability descriptions. We also offer a post-report debrief call with your engineering team.' },
  { q: 'Is there a re-test included?', a: 'Yes. One free re-test for critical and high severity findings is included in every engagement. This verifies that your fixes are effective.' },
];

export default function ApiPtPage() {
  return (
    <ServicePageLayout
      title="API Penetration Testing"
      subtitle="APIs are the backbone of modern applications — and the #1 attack surface exploited by adversaries. We deliver deep, manual and automated testing of REST, GraphQL, gRPC, and SOAP APIs."
      tagline="API SECURITY"
      accentColor="#3B82F6"
      methodology={methodology}
      standards={['OWASP API Top 10 (2023)', 'PTES', 'NIST SP 800-115']}
      deliverables={['Executive Report (board-ready)', 'Full Technical Report (CVSS 3.1)', 'Remediation Tracker (Excel)', 'Developer Fix Guide', 'Free Re-test for Critical/High']}
      timeline="5–10 business days"
      pricing="₹50K – ₹2.5L"
      engagementTypes={[
        // { name: 'Black Box', desc: 'No prior knowledge — real-world attacker simulation' },
        { name: 'Grey Box', desc: 'Partial knowledge — authenticated user, API docs provided' },
        { name: 'White Box', desc: 'Full access — source code, architecture diagrams, admin access' },
      ]}
      whyItMatters={[
        { stat: '83%', text: 'of web traffic is API traffic (Akamai, 2024)' },
        { stat: 'Top 10', text: 'OWASP API Security covers threats scanners miss' },
        { stat: '1 endpoint', text: 'A single broken API can expose your entire database' },
      ]}
      faqs={faqs}
    />
  );
}
