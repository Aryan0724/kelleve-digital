<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class StorageInventoryCommand extends Command
{
    protected $signature = 'fmi:storage-inventory';
    protected $description = 'Inventory Base64 blobs in the legacy restore database';

    public function handle()
    {
        $this->info('Starting storage inventory on findmyinterior_legacy_restore...');

        config(['database.connections.legacy_restore' => [
            'driver' => 'mysql',
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '3306'),
            'database' => 'findmyinterior_legacy_restore',
            'username' => env('DB_USERNAME', 'root'),
            'password' => env('DB_PASSWORD', ''),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'prefix' => '',
            'strict' => true,
        ]]);
        $connection = DB::connection('legacy_restore');
        
        $schema = $connection->getSchemaBuilder();
        $tables = array_map('current', $connection->select('SHOW TABLES'));

        $inventory = [
            'total_base64_records' => 0,
            'total_encoded_bytes' => 0,
            'total_decoded_bytes' => 0,
            'tables' => [],
            'mime_distribution' => [],
            'duplicates' => [
                'count' => 0,
                'hashes' => []
            ],
            'invalid_malformed' => 0,
        ];

        foreach ($tables as $table) {
            $this->info("Scanning table: {$table}");
            $columns = $schema->getColumns($table);
            
            $textColumns = [];
            foreach ($columns as $column) {
                if (in_array(strtolower($column['type_name']), ['text', 'mediumtext', 'longtext', 'varchar'])) {
                    $textColumns[] = $column['name'];
                }
            }

            if (empty($textColumns)) {
                continue;
            }

            $primaryKey = 'id';
            if (!$schema->hasColumn($table, 'id')) {
                $indexes = $connection->select("SHOW INDEX FROM {$table} WHERE Key_name = 'PRIMARY'");
                if (count($indexes) > 0) {
                    $primaryKey = $indexes[0]->Column_name;
                } else {
                    $primaryKey = null;
                }
            }

            $query = $connection->table($table);
            
            $tableStats = [
                'total_base64_records' => 0,
                'total_encoded_bytes' => 0,
                'columns' => []
            ];

            foreach ($query->cursor() as $row) {
                $rowArray = (array) $row;
                $rowId = $primaryKey ? $rowArray[$primaryKey] : 'unknown';

                foreach ($textColumns as $col) {
                    $value = $rowArray[$col];
                    if (empty($value) || !is_string($value)) continue;

                    $isDataUri = str_starts_with($value, 'data:');
                    $isRawBase64 = !$isDataUri && strlen($value) > 100 && !preg_match('/\s/', $value) && preg_match('/^[a-zA-Z0-9\/\+]+={0,2}$/', $value);

                    if ($isDataUri || $isRawBase64) {
                        $encodedSize = strlen($value);
                        
                        $mimeType = 'unknown';
                        $base64Data = $value;
                        $valid = false;
                        $decodedSize = 0;

                        if ($isDataUri) {
                            if (preg_match('/^data:([^;]+);base64,(.+)$/', $value, $matches)) {
                                $mimeType = $matches[1];
                                $base64Data = $matches[2];
                                $decoded = base64_decode($base64Data, true);
                                if ($decoded !== false) {
                                    $valid = true;
                                    $decodedSize = strlen($decoded);
                                }
                            }
                        } else {
                            $decoded = base64_decode($base64Data, true);
                            if ($decoded !== false) {
                                $valid = true;
                                $decodedSize = strlen($decoded);
                            }
                        }

                        if (!$valid) {
                            $inventory['invalid_malformed']++;
                        } else {
                            $inventory['total_base64_records']++;
                            $inventory['total_encoded_bytes'] += $encodedSize;
                            $inventory['total_decoded_bytes'] += $decodedSize;
                            
                            $tableStats['total_base64_records']++;
                            $tableStats['total_encoded_bytes'] += $encodedSize;
                            
                            if (!isset($tableStats['columns'][$col])) {
                                $tableStats['columns'][$col] = [
                                    'count' => 0, 
                                    'bytes' => 0,
                                    'mime_distribution' => []
                                ];
                            }
                            $tableStats['columns'][$col]['count']++;
                            $tableStats['columns'][$col]['bytes'] += $encodedSize;
                            
                            if (!isset($tableStats['columns'][$col]['mime_distribution'][$mimeType])) {
                                $tableStats['columns'][$col]['mime_distribution'][$mimeType] = 0;
                            }
                            $tableStats['columns'][$col]['mime_distribution'][$mimeType]++;

                            if (!isset($inventory['mime_distribution'][$mimeType])) {
                                $inventory['mime_distribution'][$mimeType] = 0;
                            }
                            $inventory['mime_distribution'][$mimeType]++;

                            $hash = hash('sha256', $base64Data);
                            if (!isset($inventory['duplicates']['hashes'][$hash])) {
                                $inventory['duplicates']['hashes'][$hash] = 1;
                            } else {
                                $inventory['duplicates']['hashes'][$hash]++;
                                $inventory['duplicates']['count']++;
                            }
                        }
                    }
                }
            }

            if ($tableStats['total_base64_records'] > 0) {
                $inventory['tables'][$table] = $tableStats;
            }
        }

        unset($inventory['duplicates']['hashes']);

        file_put_contents(base_path('storage_inventory.json'), json_encode($inventory, JSON_PRETTY_PRINT));

        $md = "# Storage Inventory Report\n\n";
        $md .= "- **Total Base64 Records:** {$inventory['total_base64_records']}\n";
        $md .= "- **Total Encoded Bytes:** " . number_format($inventory['total_encoded_bytes']) . " bytes\n";
        $md .= "- **Total Decoded Bytes:** " . number_format($inventory['total_decoded_bytes']) . " bytes\n";
        $md .= "- **Invalid/Malformed Records:** {$inventory['invalid_malformed']}\n";
        $md .= "- **Duplicate Blobs (Redundant Data):** {$inventory['duplicates']['count']}\n\n";
        
        $md .= "## Mime Types\n";
        foreach ($inventory['mime_distribution'] as $mime => $count) {
            $md .= "- `{$mime}`: {$count}\n";
        }

        $md .= "\n## Table Breakdown\n";
        foreach ($inventory['tables'] as $table => $stats) {
            $md .= "### `{$table}`\n";
            $md .= "- Records: {$stats['total_base64_records']}\n";
            $md .= "- Encoded Bytes: " . number_format($stats['total_encoded_bytes']) . "\n";
            foreach ($stats['columns'] as $col => $colStats) {
                $md .= "  - Column `{$col}`: {$colStats['count']} records (" . number_format($colStats['bytes']) . " bytes)\n";
                foreach ($colStats['mime_distribution'] as $mime => $mCount) {
                    $md .= "    - `{$mime}`: {$mCount}\n";
                }
            }
        }

        file_put_contents(base_path('storage_inventory.md'), $md);

        $this->info('Inventory complete! Check storage_inventory.json and storage_inventory.md');
    }
}
