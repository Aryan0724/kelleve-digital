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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:sms,whatsapp,email',
            'content' => 'required|string',
            'audience' => 'required|in:all_customers,recent_leads,custom',
            'schedule_at' => 'nullable|date'
        ]);

        $campaign = MarketingCampaign::create([
            'user_id' => Auth::id(),
            'name' => $validated['name'],
            'message' => $validated['content'], // map content to message
            'audience' => $validated['audience'],
            'status' => isset($validated['schedule_at']) ? 'scheduled' : 'draft',
            'scheduled_at' => $validated['schedule_at'] ?? null,
        ]);

        return $this->success($campaign, 'Campaign created successfully', 201);
    }
}
