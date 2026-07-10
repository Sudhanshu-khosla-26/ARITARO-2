# Aritaro Cybersecurity Services — Master Document
### Website Content & AI Context | v2.0 | June 2026 | CipherShield

> **"We break your systems before attackers do."**
> Expert API PT · Web App PT · Cloud Security · AI Penetration Testing — certified, transparent, trusted.

---

## 1. Company Identity

| Field | Detail |
|---|---|
| **Company** | Aritaro Cybersecurity Services |
| **Website** | https://Aritaro-umber.vercel.app/ |
| **Category** | Offensive Security / Penetration Testing / Cybersecurity Consulting |
| **Market** | India (primary) · Global (secondary) |
| **Target Clients** | CTOs, CISOs, IT Managers, Founders, Compliance Officers |
| **Model** | B2B — Project-based engagements and retainer contracts |
| **Headquarters** | India |
| **Certifications** | OSCP · CEH · CISSP · AWS Security Specialty · CERT-In Empanelled · ISO 27001 |

**Brand Voice:** Technical but human · Direct and confident, never arrogant · Transparent and educational · Focused on outcomes, not jargon overload · Trusted advisor tone, not vendor tone

**Brand Pillars:**
1. **Expertise** — Certified, battle-tested security professionals
2. **Transparency** — Clear methodology, clear deliverables, no black boxes
3. **Speed** — Actionable findings, fast turnaround
4. **Trust** — Enterprise-grade confidentiality and professionalism

---

## 2. Core Services

### 2.1 API Penetration Testing (API PT)

APIs are the backbone of modern applications — and the #1 attack surface exploited by adversaries. Aritaro's API PT service delivers deep, manual and automated testing of REST, GraphQL, gRPC, and SOAP APIs.

**Why it matters:**
- 83% of web traffic is API traffic (Akamai, 2024)
- OWASP API Security Top 10 covers unique threats not caught by web scanners
- A single broken API endpoint can expose an entire database

**Methodology — 5 Phases:**

| Phase | Focus | Key Activities |
|---|---|---|
| 1 — Recon & Scope | Surface mapping | Endpoint inventory via Swagger/OpenAPI, JS analysis, Burp crawl; auth scheme identification (JWT, OAuth 2.0, API Keys, mTLS); data flow mapping |
| 2 — Auth & Authz | Access control | JWT algorithm confusion (alg:none, RS256→HS256); BOLA/IDOR; BFLA; OAuth 2.0 token leakage, PKCE bypass, implicit flow abuse |
| 3 — Injection & Logic | Exploitation | SQLi, NoSQLi, Command, LDAP injection; GraphQL introspection abuse, batch queries, field suggestion; mass assignment; price manipulation, workflow bypass |
| 4 — Rate Limiting & Abuse | Resilience | Auth endpoint rate limit absence; GraphQL resource exhaustion; account enumeration via timing attacks |
| 5 — Reporting | Deliverables | Executive summary, CVSS 3.1-scored findings, PoC steps, code-level remediation, re-test |

**Standards:** OWASP API Security Top 10 (2023) · PTES · NIST SP 800-115
**Deliverables:** Executive Report + Technical Report + Remediation Tracker (Excel)
**Engagement Types:** Black Box · Grey Box · White Box
**Timeline:** 5–10 business days
**Pricing:** ₹50,000 – ₹2,50,000

---

### 2.2 Web Application Penetration Testing (WAP PT)

Comprehensive security assessment of web applications — from customer-facing portals and SaaS platforms to internal admin dashboards. Manual, logic-aware testing that finds what automated tools miss.

**Why it matters:**
- Web apps remain the #1 entry vector in data breaches (Verizon DBIR 2024)
- Automated scanners miss 40–60% of logic and auth vulnerabilities
- PCI-DSS, ISO 27001, and SOC 2 all require periodic pen tests

**Methodology — 6 Phases:**

