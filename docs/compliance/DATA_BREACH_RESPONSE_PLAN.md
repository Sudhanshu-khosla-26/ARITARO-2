# Aritaro Cybersecurity — Data Breach Response Plan
**Document ID:** SEC-IRP-001  
**Version:** 1.0 | **Effective Date:** September 2026 | **Classification:** Confidential / Internal  
**Compliance Mandate:** Indian IT Act 2000, CERT-In Directions (April 2022), Digital Personal Data Protection Act (DPDPA 2023), GDPR Art. 33/34  

---

## 1. Objective & Scope
This plan defines the step-by-step protocol for identifying, containing, investigating, and reporting any suspected or confirmed unauthorized access, disclosure, alteration, or loss of client personal data, credentials, or security assessment telemetry.

---

## 2. Incident Response Team (IRT) — Roles & Responsibilities

| Role | Primary Lead | Responsibilities |
|---|---|---|
| **Incident Commander (IC)** | Lead Security Officer (`security@aritaro.com`) | Coordinates overall response, authorizes containment actions, decides escalation. |
| **Technical Lead** | Senior DevOps / Systems Engineer | Conducts log forensics, isolates affected systems, implements code/infra patches. |
| **Legal & Privacy Officer** | Data Protection Officer (`privacy@aritaro.com`) | Assesses statutory notification requirements (CERT-In, DPBI), handles regulatory filings. |
| **Communications Lead** | Operations Lead (`info@aritaro.in`) | Manages client notifications, executive briefings, and public disclosures (if required). |

---

## 3. Four-Phase Action Plan

```
[Phase 1: Detection & Triage] 
         │ (Within 1 Hour)
         ▼
[Phase 2: Containment & Eradication]
         │ (Immediate - Under 2 Hours)
         ▼
[Phase 3: Statutory & Client Notification]
         │ (CERT-In: ≤6 Hours | Clients: ≤24 Hours)
         ▼
[Phase 4: Forensics, Recovery & Post-Mortem]
```

### Phase 1: Detection & Triage (Hour 0 – 1)
1. **Report Ingestion:** Any employee, monitoring alert, or client noticing suspicious telemetry must immediately report to `security@aritaro.com`.
2. **Classification:**
   - **Severity 1 (Critical):** Unauthorized access to production MongoDB Atlas, client pentest findings, or bulk credentials.
   - **Severity 2 (High):** Compromised single admin account, API token leak, or unauthorized modification of records.
   - **Severity 3 (Medium/Low):** Scans, blocked intrusion attempts, or single phishing email with no credential submission.

### Phase 2: Containment & Eradication (Hour 1 – 3)
1. **Isolate:** Revoke active JWT sessions, rotate `NEXTAUTH_SECRET`, database connection credentials, and API access tokens immediately.
2. **Sever Connections:** Terminate suspicious active database connections via MongoDB Atlas dashboard; temporarily route traffic through WAF block if ongoing attack.
3. **Preserve Evidence:** Freeze server logs, S3 bucket logs, CloudTrail, and Git commit histories. Take forensic snapshots before restarting containers.
4. **Patch & Rebuild:** Identify root-cause vulnerability (e.g., credential replay, unpatched dependency, injection) and push emergency hotfix.

### Phase 3: Mandatory Statutory & Client Notifications
*Aritaro adheres strictly to legal timelines:*

1. **CERT-In (Indian Computer Emergency Response Team):**
   - **Mandatory Deadline:** **Within 6 hours** of noticing/becoming aware of cybersecurity incident.
   - **How:** Report to `incident@cert-in.org.in` or via official CERT-In Incident Reporting Portal using statutory Form.
   - **Scope:** Unauthorized access to IT systems, data breaches, ransomware, server attacks.
2. **Affected Enterprise Clients:**
   - **Deadline:** Within **24 hours** of breach confirmation.
   - **Message Format:** Nature of breach, categories of data affected, containment actions taken, recommended mitigation steps for the client, designated Aritaro liaison contact.
3. **Data Protection Board of India (DPBI) & Data Principals:**
   - Report personal data breaches as prescribed under DPDPA Section 8(6) without undue delay.

### Phase 4: Recovery & Post-Mortem (Days 1 – 7)
1. **Integrity Verification:** Validate database backups, re-verify hash sums of code and configurations.
2. **CAPA Logging:** Document incident in the CAPA Tracker (`docs/compliance/CAPA_SECURITY_ACTION_TRACKER.md`).
3. **Post-Incident Review Meeting:** Convene within 5 business days to review telemetry, identify preventive controls, and update this playbook.

---

## 4. Emergency Escalation Contacts
- **Primary Security Hotline:** `security@aritaro.com`
- **Emergency DPO Contact:** `privacy@aritaro.com`
- **CERT-In Incident Desk:** `incident@cert-in.org.in` | Toll Free: 1800-11-4949
