# FMI MASTER PRODUCTION-GRADE ENGINEERING & STABILITY DIRECTIVE

## 0. PURPOSE

FindMyInterior (FMI) must be treated as a **real production system**, not a prototype.

The goal is not merely to make features work.

The goal is to make the platform:

* predictable
* testable
* recoverable
* observable
* secure
* data-safe
* maintainable
* resistant to regression
* capable of safely recovering from transient infrastructure failures
* incapable of silently corrupting production data

**Never optimize for "looks fixed." Optimize for verified system correctness.**

A feature is NOT considered complete because code was written.

A feature is complete only when:

`	ext
Requirement
? Business rule
? Implementation
? Automated test
? Integration verification
? Regression verification
? Production smoke test
? Evidence recorded
? Known-good commit
`

---

# 1. ABSOLUTE ENGINEERING PRINCIPLES

These rules are permanent.

## 1.1 One Source of Truth

Git repository = application source of truth.

Production must never be manually edited.

Never:

* patch production files manually
* modify production source over SSH
* bypass Git deployment
* maintain undocumented production-only code

Production must always correspond to a known Git commit.

---

## 1.2 Data Preservation First

NEVER intentionally or accidentally:

* delete production data
* truncate production tables
* reset production database
* run destructive seeders
* drop production volumes
* overwrite production records during refactoring
* rewrite production data as part of normal deployment

Any operation capable of changing production data requires:

`	ext
Verified backup
+
Verified restoration
+
Explicit migration plan
+
Rollback/recovery strategy
`

**Application rollback and database rollback are separate systems.**

Never automatically roll back the production database merely because an application deployment failed.

---

## 1.3 No Blind Automation

Never allow an AI agent to "fix" production data because a failure appears obvious.

Safe automation may:

* retry transient connections
* restart unhealthy services
* stop deployments
* roll back application code
* fail fast
* create incidents
* collect diagnostics

Unsafe automation must STOP and escalate:

* migration corruption
* inconsistent production records
* suspected data corruption
* destructive schema change
* irreversible data transformation

---

## 1.4 Evidence Before Claims

Every claim must be supported by evidence.

Use these statuses:

`	ext
VERIFIED
IMPLEMENTED
DISCOVERED
REMAINING
BLOCKED
UNKNOWN
`

Never say "fixed" when only code exists.

Never say "verified" unless tests/evidence actually prove it.

Never classify an inferred cause as confirmed without direct evidence.

---

# 2. SYSTEM ARCHITECTURE

FMI and TrueDial databases are now **separate systems**.

Do not recreate the old combined-database architecture.

## 2.1 FMI database

Owns FMI data only.

Example:

`	ext
FMI DB
+-- users
+-- projects / requirements
+-- bids / project quotes / applications / quotations
+-- worker_jobs
+-- rfqs
+-- listings
+-- wallets
+-- wallet_transactions
+-- payments
+-- contact_unlocks
+-- reviews
+-- bookmarks
+-- ventures
+-- documents
+-- other FMI-owned tables
`

## 2.2 TrueDial database

Owns TrueDial data only.

FMI must NOT:

* migrate TrueDial tables
* drop TrueDial tables
* assume TrueDial schema
* use TrueDial transactions as if they were FMI transactions

TrueDial must NOT perform FMI database mutations.

Communication between the systems must happen explicitly through application services/API/database connections.

---

# 3. DATABASE RELIABILITY ARCHITECTURE

Create and maintain:

`	ext
FMI-STABILITY/
+-- 10-DATABASE-RELIABILITY/
    +-- database-architecture.md
    +-- connection-policy.md
    +-- schema-parity.md
    +-- migration-policy.md
    +-- backup-policy.md
    +-- restore-policy.md
    +-- database-health.md
    +-- database-incidents.md
    +-- recovery-policy.md
    +-- runbooks/
        +-- mysql-unavailable.md
        +-- mysql-oom.md
        +-- migration-failure.md
        +-- schema-drift.md
        +-- backup-failure.md
        +-- connection-pool-exhaustion.md
        +-- corruption-suspected.md
`

These documents become the permanent database reliability layer.

---

# 4. DATABASE FAILURE PREVENTION

The database system must prevent and detect:

## 4.1 Startup race

Current historical failure:

`	ext
Laravel starts
? MySQL not ready
? SQLSTATE[HY000] [2002] Connection refused
`

Requirements:

