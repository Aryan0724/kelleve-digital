# Prevention Controls
> Revision: v0.2

> [!IMPORTANT]
> A systemic weakness is only considered "closed" when its entry here has all controls marked `[x]`.
> Fixing a bug is NOT sufficient. The system that produced the bug must be changed.

---

## W-001 — No Single Source of Truth for Production (DEPLOYMENT)

**Incident:** INC-001
**Permanent controls required:**

- [ ] CI/CD pipeline: every push triggers `php -l` syntax check before deploy
- [ ] Deployment script verifies that VPS `git rev-parse HEAD` matches `origin/main` post-deploy
- [ ] `/api/health` endpoint in Laravel returning app/DB/storage/cache status
- [ ] SSH access to production restricted — no direct file editing
- [ ] Rollback procedure documented and tested

**Status:** `OPEN` — Engineering Constitution established but CI/CD pipeline not yet built.

---

## W-002 — No Unified Storage Abstraction (STORAGE)

**Incident:** INC-002
**Permanent controls required:**

- [ ] Audit every file upload implementation in the codebase (profile, portfolio, project, documents)
- [ ] Confirm all uploads use Docker volume mount (`find-my-interior_storage_data`), not base64-in-DB
- [ ] Create a unified `StorageService` class used by all upload flows
- [ ] Storage integration test: upload → confirm URL accessible → persist across container restart
- [ ] Document the storage architecture in `02-ARCHITECTURE/integrations.md`

**Status:** `OPEN`

---

## W-003 — Business Rules Enforced Only in the Frontend (BUSINESS_LOGIC / AUTHZ)

**Incident:** INC-003 (Contact unlock bypass), INC-004 (role-based dashboard routing)
**Permanent controls required:**

- [ ] Define all business rules in `03-BUSINESS-RULES/canonical-business-rules.md`
- [ ] Backend `Policy` class for every sensitive action (unlock, bid, project award, admin actions)
- [ ] Authorization tests: verify Role A cannot call Role B's protected endpoints
- [ ] Remove frontend-only role guards that are not backed by backend enforcement

**Status:** `OPEN`

---

## W-004 — Auth/Session Layer Modified Without Regression Tests (AUTH)

**Incident:** INC-004
**Permanent controls required:**

- [ ] Auth regression test suite covering: Login, Logout, Refresh, Session expiry, Role access, 401 handling
- [ ] Dedicated auth audit (scheduled as Step 5 of Master Stability Audit)
- [ ] Sanctum middleware configuration reviewed and documented

**Status:** `OPEN`

---

## W-005 — No Container Resource Limits (INFRASTRUCTURE)

**Incident:** INC-005
**Permanent controls required:**

- [x] Memory limits added to MySQL in `docker-compose.yml` (Commit `624339b6`)
- [ ] Memory limits reviewed for all containers (backend, frontend, Redis, Nginx)
- [ ] VPS memory/CPU monitoring (e.g. netdata, or Sentry performance monitoring)
- [ ] Alert configured for high memory usage

**Status:** `PARTIAL` — memory limit added, monitoring not yet in place.
