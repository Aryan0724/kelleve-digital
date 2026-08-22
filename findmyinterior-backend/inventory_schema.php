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
$schema = $conn->getSchemaBuilder();
$tables = array_map('current', $conn->select('SHOW TABLES'));

$inventory = [];
foreach ($tables as $table) {
    $cols = $schema->getColumns($table);
    $indexes = $conn->select("SHOW INDEX FROM {$table}");
    $row_count = $conn->table($table)->count();
    
    // foreign keys
    $fks = [];
    try {
        $fks = $schema->getForeignKeys($table);
    } catch(\Exception $e) {
        // Fallback or ignore if not supported by this Doctrine DBAL version
    }

    $inventory[$table] = [
        'row_count' => $row_count,
        'columns' => $cols,
        'indexes' => $indexes,
        'foreign_keys' => $fks
    ];
}

file_put_contents('legacy_schema_inventory.json', json_encode($inventory, JSON_PRETTY_PRINT));

$md = "# Legacy Schema Inventory\n\n";
foreach ($inventory as $table => $info) {
    $md .= "## `{$table}` ({$info['row_count']} rows)\n";
    $md .= "### Columns\n";
    foreach ($info['columns'] as $col) {
        $md .= "- `{$col['name']}` ({$col['type_name']})\n";
    }
    $md .= "### Indexes\n";
    $idxNames = [];
    foreach ($info['indexes'] as $idx) {
        $idxNames[$idx->Key_name][] = $idx->Column_name;
    }
    foreach ($idxNames as $name => $cols) {
        $md .= "- `{$name}` on (" . implode(', ', $cols) . ")\n";
    }
    if (!empty($info['foreign_keys'])) {
        $md .= "### Foreign Keys\n";
        foreach ($info['foreign_keys'] as $fk) {
            $md .= "- `{$fk['name']}`: `" . implode(',', $fk['columns']) . "` references `{$fk['foreign_table']}`(`" . implode(',', $fk['foreign_columns']) . "`)\n";
        }
    }
    $md .= "\n";
}
file_put_contents('legacy_schema_inventory.md', $md);
echo "Inventory written to legacy_schema_inventory.json and .md\n";
