# Aritaro Cybersecurity — Data Retention & Disposal Schedule
**Document ID:** POL-RET-002  
**Effective Date:** September 2026 | **Review Cycle:** Annual | **Classification:** Internal Policy  

---

## 1. Retention Matrix

| Data Category | Specific Data Elements | Primary Storage Location | Retention Limit | Disposal / Purge Mechanism | Authorized Approver |
|---|---|---|---|---|---|
| **Website Leads & Inquiries** | Name, Email, Phone, Company, Inquiry Message | MongoDB Atlas (`contactrequests` collection) | **2 Years** from date of submission or last active communication | Automated MongoDB TTL index / scheduled script deletion | Operations Lead |
| **Assessment Scoping Data** | Contact Name, Phone, Email, Target Architecture, Scope Details | MongoDB Atlas (`servicerequests` collection) | **3 Years** following conclusion of Statement of Work (SoW) | Cryptographic delete; soft-delete flag converted to hard drop | Principal Consultant |
| **Pentest Telemetry & Exploits** | Vulnerability proof-of-concepts, raw scanner outputs, exploits | Encrypted Local Vault / S3 scratch bucket | **30 Days** after final re-test verification | DoD 5220.22-M 3-pass overwrite or secure key erasure | Lead Penetration Tester |
| **Final Executive Audit Reports** | Redacted PDF findings report, remediation recommendations | AWS S3 Bucket (SSE-KMS encrypted) | **3 Years** (supporting regulatory and insurance audits) | Secure object expiration rule in S3 bucket policy | Chief Information Security Officer (CISO) |
| **Client Portal User Accounts** | Name, Work Email, Bcrypt password hash, Role | MongoDB Atlas (`users` collection) | Duration of active contract + **1 Year** post-termination | Account deactivation immediately; permanent purge after 1 year | Admin / Super Admin |
| **System & Security Logs** | IP address, timestamp, requested URI, user agent, action taken | MongoDB Atlas (`auditlogs`) & Vercel Log Streams | **180 Days (6 Months)** mandatory under CERT-In Directions 2022 | Auto-pruned via 180-day TTL index in MongoDB | DevOps Lead |
| **Recruitment & Job Applications** | Candidate Name, Email, Phone, Resume PDF, Portfolio link | MongoDB Atlas (`jobapplications` collection) | **12 Months** from application date | Permanent deletion from database and cloud storage | HR / Talent Lead |

---

## 2. Secure Disposal Standards
When data reaches the end of its designated retention period, it must be rendered completely unrecoverable:
1. **Electronic Data in Database:** Executed via physical database `deleteMany` operations; database compact runs to reclaim blocks.
2. **Cloud Storage Objects:** Expired via lifecycle rules with zero-day version retention and permanent multi-part purge.
3. **Local Endpoints:** Overwritten using certified data sanitization tools complying with NIST SP 800-88 Revision 1 (Guidelines for Media Sanitization).
4. **Physical Media / Notes:** Cross-cut shredding (DIN 66399 Level P-4 or higher).
