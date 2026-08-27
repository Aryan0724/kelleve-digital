# FINAL STAGE — Productionization, Data Restoration & Go-Live

After completing the Performance, Database Reliability, Security, and Storage Migration stages, the final objective is to make **FindMyInterior fully live and production-ready with the existing real data restored and functional**.

## 1. Production Data Restoration
We have existing production/backed-up data that must NOT be lost. Before touching production:
1. Locate and inventory all available backups.
2. Identify: Database backups/dumps, Uploaded files, User/profile data, Listings, Projects, Quotes, Worker jobs/applications, RFQs/quotations, Wallets, Payments, Reviews, Activity/audit logs.
3. Record backup timestamps, sizes, checksums and source environment.
4. Determine exactly which backup represents the latest valid production state.
5. NEVER overwrite or delete the original backup. Create a verified backup-of-backup before restoration.

## 2. Schema/Data Compatibility
Before importing data:
BACKUP -> INSPECT -> COMPARE WITH CURRENT SCHEMA -> MAP OLD TO NEW STRUCTURE -> VALIDATE -> DRY RUN -> RESTORE -> VERIFY

Pay particular attention to the C1-6 architectural changes:
- OLD: `bids` -> Projects, Worker Jobs, RFQs
- NEW: `bids` -> Projects, `job_applications` -> Worker Jobs, `rfq_quotations` -> RFQs

Do NOT simply force old `bids` records into the new tables. Create an explicit migration/data-mapping strategy where necessary. Preserve IDs where safe, timestamps, ownership, relationships, financial history, audit history. Do not silently discard records.

## 3. Production Database Separation
Finalize the new architecture where **FMI and TrueDial are separate database domains**.
- FindMyInterior -> FMI Database -> FMI tables/transactions
- TrueDial -> TrueDial Database -> TrueDial tables/transactions

No accidental cross-database transaction assumptions. Verify credentials, connection names, migrations, seeders, models, repositories, queues, scheduled jobs, authentication, tenant context. Each database must have an independently verifiable health state.

## 4. Production Schema Certification
Before restoration, run `php artisan migrate:status`. Verify that every required migration is present and applied (especially `job_applications`, `rfq_quotations`, contact unlock constraints, wallet/payment changes, audit logging, privacy, storage). Production must never be considered healthy merely because the application starts. The application AND database schema must be compatible.

## 5. Safe Data Restoration
Create `production_pre_restore_backup` and record state. During restore, use a controlled process.
NEVER run `DROP DATABASE`, `DROP TABLE`, `migrate:fresh`, destructive seeders, or blind SQL imports against production. If destructive operations are required, STOP and require explicit human approval.

## 6. Post-Restoration Data Verification
After restoration, automatically compare important invariants (Users before ≈ Users restored, etc).
Verify relational integrity (orphan projects = 0, orphan listings = 0, etc).
For financial records: `wallet.balance = SUM(valid wallet credits) - SUM(valid wallet debits)`.
Do not modify data merely to make these numbers match. If reconciliation fails, stop and report the discrepancy.

## 7. Restore Uploaded Files
Locate the backup of legacy uploaded assets. Restore them safely. Support both legacy Base64 assets + new filesystem/object storage assets until the migration is proven complete. Verify avatars, listing covers, gallery images, portfolio images, documents. Run broken-file detection.

## 8. Make Existing Data Actually Work
Do not stop after restoring database rows. Test the real restored data through the real API. Existing production data must behave like native data created by the current application.

## 9. Production Self-Diagnostics
Implement a production diagnostic system. Every serious failure should produce an incident log with Timestamp, Env, Commit, DB, Migration State, Endpoint, Error Type, SQLSTATE, Request ID, Trace ID, and Auto-Recovery attempts. Never expose sensitive DB details to the public API. Detailed diagnostic goes to internal logs.

## 10. Self-Healing Rules
Implement safe self-healing, not reckless self-modification.
- Automatically recoverable: Deadlock (retry transaction), Transient DB failure (retry+backoff), Redis failure, Network failure, Queue worker failure.
- NEVER automatically modify production data for: Schema mismatch, Data corruption, Missing migration, Foreign-key violation, Unexpected row counts, Financial reconciliation failure, Unknown database state. (DETECT -> STOP -> SNAPSHOT -> LOG -> ALERT -> REQUIRE HUMAN APPROVAL).

## 11. Automatic Deployment Safety
Production deployment must follow: Git commit -> Tests -> Build -> Migration check -> Backup verification -> Deploy -> Health checks -> Smoke tests -> SUCCESS.
If deployment fails: Application rollback. Database rollback must remain a separate deliberate operation.

## 12. Final Real-World Production Test
Perform tests across Public, Authentication, Homeowner, Professional, Worker, Supplier, Builder, and Admin flows against real restored production data.

## 13. Final Production Certification
Generate `FINAL_PRODUCTION_CERTIFICATION.md` containing all deployment context, reconciliation stats, health checks, and known limitations.
Final status must use: VERIFIED, IMPLEMENTED, DISCOVERED, REMAINING, BLOCKED. Do not call the system production-ready if any critical item is merely IMPLEMENTED.

# FINAL DEFINITION OF DONE
The goal is not "the application runs."
The goal is: The application + database + existing data + storage + authentication + payments + queues + infrastructure all work together reliably in production, with safe failure handling and a documented recovery path.
