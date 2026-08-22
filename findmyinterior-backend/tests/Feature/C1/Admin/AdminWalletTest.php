<?php

namespace Tests\Feature\C1\Admin;

use App\Models\User;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class AdminWalletTest extends TestCase
{
    protected function tearDown(): void
    {
        ActivityLog::where('id', '>', 0)->delete();
        DB::table('wallet_transactions')->where('id', '>', 0)->delete();
        DB::table('wallets')->where('id', '>', 0)->delete();
        User::where('id', '>', 0)->delete();
        parent::tearDown();
    }

    public function test_admin_can_credit_wallet_and_audit_is_recorded()
    {
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        $user = User::factory()->create();

        $response = $this->actingAs($admin, 'sanctum')->patchJson("/api/v1/admin/users/{$user->id}/wallet/adjust", [
            'amount' => 500.50,
            'reason' => 'Compensating for a bug'
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonPath('after_balance', 500.50);

        // Verify transaction
        $this->assertDatabaseHas('wallet_transactions', [
            'type' => 'credit',
            'amount' => 500.50,
            'description' => 'Compensating for a bug',
            'created_by' => $admin->id
        ]);

        // Verify audit log
        $this->assertDatabaseHas('activity_logs', [
            'user_id' => $admin->id,
            'event_type' => 'ADMIN_CREDIT',
            'subject_type' => User::class,
            'subject_id' => $user->id,
            'description' => 'Compensating for a bug'
        ]);
    }

    public function test_normal_user_cannot_adjust_wallet()
    {
        $normal = User::factory()->create();
        $target = User::factory()->create();

        $response = $this->actingAs($normal, 'sanctum')->patchJson("/api/v1/admin/users/{$target->id}/wallet/adjust", [
            'amount' => 1000,
            'reason' => 'Free money'
        ]);

        $response->assertStatus(403);
    }
}
