<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\WorkerJob;
use App\Models\OpportunityType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JobController extends Controller
{
    public function index()
    {
        return response()->json(WorkerJob::latest()->get());
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
        ]);

        $oppType = OpportunityType::where('type', $validated['requirement_type'])->first();

        $job = WorkerJob::create([
            'user_id' => Auth::id() ?? 1,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'city' => $validated['city'],
            'district' => $validated['district'],
            'opportunity_type' => $validated['opportunity_type'],
            'requirement_type' => $validated['requirement_type'],
            'creator_role' => Auth::check() ? Auth::user()->roles->first()->slug ?? 'homeowner' : 'homeowner',
            'target_roles' => $oppType ? $oppType->target_roles : ['worker', 'contractor'],
            'status' => 'open'
        ]);

        return response()->json(['status' => 'success', 'data' => $job], 201);
    }

    public function show(string $id)
    {
        $job = WorkerJob::with(['user', 'bids.professional'])->findOrFail($id);
        
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $userRoles = $user->roles->pluck('slug')->toArray();
        $isCreator = $job->user_id === $user->id;
        
        $isTarget = false;
        if ($job->target_roles) {
            foreach ($userRoles as $role) {
                if (in_array($role, $job->target_roles)) {
                    $isTarget = true;
                    break;
                }
            }
        } else {
            $isTarget = true; 
        }

        if (!$isCreator && !$isTarget) {
            return response()->json(['message' => 'Forbidden. This Job is not available for your role.'], 403);
        }

        return response()->json(['status' => 'success', 'data' => $job]);
    }

    public function update(Request $request, string $id)
    {
        $job = WorkerJob::findOrFail($id);
        $job->update($request->all());
        return response()->json(['status' => 'success', 'data' => $job]);
    }

    public function updateProgress(Request $request, string $id)
    {
        $job = WorkerJob::findOrFail($id);
        $user = Auth::user();
        
        if ($user->id !== $job->user_id && $user->id !== $job->worker_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:posted,receiving_applications,awarded,in_progress,completed'
        ]);

        $job->status = $validated['status'];
        $job->save();

        return response()->json(['status' => 'success', 'data' => $job]);
    }

    public function destroy(string $id)
    {
        WorkerJob::destroy($id);
        return response()->json(['status' => 'success']);
    }
}
