<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

App\Models\SubscriptionPlan::whereNotIn('slug', ['basic', 'professional', 'premium'])->delete();
echo "Deleted old plans\n";
