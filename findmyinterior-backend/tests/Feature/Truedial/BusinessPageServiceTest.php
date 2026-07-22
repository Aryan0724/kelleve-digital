<?php

namespace Tests\Feature\Truedial;

use App\Models\Listing;
use App\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BusinessPageServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_business_page_returns_dto()
    {
        $tenant = Tenant::factory()->create();
        $listing = Listing::factory()->create([
            'tenant_id' => $tenant->id, 
            'is_active' => true,
            'status' => 'active',
            'is_verified' => true
        ]);

        $response = $this->getJson("/api/v1/truedial/public/businesses/{$listing->slug}");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data' => [
                'basicInfo' => ['id', 'slug', 'title'],
                'actions',
                'metrics',
                'catalog' => ['products', 'services'],
                'media'
            ]
        ]);
    }
}
