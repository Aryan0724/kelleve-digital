<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = App\Models\User::with('roles')->get();
echo "Total Users: " . $users->count() . "\n";
foreach ($users as $user) {
    $roles = $user->roles->pluck('name')->toArray();
    if (in_array('Pest Control', $roles) || in_array('pest_control', $roles)) {
        echo "FOUND PEST CONTROL USER: ID: {$user->id}, Name: {$user->name}, Roles: " . implode(', ', $roles) . "\n";
    }
}
