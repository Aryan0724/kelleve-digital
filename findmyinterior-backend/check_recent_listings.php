<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$listings = App\Models\Listing::orderBy('id', 'desc')->take(10)->get();
foreach ($listings as $l) {
    echo "Listing ID: {$l->id}, User ID: {$l->user_id}, Title: {$l->title}, Verified: {$l->is_verified}\n";
}
