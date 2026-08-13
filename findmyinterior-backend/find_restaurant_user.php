<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

$user = clone User::whereHas('categories', function($q) {
    $q->where('slug', 'like', '%restaurant%');
})->first();

if ($user) {
    echo "Restaurant User found: " . $user->email . "\n";
} else {
    echo "No restaurant user found.\n";
    // Let's create one
    $user = User::firstOrCreate(
        ['email' => 'restaurant@example.com'],
        [
            'name' => 'Restaurant Owner',
            'password' => bcrypt('password123'),
            'phone' => '9999988888',
        ]
    );
    
    $category = \App\Models\Category::firstOrCreate(['slug' => 'restaurant'], ['name' => 'Restaurant', 'type' => 'business']);
    $user->categories()->syncWithoutDetaching([$category->id]);
    echo "Created restaurant user: " . $user->email . " / password123\n";
}
