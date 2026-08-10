<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = App\Models\User::where('city', 'like', '%Patna%')->with('roles')->get();
echo "Users in Patna:\n";
foreach ($users as $user) {
    $roles = $user->roles->pluck('name')->toArray();
    echo "ID: {$user->id}, Name: {$user->name}, Roles: " . implode(', ', $roles) . "\n";
}

$listings = App\Models\Listing::where('city', 'like', '%Patna%')->with('user', 'category')->get();
echo "Listings in Patna:\n";
foreach ($listings as $listing) {
    echo "Listing ID: {$listing->id}, Title: {$listing->title}, Status: {$listing->status}, Approved: {$listing->is_approved}\n";
    if ($listing->category) {
        echo "  Category: {$listing->category->name}\n";
    }
}
