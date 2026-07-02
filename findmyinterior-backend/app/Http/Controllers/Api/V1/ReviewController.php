<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Review;
use App\Models\User;
use App\Services\VendorMetricService;
use App\Services\TrustScoreService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Submit a review for a completed project.
     */
    public function store(Request $request, $projectId)
    {
        $project = Project::findOrFail($projectId);
        
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'required|string',
        ]);
        
        // 1. Validate project is completed
        if ($project->status !== 'completed') {
            return response()->json(['message' => 'You can only review completed projects.'], 403);
        }
        
        $user = Auth::user();
        
        // 2. Validate user is part of the project
        if ($user->id !== $project->user_id && $user->id !== $project->professional_id) {
            return response()->json(['message' => 'Unauthorized to review this project.'], 403);
        }
        
        // Determine role and reviewed user
        $roleOfReviewer = ($user->id === $project->user_id) ? 'homeowner' : 'professional';
        $reviewedUserId = ($user->id === $project->user_id) ? $project->professional_id : $project->user_id;
        
        // 3. Ensure no duplicate review
        $existingReview = Review::where('project_id', $project->id)
            ->where('reviewer_id', $user->id)
            ->first();
            
        if ($existingReview) {
            return response()->json(['message' => 'You have already reviewed this project.'], 409);
        }
        
        // 4. Create the review
        $review = Review::create([
            'project_id' => $project->id,
            'reviewer_id' => $user->id,
            'reviewed_user_id' => $reviewedUserId,
            'rating' => $request->rating,
            'body' => $request->review,
            'role_of_reviewer' => $roleOfReviewer,
            'is_approved' => true, // Auto-approve for now
        ]);
        // 5. Update Vendor Metrics if the reviewed user is a professional
        if ($roleOfReviewer === 'homeowner') {
            app(VendorMetricService::class)->recordReview($reviewedUserId, $request->rating);
        }

        // 6. Recalculate Trust Score for the reviewed user
        $reviewedUser = User::find($reviewedUserId);
        if ($reviewedUser) {
            app(TrustScoreService::class)->recalculateForUser($reviewedUser);
        }

        // 7. Emit Event / Log Activity
        event(new \App\Events\ReviewSubmitted($review));
        
        \DB::table('activity_logs')->insert([
            'user_id' => $user->id,
            'subject_type' => 'App\\Models\\Project',
            'subject_id' => $project->id,
            'event_type' => 'Review Submitted',
            'description' => ucfirst($roleOfReviewer) . " submitted a {$request->rating}-star review.",
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        return response()->json(['message' => 'Review submitted successfully.', 'data' => $review]);
    }
}
