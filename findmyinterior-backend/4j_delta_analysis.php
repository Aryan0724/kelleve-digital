<?php

$prodPdo = new PDO('mysql:host=127.0.0.1;dbname=findmyinterior_local;charset=utf8mb4', 'root', '', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
]);

$legacyPdo = new PDO('mysql:host=127.0.0.1;dbname=findmyinterior_legacy_restore;charset=utf8mb4', 'root', '', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
]);

$report = [
    'metadata' => [
        'generated_at' => date('Y-m-d H:i:s'),
        'prod_db' => 'findmyinterior_local',
        'legacy_db' => 'findmyinterior_legacy_restore'
    ],
    'deltas' => []
];

// 1. Users
$prodUsers = $prodPdo->query("SELECT id, name, email, phone, updated_at FROM users")->fetchAll();
$legacyUsers = $legacyPdo->query("SELECT id, name, email, phone, updated_at FROM users")->fetchAll();
$legacyUserMap = array_column($legacyUsers, null, 'id');

$usersDelta = [
    'NEW_AFTER_SNAPSHOT' => [],
    'MODIFIED_AFTER_SNAPSHOT' => [],
    'DELETED_AFTER_SNAPSHOT' => [],
    'UNCHANGED' => 0
];
foreach ($prodUsers as $u) {
    if (!isset($legacyUserMap[$u['id']])) {
        $usersDelta['NEW_AFTER_SNAPSHOT'][] = $u['id'];
    } else {
        $lu = $legacyUserMap[$u['id']];
        // Compare data (ignoring timestamp diffs unless name/email/phone changed)
        if ($u['name'] !== $lu['name'] || $u['email'] !== $lu['email'] || $u['phone'] !== $lu['phone']) {
            $usersDelta['MODIFIED_AFTER_SNAPSHOT'][] = [
                'id' => $u['id'],
                'prod' => $u,
                'legacy' => $lu
            ];
        } else {
            $usersDelta['UNCHANGED']++;
        }
        unset($legacyUserMap[$u['id']]);
    }
}
$usersDelta['DELETED_AFTER_SNAPSHOT'] = array_keys($legacyUserMap);
$report['deltas']['users'] = $usersDelta;

// 2. Wallets
$prodWallets = $prodPdo->query("SELECT id, user_id, balance FROM wallets")->fetchAll();
$legacyWallets = $legacyPdo->query("SELECT id, user_id, balance FROM wallets")->fetchAll();
$legacyWalletMap = array_column($legacyWallets, null, 'id');

$walletsDelta = [
    'NEW_AFTER_SNAPSHOT' => [],
    'MODIFIED_AFTER_SNAPSHOT' => [],
    'DELETED_AFTER_SNAPSHOT' => [],
    'UNCHANGED' => 0
];
foreach ($prodWallets as $w) {
    if (!isset($legacyWalletMap[$w['id']])) {
        $walletsDelta['NEW_AFTER_SNAPSHOT'][] = $w['id'];
    } else {
        $lw = $legacyWalletMap[$w['id']];
        if (bccomp($w['balance'], $lw['balance'], 2) !== 0) {
            $walletsDelta['MODIFIED_AFTER_SNAPSHOT'][] = [
                'id' => $w['id'],
                'user_id' => $w['user_id'],
                'prod_balance' => $w['balance'],
                'legacy_balance' => $lw['balance']
            ];
        } else {
            $walletsDelta['UNCHANGED']++;
        }
        unset($legacyWalletMap[$w['id']]);
    }
}
$walletsDelta['DELETED_AFTER_SNAPSHOT'] = array_keys($legacyWalletMap);
$report['deltas']['wallets'] = $walletsDelta;

// 3. Wallet Transactions
$prodTx = $prodPdo->query("SELECT id, wallet_id, amount, type, created_at FROM wallet_transactions")->fetchAll();
$legacyTx = $legacyPdo->query("SELECT id, wallet_id, amount, type, created_at FROM wallet_transactions")->fetchAll();
$legacyTxMap = array_column($legacyTx, null, 'id');

