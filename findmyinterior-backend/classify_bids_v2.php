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
        'PROJECT QUOTES' => 0,
        'JOB APPLICATIONS' => 0,
        'RFQ QUOTATIONS' => 0,
        'ORPHANED' => 0,
        'UNKNOWN' => 0,
        'INVALID' => 0,
        'DUPLICATE_CONFLICT' => 0,
    ],
    'percentages' => [],
    'bids' => []
];

foreach ($bids as $bid) {
    $r_id = $bid->requirement_id;
    $r_type = strtolower($bid->requirement_type ?? ''); // might be 'project', 'workerjob', 'rfq', etc
    
    // Check actual parent table existence
    $in_projects = $conn->table('projects')->where('id', $r_id)->exists();
    $in_worker_jobs = $conn->table('worker_jobs')->where('id', $r_id)->exists();
    $in_rfqs = $conn->table('rfqs')->where('id', $r_id)->exists();
    // Also check requirements if it exists
    $in_requirements = false;
    if ($conn->getSchemaBuilder()->hasTable('requirements')) {
        $in_requirements = $conn->table('requirements')->where('id', $r_id)->exists();
    }
    
    $matches = [];
    if ($in_projects) $matches[] = 'projects';
    if ($in_worker_jobs) $matches[] = 'worker_jobs';
    if ($in_rfqs) $matches[] = 'rfqs';
    if ($in_requirements) $matches[] = 'requirements';
    
    $actual_parent_exists = count($matches) > 0;
    $actual_parent_table = $actual_parent_exists ? implode(', ', $matches) : 'NONE';
    
    $actual_domain = null;
    $classification = '';
    $dest_table = null;
    $reasoning = "";
    $block_reason = null;
    $confidence = 'LOW';
    
    if (count($matches) > 1) {
        $classification = 'DUPLICATE_CONFLICT';
        $block_reason = "Requirement ID {$r_id} exists in multiple tables: " . implode(', ', $matches);
        $reasoning = "Cannot map deterministically because parent ID is ambiguous.";
    } elseif (count($matches) === 0) {
        $classification = 'ORPHANED';
        $block_reason = "Parent ID {$r_id} does not exist in any requirement table (projects, worker_jobs, rfqs, requirements).";
        $reasoning = "Orphaned record detected.";
    } else {
        $parent = $matches[0];
        
        // Let's resolve the actual domain
        if ($parent === 'projects') {
            // Check if the project is actually a WorkerJob that was stored in 'projects' table
            // Maybe 'projects' has a 'type' column?
            $parent_row = $conn->table('projects')->where('id', $r_id)->first();
            $project_type = isset($parent_row->type) ? strtolower($parent_row->type) : 'unknown';
            $project_category = isset($parent_row->project_type) ? strtolower($parent_row->project_type) : 'unknown';
            
            // Or maybe the legacy system just stored everything in projects
            if (strpos($r_type, 'workerjob') !== false || strpos($r_type, 'job') !== false) {
                // It says workerjob but lives in projects. Why?
                $classification = 'JOB APPLICATIONS';
                $dest_table = 'job_applications';
                $actual_domain = 'worker_job';
                $reasoning = "Parent is in 'projects' table but legacy requirement_type indicates '{$bid->requirement_type}'. We must classify as JOB APPLICATIONS based on C1 architecture rules (WorkerJob -> job_applications), though it requires extracting from projects table.";
                $confidence = 'MEDIUM';
            } elseif (strpos($r_type, 'rfq') !== false) {
                $classification = 'RFQ QUOTATIONS';
                $dest_table = 'rfq_quotations';
                $actual_domain = 'rfq';
                $reasoning = "Parent in 'projects', but type indicates RFQ.";
                $confidence = 'MEDIUM';
            } else {
                $classification = 'PROJECT QUOTES';
                $dest_table = 'project_quotes';
                $actual_domain = 'project';
                $reasoning = "Parent exists in 'projects' and no conflicting type info found.";
                $confidence = 'HIGH';
            }
        } elseif ($parent === 'worker_jobs') {
            $classification = 'JOB APPLICATIONS';
            $dest_table = 'job_applications';
            $actual_domain = 'worker_job';
            $reasoning = "Parent unambiguously found in 'worker_jobs' table.";
            $confidence = 'HIGH';
        } elseif ($parent === 'rfqs') {
            $classification = 'RFQ QUOTATIONS';
            $dest_table = 'rfq_quotations';
            $actual_domain = 'rfq';
            $reasoning = "Parent unambiguously found in 'rfqs' table.";
            $confidence = 'HIGH';
        } elseif ($parent === 'requirements') {
            // Legacy requirements table
            $classification = 'UNKNOWN';
            $block_reason = "Parent is in legacy 'requirements' table but not migrated to C1 domains yet.";
            $reasoning = "Needs domain splitting first.";
        }
    }
    
    // Explicitly check for Bid #1 logic based on user's exact query
    // If it's literally Bid #1, log extreme detail
    if ($bid->id == 1) {
        $reasoning .= " [Forensic on Bid #1: req_type='{$bid->requirement_type}', matches='{$actual_parent_table}']";
    }
    
    $report['counts'][$classification]++;
    
    $bid_data = [
        'bid_id' => $bid->id,
        'requirement_id' => $r_id,
        'legacy_requirement_type' => $bid->requirement_type,
        'actual_parent_table' => $actual_parent_table,
        'actual_parent_exists' => $actual_parent_exists ? 'YES' : 'NO',
        'actual_domain' => $actual_domain,
        'destination_table' => $dest_table,
        'classification' => $classification,
        'mapping_confidence' => $confidence,
        'reasoning' => $reasoning,
    ];
    if ($block_reason) $bid_data['block_reason'] = $block_reason;
    
    $report['bids'][] = $bid_data;
}

