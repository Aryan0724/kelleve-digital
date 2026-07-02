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
            'professional_id' => ['required', 'integer'],
            'requirement_id'  => ['nullable', 'integer'], // Maps to project_id
            'rating'          => ['required', 'integer', 'min:1', 'max:5'],
            'title'           => ['nullable', 'string', 'max:255'],
            'body'            => ['nullable', 'string', 'min:5', 'max:2000'],
            'review_text'     => ['nullable', 'string', 'max:2000'],
        ]);

        $body = $data['body'] ?? $data['review_text'] ?? '';
        $reviewer = $request->user();

        // Prevent duplicate reviews from the same user for the same professional
        $query = Review::where('reviewer_id', $reviewer->id)
            ->where('reviewed_user_id', $data['professional_id']);

        if (!empty($data['requirement_id'])) {
            $query->where('project_id', $data['requirement_id']);
        }

        if ($query->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'You have already reviewed this professional.',
            ], 422);
        }

        $review = Review::create([
            'reviewer_id'      => $reviewer->id,
            'reviewed_user_id' => $data['professional_id'],
            'project_id'       => $data['requirement_id'] ?? null,
            'role_of_reviewer' => $reviewer->roles()->first()?->slug ?? 'customer',
            'rating'           => $data['rating'],
            'title'            => $data['title'] ?? null,
            'body'             => $body,
            'is_approved'      => true, // Auto-approve for verified project requirements
        ]);

        $prof = \App\Models\User::find($data['professional_id']);
        if ($prof) {
            $req = !empty($data['requirement_id']) ? \App\Models\Project::find($data['requirement_id']) : null;
            $prof->notify(new \App\Notifications\ReviewReceivedNotification([
                'reviewer_name' => $reviewer->name,
                'rating' => $data['rating'],
                'title' => $req ? $req->title : 'their services'
            ]));
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
        $reviews = Review::where('reviewer_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data'    => ReviewResource::collection($reviews),
        ]);
    }
}
