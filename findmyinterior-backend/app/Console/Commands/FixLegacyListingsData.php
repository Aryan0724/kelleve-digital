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
        $this->info("Fixing legacy listings data from legacy database...");

        $listings = Listing::all();
        $count = 0;
        
        $defaultCategory = Category::first();
        $designerCategory = Category::where('name', 'like', '%Designer%')->first() ?? $defaultCategory;
        $builderCategory = Category::where('name', 'like', '%Builder%')->first() ?? $defaultCategory;
        $supplierCategory = Category::where('name', 'like', '%Supplier%')->first() ?? $defaultCategory;

        foreach ($listings as $listing) {
            $updated = false;
            
            // Try to find the old listing
            $oldListing = \Illuminate\Support\Facades\DB::connection('legacy_restore')->table('listings')->where('user_id', $listing->user_id)->first();
            if ($oldListing) {
                $listing->title = $oldListing->title ?: $listing->title;
                $listing->description = $oldListing->description ?: $listing->description;
                $listing->phone = $oldListing->phone ?: $listing->phone;
                $listing->services = json_decode($oldListing->services, true) ?? [];
                $listing->achievements = json_decode($oldListing->achievements, true) ?? [];
                $listing->languages = json_decode($oldListing->languages, true) ?? [];
                if ($oldListing->category_id) {
                    // Try to match legacy category ID to modern category? We don't have mapping. 
                    // Let's use the title/services to guess, or if legacy category name was Designer.
                    $legacyCat = \Illuminate\Support\Facades\DB::connection('legacy_restore')->table('categories')->where('id', $oldListing->category_id)->first();
                    if ($legacyCat) {
                        $modernCat = Category::where('name', 'like', '%' . explode(' ', $legacyCat->name)[0] . '%')->first();
                        if ($modernCat) $listing->category_id = $modernCat->id;
                    }
                }
                $updated = true;
            }

            // Fallbacks: worker, supplier, builder
            if (!$updated) {
                $oldWorker = \Illuminate\Support\Facades\DB::connection('legacy_restore')->table('workers')->where('user_id', $listing->user_id)->first();
                if ($oldWorker) {
                    $listing->years_experience = (int)$oldWorker->experience_years;
                    $listing->budget_tier = $oldWorker->daily_rate ? '₹' . $oldWorker->daily_rate . '/day' : null;
                    $listing->services = json_decode($oldWorker->services, true) ?? ($oldWorker->skill ? [$oldWorker->skill] : []);
                    $listing->description = $oldWorker->bio ?? $listing->description;
                    $listing->achievements = json_decode($oldWorker->achievements, true) ?? [];
                    $listing->languages = json_decode($oldWorker->languages, true) ?? [];
                    $listing->title = $oldWorker->name ?? $listing->title;
                    $listing->phone = $oldWorker->phone ?? $listing->phone;
                    $listing->city = $oldWorker->city ?? $listing->city;
                    
                    if ($oldWorker->skill && stripos($oldWorker->skill, 'designer') !== false) {
                        $listing->category_id = $designerCategory->id ?? $listing->category_id;
                    }
                    $updated = true;
                } else {
                    $oldSupplier = \Illuminate\Support\Facades\DB::connection('legacy_restore')->table('suppliers')->where('user_id', $listing->user_id)->first();
                    if ($oldSupplier) {
                        $listing->title = $oldSupplier->company_name ?? $listing->title;
                        $listing->description = $oldSupplier->bio ?? $listing->description;
                        $listing->phone = $oldSupplier->phone ?? $listing->phone;
                        $listing->services = json_decode($oldSupplier->services, true) ?? [];
                        $listing->achievements = json_decode($oldSupplier->achievements, true) ?? [];
                        $listing->languages = json_decode($oldSupplier->languages, true) ?? [];
                        $listing->category_id = $supplierCategory->id ?? $listing->category_id;
                        $updated = true;
                    } else {
                        $oldBuilder = \Illuminate\Support\Facades\DB::connection('legacy_restore')->table('builders')->where('user_id', $listing->user_id)->first();
                        if ($oldBuilder) {
                            $listing->title = $oldBuilder->company_name ?? $listing->title;
                            $listing->description = $oldBuilder->bio ?? $listing->description;
                            $listing->phone = $oldBuilder->phone ?? $listing->phone;
                            $listing->services = json_decode($oldBuilder->services, true) ?? [];
                            $listing->achievements = json_decode($oldBuilder->achievements, true) ?? [];
                            $listing->languages = json_decode($oldBuilder->languages, true) ?? [];
                            $listing->category_id = $builderCategory->id ?? $listing->category_id;
                            $updated = true;
                        }
                    }
                }
            }

            if ($updated) {
                // Also if the title is just a name, let's make sure we preserve the company name if we have it in user record?
                // The DB logic has company_name.
                $listing->save();
                $count++;
            }
        }

        $this->info("Successfully updated {$count} listings from legacy_restore database.");
        return 0;
    }
}
