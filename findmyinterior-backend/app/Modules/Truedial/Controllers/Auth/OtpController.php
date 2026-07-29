<?php

namespace App\Modules\Truedial\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Jobs\SendOtpJob;
use App\Events\UserRegistered;

class OtpController extends Controller
{
    /**
     * Send OTP to a mobile number.
     */
    public function sendOtp(\App\Http\Requests\Auth\SendOtpRequest $request)
    {
        $phone = $request->input('phone');
        
        // Generate a 6-digit OTP
        $otp = mt_rand(100000, 999999);
        
        // Cache the OTP for 5 minutes
        $cacheKey = 'otp_' . $phone;
        Cache::put($cacheKey, (string) $otp, now()->addMinutes(5));
        
        // Dispatch the background job to send the SMS
        SendOtpJob::dispatch($phone, (string) $otp);

        $response = [
            'success' => true,
            'message' => 'OTP sent successfully to ' . $phone,
        ];

        $hasSmsGateway = !empty(config('services.msg91.auth_key')) || !empty(config('services.twilio.sid'));

        // If no SMS gateway, expose OTP in response so testing is possible
        if (!$hasSmsGateway) {
            $response['otp'] = $otp;
        }

        return response()->json($response);
    }

    /**
     * Verify OTP and Login / Register.
     */
    public function verifyOtp(\App\Http\Requests\Auth\VerifyOtpRequest $request)
    {
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

        $isNewUser = User::where('phone', $phone)->doesntExist();

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

        if ($isNewUser) {
            event(new UserRegistered($user));
        }

        // Assign a default role if they don't have one (e.g., business)
        // For TrueDial, businesses listing themselves usually get a 'business' or 'vendor' role
        if ($user->roles()->count() === 0) {
            $role = \App\Models\Role::where('slug', 'business')->first();
            if ($role) {
                $user->roles()->attach($role->id);
            }
        }

        $token = $user->createToken('truedial-auth-token')->plainTextToken;

        \App\Models\AuditLog::create([
            'user_id' => $user->id,
            'action' => $isNewUser ? 'register' : 'login',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'payload' => ['phone' => $phone],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Logged in successfully',
            'token' => $token,
            'user' => $user->load('roles'),
        ]);
    }
}
