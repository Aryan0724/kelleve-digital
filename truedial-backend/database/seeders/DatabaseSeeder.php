<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\District;
use App\Models\City;
use App\Models\SubscriptionPlan;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Cities & Districts
        $districts = [
            'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia',
            'Darbhanga', 'Bihar Sharif', 'Arrah', 'Begusarai', 'Katihar',
            'Munger', 'Chhapra', 'Danapur', 'Saharsa', 'Sasaram',
            'Hajipur', 'Dehri', 'Siwan', 'Motihari', 'Nawada'
        ];

        foreach ($districts as $dName) {
            $d = District::firstOrCreate(['name' => $dName], ['state' => 'Bihar', 'is_active' => true]);
            City::firstOrCreate(['name' => $dName, 'district_id' => $d->id], ['state' => 'Bihar', 'is_active' => true]);
        }

        // Add major metro cities for multi-city search
        $metroCities = ['Delhi', 'Mumbai', 'Bengaluru', 'Kolkata', 'Hyderabad', 'Chennai', 'Pune', 'Ahmedabad'];
        foreach ($metroCities as $mCity) {
            City::firstOrCreate(['name' => $mCity], ['state' => 'India', 'is_active' => true]);
        }

        // 2. Seed Subscription Plans
        SubscriptionPlan::firstOrCreate(['slug' => 'starter'], [
            'name' => 'Starter Free',
            'price_monthly' => 0.00,
            'price_yearly' => 0.00,
            'features' => ['Standard Directory Listing', 'Direct Customer Calls', 'Basic Profile Support'],
            'is_active' => true,
        ]);

        SubscriptionPlan::firstOrCreate(['slug' => 'growth-pro'], [
            'name' => 'Growth Pro',
            'price_monthly' => 2999.00,
            'price_yearly' => 29990.00,
            'features' => ['Verified Badge', 'Top 3 Search Placement', 'Privilege Card Deals Integration', 'CRM Leads Pipeline', 'Dedicated Account Manager'],
            'is_active' => true,
        ]);

        SubscriptionPlan::firstOrCreate(['slug' => 'enterprise-elite'], [
            'name' => 'Enterprise Elite',
            'price_monthly' => 7999.00,
            'price_yearly' => 79990.00,
            'features' => ['Guaranteed Leads', 'Banner Ad Placements', 'SMS & WhatsApp Marketing', 'Priority Support', 'Full Analytics Suite'],
            'is_active' => true,
        ]);

        // 3. Seed TrueDial Core Categories, Listings, Reviews, Offers
        $this->call([
            TruedialSeeder::class,
            MockCategoryAccountsSeeder::class,
        ]);
    }
}
