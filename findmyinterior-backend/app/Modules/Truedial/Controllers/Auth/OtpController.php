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
        
        // Generate a 6-digit OTP (In production, you would use a random generator)
        // For development/staging, we will use a fixed OTP '123456' to save SMS costs
        $otp = app()->environment('production') ? mt_rand(100000, 999999) : '123456';
        
        // Cache the OTP for 5 minutes
        $cacheKey = 'otp_' . $phone;
        Cache::put($cacheKey, $otp, now()->addMinutes(5));
        
        // In a real scenario, integrate an SMS gateway here (e.g., Twilio, Msg91)
        Log::info("OTP for {$phone} is {$otp}");

        return response()->json([
            'success' => true,
            'message' => 'OTP sent successfully to ' . $phone,
        ]);
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
