import { notFound } from 'next/navigation';
import ServicePageLayout from '@/components/ServicePageLayout';
import connectDB from '@/lib/db';
import Service from '@/models/Service';
import { initApp } from '@/lib/init';

// Default static backups for known primary services if DB has not been seeded
const STATIC_SERVICES = {
  'api-pt': {
    title: 'API Penetration Testing',
    tagline: 'API SECURITY',
    subtitle: 'APIs are the backbone of modern applications — and the #1 attack surface exploited by adversaries. We deliver deep, manual and automated testing of REST, GraphQL, gRPC, and SOAP APIs.',
    accentColor: '#3B82F6',
    duration: '1-2 Weeks',
    overview: 'Our API Penetration Testing service systematically uncovers Broken Object Level Authorization (BOLA/IDOR), broken authentication, mass assignment, injection vulnerabilities, and business logic flaws across your API endpoints.',
    scope: ['REST, GraphQL, gRPC & SOAP Endpoints', 'Authentication & Authorization Flows', 'Rate Limiting & Anti-Automation', 'Data Serialization & Input Validation'],
    methodology: [
      { title: 'Recon & Scope', focus: 'Surface mapping and endpoint inventory', activities: ['Swagger/OpenAPI', 'JS Analysis', 'Burp Crawl', 'Auth Scheme ID', 'Data Flow Mapping'] },
      { title: 'Auth & Authorization', focus: 'Access control testing', activities: ['JWT Confusion', 'BOLA/IDOR', 'BFLA', 'OAuth 2.0 Leakage', 'PKCE Bypass'] },
      { title: 'Injection & Logic', focus: 'Exploitation testing', activities: ['SQLi/NoSQLi', 'Command Injection', 'GraphQL Abuse', 'Mass Assignment', 'Workflow Bypass'] },
      { title: 'Rate Limiting & Abuse', focus: 'Resilience testing', activities: ['Auth Rate Limits', 'GraphQL Exhaustion', 'Account Enumeration', 'Timing Attacks'] },
      { title: 'Reporting', focus: 'Comprehensive deliverables', activities: ['Executive Summary', 'CVSS 3.1 Scoring', 'PoC Steps', 'Code-Level Fixes', 'Re-test'] },
    ],
    standards: ['OWASP API Top 10 (2023)', 'PTES', 'NIST SP 800-115'],
    deliverables: ['Executive Report (board-ready)', 'Full Technical Report (CVSS 3.1)', 'Remediation Tracker', 'Developer Fix Guide', 'Free Re-test for Critical/High'],
    timeline: '5–10 business days',
    engagementTypes: [
      { name: 'Grey Box', desc: 'Partial knowledge — authenticated user, API docs provided' },
      { name: 'White Box', desc: 'Full access — source code, architecture diagrams, admin access' },
    ],
    whyItMatters: [
      { stat: '83%', text: 'of web traffic is API traffic across modern applications' },
      { stat: 'Top 10', text: 'OWASP API Security covers threats automated scanners miss' },
      { stat: '1 endpoint', text: 'A single broken API endpoint can expose your entire customer database' },
    ],
    faqs: [
      { q: 'What types of APIs do you test?', a: 'We test REST, GraphQL, gRPC, and SOAP APIs across cloud, microservices, and mobile backend environments.' },
      { q: 'Will testing affect production?', a: 'We employ safe, non-destructive methodologies and coordinate testing windows for live endpoints.' },
      { q: 'Is a free re-test included?', a: 'Yes, a free re-test is included for all critical and high-severity findings.' },
    ],
  },
  'wap-pt': {
    title: 'Web Application Pentest',
    tagline: 'WEB APP SECURITY',
    subtitle: 'Comprehensive manual and automated assessment of enterprise web platforms. Logic-aware vulnerability research that identifies critical flaws scanners miss.',
    accentColor: '#06B6D4',
    duration: '2-3 Weeks',
    overview: 'We conduct full OWASP Top 10 and business logic assessments of modern web applications, SPAs, multi-tenant SaaS platforms, and customer portals to protect against unauthorized access and data breaches.',
    scope: ['Client & Server-Side Security', 'Authentication & Session Management', 'Authorization & Privilege Escalation', 'Business Logic & Payment Workflows'],
    methodology: [
      { title: 'Information Gathering', focus: 'Reconnaissance and surface mapping', activities: ['Subdomain Enumeration', 'DNS Mapping', 'Tech Fingerprinting', 'JS File Analysis', 'WAF Detection'] },
      { title: 'Auth & Session', focus: 'Access control testing', activities: ['Password Policy', 'Account Lockout', 'MFA Bypass', 'Session Token Entropy', 'Cookie Flags', 'Password Reset'] },
      { title: 'OWASP Top 10', focus: 'Full coverage testing', activities: ['Broken Access Control', 'Crypto Failures', 'SQLi/XSS/SSTI/XXE', 'Misconfiguration', 'Deserialization', 'SSRF'] },
      { title: 'Business Logic', focus: 'Deep manual testing', activities: ['Price Manipulation', 'Workflow Bypass', 'IDOR Chains', 'Multi-step Tampering'] },
      { title: 'Client-Side', focus: 'Browser security', activities: ['CSP Analysis', 'SRI', 'Clickjacking', 'CSRF', 'Open Redirects', 'localStorage Exposure'] },
      { title: 'Reporting', focus: 'Actionable deliverables', activities: ['CVSS Scoring', 'Dev Fix Guide', 'Compliance Mapping'] },
    ],
    standards: ['OWASP Top 10 (2021)', 'OWASP WSTG v4.2', 'PTES', 'NIST SP 800-115'],
    deliverables: ['Executive Summary (board-ready)', 'Full Technical Report', 'Developer Fix Guide', 'Compliance Mapping Report', 'Free Re-test for Critical/High'],
    timeline: '5–8 business days',
    engagementTypes: [
      { name: 'Grey Box', desc: 'Partial knowledge — authenticated user access provided' },
      { name: 'White Box', desc: 'Full access — source code and architecture diagrams' },
    ],
    whyItMatters: [
      { stat: '#1', text: 'Web apps remain the #1 entry vector for external data breaches' },
      { stat: '40–60%', text: 'of logic vulnerabilities are missed by automated scanners' },
      { stat: 'Required', text: 'PCI-DSS, ISO 27001, and SOC 2 require regular web pen tests' },
    ],
    faqs: [
      { q: 'What web architectures can you test?', a: 'We test Single Page Applications (React, Vue, Next.js), traditional SSR applications, APIs, and micro-frontend architectures.' },
      { q: 'How do you prevent data corruption during testing?', a: 'We use non-destructive payloads and coordinate testing windows on staging or dedicated sandbox environments.' },
    ],
  },
  'cloud': {
    title: 'Cloud Security Assessment',
    tagline: 'CLOUD INFRASTRUCTURE',
    subtitle: 'Adversarial configuration and architecture review across multi-cloud environments. Identify over-privileged IAM policies, public assets, and lateral movement paths.',
    accentColor: '#818CF8',
    duration: '1-3 Weeks',
    overview: 'Comprehensive security posture review for AWS, Azure, and Google Cloud Platform. We analyze IAM configurations, storage bucket permissions, network security groups, and container clusters to eliminate security blind spots.',
    scope: ['AWS / Azure / GCP Infrastructure', 'IAM Roles & Privilege Escalation', 'Kubernetes & Container Hardening', 'Storage, VPC & Perimeter Security'],
    methodology: [
      { title: 'Architecture Review', focus: 'Environment and asset inventory', activities: ['Cloud Asset Inventory', 'Architecture Review', 'IAM Matrix Mapping', 'Trust Boundary Analysis'] },
      { title: 'IAM Assessment', focus: 'Privilege analysis', activities: ['Least Privilege Audit', 'Privilege Escalation Paths', 'Role Assumption Chains', 'Service Account Audit'] },
      { title: 'Network & Perimeter', focus: 'Exposure analysis', activities: ['Security Group Rules', 'Publicly Exposed Services', 'WAF / CDN Config', 'VPC Peering Review'] },
      { title: 'Data Security', focus: 'Data at rest and in transit', activities: ['S3 / Blob Permissions', 'KMS Key Policies', 'Database Exposure', 'Secrets Management'] },
      { title: 'Container Security', focus: 'Kubernetes and container review', activities: ['K8s RBAC', 'Pod Security Standards', 'Image Vulnerabilities', 'Cluster Network Policies'] },
      { title: 'Reporting', focus: 'Remediation guidance', activities: ['Infrastructure as Code Fixes', 'Terraform Snippets', 'CIS Benchmark Mapping'] },
    ],
    standards: ['CIS Benchmarks (AWS, Azure, GCP)', 'NIST SP 800-53', 'CSA Cloud Controls Matrix'],
    deliverables: ['Executive Cloud Summary', 'Technical Findings Report', 'Terraform / IaC Remediation Code', 'CIS Compliance Matrix', 'Free Re-test'],
    timeline: '5–10 business days',
    engagementTypes: [
      { name: 'Grey Box', desc: 'Read-only IAM role access to review configurations' },
      { name: 'White Box', desc: 'Full architecture diagrams, Terraform code, and account access' },
    ],
    whyItMatters: [
      { stat: '80%+', text: 'of cloud breaches stem from IAM misconfigurations rather than zero-days' },
      { stat: 'CIS Scored', text: 'Full benchmark compliance across multi-cloud environments' },
      { stat: 'Zero-Trust', text: 'Ensure principle of least privilege across all service principals' },
    ],
    faqs: [
      { q: 'Which cloud providers do you support?', a: 'We provide deep assessments for Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP).' },
      { q: 'Do you require write access to our cloud accounts?', a: 'No, we only require read-only security audit roles and never require administrative modification access.' },
    ],
  },
  'ai-pt': {
    title: 'AI & LLM Penetration Testing',
    tagline: 'NEXT-GEN AI SECURITY',
    subtitle: 'Specialized adversarial red-teaming for LLM architectures, RAG knowledge pipelines, and agentic AI systems. Jailbreak prevention and prompt injection protection.',
    accentColor: '#A855F7',
    duration: '2-4 Weeks',
    overview: 'Customized adversarial red-teaming for generative AI applications. We evaluate prompt injection resistance, tool-calling boundaries, RAG poisoning, data extraction, and model guardrails to prevent AI security failures.',
    scope: ['Direct & Indirect Prompt Injection', 'RAG Vector Database Security', 'Autonomous Agent Tool-Calling Scoping', 'Model Inversion & Sensitive Data Extraction'],
    methodology: [
      { title: 'Threat Modeling', focus: 'AI attack surface mapping', activities: ['LLM Architecture Review', 'RAG Pipeline Analysis', 'Plugin / Tool Mapping', 'Trust Boundary Definition'] },
      { title: 'Prompt Injection', focus: 'Input manipulation testing', activities: ['Direct Prompt Injection', 'Indirect Prompt Injection', 'Jailbreak Techniques', 'System Prompt Extraction'] },
      { title: 'RAG & Data Security', focus: 'Knowledge base attacks', activities: ['Vector DB Poisoning', 'Document Retrieval Bypass', 'Embedding Attacks', 'Data Extraction'] },
      { title: 'Agent & Tool Security', focus: 'Autonomous action testing', activities: ['Unauthorized Tool Execution', 'Excessive Agency Exploits', 'Privilege Escalation via Agents', 'SSRF via Tool Calls'] },
      { title: 'Output & Supply Chain', focus: 'Downstream impact and dependencies', activities: ['Insecure Output Handling', 'Model Poisoning', 'Supply Chain Vulnerabilities', 'Denial of Service'] },
      { title: 'Reporting', focus: 'Actionable defense guidance', activities: ['Guardrail Architecture Design', 'Input Sanitization Rules', 'System Prompt Hardening'] },
    ],
    standards: ['OWASP Top 10 for LLMs (2025)', 'MITRE ATLAS', 'NIST AI Risk Management Framework'],
    deliverables: ['Board-Ready AI Security Summary', 'Technical Exploit & Red-Team Log', 'Guardrail Implementation Blueprint', 'Remediation Code Fixes', 'Free Re-test'],
    timeline: '5–12 business days',
    engagementTypes: [
      { name: 'Grey Box', desc: 'API access to LLM endpoints and system prompt documentation' },
      { name: 'White Box', desc: 'Full access to prompt pipelines, RAG embeddings, and guardrail code' },
    ],
    whyItMatters: [
      { stat: 'OWASP #1', text: 'Prompt injection is ranked as the #1 threat to generative AI applications' },
      { stat: 'Agent Risk', text: 'Autonomous tool-calling agents require strict sandboxing boundaries' },
      { stat: 'Data Privacy', text: 'Prevent confidential company data from leaking via model outputs' },
    ],
    faqs: [
      { q: 'What types of AI systems do you test?', a: 'We test customer-facing chatbots, internal enterprise search/RAG pipelines, autonomous agent frameworks, and custom LLM microservices.' },
      { q: 'What standards do you follow?', a: 'Our testing follows the OWASP Top 10 for Large Language Model Applications and the MITRE ATLAS framework.' },
    ],
  },
};

