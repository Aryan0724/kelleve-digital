<?php
namespace App\Http\Controllers\Vendor;
use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
class AnalyticsController extends Controller {
    use ApiResponse;
    public function overview() { return $this->success([]); }
    public function chart() { return $this->success([]); }
}