| Phase | Focus | Key Activities |
|---|---|---|
| 1 — Information Gathering | Recon | Subdomain enumeration, DNS mapping, tech fingerprinting, JS file analysis for secrets, WAF/CDN detection |
| 2 — Auth & Session | Access control | Password policy, account lockout, MFA bypass, session token entropy, cookie flags, password reset flaws |
| 3 — OWASP Top 10 | Full coverage | A01 Broken Access Control, A02 Crypto Failures, A03 Injection (SQLi, XSS, SSTI, XXE), A05 Misconfiguration, A08 Deserialization, A10 SSRF |
| 4 — Business Logic | Deep manual | Price/quantity manipulation, workflow bypass, IDOR chains, multi-step transaction tampering |
| 5 — Client-Side | Browser security | CSP analysis, Subresource Integrity, Clickjacking, CSRF, open redirects, localStorage exposure |
| 6 — Reporting | Deliverables | CVSS-scored findings, developer remediation guide, compliance mapping |

**Standards:** OWASP Top 10 2021 · OWASP WSTG v4.2 · PTES · NIST SP 800-115
**Deliverables:** Executive Summary + Full Technical Report + Fix Guide
**Timeline:** 5–8 business days
**Pricing:** ₹40,000 – ₹2,00,000

---

### 2.3 Cloud Security Assessment

Cloud misconfigurations cause 80% of cloud security incidents. Aritaro provides an adversarial review of AWS, Azure, and GCP — identifying exposed storage, over-privileged IAM, and attack paths from internet to crown jewels.

**Why it matters:**
- Average data breach costs $4.88M (IBM, 2024)
- Misconfigured S3 buckets exposed 2.3 billion files in 2023 alone
- Cloud-native attack techniques (IAM lateral movement, SSRF to IMDS) are not covered by traditional pen test tools

**Methodology — 5 Phases:**

| Phase | Focus | Key Activities |
|---|---|---|
| 1 — IAM Review | Identity & access | Enumerate users/roles/policies; wildcard permissions; unused credentials; access keys >90 days; cross-account trust chaining |
| 2 — Network & Perimeter | Exposure | VPC config, routing tables; security group rules (0.0.0.0/0); exposed RDS, Elasticsearch, Redis; API Gateway configs |
| 3 — Storage & Data | Data security | S3 ACL and policy review; encryption at rest/in-transit; CloudTrail and VPC Flow Log completeness; secrets in env vars or Git |
| 4 — Compute & Serverless | Runtime security | EC2 IMDSv1 SSRF; Lambda permissions and secrets; ECS/EKS image scanning; Kubernetes RBAC misconfiguration |
| 5 — Attack Path Analysis | Simulation | Realistic attack chains from external exposure to data exfiltration; read-only PoC; blast radius analysis |

**Platforms:** AWS · Microsoft Azure · Google Cloud Platform (GCP)
**Standards:** CIS Benchmarks · CSA CCM · NIST CSF · AWS Well-Architected Framework
**Deliverables:** Cloud Security Report + IAM Risk Matrix + Remediation Runbook
**Timeline:** 7–14 business days
**Pricing:** ₹75,000 – ₹4,00,000

---

### 2.4 AI Penetration Testing (AI PT)

One of very few firms in India offering dedicated AI/LLM security testing. As organisations deploy LLMs, ML models, and AI-powered applications, a new attack surface emerges that traditional security tools cannot address.

**Why it matters:**
- 65% of enterprises have AI in production (2024)
- OWASP LLM Top 10 (2023/2025) — a new and rapidly evolving threat taxonomy
- AI systems can be weaponised to exfiltrate data, bypass guardrails, and generate harmful outputs if not properly secured

**Methodology — 5 Phases:**

| Phase | Focus | Key Activities |
|---|---|---|
| 1 — AI System Recon | Mapping | Model type, hosting, API surface, integration touchpoints; data flow mapping; system prompt and guardrail review |
| 2 — Prompt Injection | Core LLM attacks | Direct prompt injection; indirect prompt injection via RAG/web content; jailbreaking (DAN, role-play, token manipulation); multi-turn context attacks |
| 3 — Data Exfil & Privacy | Leakage testing | Training data extraction (memorisation attacks); PII leakage via prompt crafting; system prompt extraction; RAG knowledge base poisoning |
| 4 — Model & Infrastructure | Backend security | API auth and rate limiting; model inversion attacks; adversarial input robustness; supply chain risks and fine-tuning data integrity |
| 5 — Agent & Tool Use | Agentic AI | LLM agent privilege escalation; autonomous agent loop injection; function calling abuse in GPT/Claude/Gemini applications |

