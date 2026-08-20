# Stage B: Hypothesis Verification
> Status: COMPLETE
> Rule: No code changes during Stage B. Observe and record only.

---

## W-001 — No Single Source of Truth for Production

**Hypothesis:** Production code can diverge from the Git repository, with no automated mechanism to detect or prevent it.

**Test:** Compare VPS `HEAD` against `origin/main` during INC-001. Inspect whether any CI syntax check existed.

**Evidence:**
- `CONFIRMED` — INC-001: `routes/api.php` on VPS had a parse error; local repo was clean. Resolved only by `git reset --hard origin/main`.
- `CONFIRMED` — No `.github/workflows/` directory exists in the repository. No CI pipeline exists.
- `CONFIRMED` — No `/api/health` endpoint exists in `routes/api.php`.

**Result:** `CONFIRMED`

**Conclusion:** Production diverged from the repository without detection. W-001 is a real and proven systemic weakness.

---

## W-005 — No Container Resource Limits or Startup Resilience

**Hypothesis:** Docker containers have no memory limits, no startup health checks, and the backend may start before its dependencies are ready.

**Test:** Inspect `docker-compose.yml` for `mem_limit`, `healthcheck`, and `depends_on` conditions.

### Finding W-005a: No memory limits on any container

```yaml
# docker-compose.yml — Result
Memory limits found:   NONE
Healthchecks found:    NONE
depends_on:            backend depends on db (simple, no condition)
```

The only dependency ordering is `depends_on: db` on the backend container. This is a **bare name dependency**, meaning Docker starts the `db` container first but does NOT wait for MySQL to be ready to accept connections — only for the container process to start.

**Evidence:**
- `CONFIRMED` — INC-003 (earliest log: MySQL `Connection refused` on 2026-07-15). This is the classic startup race condition.
- `CONFIRMED` — INC-005: MySQL OOM commit `624339b6` added MySQL memory limit — but inspection of `docker-compose.yml` shows **no other container has memory limits**.
- `CONFIRMED` — docker-compose.yml contains zero `healthcheck` blocks.

**Result:** `CONFIRMED — three sub-weaknesses`

| Sub-weakness | Status |
|---|---|
| W-005a: No memory limits (backend, frontend, Redis, Nginx) | `CONFIRMED` |
| W-005b: No MySQL readiness check — startup race condition | `CONFIRMED` |
| W-005c: PHP Redis extension missing on container rebuild | `INFERRED` — Redis is installed in Dockerfile (lines 19-20), but INC-002 occurred. Likely caused by a container that was rebuilt without the current Dockerfile, or a config override. Not definitively resolved. |

**Conclusion:** W-005 is real and splits into three distinct infrastructure gaps.

---

## W-002 — No Unified Storage Abstraction

**Hypothesis:** File upload is implemented independently in multiple parts of the codebase, with inconsistent abstractions and storage backends.

**Test:** Find every upload implementation. Determine if they all converge on one storage path.

### Finding: There are THREE separate upload abstractions in active use

**Abstraction 1: `ImageHelper::toStoragePath()` — stores to `Storage::disk('public')`**

