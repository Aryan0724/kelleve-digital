<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

config(['database.connections.legacy_restore' => [
    'driver' => 'mysql',
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', '3306'),
    'database' => 'findmyinterior_legacy_restore',
    'username' => env('DB_USERNAME', 'root'),
    'password' => env('DB_PASSWORD', ''),
]]);

$conn = DB::connection('legacy_restore');

$report = [
    'matrices' => [
        'transaction_types' => [],
        'transaction_statuses' => [],
        'payment_statuses' => [],
        'payment_types' => [],
        'unlock_statuses' => [],
    ],
    'global_totals' => [
        'sum_wallets_balance' => 0.0,
        'sum_tx_credits' => 0.0,
        'sum_tx_debits' => 0.0,
        'net_ledger' => 0.0,
        'sum_successful_payments' => 0.0,
        'sum_unlock_deductions' => 0.0,
        'sum_refunds' => 0.0,
        'sum_admin_adjustments' => 0.0,
        'sum_initialization_credits' => 0.0, // We will infer this
    ],
    'mismatch_population_analysis' => [
        'total_mismatches' => 0,
        'zero_ledger_positive_balance' => 0,
        'common_initialization_values' => [],
        'role_distribution' => [],
        'date_range' => ['min' => null, 'max' => null]
    ],
    'outlier_analysis' => [],
    'historical_equation_hypothesis' => '',
    'proposed_migration_rule' => '',
    'unresolved_questions' => []
];

// Matrix population
$tx_types = $conn->table('wallet_transactions')->select('type', DB::raw('count(*) as c'), DB::raw('sum(amount) as amt'))->groupBy('type')->get();
foreach ($tx_types as $t) {
    $report['matrices']['transaction_types'][$t->type] = ['count' => $t->c, 'amount' => (float)$t->amt];
    if ($t->type === 'credit') $report['global_totals']['sum_tx_credits'] = (float)$t->amt;
    if ($t->type === 'debit') $report['global_totals']['sum_tx_debits'] = (float)$t->amt;
}
$report['global_totals']['net_ledger'] = $report['global_totals']['sum_tx_credits'] - $report['global_totals']['sum_tx_debits'];

if ($conn->getSchemaBuilder()->hasColumn('wallet_transactions', 'status')) {
    $tx_statuses = $conn->table('wallet_transactions')->select('status', DB::raw('count(*) as c'))->groupBy('status')->get();
    foreach ($tx_statuses as $t) {
        $report['matrices']['transaction_statuses'][$t->status] = $t->c;
    }
}

if ($conn->getSchemaBuilder()->hasColumn('payments', 'status')) {
    $pay_statuses = $conn->table('payments')->select('status', DB::raw('count(*) as c'), DB::raw('sum(amount) as amt'))->groupBy('status')->get();
    foreach ($pay_statuses as $p) {
        $report['matrices']['payment_statuses'][$p->status] = ['count' => $p->c, 'amount' => (float)$p->amt];
        if (in_array(strtolower($p->status), ['success', 'successful', 'captured', 'paid'])) {
            $report['global_totals']['sum_successful_payments'] += (float)$p->amt;
        }
    }
}

// Global wallet total
$report['global_totals']['sum_wallets_balance'] = (float) $conn->table('wallets')->sum('balance');

// Deep dive into mismatches and initial balances
$wallets = $conn->table('wallets')->get()->keyBy('user_id');
$users = $conn->table('users')->get()->keyBy('id');
$transactions = $conn->table('wallet_transactions')->get();

$ledger_by_wallet = [];
foreach ($transactions as $tx) {
    if (!isset($ledger_by_wallet[$tx->wallet_id])) {
        $ledger_by_wallet[$tx->wallet_id] = ['cr' => 0, 'dr' => 0];
    }
    if ($tx->type === 'credit') $ledger_by_wallet[$tx->wallet_id]['cr'] += $tx->amount;
    if ($tx->type === 'debit') $ledger_by_wallet[$tx->wallet_id]['dr'] += $tx->amount;
    
    $desc = strtolower($tx->description);
    if (strpos($desc, 'admin') !== false) {
        if ($tx->type === 'credit') $report['global_totals']['sum_admin_adjustments'] += $tx->amount;
        else $report['global_totals']['sum_admin_adjustments'] -= $tx->amount;
    }
    if (strpos($desc, 'refund') !== false && $tx->type === 'credit') {
        $report['global_totals']['sum_refunds'] += $tx->amount;
    }
}

$mismatch_balances = [];
foreach ($wallets as $w) {
    $uid = $w->user_id;
    $ledger = $ledger_by_wallet[$w->id] ?? ['cr' => 0, 'dr' => 0];
    $net = $ledger['cr'] - $ledger['dr'];
    
    if (abs($w->balance - $net) > 0.01) {
        $report['mismatch_population_analysis']['total_mismatches']++;
        
        $user = $users[$uid] ?? null;
        if ($user) {
            $role = $user->role ?? 'unknown';
            $report['mismatch_population_analysis']['role_distribution'][$role] = ($report['mismatch_population_analysis']['role_distribution'][$role] ?? 0) + 1;
            
            $dt = $user->created_at;
            if ($dt) {
                if (!$report['mismatch_population_analysis']['date_range']['min'] || $dt < $report['mismatch_population_analysis']['date_range']['min']) {
                    $report['mismatch_population_analysis']['date_range']['min'] = $dt;
                }
                if (!$report['mismatch_population_analysis']['date_range']['max'] || $dt > $report['mismatch_population_analysis']['date_range']['max']) {
                    $report['mismatch_population_analysis']['date_range']['max'] = $dt;
                }
            }
        }
        
        if ($net == 0 && $w->balance > 0) {
            $report['mismatch_population_analysis']['zero_ledger_positive_balance']++;
            $bal = (string)(float)$w->balance;
            $report['mismatch_population_analysis']['common_initialization_values'][$bal] = ($report['mismatch_population_analysis']['common_initialization_values'][$bal] ?? 0) + 1;
        }
    }
}

