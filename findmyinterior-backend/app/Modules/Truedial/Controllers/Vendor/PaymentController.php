<?php

namespace App\Modules\Truedial\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\SubscriptionPlan;
use App\Models\UserSubscription;
use App\Models\Listing;
use Illuminate\Http\Request;
use Razorpay\Api\Api;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class PaymentController extends Controller
{
    use \App\Traits\ApiResponse;

    private $api;

    public function __construct()
    {
        // Try to instantiate Razorpay API if keys are available
        if (config('services.razorpay.key') && config('services.razorpay.secret')) {
            $this->api = new Api(config('services.razorpay.key'), config('services.razorpay.secret'));
        }
    }

    public function createOrder(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:subscription_plans,id',
            'billing_cycle' => 'required|in:monthly,yearly',
        ]);

        $user = auth()->user();
        $plan = SubscriptionPlan::findOrFail($request->plan_id);

        $amount = $request->billing_cycle === 'yearly' ? $plan->price_yearly : $plan->price_monthly;
        
        // Skip razorpay if price is 0
        if ($amount <= 0) {
            return $this->error('Plan amount cannot be zero for online payment.', 400);
        }

        if (!$this->api) {
            // Mock response if Razorpay is not configured (useful for local dev without keys)
            $orderId = 'order_mock_' . uniqid();
            $payment = Payment::create([
                'user_id' => $user->id,
                'razorpay_order_id' => $orderId,
                'amount' => $amount,
                'currency' => 'INR',
                'purpose' => 'subscription',
                'status' => 'pending',
                'meta' => [
                    'plan_id' => $plan->id,
                    'billing_cycle' => $request->billing_cycle,
                ]
            ]);
            return $this->success([
                'order_id' => $orderId,
                'amount' => $amount * 100, // in paise
                'currency' => 'INR',
                'key' => 'mock_key',
            ], 'Mock Order generated (Missing Razorpay Keys).');
        }

        try {
            // Amount is in paise (multiply by 100)
            $orderData = [
                'receipt' => 'rcptid_' . uniqid(),
                'amount' => $amount * 100,
                'currency' => 'INR',
                'notes' => [
                    'user_id' => $user->id,
                    'plan_id' => $plan->id,
                    'billing_cycle' => $request->billing_cycle,
                ]
            ];

            $razorpayOrder = $this->api->order->create($orderData);

            $payment = Payment::create([
                'user_id' => $user->id,
                'razorpay_order_id' => $razorpayOrder->id,
                'amount' => $amount,
                'currency' => 'INR',
                'purpose' => 'subscription',
                'status' => 'pending',
                'meta' => [
                    'plan_id' => $plan->id,
                    'billing_cycle' => $request->billing_cycle,
                ]
            ]);

            return $this->success([
                'order_id' => $razorpayOrder->id,
                'amount' => $amount * 100,
                'currency' => 'INR',
                'key' => config('services.razorpay.key'),
                'payment_id' => $payment->id,
            ], 'Order created successfully.');
        } catch (\Exception $e) {
            Log::error('Razorpay Order Creation Failed: ' . $e->getMessage());
            return $this->error('Could not initiate payment. ' . $e->getMessage(), 500);
        }
    }

    public function verifyPayment(Request $request)
    {
        $request->validate([
            'razorpay_order_id' => 'required|string',
            'razorpay_payment_id' => 'required|string',
            'razorpay_signature' => 'required|string',
        ]);

        $user = auth()->user();
        $payment = Payment::where('razorpay_order_id', $request->razorpay_order_id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        if ($payment->status === 'success') {
            return $this->success(null, 'Payment already verified.');
        }

        // Bypass verification if mocked
        if (strpos($request->razorpay_order_id, 'order_mock_') === 0) {
            $this->activateSubscription($payment, clone $request);
            return $this->success(null, 'Mock Payment verified and subscription activated.');
        }

        if (!$this->api) {
            return $this->error('Razorpay keys not configured.', 500);
        }

        try {
            $attributes = array(
                'razorpay_order_id' => $request->razorpay_order_id,
                'razorpay_payment_id' => $request->razorpay_payment_id,
                'razorpay_signature' => $request->razorpay_signature
            );

            $this->api->utility->verifyPaymentSignature($attributes);
            
            // Activate subscription
            $this->activateSubscription($payment, $request);

            return $this->success(null, 'Payment verified and subscription activated successfully.');
        } catch (\Exception $e) {
            Log::error('Razorpay Signature Verification Failed: ' . $e->getMessage());
            $payment->update(['status' => 'failed']);
            return $this->error('Payment verification failed.', 400);
        }
    }

    private function activateSubscription(Payment $payment, Request $request)
    {
        $payment->update([
            'status' => 'success',
            'razorpay_payment_id' => $request->razorpay_payment_id,
            'razorpay_signature' => $request->razorpay_signature,
        ]);

        $planId = $payment->meta['plan_id'] ?? null;
        $billingCycle = $payment->meta['billing_cycle'] ?? 'monthly';

        if (!$planId) return;

        $plan = SubscriptionPlan::find($planId);
        if (!$plan) return;

        $expiresAt = $billingCycle === 'yearly' ? Carbon::now()->addYear() : Carbon::now()->addMonth();

        // Update User Subscription
        $subscription = UserSubscription::updateOrCreate(
            ['user_id' => $payment->user_id],
            [
                'subscription_plan_id' => $plan->id,
                'payment_id' => $payment->id,
                'billing_cycle' => $billingCycle,
                'starts_at' => Carbon::now(),
                'expires_at' => $expiresAt,
                'status' => 'active',
            ]
        );

        // Update all active listings of the user to reflect subscription status
        Listing::where('user_id', $payment->user_id)->update([
            'subscription_plan' => $plan->name,
            'subscription_status' => 'active',
            'premium_until' => $expiresAt,
            'is_premium' => true,
        ]);
    }
}
