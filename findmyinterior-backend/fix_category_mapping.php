<?php
/**
 * One-time script to fix the category_id for listings where professional_type
 * is a salon/beauty/gym type but category_id is incorrectly set to Interior Designers.
 *
 * Run via: php artisan tinker --execute="require base_path('fix_category_mapping.php');"
 * Or directly: php fix_category_mapping.php (from project root)
 */

require_once __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Listing;
use App\Models\Category;
use App\Models\User;

// Category name → type keywords mapping
$fixes = [
    'Salons & Beauty'       => ['hair_salon', 'beauty_salon', 'unisex_salon', 'spa', 'makeup_artist', 'nail_studio', 'barber', 'mehndi_artist', 'salon', 'beauty'],
    'Gyms & Fitness'        => ['gym', 'fitness', 'crossfit', 'yoga_studio', 'yoga', 'zumba', 'pilates', 'martial_arts', 'personal_trainer'],
    'Restaurants & Cafes'   => ['restaurant', 'cafe', 'dhaba', 'food_truck', 'catering', 'cloud_kitchen', 'bakery', 'sweet_shop', 'juice_bar'],
    'Hospitals & Healthcare'=> ['clinic', 'hospital', 'doctor', 'dentist', 'physiotherapist', 'optician', 'pharmacy', 'nursing_home', 'diagnostic_center'],
    'Hotels & Hospitality'  => ['hotel', 'resort', 'guest_house', 'pg', 'hostel'],
    'Education & Coaching'  => ['coaching_center', 'tutor', 'school', 'college', 'music_school', 'dance_academy', 'language_institute'],
    'Automobile'            => ['car_service', 'car_dealer', 'bike_service', 'driving_school', 'auto_accessories'],
    'Home Services'         => ['plumber', 'electrician', 'carpenter', 'painter', 'ac_repair', 'pest_control', 'cleaning'],
    'Real Estate & Property'=> ['real_estate_agent', 'property_dealer', 'builder'],
];

echo "=== TrueDial Category Fix Script ===\n\n";

// Build type → category_id lookup
$typeToCategoryId = [];
foreach ($fixes as $categoryName => $types) {
    $cat = Category::where('name', $categoryName)
                   ->orWhere('name', 'like', "%{$categoryName}%")
                   ->first();
    if (!$cat) {
        echo "⚠  Category not found in DB: {$categoryName} — skipping these types.\n";
        continue;
    }
    foreach ($types as $type) {
        $typeToCategoryId[$type] = $cat->id;
    }
    echo "✓  Mapped {$categoryName} (id: {$cat->id})\n";
}

echo "\n--- Scanning listings for mismatches ---\n\n";

$interiorCat = Category::where('name', 'Interior Designers')
                        ->orWhere('name', 'like', '%Interior%')
                        ->first();

if (!$interiorCat) {
    echo "❌  Could not find Interior Designers category. Aborting.\n";
    exit(1);
}

$interiorId = $interiorCat->id;
echo "Interior Designers category id: {$interiorId}\n\n";

$updated = 0;
$skipped = 0;

// Get all users with a professional_type
User::whereNotNull('professional_type')
    ->whereIn('professional_type', array_keys($typeToCategoryId))
    ->each(function ($user) use ($typeToCategoryId, $interiorId, &$updated, &$skipped) {
        $listing = Listing::where('user_id', $user->id)->first();
        if (!$listing) {
            $skipped++;
            return;
        }

        $correctCategoryId = $typeToCategoryId[$user->professional_type] ?? null;
        if (!$correctCategoryId) {
            $skipped++;
            return;
        }

        // Only fix if currently mapped to Interior Designers OR if it's genuinely wrong
        if ($listing->category_id == $interiorId && $correctCategoryId != $interiorId) {
            $listing->update(['category_id' => $correctCategoryId]);
            echo "✅  Fixed listing #{$listing->id} '{$listing->title}' — professional_type: {$user->professional_type} → category_id: {$correctCategoryId}\n";
            $updated++;
        } else {
            $skipped++;
        }
    });

echo "\n=== Done ===\n";
echo "Updated: {$updated} listings\n";
echo "Skipped: {$skipped} listings (already correct or no listing)\n";
