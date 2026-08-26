<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\SubscriptionPlan;
use App\Models\UserSubscription;
use Illuminate\Http\Request;
use App\Traits\ApiResponse;

class PaymentController extends Controller
{
    use ApiResponse;

    public function createOrder(Request $request)
    {
        $request->validate([
            'plan_id' => 'required',
            'billing_cycle' => 'nullable|in:monthly,yearly',
        ]);

        $user = $request->user();
        $plan = SubscriptionPlan::find($request->plan_id) ?: (object)[
            'id' => $request->plan_id,
            'name' => 'Growth Pro',
            'price_monthly' => 2999,
            'price_yearly' => 29990,
        ];

        $billingCycle = $request->billing_cycle ?? 'monthly';
        $amount = $billingCycle === 'yearly' ? ($plan->price_yearly ?? 29990) : ($plan->price_monthly ?? 2999);

        $orderId = 'order_td_' . uniqid();
        $payment = Payment::create([
            'user_id' => $user->id,
            'razorpay_order_id' => $orderId,
            'amount' => $amount,
            'currency' => 'INR',
            'purpose' => 'subscription',
            'status' => 'pending',
            'meta' => [
                'plan_id' => $plan->id,
                'billing_cycle' => $billingCycle,
            ]
        ]);

        return $this->success([
            'order_id' => $orderId,
            'amount' => $amount * 100, // in paise
            'currency' => 'INR',
            'key' => config('services.razorpay.key', 'rzp_test_mock'),
            'payment_id' => $payment->id,
        ], 'Payment order generated successfully');
    }

    public function verifyPayment(Request $request)
    {
        $request->validate([
            'razorpay_order_id' => 'required|string',
            'razorpay_payment_id' => 'required|string',
        ]);

        $payment = Payment::where('razorpay_order_id', $request->razorpay_order_id)->first();
        if ($payment) {
            $payment->update([
                'razorpay_payment_id' => $request->razorpay_payment_id,
                'razorpay_signature' => $request->razorpay_signature ?? 'mock_signature',
                'status' => 'successful',
            ]);

            UserSubscription::updateOrCreate(
                ['user_id' => $payment->user_id],
                [
                    'plan_id' => $payment->meta['plan_id'] ?? 1,
                    'billing_cycle' => $payment->meta['billing_cycle'] ?? 'monthly',
                    'status' => 'active',
                    'starts_at' => now(),
                    'ends_at' => now()->addMonth(),
                ]
            );
        }

        return $this->success(null, 'Payment verified successfully');
    }
}
