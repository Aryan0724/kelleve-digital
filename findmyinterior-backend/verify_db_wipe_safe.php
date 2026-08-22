<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$env = config('app.env');
$fmiDb = config('database.connections.fmi_mysql.database');
$tdDb = config('database.connections.truedial_mysql.database');
$host = config('database.connections.fmi_mysql.host');

echo "================================================\n";
echo "DATABASE DESTRUCTIVE OPERATION SAFETY CHECK\n";
echo "================================================\n";
echo "Environment: " . strtoupper($env) . "\n";
echo "FMI DB: " . $fmiDb . "\n";
echo "TrueDial DB: " . $tdDb . "\n";
echo "Target: LOCAL ONLY\n";

$isProduction = ($env === 'production' || strpos($fmiDb, 'production') !== false || $host !== '127.0.0.1');

if ($isProduction) {
    echo "Production connection detected: YES\n";
    echo "================================================\n";
    echo "ABORT: Destructive operations on production are strictly forbidden.\n";
    exit(1);
} else {
    echo "Production connection detected: NO\n";
    echo "Backup required: NO - local disposable database\n";
    echo "================================================\n";
    echo "SAFE TO PROCEED\n";
    echo "================================================\n";
    exit(0);
}