$total = $report['total_legacy_bids'];
if ($total > 0) {
    foreach ($report['counts'] as $class => $count) {
        $report['percentages'][$class] = round(($count / $total) * 100, 2) . '%';
    }
}

file_put_contents('C:\Users\Aryan\.gemini\antigravity-ide\brain\43711a4e-6310-44ce-a019-6e6633ee92d0\legacy_bid_mapping_report_v2.json', json_encode($report, JSON_PRETTY_PRINT));

$md = "# Legacy Bid Mapping Report V2 (Forensic Re-analysis)\n\n";
$md .= "- **Total Legacy Bids:** {$total}\n\n";

$md .= "## Classification Counts & Equation\n";
$sum = array_sum($report['counts']);
foreach ($report['counts'] as $class => $count) {
    $md .= "- **{$class}:** {$count}\n";
}
$md .= "\n- **Total Counted:** {$sum}\n";
$md .= "- **Equation Balances:** " . ($sum === $total ? 'YES' : 'NO') . "\n\n";

$md .= "## Forensic Details\n\n";
foreach ($report['bids'] as $b) {
    $md .= "### Bid #{$b['bid_id']}\n";
    $md .= "- **Requirement ID:** {$b['requirement_id']}\n";
    $md .= "- **Legacy Req Type:** {$b['legacy_requirement_type']}\n";
    $md .= "- **Actual Parent Table:** {$b['actual_parent_table']}\n";
    $md .= "- **Actual Domain:** " . ($b['actual_domain'] ?? 'N/A') . "\n";
    $md .= "- **Destination Table:** " . ($b['destination_table'] ?? 'N/A') . "\n";
    $md .= "- **Classification:** {$b['classification']}\n";
    $md .= "- **Confidence:** {$b['mapping_confidence']}\n";
    $md .= "- **Reasoning:** {$b['reasoning']}\n";
    if (isset($b['block_reason'])) {
        $md .= "- **Block Reason:** {$b['block_reason']}\n";
    }
    $md .= "\n";
}

file_put_contents('C:\Users\Aryan\.gemini\antigravity-ide\brain\43711a4e-6310-44ce-a019-6e6633ee92d0\legacy_bid_mapping_report_v2.md', $md);
echo "V2 Forensic completed. Balances: " . ($sum === $total ? 'YES' : 'NO') . "\n";
