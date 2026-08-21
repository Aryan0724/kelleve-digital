<?php

namespace Tests\Feature\C1\Marketplace;

use App\Models\User;
use App\Models\Role;
use App\Models\Project;
use App\Models\Payment;
use App\Models\SubscriptionPlan;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;
use Illuminate\Support\Facades\DB;
use App\Services\WalletService;
use App\Services\UnlockService;

class FinancialTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();
        Role::firstOrCreate(['slug' => 'admin'], ['name' => 'Admin']);
        Role::firstOrCreate(['slug' => 'business'], ['name' => 'Professional']);
        Role::firstOrCreate(['slug' => 'customer'], ['name' => 'Customer']);
    }

    public function test_wallet_recharge_security()
    {
        $admin = User::factory()->create();
        $admin->roles()->attach(Role::where('slug', 'admin')->first());

        $user = User::factory()->create();
        $user->roles()->attach(Role::where('slug', 'business')->first());

        // Normal user attempts to add funds
        $response = $this->actingAs($user)->postJson('/api/v1/wallet/add-funds', [
            'amount' => 500,
            'user_id' => $user->id
        ]);
        $response->assertStatus(403);

        // Admin adds funds
        $response = $this->actingAs($admin)->postJson('/api/v1/wallet/add-funds', [
            'amount' => 500,
            'user_id' => $user->id
        ]);
        $response->assertStatus(200);

        // Assert balance
        $walletService = app(WalletService::class);
        $this->assertEquals(500, $walletService->getBalance($user));

        // Assert transaction record has source and created_by
        $txn = DB::table('wallet_transactions')->where('type', 'credit')->first();
        $this->assertEquals('ADMIN_ADJUSTMENT', $txn->source);
        $this->assertEquals($admin->id, $txn->created_by);
    }

    public function test_unlock_atomicity_and_invariants()
    {
        $vendor = User::factory()->create();
        $vendor->roles()->attach(Role::where('slug', 'business')->first());
        
        // Give vendor 1000 funds
        app(WalletService::class)->addFunds($vendor, 1000, 'Init', ['source' => 'ADMIN_ADJUSTMENT']);

        $customer = User::factory()->create();
        $project = Project::create([
            'user_id' => $customer->id,
            'title' => 'Atomicity Test',
            'unlock_price' => 200,
            'status' => 'open'
        ]);

        // Attempt 1: First unlock
        $response1 = $this->actingAs($vendor)->postJson("/api/v1/requirements/{$project->id}/unlock");
        $response1->assertStatus(200);
        $this->assertEquals(800, app(WalletService::class)->getBalance($vendor));

        // Attempt 2: Duplicate unlock
        $response2 = $this->actingAs($vendor)->postJson("/api/v1/requirements/{$project->id}/unlock");
        // API should return success but message "Contact already unlocked" and NO DEDUCTION
        $response2->assertStatus(200);
        $this->assertEquals('Contact already unlocked', $response2->json('message'));
        $this->assertEquals(800, app(WalletService::class)->getBalance($vendor));

        // Assert only one charge in transactions
        $debits = DB::table('wallet_transactions')->where('type', 'debit')->where('wallet_id', DB::table('wallets')->where('user_id', $vendor->id)->value('id'))->count();
        $this->assertEquals(1, $debits);
        
        $debitTxn = DB::table('wallet_transactions')->where('type', 'debit')->first();
        $this->assertEquals('CONTACT_UNLOCK', $debitTxn->source);
    }

    public function test_payment_replay_integrity()
    {
        $user = User::factory()->create();
        
        $plan = SubscriptionPlan::create([
            'name' => 'Test Plan',
            'slug' => 'test-plan',
            'price_monthly' => 1000,
            'price_yearly' => 10000,
            'is_featured_listing' => true,
        ]);

        $payment = Payment::create([
            'user_id' => $user->id,
            'razorpay_order_id' => 'order_test_123',
            'amount' => 1000,
            'currency' => 'INR',
            'purpose' => 'wallet_recharge',
            'status' => 'pending',
            'meta' => [],
        ]);

        // First verification (valid)
        // Mock config for local
        config(['app.env' => 'local']);

        $response1 = $this->actingAs($user)->postJson('/api/v1/payments/verify', [
            'razorpay_order_id' => 'order_test_123',
            'razorpay_payment_id' => 'pay_test_123',
            'razorpay_signature' => 'mock_signature'
        ]);

        $response1->assertStatus(200);
        $this->assertEquals(1000, app(WalletService::class)->getBalance($user));

        // Second verification (Replay)
        $response2 = $this->actingAs($user)->postJson('/api/v1/payments/verify', [
            'razorpay_order_id' => 'order_test_123',
            'razorpay_payment_id' => 'pay_test_123',
            'razorpay_signature' => 'mock_signature'
        ]);

        // Should return 200 but say "already fulfilled" and NOT credit wallet again
        $response2->assertStatus(200);
        $this->assertEquals('Payment already fulfilled.', $response2->json('message'));
        $this->assertEquals(1000, app(WalletService::class)->getBalance($user));
    }

    public function test_financial_reconciliation()
    {
        $user = User::factory()->create();

        $walletService = app(WalletService::class);
        $walletService->addFunds($user, 1000, 'Init', ['source' => 'ADMIN_ADJUSTMENT']);
        $walletService->addFunds($user, 500, 'Bonus', ['source' => 'RAZORPAY']);
        $walletService->deduct($user, 200, 'Unlock A');
        $walletService->deduct($user, 200, 'Unlock B');
        
        try {
            $walletService->deduct($user, 1500, 'Unlock C'); // Should fail
        } catch (\Exception $e) {
            // Expected
        }

        $wallet = DB::table('wallets')->where('user_id', $user->id)->first();
        
        $credits = DB::table('wallet_transactions')
            ->where('wallet_id', $wallet->id)
            ->where('type', 'credit')
            ->sum('amount');
            
        $debits = DB::table('wallet_transactions')
            ->where('wallet_id', $wallet->id)
            ->where('type', 'debit')
            ->sum('amount');

        // Reconciliation
        $expectedBalance = $credits - $debits;
        
        $this->assertEquals(1100, $wallet->balance);
        $this->assertEquals(1100, $expectedBalance);
    }
}
