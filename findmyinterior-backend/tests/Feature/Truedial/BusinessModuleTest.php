<?php

namespace Tests\Feature\Truedial;

use App\Models\Category;
use App\Models\City;
use App\Models\District;
use App\Models\Listing;
use App\Models\Tenant;
use App\Models\User;
use App\Events\ListingUpdated;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class BusinessModuleTest extends TestCase
{
    use RefreshDatabase;

    protected $tenant;
    protected $user;
    protected $category;
    protected $city;
    protected $district;

    protected function setUp(): void
    {
        parent::setUp();

        $this->tenant = Tenant::firstOrCreate(
            ['slug' => 'truedial'],
            ['name' => 'TrueDial', 'domain' => 'truedial.local']
        );

        $this->user = User::factory()->create();
        $this->category = Category::factory()->create();
        $this->city = City::factory()->create();
    }

    public function test_vendor_can_create_business_profile()
    {
        $payload = [
            'category_id' => $this->category->id,
            'city_id' => $this->city->id,
            'title' => 'Test Vendor Business',
            'description' => 'A wonderful business',
            'phone' => '1234567890',
            'address' => '123 Main St',
            'district' => 'Downtown',
            'state' => 'State',
        ];

        $response = $this->actingAs($this->user)
            ->withHeader('X-Tenant-ID', $this->tenant->id)
            ->postJson('/api/v1/truedial/vendor/businesses', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('data.title', 'Test Vendor Business');

        $this->assertDatabaseHas('listings', [
            'title' => 'Test Vendor Business',
            'tenant_id' => $this->tenant->id,
            'user_id' => $this->user->id,
        ]);
    }

    public function test_vendor_can_update_extended_business_fields_and_fires_event()
    {
        Event::fake([ListingUpdated::class]);

        $business = Listing::factory()->create([
            'tenant_id' => $this->tenant->id,
            'user_id' => $this->user->id,
            'title' => 'Old Title',
        ]);

        $payload = [
            'title' => 'New Title',
            'years_experience' => 10,
            'team_size' => 50,
            'budget_tier' => 'premium',
            'languages' => ['English', 'Spanish'],
            'social_links' => [
                'facebook' => 'https://facebook.com/test',
            ],
            'availability' => [
                'monday' => ['09:00', '17:00'],
            ],
        ];

        $response = $this->actingAs($this->user)
            ->withHeader('X-Tenant-ID', $this->tenant->id)
            ->putJson("/api/v1/truedial/vendor/businesses/{$business->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonPath('data.title', 'New Title')
            ->assertJsonPath('data.years_experience', 10);

        $this->assertDatabaseHas('listings', [
            'id' => $business->id,
            'title' => 'New Title',
            'budget_tier' => 'premium',
        ]);

        Event::assertDispatched(ListingUpdated::class);
    }

    public function test_vendor_cannot_update_others_business()
    {
        $otherUser = User::factory()->create();
        
        $business = Listing::factory()->create([
            'tenant_id' => $this->tenant->id,
            'user_id' => $otherUser->id,
        ]);

        $response = $this->actingAs($this->user)
            ->withHeader('X-Tenant-ID', $this->tenant->id)
            ->putJson("/api/v1/truedial/vendor/businesses/{$business->id}", [
                'title' => 'Hacked Title',
            ]);

        $response->assertStatus(403);
    }
}
