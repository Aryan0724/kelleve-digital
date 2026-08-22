<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Config;

Config::set('database.connections.legacy_migrated', [
    'driver' => 'mysql',
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', '3306'),
    'database' => 'findmyinterior_legacy_migrated',
    'username' => env('DB_USERNAME', 'root'),
    'password' => env('DB_PASSWORD', ''),
]);

$tables = ['projects', 'worker_jobs', 'rfqs', 'bids', 'job_applications', 'rfq_quotations'];

$schema = [];
foreach ($tables as $t) {
    $cols = Schema::connection('legacy_migrated')->getColumnListing($t);
    $schema[$t] = $cols;
}

file_put_contents('schema_check.json', json_encode($schema, JSON_PRETTY_PRINT));
echo "Schema dumped.\n";
