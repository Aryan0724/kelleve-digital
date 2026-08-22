<?php

namespace Tests\Feature\C1\Marketplace;

use App\Models\Listing;
use App\Models\User;
use App\Models\Category;

use Tests\TestCase;

class PaginationAndOrderingTest extends TestCase
{
    use \Illuminate\Foundation\Testing\DatabaseTransactions;
    protected $connectionsToTransact = ['mysql', 'truedial', 'auth'];

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->catSlug = 'test-cat-' . uniqid();
        $category = Category::firstOrCreate(['slug' => $this->catSlug], ['name' => 'Test Category']);
        
        $runId = uniqid();
        // Ensure we have some listings to test pagination
        for ($i = 0; $i < 25; $i++) {
            $user = User::factory()->create();
            Listing::unguard();
            Listing::create([
                'user_id' => $user->id,
                'title' => "Test Listing $i",
                'slug' => "test-listing-$i-$runId",
                'city' => 'Test City',
                'district' => 'Test District',
                'description' => 'Test Description',
                'phone' => '1234567890',
                'email' => "test$i@test.com",
                'category_id' => $category->id,
                'status' => 'active',
                'is_verified' => true,
                'avg_rating' => 5.0, // Same rating to test deterministic ordering
            ]);
            Listing::reguard();
        }
    }

    public function test_pagination_bounds_returns_422_if_exceeded()
    {
        $response = $this->getJson('/api/v1/listings?category=' . $this->catSlug . '&per_page=200');
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['per_page']);

        $response = $this->getJson('/api/v1/listings?category=' . $this->catSlug . '&per_page=-1');
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['per_page']);

        $response = $this->getJson('/api/v1/listings?category=' . $this->catSlug . '&per_page=abc');
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['per_page']);
    }

    public function test_pagination_respects_valid_per_page()
    {
        $response = $this->getJson('/api/v1/listings?category=' . $this->catSlug . '&per_page=15');
        $response->assertStatus(200)
                 ->assertJsonPath('meta.per_page', 15)
                 ->assertJsonCount(15, 'data');
    }

    public function test_pagination_default_per_page()
    {
        $response = $this->getJson('/api/v1/listings?category=' . $this->catSlug);
        $response->assertStatus(200);
        
        // Currently default is 20 for ListingController
        $response->assertJsonPath('meta.per_page', 20);
    }

    public function test_deterministic_ordering_with_identical_primary_sort()
    {
        // Sort by rating where all ratings are 5.0
        $response1 = $this->getJson('/api/v1/listings?category=' . $this->catSlug . '&sort=rating&per_page=10&page=1');
        $response2 = $this->getJson('/api/v1/listings?category=' . $this->catSlug . '&sort=rating&per_page=10&page=1');

        $ids1 = collect($response1->json('data'))->pluck('id')->toArray();
        $ids2 = collect($response2->json('data'))->pluck('id')->toArray();

        $this->assertEquals($ids1, $ids2, 'Ordering is not deterministic across identical requests');
    }
}





