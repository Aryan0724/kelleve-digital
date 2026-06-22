<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\OpportunityType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OpportunityProjectController extends Controller
{
    public function index()
    {
        return response()->json(Project::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'city' => 'required|string',
            'district' => 'required|string',
            'opportunity_type' => 'required|string',
            'requirement_type' => 'required|string',
            'project_category' => 'nullable|string',
            'budget_min' => 'nullable|numeric',
            'budget_max' => 'nullable|numeric',
        ]);

        // Get target roles from OpportunityType
        $oppType = OpportunityType::where('type', $validated['requirement_type'])->first();

        $project = Project::create([
            'user_id' => Auth::id() ?? 1, // fallback for testing
            'title' => $validated['title'],
            'description' => $validated['description'],
            'city' => $validated['city'],
            'district' => $validated['district'],
            'opportunity_type' => $validated['opportunity_type'],
            'requirement_type' => $validated['requirement_type'],
            'project_category' => $validated['project_category'] ?? null,
            'budget_min' => $validated['budget_min'] ?? null,
            'budget_max' => $validated['budget_max'] ?? null,
            'creator_role' => Auth::check() ? Auth::user()->roles->first()->slug ?? 'homeowner' : 'homeowner',
            'target_roles' => $oppType ? $oppType->target_roles : ['interior_designer', 'contractor', 'builder'], // Default targets if missing
            'status' => 'open'
        ]);

        return response()->json(['status' => 'success', 'data' => $project], 201);
    }

    public function show(string $id)
    {
        $project = Project::with(['user', 'bids.professional'])->findOrFail($id);
        
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $userRoles = $user->roles->pluck('slug')->toArray();
        $isCreator = $project->user_id === $user->id;
        
        // Check if user is creator OR user has a role that is in target_roles
        $isTarget = false;
        if ($project->target_roles) {
            foreach ($userRoles as $role) {
                if (in_array($role, $project->target_roles)) {
                    $isTarget = true;
                    break;
                }
            }
        } else {
            // Fallback: if no target roles, allow everyone
            $isTarget = true; 
        }

        if (!$isCreator && !$isTarget) {
            return response()->json(['message' => 'Forbidden. This opportunity is not available for your role.'], 403);
        }

        // Hide specific details from non-creators if not unlocked, etc. (existing logic handled elsewhere, but we return the model for now)

        return response()->json(['status' => 'success', 'data' => $project]);
    }

    public function update(Request $request, string $id)
    {
        $project = Project::findOrFail($id);
        $project->update($request->all());
        return response()->json(['status' => 'success', 'data' => $project]);
    }

    public function updateProgress(Request $request, string $id)
    {
        $project = Project::findOrFail($id);
        $user = Auth::user();
        
        // Only professional or client can update progress
        if ($user->id !== $project->user_id && $user->id !== $project->professional_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:awarded,in_progress,completion_requested,completed,cancelled'
        ]);

        $project->status = $validated['status'];
        if ($validated['status'] === 'in_progress' && !$project->started_at) {
            $project->started_at = now();
        }
        $project->save();

        return response()->json(['status' => 'success', 'data' => $project]);
    }

    public function complete(Request $request, string $id)
    {
        $project = Project::findOrFail($id);
        $user = Auth::user();
        
        if ($user->id !== $project->user_id) {
            return response()->json(['message' => 'Only the client can complete the project'], 403);
        }

        $project->status = 'completed';
        $project->completed_at = now();
        $project->save();

        return response()->json(['status' => 'success', 'data' => $project]);
    }

    public function destroy(string $id)
    {
        Project::destroy($id);
        return response()->json(['status' => 'success']);
    }
}
