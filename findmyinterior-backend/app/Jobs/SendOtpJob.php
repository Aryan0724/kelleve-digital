<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class SendOtpJob implements ShouldQueue
{
    use Queueable;

    public $phone;
    public $otp;

    public function __construct(string $phone, string $otp)
    {
        $this->phone = $phone;
        $this->otp = $otp;
    }

    public function handle(): void
    {
        // Check if an SMS gateway is configured
        $hasSmsGateway = !empty(config('services.msg91.auth_key')) || !empty(config('services.twilio.sid'));
        
        if ($hasSmsGateway) {
            // Placeholder: integrate with actual SMS Gateway like MSG91 or Twilio
            Log::info("Job processing: SMS sent to {$this->phone} with OTP {$this->otp}");
        } else {
            // For testing environments
            Log::info("Job processing (Testing Mode): OTP for {$this->phone} is {$this->otp}");
        }
    }
}
