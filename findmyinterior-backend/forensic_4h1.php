<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$dest = DB::connection('mysql');
$dest->statement('USE findmyinterior_legacy_migrated');

$report = [];

// A. Bid #1 Inspection
$legacy_bid_1 = DB::connection('legacy_restore')->table('bids')->where('id', 1)->first();
$report['legacy_bid_1'] = $legacy_bid_1;

$legacy_parent_1 = DB::connection('legacy_restore')->table('projects')->where('id', $legacy_bid_1->requirement_id)->first();
$report['legacy_parent_1'] = $legacy_parent_1;

$dest_bid_in_bids = $dest->table('bids')->where('requirement_id', 1)->first();
$dest_bid_in_job_apps = $dest->table('job_applications')->where('requirement_id', 1)->first();
$dest_bid_in_rfqs = $dest->table('rfq_quotations')->where('requirement_id', 1)->first();

$report['dest_bid_1'] = [
    'in_bids' => $dest_bid_in_bids,
    'in_job_applications' => $dest_bid_in_job_apps,
    'in_rfq_quotations' => $dest_bid_in_rfqs,
];

// Check destination parents
$dest_parent_project = $dest->table('projects')->where('id', 1)->first();
$dest_parent_worker_job = $dest->table('worker_jobs')->where('id', 1)->first();
$report['dest_parent_1'] = [
    'in_projects' => $dest_parent_project ? true : false,
    'in_worker_jobs' => $dest_parent_worker_job ? true : false,
];

// B. Bids #2 and #3 Inspection
$dest_bid_2_anywhere = [
    'bids' => $dest->table('bids')->count(), // total count
];
$report['bids_2_and_3'] = [
    'bids_table_count' => $dest->table('bids')->count(),
    'job_applications_count' => $dest->table('job_applications')->count(),
    'rfq_quotations_count' => $dest->table('rfq_quotations')->count(),
];

// C. Destination Table Counts
$report['table_counts'] = [
    'projects' => $dest->table('projects')->count(),
    'worker_jobs' => $dest->table('worker_jobs')->count(),
    'rfqs' => $dest->table('rfqs')->count(),
    'bids' => $dest->table('bids')->count(),
    'job_applications' => $dest->table('job_applications')->count(),
    'rfq_quotations' => $dest->table('rfq_quotations')->count(),
    'contact_unlocks' => $dest->table('contact_unlocks')->count(),
];

// D. FK Integrity / Orphan Scan
$orphans = [];

$orphans['users_wallets'] = $dest->table('wallets')
    ->leftJoin('users', 'wallets.user_id', '=', 'users.id')
    ->whereNull('users.id')->count();

$orphans['users_projects'] = $dest->table('projects')
    ->leftJoin('users', 'projects.user_id', '=', 'users.id')
    ->whereNull('users.id')->count();

$orphans['users_worker_jobs'] = $dest->table('worker_jobs')
    ->leftJoin('users', 'worker_jobs.user_id', '=', 'users.id')
    ->whereNull('users.id')->count();

$orphans['wallets_transactions'] = $dest->table('wallet_transactions')
    ->leftJoin('wallets', 'wallet_transactions.wallet_id', '=', 'wallets.id')
    ->whereNull('wallets.id')->count();
    
$orphans['bids_projects'] = $dest->table('bids')
    ->leftJoin('projects', 'bids.requirement_id', '=', 'projects.id')
    ->whereNull('projects.id')->count();

$orphans['job_applications_worker_jobs'] = $dest->table('job_applications')
    ->leftJoin('worker_jobs', 'job_applications.requirement_id', '=', 'worker_jobs.id')
    ->whereNull('worker_jobs.id')->count();

$report['orphan_scan'] = $orphans;

// E. Financial Reconciliation
$real_wallets = $dest->table('wallets')
    ->join('users', 'wallets.user_id', '=', 'users.id')
    ->where('users.is_mock', 0)->get();

$report['financial'] = [
    'total_real_user_wallets' => count($real_wallets),
    'sum_real_balances' => $real_wallets->sum('balance'),
    'user_768_balance' => $dest->table('wallets')->where('user_id', 768)->value('balance'),
    'user_1_balance' => $dest->table('wallets')->where('user_id', 1)->value('balance'),
];

// F. Mock User Firewall
$mock_wallets_count = $dest->table('wallets')
    ->join('users', 'wallets.user_id', '=', 'users.id')
    ->where('users.is_mock', 1)->count();

$report['mock_wallets_migrated'] = $mock_wallets_count;

file_put_contents('forensic_4H1.json', json_encode($report, JSON_PRETTY_PRINT));
echo "Forensic report generated.\n";
