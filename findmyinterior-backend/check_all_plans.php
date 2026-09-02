<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$plans = \App\Models\SubscriptionPlan::all();
echo "All Plans:\n";
foreach ($plans as $plan) {
    echo "ID: " . $plan->id . " | Slug: " . $plan->slug . " | Max Gallery Images: " . $plan->max_gallery_images . "\n";
}
