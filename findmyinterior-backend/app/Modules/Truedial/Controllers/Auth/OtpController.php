<?php

namespace App\Modules\Truedial\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class OtpController extends Controller
{
    /**
     * Send OTP to a mobile number.
     */
    public function sendOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|min:10|max:15',
        ]);

        $phone = $request->input('phone');
        
        // Generate a 6-digit OTP
        $otp = mt_rand(100000, 999999);
        
        // Cache the OTP for 5 minutes
        $cacheKey = 'otp_' . $phone;
        Cache::put($cacheKey, (string) $otp, now()->addMinutes(5));
        
        // Check if an SMS gateway is configured
        $hasSmsGateway = !empty(config('services.msg91.auth_key')) || !empty(config('services.twilio.sid'));
        
        if ($hasSmsGateway) {
            // TODO: Send via SMS gateway
            Log::info("OTP for {$phone} is {$otp}");
        } else {
            // No SMS gateway — log and return OTP in response for testing
            Log::info("OTP for {$phone} is {$otp} (no SMS gateway configured)");
        }

        $response = [
            'success' => true,
            'message' => 'OTP sent successfully to ' . $phone,
        ];

        // If no SMS gateway, expose OTP in response so testing is possible
        if (!$hasSmsGateway) {
            $response['otp'] = $otp;
        }

        return response()->json($response);
    }

    /**
     * Verify OTP and Login / Register.
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'phone' => 'required|string|min:10|max:15',
            'otp' => 'required|string|min:4|max:6',
        ]);

        $phone = $request->input('phone');
        $inputOtp = $request->input('otp');
        $cacheKey = 'otp_' . $phone;

        $cachedOtp = Cache::get($cacheKey);

        if (!$cachedOtp || $cachedOtp != $inputOtp) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired OTP',
            ], 401);
        }

        // OTP is valid. Clear the cache.
        Cache::forget($cacheKey);

        // Find or create the user based on the phone number
        $user = User::firstOrCreate(
            ['phone' => $phone],
            [
                'email' => $phone . '@truedial.test', // Placeholder email as email is usually required in Laravel default setup
                'password' => bcrypt(uniqid()), // Random password since they use OTP
                'first_name' => $request->input('company_name', 'User'), // From Free Listing Step 1 if provided
                'last_name' => '',
                'is_active' => true,
            ]
        );

        // Assign a default role if they don't have one (e.g., business)
        // For TrueDial, businesses listing themselves usually get a 'business' or 'vendor' role
        if ($user->roles()->count() === 0) {
            $role = \App\Models\Role::where('slug', 'business')->first();
            if ($role) {
                $user->roles()->attach($role->id);
            }
        }

        $token = $user->createToken('truedial-auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Logged in successfully',
            'token' => $token,
            'user' => $user->load('roles'),
        ]);
    }
}
