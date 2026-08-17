<?php

namespace App\Modules\Truedial\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PrivilegeCard;
use Illuminate\Support\Facades\Log;

class CheckoutController extends Controller
{
    use \App\Traits\ApiResponse;

    /**
     * Initiate a checkout session for TrueDial Privilege Card
     * POST /api/v1/truedial/checkout/initiate
     */
    public function initiate(Request $request)
    {
        $user = auth()->user();
        
        $request->validate([
            'card_type' => 'required|in:city,multi-city',
            'amount' => 'required|numeric|min:1'
        ]);

        // In a real application, you would initialize Razorpay/Stripe here.
        // e.g. $order = $api->order->create(['amount' => $request->amount * 100, ...]);
        
        $transactionId = 'txn_mock_' . uniqid();

        return $this->success([
            'transaction_id' => $transactionId,
            'amount' => $request->amount,
            'currency' => 'INR',
            'card_type' => $request->card_type,
            'gateway_key' => config('services.razorpay.key', 'mock_key')
        ], 'Checkout initiated successfully');
    }

    /**
     * Verify payment signature and upgrade card
     * POST /api/v1/truedial/checkout/verify
     */
    public function verify(Request $request)
    {
        $user = auth()->user();
        
        $request->validate([
            'transaction_id' => 'required|string',
            'card_type' => 'required|in:city,multi-city',
            'status' => 'required|string'
        ]);

        // In a real scenario, you would verify the signature from Razorpay.
        // Here we just accept a success status.
        if ($request->status !== 'success') {
            return $this->error('Payment verification failed', 400);
        }

        // Find or create the user's privilege card
        $card = PrivilegeCard::firstOrNew(['user_id' => $user->id]);
        
        // Setup card if it's new
        if (!$card->exists) {
            $card->card_number = 'TD-' . strtoupper($request->card_type) . '-' . mt_rand(100000, 999999);
            $card->is_active = true;
            $card->issued_at = now();
        }
        
        // Upgrade the card
        $card->card_type = $request->card_type;
        // Extend validity by 1 year from now
        $card->valid_until = now()->addYear();
        $card->save();

        Log::info("User {$user->id} upgraded to {$request->card_type} card via txn {$request->transaction_id}");

        return $this->success($card, 'Payment verified and card upgraded successfully');
    }
}
