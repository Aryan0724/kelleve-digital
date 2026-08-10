<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = App\Models\User::orderBy('id', 'desc')->take(5)->with('roles', 'listing')->get();
foreach ($users as $u) {
    echo "ID: {$u->id}, Name: {$u->name}, Email: {$u->email}, Roles: ";
    echo $u->roles->pluck('name')->implode(', ') . "\n";
    if ($u->listing) {
        echo "  - Listing: {$u->listing->title}\n";
    }
}
