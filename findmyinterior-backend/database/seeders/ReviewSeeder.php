<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Review;
class ReviewSeeder extends Seeder {
  public function run(): void {
  Review::unguard();

        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 6,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 32,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 59,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 19,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 21,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 11,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 1,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 33,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 60,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 23,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 17,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 10,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 21,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 2,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 38,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 7,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 6,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 74,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 6,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 32,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 11,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 17,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 36,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 10,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 2,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 2,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 31,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 3,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 62,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 35,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 5,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 28,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 12,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 16,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 7,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 30,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 39,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 52,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 5,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 20,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 7,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 17,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 42,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 6,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 12,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 30,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 31,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 4,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 22,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 18,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 25,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 9,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 38,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 63,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 19,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 23,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 53,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 4,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 38,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 17,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 19,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 44,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 4,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 40,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 54,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 14,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 27,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 6,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 2,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 16,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 14,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 7,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 2,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 37,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 8,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 11,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 15,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 9,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 63,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 28,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 70,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 20,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 73,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 30,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 58,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 40,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 6,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 19,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 10,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 39,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 10,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 39,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 6,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 14,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 26,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 31,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 7,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 11,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 51,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 25,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 35,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 54,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 66,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 34,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 30,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 3,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 51,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 31,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 18,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 32,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 23,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 18,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 54,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 17,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 16,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 31,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 4,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 7,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 8,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 10,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 1,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 37,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 16,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 13,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 10,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 51,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 26,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 54,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 13,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 8,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 15,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 9,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 54,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 8,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 10,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 4,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 12,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 12,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 9,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 55,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 11,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 32,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 63,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 11,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 20,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 35,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 38,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 20,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 45,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 30,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 19,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 74,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 18,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 29,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 4,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 21,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 6,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 33,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 56,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 26,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 36,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 17,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 5,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 29,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 3,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 62,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 14,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 31,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 41,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 35,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 37,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 18,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 67,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 11,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 1,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 37,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 30,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 11,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 24,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 13,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 9,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 15,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 21,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 9,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 25,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 26,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 23,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 37,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 15,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 66,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 11,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 5,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 29,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 39,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 46,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 37,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 18,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 53,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 3,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 30,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 5,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 15,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 16,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 15,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 20,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 27,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 1,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 29,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 17,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 31,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 5,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 26,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 8,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 24,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 55,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 12,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 20,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 1,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 36,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 14,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 18,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 60,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 18,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 18,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 1,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 6,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 47,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 7,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 29,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 69,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 38,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 11,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 10,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 13,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 17,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 11,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 50,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 49,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 14,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 6,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 29,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 27,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 34,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 44,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 74,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 16,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 42,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 4,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 4,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 20,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 34,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 61,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 26,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 6,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 24,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 13,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 33,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 61,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 36,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 64,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 7,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 4,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 39,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 13,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 25,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 19,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 7,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 13,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 6,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 2,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 10,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 7,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 17,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 7,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 39,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 38,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 37,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 47,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 2,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 18,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 16,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 33,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 26,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 1,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 8,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 29,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 33,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 35,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 26,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 33,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 45,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 74,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 8,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 6,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 1,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 5,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 6,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 14,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 8,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 15,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 18,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 20,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 8,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 3,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 35,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 15,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 19,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 37,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 35,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 2,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 39,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 12,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 13,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 9,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 55,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 23,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 26,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 5,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 7,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 2,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 8,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 30,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 40,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 11,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 27,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 17,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 3,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 4,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 7,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 16,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 11,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 17,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 20,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 4,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 28,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 23,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 7,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 3,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 35,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 7,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 19,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 14,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 7,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 22,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 3,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 14,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 4,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 31,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 12,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 17,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 54,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 2,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 1,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 31,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 9,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 1,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 17,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 12,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 8,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 6,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 2,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 23,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 18,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 70,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 5,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 47,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 2,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 17,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 9,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 67,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 65,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 10,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 12,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 10,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 21,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 68,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 22,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 58,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 15,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 28,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 28,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 22,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 73,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 11,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 67,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 3,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 38,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 7,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 29,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 31,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 19,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 10,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 20,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 12,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 17,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 20,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 11,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 34,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 15,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 73,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 4,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 44,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 37,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 9,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 7,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 19,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 15,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 34,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 17,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 9,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 9,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 9,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 7,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 12,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 6,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 16,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 37,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 6,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 3,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 63,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 73,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 19,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 27,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 65,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 25,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 5,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 1,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 38,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 7,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 21,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 18,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 32,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 1,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 8,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 1,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 18,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 23,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 7,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 10,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 2,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 11,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 12,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 71,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 11,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 14,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 28,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 8,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 11,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 6,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 32,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 10,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 4,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 4,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 22,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 10,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 16,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 68,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 67,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 18,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 68,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 29,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 36,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 21,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 12,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 23,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 41,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 32,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 2,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 24,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 44,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 2,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 25,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 14,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 42,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 10,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 60,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 39,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 10,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 19,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 36,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 42,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 34,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 61,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 1,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 37,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 7,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 14,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 2,
            'rating' => 5, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 8,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 30,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'The team was very cooperative and understood our requirements perfectly.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 11,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 26,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Supplier', 'reviewable_id' => 40,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 11,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 6,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 14,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Absolutely stunning design work. Worth every penny.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 9,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Good work, but took a little longer than expected.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Builder', 'reviewable_id' => 18,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 71,
            'rating' => 4, 'title' => 'Great Experience',
            'body' => 'They delivered the project on time. Very satisfied with the material quality.', 'is_approved' => true
        ]);
        
        Review::create([
            'user_id' => 1, 'reviewable_type' => 'App\Models\Listing', 'reviewable_id' => 56,
            'rating' => 3, 'title' => 'Great Experience',
            'body' => 'Excellent service and very professional behavior. Highly recommended!', 'is_approved' => true
        ]);
          }
}
