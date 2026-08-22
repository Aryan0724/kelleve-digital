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

$t = ['bids', 'requirements', 'wallet_transactions', 'wallets', 'payments'];
foreach($t as $table) {
    echo "\n-- $table --\n";
    $cols = DB::connection('legacy_restore')->getSchemaBuilder()->getColumnListing($table);
    print_r($cols);
}
