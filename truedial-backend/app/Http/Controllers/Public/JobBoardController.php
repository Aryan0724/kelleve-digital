<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Job;
use App\Traits\ApiResponse;

class JobBoardController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $jobs = Job::where('is_active', true)->orderByDesc('created_at')->get();

        if ($jobs->isEmpty()) {
            $jobs = collect([
                [
                    'id' => 1,
                    'title' => 'Senior Frontend Developer',
                    'company_name' => 'TechVision Solutions',
                    'location' => 'Remote / Patna',
                    'job_type' => 'Full-time',
                    'salary_range' => '₹12L - ₹18L',
                    'created_at' => now()->subDays(2)->toIso8601String(),
                ],
                [
                    'id' => 2,
                    'title' => 'Digital Marketing Intern',
                    'company_name' => 'GrowthHackers India',
                    'location' => 'Patna',
                    'job_type' => 'Internship',
                    'salary_range' => '₹15k Stipend',
                    'created_at' => now()->subDays(5)->toIso8601String(),
                ],
                [
                    'id' => 3,
                    'title' => 'B2B Sales Executive',
                    'company_name' => 'Royal Ventures',
                    'location' => 'Delhi / NCR',
                    'job_type' => 'Full-time',
                    'salary_range' => '₹4L - ₹6L + Incentive',
                    'created_at' => now()->subHours(10)->toIso8601String(),
                ]
            ]);
        }

        return $this->success($jobs);
    }
}
