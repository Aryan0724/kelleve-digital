<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = App\Models\User::where('name', 'like', '%pest%')
    ->orWhere('email', 'like', '%pest%')
    ->orWhere('name', 'like', '%control%')
    ->orWhere('email', 'like', '%control%')
    ->with('roles', 'listing')
    ->get();

echo "Found " . $users->count() . " users\n";
foreach ($users as $user) {
    $roles = $user->roles->pluck('name')->toArray();
    echo "ID: {$user->id}, Name: {$user->name}, Email: {$user->email}, Roles: " . implode(', ', $roles) . "\n";
    if ($user->listing) {
        echo "  Listing: {$user->listing->title} (Cat ID: {$user->listing->category_id})\n";
    }
}
