<?php

namespace App\Services;

use App\Models\User;
use App\Models\Requirement;
use App\Services\WalletService;
use Illuminate\Support\Facades\DB;
use App\Notifications\LeadUnlockedNotification;
use Exception;

class UnlockService
{
    private WalletService $walletService;

    public function __construct(WalletService $walletService)
    {
        $this->walletService = $walletService;
    }

    /**
     * Unlock a customer's contact for a specific requirement using the wallet.
     */
    public function unlockContact(User $vendor, Requirement $requirement): array
    {
        // 1. Check if already unlocked
        $existing = DB::table('contact_unlocks')
            ->where('user_id', $vendor->id)
            ->where('requirement_id', $requirement->id)
            ->first();
            
        if ($existing) {
            return [
                'success' => true,
                'message' => 'Contact already unlocked',
                'contact' => [
                    'name' => $requirement->name ?? $requirement->user->name ?? 'Customer',
                    'phone' => $requirement->phone ?? $requirement->user->phone ?? null,
                    'email' => $requirement->email ?? $requirement->user->email ?? null,
                ]
            ];
        }

        // 2. Fetch the fee from configuration (Placeholder: using static 49 for now, ideally config('marketplace.unlock_fee', 49))
        $fee = config('marketplace.unlock_fee', 49.00);

        return DB::transaction(function () use ($vendor, $requirement, $fee) {
            // 3. Deduct from wallet
            $this->walletService->deduct(
                $vendor,
                $fee,
                "Unlocked contact for requirement ID: {$requirement->id}",
                [
                    'reference_type' => 'App\\Models\\Requirement',
                    'reference_id' => $requirement->id
                ]
            );

            // 4. Create unlock record
            DB::table('contact_unlocks')->insert([
                'user_id' => $vendor->id,
                'requirement_id' => $requirement->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            // Log Timeline
            DB::table('activity_timelines')->insert([
                'entity_type' => 'App\\Models\\Requirement',
                'entity_id' => $requirement->id,
                'user_id' => $vendor->id,
                'action' => 'contact_unlocked',
                'description' => "A vendor unlocked the customer's contact.",
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $vendor->notify(new LeadUnlockedNotification([
                'title' => $requirement->title,
                'phone' => $requirement->phone ?? $requirement->user->phone ?? 'Not Available',
            ]));

            return [
                'success' => true,
                'message' => 'Contact unlocked successfully',
                'contact' => [
                    'name' => $requirement->name ?? $requirement->user->name ?? 'Customer',
                    'phone' => $requirement->phone ?? $requirement->user->phone ?? null,
                    'email' => $requirement->email ?? $requirement->user->email ?? null,
                ]
            ];
        });
    }
}
