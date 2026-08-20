# FMI Historical Reliability Report

**Project Age (approx):** 720 commits
**Known Incidents:** 455
**Root-cause families:** 5

## Top Systemic Weaknesses
### 1. VIBE_CODE_REGRESSION
- **Incidents:** 287
- **Permanent Control Required:** Automated regression tests, E2E Golden Flows, strict PR reviews

### 2. STORAGE_FAILURES
- **Incidents:** 72
- **Permanent Control Required:** Storage integration tests, unified upload abstraction

### 3. API_CONTRACT_DRIFT
- **Incidents:** 63
- **Permanent Control Required:** API contract tests, formal schema validation, typed API generation

### 4. DATABASE_COUPLING
- **Incidents:** 22
- **Permanent Control Required:** Migration integration tests, Strict strict DB testing, No raw SQL

### 5. DEPLOYMENT_DRIFT
- **Incidents:** 11
- **Permanent Control Required:** Git-only deployments, CI syntax check, deployment verification, Rollback procedure

