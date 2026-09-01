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
    public function unlockContact(User $vendor, $requirement): array
    {
        $requirementType = $requirement->getMorphClass();

        // 2. Fetch the fee from requirement or configuration (defaults to Setting contact_unlock_fee or ₹49)
        $globalFee = (float) (\App\Models\Setting::where('key', 'contact_unlock_fee')->value('value') 
            ?? \App\Models\Setting::where('key', 'lead_price')->value('value') 
            ?? config('marketplace.unlock_fee', 49.00));
        $fee = (float) ($requirement->unlock_price ?? $globalFee);

        // Only the actual owner of the listing/requirement gets their own contact for free
        if ($vendor->id === ($requirement->user_id ?? null)) {
            $fee = 0;
        }

        // Skilled workers and laborers get unlocks for free
        if ($vendor->hasRole('worker') || $vendor->hasRole('skilled_worker')) {
            $fee = 0;
        }

        return DB::transaction(function () use ($vendor, $requirement, $requirementType, $fee) {
            // Lock the requirement to serialize concurrent unlock attempts for the same resource
            $lockedReq = DB::table($requirement->getTable())->where('id', $requirement->id)->lockForUpdate()->first();
            if (!$lockedReq) {
                throw new Exception('Requirement not found or unavailable.');
            }

            // 1. Check if already unlocked (Atomically, within lock)
            $existing = DB::table('contact_unlocks')
                ->where('user_id', $vendor->id)
                ->where('requirement_id', $requirement->id)
                ->where('requirement_type', $requirementType)
                ->first();
                
            if ($existing) {
                return [
                    'success' => true,
                    'message' => 'Contact already unlocked',
                    'contact' => [
                        'name' => $requirement->user->name ?? $requirement->name ?? 'Customer',
                        'phone' => $requirement->user->phone ?? $requirement->phone ?? null,
                        'email' => $requirement->user->email ?? $requirement->email ?? null,
                    ]
                ];
            }

            // 1.5 Check max unlocks
            $unlocksCount = DB::table('contact_unlocks')
                ->where('requirement_id', $requirement->id)
                ->where('requirement_type', $requirementType)
                ->count();
                
            if ($unlocksCount >= ($requirement->max_unlocks ?? 10)) {
                throw new Exception('This requirement has reached its maximum number of contact unlocks.');
            }

            // 3. Deduct from wallet if fee is greater than 0
            if ($fee > 0) {
                $this->walletService->deduct(
                    $vendor,
                    $fee,
                    "Unlocked contact for requirement ID: {$requirement->id}",
                    [
                        'source' => 'CONTACT_UNLOCK',
                        'reference_type' => $requirementType,
                        'reference_id' => $requirement->id,
                        'status' => 'success'
                    ]
                );
            }

            // 4. Create unlock record
            DB::table('contact_unlocks')->insert([
                'user_id' => $vendor->id,
                'requirement_id' => $requirement->id,
                'requirement_type' => $requirementType,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            // Log Timeline
            DB::table('activity_timelines')->insert([
                'entity_type' => $requirementType,
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

            // Notify Customer that their contact was unlocked
            if ($requirement->user) {
                $vendorName = $vendor->name ?? 'A professional';
                $requirement->user->notify(new \App\Notifications\MarketplaceNotification(
                    'contact_unlocked',
                    "{$vendorName} has unlocked your contact details for '{$requirement->title}'. Expect a call soon!",
                    ['requirement_id' => $requirement->id, 'vendor_id' => $vendor->id]
                ));
            }

            return [
                'success' => true,
                'message' => 'Contact unlocked successfully',
                'wallet_balance' => $this->walletService->getBalance($vendor),
                'contact' => [
                    'name' => $requirement->user->name ?? $requirement->name ?? 'Customer',
                    'phone' => $requirement->user->phone ?? $requirement->phone ?? null,
                    'email' => $requirement->user->email ?? $requirement->email ?? null,
                ]
            ];
        }, 3);
    }
}
