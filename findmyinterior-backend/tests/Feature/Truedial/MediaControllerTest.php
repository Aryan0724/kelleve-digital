<?php

namespace Tests\Feature\Truedial;

use App\Models\Listing;
use App\Models\Media;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MediaControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    public function test_vendor_can_upload_media_to_listing()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->create();
        $user->tenants()->attach($tenant->id, ['role_id' => null, 'status' => 'active']);
        $listing = Listing::factory()->create(['tenant_id' => $tenant->id, 'user_id' => $user->id]);
        if (!Listing::where('tenant_id', $tenant->id)->where('user_id', $user->id)->find($listing->id)) {
            dd($listing->toArray(), "Listing not found in DB with those constraints!");
        }

        $file = UploadedFile::fake()->image('test.jpg');
        
        app(\App\Core\Tenancy\TenantContext::class)->setTenant($tenant);

        $response = $this->actingAs($user)
            ->withHeaders(['X-Tenant-ID' => $tenant->id])
            ->postJson('/api/v1/truedial/vendor/media', [
            'files' => [$file],
            'model_type' => 'listing',
            'model_id' => $listing->id,
            'collection_name' => 'gallery',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseCount('media', 1);
        $this->assertDatabaseHas('media', [
            'tenant_id' => $tenant->id,
            'model_type' => 'Listing',
            'model_id' => $listing->id,
            'collection_name' => 'gallery',
        ]);
    }
}
