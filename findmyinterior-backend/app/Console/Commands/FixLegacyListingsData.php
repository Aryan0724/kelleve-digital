<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Listing;
use App\Models\User;
use App\Models\Category;

class FixLegacyListingsData extends Command
{
    protected $signature = 'fmi:fix-legacy-listings-data';
    protected $description = 'Fix legacy listings data by pulling from worker, builder, supplier.';

    public function handle()
    {
        $this->info("Fixing legacy listings data from JSON file...");

        $jsonFile = base_path('legacy_professional_data.json');
        if (!file_exists($jsonFile)) {
            $this->error("JSON file not found at " . $jsonFile);
            return 1;
        }

        $legacyData = json_decode(file_get_contents($jsonFile), true);
        
        $workersById = collect($legacyData['workers'])->keyBy('user_id');
        $buildersById = collect($legacyData['builders'])->keyBy('user_id');
        $suppliersById = collect($legacyData['suppliers'])->keyBy('user_id');
        $listingsById = collect($legacyData['listings'])->keyBy('user_id');
        $categoriesById = collect($legacyData['categories'])->keyBy('id');

        $listings = Listing::all();
        $count = 0;
        
        $defaultCategory = Category::first();
        $designerCategory = Category::where('name', 'like', '%Designer%')->first() ?? $defaultCategory;
        $builderCategory = Category::where('name', 'like', '%Builder%')->first() ?? $defaultCategory;
        $supplierCategory = Category::where('name', 'like', '%Supplier%')->first() ?? $defaultCategory;

        foreach ($listings as $listing) {
            $updated = false;
            
            // Try to find the old listing
            $oldListing = $listingsById->get($listing->user_id);
            if ($oldListing) {
                $listing->title = $oldListing['title'] ?: $listing->title;
                $listing->description = $oldListing['description'] ?: $listing->description;
                $listing->phone = $oldListing['phone'] ?: $listing->phone;
                $listing->services = json_decode($oldListing['services'] ?? '[]', true) ?? [];
                if ($oldListing['category_id']) {
                    $legacyCat = $categoriesById->get($oldListing['category_id']);
                    if ($legacyCat) {
                        $modernCat = Category::where('name', 'like', '%' . explode(' ', $legacyCat['name'])[0] . '%')->first();
                        if ($modernCat) $listing->category_id = $modernCat->id;
                    }
                }
                $updated = true;
            }

            // Fallbacks: worker, supplier, builder
            if (!$updated) {
                $oldWorker = $workersById->get($listing->user_id);
                if ($oldWorker) {
                    $listing->years_experience = (int)$oldWorker['experience_years'];
                    $listing->services = json_decode($oldWorker['services'] ?? '[]', true) ?? ($oldWorker['skill'] ? [$oldWorker['skill']] : []);
                    $listing->description = $oldWorker['bio'] ?? $listing->description;
                    $listing->title = $oldWorker['name'] ?? $listing->title;
                    $listing->phone = $oldWorker['phone'] ?? $listing->phone;
                    $listing->city = $oldWorker['city'] ?? $listing->city;
                    
                    if ($oldWorker['skill'] && stripos($oldWorker['skill'], 'designer') !== false) {
                        $listing->category_id = $designerCategory->id ?? $listing->category_id;
                    }
                    $updated = true;
                } else {
                    $oldSupplier = $suppliersById->get($listing->user_id);
                    if ($oldSupplier) {
                        $listing->title = $oldSupplier['company_name'] ?? $listing->title;
                        $listing->description = $oldSupplier['bio'] ?? $listing->description;
                        $listing->phone = $oldSupplier['phone'] ?? $listing->phone;
                        $listing->services = json_decode($oldSupplier['services'] ?? '[]', true) ?? [];
                        $listing->category_id = $supplierCategory->id ?? $listing->category_id;
                        $updated = true;
                    } else {
                        $oldBuilder = $buildersById->get($listing->user_id);
                        if ($oldBuilder) {
                            $listing->title = $oldBuilder['company_name'] ?? $listing->title;
                            $listing->description = $oldBuilder['bio'] ?? $listing->description;
                            $listing->phone = $oldBuilder['phone'] ?? $listing->phone;
                            $listing->services = json_decode($oldBuilder['services'] ?? '[]', true) ?? [];
                            $listing->category_id = $builderCategory->id ?? $listing->category_id;
                            $updated = true;
                        }
                    }
                }
            }

            if ($updated) {
                $listing->save();
                $count++;
            }
        }

        $this->info("Successfully updated {$count} listings from JSON file.");
        return 0;
    }
}
