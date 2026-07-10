import ServicePageLayout from '@/components/ServicePageLayout';

export const metadata = {
  title: 'Web Application Penetration Testing | Aritaro Cybersecurity Services',
  description: 'Comprehensive OWASP-based security assessment of web applications. Manual, logic-aware testing that finds what automated tools miss. PCI-DSS, ISO 27001, SOC 2 compliant.',
  keywords: 'web application penetration testing, VAPT, OWASP Top 10, web security audit, web app pentest India',
};

const methodology = [
  { title: 'Information Gathering', focus: 'Reconnaissance and surface mapping', activities: ['Subdomain Enumeration', 'DNS Mapping', 'Tech Fingerprinting', 'JS File Analysis', 'WAF Detection'] },
  { title: 'Auth & Session', focus: 'Access control testing', activities: ['Password Policy', 'Account Lockout', 'MFA Bypass', 'Session Token Entropy', 'Cookie Flags', 'Password Reset'] },
  { title: 'OWASP Top 10', focus: 'Full coverage testing', activities: ['Broken Access Control', 'Crypto Failures', 'SQLi/XSS/SSTI/XXE', 'Misconfiguration', 'Deserialization', 'SSRF'] },
  { title: 'Business Logic', focus: 'Deep manual testing', activities: ['Price Manipulation', 'Workflow Bypass', 'IDOR Chains', 'Multi-step Tampering'] },
  { title: 'Client-Side', focus: 'Browser security', activities: ['CSP Analysis', 'SRI', 'Clickjacking', 'CSRF', 'Open Redirects', 'localStorage Exposure'] },
  { title: 'Reporting', focus: 'Actionable deliverables', activities: ['CVSS Scoring', 'Dev Fix Guide', 'Compliance Mapping'] },
];

const faqs = [
  { q: 'What types of web applications do you test?', a: 'We test customer-facing portals, SaaS platforms, internal admin dashboards, e-commerce sites, and any web-based application. Our testing covers both modern SPAs and traditional server-rendered applications.' },
  { q: 'How is this different from automated scanning?', a: 'Automated scanners miss 40–60% of logic and auth vulnerabilities. Our manual testing finds business logic flaws, IDOR chains, and authentication bypasses that tools simply cannot detect.' },
  { q: 'Do you test for compliance requirements?', a: 'Yes. Our testing maps findings to PCI-DSS v4.0, ISO 27001, SOC 2 Type II, and other frameworks. We provide compliance-specific sections in our reports.' },
  { q: 'What if you find a critical vulnerability during testing?', a: 'We immediately notify your team via a secure channel for any critical or actively exploitable vulnerabilities, so you can take immediate action.' },
  { q: 'Can you test applications behind authentication?', a: 'Absolutely. Grey Box and White Box engagements include authenticated testing with various user roles to check for privilege escalation and broken access controls.' },
];

export default function WapPtPage() {
  return (
    <ServicePageLayout
      title="Web Application Penetration Testing"
      subtitle="Comprehensive security assessment of web applications — from customer-facing portals and SaaS platforms to internal admin dashboards. Manual, logic-aware testing that finds what automated tools miss."
      tagline="WEB APP SECURITY"
      accentColor="#6366F1"
      methodology={methodology}
      standards={['OWASP Top 10 (2021)', 'OWASP WSTG v4.2', 'PTES', 'NIST SP 800-115']}
      deliverables={['Executive Summary (board-ready)', 'Full Technical Report', 'Developer Fix Guide', 'Compliance Mapping Report', 'Free Re-test for Critical/High']}
      timeline="5–8 business days"
      pricing="₹40K – ₹2.0L"
      engagementTypes={[
        // { name: 'Black Box', desc: 'No prior knowledge — real-world attacker simulation' },
        { name: 'Grey Box', desc: 'Partial knowledge — authenticated user access provided' },
        { name: 'White Box', desc: 'Full access — source code and architecture diagrams' },
      ]}
      whyItMatters={[
        { stat: '#1', text: 'Web apps are the #1 entry vector in data breaches (Verizon DBIR 2024)' },
        { stat: '40–60%', text: 'of logic/auth vulns are missed by automated scanners' },
        { stat: 'Required', text: 'PCI-DSS, ISO 27001, SOC 2 all require periodic pen tests' },
      ]}
      faqs={faqs}
    />
  );
}
