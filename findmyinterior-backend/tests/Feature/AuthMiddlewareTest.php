<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthMiddlewareTest extends TestCase
{
    use RefreshDatabase;

    public function test_api_rejects_unauthenticated_requests_without_token()
    {
        $response = $this->getJson('/api/v1/user/profile');
        $response->assertStatus(401);
    }

    public function test_api_rejects_requests_with_invalid_token()
    {
        $response = $this->withHeaders([
            'Authorization' => 'Bearer invalid-token-string'
        ])->getJson('/api/v1/user/profile');

        $response->assertStatus(401);
    }

    public function test_api_accepts_requests_with_valid_sanctum_token()
    {
        $user = User::factory()->create();
        
        // Create an actual Sanctum token as it would be created on login
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/v1/user/profile');

        $response->assertStatus(200);
        $response->assertJsonPath('data.id', $user->id);
    }

    public function test_api_rejects_requests_with_revoked_token()
    {
        $user = User::factory()->create();
        $tokenResult = $user->createToken('test-token');
        $token = $tokenResult->plainTextToken;

        // Revoke the token
        $user->tokens()->where('id', $tokenResult->accessToken->id)->delete();

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token
        ])->getJson('/api/v1/user/profile');

        $response->assertStatus(401);
    }
}