**Standards:** OWASP LLM Top 10 (2025) · MITRE ATLAS · NIST AI RMF · EU AI Act alignment
**Deliverables:** AI Security Report + Threat Model + Remediation Playbook
**Timeline:** 7–15 business days
**Pricing:** ₹1,00,000 – ₹5,00,000

---

## 3. What Every Engagement Includes

- ✅ Scoping call (30–60 min) before any testing begins
- ✅ Rules of Engagement document
- ✅ Executive summary report (non-technical, board-ready)
- ✅ Full technical findings report (CVSS 3.1 scored)
- ✅ Developer-friendly remediation guide with code-level recommendations
- ✅ Compliance mapping (PCI-DSS, ISO 27001, SOC 2, CERT-In as applicable)
- ✅ Post-report debrief call with your engineering team
- ✅ One free re-test for critical and high severity findings
- ✅ 12-month finding retention and tracking

**Engagement Types:**

| Type | Description |
|---|---|
| Black Box | No prior knowledge — real-world attacker simulation |
| Grey Box | Partial knowledge — authenticated user, API docs provided |
| White Box | Full access — source code, architecture diagrams, admin access |
| Red Team | Full adversarial simulation including social engineering and physical |

---

## 4. Pricing & Engagement Models

| Service | Type | Price Range | Timeline |
|---|---|---|---|
| API Penetration Testing | Black/Grey/White Box | ₹50K – ₹2.5L | 5–10 days |
| Web Application PT | OWASP-based | ₹40K – ₹2.0L | 5–8 days |
| Cloud Security Review | AWS/Azure/GCP | ₹75K – ₹4.0L | 7–14 days |
| AI Penetration Testing | LLM/ML Assessment | ₹1.0L – ₹5.0L | 7–15 days |
| API + WAP Bundle | Bundled | ₹80K – ₹4.0L | 8–14 days |
| Monthly Retainer | Ongoing monitoring | ₹30K – ₹1.5L/mo | Ongoing |

*Prices are indicative. All engagements include scoping call, re-test, and debrief. Contact for a custom scoped quote.*

---

## 5. Team Skills & Certifications

### Offensive Security
- OSCP (Offensive Security Certified Professional)
- OSEP (Offensive Security Experienced Penetration Tester)
- OSED (Offensive Security Exploit Developer)
- CEH (Certified Ethical Hacker) — EC-Council
- CompTIA PenTest+
- eJPT (eLearnSecurity Junior Penetration Tester)
- BSCP (Burp Suite Certified Practitioner)

### Cloud Security
- AWS Certified Security – Specialty
- Microsoft SC-200 (Security Operations Analyst)
- Google Professional Cloud Security Engineer (PCSAE)
- CKS (Certified Kubernetes Security Specialist)

### Governance & Compliance
- CISSP (Certified Information Systems Security Professional)
- CISM (Certified Information Security Manager)
- ISO/IEC 27001 Lead Implementer
- CERT-In Empanelled Auditor

### AI Security
- GAISC (GIAC AI Security Fundamentals — emerging)
- Internal AI Red Team certification

### Technical Tools

| Category | Tools |
|---|---|
| Penetration Testing | Burp Suite Pro, Metasploit, Cobalt Strike, Nmap, Nuclei, ffuf, SQLmap, Nikto, OWASP ZAP, Nessus, Qualys, Shodan, Censys, Amass, Subfinder, httpx, Gobuster |
| Cloud Security | ScoutSuite, Prowler, CloudSploit, Pacu, Cloudfox, ROADtools, GCPBucketBrute, Cartography |
| AI Security | Garak, PromptBench, PrivacyMeter, Counterfit (Microsoft), LLM-Fuzzer, custom prompt injection frameworks |
| Languages | Python, Bash, JavaScript/Node.js, Go, PowerShell, Ruby |
| Platforms | Docker, Kubernetes, Terraform, AWS CDK, GitHub Actions, Burp Suite Extensions, Frida |

---

## 6. Compliance & Standards Expertise

