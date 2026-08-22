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

$bids = $conn->table('bids')->get();

$report = [
    'total_legacy_bids' => count($bids),
    'counts' => [
        'MAPPED_PROJECT_QUOTE' => 0,
        'MAPPED_JOB_APPLICATION' => 0,
        'MAPPED_RFQ_QUOTATION' => 0,
        'ORPHANED_REQUIREMENT' => 0,
        'UNKNOWN_TYPE' => 0,
        'INVALID_REFERENCE' => 0,
        'DUPLICATE_CONFLICT' => 0,
    ],
    'percentages' => [],
    'bids' => []
];

foreach ($bids as $bid) {
    $r_id = $bid->requirement_id;
    $r_type = $bid->requirement_type;
    
    // Check existence in tables
    $in_projects = $conn->table('projects')->where('id', $r_id)->exists();
    $in_jobs = $conn->table('worker_jobs')->where('id', $r_id)->exists();
    $in_rfqs = $conn->table('rfqs')->where('id', $r_id)->exists();
    
    $matches = 0;
    $actual_domain = null;
    $dest_table = null;
    
    if ($in_projects) { $matches++; $actual_domain = 'project'; $dest_table = 'project_quotes'; }
    if ($in_jobs) { $matches++; $actual_domain = 'worker_job'; $dest_table = 'job_applications'; }
    if ($in_rfqs) { $matches++; $actual_domain = 'rfq'; $dest_table = 'rfq_quotations'; }
    
    $classification = '';
    $block_reason = null;
    
    if ($matches > 1) {
        $classification = 'DUPLICATE_CONFLICT';
        $block_reason = "Requirement ID {$r_id} exists in multiple parent tables";
    } elseif ($matches == 0) {
        if (!in_array($r_type, ['project', 'job', 'rfq', 'worker_job'])) {
            $classification = 'UNKNOWN_TYPE';
            $block_reason = "Requirement type '{$r_type}' is unknown and ID {$r_id} does not exist in any valid parent table";
        } else {
            $classification = 'ORPHANED_REQUIREMENT';
            $block_reason = "Requirement ID {$r_id} does not exist in the {$r_type} table or any other parent table";
        }
    } else {
        // exactly 1 match
        if ($actual_domain == 'project') $classification = 'MAPPED_PROJECT_QUOTE';
        if ($actual_domain == 'worker_job') $classification = 'MAPPED_JOB_APPLICATION';
        if ($actual_domain == 'rfq') $classification = 'MAPPED_RFQ_QUOTATION';
    }
    
    $report['counts'][$classification]++;
    
    $bid_data = [
        'bid_id' => $bid->id,
        'professional_id' => $bid->professional_id,
        'source_requirement_id' => $r_id,
        'source_requirement_type' => $r_type,
        'detected_destination_domain' => $actual_domain,
        'destination_table' => $dest_table,
        'mapping_confidence' => ($classification === 'DUPLICATE_CONFLICT' || $matches == 0) ? 'LOW' : ($r_type === $actual_domain || ($r_type=='job' && $actual_domain=='worker_job') ? 'HIGH' : 'MEDIUM'),
        'classification' => $classification,
        'amount' => $bid->amount,
        'status' => $bid->status,
        'is_awarded' => $bid->is_awarded,
        'created_at' => $bid->created_at,
        'updated_at' => $bid->updated_at,
    ];
    
    if (in_array($classification, ['ORPHANED_REQUIREMENT', 'UNKNOWN_TYPE', 'INVALID_REFERENCE', 'DUPLICATE_CONFLICT'])) {
        $bid_data['block_reason'] = $block_reason;
    } else {
        $bid_data['proposed_destination_fields'] = [
            'requirement_fk' => $r_id,
            'user_fk' => $bid->professional_id,
            'amount' => $bid->amount,
            'status' => $bid->status,
            'is_awarded' => $bid->is_awarded,
            'message' => '...',
        ];
    }
    
    $report['bids'][] = $bid_data;
}

$total = $report['total_legacy_bids'];
if ($total > 0) {
    foreach ($report['counts'] as $class => $count) {
        $report['percentages'][$class] = round(($count / $total) * 100, 2) . '%';
    }
}

file_put_contents('C:\Users\Aryan\.gemini\antigravity-ide\brain\43711a4e-6310-44ce-a019-6e6633ee92d0\legacy_bid_mapping_report.json', json_encode($report, JSON_PRETTY_PRINT));

$md = "# Legacy Bid Mapping Report\n\n";
$md .= "- **Total Legacy Bids:** {$total}\n\n";

$md .= "## Classification Counts\n";
foreach ($report['counts'] as $class => $count) {
    $pct = $report['percentages'][$class] ?? '0%';
    $md .= "- **{$class}:** {$count} ({$pct})\n";
}

$md .= "\n## Equation Verification\n";
$sum = array_sum($report['counts']);
$md .= "- **Total Counted:** {$sum}\n";
$md .= "- **Equation Balances:** " . ($sum === $total ? 'YES' : 'NO') . "\n\n";

$md .= "## Bids Detail\n";
$md .= "| Bid ID | Req ID | Req Type | Detected Domain | Classification | Confidence | Block Reason |\n";
$md .= "|---|---|---|---|---|---|---|\n";
foreach ($report['bids'] as $b) {
    $r = $b['block_reason'] ?? '';
    $md .= "| {$b['bid_id']} | {$b['source_requirement_id']} | {$b['source_requirement_type']} | {$b['detected_destination_domain']} | {$b['classification']} | {$b['mapping_confidence']} | {$r} |\n";
}

file_put_contents('C:\Users\Aryan\.gemini\antigravity-ide\brain\43711a4e-6310-44ce-a019-6e6633ee92d0\legacy_bid_mapping_report.md', $md);

echo "Bid classification complete. Equation balances: " . ($sum === $total ? 'YES' : 'NO') . "\n";
