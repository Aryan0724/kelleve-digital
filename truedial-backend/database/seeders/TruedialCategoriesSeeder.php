<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;
class TruedialCategoriesSeeder extends Seeder {
    public function run(): void {
        $cats = ['Restaurants & Cafes', 'Hotels & Lodging', 'Hospitals & Healthcare', 'Education & Coaching', 'Interior & Architecture'];
        foreach($cats as $i => $cat) {
            Category::create(['name' => $cat, 'slug' => Str::slug($cat), 'sort_order' => $i]);
        }
    }
}
