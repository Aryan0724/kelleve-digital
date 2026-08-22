<?php

namespace Tests\Feature\Security;

use Illuminate\Foundation\Testing\DatabaseTruncation;
use Tests\Feature\Security\SecurityTestCase;
use App\Models\User;
use App\Models\Role;
use App\Models\Requirement;
use App\Models\ProjectQuote;
use App\Services\WalletService;
use App\Services\UnlockService;
use App\Services\ProjectQuoteService;
use Illuminate\Support\Facades\DB;

/**
 * Phase 3: Financial Integrity Sweep
 * Verifies that wallet deductions are accurate, idempotency holds, and state machines are enforced.
 */
class FinancialIntegrityTest extends SecurityTestCase
{
    use DatabaseTruncation;
    protected $seeder = \Database\Seeders\SecurityTestSeeder::class;

    private function makeUser(string $roleSlug = 'homeowner'): User
    {
        $user = User::factory()->create();
        $role = Role::where('slug', $roleSlug)->first();
        if ($role) {
            $user->roles()->syncWithoutDetaching([$role->id]);
            $user->update(['primary_role_id' => $role->id]);
        }
        return $user;
    }

    public function test_cannot_deduct_more_than_wallet_balance()
    {
        $user = $this->makeUser('homeowner');
        $walletService = app(WalletService::class);
        
        $walletService->addFunds($user, 100, 'Initial Add');
        
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Insufficient wallet balance.');
        
        $walletService->deduct($user, 150, 'Overdraw attempt');
    }

    public function test_unlocking_contact_twice_only_charges_once()
    {
        // Vendor unlocking homeowner project
        $customer = $this->makeUser('homeowner');
        $vendor = $this->makeUser('interior_designer');
        
        $project = Requirement::factory()->create([
            'user_id' => $customer->id,
            'status' => 'open'
        ]);

        $walletService = app(WalletService::class);
        $walletService->addFunds($vendor, 500, 'Initial Add'); // Should have 500

        $unlockService = app(UnlockService::class);
        
        // First unlock (should deduct 49 by default)
        $result1 = $unlockService->unlockContact($vendor, $project);
        $this->assertTrue($result1['success']);
        
        $balanceAfterFirst = $walletService->getBalance($vendor);
        $this->assertEquals(451, $balanceAfterFirst, 'Balance should decrease by 49');
        
        // Second unlock attempt (should not deduct)
        $result2 = $unlockService->unlockContact($vendor, $project);
        $this->assertTrue($result2['success']);
        $this->assertEquals('Contact already unlocked', $result2['message']);
        
        $balanceAfterSecond = $walletService->getBalance($vendor);
        $this->assertEquals(451, $balanceAfterSecond, 'Balance should NOT decrease on double unlock');
    }

    public function test_cannot_award_quote_if_project_is_not_open()
    {
        $customer = $this->makeUser('homeowner');
        $vendor = $this->makeUser('interior_designer');
        
        $project = Requirement::factory()->create([
            'user_id' => $customer->id,
            'status' => 'awarded' // Already awarded!
        ]);

        $quote = ProjectQuote::create([
            'requirement_id' => $project->id,
            'professional_id' => $vendor->id,
            'amount' => 10000,
            'timeline_days' => 10,
            'proposal_message' => 'Test proposal',
            'status' => 'pending'
        ]);

        $quoteService = app(ProjectQuoteService::class);

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Cannot accept quote. Project is already awarded.');

        $quoteService->acceptQuote($project, $quote);
    }
}
