<?php
namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Traits\ApiResponse;
class OtpController extends Controller {
    use ApiResponse;
    public function sendOtp(Request $request) {
        return $this->success(null, "OTP sent successfully.");
    }
    public function verifyOtp(Request $request) {
        return $this->success(null, "OTP verified successfully.");
    }
}
