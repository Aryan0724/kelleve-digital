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
    private \App\Services\EntitlementService $entitlementService;

    public function __construct(\App\Services\EntitlementService $entitlementService)
    {
        $this->entitlementService = $entitlementService;
    }

    /**
     * Unlock a customer's contact for a specific requirement.
     */
    public function unlockContact(User $vendor, $requirement): array
    {
        $requirementType = $requirement->getMorphClass();

        // 2. Fetch the fee from requirement or configuration (defaults to Setting contact_unlock_fee or ₹49)
        $globalFee = (float) (\App\Models\Setting::where('key', 'contact_unlock_fee')->value('value') 
            ?? \App\Models\Setting::where('key', 'lead_price')->value('value') 
            ?? config('marketplace.unlock_fee', 49.00));
        $fee = (float) ($requirement->unlock_price ?? $globalFee);

        // Apply subscription discount
        $discountPercent = $this->entitlementService->getLimit($vendor, 'contact_unlock_discount_percent');
        if ($discountPercent > 0) {
            $fee = $fee * (1 - ($discountPercent / 100));
        }

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

            // 3. Check Subscription Quota
            $quotaLimit = $this->entitlementService->getLimit($vendor, 'lead_unlocks_per_month');
            $usedThisMonth = DB::table('contact_unlocks')
                ->where('user_id', $vendor->id)
                ->where('created_at', '>=', now()->startOfMonth())
                ->where('unlock_reason', 'included_quota')
                ->count();

            $reason = 'paid';
            if ($fee == 0) {
                $reason = 'free_role';
            } elseif ($usedThisMonth < $quotaLimit) {
                $reason = 'included_quota';
                $fee = 0; // consumed from quota
            }

            // If not free and no quota left, return a requires_payment flag so frontend initiates Razorpay
            if ($fee > 0) {
                throw new \App\Exceptions\PaymentRequiredException("Insufficient quota. Please pay ₹{$fee} to unlock this contact.", $fee);
            }

            // 4. Create unlock record
            DB::table('contact_unlocks')->insert([
                'user_id' => $vendor->id,
                'requirement_id' => $requirement->id,
                'requirement_type' => $requirementType,
                'unlock_reason' => $reason,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            
            // Log Timeline
            DB::table('activity_timelines')->insert([
                'entity_type' => $requirementType,
                'entity_id' => $requirement->id,
                'user_id' => $vendor->id,
                'action' => 'contact_unlocked',
                'description' => "A vendor unlocked the customer's contact via {$reason}.",
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
                'unlock_reason' => $reason,
                'contact' => [
                    'name' => $requirement->user->name ?? $requirement->name ?? 'Customer',
                    'phone' => $requirement->user->phone ?? $requirement->phone ?? null,
                    'email' => $requirement->user->email ?? $requirement->email ?? null,
                ]
            ];
        }, 3);
    }
}
