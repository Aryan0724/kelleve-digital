<?php

namespace App\Modules\Truedial\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Core\Tenancy\TenantContext;

class AcademyController extends Controller
{
    use \App\Traits\ApiResponse;

    protected TenantContext $tenantContext;

    public function __construct(TenantContext $tenantContext)
    {
        $this->tenantContext = $tenantContext;
    }

    public function courses(Request $request)
    {
        // Mock courses for MVP TrueDial Academy
        $courses = [
            [
                'id' => 1,
                'title' => 'Digital Marketing Masterclass',
                'instructor' => 'Amit Sharma',
                'duration' => '4 Weeks',
                'level' => 'Beginner',
                'thumbnail' => 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=600&auto=format&fit=crop',
                'price' => 0,
            ],
            [
                'id' => 2,
                'title' => 'Business Scaling & Operations',
                'instructor' => 'Priya Patel',
                'duration' => '6 Weeks',
                'level' => 'Intermediate',
                'thumbnail' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop',
                'price' => 2999,
            ],
            [
                'id' => 3,
                'title' => 'Social Media Growth Hacks',
                'instructor' => 'Rahul Verma',
                'duration' => '2 Weeks',
                'level' => 'All Levels',
                'thumbnail' => 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=600&auto=format&fit=crop',
                'price' => 1499,
            ]
        ];

        return $this->success($courses);
    }
}