| Framework | Applicable To |
|---|---|
| OWASP Top 10 (2021) | Web Application PT |
| OWASP API Security Top 10 | API Penetration Testing |
| OWASP LLM Top 10 (2025) | AI Penetration Testing |
| PTES | All PT engagements |
| NIST SP 800-115 | All PT engagements |
| NIST Cybersecurity Framework | Cloud + organisational risk |
| NIST AI RMF | AI security assessments |
| ISO/IEC 27001 | Compliance-driven assessments |
| PCI-DSS v4.0 | E-commerce and payment platforms |
| SOC 2 Type II | SaaS and cloud clients |
| HIPAA | Healthcare sector clients |
| CIS Benchmarks | Cloud security baselines |
| CSA CCM | Cloud Security Assessment |
| MITRE ATT&CK | Threat modelling and red team mapping |
| MITRE ATLAS | AI adversarial threat modelling |
| CERT-In Guidelines | India-specific compliance |
| DPDP Act 2023 | Indian data protection law |
| GDPR | European client data handling |
| EU AI Act | AI system compliance readiness |

---

## 7. Target Industries & Client Profiles

| Industry | Key Clients | Compliance Drivers | Primary Risks |
|---|---|---|---|
| FinTech & Banking | Payment gateways, neo-banks, lending platforms | PCI-DSS, RBI, ISO 27001 | API exposure of financial data, fraudulent transaction logic |
| Healthcare & MedTech | Hospital portals, telehealth, medical device APIs | HIPAA, DPDP Act, CERT-In | Patient data exfiltration, DICOM API exposure |
| SaaS & Cloud-Native | B2B SaaS, developer tools, HR/ERP | SOC 2, ISO 27001 | Tenant isolation failure, IAM privilege escalation |
| E-Commerce & Retail | Marketplaces, D2C brands, logistics | PCI-DSS, DPDP Act | Price manipulation, account takeover, payment bypass |
| Government & PSUs | Digital India, citizen portals | CERT-In empanelment, MEITY | Data exposure, DDoS resilience, supply chain |
| EdTech & Media | LMS platforms, content platforms | DPDP Act | User data harvesting, subscription bypass |

**Buyer Personas:**
- **Primary:** CTO / VP Engineering — technical decision maker
- **Secondary:** CISO / Head of InfoSec — security mandate holder
- **Tertiary:** Founder / CEO — compliance-driven or incident-triggered
- **Champion:** Senior Developer / DevSecOps Lead — internal advocate

---

## 8. Competitive Positioning

**Global competitors:** Bishop Fox · NCC Group · Cobalt · Synack · HackerOne · Bugcrowd · Rapid7

**India competitors:** NotSoSecure India · Sequretek · Cyberops Infosec · Redinent Innovations · Suma Soft · Kratikal · SISA Information Security

**Aritaro's differentiation:**

| Differentiator | Detail |
|---|---|
| AI-Native PT Practice | Dedicated AI/LLM penetration testing — rare in India as of 2025–2026 |
| Transparent Methodology | Open methodology documents, no black-box magic |
| Developer-Friendly Reporting | Findings come with code-level fix guidance, not just vulnerability lists |
| Speed + Depth | Faster than big firms, deeper than small ones |
| India-Specific Compliance | DPDP Act, CERT-In, RBI, MEITY expertise built in |
| Modern Attack Simulation | Real adversary TTPs, not just scanner output |

---

## 9. Website Improvement Scorecard

| Element | Score | Status |
|---|---|---|
| Hero & Value Proposition | 6/10 | Needs Work |
| Service Pages | 4/10 | Needs Work |
| Trust Signals & Certifications | 3/10 | **Missing** |
| Team & About Us | 2/10 | **Missing** |
| Case Studies & Reports | 2/10 | **Missing** |
| Testimonials & Client Logos | 5/10 | Needs Work |
| Blog / Threat Intelligence | 1/10 | **Missing** |
| Contact & Lead Capture | 5/10 | Needs Work |
| Pricing / Engagement Info | 3/10 | Needs Work |
| Mobile Responsiveness & UX | 6/10 | Good |
| SEO & Meta Information | 4/10 | Needs Work |
| Legal / Compliance Pages | 2/10 | **Missing** |

---

## 10. 15 Prioritised Recommendations

### 🔴 High Priority

**R01 — Dedicated Service Pages**
Individual pages for API PT, WAP PT, Cloud Security, and AI PT — each with methodology table, scope, deliverables, 5–7 FAQs, and a service-specific CTA.

**R02 — Revamp Hero Section**
Sharp tagline with all four services visible above the fold, dual CTAs ('Book Free Assessment' + 'Download Sample Report'), animated stat bar, inline trust icons (CEH · OSCP · ISO 27001 · CERT-In).

