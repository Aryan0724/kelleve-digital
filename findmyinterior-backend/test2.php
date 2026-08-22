<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

Illuminate\Support\Facades\Config::set('database.connections.legacy_migrated', [
    'driver' => 'mysql',
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', '3306'),
    'database' => 'findmyinterior_legacy_migrated',
    'username' => env('DB_USERNAME', 'root'),
    'password' => env('DB_PASSWORD', ''),
]);

$dest = Illuminate\Support\Facades\DB::connection('legacy_migrated');
echo 'Count before truncate: ' . $dest->table('users')->count() . "\n";
$dest->statement('SET FOREIGN_KEY_CHECKS=0;');
$dest->table('users')->truncate();
$dest->statement('SET FOREIGN_KEY_CHECKS=1;');
echo 'Count after truncate: ' . $dest->table('users')->count() . "\n";
