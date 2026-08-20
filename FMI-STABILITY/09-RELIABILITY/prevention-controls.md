# Prevention Controls

Permanent engineering controls mapped to each historical root-cause family.

## DEPLOYMENT_DRIFT
**Controls Required:** Git-only deployments, CI syntax check, deployment verification, Rollback procedure

## API_CONTRACT_DRIFT
**Controls Required:** API contract tests, formal schema validation, typed API generation

## DATABASE_COUPLING
**Controls Required:** Migration integration tests, Strict strict DB testing, No raw SQL

## STORAGE_FAILURES
**Controls Required:** Storage integration tests, unified upload abstraction

## VIBE_CODE_REGRESSION
**Controls Required:** Automated regression tests, E2E Golden Flows, strict PR reviews