**R03 — Team & About Us Page**
Founder + team profiles with photos, certifications, and bios. Company origin story. Number of assessments completed, CVEs reported. Short video or team photo for authenticity.

**R04 — Publish Case Studies**
3–5 anonymised client success stories with industry, challenge, methodology used, findings count, and measurable outcome. Prioritise FinTech, Healthcare, SaaS.

**R05 — Gated Sample Report PDF**
Redacted penetration test report downloadable behind an email capture form — the highest-converting lead magnet for any pen test firm. Gate it on each service page and the hero CTA.

**R06 — Certification Badge Row**
CEH, OSCP, CERT-In, ISO 27001, OWASP badge strip pinned immediately below the hero. Industry standard for pen test sites and builds instant enterprise trust.

### 🟡 Medium Priority

**R07 — Indicative Pricing Section**
Show engagement tiers and ranges with a 'Get Custom Quote' CTA. Pricing transparency dramatically increases qualified inbound leads without committing to fixed rates.

**R08 — Blog / Threat Intelligence Hub**
2 security articles/month, quarterly research report ('State of AI Security'), CVE advisories when major vulnerabilities drop. Builds SEO authority and establishes Aritaro alongside Bishop Fox and NCC Group.

**R09 — SEO Optimisation**
Target 'API penetration testing India' and related terms. Add JSON-LD schema (Services, Organisation, FAQPage). Location pages for Delhi, Mumbai, Bangalore, Hyderabad, Pune. Page speed <2.5s. Google Search Console submission.

**R10 — WhatsApp Chat Widget**
Critical for Indian B2B market — instant engagement without form friction. Converts significantly better than contact forms for initial qualification.

**R11 — Free Security Assessment Landing Page**
Dedicated /free-audit page with a 5-field form offering a complimentary 30-minute scoping call. Single highest-converting offer in cybersecurity B2B.

**R12 — Legal Pages**
Privacy Policy (DPDP Act + GDPR), Terms of Service (scope, liability, IP), Responsible Disclosure Policy, Cookie Consent banner. Enterprise clients check for these before signing NDAs.

### ⚪ Low Priority

**R13 — Client Logo Bar** — Industry sectors or anonymised client logos. Even 'FinTech · Healthcare · SaaS · E-Commerce' icons build category credibility.

**R14 — Newsletter / Threat Digest** — Monthly curated threat intelligence newsletter. Builds a long-term lead nurturing database at zero ongoing cost.

**R15 — Structured FAQ Section** — 10 most common pre-sales questions on each service page. Reduces pre-sales call length.

---

## 11. 10-Week Implementation Roadmap

| Phase | Timeline | Key Actions | Priority |
|---|---|---|---|
| **Phase 1** | Week 1–2 | Hero revamp, certification badge row, dual CTAs, WhatsApp widget, mobile UX fixes | 🔴 High |
| **Phase 2** | Week 3–4 | 4 dedicated service pages (API PT, WAP PT, Cloud, AI PT) | 🔴 High |
| **Phase 3** | Week 5–6 | About Us + team page, 2–3 case studies, sample report PDF upload | 🔴 High |
| **Phase 4** | Week 7–8 | SEO meta tags, JSON-LD schema, page speed optimisation, Google Search Console | 🟡 Medium |
| **Phase 5** | Week 9–10 | Pricing page, /free-audit landing page, legal pages, newsletter signup | 🟡 Medium |
| **Phase 6** | Ongoing | Blog 2x/month, CVE advisories on major drops, quarterly research report | ⚪ Ongoing |

---

## 12. Proposed Website Sitemap

```
/                        Homepage
/services/api-pt         API Penetration Testing
/services/wap-pt         Web Application PT
/services/cloud          Cloud Security Assessment
/services/ai-pt          AI Penetration Testing
/about                   Company story, team, certifications
/case-studies            Anonymised client engagements by industry
/blog                    Security articles, CVE advisories, research reports
/pricing                 Engagement tiers and indicative ranges
/free-audit              Free assessment CTA landing page
/resources               Sample report, checklists, whitepapers (gated)
/contact                 Form, phone, email, WhatsApp, office address
/legal/privacy           Privacy Policy (DPDP Act + GDPR)
/legal/terms             Terms of Service
/legal/disclosure        Responsible Disclosure Policy
```

---

## 13. SEO Keyword Strategy

