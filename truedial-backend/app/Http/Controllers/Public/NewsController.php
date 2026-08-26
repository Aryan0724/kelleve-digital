<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\NewsArticle;
use App\Traits\ApiResponse;

class NewsController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $news = NewsArticle::where('is_published', true)->orderByDesc('published_at')->get();

        if ($news->isEmpty()) {
            $news = collect([
                [
                    'id' => 1,
                    'title' => 'Future of Indian Retail & Local Commerce in 2026',
                    'category' => 'Business News',
                    'summary' => 'An in-depth look at how digital discovery is reshaping local retail across tier 2 and tier 3 cities.',
                    'image_url' => 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=600&auto=format&fit=crop',
                    'published_at' => now()->subHours(12)->toIso8601String(),
                ],
                [
                    'id' => 2,
                    'title' => 'Episode 45: Scaling a Multi-Location Brand',
                    'category' => 'TrueDial Podcast',
                    'summary' => 'Interview with leading enterprise founders on building strong local customer loyalty.',
                    'image_url' => 'https://images.unsplash.com/photo-1581368135153-a506cf13b1e1?q=80&w=600&auto=format&fit=crop',
                    'published_at' => now()->subDays(1)->toIso8601String(),
                ],
                [
                    'id' => 3,
                    'title' => 'GST & Compliance Updates for Micro Enterprises',
                    'category' => 'Policy Updates',
                    'summary' => 'Key legal and taxation updates that small business owners need to know this quarter.',
                    'image_url' => 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=600&auto=format&fit=crop',
                    'published_at' => now()->subDays(3)->toIso8601String(),
                ]
            ]);
        }

        return $this->success($news);
    }
}