* MySQL healthcheck
* backend waits for healthy MySQL
* readiness endpoint checks actual DB connectivity
* startup retry where appropriate

---

## 4.2 OOM / resource exhaustion

MySQL must have measured resource limits.

Monitor:

* RAM
* CPU
* disk
* connection count
* query latency
* container restarts

Never automatically increase resources blindly.

---

## 4.3 Migration failures

Never allow deployment to continue after migration failure.

Required flow:

`	ext
Deploy
? migration
? migration failure
? deployment FAILED
? application rollback
? database remains untouched
? incident created
`

Do NOT automatically edit migrations and retry.

Do NOT automatically restore production DB unless explicitly approved by a human.

---

## 4.4 Schema drift

Required invariant:

`	ext
Migration history
=
Expected production schema
`

Every release should record:

`	ext
application commit
migration state
schema fingerprint
database version
`

Before deployment:

`	ext
Expected schema
vs
Actual schema
`

must be checked where practical.

If incompatible:

`	ext
DEPLOYMENT BLOCKED
`

---

## 4.5 Duplicate migration/index problems

Prevent recurrence of failures such as:

`	ext
Duplicate key name 'listings_user_id_index'
`

Before release:

* validate migration history
* detect duplicate schema operations
* ensure migration is idempotent where possible
* verify fresh schema
* verify upgrade-from-existing-schema path

---

## 4.6 Backup integrity

A backup file existing is NOT proof of a backup.

Required:

`	ext
Backup
? file validation
? content validation
? isolated restore
? row-count check
? integrity verification
? VERIFIED backup
`

Backups must exist outside the VPS as well.

Maintain:

* daily backups
* weekly backups
* pre-deployment backups
* pre-migration backups

Never assume an untested backup is recoverable.

---

# 5. SELF-HEALING ARCHITECTURE

FMI should self-heal only where recovery is safe.

## Level 1 — Transient request recovery

Safe transient failures:

* connection timeout
* temporary connection reset
* temporary service unavailable
* deadlock where retry is safe

Use:

`	ext
short retry
? exponential backoff
? limited attempts
? fail cleanly
`

Never blindly retry:

* syntax errors
* constraint violations
* migration failures
* invalid business operations
* suspected corruption

---

## Level 2 — Service recovery

If MySQL/Redis becomes unhealthy:

`	ext
healthcheck fails
? service restart policy
? healthcheck again
? verify readiness
`

Never restart blindly during known dangerous DB operations.

---

## Level 3 — Circuit breaker

If DB repeatedly fails:

`	ext
DB unhealthy
? circuit opens
? fail fast
? protect connection pool
`

When DB becomes healthy:

`	ext
health verified
? circuit closes
? traffic resumes
`

---

## Level 4 — Deployment protection

If DB readiness is unhealthy:

`	ext
BLOCK DEPLOYMENT
`

Never deploy into an already unhealthy database environment.

---

## Level 5 — Corruption protection

If corruption is suspected:

`	ext
STOP
? preserve evidence
? block writes where necessary
? create incident
? verify backups
? restore into isolated recovery environment
? human-approved recovery
`

**Never auto-rewrite production data.**

---

# 6. DATABASE HEALTH MODEL

Maintain separate statuses:

`	ext
LIVE
READY
DEGRADED
CRITICAL
`

Example:

`	ext
LIVE:
application process exists

READY:
MySQL ?
Redis ?
Storage ?

DEGRADED:
MySQL ?
Redis ?

CRITICAL:
MySQL ?
`

Endpoints:

`	ext
GET /api/health/live
GET /api/health/ready
`

Readiness must reflect actual dependencies.

---

# 7. PRODUCTION ERROR HANDLING

Users must never receive raw technical database errors.

User-facing:

`	ext
We're temporarily unable to load this data.
Please try again in a moment.
`

Engineering-facing logs must include:

`	ext
Incident ID
Severity
Environment
Timestamp
Service
Database
Exception class
SQLSTATE
Endpoint
Request ID
User/actor where appropriate
Stack trace
Likely cause
Automatic recovery attempted
Recovery result
Customer impact
`

Example:

`	ext
FMI DATABASE INCIDENT

Incident: DB-2026-XXXX-001
Severity: P1
Environment: Production

Component:
FMI MySQL

Error:
SQLSTATE[HY000] [2002] Connection refused

Affected:
Projects / Listings / Dashboard

Automatic action:
DB healthcheck failed
Restart attempted

Recovery:
SUCCESS

Verification:
SELECT 1          PASS
Schema check      PASS
Readiness check   PASS

Impact:
18 seconds

Follow-up:
INC-XXXX
`