**Primary keywords (high intent):**
`api penetration testing india` · `web application penetration testing` · `cloud security assessment india` · `ai security testing india` · `llm penetration testing` · `vapt services india` · `cybersecurity audit india` · `penetration testing company india`

**Long-tail keywords:**
`api security testing for fintech india` · `owasp api security top 10 testing` · `aws cloud security audit india` · `llm prompt injection testing service` · `web app vapt for startups india` · `iso 27001 penetration testing` · `pci dss pen test india` · `responsible disclosure policy template india`

**Location pages to create:**
- Penetration Testing Services in Delhi
- Penetration Testing Services in Mumbai
- Penetration Testing Services in Bangalore
- Penetration Testing Services in Hyderabad
- Penetration Testing Services in Pune

**Blog content calendar (SEO + authority):**
1. OWASP API Security Top 10 — 2023 Deep Dive
2. How to Perform a Cloud IAM Audit on AWS
3. LLM Prompt Injection: Attack Techniques and Defences
4. JWT Security: Common Vulnerabilities and How to Fix Them
5. India's DPDP Act and What It Means for Your Security Posture
6. GraphQL Security Testing Checklist
7. How to Choose a Penetration Testing Company in India
8. BOLA vs BFLA — Understanding API Authorisation Attacks
9. Top 5 Misconfigurations Found in AWS Environments
10. AI Red Teaming: A Practitioner's Introduction

---

## 14. AI Assistant Instructions (Aria)

**Persona:** Aria — Aritaro's AI Security Assistant. Professional, helpful, technically knowledgeable, never arrogant.

**Purpose:** Help website visitors understand services, answer questions, and book consultations.

**Can do:**
- ✅ Explain any of the 4 service lines in plain English
- ✅ Help visitors understand which service is right for their situation
- ✅ Describe engagement process, timelines, and deliverables
- ✅ Explain compliance frameworks (OWASP, ISO, PCI-DSS, CERT-In, DPDP)
- ✅ Provide indicative pricing ranges
- ✅ Help schedule a free scoping call
- ✅ Answer FAQs about penetration testing engagements
- ✅ Discuss cybersecurity best practices

**Must not do:**
- ✗ Provide specific exploit code or attack instructions
- ✗ Discuss competitor weaknesses or make comparative claims
- ✗ Guarantee finding or not finding vulnerabilities
- ✗ Commit to exact pricing (always say "get a custom quote")
- ✗ Discuss any client names or confidential engagement details
- ✗ Give legal advice

**Lead qualification flow:**
1. What type of system are you looking to test? (API / Web App / Cloud / AI)
2. What is the primary compliance driver? (ISO, PCI, SOC 2, internal requirement)
3. What is your timeline?
4. What is the rough size/complexity of the application?

→ Based on answers, recommend a service and offer to connect with the team.

---

## 15. Proof Points

| Metric | Value | Note |
|---|---|---|
| Vulnerabilities identified | 500+ | Replace with real number |
| Applications secured | 50+ | Replace with real number |
| CVEs responsibly disclosed | 15+ | List on /resources page |
| Average critical vulns per API PT | 12 | Replace with real number |
| Client re-engagement rate | 98% | Replace with real number |
| Client satisfaction score | 4.9/5 | Replace with real number |
| Time from sign-off to engagement start | 72hrs | Replace with real number |
| Reports delivered on/before deadline | 100% | Replace with real number |

---

## 16. Legal & Responsible Disclosure

**Mandatory legal pages:**

| Page | Compliance Scope |
|---|---|
| Privacy Policy | DPDP Act (India) + GDPR |
| Terms of Service | Engagement scope, liability cap, IP ownership |
| Responsible Disclosure Policy | How Aritaro handles discovered third-party vulnerabilities |
| Cookie Consent Banner | EU visitors + increasingly expected by Indian enterprises |

**Responsible disclosure process:**
1. Vulnerability discovered in third-party system → notify vendor privately
2. 90-day disclosure window before public release
3. CVE assignment coordinated through MITRE or relevant CNA
4. Credit given to the discovering researcher where applicable
5. Full advisory published on /resources after patch is available

---

*Aritaro Master Document v2.0 — Prepared by CipherShield Strategy Team — June 2026*
*© 2026 CipherShield / Aritaro. All Rights Reserved. Confidential.*