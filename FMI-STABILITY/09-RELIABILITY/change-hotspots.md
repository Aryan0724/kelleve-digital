# Change Hotspots
> Generated from 720 commits of git history.

A "change hotspot" is a codebase area with an unusually high number of corrective commits (bug fixes, reverts, hotfixes). High corrective-commit density indicates either: (a) the area is inherently complex, (b) it lacks automated protection, or (c) it has a structural problem that generates repeated symptoms.

> [!IMPORTANT]
> A high corrective count does **not** automatically mean that area has a systemic weakness. It means it **deserves priority attention** during the audit. The root cause of the churn must still be determined through evidence.

---

## Hotspot Rankings

| Rank | Component | Total Commits | Corrective Commits | Corrective % | Priority |
|---|---|---|---|---|---|
| 1 | Deployment / Build / CI | 119 | 80 | 67% | **CRITICAL** |
| 2 | Search / Listing Discovery | 102 | 68 | 67% | **HIGH** |
| 3 | Professional Profile | 97 | 62 | 64% | **HIGH** |
| 4 | Navbar / Layout | 77 | 51 | 66% | **MEDIUM** |
| 5 | Upload / Storage | 72 | 49 | 68% | **HIGH** |
| 6 | Dashboard | 71 | 49 | 69% | **HIGH** |
| 7 | API Routes / Controllers | 58 | 44 | 76% | **HIGH** |
| 8 | Unlock / Wallet / Payment | 57 | 35 | 61% | **HIGH** |
| 9 | Database / Migration | 43 | 30 | 70% | **MEDIUM** |
| 10 | Auth / Session / Middleware | 38 | 28 | 74% | **HIGH** |

---

## Analysis

### #1 — Deployment / Build / CI (80 corrective commits, 67%)
The highest corrective density. This covers Docker configuration, Render/Railway/Vercel/VPS deployment scripts, build failures, and syntax crashes. The fact that 2/3 of all deployment commits are corrections is direct evidence of W-001 (no controlled deployment process). This area has more corrective commits than any other component.

**Audit priority:** Confirmed W-001 territory. Address first via CI/CD pipeline.

### #2 — Search / Listing Discovery (68 corrective commits, 67%)
Search and listing discovery has been corrected 68 times. This suggests the search API contract (fields, slugs, filters, pagination) has drifted between frontend and backend repeatedly. However, this cannot be classified as `API_CONTRACT` until we verify field mismatches in the actual current implementation.

**Audit priority:** Included in API contract audit (Stage C).

### #5 — Upload / Storage (49 corrective commits, 68%)
Second-highest corrective percentage. Aligns with W-002 hypothesis (no unified storage abstraction). History shows at least three separate upload implementations: Render base64 workaround, FormData header fix, universal image cropper.

**Audit priority:** W-002 hypothesis verification — audit all upload implementations in current codebase.

### #7 — API Routes / Controllers (44 corrective commits, 76%)
The highest corrective percentage of any component. Controllers have been corrected three out of every four times they were touched. This is a strong signal that API behavior was repeatedly inconsistent with frontend expectations. However, this could reflect either API contract drift or simply iterative feature development.

**Audit priority:** API contract documentation and verification (Stage C).

### #8 — Unlock / Wallet / Payment (35 corrective commits, 61%)
Supports INC-003 evidence (contact unlock bypass, database corruption fix). The fact that a manual `fix-unlocks` database repair script exists is a strong signal that production data was in an inconsistent state.

**Audit priority:** Business rules audit. Test backend enforcement for all role/unlock combinations.

### #10 — Auth / Session / Middleware (28 corrective commits, 74%)
Second-highest corrective percentage. Middleware has been replaced at least once; 401/403 dashboard errors were fixed multiple times. High corrective density in auth is a significant risk signal.

**Audit priority:** Auth audit (Stage C, Step 1). Determine current middleware state before any changes.

---

## What This Does NOT Tell Us

- A high corrective count does not tell us whether those corrections were fixing the same bug repeatedly (regression) or different bugs (expanding feature set). That distinction requires per-commit analysis.
- Components not in the top 10 may still have serious unfixed issues — they simply have fewer recorded corrections.
- UI-only corrections (CSS, z-index, icon imports) are included in the counts and inflate the total without necessarily indicating architectural weakness.

---

## How to Use This During the Audit

When auditing each component in Stage C, check the hotspot ranking first:
- A high-ranked component should be assumed more likely to have undetected issues.
- A component with >70% corrective density should be treated as having inadequate test coverage until proven otherwise.
- Any component with a `fix-unlocks`-style manual repair script should be audited for data integrity.
