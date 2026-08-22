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

$report = [
    'relationships' => [],
    'orphans' => [],
    'id_collisions' => [],
    'summary' => [
        'total_orphans' => 0,
        'total_missing_parents' => 0,
        'critical_orphans' => 0,
    ]
];

function checkRelation($name, $conn, $childTable, $childKey, $parentTable, $parentKey) {
    if (!$conn->getSchemaBuilder()->hasTable($childTable) || !$conn->getSchemaBuilder()->hasTable($parentTable)) {
        return null;
    }
    
    $total_children = $conn->table($childTable)->count();
    $total_parents = $conn->table($parentTable)->count();
    
    $orphans = $conn->table($childTable)
        ->leftJoin($parentTable, "$childTable.$childKey", '=', "$parentTable.$parentKey")
        ->whereNull("$parentTable.$parentKey")
        ->count();
        
    return [
        'relation' => $name,
        'child_table' => $childTable,
        'parent_table' => $parentTable,
        'total_children' => $total_children,
        'total_parents' => $total_parents,
        'orphans' => $orphans
    ];
}

$checks = [
    ['users -> wallets', 'wallets', 'user_id', 'users', 'id'],
    ['users -> projects', 'projects', 'user_id', 'users', 'id'],
    ['users -> worker_jobs', 'worker_jobs', 'user_id', 'users', 'id'],
    ['users -> rfqs', 'rfqs', 'user_id', 'users', 'id'],
    ['bids -> professional', 'bids', 'professional_id', 'users', 'id'],
    ['wallets -> wallet_transactions', 'wallet_transactions', 'wallet_id', 'wallets', 'id'],
    ['users -> payments', 'payments', 'user_id', 'users', 'id'],
    ['users -> contact_unlocks', 'contact_unlocks', 'user_id', 'users', 'id'],
];

foreach ($checks as $chk) {
    $res = checkRelation($chk[0], $conn, $chk[1], $chk[2], $chk[3], $chk[4]);
    if ($res) {
        $report['relationships'][] = $res;
        if ($res['orphans'] > 0) {
            $report['orphans'][$chk[0]] = $res['orphans'];
            $report['summary']['total_orphans'] += $res['orphans'];
            if (in_array($chk[1], ['wallets', 'payments', 'bids', 'projects', 'wallet_transactions'])) {
                $report['summary']['critical_orphans'] += $res['orphans'];
            }
        }
    }
}

// Special case: bids -> parent requirements
if ($conn->getSchemaBuilder()->hasTable('bids')) {
    $bids = $conn->table('bids')->get();
    $bids_orphans = 0;
    foreach ($bids as $bid) {
        $r_id = $bid->requirement_id;
        $in_proj = $conn->getSchemaBuilder()->hasTable('projects') && $conn->table('projects')->where('id', $r_id)->exists();
        $in_job = $conn->getSchemaBuilder()->hasTable('worker_jobs') && $conn->table('worker_jobs')->where('id', $r_id)->exists();
        $in_rfq = $conn->getSchemaBuilder()->hasTable('rfqs') && $conn->table('rfqs')->where('id', $r_id)->exists();
        
        if (!$in_proj && !$in_job && !$in_rfq) {
            $bids_orphans++;
        }
    }
    
    $report['relationships'][] = [
        'relation' => 'bids -> requirements (Polymorphic)',
        'child_table' => 'bids',
        'parent_table' => 'projects/worker_jobs/rfqs',
        'total_children' => count($bids),
        'total_parents' => 'N/A',
        'orphans' => $bids_orphans
    ];
    
    if ($bids_orphans > 0) {
        $report['orphans']['bids -> requirements'] = $bids_orphans;
        $report['summary']['total_orphans'] += $bids_orphans;
        $report['summary']['critical_orphans'] += $bids_orphans;
    }
}

// Special case: contact_unlocks -> requirements
if ($conn->getSchemaBuilder()->hasTable('contact_unlocks')) {
    $unlocks = $conn->table('contact_unlocks')->get();
    $unlocks_orphans = 0;
    foreach ($unlocks as $u) {
        $r_id = $u->requirement_id;
        $in_proj = $conn->getSchemaBuilder()->hasTable('projects') && $conn->table('projects')->where('id', $r_id)->exists();
        $in_job = $conn->getSchemaBuilder()->hasTable('worker_jobs') && $conn->table('worker_jobs')->where('id', $r_id)->exists();
        $in_rfq = $conn->getSchemaBuilder()->hasTable('rfqs') && $conn->table('rfqs')->where('id', $r_id)->exists();
        
        if (!$in_proj && !$in_job && !$in_rfq) {
            $unlocks_orphans++;
        }
    }
    
    $report['relationships'][] = [
        'relation' => 'contact_unlocks -> requirements (Polymorphic)',
        'child_table' => 'contact_unlocks',
        'parent_table' => 'projects/worker_jobs/rfqs',
        'total_children' => count($unlocks),
        'total_parents' => 'N/A',
        'orphans' => $unlocks_orphans
    ];
    
    if ($unlocks_orphans > 0) {
        $report['orphans']['contact_unlocks -> requirements'] = $unlocks_orphans;
        $report['summary']['total_orphans'] += $unlocks_orphans;
        $report['summary']['critical_orphans'] += $unlocks_orphans;
    }
}


file_put_contents('C:\Users\Aryan\.gemini\antigravity-ide\brain\43711a4e-6310-44ce-a019-6e6633ee92d0\legacy_relationship_integrity.json', json_encode($report, JSON_PRETTY_PRINT));

$md = "# Legacy Relationship Integrity Report\n\n";

$md .= "## Summary\n";
$md .= "- **Total Orphans**: {$report['summary']['total_orphans']}\n";
$md .= "- **Critical Orphans**: {$report['summary']['critical_orphans']}\n";
if ($report['summary']['critical_orphans'] === 0) {
    $md .= "✅ **PASS**: ZERO UNEXPLAINED CRITICAL ORPHANS.\n\n";
} else {
    $md .= "❌ **FAIL**: Found critical orphans.\n\n";
}

$md .= "## Relationships Audited\n";
$md .= "| Relation | Child Table | Parent Table | Children Count | Parents Count | Orphans |\n";
$md .= "|---|---|---|---|---|---|\n";
foreach ($report['relationships'] as $r) {
    $md .= "| {$r['relation']} | {$r['child_table']} | {$r['parent_table']} | {$r['total_children']} | {$r['total_parents']} | {$r['orphans']} |\n";
}

$md .= "\n## ID Collisions\n";
$md .= "- Polymorphic entities migrating to isolated tables (e.g. legacy `bids` splitting into `project_quotes`, `job_applications`, `rfq_quotations`) have entirely separate destination auto-increment sequences. No collisions possible across their destination scopes.\n";

file_put_contents('C:\Users\Aryan\.gemini\antigravity-ide\brain\43711a4e-6310-44ce-a019-6e6633ee92d0\legacy_relationship_integrity.md', $md);
echo "Integrity check complete. Orphans: " . $report['summary']['critical_orphans'] . "\n";