$txDelta = [
    'NEW_AFTER_SNAPSHOT' => [],
    'MODIFIED_AFTER_SNAPSHOT' => [],
    'DELETED_AFTER_SNAPSHOT' => [],
    'UNCHANGED' => 0
];
foreach ($prodTx as $tx) {
    if (!isset($legacyTxMap[$tx['id']])) {
        $txDelta['NEW_AFTER_SNAPSHOT'][] = $tx['id'];
    } else {
        $ltx = $legacyTxMap[$tx['id']];
        if ($tx['amount'] !== $ltx['amount'] || $tx['type'] !== $ltx['type']) {
            $txDelta['MODIFIED_AFTER_SNAPSHOT'][] = $tx['id'];
        } else {
            $txDelta['UNCHANGED']++;
        }
        unset($legacyTxMap[$tx['id']]);
    }
}
$txDelta['DELETED_AFTER_SNAPSHOT'] = array_keys($legacyTxMap);
$report['deltas']['wallet_transactions'] = $txDelta;

// 4. Payments
$prodPayments = $prodPdo->query("SELECT id FROM payments")->fetchAll();
$legacyPayments = $legacyPdo->query("SELECT id FROM payments")->fetchAll();
$legacyPaymentsMap = array_column($legacyPayments, null, 'id');
$paymentsDelta = ['NEW_AFTER_SNAPSHOT' => [], 'UNCHANGED' => 0, 'DELETED_AFTER_SNAPSHOT' => []];
foreach ($prodPayments as $p) {
    if (!isset($legacyPaymentsMap[$p['id']])) {
        $paymentsDelta['NEW_AFTER_SNAPSHOT'][] = $p['id'];
    } else {
        $paymentsDelta['UNCHANGED']++;
        unset($legacyPaymentsMap[$p['id']]);
    }
}
$paymentsDelta['DELETED_AFTER_SNAPSHOT'] = array_keys($legacyPaymentsMap);
$report['deltas']['payments'] = $paymentsDelta;

// 5. Contact Unlocks
$prodUnlocks = $prodPdo->query("SELECT id FROM contact_unlocks")->fetchAll();
$legacyUnlocks = $legacyPdo->query("SELECT id FROM contact_unlocks")->fetchAll();
$legacyUnlocksMap = array_column($legacyUnlocks, null, 'id');
$unlocksDelta = ['NEW_AFTER_SNAPSHOT' => [], 'UNCHANGED' => 0, 'DELETED_AFTER_SNAPSHOT' => []];
foreach ($prodUnlocks as $u) {
    if (!isset($legacyUnlocksMap[$u['id']])) {
        $unlocksDelta['NEW_AFTER_SNAPSHOT'][] = $u['id'];
    } else {
        $unlocksDelta['UNCHANGED']++;
        unset($legacyUnlocksMap[$u['id']]);
    }
}
$unlocksDelta['DELETED_AFTER_SNAPSHOT'] = array_keys($legacyUnlocksMap);
$report['deltas']['contact_unlocks'] = $unlocksDelta;


// 6. Projects vs Requirements
$prodProjects = $prodPdo->query("SELECT id, title FROM projects")->fetchAll();
$legacyReqs = $legacyPdo->query("SELECT id, title FROM projects")->fetchAll();
$legacyReqsMap = array_column($legacyReqs, null, 'id');

$reqDelta = [
    'NEW_AFTER_SNAPSHOT' => [],
    'UNCHANGED' => 0,
    'DELETED_AFTER_SNAPSHOT' => []
];
foreach ($prodProjects as $p) {
    if (!isset($legacyReqsMap[$p['id']])) {
        $reqDelta['NEW_AFTER_SNAPSHOT'][] = $p['id'];
    } else {
        $reqDelta['UNCHANGED']++;
        unset($legacyReqsMap[$p['id']]);
    }
}
$prodRFQs = $prodPdo->query("SELECT id FROM rfqs")->fetchAll();
foreach ($prodRFQs as $r) {
    $reqDelta['NEW_AFTER_SNAPSHOT'][] = 'rfq_' . $r['id'];
}
$prodWJs = $prodPdo->query("SELECT id FROM worker_jobs")->fetchAll();
foreach ($prodWJs as $w) {
    $reqDelta['NEW_AFTER_SNAPSHOT'][] = 'worker_job_' . $w['id'];
}

$reqDelta['DELETED_AFTER_SNAPSHOT'] = array_keys($legacyReqsMap);
$report['deltas']['requirements_and_projects'] = $reqDelta;

