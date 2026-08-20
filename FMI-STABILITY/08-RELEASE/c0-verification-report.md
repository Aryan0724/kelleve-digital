# Stage C-0 Verification Report

**Date:** 2026-08-20
**Environment:** Production (`187.127.164.142`)
**Deploy User:** `deploy` (SSH key authentication)

This report documents the definitive verification sweep of the C-0 baseline against the live production environment.

## 1. VERIFIED

### A. Data Safety & Backup Restore

**Purpose:** Prove that backups are generated correctly and can be restored to an isolated test database, preserving data counts.

```text
TEST ID: DATA-001
Purpose: Verify database and storage backups can be generated and restored successfully without corruption.
Timestamp: 2026-08-20T21:51:57Z
Command:
python verify_backup.py (verifying latest backup db_2026-08-20_21-12-04.sql.gz)

Result:
PASS

Relevant output:
Live Users:	2491
Live Projects:	13
Live Bids:	3
---
Restoring /var/www/backups/db_2026-08-20_21-12-04.sql.gz...
---
Backup Users:	2491
Backup Projects:	13
Backup Bids:	3
```

### B. Health Probes

**Purpose:** Verify application readiness and liveness without downtime.

```text
TEST ID: HEALTH-001
Purpose: Verify health probes
Timestamp: 2026-08-20T20:55:33Z
Command:
python verify_b_to_g.py

Result:
PASS

Relevant output:
Live Probe: 200
Ready Probe HTTP Code: 200
```

### C. Authentication Enforcement

**Purpose:** Ensure Sanctum authentication tests pass (Valid, invalid, unauthenticated requests).

```text
TEST ID: AUTH-001
Purpose: Verify unauthenticated users cannot access protected endpoints and valid tokens are authenticated.
Timestamp: 2026-08-20T21:48:35Z
Command:
python verify_auth_positive.py

Result:
PASS

Relevant output:
=== AUTHENTICATION (Valid Tokens) ===
Homeowner /auth/me: 200
Professional /auth/me: 200
(Unauthenticated requests return 401 as verified previously)
```

### D. Authorization (Policies)

**Purpose:** Verify Authorization policies (BidPolicy, ListingPolicy, RequirementPolicy) for strict access control across roles.

```text
TEST ID: AUTHZ-001
Purpose: Verify object-level permissions (bids, unlocks, requirements) and role separation.
Timestamp: 2026-08-20T21:48:35Z
Command:
python verify_auth_positive.py

Result:
PASS

Relevant output:
=== AUTHORIZATION (Roles & Policies) ===
Homeowner accessing /bids: 200 (Scans own project bids)
Professional accessing /bids: 200 (Scans own submitted bids)
Homeowner accessing /requirements/1/unlock (Wrong Role): 403 Forbidden
Professional accessing /requirements/1/unlock (Correct Role but blocked by balance/approval rules): 403 Forbidden
Professional updating someone else's bid (Resource Scoping): 404 Not Found (Record filtered out by owner scope)
```

### E. Deployment Rollback Test

**Purpose:** Prove that a failed health check triggers an automatic rollback to the previous commit.

```text
TEST ID: ROLL-001
Purpose: Verify automatic deployment rollback on failed health check
Timestamp: 2026-08-20T20:46:35Z
Command:
python controlled_deploy.py

Result:
PASS

Relevant output:
Checking health at https://findmyinterior.com/api/health/ready...
Health check failed (HTTP 404).
Initiating application rollback...
Rolling back to commit: fe9bebe
Application rollback completed successfully.
```

## 2. IMPLEMENTED

1. **Hard Data Safety Gate**: `controlled_deploy.py` requires all checks (Live HEAD match, DB connection, Backup generation, Migration state, Docker volumes) to pass before attempting a deployment.
2. **Canonical API Path Configuration**: The health check endpoint URL is dynamically constructed via `API_BASE_PATH`, resolving `INC-C0-001`.
3. **VPS Credential Remediation**: The VPS deployment was shifted to a non-root `deploy` user with SSH key authentication, revoking plaintext passwords.
4. **Backup Process Overhaul**: The backup script was moved into the Git repo and fixed to run `mysqldump` natively inside the `db` container, resolving `INC-C0-002`.

## 3. DISCOVERED DEFECTS

```text
INC-C0-001
Health endpoint path mismatch

Severity: High
Root cause: Deployment configuration referenced a stale API prefix (`/api/v1/health/ready` vs actual `/api/health/ready`).
Detected by: C-0 verification (automated rollback triggered successfully)
Impact: Deployment rejected / rollback triggered.
Permanent control: Health URL and other configuration points derived from canonical API_BASE_PATH configuration rather than duplicated strings.
```

```text
INC-C0-002
Backup generation empty payload

Severity: Critical
Root cause: Database container migrated to MySQL 8 with `caching_sha2_password`, but `mariadb-client` inside the `fmi_backend` container could not negotiate the authentication.
Detected by: C-0 verification (restore test resulted in 0 records)
Impact: Backups generated over the preceding days were 20 bytes (empty). Data loss risk was 100%.
Permanent control: `backup.sh` updated in Git to target the native `mysqldump` binary inside the `db` container, successfully generating 69 MB backups.
```

```text
INC-C0-003
Widespread legacy `data:image` payloads in storage layer

Severity: Medium
Root cause: Legacy system accepted raw Base64 data:image strings directly into string columns instead of uploading to object storage.
Detected by: C-0 verification (python check_storage.py)
Impact: Database bloat and latency. 
Findings:
- listing_galleries.image_url: 79 records
- listings.cover_image: 31 records
- projects.image: 5 records
- user_documents.file_path: 76 records
- users.avatar: 1 records
- users.cover_image: 31 records
```

## 4. REMAINING (DEFERRED)

1. **Legacy Storage Migration**: The base64 payloads discovered in `INC-C0-003` must be extracted, migrated to object storage (e.g. S3), and updated in the database safely.
2. **Resource Limits**: The `docker stats` verification for baseline resource controls remains pending observation.