---

# 8. CURRENT HISTORICAL DATABASE FAILURE FINDINGS

These have been observed historically and must remain in the reliability knowledge base.

## DB-001 — MySQL startup race

`	ext
Laravel started before MySQL was ready
? Connection refused
`

Status: prevention implemented.

---

## DB-002 — MySQL resource exhaustion

Insufficient resource controls increased risk of MySQL instability/OOM.

Status: resource controls implemented; continue monitoring.

---

## DB-003 — Redis runtime failure

Historical:

`	ext
Class "Redis" not found
`

Do not classify this as a MySQL failure, but keep it as infrastructure dependency failure.

Status: health monitoring implemented.

---

## DB-004 — Duplicate migration/index

Example:

`	ext
Duplicate key name 'listings_user_id_index'
`

Root family:

`	ext
MIGRATION_DISCIPLINE
`

---

## DB-005 — Schema drift

Examples:

* missing worker_jobs-related schema
* missing project/RFQ fields
* missing supplier views_count in integration

Root family:

`	ext
SCHEMA_DRIFT
`

---

## DB-006 — Duplicate/overlapping migrations

Multiple migrations attempted overlapping changes.

Root family:

`	ext
MIGRATION_DISCIPLINE
`

---

## DB-007 — Seeder/foreign-key failures

Seeders violated DB relationship ordering/constraints.

Root family:

`	ext
TEST_AND_BOOTSTRAP_DATA
`

---

## DB-008 — SQLite vs MySQL test mismatch

Default PHPUnit setup historically used SQLite while production used MySQL.

This reduced confidence in the regression suite.

Root family:

`	ext
TEST_ENVIRONMENT_PARITY
`

Permanent rule:

**Critical integration tests must use MySQL.**

---

## DB-009 — Integration transaction/deadlock problems

Multiple connections:

`	ext
mysql
truedial
auth
`

caused test transaction locking issues.

Previous truncation approaches also caused schema/test-state instability.

Root family:

`	ext
TEST_ISOLATION
`

Do not use manual destructive cleanup as normal test behavior.

---

## DB-010 — Broken seeding / tenant state

FindMyInteriorSeeder previously called an outdated TenantContext interface.

Result:

`	ext
seeding failed
? tenants not created
? TenantResolver rejected requests
? widespread 404s
`

Seeder must fail loudly.

A partial seed must be considered a failed environment.

---

## DB-011 — Legacy Base64 image storage

Large data:image/... payloads stored in DB columns.

Root family:

`	ext
STORAGE_ARCHITECTURE
`

Status: migration pending.

---

## DB-012 — Incorrect DB uniqueness semantics

Contact unlock uniqueness originally did not fully reflect polymorphic/domain types.

Database constraints must represent the real business domain.

---

## DB-013 — Duplicate models representing same DB table

Requirement and obsolete Project represented the same projects table with different behavior.

This must be eliminated/contained as a source-of-truth problem.

---

## DB-014 — Broken backup mechanism

Backup files were generated that were not actually usable because the DB client/authentication combination could not correctly dump MySQL 8.

Status: backup mechanism changed and restore verified.

Permanent rule:

**Backup is VERIFIED only after restore.**

---

# 9. FMI ENGINEERING AUDIT STATUS

## Completed

`	ext
C-0 Production Safety                    ?
Historical Failure Analysis             ?
C1-0 API Contracts                       ?
C1-1 Marketplace                        ?
C1-2 Ownership/AuthZ                    ?
C1-3 Financial Integrity                ?
C1-4 Public/Search/Privacy              ?*
C1-5 Admin/CRM/Audit                    ?
`

* Historical/schema/test-environment findings may still have follow-up work. Keep them tracked; do not erase them from history.

---

# 10. C1-1 MARKETPLACE RULES

Do not allow generic business actions whose meaning depends only on caller-supplied type.

Canonical routes:

`	ext
POST /api/v1/projects/{id}/quotes
POST /api/v1/worker-jobs/{id}/apply
POST /api/v1/rfqs/{id}/quotes
`

Rules:

`	ext
Professional ? Project Quote
Worker ? Job Application
Supplier ? RFQ Quotation
`

Existing ids table remains for data preservation.

