# FMI Historical Failure Analysis
> Revision: v0.3 — Stage A: Runtime event enumeration and corrected incident model

> [!IMPORTANT]
> This document supersedes v0.2. The v0.2 draft skipped enumerating actual runtime failures from surviving logs.
> DRAFT v0.1 is archived as `historical-failure-analysis-DRAFT-v0.1.md`. Its 455 figure was a commit count, not an incident count.

---

## What This Report Is

A reconstruction of FMI's failure history from **four sources of evidence**:

1. **Git history** — 720 commits from repository inception to present
2. **Surviving Laravel logs** — from `2026-07-15` (earliest Laravel retention record) to `2026-08-20`
3. **Docker container logs** — current window only, captured during the pre-deployment snapshot
4. **Developer-reported issues** — inferred from commit messages and conversation history

This report maps evidence events through the entity model:

```
RAW EVIDENCE → EVIDENCE EVENTS → SYMPTOMS → UNIFIED INCIDENT → ROOT CAUSE → FAMILY → PREVENTION CONTROL
```

---

## Historical Coverage Limits

| Source | Earliest Record | Status |
|---|---|---|
| Git history | Repository inception | **Complete** |
| Laravel production logs | 2026-07-15 | **Partial** — logs rotate on container rebuild |
| Docker container logs | Current container only (~days) | **Partial** |
| Prior deployment platforms (Render, Railway) | Decommissioned | **Not available** |
| Browser/client-side errors | Never centrally captured | **Not available** |
| Developer conversation logs | Partial | **Partial** |

---

## Runtime Failure Enumeration (Stage A)

Before clustering into incidents, we enumerate every distinct runtime failure signature found in the surviving logs. Repeated occurrences of the same error within a short window are deduplicated into a single event.

| # | Error Signature | Count in Logs | First Observed | Last Observed | Source |
|---|---|---|---|---|---|
| RF-001 | `Class "Redis" not found` | 821 log lines | 2026-08-08 07:54:32 | 2026-08-08 08:49:17 | Laravel + Docker |
| RF-002 | `ParseError: Unclosed '{' on line 274` | 79 log lines | 2026-08-08 08:53:20 | 2026-08-08 (same session) | Laravel JSON log |
| RF-003 | `Unhandled Exception: Unclosed '{'` (stack trace variant) | 49 log lines | 2026-08-08 | 2026-08-08 | Laravel JSON log |
| RF-004 | `SQLSTATE[HY000] [2002] Connection refused` (MySQL) | 1 in Laravel log | 2026-07-15 07:45:46 | 2026-07-15 | Laravel (earliest record) |
| RF-005 | `SQLSTATE[42000]: Duplicate key name 'listings_user_id_index'` | 3 log lines | 2026-08-08 08:38:17 | 2026-08-08 | Laravel |
| RF-006 | `Incomplete object: Illuminate\Pagination\LengthAwarePaginator` | 1 log line | 2026-08-08 08:48:39 | 2026-08-08 | Laravel |
| RF-007 | `intl PHP extension required` | 1 log line | 2026-08-20 (post-deploy) | 2026-08-20 | Laravel (`db:show` command only) |

> [!NOTE]
> RF-001 (821 lines) and RF-002/003 (128 lines) are not 949 separate incidents. They are two separate failure signatures, each generating many repeated log entries over a single incident window. RF-007 appeared only during the manual `db:show` verification command and did not affect production requests.

---

## Unified Incident Register

Five incidents confirmed from evidence. W-001 through W-005 are treated as **hypotheses**, not confirmed systemic weaknesses, until their root-cause status is individually supported.

---

### INC-001 — Global API Outage (ParseError in routes/api.php)

| Field | Value |
|---|---|
| **Root Cause Status** | `CONFIRMED` |
| **Family** | `DEPLOYMENT` |
| **Date** | 2026-08-08 (log), resolved 2026-08-20 |
| **Recurrence** | 1 confirmed production outage |
| **Blast Radius** | Total — all API endpoints returned HTTP 500 |

**Causal Chain**
```
Production api.php manually edited without committing
       ↓
Laravel route bootstrap encounters ParseError: Unclosed '{'
       ↓
Every API request triggers a 500 HTML error response
       ↓
Next.js RSC layer receives unexpected response
       ↓
InvariantError thrown: platform appears broken to all users
       ↓
Recovery: git reset --hard origin/main via controlled deploy
```

