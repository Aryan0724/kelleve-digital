<?php

namespace Tests\Feature\Truedial;

use App\Models\Listing;
use App\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SearchServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_premium_and_verified_listings_rank_higher()
    {
        $tenant = Tenant::factory()->create();
        
        $basicListing = Listing::factory()->create([
            'tenant_id' => $tenant->id,
            'title' => 'Plumber Basic',
            'status' => 'active',
            'is_premium' => false,
            'is_verified' => false,
            'avg_rating' => 3
        ]);
        
        $premiumListing = Listing::factory()->create([
            'tenant_id' => $tenant->id,
            'title' => 'Plumber Premium',
            'status' => 'active',
            'is_premium' => true,
            'is_verified' => true,
            'avg_rating' => 5
        ]);

        $response = $this->getJson('/api/v1/truedial/public/search?q=Plumber');
        $response->assertStatus(200);
        $data = $response->json('data.data.data');
        
        $this->assertCount(2, $data);
        // Premium should be first due to ranking logic
        $this->assertEquals($premiumListing->id, $data[0]['id']);
        $this->assertEquals($basicListing->id, $data[1]['id']);
    }

    public function test_autocomplete_returns_limited_results()
    {
        $tenant = Tenant::factory()->create();
        Listing::factory()->count(10)->create([
            'tenant_id' => $tenant->id,
            'title' => 'Electrician',
            'status' => 'active',
        ]);

        $response = $this->getJson('/api/v1/truedial/public/search/autocomplete?q=Elect');

        $response->assertStatus(200);
        $data = $response->json('data');
        
        $this->assertLessThanOrEqual(8, count($data));
        $this->assertArrayHasKey('locality', $data[0]);
    }
}
