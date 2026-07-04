<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cities = [
            'Patna' => 'Bihar',
            'Delhi' => 'Delhi',
            'Mumbai' => 'Maharashtra',
            'Bangalore' => 'Karnataka',
            'Hyderabad' => 'Telangana',
            'Chennai' => 'Tamil Nadu',
            'Kolkata' => 'West Bengal',
            'Pune' => 'Maharashtra',
            'Ahmedabad' => 'Gujarat',
            'Jaipur' => 'Rajasthan',
            'Lucknow' => 'Uttar Pradesh',
            'Chandigarh' => 'Chandigarh',
            'Bhopal' => 'Madhya Pradesh',
            'Ranchi' => 'Jharkhand',
            'Bhubaneswar' => 'Odisha',
            'Guwahati' => 'Assam',
            'Surat' => 'Gujarat',
            'Kanpur' => 'Uttar Pradesh',
            'Nagpur' => 'Maharashtra',
            'Indore' => 'Madhya Pradesh',
            'Thane' => 'Maharashtra',
            'Agra' => 'Uttar Pradesh',
            'Varanasi' => 'Uttar Pradesh',
            'Faridabad' => 'Haryana',
            'Ludhiana' => 'Punjab',
            'Rajkot' => 'Gujarat',
            'Meerut' => 'Uttar Pradesh',
            'Kalyan-Dombivli' => 'Maharashtra',
            'Navi Mumbai' => 'Maharashtra',
            'Nashik' => 'Maharashtra',
            'Vijayawada' => 'Andhra Pradesh',
            'Madurai' => 'Tamil Nadu',
            'Raipur' => 'Chhattisgarh',
            'Kota' => 'Rajasthan',
            'Coimbatore' => 'Tamil Nadu',
            'Jodhpur' => 'Rajasthan',
            'Gwalior' => 'Madhya Pradesh',
            'Allahabad' => 'Uttar Pradesh',
            'Visakhapatnam' => 'Andhra Pradesh',
            'Dehradun' => 'Uttarakhand',
            'Kochi' => 'Kerala',
            'Trivandrum' => 'Kerala',
        ];

        foreach ($cities as $city => $state) {
            Location::firstOrCreate(
                ['name' => $city],
                [
                    'state' => $state,
                    'slug' => Str::slug($city),
                    'is_active' => true,
                ]
            );
        }
    }
}
