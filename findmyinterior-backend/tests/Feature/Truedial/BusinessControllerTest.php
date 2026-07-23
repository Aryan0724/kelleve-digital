<?php

namespace Tests\Feature\Truedial;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Listing;
use App\Models\Tenant;
use App\Models\Category;
use App\Models\City;
use App\Models\District;

class BusinessControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $tenant;
    protected $user;
    protected $listing;

    protected function setUp(): void
    {
        parent::setUp();

        $this->tenant = Tenant::firstOrCreate(['slug' => 'truedial'], ['name' => 'Truedial', 'domain' => 'truedial.test']);
        $this->user = User::factory()->create();
        
        $category = Category::factory()->create(['tenant_id' => $this->tenant->id]);
        $city = City::factory()->create();
        $district = District::factory()->create();

        $this->listing = Listing::factory()->create([
            'tenant_id' => $this->tenant->id,
            'user_id' => $this->user->id,
            'category_id' => $category->id,
            'city_id' => $city->id,
            'district_id' => $district->id,
        ]);
    }

    public function test_vendor_can_update_products()
    {
        $response = $this->actingAs($this->user)
            ->withHeaders(['X-Tenant-ID' => $this->tenant->id])
            ->putJson('/api/v1/truedial/vendor/businesses/me/products', [
            'products' => [
                [
                    'name' => 'Test Product 1',
                    'price' => 100,
                ],
                [
                    'name' => 'Test Product 2',
                    'price' => 200,
                ]
            ]
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('listing_products', [
            'listing_id' => $this->listing->id,
            'name' => 'Test Product 1',
            'price' => 100,
        ]);
        $this->assertDatabaseHas('listing_products', [
            'listing_id' => $this->listing->id,
            'name' => 'Test Product 2',
            'price' => 200,
        ]);
        $this->assertDatabaseCount('listing_products', 2);
    }
}
