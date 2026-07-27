<?php

namespace Tests\Feature\Truedial;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Listing;

class VendorWorkflowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->vendor = User::factory()->create();
        
        $category = \App\Models\Category::create([
            'name' => 'Interior Designer',
            'slug' => 'interior-designer',
            'type' => 'professional',
            'platform' => 'both',
            'icon' => 'test.png',
            'is_active' => true,
        ]);
        
        // Ensure a listing exists for the vendor, needed for OfferManagementController
        $this->listing = Listing::create([
            'user_id' => $this->vendor->id,
            'category_id' => $category->id,
            'title' => 'Test Vendor Business',
            'slug' => 'test-vendor-business',
            'description' => 'A test business',
            'district' => 'Mumbai',
            'city' => 'Mumbai',
            'status' => 'published',
            'is_claimed' => true,
        ]);
    }

    /**
     * Test vendor can create an offer.
     */
    public function test_vendor_can_create_offer()
    {
        $payload = [
            'listing_id' => $this->listing->id,
            'title' => 'Diwali 20% Off',
            'status' => 'active',
            'valid_until' => now()->addDays(10)->toDateString(),
            'discount_type' => 'percentage',
            'discount_value' => 20,
            'promo_code' => 'DIWALI20'
        ];

        $response = $this->actingAs($this->vendor)->postJson('/api/v1/truedial/vendor/offers', $payload);

        $response->assertStatus(200)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Offer created successfully.',
                 ]);
                 
        $this->assertDatabaseHas('offers', [
            'listing_id' => $this->listing->id,
            'title' => 'Diwali 20% Off',
            'promo_code' => 'DIWALI20'
        ]);
    }

    /**
     * Test vendor can fetch their offers.
     */
    public function test_vendor_can_fetch_offers()
    {
        // First create one
        $this->actingAs($this->vendor)->postJson('/api/v1/truedial/vendor/offers', [
            'listing_id' => $this->listing->id,
            'title' => 'Flash Sale',
            'status' => 'active'
        ]);

        $response = $this->actingAs($this->vendor)->getJson('/api/v1/truedial/vendor/offers');

        $response->assertStatus(200);
    }

    /**
     * Test vendor can generate invoice payment link.
     */
    public function test_vendor_can_generate_invoice()
    {
        $payload = [
            'lead_name' => 'Alice Doe',
            'amount' => 1500,
            'description' => 'Website Redesign'
        ];

        $response = $this->actingAs($this->vendor)->postJson('/api/v1/truedial/vendor/invoices', $payload);

        $response->assertStatus(201)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Payment link generated successfully'
                 ]);

        $this->assertDatabaseHas('truedial_invoices', [
            'user_id' => $this->vendor->id,
            'client_name' => 'Alice Doe',
            'amount' => 1500,
        ]);
    }

    /**
     * Test vendor can create a marketing campaign.
     */
    public function test_vendor_can_create_marketing_campaign()
    {
        $payload = [
            'name' => 'Spring Sale',
            'type' => 'sms',
            'content' => 'Get 20% off all services this spring!',
            'audience' => 'all_customers'
        ];

        $response = $this->actingAs($this->vendor)->postJson('/api/v1/truedial/vendor/marketing/campaigns', $payload);

        $response->assertStatus(201)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Campaign created successfully'
                 ]);

        $this->assertDatabaseHas('marketing_campaigns', [
            'user_id' => $this->vendor->id,
            'name' => 'Spring Sale',
            'audience' => 'all_customers',
        ]);
    }
}
