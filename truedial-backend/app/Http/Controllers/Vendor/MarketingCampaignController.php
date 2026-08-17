<?php
namespace App\Http\Controllers\Vendor;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MarketingCampaign;
use App\Traits\ApiResponse;
class MarketingCampaignController extends Controller {
    use ApiResponse;
    public function index() { return $this->success(MarketingCampaign::all()); }
    public function store(Request $request) { return $this->success(MarketingCampaign::create($request->all())); }
}
