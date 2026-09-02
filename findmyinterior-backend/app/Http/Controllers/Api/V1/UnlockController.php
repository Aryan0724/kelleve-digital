<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Requirement;
use App\Services\UnlockService;
use App\Services\EntitlementService;

class UnlockController extends Controller
{
    private UnlockService $unlockService;
    private EntitlementService $entitlementService;

    public function __construct(UnlockService $unlockService, EntitlementService $entitlementService)
    {
        $this->unlockService = $unlockService;
        $this->entitlementService = $entitlementService;
    }
    
    private function applyDiscount($user, $amount) {
        $discountPercent = $this->entitlementService->getLimit($user, 'contact_unlock_discount_percent');
        if ($discountPercent > 0) {
            $amount = $amount * (1 - ($discountPercent / 100));
        }
        return $amount;
    }

    /**
     * Unlock a requirement's contact
     */
    public function unlockContact(Request $request, int $requirementId): JsonResponse
    {
        $type = $request->query('requirement_type', 'project');
        $modelClass = \App\Models\Requirement::class;
        if ($type === 'rfq') $modelClass = \App\Models\Rfq::class;
        if ($type === 'job' || $type === 'worker_job') $modelClass = \App\Models\WorkerJob::class;
        
        $requirement = $modelClass::with('user')->findOrFail($requirementId);
        
        // Owner doesn't need to pay to view their own requirement contact details
        if ($request->user()->id === $requirement->user_id) {
            return response()->json([
                'success' => true,
                'message' => 'You are the owner of this requirement.',
                'contact' => [
                    'name'  => $requirement->user->name ?? $requirement->name ?? 'You',
                    'phone' => $requirement->user->phone ?? $requirement->phone ?? null,
                    'email' => $requirement->user->email ?? $requirement->email ?? null,
                ]
            ]);
        }
        
        try {
            $result = $this->unlockService->unlockContact($request->user(), $requirement);
            return response()->json($result);
        } catch (\Exception $e) {
            $msg = $e->getMessage();
            $isBalance = str_contains(strtolower($msg), 'insufficient') || str_contains(strtolower($msg), 'balance');
            
            // If the error is about funds, trigger a direct Razorpay payment flow instead of wallet recharge
            if ($isBalance) {
                return response()->json([
                    'success'           => false,
                    'message'           => 'Payment required to unlock this contact.',
                    'code'              => 'PAYMENT_REQUIRED',
                    'requires_payment'  => true,
                    'purpose'           => 'lead_unlock',
                    'requirement_id'    => $requirementId,
                    'requirement_type'  => $type,
                    'amount'            => $this->applyDiscount($request->user(), (float) ($requirement->unlock_price ?? config('marketplace.unlock_fee', 49.00))),
                ], 402);
            }
            
            return response()->json([
                'success' => false,
                'message' => $msg,
                'code'    => 'ERROR'
            ], 400);
        }
    }

    /**
     * Unlock a listing's contact (professional's contact)
     */
    public function unlockListing(Request $request, int $listingId): JsonResponse
    {
        $listing = \App\Models\Listing::with('user')->findOrFail($listingId);
        
        // Owner doesn't need to pay to view their own listing contact details
        if ($request->user()->id === $listing->user_id) {
            return response()->json([
                'success' => true,
                'message' => 'You are the owner of this listing.',
                'contact' => [
                    'name'  => $listing->user->name ?? $listing->title ?? 'You',
                    'phone' => $listing->phone ?? $listing->user->phone ?? null,
                    'email' => $listing->email ?? $listing->user->email ?? null,
                ]
            ]);
        }
        
        if (!isset($listing->unlock_price)) {
            $listing->unlock_price = 49.00;
        }

        try {
            $result = $this->unlockService->unlockContact($request->user(), $listing);
            return response()->json($result);
        } catch (\Exception $e) {
            $msg = $e->getMessage();
            $isBalance = str_contains(strtolower($msg), 'insufficient') || str_contains(strtolower($msg), 'balance');
            
            // Trigger direct Razorpay payment flow
            if ($isBalance) {
                return response()->json([
                    'success'           => false,
                    'message'           => 'Payment required to unlock this contact.',
                    'code'              => 'PAYMENT_REQUIRED',
                    'requires_payment'  => true,
                    'purpose'           => 'lead_unlock',
                    'requirement_id'    => $listingId,
                    'requirement_type'  => 'listing',
                    'amount'            => $this->applyDiscount($request->user(), 49.00),
                ], 402);
            }
            
            return response()->json([
                'success' => false,
                'message' => $msg,
                'code'    => 'ERROR'
            ], 400);
        }
    }
}
