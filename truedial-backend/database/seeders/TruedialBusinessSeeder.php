<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Listing;
use App\Models\Category;
use Illuminate\Support\Str;
class TruedialBusinessSeeder extends Seeder {
    public function run(): void {
        $cat = Category::first();
        if ($cat) {
            for($i=1; $i<=5; $i++) {
                Listing::create([
                    'user_id' => 1, 'category_id' => $cat->id, 'title' => "Business $i",
                    'slug' => Str::slug("Business $i"), 'city' => 'Patna',
                    'status' => 'active', 'is_verified' => true
                ]);
            }
        }
    }
}
