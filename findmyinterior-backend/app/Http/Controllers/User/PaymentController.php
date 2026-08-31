<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Http\Resources\UserSubscriptionResource;
use App\Models\ContactUnlock;
use App\Models\Payment;
use App\Models\Requirement;
use App\Models\SubscriptionPlan;
use App\Models\UserSubscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Razorpay\Api\Api as RazorpayApi;

class PaymentController extends Controller
{
    /**
     * POST /api/v1/payments/create-order
     * Creates a Razorpay order and returns order_id to the frontend.
     */
    public function createOrder(Request $request): JsonResponse
    {
        $data = $request->validate([
            'purpose'               => ['required', 'in:subscription,lead_unlock,wallet_recharge'],
            'subscription_plan_id'  => ['required_if:purpose,subscription', 'exists:subscription_plans,id'],
            'billing_cycle'         => ['nullable', 'string'],
            'requirement_id'        => ['required_if:purpose,lead_unlock', 'exists:projects,id'],
            'amount'                => ['required_if:purpose,wallet_recharge', 'numeric', 'min:1'],
        ]);

        $user = $request->user();

        if ($data['purpose'] === 'subscription') {
            $plan = SubscriptionPlan::findOrFail($data['subscription_plan_id']);
            $amount = (float) ($plan->price_yearly > 0 ? $plan->price_yearly : $plan->price_monthly);
            $data['billing_cycle'] = $data['billing_cycle'] ?? 'yearly';
        } else if ($data['purpose'] === 'wallet_recharge') {
            $amount = $data['amount'];
        } else {
            // lead_unlock: flat ₹49 per contact
            $amount = 49.00;
        }

        if (empty(config('services.razorpay.key')) || config('app.env') === 'local') {
            // Mock response for local environment testing when keys are missing or invalid
            $razorpayOrder = ['id' => 'order_mock_' . time()];
        } else {
            $api  = new RazorpayApi(config('services.razorpay.key'), config('services.razorpay.secret'));
            // Razorpay expects paise (INR * 100)
            try {
                $razorpayOrder = $api->order->create([
                    'amount'          => (int) ($amount * 100),
                    'currency'        => 'INR',
                    'receipt'         => 'fmi_' . $user->id . '_' . time(),
                    'payment_capture' => 1,
                ]);
            } catch (\Exception $e) {
                Log::error("Razorpay order creation failed: " . $e->getMessage());
                return response()->json([
                    'success' => false,
                    'message' => 'Payment Gateway Error: ' . $e->getMessage(),
                ], 422);
            }
        }

        // Pre-create payment record in pending state
        $payment = Payment::create([
            'user_id'          => $user->id,
            'razorpay_order_id' => $razorpayOrder['id'],
            'amount'           => $amount,
            'currency'         => 'INR',
            'purpose'          => $data['purpose'],
            'status'           => 'pending',
            'meta'             => $data,
        ]);

        return response()->json([
            'success'    => true,
            'order_id'   => $razorpayOrder['id'],
            'amount'     => (int) ($amount * 100),
            'currency'   => 'INR',
            'payment_id' => $payment->id,
            'key'        => config('services.razorpay.key') ?: env('NEXT_PUBLIC_RAZORPAY_KEY_ID'),
        ]);
    }

