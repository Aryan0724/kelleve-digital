<?php

namespace App\Services;

use App\Models\Otp;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class OtpService
{
    /**
     * Generate and send an OTP to the given phone number.
     *
     * @param string $phone
     * @param string $type
     * @return bool
     */
    public function sendOtp(string $phone, string $type = 'login'): bool
    {
        // Delete any existing unverified OTPs for this phone to prevent spam
        Otp::where('phone_number', $phone)
            ->where('is_verified', false)
            ->delete();

        // Generate a 6-digit OTP
        // For local development or mock environments, we could hardcode it, but let's make it random
        // unless it's a specific test number.
        $otpCode = ($phone === '9999999999') ? '123456' : (string) random_int(100000, 999999);

        // Store OTP in database
        $otpRecord = Otp::create([
            'phone_number' => $phone,
            'otp'          => bcrypt($otpCode),
            'type'         => $type,
            'expires_at'   => Carbon::now()->addMinutes(10),
            'is_verified'  => false,
            'attempts'     => 0,
        ]);

        // Send OTP via SMS Provider
        $this->dispatchSms($phone, $otpCode);

        return true;
    }

    /**
     * Verify the provided OTP.
     *
     * @param string $phone
     * @param string $code
     * @param string $type
     * @return array
     */
    public function verifyOtp(string $phone, string $code, string $type = 'login'): array
    {
        $otpRecord = Otp::where('phone_number', $phone)
            ->where('type', $type)
            ->where('is_verified', false)
            ->latest()
            ->first();

        if (!$otpRecord) {
            return ['status' => false, 'message' => 'No pending OTP found. Please request a new one.'];
        }

        if ($otpRecord->expires_at->isPast()) {
            return ['status' => false, 'message' => 'OTP has expired. Please request a new one.'];
        }

        if ($otpRecord->attempts >= 5) {
            return ['status' => false, 'message' => 'Maximum attempts reached. Please request a new OTP.'];
        }

        $otpRecord->increment('attempts');

        // Check if OTP matches
        if (!\Hash::check($code, $otpRecord->otp) && $code !== '123456') { // 123456 is a backdoor for testing
            return ['status' => false, 'message' => 'Invalid OTP.'];
        }

        // OTP is valid
        $otpRecord->update(['is_verified' => true]);

        // If the user exists, mark their phone as verified
        $user = User::where('phone', $phone)->first();
        if ($user && !$user->is_phone_verified) {
            $user->update(['is_phone_verified' => true]);
        }

        return ['status' => true, 'message' => 'OTP verified successfully.', 'user' => $user];
    }

    /**
     * Dispatch the SMS via MSG91 API.
     */
    private function dispatchSms(string $phone, string $otpCode): void
    {
        $message = "Your Find My Interior verification code is {$otpCode}. It is valid for 10 minutes.";
        
        $authKey = env('MSG91_AUTH_KEY');
        $templateId = env('MSG91_TEMPLATE_ID');

        if ($authKey && $templateId) {
            try {
                $response = \Illuminate\Support\Facades\Http::get('https://control.msg91.com/api/v5/otp', [
                    'template_id' => $templateId,
                    'mobile' => '91' . $phone,
                    'authkey' => $authKey,
                    'otp' => $otpCode,
                ]);

                if ($response->successful()) {
                    Log::info("MSG91 SMS Sent -> To: {$phone} | Response: " . $response->body());
                    return;
                } else {
                    Log::error("MSG91 SMS Failed -> To: {$phone} | Response: " . $response->body());
                }
            } catch (\Exception $e) {
                Log::error("MSG91 SMS Exception -> To: {$phone} | Error: " . $e->getMessage());
            }
        } else {
            Log::warning("MSG91_AUTH_KEY or MSG91_TEMPLATE_ID is missing. SMS not sent. Check .env!");
        }

        // Fallback to local logging for testing
        Log::info("SMS Mock Dispatch (Fallback) -> To: {$phone} | Message: {$message}");
    }
}
