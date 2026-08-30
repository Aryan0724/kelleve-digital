<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Requirement;
use App\Services\UnlockService;

class UnlockController extends Controller
{
    private UnlockService $unlockService;

    public function __construct(UnlockService $unlockService)
    {
        $this->unlockService = $unlockService;
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
            return response()->json([
                'success'        => false,
                'message'        => $isBalance ? 'Insufficient wallet balance. Please recharge your wallet to unlock this contact.' : $msg,
                'code'           => $isBalance ? 'INSUFFICIENT_BALANCE' : 'ERROR',
                'needs_recharge' => $isBalance,
                'required_amount'=> (float) ($requirement->unlock_price ?? config('marketplace.unlock_fee', 49.00)),
            ], $isBalance ? 402 : 400);
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
            return response()->json([
                'success'        => false,
                'message'        => $isBalance ? 'Insufficient wallet balance. Please recharge your wallet to unlock this contact.' : $msg,
                'code'           => $isBalance ? 'INSUFFICIENT_BALANCE' : 'ERROR',
                'needs_recharge' => $isBalance,
                'required_amount'=> 49.00,
            ], $isBalance ? 402 : 400);
        }
    }
}
