<?php

namespace Tests\Feature\C1\Marketplace;

use App\Models\Listing;
use App\Models\User;
use App\Models\Category;

use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class NPlusOneTest extends TestCase
{
    use \Illuminate\Foundation\Testing\DatabaseTransactions;
    protected $connectionsToTransact = ['mysql', 'truedial', 'auth'];

    protected function setUp(): void
    {
        parent::setUp();
        
        $category = Category::firstOrCreate(['slug' => 'test-cat-n1'], ['name' => 'Test Category N1']);
        
        // Ensure we have 50 listings
        for ($i = 0; $i < 50; $i++) {
            $user = User::factory()->create();
            // Attach a worker to 50%
            $slugSuffix = uniqid();
            if ($i % 2 === 0) {
                $user->worker()->create([
                    'name' => $user->name,
                    'slug' => "test-worker-n1-$i-$slugSuffix",
                    'phone' => '1111111111',
                    'city' => 'Test',
                    'district' => 'Test',
                    'skill' => 'Painter',
                    'languages' => ['English'],
                ]);
            }

            Listing::unguard();
            Listing::create([
                'user_id' => $user->id,
                'title' => "Test Listing $i",
                'slug' => "test-listing-n1-$i-$slugSuffix",
                'city' => 'Test City',
                'district' => 'Test District',
                'description' => 'Test Description',
                'phone' => '1234567890',
                'email' => "test$i@test.com",
                'category_id' => $category->id,
                'status' => 'active',
                'is_verified' => true,
                'avg_rating' => 5.0,
            ]);
            Listing::reguard();
        }
    }

    public function test_listings_endpoint_does_not_scale_queries_linearly()
    {
        // Test 10 results
        DB::enableQueryLog();
        $this->getJson('/api/v1/listings?per_page=10');
        $q10 = count(DB::getQueryLog());
        DB::flushQueryLog();

        // Test 50 results
        DB::enableQueryLog();
        $this->getJson('/api/v1/listings?per_page=50');
        $q50 = count(DB::getQueryLog());
        DB::flushQueryLog();

        // The query count for 50 results should not be 5x the query count for 10 results.
        // In a perfectly eager-loaded system, q10 == q50. 
        // We allow a small constant variance, but definitely not scaling with N.
        $this->assertLessThan($q10 + 5, $q50, "Query count scaled unacceptably. Q10: $q10, Q50: $q50");
    }
}





