<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$users = App\Models\User::whereHas('roles', function($q) {
    $q->where('name', 'like', '%pest%');
})->with('listing')->get();

echo "Users with pest control role:\n";
foreach ($users as $u) {
    echo "User ID: {$u->id}, Email: {$u->email}\n";
    if ($u->listing) {
        echo " - Listing ID: {$u->listing->id}, Title: {$u->listing->title}, City: {$u->listing->city}\n";
    } else {
        echo " - NO LISTING\n";
    }
}
