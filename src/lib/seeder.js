import connectDB from "@/lib/db";
import { User, Service } from "@/models";

const DEFAULT_SERVICES = [
	{
		name: "API Penetration Testing",
		slug: "api-penetration-testing",
		description:
			"Comprehensive security assessment of your REST, GraphQL, and SOAP APIs.",
		shortDescription:
			"Secure your APIs against OWASP API Top 10 vulnerabilities.",
		duration: "2-3 weeks",
		icon: "code",
		overview:
			"Our API penetration testing service identifies vulnerabilities in your application programming interfaces before attackers can exploit them. We test authentication, authorization, input validation, rate limiting, and business logic flaws.",
		methodology: [
			"Discovery & Reconnaissance",
			"Authentication Testing",
			"Authorization Testing",
			"Input Validation Testing",
			"Business Logic Testing",
			"Rate Limiting Assessment",
			"Report Generation",
		],
		scope: [
			"REST API endpoints",
			"GraphQL queries and mutations",
			"Authentication mechanisms",
			"Authorization controls",
			"Input validation",
			"Rate limiting",
		],
		deliverables: [
			"Executive Summary Report",
			"Technical Findings Report",
			"Remediation Roadmap",
			"Retest Report (optional)",
		],
		standards: ["OWASP API Top 10", "OWASP ASVS", "PTES", "NIST SP 800-115"],
		sampleFindings: [
			"Broken Object Level Authorization (BOLA)",
			"Excessive Data Exposure",
			"Missing Rate Limiting",
			"JWT Token Vulnerabilities",
		],
		faqs: [
			{
				question: "How long does API testing take?",
				answer: "Typically 2-3 weeks depending on API complexity and scope.",
			},
			{
				question: "Do you test GraphQL APIs?",
				answer: "Yes, we test REST, GraphQL, SOAP, and gRPC APIs.",
			},
		],
		isPublished: true,
	},
	{
		name: "Web Application Penetration Testing",
		slug: "web-application-penetration-testing",
		description:
			"Full-scope web application security testing following OWASP methodology.",
		shortDescription: "Identify and remediate web application vulnerabilities.",
		duration: "3-4 weeks",
		icon: "globe",
		overview:
			"Our web application penetration testing simulates real-world attacks against your web applications to identify security weaknesses before malicious actors can exploit them.",
		methodology: [
			"Information Gathering",
			"Configuration Testing",
			"Authentication Testing",
			"Session Management Testing",
			"Input Validation Testing",
			"Business Logic Testing",
			"Client-side Testing",
		],
		scope: [
			"Web application frontend",
			"Backend server logic",
			"Authentication systems",
			"Session management",
			"File upload functionality",
			"Third-party integrations",
		],
		deliverables: [
			"Executive Summary",
			"Detailed Technical Report",
			"Proof of Concept Exploits",
			"Remediation Guidance",
			"Compliance Mapping",
		],
		standards: ["OWASP Top 10", "OWASP ASVS Level 2", "PTES", "PCI DSS"],
		sampleFindings: [
			"SQL Injection",
			"Cross-Site Scripting (XSS)",
			"Insecure Direct Object References",
			"Security Misconfiguration",
		],
		faqs: [
			{
				question: "Will testing disrupt our production environment?",
				answer:
					"We recommend testing in staging, but can test production with proper safeguards.",
			},
		],
		isPublished: true,
	},
	{
		name: "Cloud Security Assessment",
		slug: "cloud-security-assessment",
		description:
			"Comprehensive security assessment for AWS, Azure, and GCP environments.",
		shortDescription: "Secure your cloud infrastructure and configurations.",
		duration: "3-5 weeks",
		icon: "cloud",
		overview:
			"Our cloud security assessment evaluates your cloud infrastructure configuration, identity management, network security, and data protection across major cloud providers.",
		methodology: [
			"Cloud Asset Discovery",
			"IAM Policy Review",
			"Network Security Assessment",
			"Storage Security Review",
			"Logging & Monitoring Audit",
			"Compliance Gap Analysis",
		],
		scope: [
			"IAM policies and roles",
			"Network configurations",
			"Storage bucket permissions",
			"Compute instance security",
			"Container security",
			"Serverless function review",
		],
		deliverables: [
			"Cloud Security Posture Report",
			"Misconfiguration Findings",
			"IAM Remediation Plan",
			"Compliance Gap Analysis",
			"Architecture Recommendations",
		],
		standards: ["CIS Benchmarks", "CSA CCM", "NIST CSF", "ISO 27017"],
		sampleFindings: [
			"Public S3 Bucket Exposure",
			"Overprivileged IAM Roles",
			"Missing MFA on Root Account",
			"Unencrypted Data at Rest",
		],
		faqs: [
			{
				question: "Which cloud providers do you support?",
				answer: "AWS, Azure, GCP, and hybrid/multi-cloud environments.",
			},
		],
		isPublished: true,
	},
	{
		name: "AI Penetration Testing",
		slug: "ai-penetration-testing",
		description:
			"Specialized security testing for AI/ML systems, LLMs, and AI-powered applications.",
		shortDescription: "Protect your AI systems from emerging attack vectors.",
		duration: "4-6 weeks",
		icon: "brain",
		overview:
			"Our AI penetration testing service addresses the unique security challenges of artificial intelligence systems, including prompt injection, model extraction, data poisoning, and adversarial attacks.",
		methodology: [
			"AI System Mapping",
			"Prompt Injection Testing",
			"Model Extraction Attempts",
			"Data Poisoning Assessment",
			"Adversarial Input Testing",
			"Output Validation Review",
			"Supply Chain Analysis",
		],
		scope: [
			"LLM applications",
			"ML model endpoints",
			"Training data pipelines",
			"AI API integrations",
			"RAG systems",
			"AI agent workflows",
		],
		deliverables: [
			"AI Security Assessment Report",
			"Prompt Injection Findings",
			"Model Security Recommendations",
			"AI Governance Framework",
			"Red Team Exercise Report",
		],
		standards: ["OWASP LLM Top 10", "NIST AI RMF", "MITRE ATLAS", "ISO 42001"],
		sampleFindings: [
			"Prompt Injection Vulnerabilities",
			"Model Inversion Attacks",
			"Training Data Leakage",
			"Insecure AI Plugin Integration",
		],
		faqs: [
			{
				question: "What AI systems can you test?",
				answer:
					"LLMs, chatbots, RAG systems, ML models, and AI-powered applications.",
			},
		],
		isPublished: true,
	},
];

export async function seedDatabase() {
	const conn = await connectDB();
	if (!conn) return;

	const userCount = await User.countDocuments({ role: "admin" });
	if (userCount === 0) {
		const adminEmail = process.env.ADMIN_EMAIL || "admin@aritaro.com";
		const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

		await User.create({
			name: "aritaro Admin",
			email: adminEmail,
			password: adminPassword,
			role: "admin",
			isVerified: true,
		});

		console.log(`✅ Admin user created: ${adminEmail}`);
	}

	const serviceCount = await Service.countDocuments();
	if (serviceCount === 0) {
		await Service.insertMany(DEFAULT_SERVICES);
		console.log("✅ Default services seeded");
	}
}
