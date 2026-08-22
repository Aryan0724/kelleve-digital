<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class LegacyMapCommand extends Command
{
    protected $signature = 'fmi:legacy-map {--dry-run : Perform a dry run without modifying destination}';
    protected $description = 'Maps and migrates legacy FMI data to the new architecture.';

    private $idMap = [];
    private $report = [
        'conservation' => [],
        'blocked_records' => [],
        'financial_reconciliation' => [],
        'orphan_investigation' => []
    ];

    public function handle()
    {
        $isDryRun = $this->option('dry-run');

        if (!$isDryRun) {
            $this->error("Only --dry-run is supported in Phase 4F.");
            return 1;
        }

        $this->info("Starting Legacy Mapping Dry Run...");

        $conn = DB::connection('legacy_restore');

        // Extract raw data
        $users = $conn->table('users')->get()->keyBy('id');
        $projects = $conn->table('projects')->get();
        $bids = $conn->getSchemaBuilder()->hasTable('bids') ? $conn->table('bids')->get() : [];
        $unlocks = $conn->getSchemaBuilder()->hasTable('contact_unlocks') ? $conn->table('contact_unlocks')->get() : [];
        $wallets = $conn->table('wallets')->get()->keyBy('user_id');

        $this->idMap = [
            'users' => [],
            'projects' => [],
            'worker_jobs' => [],
            'rfqs' => [],
            'bids' => [],
        ];

        $counts = [
            'users' => ['total' => count($users), 'migrated' => 0, 'blocked' => 0, 'excluded' => 0, 'duplicate' => 0],
            'projects' => ['total' => count($projects), 'migrated' => 0, 'blocked' => 0, 'excluded' => 0, 'duplicate' => 0],
            'bids' => ['total' => count($bids), 'migrated' => 0, 'blocked' => 0, 'excluded' => 0, 'duplicate' => 0],
            'contact_unlocks' => ['total' => count($unlocks), 'migrated' => 0, 'blocked' => 0, 'excluded' => 0, 'duplicate' => 0],
            'wallets' => ['total' => count($wallets), 'migrated' => 0, 'blocked' => 0, 'excluded' => 0, 'duplicate' => 0],
        ];

        // 1. Process Users
        foreach ($users as $user) {
            $newId = $user->id;
            $this->idMap['users'][$user->id] = $newId;
            $counts['users']['migrated']++;
        }

        // 2. Process Projects (and investigate orphans)
        $nextProjectId = 1;
        $nextWorkerJobId = 1;
        $nextRfqId = 1;

        foreach ($projects as $proj) {
            if (empty($proj->user_id) || !isset($this->idMap['users'][$proj->user_id])) {
                $counts['projects']['blocked']++;
                $has_bids = collect($bids)->where('requirement_id', $proj->id)->count() > 0;
                
                $conclusion = empty($proj->user_id) ? 'ORPHANED_PROJECT (user_id is NULL)' : 'ORPHANED_PROJECT (user_id missing from users table)';
                
                $this->report['orphan_investigation'][] = [
                    'id' => $proj->id,
                    'user_id' => $proj->user_id,
                    'title' => $proj->title,
                    'has_bids' => $has_bids,
                    'conclusion' => $conclusion
                ];
                $this->report['blocked_records'][] = [
                    'type' => 'projects',
                    'id' => $proj->id,
                    'reason' => 'ORPHANED_PROJECT',
                    'metadata' => (array)$proj
                ];
                continue;
            }

            // Route based on requirement_type
            $type = strtolower($proj->requirement_type ?? 'project');
            
            if ($type === 'workerjob' || $type === 'job') {
                $this->idMap['worker_jobs'][$proj->id] = $nextWorkerJobId++;
            } elseif ($type === 'rfq') {
                $this->idMap['rfqs'][$proj->id] = $nextRfqId++;
            } else {
                $this->idMap['projects'][$proj->id] = $nextProjectId++;
            }
            $counts['projects']['migrated']++;
        }

        // 3. Process Bids
        $nextQuoteId = 1;
        $nextAppId = 1;
        $nextRfqQuoteId = 1;

        foreach ($bids as $bid) {
            $r_id = $bid->requirement_id;
            
            $mappedReq = null;
            $mappedDomain = null;
            
            if (isset($this->idMap['projects'][$r_id])) {
                $mappedReq = $this->idMap['projects'][$r_id];
                $mappedDomain = 'project_quotes';
            } elseif (isset($this->idMap['worker_jobs'][$r_id])) {
                $mappedReq = $this->idMap['worker_jobs'][$r_id];
                $mappedDomain = 'job_applications';
            } elseif (isset($this->idMap['rfqs'][$r_id])) {
                $mappedReq = $this->idMap['rfqs'][$r_id];
                $mappedDomain = 'rfq_quotations';
            }
            
            if (!$mappedReq || !isset($this->idMap['users'][$bid->professional_id])) {
                $counts['bids']['blocked']++;
                $this->report['blocked_records'][] = [
                    'type' => 'bids',
                    'id' => $bid->id,
                    'reason' => 'ORPHANED_REQUIREMENT_OR_USER',
                    'metadata' => (array)$bid
                ];
                continue;
            }

            $this->idMap['bids'][$bid->id] = [
                'domain' => $mappedDomain,
                'new_parent_id' => $mappedReq,
                'new_id' => $mappedDomain === 'project_quotes' ? $nextQuoteId++ : ($mappedDomain === 'job_applications' ? $nextAppId++ : $nextRfqQuoteId++)
            ];
            
            $counts['bids']['migrated']++;
        }

        // 4. Process Contact Unlocks
        foreach ($unlocks as $u) {
            $r_id = $u->requirement_id;
            $mappedReq = isset($this->idMap['projects'][$r_id]) || isset($this->idMap['worker_jobs'][$r_id]) || isset($this->idMap['rfqs'][$r_id]);
            
            if (!$mappedReq || !isset($this->idMap['users'][$u->user_id])) {
                $counts['contact_unlocks']['blocked']++;
                $this->report['blocked_records'][] = [
                    'type' => 'contact_unlocks',
                    'id' => $u->id,
                    'reason' => 'MIGRATION_BLOCKED_ORPHANED_UNLOCK',
                    'metadata' => (array)$u
                ];
                continue;
            }
            $counts['contact_unlocks']['migrated']++;
        }

        // 5. Financial processing
        foreach ($wallets as $w) {
            $uid = $w->user_id;
            if (!isset($this->idMap['users'][$uid])) {
                $counts['wallets']['blocked']++;
                continue;
            }
            
            $user = $users[$uid];
            $is_mock = $user->is_mock;
            $is_admin = $user->id == 1; // Example admin
            
            if ($is_mock) {
                $counts['wallets']['excluded']++;
                $this->report['financial_reconciliation'][] = [
                    'user_id' => $uid,
                    'action' => 'EXCLUDED_MOCK_WALLET',
                    'balance' => $w->balance
                ];
            } elseif ($is_admin) {
                $counts['wallets']['migrated']++;
                $this->report['financial_reconciliation'][] = [
                    'user_id' => $uid,
                    'action' => 'MIGRATE_UNVERIFIED_ADMIN_BALANCE',
                    'balance' => $w->balance
                ];
            } else {
                $counts['wallets']['migrated']++;
                $this->report['financial_reconciliation'][] = [
                    'user_id' => $uid,
                    'action' => 'MIGRATE_REAL_BALANCE',
                    'balance' => $w->balance
                ];
            }
        }

        $this->report['conservation'] = $counts;

        file_put_contents('C:\Users\Aryan\.gemini\antigravity-ide\brain\43711a4e-6310-44ce-a019-6e6633ee92d0\legacy_mapping_report.json', json_encode($this->report, JSON_PRETTY_PRINT));
        
        $md = "# Legacy Mapping Dry Run Report\n\n";
        $md .= "## Conservation Equation\n";
        foreach ($counts as $domain => $data) {
            $sum = $data['migrated'] + $data['blocked'] + $data['excluded'] + $data['duplicate'];
            $md .= "- **{$domain}**: Total {$data['total']} = Migrated {$data['migrated']} + Blocked {$data['blocked']} + Excluded {$data['excluded']} + Duplicate {$data['duplicate']} | Balances: " . ($sum === $data['total'] ? "YES" : "NO") . "\n";
        }

        $md .= "\n## Orphaned Projects Investigation\n";
        foreach ($this->report['orphan_investigation'] as $o) {
            $md .= "- Project ID {$o['id']}: Missing User " . ($o['user_id'] ?? 'NULL') . " | Has Bids? " . ($o['has_bids'] ? 'YES' : 'NO') . " | Conclusion: **{$o['conclusion']}**\n";
        }

        $md .= "\n## Blocked Records\n";
        $md .= "A total of " . count($this->report['blocked_records']) . " records were blocked. See JSON for full metadata.\n";

        $md .= "\n## ID Mapping Sample (First 5 Bids)\n";
        $count = 0;
        foreach ($this->idMap['bids'] as $old => $new) {
            if ($count++ > 5) break;
            $md .= "- Legacy Bid ID {$old} -> Domain `{$new['domain']}` | New Parent ID {$new['new_parent_id']} | New ID {$new['new_id']}\n";
        }

        file_put_contents('C:\Users\Aryan\.gemini\antigravity-ide\brain\43711a4e-6310-44ce-a019-6e6633ee92d0\legacy_mapping_report.md', $md);

        $this->info("Dry run complete.");
    }
}
