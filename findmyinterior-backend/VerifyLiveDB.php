<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Listing;
use App\Models\Requirement;
use App\Models\Bid;
use App\Models\Message;

echo "====== LIVE DATABASE VERIFICATION ======\n";
echo "Users (Homeowners, Contractors, etc): " . User::count() . "\n";
echo "Professional Listings: " . Listing::count() . "\n";
echo "Projects / Requirements: " . Requirement::count() . "\n";
echo "Active Bids: " . Bid::count() . "\n";
echo "Messages: " . Message::count() . "\n";
echo "========================================\n";
