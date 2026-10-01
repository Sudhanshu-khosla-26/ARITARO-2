# Aritaro Cybersecurity — Vendor Inventory & Data Protection Agreements (DPA)
**Document ID:** VEND-REG-001  
**Version:** 1.0 | **Effective Date:** September 2026 | **Review Cycle:** Semi-Annual  

---

## 1. Third-Party Vendor Register

The table below catalogs all external infrastructure, platform, and service vendors processing or hosting personal data, communications, or source code for Aritaro.

| Vendor | Service Provided | Personal Data Handled | Hosting Region | DPA Status | Certifications & Security Controls | Action / Next Review |
|---|---|---|---|---|---|---|
| **Amazon Web Services (AWS)** | Cloud infrastructure, encrypted object storage (S3), secure backups | Customer reports, database snapshots, audit archives | `ap-south-1` (Mumbai, India) | **Signed & Active** (AWS GDPR & India DPA addendum) | SOC 1/2/3, ISO 27001, PCI-DSS Level 1, KMS AES-256 | Annual security review (Q1 2027) |
| **Vercel Inc.** | Frontend edge hosting, serverless edge middleware, build pipeline | Request IP addresses, HTTP headers, transient session tokens | Global Edge / Mumbai Edge Node | **Signed & Active** (Standard Vercel DPA with SCCs) | SOC 2 Type II, ISO 27001, automated DDoS mitigation | Review quarterly; verify edge caching policies |
| **Hostinger** | Primary DNS management, domain registration, mail exchange routing | Email routing metadata, DNS records, public web routing | India / Singapore Datacenters | **Standard Terms Enforced** | ISO 27001, 2FA on admin panel, DNSSEC enabled | Request custom enterprise DPA counter-signature |
| **WhatsApp (Meta Business API)** | Direct customer chat widget, instant inquiry routing | User Phone Number, Name, Chat messages & technical queries | Global / Meta End-to-End Encrypted | **Active Business Terms** (WhatsApp Business Data Terms) | E2E Encryption for transit, 2FA enabled on business manager | Review access permissions for support personnel |
| **MongoDB Atlas** | Managed production database cluster (Users, Requests, Audits) | Name, Email, Phone, Company, Scoping Messages, Passwords (bcrypt) | `ap-south-1` (AWS Mumbai) | **Signed & Active** (MongoDB Data Processing Agreement) | SOC 2 Type II, ISO 27001, HIPAA compliant, TLS 1.3, KMS | Monthly backup audit; quarterly access rotation |
| **Cloudinary** | Secure media delivery, PDF report generation storage | User avatars, proof-of-concept screenshots, report attachments | Multi-Region CDN with signed tokens | **Standard DPA Active** | SOC 2 Type II, ISO 27001, expiring signed URLs | Enforce private delivery type on all upload presets |
| **Nodemailer / SMTP Provider** | Transactional email dispatch for contact requests and notifications | Sender Name, Email, Phone, Inquiry Subject, Message Body | India / Global SMTP Gateway | **Standard Security Addendum** | TLS 1.3 enforced for SMTP relay, SPF/DKIM/DMARC active | Rotate SMTP application credentials every 90 days |

---

## 2. Mandatory Vendor Security Requirements
Before onboarding any new vendor or tool that touches client or employee personal data, the following criteria must be satisfied:
1. **Data Processing Agreement (DPA):** Must include standard contractual clauses (SCCs) guaranteeing confidentiality, non-monetization, and breach notification within 24 hours.
2. **Encryption:** Enforce TLS 1.3 in transit and AES-256 at rest.
3. **Data Localization:** Ensure sensitive client telemetry resides within India where required by regulatory mandates (CERT-In / RBI guidelines).
4. **Subprocessor Restriction:** Vendor must not engage fourth-party processors without prior written notice.
