<?php

namespace App\Modules\Truedial\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Core\Tenancy\TenantContext;

class NewsController extends Controller
{
    use \App\Traits\ApiResponse;

    protected TenantContext $tenantContext;

    public function __construct(TenantContext $tenantContext)
    {
        $this->tenantContext = $tenantContext;
    }

    public function index(Request $request)
    {
        // Mock news/podcasts for MVP
        $news = [
            [
                'id' => 1,
                'title' => 'Future of Indian Retail in 2026',
                'category' => 'Business News',
                'excerpt' => 'An in-depth look at how digital transformation is reshaping local retail across tier 2 cities.',
                'image' => 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=600&auto=format&fit=crop',
                'published_at' => now()->subHours(12)->toIso8601String(),
            ],
            [
                'id' => 2,
                'title' => 'Episode 45: Scaling a Service Business',
                'category' => 'Podcast',
                'excerpt' => 'Interview with top contractors on how they 10x their revenue using online discovery.',
                'image' => 'https://images.unsplash.com/photo-1581368135153-a506cf13b1e1?q=80&w=600&auto=format&fit=crop',
                'published_at' => now()->subDays(1)->toIso8601String(),
            ],
            [
                'id' => 3,
                'title' => 'New GST Regulations for E-commerce',
                'category' => 'Policy Updates',
                'excerpt' => 'Everything you need to know about the upcoming tax bracket changes for online vendors.',
                'image' => 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop',
                'published_at' => now()->subDays(3)->toIso8601String(),
            ]
        ];

        return $this->success($news);
    }
}
