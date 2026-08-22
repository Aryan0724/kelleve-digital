<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

config(['database.connections.legacy_restore' => [
    'driver' => 'mysql',
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', '3306'),
    'database' => 'findmyinterior_legacy_restore',
    'username' => env('DB_USERNAME', 'root'),
    'password' => env('DB_PASSWORD', ''),
]]);

$conn = DB::connection('legacy_restore');

$wallets = $conn->table('wallets')->get()->keyBy('user_id');
$transactions = $conn->table('wallet_transactions')->get();
$payments = $conn->table('payments')->get();
$unlocks = $conn->table('contact_unlocks')->get();

$users = [];

// Populate users with wallets
foreach ($wallets as $w) {
    $users[$w->user_id] = [
        'stored_balance' => (float) $w->balance,
        'ledger_balance' => 0.0,
        'payment_derived' => 0.0,
        'unlock_derived' => 0.0,
        'admin_adjustments' => 0.0,
        'refunds' => 0.0,
        'classification' => '',
        'difference' => 0.0
    ];
}

// 1. Transaction Types and Semantics
$transaction_semantics = [];
foreach ($transactions as $t) {
    // Basic semantics by type/desc
    $t_type = $t->type; // 'credit', 'debit'
    $desc = strtolower($t->description);
    
    $semantic = [
        'increases' => $t_type === 'credit',
        'decreases' => $t_type === 'debit',
        'is_admin' => strpos($desc, 'admin') !== false || strpos($desc, 'adjustment') !== false,
        'is_refund' => strpos($desc, 'refund') !== false,
    ];
    
    $transaction_semantics[$t->id] = $semantic;
    
    // Process ledger for user
    $uid = null;
    $wallet = $wallets->where('id', $t->wallet_id)->first();
    if ($wallet) {
        $uid = $wallet->user_id;
    }
    
    if (!$uid) {
        // Orphan
        continue;
    }
    
    if (!isset($users[$uid])) {
        $users[$uid] = [
            'stored_balance' => 0.0,
            'ledger_balance' => 0.0,
            'payment_derived' => 0.0,
            'unlock_derived' => 0.0,
            'admin_adjustments' => 0.0,
            'refunds' => 0.0,
            'classification' => '',
            'difference' => 0.0
        ];
    }
    
    $amt = (float) $t->amount;
    if ($t_type === 'credit') {
        $users[$uid]['ledger_balance'] += $amt;
        if ($semantic['is_admin']) $users[$uid]['admin_adjustments'] += $amt;
        if ($semantic['is_refund']) $users[$uid]['refunds'] += $amt;
    } else {
        $users[$uid]['ledger_balance'] -= $amt;
        if ($semantic['is_admin']) $users[$uid]['admin_adjustments'] -= $amt;
    }
}

// 2. Payments
foreach ($payments as $p) {
    $uid = $p->user_id;
    if (!isset($users[$uid])) {
         $users[$uid] = [
            'stored_balance' => 0.0,
            'ledger_balance' => 0.0,
            'payment_derived' => 0.0,
            'unlock_derived' => 0.0,
            'admin_adjustments' => 0.0,
            'refunds' => 0.0,
            'classification' => '',
            'difference' => 0.0
        ];
    }
    // Only successful payments add to the theoretical payment-derived position
    if (strtolower($p->status) === 'captured' || strtolower($p->status) === 'successful' || strtolower($p->status) === 'success' || strtolower($p->status) === 'paid') {
        // payments are stored in paise/cents usually? Check amount size vs wallet.
        // Assuming amount is in INR since FindMyInterior is Indian, amount might be raw INR or paise. Let's assume raw INR for now or check if > 10000.
        // The original schema is `decimal(10,2)`. Let's assume it's exact amount.
        $amt = (float) $p->amount;
        $users[$uid]['payment_derived'] += $amt;
    }
}

// 3. Unlocks
foreach ($unlocks as $u) {
    $uid = $u->user_id;
    if (!isset($users[$uid])) {
        continue;
    }
    // Unlocks cost money. In legacy, how much? We can only infer from deductions unless price is stored.
    // If unlock_price is stored:
    if (isset($u->price)) {
        $users[$uid]['unlock_derived'] += (float)$u->price;
    } else {
        // Check amount in related transaction
        // Normally unlock deductions are exactly related.
        // Assuming 199 or something. Let's just tally transaction deductions with 'unlock' in description.
    }
}

// Re-evaluate unlock derived from transactions directly if missing
foreach ($transactions as $t) {
    if (strpos(strtolower($t->description), 'unlock') !== false && $t->type === 'debit') {
        $wallet = $wallets->where('id', $t->wallet_id)->first();
        if ($wallet) {
            $users[$wallet->user_id]['unlock_derived'] += (float)$t->amount;
        }
    }
}

$report = [
    'users' => [],
    'totals' => [
        'FINANCIAL_MATCH' => 0,
        'FINANCIAL_MISMATCH' => 0,
        'MISSING_WALLET' => 0,
        'ORPHAN_TRANSACTION' => 0,
        'AMBIGUOUS_SEMANTICS' => 0,
        'INSUFFICIENT_DATA' => 0,
    ]
];

foreach ($users as $uid => $data) {
    // Check if missing wallet
    if (!isset($wallets[$uid])) {
        $data['classification'] = 'MISSING_WALLET';
    } else {
        $data['difference'] = round($data['stored_balance'] - $data['ledger_balance'], 2);
        
        if ($data['difference'] == 0.0) {
            $data['classification'] = 'FINANCIAL_MATCH';
        } else {
            $data['classification'] = 'FINANCIAL_MISMATCH';
        }
    }
    
    // Also check orphans
    
    $report['totals'][$data['classification']]++;
    $report['users'][$uid] = $data;
}

// Check orphans in transactions
$orphan_tx = 0;
foreach ($transactions as $t) {
    $wallet = $wallets->where('id', $t->wallet_id)->first();
    if (!$wallet) $orphan_tx++;
}
if ($orphan_tx > 0) {
    $report['totals']['ORPHAN_TRANSACTION'] += $orphan_tx;
}

file_put_contents('C:\Users\Aryan\.gemini\antigravity-ide\brain\43711a4e-6310-44ce-a019-6e6633ee92d0\financial_legacy_reconciliation.json', json_encode($report, JSON_PRETTY_PRINT));

$md = "# Financial Legacy Reconciliation\n\n";

$md .= "## Classification Totals\n";
foreach ($report['totals'] as $class => $count) {
    $md .= "- **{$class}**: {$count}\n";
}

$md .= "\n## User Breakdown\n";
$md .= "| User ID | Stored Balance | Ledger (Cr-Dr) | Difference | Payment Derived | Unlock Derived | Classification |\n";
$md .= "|---|---|---|---|---|---|---|\n";
foreach ($report['users'] as $uid => $d) {
    $md .= "| {$uid} | {$d['stored_balance']} | {$d['ledger_balance']} | {$d['difference']} | {$d['payment_derived']} | {$d['unlock_derived']} | {$d['classification']} |\n";
}

file_put_contents('C:\Users\Aryan\.gemini\antigravity-ide\brain\43711a4e-6310-44ce-a019-6e6633ee92d0\financial_legacy_reconciliation.md', $md);
echo "Financial Discovery Complete.\n";
