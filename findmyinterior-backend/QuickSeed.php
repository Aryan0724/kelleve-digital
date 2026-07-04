<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Category;
use App\Models\Listing;
use App\Models\City;
use App\Models\District;
use Illuminate\Support\Facades\Hash;

echo "Seeding basic required data for demo...\n";

try {
    $district = District::first();
    $city = City::first();
    $category = Category::where('slug', 'interior-designers')->first() ?? Category::first();
    $category2 = Category::where('slug', 'contractors')->first() ?? Category::first();

    if (!$district || !$city || !$category || !$category2) {
        echo "Missing base data. District: ".($district?'yes':'no')." City: ".($city?'yes':'no')." Categories: ".($category?'yes':'no')."\n";
        exit;
    }

    $contractor = User::firstOrCreate(
        ['email' => 'contractor_solid@example.com'],
        ['name' => 'Demo Contractor', 'password' => Hash::make('password123'), 'phone' => '9999999992', 'is_active' => true, 'is_mock' => true]
    );

    $designer = User::firstOrCreate(
        ['email' => 'designer_solid@example.com'],
        ['name' => 'Demo Designer', 'password' => Hash::make('password123'), 'phone' => '9999999993', 'is_active' => true, 'is_mock' => true]
    );

    Listing::firstOrCreate(
        ['email' => 'contractor_solid@example.com'],
        [
            'user_id' => $contractor->id,
            'category_id' => $category2->id,
            'title' => 'Solid Demo Contractor',
            'slug' => 'demo-contractor-solid',
            'description' => 'We are demo contractors.',
            'city' => $city->name,
            'district' => $district->name,
            'state' => 'Bihar',
            'phone' => '9999999992',
            'status' => 'active',
            'is_verified' => true,
            'years_experience' => 10,
            'budget_tier' => '₹2 Lakhs - ₹10 Lakhs'
        ]
    );

    Listing::firstOrCreate(
        ['email' => 'designer_solid@example.com'],
        [
            'user_id' => $designer->id,
            'category_id' => $category->id,
            'title' => 'Solid Demo Interior Design',
            'slug' => 'demo-designer-solid',
            'description' => 'We are demo designers.',
            'city' => $city->name,
            'district' => $district->name,
            'state' => 'Bihar',
            'phone' => '9999999993',
            'status' => 'active',
            'is_verified' => true,
            'years_experience' => 5,
            'budget_tier' => '₹50,000 - ₹2 Lakhs'
        ]
    );

    echo "Demo data successfully seeded to Render DB!\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
