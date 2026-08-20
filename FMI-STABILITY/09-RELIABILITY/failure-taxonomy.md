# Failure Taxonomy
> Revision: v0.2

Every incident recorded in this register MUST be assigned exactly one `FAMILY` from this list.
Every future incident raised in production MUST use this vocabulary.

---

## Families

| Code | Name | Description |
|---|---|---|
| `DEPLOYMENT` | Deployment Drift / Failure | Production state diverged from the repository, or the deployment process itself failed |
| `FRONTEND_BUILD` | Frontend Build / Import Failure | TypeScript errors, missing imports, SSG failures, hydration errors preventing the app from building or rendering |
| `API_CONTRACT` | API Contract Drift | Frontend and backend disagreed on request/response structure, field names, HTTP status codes, or authentication expectations |
| `AUTH` | Authentication / Session | Login failures, session expiry, token mismatches, or middleware incorrectly blocking or allowing requests |
| `AUTHZ` | Authorization / Permissions | A user could access resources or perform actions not permitted for their role |
| `DATABASE` | Database / Schema | Migration failures, constraint violations, N+1 queries, morph map mismatches, or schema coupling bugs |
| `STORAGE` | File Storage / Upload | File upload failures, ephemeral storage loss, broken media URLs, or missing files |
| `BUSINESS_LOGIC` | Business Rule Violation | A feature allowed or rejected an action in contradiction to the canonical business rules |
| `PAYMENT` | Payment / Wallet | Razorpay integration failures, wallet corruption, fee bypass bugs |
| `PERFORMANCE` | Performance / Timeout | Requests timing out, N+1 exhaustion, OOM crashes, query slowness |
| `SECURITY` | Security | Unauthorized data access, injection risks, or exposed sensitive information |
| `INFRASTRUCTURE` | Infrastructure / VPS | Container crashes, OOM kills, DNS failures, Nginx misconfiguration |
| `EXTERNAL_SERVICE` | External Service | Third-party API failures (SMS, email, Razorpay, Sentry) |
| `UX` | UX / Interface | Visual bugs, z-index overlaps, layout regressions that do not affect backend correctness |
| `UNKNOWN` | Unknown | Symptom observed but root cause not yet determined. Do NOT force into another family to make the table complete. |

---

## Evidence Confidence Levels

Every claim in the Incident Register must carry one of these confidence labels.

| Level | Meaning |
|---|---|
| `CONFIRMED` | Direct technical evidence exists: a log entry, stack trace, failing test, or code diff proves this happened and why |
| `REPORTED` | A developer or user stated it happened, but no surviving technical evidence (log/commit) can be found |
| `INFERRED` | Multiple pieces of evidence point strongly to this cause, but cannot be proven directly |
| `UNKNOWN` | The symptom is documented but the root cause cannot yet be determined from available evidence |

> [!IMPORTANT]
> `UNKNOWN` is a valid and important state. Never elevate an `INFERRED` or `REPORTED` finding to `CONFIRMED` without direct evidence.
> A weakness is only considered "fixed" when a **preventive engineering control exists** in `prevention-controls.md` — not when a fix commit was merged.
