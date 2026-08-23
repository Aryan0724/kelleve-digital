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
        $this->info("Fixing legacy listings data...");

        $listings = Listing::all();
        $count = 0;
        
        $defaultCategory = Category::first();
        $designerCategory = Category::where('name', 'like', '%Designer%')->first() ?? $defaultCategory;
        $builderCategory = Category::where('name', 'like', '%Builder%')->first() ?? $defaultCategory;
        $supplierCategory = Category::where('name', 'like', '%Supplier%')->first() ?? $defaultCategory;

        foreach ($listings as $listing) {
            $user = User::with(['worker', 'supplier', 'builder'])->find($listing->user_id);
            if (!$user) continue;

            $updated = false;

            // Worker data
            if ($user->worker) {
                $listing->years_experience = (int)$user->worker->experience_years;
                $listing->budget_tier = $user->worker->daily_rate ? '₹' . $user->worker->daily_rate . '/day' : null;
                $listing->services = $user->worker->services ?? ($user->worker->skill ? [$user->worker->skill] : []);
                $listing->description = $user->worker->bio ?? $listing->description;
                $listing->achievements = $user->worker->achievements ?? [];
                $listing->languages = $user->worker->languages ?? [];
                $listing->title = $user->worker->name ?? $user->name;
                $listing->phone = $user->worker->phone ?? $user->phone;
                $listing->city = $user->worker->city ?? $listing->city;
                
                // Better category matching based on skill
                if ($user->worker->skill && stripos($user->worker->skill, 'designer') !== false) {
                    $listing->category_id = $designerCategory->id ?? $listing->category_id;
                }
                $updated = true;
            } 
            // Supplier data
            elseif ($user->supplier) {
                $listing->title = $user->supplier->company_name ?? $user->name;
                $listing->description = $user->supplier->bio ?? $listing->description;
                $listing->phone = $user->supplier->phone ?? $user->phone;
                $listing->services = $user->supplier->services ?? [];
                $listing->achievements = $user->supplier->achievements ?? [];
                $listing->languages = $user->supplier->languages ?? [];
                $listing->category_id = $supplierCategory->id ?? $listing->category_id;
                $updated = true;
            } 
            // Builder data
            elseif ($user->builder) {
                $listing->title = $user->builder->company_name ?? $user->name;
                $listing->description = $user->builder->bio ?? $listing->description;
                $listing->phone = $user->builder->phone ?? $user->phone;
                $listing->services = $user->builder->services ?? [];
                $listing->achievements = $user->builder->achievements ?? [];
                $listing->languages = $user->builder->languages ?? [];
                $listing->category_id = $builderCategory->id ?? $listing->category_id;
                $updated = true;
            }

            if ($updated) {
                $listing->save();
                $count++;
            }
        }

        $this->info("Successfully updated {$count} listings.");
        return 0;
    }
}
