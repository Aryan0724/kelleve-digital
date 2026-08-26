<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Listing;
use App\Traits\ApiResponse;

class BusinessDirectoryController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = Listing::with(['category', 'gallery', 'offers'])->active();

        if ($search = $request->get('search') ?: $request->get('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('tagline', 'like', "%{$search}%");
            });
        }

        if ($city = $request->get('city')) {
            $query->where('city', 'like', "%{$city}%");
        }

        if ($categoryId = $request->get('category_id')) {
            $query->where('category_id', $categoryId);
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        $perPage = (int) $request->get('per_page', 15);
        return $this->paginated($query->orderByDesc('is_featured')->orderByDesc('avg_rating')->paginate($perPage));
    }

    public function show($slugOrId)
    {
        $business = Listing::with([
            'category',
            'gallery',
            'reviews.user',
            'offers' => fn($q) => $q->where('status', 'active'),
            'listingProducts',
            'listingServices',
            'media'
        ])
        ->where(function ($q) use ($slugOrId) {
            $q->where('slug', $slugOrId);
            if (is_numeric($slugOrId)) {
                $q->orWhere('id', $slugOrId);
            }
        })
        ->firstOrFail();

        $business->increment('views_count');
        return $this->success($business);
    }
}