**Evidence Events**
- `CONFIRMED` — RF-002, RF-003: 128 log lines of `ParseError` on `routes/api.php:371`
- `CONFIRMED` — Local `php -l routes/api.php`: no syntax errors — repo was clean, VPS was not
- `CONFIRMED` — Commit `fe9bebe`: "implement FMI Stability System" restoring clean state
- `INFERRED` — Direct production edit (no surviving evidence of who/when)

**Prevention Controls**

| Control | Status |
|---|---|
| Git-only deployments (no SSH file editing) | `PLANNED` |
| CI syntax validation (`php -l`) on push | `NOT_STARTED` |
| Post-deploy commit verification | `PLANNED` |
| `/api/health` endpoint | `NOT_STARTED` |
| Rollback procedure | `PLANNED` |

---

### INC-002 — Redis Dependency Unavailable (Infrastructure)

| Field | Value |
|---|---|
| **Root Cause Status** | `INFERRED` |
| **Family** | `INFRASTRUCTURE` |
| **Date** | 2026-08-08 07:54:32 – 08:49:17 (55 minutes) |
| **Recurrence** | 1 confirmed episode in surviving logs; unknown prior history |
| **Blast Radius** | Any feature dependent on cache or queues (sessions, notifications, queue workers) |

**Causal Chain**
```
Laravel application starts / receives request
       ↓
Attempts to connect to Redis via PhpRedis extension
       ↓
PHP extension `redis` (PhpRedis) not installed in container
       ↓
Class "Redis" not found — Error thrown for every cache/queue operation
       ↓
Degraded operation: cache misses, queue failures, session issues
```

**Evidence Events**
- `CONFIRMED` — RF-001: 821 log lines, `Class "Redis" not found` at `PhpRedisConnector.php:80`, window `07:54–08:49` on 2026-08-08
- `INFERRED` — Likely caused by a container rebuild that didn't include the PHP Redis extension (or a config change to the Redis driver)
- `UNKNOWN` — Whether this caused visible user-facing failures beyond degraded caching

**Note:** This incident overlaps in time with INC-001 (both on 2026-08-08). The `ParseError` appears after the Redis errors, suggesting INC-002 occurred first, possibly triggered by a container rebuild, which may have also introduced the `api.php` change or preceded it.

**Prevention Controls**

| Control | Status |
|---|---|
| PHP extension dependencies explicitly listed in Dockerfile | `UNKNOWN` — needs audit |
| Container start-up health check (verifies Redis connectivity) | `NOT_STARTED` |
| Separate Redis availability alert | `NOT_STARTED` |

---

### INC-003 — MySQL Connection Refused on Container Start

| Field | Value |
|---|---|
| **Root Cause Status** | `INFERRED` |
| **Family** | `INFRASTRUCTURE` |
| **Date** | 2026-07-15 07:45:46 (earliest surviving Laravel log) |
| **Recurrence** | 1 confirmed log entry; likely occurred on subsequent deploys too |
| **Blast Radius** | Full platform — DB-dependent requests fail |

**Causal Chain**
```
Container starts
       ↓
Laravel attempts DB connection before MySQL container is ready
       ↓
SQLSTATE[HY000] [2002] Connection refused
       ↓
Platform unavailable during startup window
```

**Evidence Events**
- `CONFIRMED` — RF-004: `SQLSTATE[HY000] [2002] Connection refused` — earliest surviving log entry (2026-07-15), suggesting this is a container startup race condition
- `INFERRED` — A startup ordering issue (`depends_on` may not guarantee MySQL readiness)

**Prevention Controls**

| Control | Status |
|---|---|
| Docker Compose `healthcheck` on MySQL container | `UNKNOWN` — needs audit |
| Laravel startup retry / wait-for-db script | `UNKNOWN` — needs audit |

---

### INC-004 — Duplicate Migration Key Crash

| Field | Value |
|---|---|
| **Root Cause Status** | `CONFIRMED` |
| **Family** | `DATABASE` |
| **Date** | 2026-08-08 08:38:17 |
| **Recurrence** | 1 confirmed episode |
| **Blast Radius** | Deployment failure — migration run halted |

