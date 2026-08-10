<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::latest('id')->first();
echo "User ID: {$user->id}, Name: {$user->name}, Email: {$user->email}, Roles: " . $user->roles->pluck('name')->implode(', ') . "\n";
$listing = $user->listing;
if ($listing) {
    echo "Listing ID: {$listing->id}, Title: {$listing->title}, Status: {$listing->status}, Approved: {$listing->is_approved}, Verified: {$listing->is_verified}, City: {$listing->city}, Rating: {$listing->avg_rating}\n";
    echo "Category: " . ($listing->category ? $listing->category->name : 'NONE') . "\n";
} else {
    echo "NO LISTING FOUND FOR USER\n";
}
