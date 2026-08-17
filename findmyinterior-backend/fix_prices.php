<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

App\Models\SubscriptionPlan::where('name', 'Premium')->update(['price_monthly' => 1999]);
App\Models\SubscriptionPlan::where('name', 'Elite')->update(['price_monthly' => 2999]);
echo "Prices updated.";
