<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$roles = App\Models\Role::where('name', 'like', '%pest%')->get();
foreach ($roles as $role) {
    echo "Role: {$role->name}\n";
}

$categories = App\Models\Category::where('name', 'like', '%pest%')->get();
foreach ($categories as $cat) {
    echo "Category: {$cat->name} (slug: {$cat->slug})\n";
}

$listings = App\Models\Listing::where('title', 'like', '%pest%')->orWhereHas('category', function($q) {
    $q->where('name', 'like', '%pest%');
})->with('user')->get();

foreach ($listings as $listing) {
    echo "Listing ID: {$listing->id}, Title: {$listing->title}, Status: {$listing->status}, Approved: {$listing->is_approved}, City: {$listing->city}\n";
    if ($listing->user) {
        $roles = $listing->user->roles->pluck('name')->toArray();
        echo "  User ID: {$listing->user->id}, Name: {$listing->user->name}, Roles: " . implode(', ', $roles) . "\n";
    }
}