// 7. Bids
$prodBids = $prodPdo->query("SELECT id FROM bids")->fetchAll();
$legacyBids = $legacyPdo->query("SELECT id FROM bids")->fetchAll();
$legacyBidsMap = array_column($legacyBids, null, 'id');

$bidsDelta = ['NEW_AFTER_SNAPSHOT' => [], 'UNCHANGED' => 0, 'DELETED_AFTER_SNAPSHOT' => []];
foreach ($prodBids as $b) {
    if (!isset($legacyBidsMap[$b['id']])) {
        $bidsDelta['NEW_AFTER_SNAPSHOT'][] = $b['id'];
    } else {
        $bidsDelta['UNCHANGED']++;
        unset($legacyBidsMap[$b['id']]);
    }
}
$prodJobApps = $prodPdo->query("SELECT id FROM job_applications")->fetchAll();
foreach ($prodJobApps as $j) {
    $bidsDelta['NEW_AFTER_SNAPSHOT'][] = 'job_app_' . $j['id'];
}
$prodRfqQuotes = $prodPdo->query("SELECT id FROM rfq_quotations")->fetchAll();
foreach ($prodRfqQuotes as $r) {
    $bidsDelta['NEW_AFTER_SNAPSHOT'][] = 'rfq_quote_' . $r['id'];
}
$bidsDelta['DELETED_AFTER_SNAPSHOT'] = array_keys($legacyBidsMap);
$report['deltas']['bids_and_applications'] = $bidsDelta;

// Summarize financial delta hard stop
$financialStop = false;
$financialStopReason = [];
foreach (['wallets', 'wallet_transactions', 'payments', 'contact_unlocks'] as $table) {
    if (count($report['deltas'][$table]['NEW_AFTER_SNAPSHOT']) > 0 || count($report['deltas'][$table]['MODIFIED_AFTER_SNAPSHOT'] ?? []) > 0) {
        $financialStop = true;
        $financialStopReason[] = "Found new or modified records in $table.";
    }
}
$report['financial_hard_stop'] = $financialStop;
$report['financial_stop_reasons'] = $financialStopReason;

file_put_contents('C:\Users\Aryan\.gemini\antigravity-ide\brain\43711a4e-6310-44ce-a019-6e6633ee92d0\production_delta_analysis.json', json_encode($report, JSON_PRETTY_PRINT));

$md = "# Production Delta Analysis\n\n";
$md .= "Compared `findmyinterior_local` vs `findmyinterior_legacy_restore`\n\n";

if ($financialStop) {
    $md .= "> [!CAUTION]\n> **FINANCIAL HARD STOP TRIGGERED**\n> " . implode("\n> ", $financialStopReason) . "\n\n";
} else {
    $md .= "> [!NOTE]\n> **FINANCIAL CLEAR**: No new financial activity since snapshot.\n\n";
}

$md .= "## Entity Deltas\n\n";
foreach ($report['deltas'] as $entity => $delta) {
    $md .= "### " . ucfirst(str_replace('_', ' ', $entity)) . "\n";
    $md .= "- **UNCHANGED**: " . $delta['UNCHANGED'] . "\n";
    $md .= "- **NEW AFTER SNAPSHOT**: " . count($delta['NEW_AFTER_SNAPSHOT']) . "\n";
    if (isset($delta['MODIFIED_AFTER_SNAPSHOT'])) {
        $md .= "- **MODIFIED AFTER SNAPSHOT**: " . count($delta['MODIFIED_AFTER_SNAPSHOT']) . "\n";
    }
    $md .= "- **DELETED AFTER SNAPSHOT**: " . count($delta['DELETED_AFTER_SNAPSHOT']) . "\n\n";
    
    if (count($delta['NEW_AFTER_SNAPSHOT']) > 0) {
        $md .= "IDs of NEW: " . implode(', ', array_slice($delta['NEW_AFTER_SNAPSHOT'], 0, 10)) . (count($delta['NEW_AFTER_SNAPSHOT']) > 10 ? "..." : "") . "\n\n";
    }
}

file_put_contents('C:\Users\Aryan\.gemini\antigravity-ide\brain\43711a4e-6310-44ce-a019-6e6633ee92d0\production_delta_analysis.md', $md);

echo "Analysis complete. Financial stop: " . ($financialStop ? "YES" : "NO") . "\n";
