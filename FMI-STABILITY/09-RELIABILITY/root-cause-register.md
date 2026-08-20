# Root Cause Register
> Revision: v0.2 — Rebuilt with correct entity model

## Entity Model

This register strictly separates:

```
RAW EVIDENCE (git commits, log lines, dev reports)
       ↓
EVIDENCE EVENTS (a specific observable fact from evidence)
       ↓
SYMPTOMS (what the user/developer experienced)
       ↓
UNIFIED INCIDENT (one causal event, regardless of how many commits addressed it)
       ↓
ROOT CAUSE (why it happened)
       ↓
ROOT-CAUSE FAMILY (taxonomy class from failure-taxonomy.md)
       ↓
PREVENTION CONTROL (the engineering change that makes recurrence impossible)
```

A single Unified Incident may reference multiple commits, log entries, and deployments.
A Unified Incident ID (`INC-XXX`) is NOT the same as a commit SHA.

---

## Historical Coverage

| Source | Availability |
|---|---|
| Git history | Complete from repository inception (720 commits) |
| VPS runtime logs (Laravel) | Partial — only current container retention window |
| VPS Docker logs (Backend, Frontend) | Partial — only current container retention window |
| Browser/client-side errors | Not centrally captured — UNKNOWN retention |
| Developer-reported issues | Partial — inferred from commit messages and conversation history |

> [!NOTE]
> Absence of a log does not mean an incident did not occur. The historical coverage gap is acknowledged and logged here. The evidence-index.md records what was and was not recoverable.

---

## Unified Incident Register

> Format: Each incident has a unique `INC-XXX` ID, a defined set of evidence events, a single root cause, a family, and a required prevention control.
> An incident is only `CLOSED` when its prevention control exists in `prevention-controls.md`.

---

### INC-001 — Global API Outage (ParseError / Deployment Drift)

| Field | Value |
|---|---|
| **ID** | INC-001 |
| **Status** | `UNDER VERIFICATION` |
| **Date First Observed** | 2026-08-08 (log timestamp) |
| **Date Last Observed** | 2026-08-20 (resolved by controlled redeploy) |
| **Recurrence Count** | 1 confirmed production outage |
| **Family** | `DEPLOYMENT` |
| **Blast Radius** | Entire platform — all API endpoints returned 500 |

**Evidence Events**
- `CONFIRMED` — `backend_errors.txt`: Laravel `ParseError: Unclosed '{' on line 274` at `routes/api.php:371`, timestamp `2026-08-08T08:53:20Z` (dozens of log lines, same error)
- `CONFIRMED` — Local `php -l routes/api.php`: no syntax errors (proves VPS diverged from repo)
- `CONFIRMED` — Commit `fe9bebe`: restoration of clean `api.php` via `git reset --hard origin/main`
- `INFERRED` — Root cause: a developer (or AI agent) directly edited `routes/api.php` on the VPS without committing the change, causing the repo and production to diverge

**Symptoms Experienced**
- All frontend API calls returned `HTTP 500` HTML responses instead of JSON
- Next.js threw `InvariantError: Cannot read properties of null (reading 'useContext')`
- Entire platform was non-functional for affected users

**Root Cause:** Production source code was manually edited directly on the VPS, diverging from the Git repository. The corrupt state was never caught because no CI/CD syntax check existed.

**Prevention Controls Required**
- [ ] Git-only deployments (no SSH file editing)
- [ ] CI syntax validation (`php -l`) on every push
- [ ] Post-deployment commit verification (VPS HEAD must match `origin/main`)
- [ ] `/api/health` endpoint for automated health checks

---

### INC-002 — Recurring File Upload / Storage Failures

| Field | Value |
|---|---|
| **ID** | INC-002 |
| **Status** | `OPEN — Root Cause Partially Known` |
| **Date First Observed** | INFERRED ~2026-07 (Render ephemeral storage era) |
| **Date Last Observed** | 2026-08-18 (image cropper fix) |
| **Recurrence Count** | High — 60+ commits touching upload/image/storage |
| **Family** | `STORAGE` |
| **Blast Radius** | Profile images, portfolio images, project photos, hero images |

**Evidence Events**
- `CONFIRMED` — Commit `7d41367`: "Fix file uploads by using base64 storage in database to bypass Render ephemeral storage limitations"
- `CONFIRMED` — Commit `623b623`: "fix: remove undefined content-type header for FormData in Axios"
- `CONFIRMED` — Commit `46d205b`: "Fix FormData upload bugs by removing explicit multipart/form-data header from Axios requests"
- `CONFIRMED` — Commit `291cc279`: "UI crash fixes, edit profile routing, and universal image cropper"
- `INFERRED` — The project migrated from Render (ephemeral filesystem) to a VPS with Docker volumes. The base64-in-database approach is a workaround that may persist and cause other issues.
- `UNKNOWN` — Current state of storage for all upload types (profile, portfolio, project media) has not been audited since VPS migration

**Symptoms Experienced**
- Uploaded images not persisting after container restarts (Render era)
- Profile avatar rendering fallback broken (`c598c74`)
- Upload API returning errors due to incorrect `Content-Type` headers
- Portfolio upload failures