function getAccentColor(slug = '', category = '') {
  const s = slug.toLowerCase();
  if (s.includes('api')) return '#3B82F6';
  if (s.includes('web') || s.includes('wap') || s.includes('app')) return '#06B6D4';
  if (s.includes('cloud') || s.includes('infra') || s.includes('aws') || s.includes('azure')) return '#818CF8';
  if (s.includes('ai') || s.includes('llm') || s.includes('agent') || s.includes('ml')) return '#A855F7';
  if (s.includes('network') || s.includes('mobile')) return '#EC4899';
  return '#3B82F6';
}

async function getServiceData(slug) {
  try {
    await initApp();
    await connectDB();

    // 1. Try to find the exact service created by admin in MongoDB
    const service = await Service.findOne({
      $or: [
        { slug: slug.toLowerCase() },
        { slug: slug.toLowerCase().replace(/-/g, '_') },
      ],
      isPublished: true,
    }).lean();

    if (service) {
      const accentColor = getAccentColor(service.slug, service.category);
      return {
        title: service.name,
        subtitle: service.description || service.shortDescription,
        tagline: (service.shortDescription || 'CYBERSECURITY SERVICE').toUpperCase(),
        accentColor,
        duration: service.duration || '2-4 Weeks',
        overview: service.overview || service.description,
        scope: service.scope || [],
        methodology: service.methodology || [],
        standards: service.standards?.length ? service.standards : ['OWASP Guidelines', 'PTES', 'NIST SP 800-115'],
        deliverables: service.deliverables?.length ? service.deliverables : ['Executive Summary', 'Detailed Technical Report', 'Remediation Guide', 'Free Re-test'],
        timeline: service.duration || '5–10 business days',
        faqs: service.faqs?.map((f) => ({ q: f.question, a: f.answer })) || [],
        engagementTypes: [
          { name: 'Grey Box', desc: 'Partial access with authenticated test credentials' },
          { name: 'White Box', desc: 'Full architecture and source code verification' },
        ],
        whyItMatters: [
          { stat: 'Manual Depth', text: 'Expert-led adversarial testing tailored to your tech stack' },
          { stat: 'Zero-Day Detection', text: 'Uncover deep business logic flaws automated tools miss' },
          { stat: 'Compliance Ready', text: 'Deliverables mapped to ISO 27001, SOC 2, and PCI-DSS' },
        ],
      };
    }
  } catch (err) {
    console.error('Error fetching service from database:', err);
  }

  // 2. Fallback to static services mapping if not in DB
  const normalizedSlug = slug.toLowerCase();
  if (STATIC_SERVICES[normalizedSlug]) {
    return STATIC_SERVICES[normalizedSlug];
  }

  // Check common aliases
  if (normalizedSlug === 'api-penetration-testing') return STATIC_SERVICES['api-pt'];
  if (normalizedSlug === 'web-application-penetration-testing') return STATIC_SERVICES['wap-pt'];
  if (normalizedSlug === 'cloud-security-assessment') return STATIC_SERVICES['cloud'];
  if (normalizedSlug === 'ai-penetration-testing') return STATIC_SERVICES['ai-pt'];

  return null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getServiceData(slug);

  if (!data) {
    return {
      title: 'Service | Aritaro Cybersecurity Services',
      description: 'Expert offensive cybersecurity services and penetration testing.',
    };
  }

  return {
    title: `${data.title} | Aritaro Cybersecurity Services`,
    description: data.subtitle || data.overview || `${data.title} by Aritaro Cybersecurity.`,
    keywords: `${data.title}, cybersecurity, penetration testing, VAPT, security assessment`,
  };
}

export default async function DynamicServicePage({ params }) {
  const { slug } = await params;
  const serviceData = await getServiceData(slug);

  if (!serviceData) {
    notFound();
  }

  return (
    <ServicePageLayout
      title={serviceData.title}
      subtitle={serviceData.subtitle}
      overview={serviceData.overview}
      scope={serviceData.scope}
      tagline={serviceData.tagline}
      accentColor={serviceData.accentColor}
      methodology={serviceData.methodology}
      standards={serviceData.standards}
      deliverables={serviceData.deliverables}
      timeline={serviceData.timeline || serviceData.duration}
      engagementTypes={serviceData.engagementTypes}
      whyItMatters={serviceData.whyItMatters}
      faqs={serviceData.faqs}
    />
  );
}
