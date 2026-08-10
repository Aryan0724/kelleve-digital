<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$listings = App\Models\Listing::whereHas('category', function($q) {
    $q->where('name', 'like', '%Pest%');
})->orWhere('title', 'like', '%Pest%')->with('user', 'category')->get();

echo "Found " . $listings->count() . " listings\n";
foreach ($listings as $listing) {
    echo "Listing ID: {$listing->id}, Title: {$listing->title}, Status: {$listing->status}, Approved: {$listing->is_approved}, City: {$listing->city}\n";
    if ($listing->category) {
        echo "  Category: {$listing->category->name} (slug: {$listing->category->slug})\n";
    }
    if ($listing->user) {
        $roles = $listing->user->roles->pluck('name')->toArray();
        echo "  User ID: {$listing->user->id}, Name: {$listing->user->name}, Roles: " . implode(', ', $roles) . "\n";
    }
}
