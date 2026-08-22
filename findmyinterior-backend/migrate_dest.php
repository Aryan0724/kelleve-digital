<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

$migratedConfig = [
    'driver' => 'mysql',
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', '3306'),
    'database' => 'findmyinterior_legacy_migrated',
    'username' => env('DB_USERNAME', 'root'),
    'password' => env('DB_PASSWORD', ''),
];

Config::set('database.connections.legacy_migrated', $migratedConfig);
Config::set('database.connections.fmi_mysql', $migratedConfig);
Config::set('database.connections.truedial_mysql', $migratedConfig);
Config::set('database.default', 'legacy_migrated');

DB::purge('fmi_mysql');
DB::purge('truedial_mysql');
DB::purge('legacy_migrated');
DB::purge('mysql');

echo "Running Auth Migrations...\n";
Artisan::call('migrate:fresh', ['--database' => 'legacy_migrated', '--path' => 'database/migrations/auth', '--force' => true]);
echo Artisan::output();

echo "Running FMI Migrations...\n";
Artisan::call('migrate', ['--database' => 'legacy_migrated', '--path' => 'database/migrations/fmi', '--force' => true]);
echo Artisan::output();

echo "Running TrueDial Migrations...\n";
Artisan::call('migrate', ['--database' => 'legacy_migrated', '--path' => 'database/migrations/truedial', '--force' => true]);
echo Artisan::output();
