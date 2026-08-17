<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

App\Models\Listing::where('id', '>', 0)->update(['status' => 'active', 'is_verified' => 1]);
echo "Updated listings.";
