# Aritaro Cybersecurity — Corrective & Preventive Actions (CAPA) Tracker
**Document ID:** CAPA-TRACK-2026  
**Review Cadence:** Weekly Security Review | **Owner:** Chief Information Security Officer & Engineering Leads  

---

## 1. Security & Compliance CAPA Action Matrix

| CAPA ID | Vulnerability / Issue Identified | Severity / Urgency | Corrective Action Taken | Preventive Control Implemented | Assigned Owner | Target Due Date | Status |
|---|---|---|---|---|---|---|---|
| **CAPA-01** | **Reflected XSS & Open Redirect** on `/login?redirect=...` | **HIGH** (Priority 1) | Implemented strict relative URI parser in `login/page.js` rejecting protocol-relative (`//`), backslash (`/\`), and pseudo-protocols (`javascript:`). | Global CSP header in `next.config.mjs` preventing inline script injection. | Security Eng | Immediate (2026-09-08) | **CLOSED / DONE** |
| **CAPA-02** | **Missing Security Headers** (CSP, HSTS, X-Content-Type, X-Frame) | **MEDIUM** (Priority 2) | Configured Next.js server headers in `next.config.mjs` and attached headers in `src/middleware.js`. | Automated header checks on staging/production build CI. | DevOps Lead | Immediate (2026-09-08) | **CLOSED / DONE** |
| **CAPA-03** | **Weak Cookie Settings** on Auth Session Tokens | **MEDIUM** (Priority 2) | Explicitly enabled `Secure`, `HttpOnly`, `SameSite: "lax"`, and prefixed cookie names (`__Secure-`, `__Host-`) in `src/lib/auth.js`. | NextAuth session configuration pinned to HTTPS in production. | Backend Eng | Immediate (2026-09-08) | **CLOSED / DONE** |
| **CAPA-04** | **No Login Rate Limiting** (Brute-force credential stuffing risk) | **MEDIUM** (Priority 2) | Integrated IP & email based in-memory rate limiter (10 attempts/min in `src/middleware.js`; 5 attempts/15min in `auth.js`). | 429 Too Many Requests response with `Retry-After` header. Upgrade to Redis planned for high-load clusters. | Backend Eng | Immediate (2026-09-08) | **CLOSED / DONE** |
| **CAPA-05** | **Error Messages Too Detailed** (Account enumeration & DB leak) | **LOW** (Priority 3) | Replaced `"No account found"` and `"Incorrect password"` with unified `"Invalid email or password"`. Suppressed raw database exception messages. | Server-side `console.error` only; sanitized client JSON responses. | Backend Eng | Immediate (2026-09-08) | **CLOSED / DONE** |
| **CAPA-06** | **Privacy Policy Missing Fields** (Phone and Message not disclosed) | **URGENT** (Compliance) | Updated `PrivacyClient.js` with explicit disclosures for Phone Numbers, Inquiry Messages, DPDPA 2023 rights, and 2-year retention. | Form update review checklist whenever new form fields are added to UI. | DPO / Legal | Immediate (2026-09-08) | **CLOSED / DONE** |
| **CAPA-07** | **Excel / CSV Customer Data Security** (Unencrypted local exports) | **URGENT** (Data Gov) | Created `docs/compliance/CSV_EXCEL_DATA_SECURITY_SOP.md` mandating AES-256 / 7-Zip password encryption, zero local storage, and 24-hour file purge. | Weekly Friday clean-desk & local drive download cleanup verification. | Operations Lead | Immediate (2026-09-08) | **CLOSED / DONE** |
| **CAPA-08** | **Data Breach Response Plan** (No written incident playbook) | **URGENT** (Compliance) | Drafted `docs/compliance/DATA_BREACH_RESPONSE_PLAN.md` with CERT-In 6-hour reporting mandate, IRT roles, containment steps, and templates. | Annual tabletop incident simulation exercise. | CISO / Incident Cmd | Immediate (2026-09-08) | **CLOSED / DONE** |
| **CAPA-09** | **Vendor Inventory & DPA Contracts** (AWS, Vercel, Hostinger, WhatsApp) | **URGENT** (Vendor Risk) | Created `docs/compliance/VENDOR_INVENTORY_AND_DPA.md` tracking hosting regions, data types, DPA statuses, and SOC 2 / ISO 27001 certs. | Mandatory vendor onboarding security review before new SaaS integration. | Procurement / Legal | 2026-09-15 | **IN PROGRESS** (Hostinger custom DPA counter-signature) |
| **CAPA-10** | **Data Retention & Disposal Schedule** (Undefined data lifetimes) | **URGENT** (Data Gov) | Created `docs/compliance/DATA_RETENTION_AND_DISPOSAL_POLICY.md` establishing 2-year lead retention, 30-day telemetry purge, and 180-day log policy. | Implementation of automated MongoDB TTL index scripts for scheduled purges. | Database Admin | 2026-09-22 | **IN PROGRESS** |
| **CAPA-11** | **Data Map & Asset Register** | **IMPORTANT** (Asset Gov) | Published `docs/compliance/DATA_FLOW_MAP_AND_ASSETS.md` mapping data ingestion, transit, persistent storage, and access levels. | Quarterly asset inventory audit. | DevOps Lead | Immediate (2026-09-08) | **CLOSED / DONE** |
| **CAPA-12** | **Data Subject Request (DSAR) Process** | **IMPORTANT** (Privacy) | Published `docs/compliance/DATA_SUBJECT_REQUESTS_DSAR_PROCESS.md` with 5-step SOP, verification checks, and official tracking register. | Verification of privacy inbox `privacy@aritaro.com` ticketing integration. | Privacy Lead | Immediate (2026-09-08) | **CLOSED / DONE** |
| **CAPA-13** | **Periodic Live WAPT Retesting** | **STRATEGIC** (Ongoing) | Established mandate for external third-party penetration testing every 6–12 months or post major releases. Scope, evidence, and re-test logs tracked. | Continuous vulnerability scanning on staging deployments. | Security Team | 2026-10-15 | **SCHEDULED** |

---

## 2. Review Protocol
- **Weekly Review Meeting:** Every Monday 10:00 IST.
- **Closure Criteria:** An item is marked **CLOSED** only after code verification, configuration validation, and DPO/CISO sign-off.
