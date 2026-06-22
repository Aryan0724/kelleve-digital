<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    /**
     * Get a list of projects for the authenticated user.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        
        $projects = Project::with(['requirement', 'professional', 'client'])
            ->where(function ($query) use ($user) {
                $query->where('client_id', $user->id)
                      ->orWhere('professional_id', $user->id);
            })
            ->latest()
            ->get();
            
        return response()->json(['data' => $projects]);
    }

    /**
     * Get details of a specific project.
     */
    public function show($id)
    {
        $project = Project::with(['requirement', 'professional', 'client', 'winningBid', 'conversation'])->findOrFail($id);
        
        $this->authorize('view', $project);
        
        return response()->json(['data' => $project]);
    }

    /**
     * Mark a project as completed (Client only).
     */
    public function complete($id)
    {
        $project = Project::findOrFail($id);
        
        $this->authorize('complete', $project);
        
        // Use the BidService to complete the requirement and handle side effects
        $bidService = app(\App\Services\BidService::class);
        $bidService->completeRequirement($project->requirement, Auth::user());
        
        return response()->json(['message' => 'Project marked as completed successfully.']);
    }

    /**
     * Mark progress on a project (Professional only).
     */
    public function markProgress(Request $request, $id)
    {
        $project = Project::findOrFail($id);
        
        $this->authorize('markProgress', $project);
        
        $request->validate([
            'status' => 'required|in:in_progress,on_hold',
        ]);
        
        $project->update([
            'status' => $request->status,
        ]);
        
        // Log Activity
        \DB::table('activity_logs')->insert([
            'user_id' => Auth::id(),
            'subject_type' => 'App\\Models\\Project',
            'subject_id' => $project->id,
            'event_type' => 'Project Progress Updated',
            'description' => "Professional marked project status as {$request->status}.",
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        return response()->json(['message' => 'Project progress updated.']);
    }
}
