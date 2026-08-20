# Evidence Index
> Revision: v0.2

This document maps every reliability finding in the register back to its raw historical evidence.
It also documents what evidence was NOT recoverable, to keep the analysis honest.

---

## Log Retention Limits

| Source | Earliest Record Available | Status |
|---|---|---|
| Git commits | Repository inception | Complete |
| Laravel logs (`storage/logs/laravel.log`) | Only current container — rotated on rebuild | Partial |
| Docker backend logs (`fmi_backend`) | Only current container window | Partial |
| Docker frontend logs (`fmi_frontend`) | Only current container window | Partial |
| `backend_errors.txt` (local) | 2026-08-08 (first log entry: ParseError) | Partial |
| Browser/client errors | Not captured centrally | Not available |
| Render/Railway deployment logs (prior platform) | Platform was decommissioned — logs gone | Not available |

---

## Evidence Events Mapped to Incidents

### INC-001 (Deployment Drift / Global API Outage)
| # | Type | Source | Date | Description |
|---|---|---|---|---|
| E-001-1 | `CONFIRMED` | `backend_errors.txt` L1–L51 | 2026-08-08 | ParseError in `routes/api.php:371` repeated across all API requests |
| E-001-2 | `CONFIRMED` | Local `php -l routes/api.php` | 2026-08-20 | No syntax errors detected in repo source — proves drift |
| E-001-3 | `CONFIRMED` | Commit `fe9bebe` | 2026-08-20 | Restored production to `origin/main` — resolved outage |
| E-001-4 | `INFERRED` | No surviving log | Unknown | Direct VPS edit caused the drift — no surviving evidence of when/who |

### INC-002 (Storage / Upload Failures)
| # | Type | Source | Date | Description |
|---|---|---|---|---|
| E-002-1 | `CONFIRMED` | Commit `7d41367` | Historical | Base64 storage workaround introduced for Render ephemeral FS |
| E-002-2 | `CONFIRMED` | Commit `623b623` | Historical | Axios Content-Type header causing upload failures |
| E-002-3 | `CONFIRMED` | Commit `46d205b` | Historical | FormData multipart header bug — same root cause, different location |
| E-002-4 | `CONFIRMED` | Commit `291cc279` | 2026-08-18 | Universal image cropper — 3rd upload implementation created |
| E-002-5 | `INFERRED` | Docker inspect (controlled deploy) | 2026-08-20 | `find-my-interior_storage_data` volume confirmed on VPS — base64 workaround may still be active |

### INC-003 (Contact Unlock / Wallet Corruption)
| # | Type | Source | Date | Description |
|---|---|---|---|---|
| E-003-1 | `CONFIRMED` | Commit `2d8c5a42` | 2026-08-19 | "fix worker job unlock visibility and database corruption bug" |
| E-003-2 | `CONFIRMED` | Commit `be008a62` | 2026-08-19 | `fix-unlocks` endpoint created as manual DB repair tool |
| E-003-3 | `CONFIRMED` | Commit `3a7c325c` | 2026-08-16 | "enforce wallet fee for all contact unlocks, removing free bypasses" |
| E-003-4 | `CONFIRMED` | Commit `7b7c36a` | Historical | Free unlock logic changed for skilled_worker role |

### INC-004 (Auth Middleware Issues)
| # | Type | Source | Date | Description |
|---|---|---|---|---|
| E-004-1 | `CONFIRMED` | Commit `bc78a9c5` | Historical | Replaced default Authenticate middleware to fix 401 errors |
| E-004-2 | `CONFIRMED` | Commit `8bf900e` | Historical | Resolved 500/403/404 in dashboard and opportunity controllers |
| E-004-3 | `UNKNOWN` | — | — | Current middleware state not audited — root cause unresolved |

### INC-005 (MySQL OOM Crash)
| # | Type | Source | Date | Description |
|---|---|---|---|---|
| E-005-1 | `CONFIRMED` | Commit `624339b6` | Historical | Memory limits added to MySQL container in docker-compose.yml |

---

## Raw Evidence Archives

| File | Location | Contents |
|---|---|---|
| `backend_errors.txt` | `d:/find my interior/backend_errors.txt` | Laravel production log dump (2026-08-08 era) |
| `frontend_errors.txt` | `d:/find my interior/frontend_errors.txt` | Frontend error log dump |
| `FMI-STABILITY/git_history_analysis.json` | Repository | Full 720-commit git history with metadata |
| `FMI-STABILITY/vps_logs_analysis.json` | Repository | Extracted VPS container logs |
