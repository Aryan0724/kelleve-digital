<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
$conn = DB::connection('legacy_restore');

$p5 = $conn->table('projects')->where('id', 5)->first();
var_dump($p5->user_id);