    /**
     * POST /api/v1/payments/pay-with-wallet
     * Pays for a subscription directly using the user's wallet balance.
     */
    public function payWithWallet(Request $request): JsonResponse
    {
        $data = $request->validate([
            'purpose'               => ['required', 'in:subscription'],
            'subscription_plan_id'  => ['required_if:purpose,subscription', 'exists:subscription_plans,id'],
            'billing_cycle'         => ['nullable', 'string'],
        ]);

        $user = $request->user();

        if ($data['purpose'] === 'subscription') {
            $plan = SubscriptionPlan::findOrFail($data['subscription_plan_id']);
            $amount = (float) ($plan->price_yearly > 0 ? $plan->price_yearly : $plan->price_monthly);
            $data['billing_cycle'] = $data['billing_cycle'] ?? 'yearly';
        } else {
            return response()->json(['success' => false, 'message' => 'Invalid purpose for wallet payment.'], 400);
        }

        $walletService = app(\App\Services\WalletService::class);
        $balance = $walletService->getBalance($user);

        if ($balance < $amount) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient wallet balance. You need ₹' . $amount . ' but you have ₹' . $balance,
                'required' => $amount,
                'balance' => $balance
            ], 422);
        }

        DB::beginTransaction();
        try {
            // 1. Deduct from wallet
            $walletService->deduct($user, $amount, "Subscription Upgrade: {$plan->name}");

            // 2. Create a mock payment record for tracking
            $payment = Payment::create([
                'user_id'          => $user->id,
                'razorpay_order_id'=> 'wallet_sub_' . uniqid(),
                'amount'           => $amount,
                'currency'         => 'INR',
                'purpose'          => 'subscription',
                'status'           => 'success',
                'meta'             => $data,
            ]);

            // 3. Fulfill
            $this->fulfillPayment($payment);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Successfully subscribed to {$plan->name}!",
                'data'    => new PaymentResource($payment->fresh()),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Wallet subscription payment failed: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to process subscription from wallet: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * POST /api/v1/payments/verify
     * Verifies Razorpay payment signature and fulfills the order.
     */
    public function verify(Request $request): JsonResponse
    {
        $data = $request->validate([
            'razorpay_order_id'   => ['required', 'string'],
            'razorpay_payment_id' => ['required', 'string'],
            'razorpay_signature'  => ['required', 'string'],
        ]);

        if (str_starts_with($data['razorpay_order_id'], 'order_mock_')) {
            // Local dev signature bypass
            if ($data['razorpay_signature'] !== 'mock_sig') {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment verification failed (mock).',
                ], 422);
            }
        } else {
            $api = new RazorpayApi(config('services.razorpay.key'), config('services.razorpay.secret'));

            try {
                $api->utility->verifyPaymentSignature([
                    'razorpay_order_id'   => $data['razorpay_order_id'],
                    'razorpay_payment_id' => $data['razorpay_payment_id'],
                    'razorpay_signature'  => $data['razorpay_signature'],
                ]);
            } catch (\Exception $e) {
                Log::error("Payment verification failed for order {$data['razorpay_order_id']}: " . $e->getMessage());
                return response()->json([
                    'success' => false,
                    'message' => 'Payment verification failed. If money was deducted, contact support.',
                ], 422);
            }
        }

        return DB::transaction(function () use ($data) {
            $payment = Payment::where('razorpay_order_id', $data['razorpay_order_id'])->lockForUpdate()->firstOrFail();

            if ($payment->status === 'success') {
                return response()->json([
                    'success' => true,
                    'message' => 'Payment already fulfilled.',
                    'data'    => new PaymentResource($payment),
                ]);
            }

            $payment->update([
                'razorpay_payment_id' => $data['razorpay_payment_id'],
                'razorpay_signature'  => $data['razorpay_signature'],
                'status'              => 'success',
            ]);

            $this->fulfillPayment($payment);

            Log::info("Payment fulfilled successfully for order {$data['razorpay_order_id']}");

            return response()->json([
                'success' => true,
                'message' => 'Payment successful!',
                'data'    => new PaymentResource($payment->fresh()),
            ]);
        }, 3);
    }

    /**
     * Backward-compatible alias for verify()
     */
    public function verifyPayment(Request $request): JsonResponse
    {
        return $this->verify($request);
    }

    /**
     * Fulfill the payment based on its purpose.
     */
    private function fulfillPayment(Payment $payment): void
    {
        $meta = $payment->meta;

        if ($payment->purpose === 'subscription') {
            $plan  = SubscriptionPlan::findOrFail($meta['subscription_plan_id']);
            $cycle = $meta['billing_cycle'] ?? 'yearly';

            // Expire any existing active subscription
            UserSubscription::where('user_id', $payment->user_id)
                ->where('status', 'active')
                ->update(['status' => 'cancelled']);

            $expiresAt = now()->addYear();
            if (str_contains($plan->slug, 'starter') || $plan->price_yearly == 0) {
                $expiresAt = now()->addYears(10);
            } elseif (str_contains($plan->slug, 'quickstart')) {
                $expiresAt = now()->addMonths(3);
            } elseif (str_contains($plan->slug, 'growthplus')) {
                $expiresAt = now()->addMonths(6);
            } elseif ($cycle === 'monthly') {
                $expiresAt = now()->addMonth();
            }

            UserSubscription::create([
                'user_id'              => $payment->user_id,
                'subscription_plan_id' => $plan->id,
                'payment_id'           => $payment->id,
                'billing_cycle'        => $cycle,
                'status'               => 'active',
                'starts_at'            => now(),
                'expires_at'           => $expiresAt,
            ]);

            // Sync is_premium flag and verification badges to the entity
            $user = $payment->user;
            
            $updateData = [
                'is_premium' => true,
            ];
            
            // Sync is_featured and is_gold_verified based on plan benefits
            if ($plan->is_featured_listing || $plan->slug === 'elitebusiness') {
                $updateData['is_featured'] = true;
            }
            if ($plan->price_yearly > 0 || $plan->price_monthly > 0) {
                $updateData['is_verified'] = true;
                $updateData['is_gold_verified'] = true;
                $updateData['verification_level'] = 'verified_business';
            }

            if ($user->hasRole('builder') && $user->builder) {
                $user->builder->update($updateData);
            } elseif ($user->hasRole('supplier') && $user->supplier) {
                $user->supplier->update($updateData);
            } elseif ($user->hasRole('worker') && $user->worker) {
                $user->worker->update($updateData);
            }
            
            // Also update all user listings
            \App\Models\Listing::where('user_id', $user->id)->update([
                'is_premium'  => true,
                'is_verified' => true,
                'is_featured' => ($plan->is_featured_listing || $plan->slug === 'elitebusiness'),
            ]);

            // Create official in-app welcome conversation & message from FindMyInterior Concierge
            try {
                // Find or pick an admin user as sender
                $adminUser = \App\Models\User::where('role', 'admin')->first() ?: $user;
                
                $conversation = \App\Models\Conversation::firstOrCreate([
                    'customer_id' => $adminUser->id,
                    'vendor_id'   => $user->id,
                ], [
                    'status'        => 'active',
                    'project_stage' => 'lead',
                    'last_message_at' => now(),
                ]);

                \App\Models\Message::create([
                    'conversation_id' => $conversation->id,
                    'sender_id'       => $adminUser->id,
                    'message'         => "🎉 Welcome to FindMyInterior {$plan->name}!\n\nThank you for choosing FindMyInterior to scale your business. Your {$plan->name} membership is now active, unlocking:\n• " . implode("\n• ", $plan->features ?? ['Elite Verified Badge', 'Priority Lead Access', 'Increased Portfolio Limits']) . "\n\nWe are here to support your growth. Reach out to our dedicated concierge team anytime!",
                ]);
            } catch (\Exception $e) {
                Log::warning("Could not create subscription welcome message: " . $e->getMessage());
            }

            // Send in-app notification
            $user->notify(new \App\Notifications\SystemNotification(
                "🎉 Congratulations! Your {$plan->name} subscription is active. Enjoy your Elite badge & early lead access.",
                'subscription_success',
                'high'
            ));
        } elseif ($payment->purpose === 'lead_unlock') {
            ContactUnlock::firstOrCreate([
                'user_id'        => $payment->user_id,
                'requirement_id' => $meta['requirement_id'],
            ], [
                'payment_id' => $payment->id,
            ]);
        } elseif ($payment->purpose === 'wallet_recharge') {
            app(\App\Services\WalletService::class)->addFunds(
                $payment->user,
                $payment->amount,
                "Wallet Recharge (Order: {$payment->razorpay_order_id})",
                [
                    'source' => 'RAZORPAY',
                    'reference_type' => 'App\Models\Payment',
                    'reference_id' => $payment->id,
                    'status' => 'success',
                ]
            );
        }
    }

    /**
     * GET /api/v1/payments/history
     */
    public function history(Request $request): JsonResponse
    {
        $payments = Payment::where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'data'    => PaymentResource::collection($payments),
            'meta'    => ['total' => $payments->total(), 'last_page' => $payments->lastPage()],
        ]);
    }

    /**
     * GET /api/v1/subscriptions/plans
     */
    public function plans(): JsonResponse
    {
        $plans = SubscriptionPlan::active()->get();

        return response()->json([
            'success' => true,
            'data'    => \App\Http\Resources\SubscriptionPlanResource::collection($plans),
        ]);
    }
}
