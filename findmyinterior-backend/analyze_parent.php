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

// Assuming fmi_mysql is the standard 'mysql' connection
$conn = DB::connection('legacy_restore');
$new_conn = DB::connection('mysql'); 

$legacy_project = $conn->table('projects')->where('id', 1)->first();
$worker_job_schema = $new_conn->getSchemaBuilder()->getColumnListing('worker_jobs');

if (!$legacy_project) {
    die("Legacy project id=1 not found\n");
}

$legacy_array = (array)$legacy_project;

$report = [
    'legacy_project_id' => 1,
    'schema_comparison' => [
        'mapped_directly' => [],
        'needs_transformation' => [],
        'no_destination' => [],
        'missing_from_legacy' => []
    ],
    'relationships_checking' => [],
    'PARENT_MIGRATION_STATUS' => 'UNKNOWN'
];

// Simple mapping heuristic
$possible_transforms = [
    'budget' => 'budget', // example
    'location' => 'location_id',
    'title' => 'title',
    'description' => 'description'
];

foreach ($legacy_array as $col => $val) {
    if (in_array($col, $worker_job_schema)) {
        $report['schema_comparison']['mapped_directly'][$col] = $val;
    } else {
        $report['schema_comparison']['no_destination'][$col] = $val;
    }
}

foreach ($worker_job_schema as $col) {
    if (!array_key_exists($col, $legacy_array)) {
        // Does not exist exactly in legacy
        $report['schema_comparison']['missing_from_legacy'][] = $col;
    }
}

// Check other tables referencing projects.id = 1
$ref_tables = ['bids', 'contact_unlocks', 'messages', 'project_milestones'];
foreach ($ref_tables as $tbl) {
    if ($conn->getSchemaBuilder()->hasTable($tbl)) {
        $col = ($tbl === 'bids' || $tbl === 'contact_unlocks') ? 'requirement_id' : 'project_id';
        if ($conn->getSchemaBuilder()->hasColumn($tbl, $col)) {
            $count = $conn->table($tbl)->where($col, 1)->count();
            if ($count > 0) {
                $report['relationships_checking'][] = "{$tbl} references this parent {$count} times.";
            }
        }
    }
}

// Check if worker_jobs schema requires missing fields (not nullable)
$missing_required = [];
$columns = $new_conn->select("SHOW COLUMNS FROM worker_jobs");
$not_null_cols = [];
foreach ($columns as $c) {
    if ($c->Null === 'NO' && $c->Default === null && $c->Extra !== 'auto_increment') {
        $not_null_cols[] = $c->Field;
    }
}

foreach ($report['schema_comparison']['missing_from_legacy'] as $miss_col) {
    if (in_array($miss_col, $not_null_cols)) {
        $missing_required[] = $miss_col;
    }
}

// Check if we can preserve ID
$id_in_use = $new_conn->table('worker_jobs')->where('id', 1)->exists();
$report['id_preservation'] = [
    'can_preserve_id' => !$id_in_use,
    'old_id' => 1,
    'new_id' => $id_in_use ? 'auto-increment' : 1
];

if (count($missing_required) > 0) {
    $report['PARENT_MIGRATION_STATUS'] = 'MIGRATION_BLOCKED';
    $report['block_reason'] = "Missing required non-nullable fields: " . implode(', ', $missing_required);
} else {
    $report['PARENT_MIGRATION_STATUS'] = 'SAFE_TO_MIGRATE';
}

file_put_contents('C:\Users\Aryan\.gemini\antigravity-ide\brain\43711a4e-6310-44ce-a019-6e6633ee92d0\legacy_workerjob_parent_mapping.json', json_encode($report, JSON_PRETTY_PRINT));

$md = "# Legacy WorkerJob Parent Mapping Analysis (projects.id=1)\n\n";

$md .= "## Migration Status\n";
$md .= "- **PARENT_MIGRATION_STATUS:** {$report['PARENT_MIGRATION_STATUS']}\n\n";

$md .= "## Schema Comparison\n";
$md .= "### Mapped Directly\n";
foreach ($report['schema_comparison']['mapped_directly'] as $col => $val) {
    $md .= "- `{$col}` => `{$val}`\n";
}

$md .= "### No Destination (Legacy fields to be dropped or transformed)\n";
foreach ($report['schema_comparison']['no_destination'] as $col => $val) {
    $md .= "- `{$col}` => `{$val}`\n";
}

$md .= "### Missing from Legacy (Required by WorkerJobs)\n";
foreach ($report['schema_comparison']['missing_from_legacy'] as $col) {
    $md .= "- `{$col}`\n";
}

$md .= "\n## ID Preservation\n";
$md .= "- **Can preserve ID:** " . ($report['id_preservation']['can_preserve_id'] ? 'YES' : 'NO') . "\n";

$md .= "\n## Relationships Checking\n";
foreach ($report['relationships_checking'] as $rel) {
    $md .= "- {$rel}\n";
}

file_put_contents('C:\Users\Aryan\.gemini\antigravity-ide\brain\43711a4e-6310-44ce-a019-6e6633ee92d0\legacy_workerjob_parent_mapping.md', $md);
echo "Parent mapping completed\n";
