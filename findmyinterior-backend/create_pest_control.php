<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$category = App\Models\Category::firstOrCreate(
    ['slug' => 'pest-control'],
    ['name' => 'Pest Control', 'icon' => 'bug', 'description' => 'Pest control services and exterminators.']
);

$user = App\Models\User::firstOrCreate(
    ['email' => 'pestcontrol@findmyinterior.com'],
    [
        'name' => 'Expert Pest Control',
        'password' => bcrypt('password'),
        'phone' => '9999988888',
        'city' => 'Patna'
    ]
);

$role = App\Models\Role::where('name', 'Pest Control')->first();
if ($role && !$user->roles->contains($role->id)) {
    $user->roles()->attach($role->id);
}

$listing = App\Models\Listing::updateOrCreate(
    ['user_id' => $user->id],
    [
        'title' => 'Expert Pest Control Services',
        'slug' => 'expert-pest-control',
        'category_id' => $category->id,
        'description' => 'We provide the best pest control in Patna.',
        'status' => 'active',
        'is_approved' => true,
        'city' => 'Patna'
    ]
);

echo "Listing created: {$listing->title}\n";
