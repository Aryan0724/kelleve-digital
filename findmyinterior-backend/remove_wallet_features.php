<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$plans = \App\Models\SubscriptionPlan::all();
foreach ($plans as $plan) {
    if (is_array($plan->features)) {
        $newFeatures = array_filter($plan->features, function($feature) {
            return !stripos($feature, 'wallet');
        });
        $plan->features = array_values($newFeatures);
        $plan->save();
    }
}
echo "Removed wallet-related features from JSON array.\n";
