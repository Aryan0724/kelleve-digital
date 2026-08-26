<?php

namespace App\Modules\Truedial\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Core\Tenancy\TenantContext;
use Illuminate\Support\Facades\Auth;
use App\Models\MarketingCampaign;

class MarketingCampaignController extends Controller
{
    use \App\Traits\ApiResponse;

    protected TenantContext $tenantContext;

    public function __construct(TenantContext $tenantContext)
    {
        $this->tenantContext = $tenantContext;
    }

    public function index(Request $request)
    {
        $campaigns = MarketingCampaign::where('user_id', Auth::id())->latest()->get();
        return $this->success($campaigns);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'nullable|string',
            'content' => 'nullable|string',
            'message' => 'nullable|string',
            'audience' => 'nullable',
            'schedule_at' => 'nullable',
            'scheduled_at' => 'nullable',
        ]);

        $messageContent = $request->get('content') ?: ($request->get('message') ?: 'Promotional campaign message');
        $scheduleTime = $request->get('schedule_at') ?: $request->get('scheduled_at');

        $campaign = MarketingCampaign::create([
            'user_id' => Auth::id(),
            'name' => $request->name,
            'type' => strtolower($request->get('type', 'email')),
            'message' => $messageContent,
            'audience' => is_array($request->audience) ? json_encode($request->audience) : (string)$request->get('audience', 'All Customers'),
            'status' => 'active',
            'scheduled_at' => $scheduleTime ? date('Y-m-d H:i:s', strtotime($scheduleTime)) : now(),
        ]);

        return $this->success($campaign, 'Campaign created and launched successfully', 201);
    }
}
