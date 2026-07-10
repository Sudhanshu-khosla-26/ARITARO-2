import ServicePageLayout from '@/components/ServicePageLayout';

export const metadata = {
  title: 'AI Penetration Testing | Aritaro Cybersecurity Services',
  description: 'Dedicated AI/LLM security testing — prompt injection, data exfiltration, model attacks, and agentic AI security. OWASP LLM Top 10 coverage. One of few firms in India.',
  keywords: 'AI penetration testing, LLM security testing, prompt injection testing, AI red teaming, ML security India, AI pentest',
};

const methodology = [
  { title: 'AI System Recon', focus: 'System mapping and analysis', activities: ['Model Type ID', 'API Surface Mapping', 'Integration Points', 'System Prompt Review', 'Guardrail Analysis'] },
  { title: 'Prompt Injection', focus: 'Core LLM attack testing', activities: ['Direct Injection', 'Indirect via RAG', 'Jailbreaking (DAN)', 'Role-Play Attacks', 'Multi-Turn Context'] },
  { title: 'Data Exfil & Privacy', focus: 'Leakage testing', activities: ['Training Data Extraction', 'PII Leakage', 'System Prompt Extraction', 'RAG Poisoning', 'Memorisation Attacks'] },
  { title: 'Model & Infrastructure', focus: 'Backend security', activities: ['API Auth/Rate Limiting', 'Model Inversion', 'Adversarial Inputs', 'Supply Chain Risks', 'Fine-Tuning Integrity'] },
  { title: 'Agent & Tool Use', focus: 'Agentic AI security', activities: ['Privilege Escalation', 'Agent Loop Injection', 'Function Calling Abuse', 'Tool Use Exploitation'] },
];

const faqs = [
  { q: 'What types of AI systems do you test?', a: 'We test LLM-powered applications (GPT, Claude, Gemini), RAG systems, AI chatbots, autonomous agents, ML model APIs, and custom fine-tuned models. If it uses AI, we can test it.' },
  { q: 'What is prompt injection?', a: 'Prompt injection is when an attacker crafts inputs that override or manipulate the AI system\'s intended behavior — similar to SQL injection for databases but targeting language models.' },
  { q: 'Is AI security testing really necessary?', a: 'With 65% of enterprises running AI in production and OWASP publishing a dedicated LLM Top 10, the attack surface is real and growing. AI systems can be weaponised to exfiltrate data, bypass guardrails, and generate harmful outputs.' },
  { q: 'Do you test agentic AI systems?', a: 'Yes. We specifically test autonomous agent architectures including function calling, tool use, multi-agent systems, and the unique risks of LLM agents with access to external tools and data.' },
  { q: 'What standards do you follow for AI testing?', a: 'We follow OWASP LLM Top 10 (2025), MITRE ATLAS for adversarial threat modelling, NIST AI RMF for risk management, and EU AI Act alignment for compliance readiness.' },
  { q: 'How is this different from a regular pen test?', a: 'Traditional pen tests focus on network, web, and API vulnerabilities. AI pen testing requires entirely different techniques — prompt engineering, adversarial ML, and understanding of model architectures.' },
  { q: 'Is Aritaro one of the first in India to offer this?', a: 'Yes. As of 2025–2026, very few firms in India offer dedicated AI/LLM penetration testing. Our team has specialised AI security certifications and custom testing frameworks.' },
];

export default function AiPtPage() {
  return (
    <ServicePageLayout
      title="AI Penetration Testing"
      subtitle="One of very few firms in India offering dedicated AI/LLM security testing. As organisations deploy LLMs, ML models, and AI-powered applications, a new attack surface emerges that traditional security tools cannot address."
      tagline="AI SECURITY"
      accentColor="#A855F7"
      methodology={methodology}
      standards={['OWASP LLM Top 10 (2025)', 'MITRE ATLAS', 'NIST AI RMF', 'EU AI Act']}
      deliverables={['AI Security Report', 'Threat Model', 'Remediation Playbook', 'Guardrail Assessment', 'Free Re-test for Critical/High']}
      timeline="7–15 business days"
      pricing="₹1.0L – ₹5.0L"
      engagementTypes={[
        // { name: 'Black Box', desc: 'External user perspective — testing through the AI interface only' },
        { name: 'Grey Box', desc: 'With system prompts, API docs, and model details provided' },
        { name: 'White Box', desc: 'Full access — model architecture, training data, fine-tuning pipeline' },
      ]}
      whyItMatters={[
        { stat: '65%', text: 'of enterprises have AI in production (2024)' },
        { stat: 'LLM Top 10', text: 'OWASP published a dedicated AI threat taxonomy' },
        { stat: 'Weaponised', text: 'AI can exfiltrate data and bypass guardrails if unsecured' },
      ]}
      faqs={faqs}
    />
  );
}
