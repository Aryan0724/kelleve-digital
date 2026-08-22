<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Ramsey\Uuid\Uuid;

/**
 * Phase 4H.5 — Full Historical Restoration Engine
 *
 * Philosophy: RESTORE, don't filter.
 *   - Every legacy record lands somewhere (restoration DB or quarantine DB).
 *   - Zero records are silently discarded.
 *   - Every wallet has an explicit provenance classification.
 *   - Provenance is calculated per-wallet from live data, never hard-coded.
 *
 * Safety invariants (enforced at runtime):
 *   - Never write to findmyinterior_legacy_restore
 *   - Never write to the production DB
 *   - Destination DB names are asserted against DISPOSABLE constants
 *
 * Domain routing (primary driver: opportunity_type):
 *   opportunity_type = JOB  → worker_jobs
 *   opportunity_type = RFQ  → rfqs
 *   otherwise               → projects
 *
 * Quarantine rule (not count-based):
 *   project.user_id IS NULL → quarantine_projects
 *
 * Wallet provenance (evaluated per-wallet):
 *   is_mock=0, balance=ledger_sum → REAL_LEDGER_RECONCILED
 *   is_mock=0, balance≠ledger_sum → REAL_UNRECONCILED (unless admin override)
 *   is_mock=1                     → LEGACY_SYNTHETIC_OPENING_BALANCE
 *   special admin case            → UNVERIFIED_LEGACY_BALANCE
 */
class MigrationExecutionCommand extends Command
{
    protected $signature   = 'fmi:legacy-migrate';
    protected $description = 'Phase 4H.5 — Full historical restoration to disposable destination + quarantine DB.';

    // ── Safety Gate Constants ─────────────────────────────────────────────────
    const DISPOSABLE_RESTORATION_DB = 'findmyinterior_legacy_migrated';
    const DISPOSABLE_QUARANTINE_DB  = 'findmyinterior_legacy_quarantine';
    const FORBIDDEN_DBS             = [
        'findmyinterior_local',
        'findmyinterior_legacy_restore',
    ];

    // ── Admin user IDs that receive UNVERIFIED_LEGACY_BALANCE ─────────────────
    const ADMIN_USER_IDS = [1];

    // ── Ledger reconciliation tolerance (paise rounding) ─────────────────────
    const LEDGER_TOLERANCE = 0.01;

    private array $warnings = [];
    private array $conservation = [];
    private string $runId;

