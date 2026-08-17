<?php
namespace App\Http\Controllers\Public;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AnalyticsEvent;
use App\Traits\ApiResponse;
class AnalyticsTrackingController extends Controller {
    use ApiResponse;
    public function track(Request $request) {
        $event = AnalyticsEvent::create($request->all() + ['ip_address' => $request->ip()]);
        return $this->success(null);
    }
}
