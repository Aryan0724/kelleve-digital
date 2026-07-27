<?php

namespace Tests\Feature\Truedial;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PublicEcosystemTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test the consulting lead capture endpoint.
     */
    public function test_can_submit_consulting_lead()
    {
        $payload = [
            'name' => 'John Doe',
            'phone' => '+919876543210',
            'service_type' => 'Startup Registration',
            'message' => 'Need help registering my company.'
        ];

        $response = $this->postJson('/api/v1/truedial/public/consulting/lead', $payload);

        $response->assertStatus(201)
                 ->assertJson([
                     'success' => true,
                     'message' => 'Consultation request submitted successfully. Our team will contact you shortly.',
                 ])
                 ->assertJsonStructure([
                     'data' => [
                         'id',
                         'name',
                         'service_type',
                         'status',
                         'created_at'
                     ]
                 ]);
                 
        $this->assertEquals('John Doe', $response->json('data.name'));
        $this->assertEquals('Startup Registration', $response->json('data.service_type'));

        $this->assertDatabaseHas('consulting_leads', [
            'name' => 'John Doe',
            'phone' => '+919876543210',
            'service_type' => 'Startup Registration',
        ]);
    }

    // Removed Tier 3 tests (Academy & Jobs) per BETA_SCOPE.md
}