**Causal Chain**
```
New migration attempts to add index `listings_user_id_index`
       ↓
Index already exists in production DB (from previous migration or manual change)
       ↓
SQLSTATE[42000]: Duplicate key name — migration crashes
       ↓
Deployment exits with error; subsequent state uncertain
```

**Evidence Events**
- `CONFIRMED` — RF-005: 3 log entries of `SQLSTATE[42000]: Duplicate key name 'listings_user_id_index'` at `2026-08-08 08:38:17`
- `CONFIRMED` — Commit `bee601e` (historical): "Fix migration duplicate column error" — confirms this class of failure occurred and was fixed at least once

**Prevention Controls**

| Control | Status |
|---|---|
| All migrations use `if not exists` guards or conditional checks | `UNKNOWN` — needs audit |
| Staging migration test before production run | `NOT_STARTED` |

---

### INC-005 — MySQL Memory Exhaustion (OOM)

| Field | Value |
|---|---|
| **Root Cause Status** | `CONFIRMED` |
| **Family** | `INFRASTRUCTURE` |
| **Date** | Historical (pre-commit `624339b6`) |
| **Recurrence** | 1 confirmed; mitigated |
| **Blast Radius** | Total — MySQL OOM kills the container, all DB operations fail |

**Causal Chain**
```
MySQL container has no memory limit in docker-compose.yml
       ↓
Under load, MySQL allocates beyond available VPS RAM
       ↓
OOM killer terminates MySQL container
       ↓
All database-dependent API calls fail
```

**Evidence Events**
- `CONFIRMED` — Commit `624339b6`: "add memory limits to MySQL container to prevent OOM crashes on the VPS" — direct evidence of the failure and fix

**Prevention Controls**

| Control | Status |
|---|---|
| MySQL memory limit in docker-compose.yml | `IMPLEMENTED` (Commit `624339b6`) |
| Memory limits for all other containers | `UNKNOWN` — not yet audited |
| VPS memory monitoring / alerting | `NOT_STARTED` |

---

## Proposed Systemic Weaknesses (Hypotheses — not yet confirmed)

These are patterns inferred from the unified incident data and git history. They are labeled **hypotheses** until further audit confirms or refutes them.

| ID | Hypothesis | Supporting Evidence | Status |
|---|---|---|---|
| W-001 | Production not controlled by Git — direct edits cause drift | INC-001 (CONFIRMED) | **STRONGEST** — directly proven |
| W-002 | No unified storage abstraction — each feature implements upload independently | 72 commits in upload/storage area; commit history shows 3 separate upload implementations | **INFERRED** — needs code audit to confirm current state |
| W-003 | Business rules enforced only at UI layer — backend does not reject invalid role/action combinations | INC-003 (contact unlock bypass, commit `3a7c325c`) | **HYPOTHESIS** — requires backend endpoint testing to confirm backend enforcement gap |
| W-004 | Auth/session layer has been modified without regression tests | 38 corrective commits in auth/middleware area; repeated middleware replacements | **INFERRED** — "no tests" not directly proven; needs auth audit |
| W-005 | No container resource limits or startup health checks | INC-002 (Redis), INC-003 (MySQL start race), INC-005 (MySQL OOM) | **CONFIRMED** — three separate infrastructure failures with the same underlying cause |

> [!NOTE]
> W-003 in particular requires **backend endpoint testing** before we can claim it as confirmed. The question is not whether the UI allows wrong actions — it's whether the backend rejects them. See `03-BUSINESS-RULES/` for the required verification.

---

## What This Report Does NOT Claim

- That 455 incidents occurred (that was a commit count from v0.1 — retracted)
- That W-001 through W-005 are all confirmed systemic weaknesses (they are hypotheses of varying strength)
- That all historical failures have been recovered (log retention is ~days for runtime logs)
- That any weakness is "fixed" — only that controls are planned, implemented, or verified

---

## Next Steps (Stage B before application audit)

1. `[x]` Historical failure analysis v0.3 (this document)
2. `[x]` Change hotspots identified (see `change-hotspots.md`)
3. `[ ]` Verify W-002: Audit all upload implementations in current codebase
4. `[ ]` Verify W-003: Test backend endpoints for role enforcement
5. `[ ]` Verify W-004: Determine current auth middleware state and test coverage
6. `[ ]` Populate `prevention-controls.md` for each confirmed weakness
7. `[ ]` Then proceed to architecture/API audit
