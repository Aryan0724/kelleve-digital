<?php

namespace App\Modules\Truedial\Controllers\Vendor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Core\Tenancy\TenantContext;
use Illuminate\Support\Facades\Auth;

class CrmController extends Controller
{
    use \App\Traits\ApiResponse;

    protected TenantContext $tenantContext;

    public function __construct(TenantContext $tenantContext)
    {
        $this->tenantContext = $tenantContext;
    }

    public function leads(Request $request)
    {
        // Mock returning leads for Kanban board
        // Statuses: new, contacted, interested, converted, lost
        $leads = [
            [
                'id' => 1,
                'name' => 'Rahul Sharma',
                'phone' => '+91 9876543210',
                'source' => 'TrueDial Directory',
                'status' => 'new',
                'created_at' => now()->subHours(2)->toIso8601String(),
            ],
            [
                'id' => 2,
                'name' => 'Priya Patel',
                'phone' => '+91 8765432109',
                'source' => 'Privilege Card',
                'status' => 'contacted',
                'created_at' => now()->subDays(1)->toIso8601String(),
            ],
            [
                'id' => 3,
                'name' => 'Amit Singh',
                'phone' => '+91 7654321098',
                'source' => 'Direct Message',
                'status' => 'converted',
                'created_at' => now()->subDays(5)->toIso8601String(),
            ]
        ];

        return $this->success($leads);
    }

    public function updateLeadStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:new,contacted,interested,converted,lost'
        ]);

        return $this->success(['id' => $id, 'status' => $validated['status']], 'Lead status updated');
    }
}
