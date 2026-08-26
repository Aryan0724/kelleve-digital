<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Listing;
use App\Models\Review;
use App\Traits\ApiResponse;

class ReviewController extends Controller
{
    use ApiResponse;

    public function store(Request $request, $slug)
    {
        $listing = Listing::where(function ($q) use ($slug) {
            $q->where('slug', $slug);
            if (is_numeric($slug)) {
                $q->orWhere('id', $slug);
            }
        })->firstOrFail();

        $validated = $request->validate([
            'rating' => 'required|numeric|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'body' => 'required|string',
        ]);

        $review = Review::create([
            'listing_id' => $listing->id,
            'user_id' => $request->user()->id,
            'rating' => $validated['rating'],
            'title' => $validated['title'] ?? null,
            'body' => $validated['body'],
            'status' => 'approved',
        ]);

        // Recompute listing ratings
        $avg = Review::where('listing_id', $listing->id)->avg('rating') ?: $validated['rating'];
        $count = Review::where('listing_id', $listing->id)->count();

        $listing->update([
            'avg_rating' => round($avg, 2),
            'review_count' => $count,
        ]);

        return $this->success($review, 'Review posted successfully', 201);
    }

    public function voteHelpful(Request $request, $id)
    {
        $review = Review::findOrFail($id);
        $review->increment('helpful_count');

        return $this->success(['helpful_count' => $review->helpful_count], 'Voted helpful');
    }
}
