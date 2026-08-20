# FindMyInterior Engineering Constitution

## 1. One Source of Truth
Production is an output of the repository, never the place where source code is authored. The flow is strictly: Git -> Build -> Test -> Deploy -> Production.

## 2. No Direct Production Fixes
Never casually SSH into production and edit files. In an emergency: reproduce locally -> permanent source-code fix -> commit -> test -> deploy -> verify.

## 3. Mandatory CI/CD
Every meaningful push must pass automated checks (Lint, Type check, Syntax, Tests, Build) before production. If a check fails, production deployment stops.

## 4. Controlled Database Changes
The database is business state. Every schema change requires a migration, testing, and backup.

## 5. Explicit API Contracts
For every API route, we must define: Authentication, Role, Request Body, Validation, Responses, HTTP Status, and Side Effects.

## 6. Backend-Enforced Business Rules
Business rules (e.g. only workers apply to labour requirements) belong in the domain/backend layer, not just the frontend UI.

## 7. Observable Actions
Every important action must be logged with timestamp, user, entity, request_id, result, and error. Trace, do not guess.

## 8. Error Monitoring
Centralized and searchable logs for Frontend, Backend, API, DB, Storage, Auth, and Payments.

## 9. Health Checks
The system must expose a `/api/health` endpoint verifying Application, Database, Storage, Cache, and Queue states.

## 10. Automated Regression Tests
Critical changes trigger mandatory regression test execution (e.g. Auth changes require retesting Login, Logout, Session, Permissions, etc.).

## 11. End-to-End "Golden Flows"
Release gates require complete flow testing for every major role (Homeowner, Professional, Worker, Supplier, Builder, Admin).

## 12. Security is Part of "Done"
Test data isolation, role manipulation, untrusted input, and private API access.

## 13. Backup + Rollback
Every deployment must be recoverable.

## 14. Environment Management
Strict separation of Development, Staging, and Production. Secrets are never hard-coded.

## 15. Version Control Everything
Code, Migrations, API Definitions, Business Rules, Deploy Config, Tests, and Documentation.

## 16. Definition of Done
A feature is done only when: Requirement defined, Business rules defined, Frontend implemented, Backend implemented, Database validated, Permissions tested, Error states handled, Logs observable, Automated tests pass, E2E flow tested, Regression tested, Security checked, Production deployed, Production smoke test passed, Git state matches production.
