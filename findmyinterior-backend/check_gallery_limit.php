<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$plan = \App\Models\SubscriptionPlan::where('slug', 'starter')->first();
echo "Starter Plan:\n";
echo "ID: " . ($plan ? $plan->id : 'null') . "\n";
echo "max_gallery_images: " . ($plan ? ($plan->max_gallery_images ?? 'null') : 'null') . "\n";

// What about the user's plan?
$user = \App\Models\User::find(5550); // The user ID from the previous screenshot (5550)
echo "\nUser 5550 Active Plan:\n";
$service = app(\App\Services\EntitlementService::class);
$activePlan = $service->getActivePlan($user);
echo "Plan ID: " . ($activePlan ? $activePlan->id : 'null') . "\n";
echo "Plan Slug: " . ($activePlan ? $activePlan->slug : 'null') . "\n";
echo "Plan max_gallery_images: " . ($activePlan ? ($activePlan->max_gallery_images ?? 'null') : 'null') . "\n";
echo "getLimit: " . $service->getLimit($user, 'max_gallery_images') . "\n";
