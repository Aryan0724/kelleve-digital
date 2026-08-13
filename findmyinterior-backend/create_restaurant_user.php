<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Listing;
use App\Models\Category;

$user = User::firstOrCreate(
    ['email' => 'restaurant_owner@example.com'],
    [
        'name' => 'John Restaurant',
        'password' => bcrypt('password123'),
        'phone' => '9876543210',
    ]
);

$listing = Listing::firstOrCreate(
    ['user_id' => $user->id],
    [
        'title' => 'John\'s Cafe',
        'description' => 'A nice cafe',
        'phone' => '9876543210',
        'address' => 'Mumbai',
        'status' => 'active'
    ]
);

$category = Category::firstOrCreate(['slug' => 'restaurant'], ['name' => 'Restaurant', 'type' => 'business']);

// sync category to listing
$listing->categories()->syncWithoutDetaching([$category->id]);

echo "Created test restaurant user! Email: restaurant_owner@example.com, Password: password123\n";
