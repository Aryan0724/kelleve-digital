<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = App\Models\User::take(5)->with('roles', 'listing')->get();
foreach ($users as $user) {
    $roles = $user->roles->pluck('name')->toArray();
    echo "ID: {$user->id}, Name: {$user->name}, Email: {$user->email}, Roles: " . implode(', ', $roles) . "\n";
}
