<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$jobs = \Illuminate\Support\Facades\DB::table('jobs')->count();
echo "Total jobs pending in queue: " . $jobs . "\n";
$failed = \Illuminate\Support\Facades\DB::table('failed_jobs')->count();
echo "Total failed jobs: " . $failed . "\n";