Domain models:

`	ext
ProjectQuote
JobApplication
RfqQuotation
`

Server must enforce type invariants.

---

# 11. C1-2 OWNERSHIP RULE

Every protected operation must satisfy:

`	ext
ALLOW =
authenticated
AND role_allowed
AND resource_visible
AND ownership_or_relationship_valid
AND state_allows_action
AND business_rule_allows_action
`

HTTP semantics:

`	ext
401 = authentication failure
403 = authenticated but forbidden
404 = private resource existence must be hidden
409 = state conflict
422 = invalid input
`

Nested resource IDs must always be checked.

Example:

`	ext
Project 10
Quote 999 belongs to Project 20

/projects/10/quotes/999/award
? reject
`

---

# 12. C1-3 FINANCIAL RULES

## Wallet

`	ext
Normal user cannot manually credit wallet
Admin adjustment requires reason
Every wallet mutation produces transaction history
Balance cannot become negative
`

## Unlock

`	ext
Eligibility checked inside transaction
Wallet locked appropriately
Duplicate unlock cannot charge twice
Unlock + debit + transaction record must be atomic
`

## Payment

`	ext
Payment can fulfill exactly once
Use row locking
Only pending/created payment may be fulfilled
Replay must not add money twice
Invalid signature changes nothing
`

## Reconciliation

Every wallet must satisfy:

`	ext
opening balance
+ credits
- debits
=
current balance
`

---

# 13. C1-4 PUBLIC API RULES

Public endpoints must:

* expose only allowed fields
* never leak private phone/email
* never expose wallet balances
* never expose tokens/passwords
* never expose private documents
* use centralized contact privacy

Contact visibility:

`	ext
Owner
Admin
Premium
Explicitly unlocked user
`

according to canonical FMI policy.

Pagination:

`	ext
default = 20
min = 1
max = 100
`

For search specifically, preserve the existing product contract unless a deliberate API contract change is approved.

Ordering must be deterministic:

`	ext
business sort
+
id DESC tie-breaker
`

Resources serialize.

Controllers/services determine eager loading.

No hidden DB queries inside Resources.

---

# 14. C1-5 ADMIN RULES

Admin is powerful but NOT unlimited.

Admin mutations require:

`	ext
who
what
resource
before
after
when
why
`

Audit logs must be append-only.

No editing/deleting historical audit records.

Project moderation uses explicit actions:

`	ext
APPROVE
REJECT
SUSPEND
RESTORE
CLOSE
FLAG
`

Do not provide unrestricted "set any status" behavior.

Wallet admin adjustments:

`	ext
ADMIN_CREDIT
ADMIN_DEBIT
`

with mandatory reason and transaction/audit record.

Do not create generic project-payment refunds if FMI does not hold those funds.

---

# 15. C1-6 FULL GOLDEN FLOWS

Next major reliability stage.

Test full journeys.

## Homeowner

`	ext
Register
? Login
? Search
? View Professional
? Post Project
? Upload
? Receive Quote
? Shortlist
? Award
? Progress
? Complete
? Review
`

## Professional

`	ext
Register
? Profile
? Portfolio
? Discover Project
? Quote
? Award
? Progress
? Complete
`

## Worker

`	ext
Register
? Find Job
? Apply
? Shortlist
? Hire
? Complete
`

## Supplier

`	ext
Register
? Profile
? Find RFQ
? Submit Quotation
? Award
? Progress
`

## Builder

`	ext
Register
? Create Labour Job
? Receive Applications
? Hire Worker
? Progress
? Complete
`

## Admin

`	ext
Login
? Verify
? Moderate
? Wallet Adjustment
? CRM
? Audit
`

Every Golden Flow must test:

`	ext
happy path
wrong role
wrong owner
wrong state
refresh
logout/login
existing data
deployment survival
`

---

# 16. LEGACY STORAGE MIGRATION

Do NOT migrate Base64 production data yet.

This must be a separate controlled project.

Sequence:

`	ext
Inventory
? backup
? dry-run
? migration design
? batch migration
? verify
? dual-read
? only then deprecate legacy storage
`

No existing record may be invalidated until the replacement has been verified.

---

# 17. FINAL SECURITY AUDIT

After C1-6:

Audit:

`	ext
authentication
authorization
IDOR
privilege escalation
admin abuse
file upload security
sensitive data exposure
payment abuse
rate limiting
session/token behavior
`

