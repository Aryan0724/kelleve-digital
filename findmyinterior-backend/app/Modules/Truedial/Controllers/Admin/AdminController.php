<?php

namespace App\Modules\Truedial\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Core\Tenancy\TenantContext;

class AdminController extends Controller
{
    use \App\Traits\ApiResponse;

    protected TenantContext $tenantContext;

    public function __construct(TenantContext $tenantContext)
    {
        $this->tenantContext = $tenantContext;
    }

    public function stats(Request $request)
    {
        // Mock global platform stats for Super Admin
        $stats = [
            'total_vendors' => 1250,
            'total_users' => 45000,
            'active_campaigns' => 342,
            'revenue_mtd' => '₹4,50,000'
        ];

        return $this->success($stats);
    }

    public function vendors(Request $request)
    {
        // Mock list of vendors for approval/management
        $vendors = [
            [
                'id' => 1,
                'business_name' => 'Royal Furniture & Interiors',
                'owner' => 'Amit Shah',
                'status' => 'active',
                'created_at' => now()->subMonths(2)->toIso8601String(),
            ],
            [
                'id' => 2,
                'business_name' => 'Sharma Logistics',
                'owner' => 'Rahul Sharma',
                'status' => 'pending_approval',
                'created_at' => now()->subDays(1)->toIso8601String(),
            ],
            [
                'id' => 3,
                'business_name' => 'Elite Plumbing Services',
                'owner' => 'Vikram Singh',
                'status' => 'active',
                'created_at' => now()->subYears(1)->toIso8601String(),
            ]
        ];

        return $this->success($vendors);
    }

    public function approveVendor(Request $request, $id)
    {
        // Mock vendor approval
        return $this->success(['id' => $id, 'status' => 'active'], 'Vendor approved successfully.');
    }
}