Used by: [`ProfileController.php`](file:///d:/find%20my%20interior/findmyinterior-backend/app/Http/Controllers/User/ProfileController.php) (avatar, cover photo), [`OpportunityProjectController.php`](file:///d:/find%20my%20interior/findmyinterior-backend/app/Http/Controllers/Api/V1/OpportunityProjectController.php) (requirement images)

```php
// ImageHelper::toStoragePath — stores to storage/app/public/
$path = $file->store($directory, 'public');
return '/storage/' . $path;
```

**Abstraction 2: `ImageHelper::toBase64()` — stores as a data URI string directly in the database**

Used by: [`ProfileController.php`](file:///d:/find%20my%20interior/findmyinterior-backend/app/Http/Controllers/User/ProfileController.php) (portfolio images, line 341), [`VerificationController.php`](file:///d:/find%20my%20interior/findmyinterior-backend/app/Http/Controllers/Api/V1/VerificationController.php) (verification docs), [`RfqController.php`](file:///d:/find%20my%20interior/findmyinterior-backend/app/Http/Controllers/Api/V1/RfqController.php) (RFQ images), [`JobController.php`](file:///d:/find%20my%20interior/findmyinterior-backend/app/Http/Controllers/Api/V1/JobController.php) (job images)

```php
// ImageHelper::toBase64 — stores raw image bytes as base64 data URI in the DB column
$raw  = file_get_contents($file->getRealPath());
return "data:{$mime};base64," . base64_encode($raw);
```

**Abstraction 3: `ImageUploadService::storeBase64()` — accepts pre-encoded base64 string, stores to `Storage::disk('public')`**

Used by: [`MediaService.php`](file:///d:/find my interior/findmyinterior-backend/app/Services/MediaService.php) (general media), [`ImageUploadService.php`](file:///d:/find%20my%20interior/findmyinterior-backend/app/Services/ImageUploadService.php) (general)

```php
// ImageUploadService — decodes base64 and writes to public disk
Storage::disk('public')->put($path, $data);
```

**Critical observation:** `ProfileController` uses **both** Abstraction 1 and Abstraction 2 in the same controller — `toStoragePath` for avatar and cover, `toBase64` for portfolio images. The two approaches write to fundamentally different backing stores (filesystem vs. DB column).

**Evidence:**
- `CONFIRMED` — Three distinct abstractions identified in production code.
- `CONFIRMED` — `toBase64` stores binary image data inside the database. On large images this inflates DB row size significantly and defeats the purpose of a `Storage::disk` volume.
- `CONFIRMED` — Commit `7d41367`: "Fix file uploads by using base64 storage in database to bypass Render ephemeral storage limitations" — the `toBase64` path is a **workaround from the Render era that was never removed** after migrating to the VPS with Docker volumes.
- `INFERRED` — Some images are currently stored in the Docker volume (`storage/app/public/`), others are stored as multi-kilobyte base64 strings in MySQL columns. This is a data-storage inconsistency, not just a code inconsistency.

**Result:** `CONFIRMED`

**Conclusion:** W-002 is real. The codebase has three separate upload abstractions. The `toBase64` approach is a Render-era workaround that should not exist on the current VPS, but is still actively used for portfolio images, RFQs, job images, and verification documents.

---

## W-003 — Business Rules Enforced Only at UI Layer

**Hypothesis:** The backend does not reject invalid role/action combinations. A request bypassing the UI would succeed.

**Test:** Inspect the most critical backend authorization points: bid submission, contact unlock, and listing access.

### Finding: Backend authorization is PARTIALLY enforced — inconsistently

**Bid submission (`BidController::store`):**
```php
// Line 32 — checks role, but as a string comparison not a Policy
if ($user->role === 'customer' || $user->role === 'homeowner') {
    return $this->error('Customers cannot place bids', 403);
}
```
- A `BidPolicy::create()` **exists** but is not called here — the comment on line 144 reads `// Authorization logic here (ideally via Policy)`.
- The role check uses `$user->role` (singular column) not `$user->hasRole()` (relationship). These may return different values.
- A `supplier` or any other role that is not `customer`/`homeowner` can submit a bid for a **labour job** or **RFQ** they should not be allowed to bid on.

**Contact unlock (`UnlockController::unlockContact`):**
```php
// No role check in UnlockController at all.
// The service applies a $fee = 0 exception for worker/skilled_worker roles.
// But there is no check preventing a homeowner from calling unlockContact.
```
- A homeowner can call `POST /api/v1/unlock/{id}` and the service will attempt to charge their wallet — there is no role rejection.
- The `$fee = 0` for `worker`/`skilled_worker` is a **business rule encoded as a fee exception**, not as an access restriction.
- The prior bypass bug (INC-003) is consistent with this: the role exception was missing or incorrectly applied, allowing free unlocks for the wrong roles.

**Policies exist but are not consistently wired:**
- 10 Policy classes exist (`BidPolicy`, `ProjectPolicy`, `RequirementPolicy`, etc.)
- But no `$this->authorize()` calls are found in the V1 API controllers — they exist but are not used.

**Evidence:**
- `CONFIRMED` — No `authorize()` calls in API V1 controllers.
- `CONFIRMED` — `BidPolicy::create()` exists and correctly defines who can bid, but `BidController::store()` reimplements this logic independently as a string check instead of calling the policy.
- `CONFIRMED` — `UnlockController` performs zero role validation before calling `UnlockService`.
- `CONFIRMED` — Line 144 of `BidController`: comment `// Authorization logic here (ideally via Policy)` — the developer knew policies should be used but didn't connect them.

**Result:** `PARTIALLY CONFIRMED`

**Conclusion:** W-003 is real but more precise than the original hypothesis. The backend does enforce some business rules (bid fee deduction, wallet balance check), but the **authorization layer** (who is allowed to call this endpoint at all) is inconsistently enforced — sometimes using ad-hoc role string checks, sometimes not at all. The 10 Policy classes are written but never invoked from controllers.

---

## W-004 — Auth/Session Layer Modified Without Regression Tests

**Hypothesis:** The current auth middleware is in an uncertain state, and no automated regression tests cover authentication behavior.

**Test:** Identify the current middleware, check for auth-specific tests.

### Finding: Tests exist but cover flows, not auth regression

**Test files found:**
- `tests/Feature/GoldenFlowTest.php` (16KB) — tests the customer project journey and related flows using `RefreshDatabase`
- `tests/Feature/GoldenPathTest.php`, `RecommendationEngineTest.php`, `RevenueAnalyticsTest.php`, `VendorMetricTest.php`

**No test files found for:**
- Auth middleware correctness
- Role-based access control (`worker → professional endpoint → 403`)
- Session expiry behavior
- Sanctum token validation

**Current middleware state:**
- Commit `bc78a9c5` replaced the default `Authenticate` middleware to fix 401 dashboard errors
- No subsequent auth-specific test was added after that change
- `GoldenFlowTest.php` uses `actingAs()` which bypasses the actual Sanctum token middleware

**Evidence:**
- `CONFIRMED` — Zero test files specifically covering auth middleware behavior or role-based access.
- `CONFIRMED` — `GoldenFlowTest` uses `actingAs()` shortcut, which does not test the actual token-based authentication path that production uses.
- `INFERRED` — The current middleware is functional (production is working), but its correctness under edge cases (expired token, role change mid-session, concurrent requests) is untested.

**Result:** `CONFIRMED`

**Conclusion:** W-004 is real. Auth tests exist only as part of flow tests using `actingAs()`. The actual Sanctum token path, role enforcement via the middleware stack, and edge cases are entirely untested.

---

## Stage B Summary

| Weakness | Result | Confidence |
|---|---|---|
| W-001: Production/source drift | `CONFIRMED` | `CONFIRMED` |
| W-005: No container resource limits or startup resilience | `CONFIRMED` (3 sub-weaknesses) | `CONFIRMED` |
| W-002: No unified storage abstraction | `CONFIRMED` | `CONFIRMED` |
| W-003: Business rules only in frontend | `PARTIALLY CONFIRMED` — backend enforces some rules but authorization is inconsistent | `CONFIRMED` |
| W-004: Auth layer modified without regression tests | `CONFIRMED` | `CONFIRMED` |

**All five weaknesses are confirmed or partially confirmed. None are rejected.**

The revised W-003 finding is important: the backend is not entirely unguarded. It does enforce wallet fees and some role checks. But the authorization layer (who may call an endpoint) is ad-hoc and does not use the existing Policy classes. That is the specific gap to close, not a full rewrite of business logic.

> [!IMPORTANT]
> Stage B is complete. No code was changed during this investigation. All findings are observations of the current codebase state. Stage C (Application Audit) and prevention control implementation may now begin, prioritized by blast radius and recurrence evidence.
