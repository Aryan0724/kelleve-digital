# Reliability Metrics
> Revision: v0.2

> [!CAUTION]
> v0.1 of this file showed: VIBE_CODE_REGRESSION: 287, STORAGE: 72, etc.
> Those were commit counts, not incident counts. They have been retracted.

## Confirmed Incident Counts (v0.2)

| Family | Confirmed Incidents | Evidence Confidence |
|---|---|---|
| `DEPLOYMENT` | 1 (INC-001) | CONFIRMED |
| `STORAGE` | 1 (INC-002) | CONFIRMED (root cause INFERRED) |
| `BUSINESS_LOGIC` | 1 (INC-003) | CONFIRMED (root cause INFERRED) |
| `AUTH` | 1 (INC-004) | CONFIRMED (root cause UNKNOWN) |
| `INFRASTRUCTURE` | 1 (INC-005) | CONFIRMED |
| All other families | 0 confirmed — audit ongoing | N/A |

## Systemic Weakness Status

| Weakness | Family | Prevention Control | Status |
|---|---|---|---|
| W-001: No source of truth for production | `DEPLOYMENT` | Git-only deployments + CI | Partial |
| W-002: No unified storage abstraction | `STORAGE` | StorageService + integration tests | OPEN |
| W-003: Business rules in frontend only | `BUSINESS_LOGIC` + `AUTHZ` | Backend policies + contract tests | OPEN |
| W-004: Auth layer modified without tests | `AUTH` | Auth regression suite | OPEN |
| W-005: No container resource limits | `INFRASTRUCTURE` | Memory limits + monitoring | Partial |

## What Cannot Be Measured Yet

| Metric | Reason |
|---|---|
| Mean time to detect | No centralized monitoring — all detections were manual |
| Mean time to recover | No formal incident timestamps — estimated from commit dates |
| Regression recurrence rate | Requires automated test coverage to track |
| Client-side error rate | No frontend error monitoring in place |