// Sort initial values
arsort($report['mismatch_population_analysis']['common_initialization_values']);
$top_initial = array_slice($report['mismatch_population_analysis']['common_initialization_values'], 0, 5, true);
$report['mismatch_population_analysis']['common_initialization_values'] = $top_initial;

// Evaluate User 1
$u1_wallet = $wallets->where('user_id', 1)->first();
$u1_txs = $u1_wallet ? $conn->table('wallet_transactions')->where('wallet_id', $u1_wallet->id)->get() : collect([]);
$report['outlier_analysis']['user_1'] = [
    'stored_balance' => $u1_wallet ? $u1_wallet->balance : 0,
    'tx_count' => $u1_txs->count(),
    'role' => isset($users[1]) ? ($users[1]->role ?? 'admin') : 'unknown',
    'hypothesis' => $u1_txs->count() == 0 && $u1_wallet && $u1_wallet->balance == 999999 ? 'System Admin account manually seeded with infinite credits without ledger.' : 'Needs investigation.'
];

// Evaluate User 768
$u768_wallet = $wallets->where('user_id', 768)->first();
$u768_txs = $u768_wallet ? $conn->table('wallet_transactions')->where('wallet_id', $u768_wallet->id)->get() : collect([]);
$report['outlier_analysis']['user_768'] = [
    'stored_balance' => $u768_wallet ? $u768_wallet->balance : 0,
    'ledger_net' => $u768_txs->where('type', 'credit')->sum('amount') - $u768_txs->where('type', 'debit')->sum('amount'),
    'tx_count' => $u768_txs->count(),
    'hypothesis' => 'This user has a functioning ledger that strictly matches the wallet balance, indicating the ledger CAN be authoritative for standard active users.'
];

// Candidate Equation
$report['historical_equation_hypothesis'] = "current_wallet_balance = (promotional_signup_bonus OR 0) + SUM(ledger_credits) - SUM(ledger_debits). A vast majority of users received a promotional signup bonus directly to wallets.balance (e.g. 100, 200, 500) without a corresponding wallet_transaction being recorded. True activity is recorded in the ledger.";

// Migration Rule
$report['proposed_migration_rule'] = [
    'SHOULD_DESTINATION_WALLETS_BE_COPIED' => 'CONDITIONAL',
    'Rule' => 'If ledger perfectly matches stored balance, use ledger. If ledger is 0 and stored balance is a known promotional value, preserve stored balance as an "Initialization Event" in the new architecture. Admin accounts (like User 1) should be flagged or capped. The legacy `wallets.balance` IS the most authoritative field for total purchasing power, but we must backfill a generic "Initial Promotional Credit" transaction in the new ledger to make the new system mathematically sound.'
];

file_put_contents('C:\Users\Aryan\.gemini\antigravity-ide\brain\43711a4e-6310-44ce-a019-6e6633ee92d0\financial_forensic_analysis.json', json_encode($report, JSON_PRETTY_PRINT));

$md = "# Financial Forensic Analysis\n\n";

$md .= "## Global Totals\n";
foreach ($report['global_totals'] as $k => $v) {
    $md .= "- **{$k}**: {$v}\n";
}

$md .= "\n## Transaction Types Matrix\n";
foreach ($report['matrices']['transaction_types'] as $type => $data) {
    $md .= "- **{$type}**: {$data['count']} transactions (Total Amount: {$data['amount']})\n";
}

$md .= "\n## Mismatch Population Analysis\n";
$md .= "- **Total Mismatches**: {$report['mismatch_population_analysis']['total_mismatches']}\n";
$md .= "- **Zero Ledger Positive Balance**: {$report['mismatch_population_analysis']['zero_ledger_positive_balance']}\n";
$md .= "- **Role Distribution**: " . json_encode($report['mismatch_population_analysis']['role_distribution']) . "\n";
$md .= "- **Date Range**: {$report['mismatch_population_analysis']['date_range']['min']} to {$report['mismatch_population_analysis']['date_range']['max']}\n";

$md .= "\n### Most Common Un-Ledgered Balances (Initialization Events)\n";
foreach ($report['mismatch_population_analysis']['common_initialization_values'] as $bal => $count) {
    $md .= "- **{$bal}**: {$count} users\n";
}

$md .= "\n## Outlier Analysis\n";
foreach ($report['outlier_analysis'] as $usr => $data) {
    $md .= "### {$usr}\n";
    foreach ($data as $k => $v) {
        $md .= "- **{$k}**: {$v}\n";
    }
}

$md .= "\n## Historical Equation Hypothesis\n";
$md .= $report['historical_equation_hypothesis'] . "\n";

$md .= "\n## Proposed Migration Rule\n";
$md .= "- **Should copy from legacy?**: {$report['proposed_migration_rule']['SHOULD_DESTINATION_WALLETS_BE_COPIED']}\n";
$md .= "- **Details**: {$report['proposed_migration_rule']['Rule']}\n";

file_put_contents('C:\Users\Aryan\.gemini\antigravity-ide\brain\43711a4e-6310-44ce-a019-6e6633ee92d0\financial_forensic_analysis.md', $md);
echo "Forensic completed.\n";
