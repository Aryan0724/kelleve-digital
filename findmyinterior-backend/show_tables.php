<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
$conn = DB::connection('mysql');
$conn->statement('USE findmyinterior_legacy_migrated');
$tables = $conn->select('SHOW TABLES');
echo "Tables in findmyinterior_legacy_migrated:\n";
foreach ($tables as $t) {
    echo current((array)$t) . "\n";
}