**Root Cause (Partial):** No unified storage abstraction. Each feature area implemented file uploads independently, leading to inconsistent handling of `multipart/form-data`, base64 encoding, and storage backends. The Render → VPS migration may not have been fully resolved.

**Prevention Controls Required**
- [ ] Audit all upload implementations to confirm they use Docker volume mounts, not base64-in-DB
- [ ] Unified `StorageService` abstraction across all upload types
- [ ] Storage integration test: upload file → verify URL accessible → persist across container restart

---

### INC-003 — Contact Unlock / Wallet Corruption

| Field | Value |
|---|---|
| **ID** | INC-003 |
| **Status** | `OPEN — Root Cause Partially Known` |
| **Date First Observed** | 2026-08-16 |
| **Date Last Observed** | 2026-08-19 |
| **Recurrence Count** | Multiple — 48+ commits touching unlock/wallet/payment logic |
| **Family** | `BUSINESS_LOGIC` |
| **Blast Radius** | Contact unlock flow, wallet balance, free bypass logic for workers |

**Evidence Events**
- `CONFIRMED` — Commit `2d8c5a42`: "fix worker job unlock visibility and database corruption bug"
- `CONFIRMED` — Commit `3e0a1234` (inferred from `be008a62`): fix-unlocks endpoint added as a manual repair script — this indicates the database itself got into an inconsistent state
- `CONFIRMED` — Commit `7b7c36a`: "Include skilled_worker in free unlock logic and fix modal text"
- `CONFIRMED` — Commit `3a7c325c`: "enforce wallet fee for all contact unlocks, removing free bypasses for workers"
- `REPORTED` — Workers were able to unlock contacts without paying the wallet fee (a free bypass existed)

**Root Cause (Partial):** The contact unlock business rule (who pays, who gets free access, what roles are exempt) was not formally defined and was implemented differently across multiple parts of the codebase. The creation of a manual `fix-unlocks` script confirms that production data was corrupted.

**Prevention Controls Required**
- [ ] Define the canonical unlock business rule in `03-BUSINESS-RULES/canonical-business-rules.md`
- [ ] Backend-enforced role check on every unlock request
- [ ] Wallet balance integration test
- [ ] No manual data-repair scripts as a substitute for correct business logic

---

### INC-004 — Authentication Middleware Blocking Dashboard

| Field | Value |
|---|---|
| **ID** | INC-004 |
| **Status** | `OPEN — Root Cause Unknown` |
| **Date First Observed** | INFERRED ~2026-08 |
| **Recurrence Count** | Multiple commits — at least 37 touching auth/session |
| **Family** | `AUTH` |
| **Blast Radius** | Dashboard access, role-based routing |

**Evidence Events**
- `CONFIRMED` — Commit `bc78a9c5`: "replace default Authenticate middleware + catch RouteNotFoundException to fix dashboard 401 issues"
- `CONFIRMED` — Commit `8bf900e`: "resolve 500/403/404 production errors in dashboard and opportunity controllers"
- `INFERRED` — The Sanctum-based token auth layer has been modified multiple times, suggesting its behavior is not fully understood or tested
- `UNKNOWN` — Whether the current auth middleware is the correct, stable version or a workaround

**Root Cause:** `UNKNOWN` — Requires dedicated auth audit.

**Prevention Controls Required**
- [ ] Dedicated auth audit (Step 5 of the Master Stability Audit)
- [ ] Automated auth regression tests for all role-based routes

---

### INC-005 — Production OOM / MySQL Container Crash

| Field | Value |
|---|---|
| **ID** | INC-005 |
| **Status** | `MITIGATED — Control in place` |
| **Date First Observed** | INFERRED ~2026-08 |
| **Recurrence Count** | 1 confirmed |
| **Family** | `INFRASTRUCTURE` |
| **Blast Radius** | Entire platform (DB-dependent) |

**Evidence Events**
- `CONFIRMED` — Commit `624339b6`: "add memory limits to MySQL container to prevent OOM crashes on the VPS"

**Root Cause:** MySQL container had no memory limits set in `docker-compose.yml`, causing it to exhaust VPS memory under load.

**Prevention Controls**
- [x] Memory limit added to MySQL container in docker-compose.yml (Commit `624339b6`)
- [ ] VPS memory monitoring / alerting

---

## Summary (Honest Metrics)

| Metric | Value |
|---|---|
| Raw evidence commits analyzed | 720 |
| Unified Incidents confirmed | 5 (this register is incomplete — audit ongoing) |
| Incidents with confirmed root cause | 3 (INC-001, INC-002 partial, INC-005) |
| Incidents with unknown root cause | 2 (INC-003 partial, INC-004) |
| Highest blast-radius incident | INC-001 (global outage) |
| Most frequently recurring area | Storage/Upload (60+ commits) |
| Production data corruption confirmed | Yes (INC-003, fix-unlocks script) |

> [!CAUTION]
> This register is NOT complete. It documents the incidents recoverable from the available evidence. Additional incidents almost certainly occurred and were resolved without being formally recorded. The register should grow as the Master Stability Audit progresses through each module.
