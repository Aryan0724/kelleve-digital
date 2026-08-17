<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = App\Models\User::where('name', 'like', '%pest%')
    ->orWhere('email', 'like', '%pest%')
    ->with('listing')
    ->get();

echo "Users with pest in name/email:\n";
foreach ($users as $u) {
    echo "User ID: {$u->id}, Name: {$u->name}, Email: {$u->email}, Role: {$u->role}\n";
}
