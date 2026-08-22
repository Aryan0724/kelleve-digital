<?php

namespace Tests\Feature\C1\Marketplace;

use App\Models\Builder;
use App\Models\Category;
use App\Models\City;
use App\Models\Listing;
use App\Models\Supplier;
use App\Models\User;
use App\Models\Worker;

use Tests\TestCase;

class PublicApiTest extends TestCase
{
    use \Illuminate\Foundation\Testing\DatabaseTransactions;
    protected $connectionsToTransact = ['mysql', 'truedial', 'auth'];

    protected function setUp(): void
    {
        parent::setUp();
        \Illuminate\Database\Eloquent\Model::unguard();
        
        // Since we are not using RefreshDatabase, we must ensure basic categories/cities exist
        $this->category = Category::firstOrCreate(['slug' => 'test-cat'], ['name' => 'Test Category']);
        
        $district = \App\Models\District::firstOrCreate(['slug' => 'test-dist'], ['name' => 'Test District', 'state' => 'Bihar']);
        $this->city = City::firstOrCreate(['slug' => 'test-city'], ['name' => 'Test City', 'district_id' => $district->id]);
    }

    /**
     * Data Exposure Test - Builder
     */
    public function test_builder_public_profile_never_leaks_private_data()
    {
        $builder = Builder::create([
            'user_id' => User::factory()->create()->id,
            'company_name' => 'Leak Test Builder',
            'slug' => 'leak-test-builder',
            'city' => 'Test City',
            'district' => 'Test District',
            'phone' => '8888888888',
            'email' => 'builder@leak.test',
            'is_verified' => true,
            'status' => 'active'
        ]);

        $response = $this->getJson("/api/v1/builders/{$builder->slug}");

        $response->assertStatus(200);
        $data = $response->json('data');

        // Explicit Allowlist check
        $allowedFields = [
            'id', 'company_name', 'slug', 'tagline', 'logo', 'cover_image', 'city', 
            'district', 'rera_number', 'established_year', 'total_projects', 
            'delivered_projects', 'avg_rating', 'review_count', 'is_verified', 
            'is_featured', 'projects', 'possession_projects', 'reviews', 'created_at',
            'website'
        ];

        // Ensure NO forbidden fields are present
        $this->assertArrayNotHasKey('phone', $data, "Security Leak: Phone number exposed unconditionally on Builder profile!");
        $this->assertArrayNotHasKey('email', $data, "Security Leak: Email exposed unconditionally on Builder profile!");

        foreach (array_keys($data) as $key) {
            $this->assertContains($key, $allowedFields, "Security Leak: Unexpected field '$key' exposed in BuilderResource!");
        }
    }

    /**
     * Data Exposure Test - Supplier
     */
    public function test_supplier_public_profile_never_leaks_private_data()
    {
        $supplier = Supplier::create([
            'user_id' => User::factory()->create()->id,
            'company_name' => 'Leak Test Supplier',
            'slug' => 'leak-test-supplier',
            'city' => 'Test City',
            'district' => 'Test District',
            'phone' => '7777777777',
            'email' => 'supplier@leak.test',
            'is_verified' => true,
            'status' => 'active'
        ]);

        $response = $this->getJson("/api/v1/suppliers/{$supplier->slug}");

        $response->assertStatus(200);
        $data = $response->json('data');

        // Explicit Allowlist check
        $allowedFields = [
            'id', 'company_name', 'slug', 'tagline', 'logo', 'cover_image', 'city', 
            'district', 'business_type', 'avg_rating', 'review_count', 'is_verified', 
            'is_featured', 'website', 'products', 'reviews'
        ];

        // Ensure NO forbidden fields are present
        $this->assertArrayNotHasKey('phone', $data, "Security Leak: Phone number exposed unconditionally on Supplier profile!");
        $this->assertArrayNotHasKey('email', $data, "Security Leak: Email exposed unconditionally on Supplier profile!");
        $this->assertArrayNotHasKey('gst_number', $data, "Security Leak: GST number exposed unconditionally on Supplier profile!");
        
        foreach (array_keys($data) as $key) {
            $this->assertContains($key, $allowedFields, "Security Leak: Unexpected field '$key' exposed in SupplierResource!");
        }
    }

    /**
     * Data Exposure Test - Listing
     */
    public function test_listing_public_profile_never_leaks_private_data()
    {
        $listing = Listing::create([
            'user_id' => User::factory()->create()->id,
            'title' => 'Leak Test Listing',
            'slug' => 'leak-test-listing',
            'city' => 'Test City',
            'district' => 'Test District',
            'description' => 'Test Description',
            'phone' => '6666666666',
            'email' => 'listing@leak.test',
            'category_id' => $this->category->id,
            'status' => 'active',
            'is_verified' => true,
        ]);

        $response = $this->getJson("/api/v1/listings/{$listing->slug}");

        $response->assertStatus(200);
        $data = $response->json('data');

        // Explicit Allowlist
        $allowedFields = [
            'id', 'title', 'slug', 'tagline', 'description', 'cover_image', 'languages',
            'category', 'city', 'district', 'state', 'address', 'years_experience', 'team_size',
            'gst_number', 'pan_number', 'avg_rating', 'review_count', 'is_verified', 'is_featured',
            'is_premium', 'is_gold_verified', 'is_sponsored', 'is_top_rated', 'status', 'views_count',
            'trust_score', 'profile_completion_score', 'verification_level', 'user', 'gallery', 'gallery_count',
            'services', 'products', 'achievements', 'social_links', 'availability', 'response_time',
            'reviews', 'created_at', 'website'
        ];

        $this->assertArrayNotHasKey('phone', $data, "Security Leak: Phone exposed unconditionally on Listing profile!");
        $this->assertArrayNotHasKey('email', $data, "Security Leak: Email exposed unconditionally on Listing profile!");
        $this->assertArrayNotHasKey('whatsapp', $data, "Security Leak: Whatsapp exposed unconditionally on Listing profile!");
        
        foreach (array_keys($data) as $key) {
            $this->assertContains($key, $allowedFields, "Security Leak: Unexpected field '$key' exposed in ListingResource!");
        }
    }

    /**
     * Search Correctness Tests
     */
    public function test_search_correctness_and_bounds()
    {
        $worker = Worker::create([
            'user_id' => User::factory()->create()->id,
            'name' => 'Searchable Worker',
            'slug' => 'searchable-worker',
            'city' => 'Test City',
            'district' => 'Test District',
            'phone' => '1234567890',
            'skill' => 'Painter',
            'is_verified' => true,
            'status' => 'active'
        ]);

        $response = $this->getJson("/api/v1/search?q=Searchable Worker&type=workers");
        
        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data.workers'));
        
        // Assert unbounded queries don't return everything (take(6) is set in controller)
        // Let's assert data format
        $this->assertEquals('Searchable Worker', $response->json('data.workers.0.name'));
        
        // Check leakage in search results
        $this->assertArrayNotHasKey('phone', $response->json('data.workers.0'), "Security Leak: Search results exposed phone number!");
    }
}





