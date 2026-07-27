<?php

namespace App\Modules\Truedial\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Core\Tenancy\TenantContext;

class JobBoardController extends Controller
{
    use \App\Traits\ApiResponse;

    protected TenantContext $tenantContext;

    public function __construct(TenantContext $tenantContext)
    {
        $this->tenantContext = $tenantContext;
    }

    public function index(Request $request)
    {
        // Mock jobs/internships for MVP
        $jobs = [
            [
                'id' => 1,
                'title' => 'Senior Frontend Developer',
                'company' => 'TechVision Solutions',
                'location' => 'Remote / Delhi',
                'type' => 'Full-time',
                'salary' => '₹12L - ₹18L',
                'posted_at' => now()->subDays(2)->toIso8601String(),
            ],
            [
                'id' => 2,
                'title' => 'Marketing Intern',
                'company' => 'GrowthHackers India',
                'location' => 'Mumbai',
                'type' => 'Internship',
                'salary' => '₹15k Stipend',
                'posted_at' => now()->subDays(5)->toIso8601String(),
            ],
            [
                'id' => 3,
                'title' => 'Sales Executive',
                'company' => 'Royal Ventures',
                'location' => 'Bangalore',
                'type' => 'Full-time',
                'salary' => '₹4L - ₹6L + Comm',
                'posted_at' => now()->subHours(10)->toIso8601String(),
            ]
        ];

        return $this->success($jobs);
    }
}
