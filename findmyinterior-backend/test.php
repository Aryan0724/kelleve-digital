<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$job = new \App\Models\WorkerJob();
echo "WorkerJob::class is: " . \App\Models\WorkerJob::class . "\n";
echo "getMorphClass() is: " . $job->getMorphClass() . "\n";
echo "They are strictly equal? " . ($job->getMorphClass() === \App\Models\WorkerJob::class ? 'Yes' : 'No') . "\n";
