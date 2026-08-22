<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MigrateBase64StorageCommand extends Command
{
    protected $signature = 'fmi:storage-migrate 
                            {--dry-run : Perform a dry run without modifying anything} 
                            {--table= : Specific table to migrate} 
                            {--limit= : Limit the number of records to process} 
                            {--resume : Resume from the last unverified record} 
                            {--force-retry : Retry failed records}';
                            
    protected $description = 'Safely migrate Base64 blobs to object storage';

    public function handle()
    {
        $isDryRun = $this->option('dry-run');
        $targetTable = $this->option('table');
        $limit = $this->option('limit');
        $resume = $this->option('resume');
        $forceRetry = $this->option('force-retry');

        if ($isDryRun) {
            $this->info('Starting DRY RUN...');
        } else {
            $this->warn('Starting REAL EXTRACTION on findmyinterior_legacy_restore...');
        }

        // Configure connection
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
        
        // Define known mapping of Base64 columns to URL columns
        $tableMappings = [
            'listing_galleries' => ['image_url' => 'storage_url'],
            'listings' => ['cover_image' => 'cover_image_url'],
            'projects' => ['image' => 'image_url'],
            'user_documents' => ['file_path' => 'file_url'],
            'users' => ['avatar' => 'avatar_url', 'cover_image' => 'cover_image_url'],
        ];

        if ($targetTable && isset($tableMappings[$targetTable])) {
            $tableMappings = [$targetTable => $tableMappings[$targetTable]];
        }

        $stats = [
            'records_processed' => 0,
            'decoded_bytes' => 0,
            'expected_storage_usage' => 0,
            'duplicates_detected' => 0,
            'records_skipped' => 0,
            'records_rejected' => 0,
            'errors' => 0,
            'urls_populated' => 0,
            'unique_objects_written' => 0,
            'physical_bytes_written' => 0,
        ];
        
        $seenHashes = [];

        foreach ($tableMappings as $table => $columns) {
            $this->info("Processing table: {$table}");
            $query = $connection->table($table);
            
            if ($limit) {
                $query->limit($limit);
            }

            foreach ($query->cursor() as $row) {
                $rowArray = (array) $row;
                $rowId = $rowArray['id'] ?? null;
                if (!$rowId) continue;

                foreach ($columns as $sourceCol => $urlCol) {
                    $value = $rowArray[$sourceCol];
                    if (empty($value) || !is_string($value)) {
                        continue;
                    }
                    
                    // Skip if already migrated/has a valid URL
                    if (str_starts_with($value, 'http')) {
                        continue;
                    }

                    // For resumes: Check if already verified
                    if ($resume) {
                        $existingMig = $connection->table('storage_migrations')
                            ->where('source_table', $table)
                            ->where('source_column', $sourceCol)
                            ->where('source_record_id', $rowId)
                            ->first();
                        
                        if ($existingMig && $existingMig->status === 'VERIFIED') {
                            $stats['records_skipped']++;
                            continue;
                        }
                        if ($existingMig && $existingMig->status === 'FAILED' && !$forceRetry) {
                            $stats['records_skipped']++;
                            continue;
                        }
                    }
                    
                    $isDataUri = str_starts_with($value, 'data:');
                    $isRawBase64 = !$isDataUri && strlen($value) > 100 && !preg_match('/\s/', $value) && preg_match('/^[a-zA-Z0-9\/\+]+={0,2}$/', $value);

                    if (!$isDataUri && !$isRawBase64) {
                        continue;
                    }
                    
                    $mimeType = 'unknown';
                    $base64Data = $value;
                    if ($isDataUri && preg_match('/^data:([^;]+);base64,(.+)$/', $value, $matches)) {
                        $mimeType = $matches[1];
                        $base64Data = $matches[2];
                    }
                    
                    $decoded = base64_decode($base64Data, true);
                    if ($decoded === false) {
                        $stats['records_rejected']++;
                        $this->recordFailure($connection, $table, $sourceCol, $rowId, null, 'Invalid Base64 payload');
                        continue;
                    }

                    $decodedSize = strlen($decoded);
                    $sha256 = hash('sha256', $decoded);
                    $extension = $this->getExtensionFromMime($mimeType);
                    $path = "storage/migrated/blobs/{$sha256}.{$extension}";
                    
                    $stats['records_processed']++;
                    $stats['decoded_bytes'] += $decodedSize;
                    
                    $isDuplicate = false;
                    if (isset($seenHashes[$sha256])) {
                        $stats['duplicates_detected']++;
                        $isDuplicate = true;
                    } else {
                        // Also check DB for duplicates
                        $existing = $connection->table('storage_migrations')
                            ->where('destination_sha256', $sha256)
                            ->where('status', 'VERIFIED')
                            ->first();
                        if ($existing) {
                            $stats['duplicates_detected']++;
                            $isDuplicate = true;
                        } else {
                            $seenHashes[$sha256] = true;
                            $stats['expected_storage_usage'] += $decodedSize;
                        }
                    }

                    if ($isDryRun) {
                        continue;
                    }

                    // REAL EXTRACTION
                    try {
                        $disk = Storage::disk('local');
                        
                        if (!$isDuplicate || !$disk->exists($path)) {
                            // a. Write object
                            $disk->put($path, $decoded);
                            
                            // b. Verify exists
                            if (!$disk->exists($path)) {
                                throw new \Exception('File write verification failed');
                            }
                            
                            // c. Verify exact byte count
                            if ($disk->size($path) !== $decodedSize) {
                                throw new \Exception('Byte count mismatch');
                            }
                            
                            // d. Re-read and recalculate SHA-256
                            $writtenData = $disk->get($path);
                            $writtenSha256 = hash('sha256', $writtenData);
                            
                            // e. Require source == destination
                            if ($sha256 !== $writtenSha256) {
                                throw new \Exception('SHA-256 integrity mismatch');
                            }
                            
                            $stats['unique_objects_written']++;
                            $stats['physical_bytes_written'] += $decodedSize;
                        }

                        // Short DB Transaction
                        $connection->transaction(function () use ($connection, $table, $sourceCol, $urlCol, $rowId, $sha256, $decodedSize, $mimeType, $path, $isDuplicate) {
                            
                            // Populate URL column (keep Base64 column untouched)
                            $connection->table($table)->where('id', $rowId)->update([
                                $urlCol => $path
                            ]);
                            
                            // Create/Update audit record
                            $connection->table('storage_migrations')->updateOrInsert(
                                [
                                    'source_table' => $table,
                                    'source_column' => $sourceCol,
                                    'source_record_id' => $rowId,
                                ],
                                [
                                    'source_sha256' => $sha256,
                                    'decoded_size' => $decodedSize,
                                    'mime_type' => $mimeType,
                                    'storage_disk' => 'local',
                                    'storage_path' => $path,
                                    'destination_sha256' => $sha256,
                                    'destination_size' => $decodedSize,
                                    'destination_url' => $path,
                                    'status' => 'VERIFIED',
                                    'error_id' => null,
                                    'error_reason' => null,
                                    'migrated_at' => now(),
                                    'verified_at' => now(),
                                    'created_at' => now(),
                                    'updated_at' => now(),
                                ]
                            );
                        });
                        
                        $stats['urls_populated']++;
                        
                    } catch (\Exception $e) {
                        $stats['errors']++;
                        $this->recordFailure($connection, $table, $sourceCol, $rowId, $sha256, $e->getMessage());
                    }
                }
            }
        }

        if ($isDryRun) {
            $this->info('--- DRY RUN RESULTS ---');
        } else {
            $this->info('--- REAL EXTRACTION RESULTS ---');
        }
        
        $this->table(
            ['Metric', 'Value'],
            [
                ['Records Processed', $stats['records_processed']],
                ['Decoded Bytes', number_format($stats['decoded_bytes'])],
                ['Duplicates Detected', $stats['duplicates_detected']],
                ['Expected Physical Storage', number_format($stats['expected_storage_usage'])],
                ['Records Skipped', $stats['records_skipped']],
                ['Records Rejected', $stats['records_rejected']],
                ['Errors', $stats['errors']],
                ['Unique Objects Written', $stats['unique_objects_written']],
                ['Physical Bytes Written', number_format($stats['physical_bytes_written'])],
                ['URLs Populated', $stats['urls_populated']],
            ]
        );
    }
    
    private function recordFailure($connection, $table, $column, $id, $sha, $reason) {
        $errorId = 'ERR-' . strtoupper(Str::random(8));
        $connection->table('storage_migrations')->updateOrInsert(
            [
                'source_table' => $table,
                'source_column' => $column,
                'source_record_id' => $id,
            ],
            [
                'source_sha256' => $sha,
                'status' => 'FAILED',
                'error_id' => $errorId,
                'error_reason' => substr($reason, 0, 500),
                'updated_at' => now(),
            ]
        );
        $this->error("[$errorId] Failed to migrate {$table}.{$column} ID {$id}: $reason");
    }
    
    private function getExtensionFromMime($mime) {
        return match($mime) {
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'application/pdf' => 'pdf',
            default => 'bin'
        };
    }
}
