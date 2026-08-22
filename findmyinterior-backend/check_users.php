<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$conn = Illuminate\Support\Facades\DB::connection('mysql');
echo "Count: " . $conn->table('users')->count();
