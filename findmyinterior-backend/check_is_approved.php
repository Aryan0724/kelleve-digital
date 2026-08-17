<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$listing = App\Models\Listing::find(431);
echo "Listing 431 is_approved: " . (int)$listing->is_approved . "\n";
echo "Active listings count: " . App\Models\Listing::active()->count() . "\n";
