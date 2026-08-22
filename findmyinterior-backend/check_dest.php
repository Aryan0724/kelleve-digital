<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;

$base = ['driver'=>'mysql','host'=>env('DB_HOST','127.0.0.1'),'port'=>env('DB_PORT','3306'),'username'=>env('DB_USERNAME','root'),'password'=>env('DB_PASSWORD',''),'charset'=>'utf8mb4','collation'=>'utf8mb4_unicode_ci'];
Config::set('database.connections.legacy_migrated', array_merge($base, ['database'=>'findmyinterior_legacy_migrated']));
DB::purge('legacy_migrated');

$tables = DB::connection('legacy_migrated')->select('SHOW TABLES');
echo 'Tables in legacy_migrated: ' . count($tables) . PHP_EOL;
// Check for quarantine tables
$names = array_map(function($t) { return array_values((array)$t)[0]; }, $tables);
$quarantineTables = array_filter($names, fn($n) => str_starts_with($n, 'quarantine'));
echo "Quarantine tables found: " . implode(', ', $quarantineTables) . PHP_EOL;

// Check if users table has data (i.e., seeder ran)
$userCount = DB::connection('legacy_migrated')->table('users')->count();
echo "Users in restoration DB: $userCount" . PHP_EOL;
