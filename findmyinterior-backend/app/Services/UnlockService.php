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
    public static function getUnlockFee($requirement = null, ?User $vendor = null): float
    {
        $baseFee = (float) config('marketplace.unlock_fee', 49.00);
        if ($requirement && $requirement->unlock_price !== null && is_numeric($requirement->unlock_price)) {
            $baseFee = (float) $requirement->unlock_price;
        } else {
            $settingVal = \App\Models\Setting::where('key', 'contact_unlock_fee')->value('value');
            if ($settingVal !== null && is_numeric($settingVal)) {
                $baseFee = (float) $settingVal;
            }
        }

        if ($vendor && $vendor->activeSubscription && $vendor->activeSubscription->plan) {
            $discount = (int) ($vendor->activeSubscription->plan->unlock_discount_percent ?? 0);
            if ($discount > 0 && $discount <= 100) {
                $baseFee = round($baseFee * (1 - ($discount / 100)), 2);
            }
        }

        return max(0, $baseFee);
    }

    public function unlockContact(User $vendor, $requirement): array
    {
        $requirementType = $requirement->getMorphClass();
        
        // 1. Check if already unlocked
        $existing = ContactUnlock::where('user_id', $vendor->id)
            ->where('requirement_id', $requirement->id)
            ->where('requirement_type', $requirementType)
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

        // 2. Fetch the fee consistently from requirement, setting, or config
        $fee = self::getUnlockFee($requirement, $vendor);

        // Workers and Skilled Workers can unlock any requirement for free
        if ($vendor->hasRole('worker') || $vendor->hasRole('skilled_worker')) {
            $fee = 0;
        }

        return DB::transaction(function () use ($vendor, $requirement, $requirementType, $fee) {
            // 3. Deduct from wallet if fee is greater than 0
            if ($fee > 0) {
                $this->walletService->deduct(
                    $vendor,
                    $fee,
                    "Unlocked contact for requirement ID: {$requirement->id}",
                    [
                        'reference_type' => $requirementType,
                        'reference_id' => $requirement->id
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
                'contact' => [
                    'name' => $requirement->name ?? $requirement->user->name ?? 'Customer',
                    'phone' => $requirement->phone ?? $requirement->user->phone ?? null,
                    'email' => $requirement->email ?? $requirement->user->email ?? null,
                ]
            ];
        });
    }
}
