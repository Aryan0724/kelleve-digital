<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\WorkerJob;
use App\Models\OpportunityType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JobController extends Controller
{
    use \App\Traits\ApiResponse, \App\Traits\ParsesBudget;

    public function index()
    {
        return $this->success(WorkerJob::latest()->get());
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
            'daily_rate' => 'nullable|string',
            'duration' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $user = Auth::user();
        if (!$user) {
            return $this->error('Unauthenticated', 401);
        }

        $budgetMin = null;
        $budgetMax = null;
        $this->parseBudget($validated['daily_rate'] ?? null, $budgetMin, $budgetMax);
        $dailyRate = $budgetMin;

        $oppType = OpportunityType::where('type', $validated['requirement_type'])->first();

        $creatorRole = 'homeowner';
        if ($user->roles()->exists()) {
            $firstRole = $user->roles()->first();
            if ($firstRole) {
                $creatorRole = $firstRole->slug;
            }
        }

        $job = WorkerJob::create([
            'user_id' => $user->id,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'city' => $validated['city'],
            'district' => $validated['district'],
            'opportunity_type' => $validated['opportunity_type'],
            'requirement_type' => $validated['requirement_type'],
            'daily_rate' => $dailyRate,
            'duration' => $validated['duration'] ?? '1 day',
            'creator_role' => $creatorRole,
            'target_roles' => $oppType ? $oppType->target_roles : ['worker'],
            'status' => 'open'
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $job->image = \App\Helpers\ImageHelper::toBase64($file, 1200, 80);
            $job->save();
        }

        return $this->success($job, 'Job created successfully', 201);
    }

    public function show(string $id)
    {
        $job = WorkerJob::with(['user', 'category', 'applications.worker'])->findOrFail($id);

        $user = Auth::user();
        
        if (!$user) {
            $job->increment('views_count');
            return $this->success($job);
        }

        $userRoles = $user->roles->pluck('slug')->toArray();
        $isCreator = $job->user_id === $user->id;
        $isAdmin = in_array('admin', $userRoles);

        if (!$isCreator && !$isAdmin) {
            $job->increment('views_count');
        }

        // Creator or admin can always see their own job
        if ($isCreator || $isAdmin) {
            return $this->success($job);
        }
        
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

        if (!$isTarget) {
            return $this->error('Forbidden. This Job is not available for your role.', 403);
        }

        return $this->success($job);
    }

    public function update(Request $request, string $id)
    {
        $job = WorkerJob::findOrFail($id);
        $job->update($request->all());
        return $this->success($job, 'Job updated successfully');
    }

    public function updateProgress(Request $request, string $id)
    {
        $job = WorkerJob::findOrFail($id);
        $user = Auth::user();
        
        if ($user->id !== $job->user_id && $user->id !== $job->worker_id) {
            return $this->error('Unauthorized', 403);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:posted,receiving_applications,awarded,in_progress,completed'
        ]);

        $job->status = $validated['status'];
        $job->save();

        return $this->success($job, 'Progress updated successfully');
    }

    public function destroy(string $id)
    {
        WorkerJob::destroy($id);
        return $this->success(null, 'Job deleted');
    }
}
