# Reliability Metrics
> Revision: v0.3

> [!CAUTION]
> v0.1 figures (287, 72, 63 etc.) were commit counts, not incident counts. Retracted. See `historical-failure-analysis-DRAFT-v0.1.md`.

---

## Runtime Failure Event Summary

Derived from surviving logs (2026-07-15 to 2026-08-20). These are **event counts**, not incident counts.

| Runtime Failure | Event Count | Unified Incident |
|---|---|---|
| `Class "Redis" not found` | 821 | INC-002 (1 incident) |
| `ParseError: Unclosed '{'` | 128 | INC-001 (1 incident) |
| `MySQL SQLSTATE Connection Refused` | 1 | INC-003 (1 incident) |
| `Duplicate key name` migration | 3 | INC-004 (1 incident) |
| `Incomplete object: LengthAwarePaginator` | 1 | INC-001 (same session) |
| `intl extension required` | 1 | Not an incident — appeared during manual `db:show` |

---

## Confirmed Incident Metrics (v0.3)

| Metric | Value | Confidence |
|---|---|---|
| Unified incidents with confirmed root cause | 3 (INC-001, INC-004, INC-005) | `CONFIRMED` |
| Unified incidents with inferred root cause | 2 (INC-002, INC-003) | `INFERRED` |
| Incidents with unknown root cause | 0 | — |
| Production data corruption confirmed | Yes — `fix-unlocks` repair script required | `CONFIRMED` |
| Highest blast-radius incident | INC-001 (total platform outage) | `CONFIRMED` |
| Longest undetected failure window | INC-001: unknown — no alert existed | `CONFIRMED` |
| Incidents with a complete prevention control | 1 (INC-005: MySQL memory limit) | `CONFIRMED` |

---

## Systemic Weakness Hypothesis Status

| ID | Hypothesis | Root Cause Status | Required to Confirm |
|---|---|---|---|
| W-001 | No source of truth for production | `CONFIRMED` | Done — INC-001 proven |
| W-002 | No unified storage abstraction | `INFERRED` | Code audit of all upload implementations |
| W-003 | Business rules only in frontend | `HYPOTHESIS` | Backend endpoint testing for role enforcement |
| W-004 | Auth layer modified without tests | `INFERRED` | Auth audit — determine current middleware state |
| W-005 | No container resource limits | `CONFIRMED` | Done — INC-002, INC-003, INC-005 collectively proven |

---

## What Cannot Be Measured Yet

| Metric | Reason |
|---|---|
| Mean time to detect | No monitoring existed — detections were manual/user-reported |
| Mean time to recover | No formal incident timestamps; estimated from commit dates only |
| Regression recurrence rate | Cannot track without automated test coverage |
| Client-side error rate | No frontend error monitoring; no surviving browser logs |
| Prior-platform incident history | Render/Railway logs decommissioned — not recoverable |
