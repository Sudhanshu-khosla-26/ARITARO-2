# Aritaro Cybersecurity — Data Inventory (ROPA)
**Record of Processing Activities**  
**Compliance Standard:** DPDPA 2023 (Section 8) & GDPR (Article 30)  
**Maintained By:** Data Protection Officer (`privacy@aritaro.com`)  

---

| Data Field / Type | Category | Purpose of Collection | Lawful Basis | Where It Is Stored | Who Owns / Accesses It | Retention Limit |
|---|---|---|---|---|---|---|
| **Full Name** | Contact / Identity | Communication, quote proposals, formal engagement agreements | Legitimate Interest & Contractual Necessity | MongoDB Atlas (`users`, `contactrequests`, `servicerequests`) | Sales & Operations Team | 2 Years from last contact |
| **Email Address** | Contact / Auth | Account login, report delivery, scoping notifications | Contractual Necessity & Consent | MongoDB Atlas (`users.email`, `contactrequests.email`) | Engineering & Support Team | Duration of account + 1 year |
| **Phone Number** | Contact / Verification | Immediate urgent consultation, identity verification, MFA alerts | Consent & Legitimate Interest | MongoDB Atlas (`contactrequests.phone`, `servicerequests.contact_phone`) | Client Relationship Manager | 2 Years from submission |
| **Message & Project Scope** | Operational | Scoping penetration testing, vulnerability context, timeline alignment | Contractual Pre-Step | MongoDB Atlas (`contactrequests.message`, `servicerequests.scope_description`) | Lead Penetration Tester & CISO | 30 Days post re-test for raw; 3 Years for report |
| **Password (Hashed)** | Security Credential | Secure authentication to Client & Admin dashboards | Contractual Necessity | MongoDB Atlas (`users.password` via Bcrypt salt=12) | System Only (Never accessible in plain text) | Active account lifetime |
| **Target Host IP / URL** | Technical Engagement | Scoping boundaries for authorized pentest execution | Contractual Mandate & Explicit Authorization | MongoDB Atlas (`servicerequests.target_environment`) | Assigned Security Consultants | 30 Days post re-test |
| **IP Address & User Agent** | Technical / Security | Rate limiting, intrusion prevention, CERT-In compliance logging | Legal Obligation & Legitimate Interest | MongoDB Atlas (`auditlogs`) & Vercel runtime logs | Security Operations Center (SOC) | 180 Days (CERT-In mandate) |
| **Session Cookie Token** | Operational / Auth | Maintaining authenticated session state securely | Legitimate Interest (Strictly Necessary) | Browser Local Storage / HttpOnly Secure Cookie | Client Browser / Auth Middleware | 30 Days (JWT expiry) |
| **Resume & Portfolio** | HR / Recruitment | Evaluating candidates for cybersecurity engineering roles | Consent of Applicant | MongoDB Atlas (`jobapplications`) | HR & Hiring Managers | 12 Months |
