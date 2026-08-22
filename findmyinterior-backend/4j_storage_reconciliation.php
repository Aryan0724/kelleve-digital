<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

echo "--- 4J.3 Storage Reconciliation ---\n";

$legacyPdo = new PDO('mysql:host=127.0.0.1;dbname=findmyinterior_legacy_restore;charset=utf8mb4', 'root', '', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
]);

$objects = $legacyPdo->query("SELECT DISTINCT storage_path, destination_sha256 FROM storage_migrations WHERE status = 'VERIFIED'")->fetchAll();
echo "Found " . count($objects) . " deduplicated objects in storage_migrations.\n";

$missing = 0;
$hashMismatch = 0;
$preserved = 0;

$checkedPaths = [];

foreach ($objects as $obj) {
    $path = $obj['storage_path'];
    $expectedHash = $obj['destination_sha256'];
    $checkedPaths[$path] = true;

    // Check if it exists on local disk
    if (!Storage::disk('local')->exists($path)) {
        echo "MISSING: $path\n";
        $missing++;
        continue;
    }

    // Check hash
    $content = Storage::disk('local')->get($path);
    $actualHash = hash('sha256', $content);

    if ($actualHash !== $expectedHash) {
        echo "HASH MISMATCH: $path\n";
        echo "  Expected: $expectedHash\n";
        echo "  Actual  : $actualHash\n";
        $hashMismatch++;
    } else {
        $preserved++;
    }
}

echo "--- Summary ---\n";
echo "Total Stage 3 Objects : " . count($objects) . "\n";
echo "Preserved (Hash Match): $preserved\n";
echo "Missing               : $missing\n";
echo "Hash Mismatches       : $hashMismatch\n";

if ($missing === 0 && $hashMismatch === 0) {
    echo "\n✅ PASS: All Stage 3 objects exist in production storage and hashes match perfectly.\n";
} else {
    echo "\n❌ FAIL: Storage reconciliation failed. Missing or corrupted objects found.\n";
}
