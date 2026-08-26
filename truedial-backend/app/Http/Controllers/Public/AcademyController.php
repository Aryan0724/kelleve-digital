<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use App\Traits\ApiResponse;

class AcademyController extends Controller
{
    use ApiResponse;

    public function courses(Request $request)
    {
        $courses = Course::where('is_active', true)->get();

        if ($courses->isEmpty()) {
            $courses = collect([
                [
                    'id' => 1,
                    'title' => 'Digital Marketing Masterclass',
                    'instructor_name' => 'Amit Sharma',
                    'duration' => '4 Weeks',
                    'level' => 'Beginner',
                    'thumbnail_url' => 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=600&auto=format&fit=crop',
                    'price' => 0,
                    'description' => 'Learn how to market your local business online.'
                ],
                [
                    'id' => 2,
                    'title' => 'Business Scaling & Operations',
                    'instructor_name' => 'Priya Patel',
                    'duration' => '6 Weeks',
                    'level' => 'Intermediate',
                    'thumbnail_url' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop',
                    'price' => 2999,
                    'description' => 'Strategic guidance on scaling revenue and managing team operations.'
                ],
                [
                    'id' => 3,
                    'title' => 'Social Media Growth Hacks',
                    'instructor_name' => 'Rahul Verma',
                    'duration' => '2 Weeks',
                    'level' => 'All Levels',
                    'thumbnail_url' => 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=600&auto=format&fit=crop',
                    'price' => 1499,
                    'description' => 'Fast-track organic growth on Instagram and YouTube.'
                ]
            ]);
        }

        return $this->success($courses);
    }
}
