# Aritaro Cybersecurity — Data Flow Map & Asset Inventory
**Document ID:** MAP-AST-003  
**Effective Date:** September 2026 | **Classification:** Confidential / Architecture  

---

## 1. End-to-End Data Flow Map

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DATA INGESTION CHANNELS                         │
├────────────────────────────────────────────────────────────────────────┤
│  1. Website Contact Form (/contact)                                    │
│     → Name, Email, Phone, Company, Subject, Message                    │
│  2. Assessment Request Wizard (/request-assessment)                    │
│     → Contact Name, Email, Phone, Scope, Target IPs/URLs, Deadline     │
│  3. WhatsApp Quick Chat Widget                                         │
│     → Phone Number, Name, Instant Messaging Thread                     │
│  4. User Registration & Client Portal Login (/signup, /login)          │
│     → Email, Password (hashed), Company, Session JWT                   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼ [TLS 1.3 Encryption in Transit]
┌────────────────────────────────────────────────────────────────────────┐
│                   TRANSIT, SANITIZATION & APPLICATION                  │
├────────────────────────────────────────────────────────────────────────┤
│  • Edge Middleware & Next.js Serverless Runtime (Vercel)               │
│  • Rate Limiting Check (In-Memory IP & Account Throttling)             │
│  • Input Sanitization (HTML Entity Encoding, XSS Prevention)           │
│  • Nodemailer SMTP Relay (TLS-encrypted notification to Admin)         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼ [AES-256 Storage Encryption]
┌────────────────────────────────────────────────────────────────────────┐
│                        PRIMARY PERSISTENT STORAGE                      │
├────────────────────────────────────────────────────────────────────────┤
│  • MongoDB Atlas (AWS Mumbai ap-south-1)                                │
│    - Collections: contactrequests, servicerequests, users, auditlogs   │
│  • AWS S3 / Cloudinary                                                 │
│    - Encrypted Bucket: Executive pentest report PDFs, verified scopes  │
│  • Admin Corporate Mailbox (info@aritaro.in)                           │
│    - Inbound lead alerts, scheduling correspondence                    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼ [Role-Based Access Control]
┌────────────────────────────────────────────────────────────────────────┐
│                          WHO CAN VIEW THE DATA                         │
├────────────────────────────────────────────────────────────────────────┤
│  • Super Admin / Admin: Full read/write for scoping and responses      │
│  • Lead Security Engineer: Scoping and technical validation only       │
│  • Client User: Only their own submitted requests & delivered reports  │
│  • Public / External: ZERO access                                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼ [Automated & Manual Purge]
┌────────────────────────────────────────────────────────────────────────┐
│                          WHEN DATA IS DELETED                          │
├────────────────────────────────────────────────────────────────────────┤
│  • Contact Leads & Messages: Permanently purged after 2 Years          │
│  • Pentest Scoping & PoCs: Purged 30 Days post re-test                 │
│  • Audit Reports: Retained 3 Years for compliance, then deleted        │
│  • Audit Logs: Auto-expired after 180 Days (CERT-In mandate)           │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. IT Asset Inventory (Systems Touching Personal Data)

| Asset ID | System / Asset Name | Component / Tech Stack | Location / Provider | Personal Data Processed | Security Controls Enforced | Owner |
|---|---|---|---|---|---|---|
| **AST-01** | **Aritaro Web Application** | Next.js 16 (App Router), React 19, Tailwind | Vercel Edge Global / Mumbai | Transient IP addresses, search params, form inputs | CSP, HSTS, X-Content-Type-Options, Rate limiting | Lead Dev |
| **AST-02** | **Production Database** | MongoDB Atlas Cluster (M10, replica set) | AWS `ap-south-1` (Mumbai) | Names, emails, phone numbers, bcrypt passwords, scopes | AES-256 at rest, TLS 1.3, IP whitelist, VPC peering | DevOps Lead |
| **AST-03** | **Cloud Report Storage** | AWS S3 Bucket / Cloudinary Media Vault | AWS `ap-south-1` | Customer pentest reports, vulnerability findings, attachments | SSE-KMS encryption, private buckets, presigned expiring URLs | Lead Architect |
| **AST-04** | **Corporate Mail Gateway** | Hostinger Mail / Nodemailer Relay | Hostinger Enterprise Mail | Contact inquiries, lead notifications, scoping debriefs | SPF, DKIM, DMARC enforced, TLS SMTP, 2FA required | IT Admin |
| **AST-05** | **WhatsApp Business Channel** | WhatsApp Business API (Meta) | Meta Cloud / E2E Encrypted | Client phone numbers, inquiry chat logs | End-to-End Encryption, 2FA on Meta Business Manager | Support Lead |
| **AST-06** | **Engineer Workstations** | macOS / Windows 11 Enterprise Laptops | Company Premises / Remote | Codebase, client communications, temporary scopes | BitLocker/FileVault 256-bit, mandatory EDR, screen lock 5m | All Staff |
