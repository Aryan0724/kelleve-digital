# FMI Historical Failure Analysis
> Revision: v0.2 — Corrected entity model

> [!IMPORTANT]
> This document supersedes `historical-failure-analysis-DRAFT-v0.1.md`.
> The v0.1 draft treated Git commits as incidents. That was incorrect.
> A commit is evidence that something happened, not the event itself.

---

## What This Report Is

A reconstruction of FMI's failure history from available evidence. It maps raw evidence (commits, logs, reports) through symptoms to unified causal incidents, root causes, and systemic weaknesses.

## Historical Coverage Limits

| Source | Status |
|---|---|
| Git history (720 commits) | Complete from repository inception |
| VPS runtime logs | Partial — current container window only (~days) |
| Browser/client errors | Not centrally captured — no surviving records |
| Developer-reported issues | Partial — inferred from commit messages |

---

## Confirmed Systemic Weaknesses

These are architectural patterns — not individual bugs — that caused multiple separate failures across the project's lifetime.

### Weakness W-001 — No Single Source of Truth for Production
**Evidence:** INC-001 (Global API outage caused by VPS drift from repo)
**Pattern:** A developer edited production directly. The repository became a historical artifact rather than the source of truth. No CI check existed to catch the divergence.
**Controls Required:** Git-only deployments, CI syntax validation, commit verification post-deploy, health checks.
**Status:** Partially mitigated (FMI Engineering Constitution established). CI/CD pipeline not yet built.

### Weakness W-002 — No Unified Storage Abstraction
**Evidence:** INC-002 (60+ commits touching upload/image/storage across 2+ years)
**Pattern:** Every feature area independently implemented file upload: profile pictures, portfolio images, project photos, hero images. Each implementation had different assumptions about `Content-Type`, storage backend (Render ephemeral → base64-in-DB → Docker volume), and error handling. A single correct fix in one place did not propagate to others.
**Controls Required:** Unified `StorageService`, storage integration tests, audit of all current upload paths.
**Status:** OPEN — not yet audited on the current VPS architecture.

### Weakness W-003 — Business Rules Exist Only in the Frontend
**Evidence:** INC-003 (Contact unlock bypass — workers unlocking for free), multiple role-based routing issues, dashboard access errors
**Pattern:** Business rules (who can unlock what, who pays, what role gets access to which feature) were encoded as UI conditionals rather than backend policies. This means a correctly-built request bypassing the UI could violate the rule.
**Controls Required:** Backend-enforced policies for every rule, canonical business-rules document, authorization tests.
**Status:** OPEN.

### Weakness W-004 — Auth/Session Layer Has Been Modified Without Tests
**Evidence:** INC-004, 37+ commits touching auth/session/middleware
**Pattern:** The authentication middleware has been replaced, patched, and worked around at least twice. Each modification was made to fix an immediate symptom without a regression test to prevent re-introduction.
**Controls Required:** Auth regression test suite, dedicated auth audit.
**Status:** OPEN — Auth audit is Step 5 of the Master Stability Audit.

### Weakness W-005 — No Infrastructure Resource Limits
**Evidence:** INC-005 (MySQL OOM crash)
**Pattern:** Containers were launched without memory limits, allowing a single container to exhaust the VPS and crash the entire platform.
**Controls Required:** Memory limits on all containers, VPS memory monitoring.
**Status:** Partially mitigated (memory limit added). Monitoring not yet in place.

---

## Honest Reliability Metrics

> These metrics reflect what can be proven from available evidence, not what was generated from commit counts.

| Metric | Value | Confidence |
|---|---|---|
| Unified incidents confirmed | 5 | CONFIRMED |
| Incidents with confirmed root cause | 3 (INC-001, INC-002, INC-005) | CONFIRMED |
| Incidents with partially known root cause | 2 (INC-002, INC-003) | INFERRED |
| Incidents with unknown root cause | 1 (INC-004 auth) | UNKNOWN |
| Systemic weaknesses identified | 5 | INFERRED |
| Production data corruption confirmed | Yes (INC-003 / fix-unlocks script) | CONFIRMED |
| Highest blast-radius incident | INC-001 (global outage) | CONFIRMED |
| Most repeatedly touched codebase area | Storage/Upload (60+ commits) | CONFIRMED |
| Incidents with a prevention control in place | 1 (INC-005 memory limit) | CONFIRMED |

---

## What This Report Does NOT Claim

- That 455 incidents occurred (that was a commit count, not an incident count)
- That all historical failures have been recovered (log retention is limited)
- That the 5 weaknesses listed are exhaustive (audit is ongoing)
- That any weakness is "fixed" — only that controls exist or are pending

---

## Next Steps (Master Stability Audit Sequence)

1. `[x]` Historical failure analysis (this document)
2. `[ ]` Populate prevention-controls.md for W-001 through W-005
3. `[ ]` Architecture audit (`02-ARCHITECTURE/`)
4. `[ ]` API contract documentation (`API_SPECIFICATION.md`)
5. `[ ]` Authentication audit — specifically address INC-004 and W-003
6. `[ ]` Storage audit — address INC-002 and W-002
7. `[ ]` Business rules audit — address INC-003 and W-003
8. `[ ]` Golden flows (Homeowner → Professional → Worker → Supplier → Builder → Admin)
9. `[ ]` Security audit
10. `[ ]` Regression test suite
11. `[ ]` Release certification
