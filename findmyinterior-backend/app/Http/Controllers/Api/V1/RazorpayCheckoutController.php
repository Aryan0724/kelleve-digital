<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Razorpay\Api\Api as RazorpayApi;
use Razorpay\Api\Errors\BadRequestError;

class RazorpayCheckoutController extends Controller
{
    /**
     * POST /api/create-order or /api/v1/create-order
     * Creates a Razorpay Standard Web Checkout order.
     * Minimum amount: 100 paise.
     */
    public function createOrder(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'amount'   => ['required', 'integer', 'min:100'],
            'currency' => ['nullable', 'string', 'size:3'],
            'receipt'  => ['nullable', 'string', 'max:255'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error'   => 'Invalid request parameters',
                'message' => $validator->errors()->first(),
            ], 400);
        }

        $keyId = config('services.razorpay.key');
        $keySecret = config('services.razorpay.secret');

        if (empty($keyId) || empty($keySecret)) {
            return response()->json([
                'error'   => 'Configuration Error',
                'message' => 'Razorpay API credentials are not configured on the server.',
            ], 500);
        }

        try {
            $api = new RazorpayApi($keyId, $keySecret);

            $amount = (int) $request->input('amount');
            $currency = strtoupper($request->input('currency', 'INR'));
            $receipt = $request->input('receipt', 'order_rcpt_' . uniqid());

            $razorpayOrder = $api->order->create([
                'amount'          => $amount, // Amount in paise (minimum 100)
                'currency'        => $currency,
                'receipt'         => $receipt,
                'payment_capture' => 1,
            ]);

            return response()->json([
                'order_id' => $razorpayOrder['id'],
                'amount'   => $razorpayOrder['amount'],
                'currency' => $razorpayOrder['currency'],
            ], 200);
        } catch (BadRequestError $e) {
            Log::error('Razorpay Create Order Auth/Bad Request Error: ' . $e->getMessage());
            // Return 401 if authentication failure from Razorpay API
            $statusCode = str_contains(strtolower($e->getMessage()), 'auth') || str_contains(strtolower($e->getMessage()), 'key') ? 401 : 500;
            return response()->json([
                'error'   => 'Razorpay API Error',
                'message' => $e->getMessage(),
            ], $statusCode);
        } catch (\Exception $e) {
            Log::error('Razorpay Create Order Exception: ' . $e->getMessage());
            $statusCode = str_contains(strtolower($e->getMessage()), 'auth') ? 401 : 500;
            return response()->json([
                'error'   => 'Failed to create order',
                'message' => $e->getMessage(),
            ], $statusCode);
        }
    }

    /**
     * POST /api/verify-payment or /api/v1/verify-payment
     * Verifies HMAC-SHA256 signature from Razorpay checkout modal.
     */
    public function verifySignature(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'razorpay_order_id'   => ['required', 'string'],
            'razorpay_payment_id' => ['required', 'string'],
            'razorpay_signature'  => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Missing or invalid required verification fields: ' . $validator->errors()->first(),
            ], 400);
        }

        $orderId   = $request->input('razorpay_order_id');
        $paymentId = $request->input('razorpay_payment_id');
        $signature = $request->input('razorpay_signature');

        $keySecret = config('services.razorpay.secret');
        if (empty($keySecret)) {
            return response()->json([
                'success' => false,
                'message' => 'Razorpay secret key not configured on server',
            ], 500);
        }

        $expectedSignature = hash_hmac('sha256', $orderId . '|' . $paymentId, $keySecret);

        if (!hash_equals($expectedSignature, $signature)) {
            Log::warning("Razorpay signature mismatch for order ID: {$orderId}, payment ID: {$paymentId}");
            return response()->json([
                'success' => false,
                'message' => 'Signature verification failed: signature mismatch',
            ], 400); // Do NOT mark as paid; return 400
        }

        Log::info("Razorpay payment verified successfully. Order: {$orderId}, Payment: {$paymentId}");

        return response()->json([
            'success'    => true,
            'message'    => 'Payment verified successfully',
            'order_id'   => $orderId,
            'payment_id' => $paymentId,
        ], 200);
    }
}
