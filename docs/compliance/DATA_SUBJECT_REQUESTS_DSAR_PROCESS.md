# Aritaro Cybersecurity — Data Subject Rights (DSAR) Handling Process
**Document ID:** SOP-DSAR-005  
**Version:** 1.0 | **Effective Date:** September 2026  
**Governing Regulation:** Digital Personal Data Protection Act (DPDPA 2023) Section 11–13, GDPR Articles 15–22  

---

## 1. Scope & Objective
This SOP defines the step-by-step workflow when an individual ("Data Principal") requests access to, correction of, or permanent deletion ("Right to be Forgotten") of their personal data (Name, Phone, Email, Messages).

---

## 2. Standard 5-Step Resolution Workflow

```
[1. Request Intake] → [2. Identity Verification] → [3. Data Retrieval / Scoping] → [4. Redaction & Action] → [5. Confirmation & Close]
```

### Step 1: Intake & Logging (Day 0 – 1)
- **Ingestion Points:** Inbound email to `privacy@aritaro.com`, contact form inquiry marked "Data Deletion/Audit", or letter to Grievance Officer.
- **Action:** Privacy Lead creates an entry in the **DSAR Request Log** (Section 3 below) with unique Ticket ID (e.g. `DSAR-2026-001`).
- Send acknowledgment email to user within **24 hours** confirming receipt.

### Step 2: Identity Verification (Day 1 – 3)
- To prevent unauthorized data exfiltration:
  - If requested from an existing portal user: verify via authenticated account session or verification email token sent to their registered address.
  - If requested by a non-user (contact form lead): verify request originates from the same email address stored in `contactrequests` collection.
  - *Never ask for government IDs unless legally mandatory.*

### Step 3: Retrieval & System Scoping (Day 4 – 7)
The Privacy Lead queries all repositories touching personal data:
- `contactrequests` collection (search by email and phone number).
- `servicerequests` collection (search by contact email and name).
- `users` collection (account records).
- Mail gateway (inbound correspondence from this address).
- Cloud storage (any uploaded customer attachments).

### Step 4: Execution (Day 8 – 12)
- **If Access Request ("Show me what you have"):**
  - Export personal records into a password-protected, encrypted PDF or JSON summary.
  - Redact third-party confidential details and proprietary pentest methodologies.
- **If Deletion Request ("Delete my data"):**
  - Execute database deletion: delete documents in `contactrequests`, anonymize/delete user profile.
  - Purge associated email threads from administrative mailbox.
  - *Exception Check:* If active legal proceeding or statutory tax/accounting record exists, retain only that mandated subset and inform the user of the statutory retention ground.

### Step 5: Final Confirmation & Closure (Day 13 – 15)
- Transmit official Certificate / Confirmation of Erasure or Data Export via encrypted email.
- Update DSAR Log to **Status: Resolved**.
- All requests must be closed within **15 business days** (complying with DPDPA guidelines).

---

## 3. Official DSAR Request Log Template

| Ticket ID | Date Received | Requester Name | Email / Phone | Request Type (Access / Delete / Rectify) | Identity Verified? | Action Taken | Date Completed | Handled By |
|---|---|---|---|---|---|---|---|---|
| `DSAR-2026-001` | 2026-08-01 | Sample Requester | `sample@client.com` / +91-9876543210 | Data Erasure | Yes (Email confirmation) | Deleted from `contactrequests` & mail threads | 2026-08-08 | DPO Lead |
| `DSAR-2026-002` | [Pending] | | | | | | | |
