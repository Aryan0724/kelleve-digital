<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = App\Models\User::whereHas('roles', function($q) {
    $q->where('name', 'pest_control');
})->with('listing')->get();

foreach ($users as $user) {
    echo "User ID: {$user->id}, Name: {$user->name}, City: {$user->city}\n";
    if ($user->listing) {
        echo "  Listing ID: {$user->listing->id}, Title: {$user->listing->title}, Status: {$user->listing->status}, Approved: {$user->listing->is_approved}, City: {$user->listing->city}\n";
    } else {
        echo "  No listing found.\n";
    }
}
