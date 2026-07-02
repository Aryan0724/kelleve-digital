<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Find admin users by role
$admins = App\Models\User::whereHas('roles', function($q) {
    $q->where('slug', 'admin');
})->get(['id','email','name']);

echo "ADMIN USERS:\n";
foreach ($admins as $a) {
    echo "ID:{$a->id} Email:{$a->email} Name:{$a->name}\n";
}

if ($admins->isEmpty()) {
    echo "No admin users found. Creating one...\n";
    // Create admin
    $adminRole = App\Models\Role::where('slug', 'admin')->first();
    if (!$adminRole) {
        $adminRole = App\Models\Role::create(['name' => 'Administrator', 'slug' => 'admin']);
        echo "Created admin role: {$adminRole->id}\n";
    }
    
    $adminUser = App\Models\User::create([
        'name'     => 'Admin User',
        'email'    => 'admin@findmyinterior.com',
        'password' => bcrypt('Admin@123!'),
        'is_active' => true,
    ]);
    $adminUser->roles()->attach($adminRole->id);
    echo "Created admin user: {$adminUser->email} with password: Admin@123!\n";
} else {
    // Reset admin password to known value
    $admin = $admins->first();
    $admin->update(['password' => bcrypt('Admin@123!')]);
    echo "Reset admin password to: Admin@123!\n";
}

// Check roles table
$roles = App\Models\Role::all(['id', 'slug', 'name']);
echo "\nALL ROLES:\n";
foreach ($roles as $r) {
    echo "ID:{$r->id} Slug:{$r->slug} Name:{$r->name}\n";
}

// Get user count
$userCount = App\Models\User::count();
echo "\nTotal users: $userCount\n";
