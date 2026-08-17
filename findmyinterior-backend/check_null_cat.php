<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$listings = App\Models\Listing::whereNull('category_id')->get();
echo "Listings with NULL category: " . $listings->count() . "\n";
foreach ($listings as $listing) {
    echo "ID: {$listing->id}, Title: {$listing->title}, Status: {$listing->status}\n";
}

$user = App\Models\User::find(1);
if ($user && $user->listing) {
    echo "Admin listing: " . $user->listing->title . "\n";
}
