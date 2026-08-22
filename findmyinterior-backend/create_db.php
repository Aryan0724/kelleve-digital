<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$conn = DB::connection('mysql'); // connect to default
$conn->statement('DROP DATABASE IF EXISTS findmyinterior_legacy_migrated');
$conn->statement('CREATE DATABASE findmyinterior_legacy_migrated');
echo "Database created successfully.\n";
