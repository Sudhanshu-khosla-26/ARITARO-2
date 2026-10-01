# Aritaro Cybersecurity — Customer Data File Security SOP (Excel/CSV)
**Document ID:** SOP-SEC-004  
**Effective Date:** September 2026 | **Classification:** Confidential / Operational  

---

## 1. Scope & Purpose
This Standard Operating Procedure (SOP) governs the generation, storage, transmission, and disposal of structured data files (CSV, XLS, XLSX) containing client personal data, leads, or assessment findings.

---

## 2. Mandatory Rules for Handling Customer Data Files

### Rule 1: No Plaintext Customer Data on Local Storage
- **Prohibition:** Unencrypted CSV or Excel files containing customer names, phone numbers, email addresses, or vulnerability findings must **NEVER** remain stored on local desktop or laptop drives.
- **Temporary Exports:** If an administrator must export leads or service requests from the CRM/Admin dashboard for analysis:
  1. The file must reside exclusively in a designated temporary folder protected by endpoint disk encryption (BitLocker / FileVault).
  2. The file must be **permanently deleted within 24 hours** using secure file shredding.

### Rule 2: Mandatory Password Protection & Encryption
Whenever a structured file containing client contact or scoping data must be shared or backed up:
1. **Archive Encryption:** Compress the file using **7-Zip (AES-256)** or password-protect via Excel’s native encryption (`File > Info > Protect Workbook > Encrypt with Password`).
2. **Passphrase Standard:** The password must be a random alphanumeric string of **at least 16 characters** generated via a secure password manager.
3. **Out-of-Band Delivery:** The password must **NEVER** be sent in the same communication channel as the encrypted file (e.g., file sent via secure email; password transmitted via ephemeral Signal or encrypted SMS).

### Rule 3: Strict Role-Based Access Control (RBAC)
- Only users with verified `admin` or `super_admin` roles can query or export customer contact and service request records.
- Service account and database exports are restricted to read-only temporary tokens tied to specific operational tickets.

### Rule 4: Zero-Retention & Cleanup Checklist
Every Friday at 17:00 IST, team members handling administrative or scoping duties must execute the following checklist:
- [ ] Empty local `Downloads` and `Desktop` folders of any exported `.csv`, `.xlsx`, or `.tsv` files.
- [ ] Purge trash/recycle bin with secure erasure.
- [ ] Confirm no client contact spreadsheets remain in unapproved personal cloud drives (Google Drive, OneDrive, Dropbox).

### Rule 5: Approved Storage Repositories
- **Production Database:** MongoDB Atlas (M10+ with encrypted volumes via AWS KMS, TLS 1.3 connections, IP whitelisting).
- **Report Archives:** Encrypted AWS S3 bucket with Server-Side Encryption (SSE-KMS) and strict bucket policies preventing public read access.
- **Local Workstations:** Full-disk encryption (BitLocker 256-bit or FileVault) mandatory for all engineer endpoints.