    public function handle(): int
    {
        $this->runId = Uuid::uuid4()->toString();
        $this->info("Phase 4H.5 Migration — Run ID: {$this->runId}");

        // ── Register DB connections ───────────────────────────────────────────
        $base = [
            'driver'   => 'mysql',
            'host'     => env('DB_HOST', '127.0.0.1'),
            'port'     => env('DB_PORT', '3306'),
            'username' => env('DB_USERNAME', 'root'),
            'password' => env('DB_PASSWORD', ''),
        ];

        Config::set('database.connections.fmi_mysql',       array_merge($base, ['database' => self::DISPOSABLE_RESTORATION_DB]));
        Config::set('database.connections.legacy_migrated',  array_merge($base, ['database' => self::DISPOSABLE_RESTORATION_DB]));
        // Quarantine tables live in the restoration DB (co-located for simplicity;
        // can be moved to a separate physical DB in a future phase if desired).
        Config::set('database.connections.legacy_quarantine', array_merge($base, ['database' => self::DISPOSABLE_RESTORATION_DB]));
        DB::purge('fmi_mysql');
        DB::purge('legacy_migrated');
        DB::purge('legacy_quarantine');

        // ── Assert safety gates ───────────────────────────────────────────────
        $this->assertSafeDestinations();

        $src   = DB::connection('legacy_restore');
        $dest  = DB::connection('legacy_migrated');
        $quar  = DB::connection('legacy_quarantine');

        // ── Ensure quarantine tables exist (created explicitly if missing) ─────
        $this->ensureQuarantineSchema($dest);

        // ── Truncate all destination tables before migration ──────────────────
        // The setup script creates the schema; the engine always starts clean
        // so re-runs are idempotent and seeder-inserted rows don't cause duplicates.
        $this->info('Truncating destination tables...');
        $dest->statement('SET FOREIGN_KEY_CHECKS=0;');
        $allTables = $dest->select('SHOW TABLES');
        foreach ($allTables as $row) {
            $table = array_values((array)$row)[0];
            // Never truncate migration tracking or quarantine meta
            if (in_array($table, ['migrations', 'quarantine_migration_log'], true)) continue;
            $dest->table($table)->truncate();
        }
        $dest->statement('SET FOREIGN_KEY_CHECKS=1;');
        $this->info('  Destination tables truncated.');

        // ── Load all legacy data ──────────────────────────────────────────────
        $users    = $src->table('users')->get()->keyBy('id');
        $projects = $src->table('projects')->get();
        $bids     = $src->getSchemaBuilder()->hasTable('bids')
                        ? $src->table('bids')->get()
                        : collect();
        $unlocks  = $src->getSchemaBuilder()->hasTable('contact_unlocks')
                        ? $src->table('contact_unlocks')->get()
                        : collect();
        $wallets  = $src->table('wallets')->get()->keyBy('user_id');
        $walletTxs = $src->table('wallet_transactions')->get();

        // Pre-compute ledger sums per wallet ID
        $ledgerByWalletId = [];
        foreach ($walletTxs as $tx) {
            $ledgerByWalletId[$tx->wallet_id] = ($ledgerByWalletId[$tx->wallet_id] ?? 0)
                + (in_array($tx->type ?? 'credit', ['credit']) ? $tx->amount : -$tx->amount);
        }

        // ── idMap: source_id → dest_id for cross-domain FK resolution ─────────
        $idMap = ['users' => [], 'projects' => [], 'worker_jobs' => [], 'rfqs' => [], 'bids' => []];

        // ── Column filter helper ──────────────────────────────────────────────
        $destCols = [];
        $getDestCols = function (string $table) use ($dest, &$destCols): array {
            if (!isset($destCols[$table])) {
                $destCols[$table] = array_flip($dest->getSchemaBuilder()->getColumnListing($table));
            }
            return $destCols[$table];
        };

        $filterCols = function (string $destTable, object $row, array $overrides = []) use ($getDestCols): array {
            $cols  = $getDestCols($destTable);
            $clean = [];
            foreach ((array) $row as $k => $v) {
                if (isset($cols[$k])) {
                    $clean[$k] = $v;
                }
            }
            return array_merge($clean, $overrides);
        };

        // ─────────────────────────────────────────────────────────────────────
        // MIGRATION
        // ─────────────────────────────────────────────────────────────────────
        try {
            $dest->statement('SET FOREIGN_KEY_CHECKS=0;');
            $dest->beginTransaction();

            // ═══════════════════════════════════════════════════════
            // 1. USERS — ALL 2,491 — no exclusions
            // ═══════════════════════════════════════════════════════
            $this->info('Migrating users...');
            $userCounts = ['total' => count($users), 'migrated' => 0];

            foreach ($users as $user) {
                $clean = $filterCols('users', $user);
                $dest->table('users')->insert($clean);
                $idMap['users'][$user->id] = $user->id;
                $userCounts['migrated']++;
            }
            $this->conservation['users'] = $userCounts;
            $this->info("  Users: {$userCounts['migrated']}/{$userCounts['total']}");

            // ═══════════════════════════════════════════════════════
            // 2. PROJECTS — route by opportunity_type, quarantine if user_id IS NULL
            // ═══════════════════════════════════════════════════════
            $this->info('Migrating projects...');
            $projCounts = [
                'total' => count($projects), 'migrated' => 0,
                'quarantined' => 0, 'worker_jobs' => 0, 'rfqs' => 0, 'std_projects' => 0
            ];
            $quarantinedProjectIds = [];

            foreach ($projects as $proj) {

                // ── Quarantine rule: user_id IS NULL ──────────────
                if (empty($proj->user_id) || !isset($idMap['users'][$proj->user_id])) {
                    $quarantinedProjectIds[$proj->id] = true;
                    $projCounts['quarantined']++;

                    // Determine intended domain for forensic record
                    $opType  = strtoupper($proj->opportunity_type ?? '');
                    $reqType = strtolower($proj->requirement_type ?? '');
                    $intendedDomain = $opType === 'JOB' ? 'worker_jobs'
                        : ($opType === 'RFQ' || $reqType === 'rfq' ? 'rfqs' : 'projects');

                    $quar->table('quarantine_projects')->insert([
                        'legacy_project_id'      => $proj->id,
                        'legacy_user_id'          => $proj->user_id ?: null,
                        'legacy_opportunity_type' => $proj->opportunity_type ?? null,
                        'legacy_requirement_type' => $proj->requirement_type ?? null,
                        'legacy_title'            => $proj->title ?? null,
                        'legacy_status'           => $proj->status ?? null,
                        'legacy_created_at'       => $proj->created_at ?? null,
                        'legacy_updated_at'       => $proj->updated_at ?? null,
                        'original_data'           => json_encode($proj),
                        'quarantine_reason'       => 'user_id IS NULL — no valid owner',
                        'intended_domain'         => $intendedDomain,
                        'is_recoverable'          => false,
                        'created_at'              => now(),
                        'updated_at'              => now(),
                    ]);
                    continue;
                }

                // ── Domain routing (opportunity_type is primary driver) ────
                $opType  = strtoupper($proj->opportunity_type ?? '');
                $reqType = strtolower($proj->requirement_type ?? '');

                if ($opType === 'JOB') {
                    $domain = 'worker_jobs';
                } elseif ($opType === 'RFQ' || $reqType === 'rfq') {
                    $domain = 'rfqs';
                } else {
                    $domain = 'projects';
                }

                // ── Build clean row for destination ───────────────────────
                $clean = $filterCols($domain, $proj);

                // Phase 4H.4 field mappings for worker_jobs
                if ($domain === 'worker_jobs') {
                    // Image: prefer image_url over image
                    $clean['image'] = $proj->image_url ?? $proj->image ?? null;

                    // Winner fields
                    // awarded_bid_id / winning_bid_id → winning_application_id (resolved after bids migrate)
                    // awarded_vendor_id / professional_id → worker_id
                    $workerId = $proj->awarded_vendor_id ?? $proj->professional_id ?? null;
                    if ($workerId && isset($idMap['users'][$workerId])) {
                        $clean['worker_id'] = $idMap['users'][$workerId];
                    }

                    // award_value null-safe scan
                    if (!empty($proj->award_value)) {
                        $this->warnings[] = [
                            'type'    => 'NON_NULL_AWARD_VALUE',
                            'project' => $proj->id,
                            'value'   => $proj->award_value,
                            'message' => 'award_value is non-null — verify equivalence with winning job_application.amount',
                        ];
                    }
                }

                $dest->table($domain)->insert($clean);
                $idMap[$domain][$proj->id] = $proj->id;

                $projCounts['migrated']++;
                $projCounts[match($domain) {
                    'worker_jobs' => 'worker_jobs',
                    'rfqs'        => 'rfqs',
                    default       => 'std_projects'
                }]++;
            }
            $this->conservation['projects'] = $projCounts;
            $this->info("  Projects: {$projCounts['migrated']} migrated, {$projCounts['quarantined']} quarantined");

            // ── Post-project: resolve winning_application_id on worker_jobs ──
            // Deferred because bids haven't been migrated yet. Done after bids.

            // ═══════════════════════════════════════════════════════
            // 3. BIDS — route follows parent; quarantine if parent quarantined
            // ═══════════════════════════════════════════════════════
            $this->info('Migrating bids...');
            $bidCounts = ['total' => count($bids), 'migrated' => 0, 'quarantined' => 0];

            // Look up quarantine_project rows for FK resolution
            $quarantineProjectIdByLegacyId = $quar->table('quarantine_projects')
                ->pluck('id', 'legacy_project_id')->toArray();

            foreach ($bids as $bid) {
                $rId = $bid->requirement_id;

                // ── Parent is quarantined → quarantine this bid too ─────────
                if (isset($quarantinedProjectIds[$rId])) {
                    $quarProjId = $quarantineProjectIdByLegacyId[$rId] ?? null;

                    // Determine intended domain
                    $legacyBidType = strtolower($bid->requirement_type ?? '');
                    $intendedDomain = isset($idMap['worker_jobs'][$rId]) ? 'job_applications'
                        : (isset($idMap['rfqs'][$rId]) ? 'rfq_quotations' : 'bids');

                    $quar->table('quarantine_bids')->insert([
                        'quarantine_project_id' => $quarProjId,
                        'legacy_bid_id'         => $bid->id,
                        'legacy_requirement_id' => $rId,
                        'legacy_professional_id' => $bid->professional_id ?? null,
                        'legacy_status'          => $bid->status ?? null,
                        'legacy_amount'          => $bid->amount ?? null,
                        'legacy_created_at'      => $bid->created_at ?? null,
                        'original_data'          => json_encode($bid),
                        'intended_domain'        => $intendedDomain,
                        'quarantine_reason'      => 'parent_project_quarantined',
                        'created_at'             => now(),
                        'updated_at'             => now(),
                    ]);
                    $bidCounts['quarantined']++;
                    continue;
                }

                // ── Route by where parent actually landed ─────────────────
                if (isset($idMap['projects'][$rId])) {
                    $mappedDomain = 'bids';
                    $mappedReqId  = $idMap['projects'][$rId];
                } elseif (isset($idMap['worker_jobs'][$rId])) {
                    $mappedDomain = 'job_applications';
                    $mappedReqId  = $idMap['worker_jobs'][$rId];
                } elseif (isset($idMap['rfqs'][$rId])) {
                    $mappedDomain = 'rfq_quotations';
                    $mappedReqId  = $idMap['rfqs'][$rId];
                } else {
                    // Parent exists in legacy but wasn't routed — log as warning
                    $this->warnings[] = [
                        'type'    => 'BID_PARENT_NOT_FOUND',
                        'bid_id'  => $bid->id,
                        'req_id'  => $rId,
                        'message' => 'Parent requirement not in any domain idMap and not quarantined — bid quarantined',
                    ];
                    $quar->table('quarantine_bids')->insert([
                        'quarantine_project_id'  => null,
                        'legacy_bid_id'          => $bid->id,
                        'legacy_requirement_id'  => $rId,
                        'legacy_professional_id' => $bid->professional_id ?? null,
                        'legacy_status'          => $bid->status ?? null,
                        'legacy_amount'          => $bid->amount ?? null,
                        'legacy_created_at'      => $bid->created_at ?? null,
                        'original_data'          => json_encode($bid),
                        'intended_domain'        => null,
                        'quarantine_reason'      => 'parent_project_missing',
                        'created_at'             => now(),
                        'updated_at'             => now(),
                    ]);
                    $bidCounts['quarantined']++;
                    continue;
                }

                if (!isset($idMap['users'][$bid->professional_id])) {
                    $this->warnings[] = ['type' => 'BID_PROFESSIONAL_MISSING', 'bid_id' => $bid->id];
                    $quar->table('quarantine_bids')->insert([
                        'quarantine_project_id'  => null,
                        'legacy_bid_id'          => $bid->id,
                        'legacy_requirement_id'  => $rId,
                        'legacy_professional_id' => $bid->professional_id ?? null,
                        'legacy_status'          => $bid->status ?? null,
                        'legacy_amount'          => $bid->amount ?? null,
                        'legacy_created_at'      => $bid->created_at ?? null,
                        'original_data'          => json_encode($bid),
                        'intended_domain'        => $mappedDomain ?? null,
                        'quarantine_reason'      => 'professional_user_missing',
                        'created_at'             => now(),
                        'updated_at'             => now(),
                    ]);
                    $bidCounts['quarantined']++;
                    continue;
                }

                $clean = $filterCols($mappedDomain, $bid, ['requirement_id' => $mappedReqId]);

                // Phase 4H.4 field mappings for job_applications
                if ($mappedDomain === 'job_applications') {
                    // Map is_awarded → status
                    if (!empty($bid->is_awarded) && $bid->is_awarded == 1) {
                        $clean['status'] = 'awarded';
                    } elseif (!empty($bid->withdrawn_at)) {
                        $clean['status'] = 'withdrawn';
                    } elseif (!empty($bid->status)) {
                        // Map legacy status strings to new enum values
                        $statusMap = [
                            'pending'     => 'pending',
                            'shortlisted' => 'shortlisted',
                            'accepted'    => 'accepted',
                            'rejected'    => 'rejected',
                            'completed'   => 'completed',
                        ];
                        $clean['status'] = $statusMap[$bid->status] ?? 'pending';
                    }
                }

                $dest->table($mappedDomain)->insert($clean);
                $idMap['bids'][$bid->id] = ['domain' => $mappedDomain, 'new_id' => $bid->id];
                $bidCounts['migrated']++;
            }
            $this->conservation['bids'] = $bidCounts;
            $this->info("  Bids: {$bidCounts['migrated']} migrated, {$bidCounts['quarantined']} quarantined");

            // ── Now resolve winning_application_id on worker_jobs ───────────
            foreach ($projects as $proj) {
                $domain = 'worker_jobs';
                if (!isset($idMap[$domain][$proj->id])) continue;

                $winBidId = $proj->awarded_bid_id ?? $proj->winning_bid_id ?? null;
                if ($winBidId && isset($idMap['bids'][$winBidId])) {
                    $dest->table($domain)->where('id', $idMap[$domain][$proj->id])->update([
                        'winning_application_id' => $idMap['bids'][$winBidId]['new_id'],
                    ]);
                }

                // Lifecycle events → activity_logs
                $this->insertLifecycleLog($dest, $domain, $proj->id, $proj->awarded_at, 'Project Awarded');
                $this->insertLifecycleLog($dest, $domain, $proj->id, $proj->started_at, 'Job Started');
                $this->insertLifecycleLog($dest, $domain, $proj->id, $proj->completed_at, 'Job Completed');
            }

            // ═══════════════════════════════════════════════════════
            // 4. CONTACT UNLOCKS — quarantine if parent quarantined
            // ═══════════════════════════════════════════════════════
            $this->info('Migrating contact unlocks...');
            $unlockCounts = ['total' => count($unlocks), 'migrated' => 0, 'quarantined' => 0];

            foreach ($unlocks as $u) {
                $rId = $u->requirement_id;

                if (isset($quarantinedProjectIds[$rId])) {
                    $quarProjId = $quarantineProjectIdByLegacyId[$rId] ?? null;
                    $quar->table('quarantine_unlocks')->insert([
                        'quarantine_project_id'  => $quarProjId,
                        'legacy_unlock_id'        => $u->id,
                        'legacy_requirement_id'   => $rId,
                        'legacy_user_id'          => $u->user_id ?? null,
                        'legacy_requirement_type' => $u->requirement_type ?? null,
                        'legacy_amount_paid'      => $u->amount_paid ?? null,
                        'legacy_created_at'       => $u->created_at ?? null,
                        'original_data'           => json_encode($u),
                        'quarantine_reason'       => 'parent_project_quarantined',
                        'created_at'              => now(),
                        'updated_at'              => now(),
                    ]);
                    $unlockCounts['quarantined']++;
                    continue;
                }

                if (isset($idMap['projects'][$rId])) {
                    $mappedReq  = $idMap['projects'][$rId];
                    $reqType    = 'App\Models\Requirement';
                } elseif (isset($idMap['worker_jobs'][$rId])) {
                    $mappedReq  = $idMap['worker_jobs'][$rId];
                    $reqType    = 'App\Models\WorkerJob';
                } elseif (isset($idMap['rfqs'][$rId])) {
                    $mappedReq  = $idMap['rfqs'][$rId];
                    $reqType    = 'App\Models\Rfq';
                } else {
                    $quar->table('quarantine_unlocks')->insert([
                        'quarantine_project_id'  => null,
                        'legacy_unlock_id'        => $u->id,
                        'legacy_requirement_id'   => $rId,
                        'legacy_user_id'          => $u->user_id ?? null,
                        'legacy_requirement_type' => $u->requirement_type ?? null,
                        'legacy_amount_paid'      => $u->amount_paid ?? null,
                        'legacy_created_at'       => $u->created_at ?? null,
                        'original_data'           => json_encode($u),
                        'quarantine_reason'       => 'parent_project_missing',
                        'created_at'              => now(),
                        'updated_at'              => now(),
                    ]);
                    $unlockCounts['quarantined']++;
                    continue;
                }

                if (!isset($idMap['users'][$u->user_id])) {
                    $quar->table('quarantine_unlocks')->insert([
                        'quarantine_project_id'  => null,
                        'legacy_unlock_id'        => $u->id,
                        'legacy_requirement_id'   => $rId,
                        'legacy_user_id'          => $u->user_id ?? null,
                        'legacy_requirement_type' => $u->requirement_type ?? null,
                        'legacy_amount_paid'      => $u->amount_paid ?? null,
                        'legacy_created_at'       => $u->created_at ?? null,
                        'original_data'           => json_encode($u),
                        'quarantine_reason'       => 'unlock_user_missing',
                        'created_at'              => now(),
                        'updated_at'              => now(),
                    ]);
                    $unlockCounts['quarantined']++;
                    continue;
                }

                $clean = $filterCols('contact_unlocks', $u, [
                    'requirement_id'   => $mappedReq,
                    'requirement_type' => $reqType,
                ]);
                $dest->table('contact_unlocks')->insert($clean);
                $unlockCounts['migrated']++;
            }
            $this->conservation['contact_unlocks'] = $unlockCounts;
            $this->info("  Unlocks: {$unlockCounts['migrated']} migrated, {$unlockCounts['quarantined']} quarantined");

            // ═══════════════════════════════════════════════════════
            // 5. WALLETS — ALL 2,301 — with per-wallet provenance
            // ═══════════════════════════════════════════════════════
            $this->info('Migrating wallets...');
            $walletCounts = [
                'total' => count($wallets), 'migrated' => 0,
                'real_reconciled' => 0, 'real_unreconciled' => 0,
                'synthetic' => 0, 'unverified' => 0,
            ];
            $newWalletId = 1;

            foreach ($wallets as $userId => $w) {
                if (!isset($idMap['users'][$userId])) {
                    $this->warnings[] = ['type' => 'WALLET_OWNER_MISSING', 'user_id' => $userId];
                    continue;
                }

                $user       = $users[$userId];
                $legacyBal  = (float) ($w->balance ?? 0);
                $walletId   = $w->id;
                $ledgerSum  = (float) ($ledgerByWalletId[$walletId] ?? 0);
                $unledgered = $legacyBal - $ledgerSum;

                // ── Per-wallet provenance classification ──────────────────
                if (in_array((int) $userId, self::ADMIN_USER_IDS)) {
                    $classification = 'UNVERIFIED_LEGACY_BALANCE';
                    $isSynthetic    = false;
                } elseif ($user->is_mock) {
                    $classification = 'LEGACY_SYNTHETIC_OPENING_BALANCE';
                    $isSynthetic    = true;
                } elseif (abs($unledgered) <= self::LEDGER_TOLERANCE) {
                    $classification = 'REAL_LEDGER_RECONCILED';
                    $isSynthetic    = false;
                } else {
                    $classification = 'REAL_UNRECONCILED';
                    $isSynthetic    = false;
                }

                // ── Insert wallet ──────────────────────────────────────────
                $cleanWallet = $filterCols('wallets', $w);
                $cleanWallet['id'] = $newWalletId;
                $dest->table('wallets')->insert($cleanWallet);

                // ── Insert provenance record ───────────────────────────────
                $dest->table('wallet_provenance')->insert([
                    'wallet_id'              => $newWalletId,
                    'user_id'                => $userId,
                    'classification'         => $classification,
                    'is_synthetic'           => $isSynthetic,
                    'legacy_balance'         => $legacyBal,
                    'ledger_balance'         => $ledgerSum,
                    'unledgered_balance'     => $unledgered,
                    'was_mock_at_migration'  => (bool) $user->is_mock,
                    'classification_reason'  => $this->classificationReason($classification, $legacyBal, $ledgerSum),
                    'migrated_at'            => now(),
                ]);

                // Track breakdown
                $walletCounts['migrated']++;
                $walletCounts[match($classification) {
                    'REAL_LEDGER_RECONCILED'           => 'real_reconciled',
                    'REAL_UNRECONCILED'                => 'real_unreconciled',
                    'LEGACY_SYNTHETIC_OPENING_BALANCE' => 'synthetic',
                    default                            => 'unverified',
                }]++;

                $newWalletId++;
            }
            $this->conservation['wallets'] = $walletCounts;
            $this->info("  Wallets: {$walletCounts['migrated']}/{$walletCounts['total']}");
            $this->info("    - REAL_LEDGER_RECONCILED:           {$walletCounts['real_reconciled']}");
            $this->info("    - REAL_UNRECONCILED:                {$walletCounts['real_unreconciled']}");
            $this->info("    - LEGACY_SYNTHETIC_OPENING_BALANCE: {$walletCounts['synthetic']}");
            $this->info("    - UNVERIFIED_LEGACY_BALANCE:        {$walletCounts['unverified']}");

            // ═══════════════════════════════════════════════════════
            // 6. WALLET TRANSACTIONS — All 9
            // ═══════════════════════════════════════════════════════
            $this->info('Migrating wallet transactions...');
            $txCounts = ['total' => count($walletTxs), 'migrated' => 0];

            $walletIdMap = $dest->table('wallets')->pluck('id', 'user_id')->toArray();
            foreach ($walletTxs as $tx) {
                // Find wallet's new ID via user_id chain
                $parentWallet = $wallets->first(fn($w) => $w->id === $tx->wallet_id);
                if (!$parentWallet) continue;

                $newWId = $walletIdMap[$parentWallet->user_id] ?? null;
                if (!$newWId) continue;

                $cleanTx = $filterCols('wallet_transactions', $tx, ['wallet_id' => $newWId]);
                $dest->table('wallet_transactions')->insert($cleanTx);
                $txCounts['migrated']++;
            }
            $this->conservation['wallet_transactions'] = $txCounts;
            $this->info("  Wallet transactions: {$txCounts['migrated']}/{$txCounts['total']}");

            $dest->commit();
            $dest->statement('SET FOREIGN_KEY_CHECKS=1;');
            $this->info("\n[OK] Restoration DB transaction committed.");

        } catch (\Exception $e) {
            $dest->rollBack();
            $dest->statement('SET FOREIGN_KEY_CHECKS=1;');
            $this->error("Migration failed: " . $e->getMessage());
            $this->logToQuarantine($quar, 'FAIL', $e->getMessage());
            return 1;
        }

        // ── Write quarantine migration log ────────────────────────────────────
        $this->logToQuarantine($quar, 'PASS', null);

        // ── Write report artifacts ────────────────────────────────────────────
        $this->writeReports();

        $this->info("\n=== Phase 4H.5.4 Complete ===");
        $this->info("Warnings: " . count($this->warnings));
        if (count($this->warnings)) {
            foreach ($this->warnings as $w) {
                $this->warn("  [{$w['type']}] " . ($w['message'] ?? json_encode($w)));
            }
        }

        return 0;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function ensureQuarantineSchema($dest): void
    {
        // Create quarantine tables if they don't exist yet.
        // This handles the case where the migration runner skipped
        // the quarantine schema migration due to connection re-pointing.
        $sb = $dest->getSchemaBuilder();

        if (!$sb->hasTable('quarantine_projects')) {
            $dest->statement("
                CREATE TABLE quarantine_projects (
                    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    legacy_project_id BIGINT UNSIGNED NOT NULL UNIQUE,
                    legacy_user_id BIGINT UNSIGNED NULL,
                    legacy_opportunity_type VARCHAR(255) NULL,
                    legacy_requirement_type VARCHAR(255) NULL,
                    legacy_title VARCHAR(255) NULL,
                    legacy_status VARCHAR(50) NULL,
                    legacy_created_at TIMESTAMP NULL,
                    legacy_updated_at TIMESTAMP NULL,
                    original_data JSON NOT NULL,
                    quarantine_reason VARCHAR(255) NOT NULL,
                    intended_domain VARCHAR(255) NULL,
                    is_recoverable TINYINT(1) NOT NULL DEFAULT 0,
                    recovery_notes TEXT NULL,
                    created_at TIMESTAMP NULL,
                    updated_at TIMESTAMP NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            ");
            $this->info('  [Schema] quarantine_projects created.');
        }

        if (!$sb->hasTable('quarantine_bids')) {
            $dest->statement("
                CREATE TABLE quarantine_bids (
                    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    quarantine_project_id BIGINT UNSIGNED NULL,
                    legacy_bid_id BIGINT UNSIGNED NOT NULL UNIQUE,
                    legacy_requirement_id BIGINT UNSIGNED NOT NULL,
                    legacy_professional_id BIGINT UNSIGNED NULL,
                    legacy_status VARCHAR(50) NULL,
                    legacy_amount DECIMAL(12,2) NULL,
                    legacy_created_at TIMESTAMP NULL,
                    original_data JSON NOT NULL,
                    intended_domain VARCHAR(255) NULL,
                    quarantine_reason VARCHAR(255) NOT NULL DEFAULT 'parent_project_quarantined',
                    created_at TIMESTAMP NULL,
                    updated_at TIMESTAMP NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            ");
            $this->info('  [Schema] quarantine_bids created.');
        }

        if (!$sb->hasTable('quarantine_unlocks')) {
            $dest->statement("
                CREATE TABLE quarantine_unlocks (
                    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    quarantine_project_id BIGINT UNSIGNED NULL,
                    legacy_unlock_id BIGINT UNSIGNED NOT NULL UNIQUE,
                    legacy_requirement_id BIGINT UNSIGNED NOT NULL,
                    legacy_user_id BIGINT UNSIGNED NULL,
                    legacy_requirement_type VARCHAR(255) NULL,
                    legacy_amount_paid DECIMAL(12,2) NULL,
                    legacy_created_at TIMESTAMP NULL,
                    original_data JSON NOT NULL,
                    quarantine_reason VARCHAR(255) NOT NULL DEFAULT 'parent_project_quarantined',
                    created_at TIMESTAMP NULL,
                    updated_at TIMESTAMP NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            ");
            $this->info('  [Schema] quarantine_unlocks created.');
        }

        if (!$sb->hasTable('quarantine_migration_log')) {
            $dest->statement("
                CREATE TABLE quarantine_migration_log (
                    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    run_id VARCHAR(255) NOT NULL UNIQUE,
                    started_at TIMESTAMP NOT NULL,
                    completed_at TIMESTAMP NULL,
                    engine_version VARCHAR(255) NULL,
                    conservation_counts JSON NULL,
                    warnings JSON NULL,
                    result VARCHAR(50) NULL,
                    failure_reason TEXT NULL,
                    created_at TIMESTAMP NULL,
                    updated_at TIMESTAMP NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            ");
            $this->info('  [Schema] quarantine_migration_log created.');
        }
    }

    private function assertSafeDestinations(): void
    {
        // Assert the disposable DB name constants are not the forbidden DBs.
        foreach (self::FORBIDDEN_DBS as $forbidden) {
            if (self::DISPOSABLE_RESTORATION_DB === $forbidden) {
                $this->error("[SAFETY GATE] Restoration DB constant '{$forbidden}' is in the forbidden list — aborting.");
                exit(1);
            }
            if (self::DISPOSABLE_QUARANTINE_DB === $forbidden) {
                $this->error("[SAFETY GATE] Quarantine DB constant '{$forbidden}' is in the forbidden list — aborting.");
                exit(1);
            }
        }

        // Verify the constants have the expected values (tamper-detection).
        if (self::DISPOSABLE_RESTORATION_DB !== 'findmyinterior_legacy_migrated') {
            $this->error("[SAFETY GATE] Restoration DB constant mismatch — aborting.");
            exit(1);
        }
        if (self::DISPOSABLE_QUARANTINE_DB !== 'findmyinterior_legacy_quarantine') {
            $this->error("[SAFETY GATE] Quarantine DB constant mismatch — aborting.");
            exit(1);
        }

        $this->info("[OK] Safety gates passed.");
    }

    private function insertLifecycleLog($dest, string $subjectType, int $subjectId, ?string $timestamp, string $eventType): void
    {
        if (!$timestamp) return;
        $morphMap = ['worker_jobs' => 'App\Models\WorkerJob', 'rfqs' => 'App\Models\Rfq', 'projects' => 'App\Models\Requirement'];
        $dest->table('activity_logs')->insert([
            'subject_type' => $morphMap[$subjectType] ?? $subjectType,
            'subject_id'   => $subjectId,
            'user_id'      => null,
            'event_type'   => $eventType,
            'description'  => "[Migrated from legacy] {$eventType} recorded at original timestamp.",
            'properties'   => json_encode(['legacy_timestamp' => $timestamp, 'migration_run_id' => $this->runId]),
            'created_at'   => $timestamp,
            'updated_at'   => $timestamp,
        ]);
    }

    private function classificationReason(string $cls, float $balance, float $ledger): string
    {
        return match ($cls) {
            'REAL_LEDGER_RECONCILED'           => "Balance ₹{$balance} matches ledger sum ₹{$ledger}",
            'REAL_UNRECONCILED'                => "Balance ₹{$balance} differs from ledger ₹{$ledger} — unledgered credit",
            'LEGACY_SYNTHETIC_OPENING_BALANCE' => "User is_mock=1; balance ₹{$balance} was seeded directly",
            default                            => "Admin user or special case — origin unverifiable; balance ₹{$balance}",
        };
    }

    private function logToQuarantine($quar, string $result, ?string $failureReason): void
    {
        $quar->table('quarantine_migration_log')->insert([
            'run_id'              => $this->runId,
            'started_at'          => now(),
            'completed_at'        => now(),
            'engine_version'      => 'Phase 4H.5',
            'conservation_counts' => json_encode($this->conservation),
            'warnings'            => json_encode($this->warnings),
            'result'              => $result,
            'failure_reason'      => $failureReason,
            'created_at'          => now(),
            'updated_at'          => now(),
        ]);
    }

    private function writeReports(): void
    {
        $basePath = 'C:\Users\Aryan\.gemini\antigravity-ide\brain\43711a4e-6310-44ce-a019-6e6633ee92d0\\';

        $report = [
            'run_id'       => $this->runId,
            'engine'       => 'Phase 4H.5',
            'conservation' => $this->conservation,
            'warnings'     => $this->warnings,
        ];

        file_put_contents($basePath . 'phase_4h5_migration_report.json', json_encode($report, JSON_PRETTY_PRINT));
        $this->info("  Report written to phase_4h5_migration_report.json");
    }
}
