<?php

namespace App\Modules\Truedial\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Core\Tenancy\TenantContext;
use App\Modules\Truedial\Services\AnalyticsEventService;

class AnalyticsTrackingController extends Controller
{
    use \App\Traits\ApiResponse;

    protected TenantContext $tenantContext;

    public function __construct(TenantContext $tenantContext)
    {
        $this->tenantContext = $tenantContext;
    }

    public function track(Request $request)
    {
        $validated = $request->validate([
            'event_type' => 'required|string|in:' . implode(',', AnalyticsEventService::getValidEvents()),
            'entity_type' => 'required|string',
            'entity_id' => 'required|integer',
            'metadata' => 'nullable|array'
        ]);

        AnalyticsEventService::track(
            $this->tenantContext->getTenantId(),
            $validated['event_type'],
            $validated['entity_type'],
            $validated['entity_id'],
            auth('sanctum')->id(),
            null, // Session ID will be generated/extracted from request in the service
            $validated['metadata'] ?? []
        );

        return $this->success(null, 'Event tracked successfully.');
    }
}
