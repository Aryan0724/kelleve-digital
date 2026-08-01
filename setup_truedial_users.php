<?php
require '/app/vendor/autoload.php';
$app = require_once '/app/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Create admin@truedial.com
$user = App\Models\User::firstOrCreate(
    ['email' => 'admin@truedial.com'],
    ['name' => 'TrueDial Admin', 'password' => bcrypt('Truedial@1111')]
);
$role = App\Models\Role::where('slug', 'admin')->first();
if ($role && !$user->roles()->where('role_id', $role->id)->exists()) {
    $user->roles()->attach($role->id);
}
echo "Admin: " . $user->email . " (id=" . $user->id . ")\n";

// Create vendor@truedial.com
$vendor = App\Models\User::firstOrCreate(
    ['email' => 'vendor@truedial.com'],
    ['name' => 'TrueDial Vendor', 'password' => bcrypt('Truedial@1111')]
);
$vrole = App\Models\Role::where('slug', 'interior_designer')->first();
if ($vrole && !$vendor->roles()->where('role_id', $vrole->id)->exists()) {
    $vendor->roles()->attach($vrole->id);
}
echo "Vendor: " . $vendor->email . " (id=" . $vendor->id . ")\n";

// Reset admin password for Aryantiwari@findmyinterior.com
$admin = App\Models\User::where('email', 'Aryantiwari@findmyinterior.com')->first();
if ($admin) {
    $admin->password = bcrypt('Truedial@1111');
    $admin->save();
    echo "Reset admin: " . $admin->email . "\n";
}
echo "DONE\n";
