<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$listings = App\Models\Listing::orderBy('id', 'desc')->take(10)->with('user', 'category')->get();
foreach ($listings as $l) {
    echo "ID: {$l->id}, Title: {$l->title}, Category: " . ($l->category ? $l->category->name : 'NULL') . ", Status: {$l->status}, Approved: {$l->is_approved}, User: " . ($l->user ? $l->user->email : 'NULL') . "\n";
}
