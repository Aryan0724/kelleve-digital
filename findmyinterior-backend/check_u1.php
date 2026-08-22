<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$conn = Illuminate\Support\Facades\DB::connection('legacy_restore');
$user1 = $conn->table('users')->where('id', 1)->first();
echo "User 1 is_mock: " . $user1->is_mock . "\n";
