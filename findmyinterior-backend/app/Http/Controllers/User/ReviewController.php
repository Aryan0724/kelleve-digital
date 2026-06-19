<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * POST /api/v1/user/reviews
     * Authenticated users can submit reviews for any entity.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'reviewable_type' => ['nullable', 'in:listing,builder,supplier,worker'],
            'reviewable_id'   => ['nullable', 'integer'],
            'professional_id' => ['nullable', 'integer'],
            'requirement_id'  => ['nullable', 'integer'],
            'rating'          => ['required', 'integer', 'min:1', 'max:5'],
            'title'           => ['nullable', 'string', 'max:255'],
            'body'            => ['nullable', 'string', 'min:5', 'max:2000'],
            'review_text'     => ['nullable', 'string', 'max:2000'],
        ]);

        $morphMap = [
            'listing'  => \App\Models\Listing::class,
            'builder'  => \App\Models\Builder::class,
            'supplier' => \App\Models\Supplier::class,
            'worker'   => \App\Models\Worker::class,
        ];

        // Handle both formats: old (reviewable) and new (professional/requirement)
        $reviewableType = null;
        $reviewableId = null;
        $body = $data['body'] ?? $data['review_text'] ?? '';

        if (!empty($data['professional_id'])) {
            // Find the primary listing for this professional
            $listing = \App\Models\Listing::where('user_id', $data['professional_id'])->first();
            if ($listing) {
                $reviewableType = \App\Models\Listing::class;
                $reviewableId = $listing->id;
            } else {
                // Fallback to reviewing the user directly if no listing exists
                return response()->json(['success' => false, 'message' => 'Professional has no public listing to review.'], 404);
            }
        } else {
            $reviewableType = $morphMap[$data['reviewable_type']];
            $reviewableId = $data['reviewable_id'];
        }

        // Prevent duplicate reviews from the same user
        $existing = Review::where('user_id', $request->user()->id)
            ->where('reviewable_type', $reviewableType)
            ->where('reviewable_id', $reviewableId)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'You have already reviewed this professional.',
            ], 422);
        }

        $review = Review::create([
            'user_id'         => $request->user()->id,
            'reviewable_type' => $reviewableType,
            'reviewable_id'   => $reviewableId,
            'rating'          => $data['rating'],
            'title'           => $data['title'] ?? null,
            'body'            => $body,
            'is_approved'     => true, // Auto-approve for verified project requirements
        ]);

        if (!empty($data['professional_id']) && !empty($data['requirement_id'])) {
            $prof = \App\Models\User::find($data['professional_id']);
            $req = \App\Models\Requirement::find($data['requirement_id']);
            if ($prof && $req) {
                $prof->notify(new \App\Notifications\ReviewReceivedNotification([
                    'reviewer_name' => $request->user()->name,
                    'rating' => $data['rating'],
                    'title' => $req->title
                ]));
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Review submitted successfully!',
        ], 201);
    }

    /**
     * GET /api/v1/user/reviews
     * List the authenticated user's own reviews.
     */
    public function myReviews(Request $request): JsonResponse
    {
        $reviews = Review::where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data'    => ReviewResource::collection($reviews),
        ]);
    }
}
