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
            'purpose'               => ['required', 'in:subscription,lead_unlock'],
            'subscription_plan_id'  => ['required_if:purpose,subscription', 'exists:subscription_plans,id'],
            'billing_cycle'         => ['required_if:purpose,subscription', 'in:monthly,yearly'],
            'requirement_id'        => ['required_if:purpose,lead_unlock', 'exists:requirements,id'],
        ]);

        $user = $request->user();

        if ($data['purpose'] === 'subscription') {
            $plan = SubscriptionPlan::findOrFail($data['subscription_plan_id']);
            $amount = $data['billing_cycle'] === 'yearly'
                ? $plan->price_yearly
                : $plan->price_monthly;
        } else {
            // lead_unlock: flat ₹49 per contact
            $amount = 49.00;
        }

        if (empty(config('services.razorpay.key')) || config('app.env') === 'local' && empty(config('services.razorpay.key'))) {
            // Mock response for local environment testing when keys are missing
            $razorpayOrder = ['id' => 'order_mock_' . time()];
        } else {
            $api  = new RazorpayApi(config('services.razorpay.key'), config('services.razorpay.secret'));
            // Razorpay expects paise (INR * 100)
            $razorpayOrder = $api->order->create([
                'amount'          => (int) ($amount * 100),
                'currency'        => 'INR',
                'receipt'         => 'fmi_' . $user->id . '_' . time(),
                'payment_capture' => 1,
            ]);
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
            'success'  => true,
            'order_id' => $razorpayOrder['id'],
            'amount'   => (int) ($amount * 100),
            'currency' => 'INR',
            'payment_id' => $payment->id,
        ]);
    }

    /**
     * POST /api/v1/payments/verify
     * Verifies Razorpay signature and fulfills the purchase.
     */
    public function verify(Request $request): JsonResponse
    {
        $data = $request->validate([
            'razorpay_order_id'   => ['required', 'string'],
            'razorpay_payment_id' => ['required', 'string'],
            'razorpay_signature'  => ['required', 'string'],
        ]);

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

        $payment = Payment::where('razorpay_order_id', $data['razorpay_order_id'])->firstOrFail();

        DB::transaction(function () use ($payment, $data) {
            $payment->update([
                'razorpay_payment_id' => $data['razorpay_payment_id'],
                'razorpay_signature'  => $data['razorpay_signature'],
                'status'              => 'success',
            ]);

            $this->fulfillPayment($payment);
        });

        Log::info("Payment fulfilled successfully for order {$data['razorpay_order_id']}");

        return response()->json([
            'success' => true,
            'message' => 'Payment successful!',
            'data'    => new PaymentResource($payment->fresh()),
        ]);
    }

    /**
     * Fulfill the payment based on its purpose.
     */
    private function fulfillPayment(Payment $payment): void
    {
        $meta = $payment->meta;

        if ($payment->purpose === 'subscription') {
            $plan  = SubscriptionPlan::findOrFail($meta['subscription_plan_id']);
            $cycle = $meta['billing_cycle'];

            // Expire any existing active subscription
            UserSubscription::where('user_id', $payment->user_id)
                ->where('status', 'active')
                ->update(['status' => 'cancelled']);

            UserSubscription::create([
                'user_id'              => $payment->user_id,
                'subscription_plan_id' => $plan->id,
                'payment_id'           => $payment->id,
                'billing_cycle'        => $cycle,
                'status'               => 'active',
                'starts_at'            => now(),
                'expires_at'           => $cycle === 'yearly' ? now()->addYear() : now()->addMonth(),
            ]);

            // Sync is_premium flag to the entity for directory queries
            $user = $payment->user;
            if ($user->role === 'builder' && $user->builder) {
                $user->builder->update(['is_premium' => true]);
            } elseif ($user->role === 'supplier' && $user->supplier) {
                $user->supplier->update(['is_premium' => true]);
            } elseif ($user->role === 'worker' && $user->worker) {
                $user->worker->update(['is_premium' => true]);
            } elseif ($user->role === 'business' && $user->listing) {
                $user->listing->update(['is_premium' => true]);
            }

        } elseif ($payment->purpose === 'lead_unlock') {
            ContactUnlock::firstOrCreate([
                'user_id'        => $payment->user_id,
                'requirement_id' => $meta['requirement_id'],
            ], [
                'payment_id' => $payment->id,
            ]);
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