Every finding gets an incident ID and regression test.

---

# 18. FINAL PERFORMANCE AUDIT

Audit:

`	ext
N+1
slow queries
indexes
DB connections
memory
CPU
API latency
payload size
search performance
image handling
concurrency
`

Do not optimize blindly.

Measure first.

---

# 19. FINAL DATABASE CERTIFICATION

Before FMI can be declared production-ready:

`	ext
[ ] FMI DB isolated from TrueDial DB
[ ] connection policies documented
[ ] health checks implemented
[ ] schema parity verified
[ ] migration history validated
[ ] migration failure blocks deployment
[ ] backup verified by actual restore
[ ] external backup exists
[ ] DB recovery procedure tested
[ ] DB incidents generate incident IDs
[ ] transient errors retry safely
[ ] circuit breaker exists where justified
[ ] deployment blocked when DB unhealthy
[ ] data corruption triggers STOP
[ ] no automatic destructive recovery
`

---

# 20. DEPLOYMENT SAFETY

Every deployment:

`	ext
Local HEAD
=
origin/main
`

Record:

`	ext
previous production commit
new commit
migration state
schema state
backup
volumes
health status
`

Deploy:

`	ext
code
? migrate only if explicitly safe
? verify health
? verify database
? verify storage
? verify APIs
? smoke test
`

If application fails:

`	ext
application rollback
`

Database is NOT automatically rolled back.

---

# 21. TESTING STANDARD

Critical integration tests must use MySQL.

Do not depend on SQLite to prove production correctness.

Test infrastructure must NOT require:

* killing MySQL processes manually
* manually truncating databases
* manually repairing missing tenants
* silently ignoring seeder failures

Any test environment failure must be treated as an engineering incident.

---

# 22. INCIDENT LEDGER

Every verified failure gets:

`	ext
INC-ID
Date
Severity
Environment
Symptom
Root cause
Evidence
Impact
Fix
Prevention control
Regression test
Status
`

A fix is incomplete until a prevention control exists.

---

# 23. FINAL DEFINITION OF "PRODUCTION-GRADE"

FMI is production-grade when:

`	ext
A bug occurs
? system detects it
? user gets safe message
? engineers get exact error
? transient failures recover automatically
? dangerous failures stop safely
? deployment blocks when dependencies are unhealthy
? data is preserved
? backup exists
? restore is proven
? incident is recorded
? regression test is created
? prevention control is added
`

The target is NOT:

> "There will never be an error."

The realistic production-grade target is:

> **Errors will be detected quickly, contained safely, explained precisely, recovered automatically when safe, and prevented from recurring when the root cause is known.**

---

# 24. CURRENT EXECUTION ORDER

The code editor MUST NOT jump randomly between modules.

Follow this sequence:

`	ext
C0
?
Historical Reliability
?
C1-0
?
C1-1
?
C1-2
?
C1-3
?
C1-4
?
C1-5
?
C1-6 Full Golden Flows
?
Database Reliability Foundation
?
Security Audit
?
Performance Audit
?
Legacy Storage Migration
?
Final Production Certification
`

Open incidents remain visible throughout.

---

# 25. MOST IMPORTANT OPERATING RULE

**Do not blindly make changes just because a checklist exists.**

For every problem:

`	ext
Observe
? Reproduce
? Identify root cause
? Write regression test
? Make minimum safe change
? Run affected tests
? Run previous regression suite
? Verify production behavior
? Record evidence
? Commit
`

If a change breaks another subsystem:

`	ext
STOP
? investigate
? fix root cause
? regression
`

Never stack unverified fixes.

---

# 26. FINAL INSTRUCTION TO THE CODE AGENT

Treat this document as the **FMI Engineering Constitution + Production Reliability Runbook**.

Before modifying anything:

1. Inspect the relevant existing architecture.
2. Identify dependencies.
3. Identify data impact.
4. Identify production risk.
5. Check the Incident Ledger.
6. Check existing regression tests.
7. Make the smallest safe change.
8. Verify it.
9. Record evidence.
10. Update the stability documentation.

**Do not modify VPS credentials.**

**Do not use production as a testing environment.**

**Do not perform destructive production database operations.**

**Do not silently bypass failures.**

**Do not declare a phase complete without evidence.**

**Do not trade data safety for speed.**

The objective is to turn FindMyInterior from a feature-complete application into a **controlled, observable, recoverable, production-grade platform.**
