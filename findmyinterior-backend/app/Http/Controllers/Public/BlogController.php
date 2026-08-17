<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\BlogResource;
use App\Models\Blog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    /**
     * GET /api/v1/blogs
     */
    public function index(Request $request): JsonResponse
    {
        $query = Blog::published()->with(['author', 'tags'])->latest();

        if ($request->filled('category')) {
            $query->byCategory($request->category);
        }
        
        if ($request->filled('target_audience')) {
            $query->whereJsonContains('target_audience', $request->target_audience);
        }

        $blogs = $query->paginate($request->get('per_page', 9));

        return response()->json([
            'success' => true,
            'data'    => BlogResource::collection($blogs),
            'meta'    => [
                'current_page' => $blogs->currentPage(),
                'per_page'     => $blogs->perPage(),
                'total'        => $blogs->total(),
                'last_page'    => $blogs->lastPage(),
            ],
        ]);
    }

    /**
     * GET /api/v1/blogs/{slug}
     */
    public function show(string $slug): JsonResponse
    {
        $blog = Blog::published()
            ->where('slug', $slug)
            ->with(['author', 'tags'])
            ->firstOrFail();

        $blog->incrementViews();

        // Related posts
        $related = Blog::published()
            ->where('id', '!=', $blog->id)
            ->where('category', $blog->category)
            ->with(['author'])
            ->take(3)
            ->get();

        return response()->json([
            'success' => true,
            'data'    => new BlogResource($blog),
            'related' => BlogResource::collection($related),
        ]);
    }
}
