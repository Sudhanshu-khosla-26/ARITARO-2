import ServicePageLayout from '@/components/ServicePageLayout';

export const metadata = {
  title: 'Cloud Security Assessment | Aritaro Cybersecurity Services',
  description: 'Adversarial review of AWS, Azure, and GCP environments. Identify misconfigurations, exposed storage, over-privileged IAM, and attack paths. CIS Benchmarks compliant.',
  keywords: 'cloud security assessment, AWS security audit, Azure security review, GCP security, cloud penetration testing India, CSPM',
};

const methodology = [
  { title: 'IAM Review', focus: 'Identity and access security', activities: ['User/Role Enumeration', 'Wildcard Permissions', 'Unused Credentials', 'Access Keys >90 Days', 'Cross-Account Trust'] },
  { title: 'Network & Perimeter', focus: 'Exposure analysis', activities: ['VPC Config', 'Security Groups (0.0.0.0/0)', 'Exposed RDS/Redis', 'API Gateway Configs', 'Routing Tables'] },
  { title: 'Storage & Data', focus: 'Data security assessment', activities: ['S3 ACL Review', 'Encryption at Rest/Transit', 'CloudTrail Completeness', 'Secrets in Env Vars', 'VPC Flow Logs'] },
  { title: 'Compute & Serverless', focus: 'Runtime security', activities: ['EC2 IMDSv1 SSRF', 'Lambda Permissions', 'ECS/EKS Image Scanning', 'K8s RBAC Misconfig'] },
  { title: 'Attack Path Analysis', focus: 'Adversarial simulation', activities: ['Realistic Attack Chains', 'Data Exfiltration PoC', 'Blast Radius Analysis', 'Read-Only PoC'] },
];

const faqs = [
  { q: 'Which cloud platforms do you support?', a: 'We assess AWS, Microsoft Azure, and Google Cloud Platform (GCP). Multi-cloud environments are our specialty, and we can evaluate cross-cloud trust relationships.' },
  { q: 'Do you need admin access to our cloud accounts?', a: 'For the most thorough assessment, we request read-only access via IAM roles. We never modify your infrastructure. All access is documented in the Rules of Engagement.' },
  { q: 'What is the difference between CSPM and a cloud security assessment?', a: 'CSPM tools provide continuous automated monitoring. Our assessment goes deeper with manual analysis, attack path simulation, and adversarial thinking that automated tools cannot replicate.' },
  { q: 'Will this help us with compliance?', a: 'Yes. Our reports map directly to CIS Benchmarks, CSA CCM, NIST CSF, and the AWS Well-Architected Framework. We provide specific remediation steps for each finding.' },
  { q: 'How do you handle multi-account architectures?', a: 'We assess cross-account trust relationships, shared services accounts, and organization-level policies. Our IAM Risk Matrix specifically covers multi-account privilege escalation paths.' },
  { q: 'What is an attack path analysis?', a: 'We simulate realistic attack chains from external exposure to crown jewels — showing exactly how an attacker could move from an internet-facing service to sensitive data. All PoCs are read-only.' },
];

export default function CloudSecurityPage() {
  return (
    <ServicePageLayout
      title="Cloud Security Assessment"
      subtitle="Cloud misconfigurations cause 80% of cloud security incidents. We provide an adversarial review of AWS, Azure, and GCP — identifying exposed storage, over-privileged IAM, and attack paths from internet to crown jewels."
      tagline="CLOUD SECURITY"
      accentColor="#818CF8"
      methodology={methodology}
      standards={['CIS Benchmarks', 'CSA CCM', 'NIST CSF', 'AWS Well-Architected Framework']}
      deliverables={['Cloud Security Report', 'IAM Risk Matrix', 'Remediation Runbook', 'Attack Path Diagrams', 'Free Re-test for Critical/High']}
      timeline="7–14 business days"
      pricing="₹75K – ₹4.0L"
      engagementTypes={[
        { name: 'External Assessment', desc: 'Internet-facing services and exposure analysis' },
        { name: 'Internal Assessment', desc: 'Full account review with read-only access' },
        { name: 'Red Team', desc: 'Full adversarial simulation including social engineering' },
      ]}
      whyItMatters={[
        { stat: '$4.88M', text: 'Average data breach cost in 2024 (IBM Report)' },
        { stat: '2.3B', text: 'files exposed by misconfigured S3 buckets in 2023' },
        { stat: '80%', text: 'of cloud incidents caused by misconfigurations' },
      ]}
      faqs={faqs}
    />
  );
}
