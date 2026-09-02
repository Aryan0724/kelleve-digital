<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

\App\Models\SubscriptionPlan::query()->update(['monthly_wallet_credit' => 0]);
echo "Updated all subscription plans to 0 wallet credit.\n";
