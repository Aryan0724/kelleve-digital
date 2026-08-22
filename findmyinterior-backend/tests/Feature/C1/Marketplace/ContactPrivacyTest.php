<?php

namespace Tests\Feature\C1\Marketplace;

use App\Models\Listing;
use App\Models\User;
use App\Models\Category;

use Tests\TestCase;

class ContactPrivacyTest extends TestCase
{
    
    protected $connectionsToTransact = ['mysql', 'truedial', 'auth'];

    protected function setUp(): void
    {
        parent::setUp();
        
        $category = Category::firstOrCreate(['slug' => 'test-cat-privacy'], ['name' => 'Test Category Privacy']);
        
        $this->owner = User::factory()->create();
        $this->owner->roles()->attach(\App\Models\Role::firstOrCreate(['slug' => 'homeowner'], ['name' => 'Homeowner']));
        
        $this->admin = User::factory()->create();
        $this->admin->roles()->attach(\App\Models\Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Admin']));
        
        $this->guest = User::factory()->create(); // Guest as in not owner/premium
        $this->guest->roles()->attach(\App\Models\Role::firstOrCreate(['slug' => 'homeowner'], ['name' => 'Homeowner']));
        
        $this->premium = User::factory()->create();
        $this->premium->roles()->attach(\App\Models\Role::firstOrCreate(['slug' => 'professional'], ['name' => 'Professional']));
        $plan = \App\Models\SubscriptionPlan::firstOrCreate(
            ['slug' => 'elite'], 
            ['name' => 'Elite', 'can_see_all_leads' => true, 'price_monthly' => 100, 'price_yearly' => 1000, 'features' => '[]']
        );
        $this->premium->subscriptions()->create([
            'subscription_plan_id' => $plan->id,
            'status' => 'active',
            'starts_at' => now(),
            'expires_at' => now()->addMonth(),
        ]);

        $this->listing = Listing::create([
            'user_id' => $this->owner->id,
            'title' => "Test Privacy Listing",
            'slug' => "test-privacy-listing-" . uniqid(),
            'city' => 'Test City',
            'district' => 'Test District',
            'description' => 'Test Description',
            'phone' => '1234567890',
            'email' => "privacy@test.com",
            'category_id' => $category->id,
            'status' => 'active',
            'is_verified' => true,
        ]);
        
        // Also a worker for worker resource test
        $this->owner->worker()->create([
            'name' => $this->owner->name,
            'slug' => 'test-privacy-worker-' . uniqid(),
            'phone' => '1111111111',
            'email' => 'worker@test.com',
            'city' => 'Test',
            'district' => 'Test',
            'skill' => 'Painter',
            'languages' => ['English'],
        ]);
        
        \DB::table('workers')->where('id', $this->owner->worker->id)->update([
            'status' => 'active', 
            'is_verified' => 1
        ]);
    }

    public function test_guest_cannot_see_contacts()
    {
        $response = $this->actingAs($this->guest)->getJson('/api/v1/listings/' . $this->listing->slug);
        $response->assertStatus(200);
        $this->assertArrayNotHasKey('phone', $response->json('data'));
        $this->assertArrayNotHasKey('email', $response->json('data'));

        $response = $this->actingAs($this->guest)->getJson('/api/v1/workers/' . $this->owner->worker->slug);
        $response->assertStatus(200);
        $this->assertArrayNotHasKey('phone', $response->json('data'));
        $this->assertArrayNotHasKey('email', $response->json('data'));
    }

    public function test_owner_can_see_contacts()
    {
        $response = $this->actingAs($this->owner)->getJson('/api/v1/listings/' . $this->listing->slug);
        $response->assertStatus(200);
        $this->assertArrayHasKey('phone', $response->json('data'));
        
        $response = $this->actingAs($this->owner)->getJson('/api/v1/workers/' . $this->owner->worker->slug);
        $response->assertStatus(200);
        $this->assertArrayHasKey('phone', $response->json('data'));
    }

    public function test_admin_can_see_contacts()
    {
        $response = $this->actingAs($this->admin)->getJson('/api/v1/listings/' . $this->listing->slug);
        $response->assertStatus(200);
        $this->assertArrayHasKey('phone', $response->json('data'));
        
        $response = $this->actingAs($this->admin)->getJson('/api/v1/workers/' . $this->owner->worker->slug);
        $response->assertStatus(200);
        $this->assertArrayHasKey('phone', $response->json('data'));
    }

    public function test_premium_can_see_contacts()
    {
        $response = $this->actingAs($this->premium)->getJson('/api/v1/listings/' . $this->listing->slug);
        $response->assertStatus(200);
        $this->assertArrayHasKey('phone', $response->json('data'));
        
        $response = $this->actingAs($this->premium)->getJson('/api/v1/workers/' . $this->owner->worker->slug);
        $response->assertStatus(200);
        $this->assertArrayHasKey('phone', $response->json('data'));
    }

    public function test_unlocked_user_can_see_contacts()
    {
        $unlockedUser = User::factory()->create();
        
        \DB::table('contact_unlocks')->insert([
            'user_id' => $unlockedUser->id,
            'requirement_type' => get_class($this->listing),
            'requirement_id' => $this->listing->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        \DB::table('contact_unlocks')->insert([
            'user_id' => $unlockedUser->id,
            'requirement_type' => get_class($this->owner->worker),
            'requirement_id' => $this->owner->worker->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        $response = $this->actingAs($unlockedUser)->getJson('/api/v1/listings/' . $this->listing->slug);
        $response->assertStatus(200);
        $this->assertArrayHasKey('phone', $response->json('data'));

        $response = $this->actingAs($unlockedUser)->getJson('/api/v1/workers/' . $this->owner->worker->slug);
        $response->assertStatus(200);
        $this->assertArrayHasKey('phone', $response->json('data'));
    }
}




