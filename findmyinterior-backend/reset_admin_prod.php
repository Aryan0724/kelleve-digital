<?php
/**
 * One-time production admin password & user setup
 * Run via: php artisan tinker < reset_admin_prod.php
 * OR add temporarily to a route and hit it once.
 * 
 * This file connects directly to production DB and resets admin password.
 */
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Find admin
$admin = App\Models\User::whereHas('roles', function($q) {
    $q->where('slug', 'admin');
})->first();

if (!$admin) {
    echo "ERROR: No admin user found!\n";
    // List all users
    $users = App\Models\User::select(['id','email','name'])->limit(10)->get();
    foreach ($users as $u) {
        echo "User: {$u->id} {$u->email}\n";
    }
    exit(1);
}

echo "Found admin: {$admin->email}\n";
$newPassword = 'Admin@123!';
$admin->password = bcrypt($newPassword);
$admin->save();
echo "Password reset to: $newPassword\n";
echo "Admin ID: {$admin->id}\n";
