<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Requirement;
use App\Models\OpportunityType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OpportunityProjectController extends Controller
{
    use \App\Traits\ApiResponse, \App\Traits\ParsesBudget;

    public function index()
    {
        return $this->success(Requirement::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'description'      => 'required|string',
            'city'             => 'required|string',
            'district'         => 'required|string',
            'opportunity_type' => 'required|string',
            'requirement_type' => 'required|string',
            'project_category' => 'nullable|string',
            'budget_min'       => 'nullable|numeric',
            'budget_max'       => 'nullable|numeric',
            'budget'           => 'nullable|string',
            'image'            => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $user = Auth::user();
        if (!$user) {
            return $this->error('Unauthenticated', 401);
        }

        // Parse budget string if budget_min/max are not provided
        $budgetMin = $validated['budget_min'] ?? null;
        $budgetMax = $validated['budget_max'] ?? null;
        $this->parseBudget($validated['budget'] ?? null, $budgetMin, $budgetMax);

        // Resolve target roles from OpportunityType config
        $oppType = OpportunityType::where('type', $validated['requirement_type'])->first();

        $creatorRole = 'homeowner';
        if ($user->roles()->exists()) {
            $firstRole = $user->roles()->first();
            if ($firstRole) {
                $creatorRole = $firstRole->slug;
            }
        }

        $requirement = Requirement::create([
            'user_id'          => $user->id,
            'category_id'      => 1, // Default; no category picker in wizard yet
            'title'            => $validated['title'],
            'description'      => $validated['description'],
            'city'             => $validated['city'],
            'district'         => $validated['district'],
            'project_type'     => $validated['project_category'] ?? 'general',
            'name'             => $user->name,
            'phone'            => $user->phone ?? '0000000000',
            'email'            => $user->email,
            'opportunity_type' => $validated['opportunity_type'],
            'requirement_type' => $validated['requirement_type'],
            'project_category' => $validated['project_category'] ?? null,
            'budget_min'       => $budgetMin,
            'budget_max'       => $budgetMax,
            'creator_role'     => $creatorRole,
            'target_roles'     => $oppType ? $oppType->target_roles : ['interior_designer', 'contractor', 'builder'],
            'status'           => 'open',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $dataUri = \App\Helpers\ImageHelper::toBase64($file, 1200, 80);
            $requirement->image = $dataUri;
            $requirement->save();
        }

        return $this->success($requirement, 'Requirement created successfully', 201);
    }

    public function show(string $id)
    {
        $requirement = Requirement::with(['user', 'bids.professional'])->findOrFail($id);

        $user = Auth::guard('sanctum')->user();
        
        // Unauthenticated users get a basic public view
        if (!$user) {
            $requirement->increment('views_count');
            $requirement->views_count = $requirement->views_count + 1;
            return $this->success($requirement);
        }

        $userRoles = $user->roles->pluck('slug')->toArray();
        $isCreator = $requirement->user_id === $user->id;
        $isAdmin   = in_array('admin', $userRoles);

        if (!$isCreator && !$isAdmin) {
            $requirement->increment('views_count');
            $requirement->views_count = $requirement->views_count + 1;
        }

        // Creator can always see their own requirement
        if ($isCreator || $isAdmin) {
            return $this->success($requirement);
        }

        $isTarget = false;
        if ($requirement->target_roles) {
            foreach ($userRoles as $role) {
                if (in_array($role, $requirement->target_roles)) {
                    $isTarget = true;
                    break;
                }
            }
        } else {
            $isTarget = true;
        }

        if (!$isTarget) {
            return $this->error('Forbidden. This opportunity is not available for your role.', 403);
        }

        return $this->success($requirement);
    }

    public function update(Request $request, string $id)
    {
        $requirement = Requirement::findOrFail($id);
        $requirement->update($request->all());
        return $this->success($requirement, 'Requirement updated successfully');
    }

    public function updateProgress(Request $request, string $id)
    {
        $requirement = Requirement::findOrFail($id);
        $user        = Auth::user();

        $isAdmin = in_array('admin', $user->roles->pluck('slug')->toArray());

        if ($user->id !== $requirement->user_id && !$isAdmin) {
            return $this->error('Unauthorized', 403);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:open,awarded,in_progress,completed,expired',
        ]);

        $requirement->status = $validated['status'];
        $requirement->save();

        return $this->success($requirement, 'Progress updated successfully');
    }

    public function complete(Request $request, string $id)
    {
        $requirement = Requirement::findOrFail($id);
        $user        = Auth::user();

        if ($user->id !== $requirement->user_id) {
            return $this->error('Only the client can complete the project', 403);
        }

        $requirement->status       = 'completed';
        $requirement->completed_at = now();
        $requirement->save();

        return $this->success($requirement, 'Project completed');
    }

    public function destroy(string $id)
    {
        Requirement::destroy($id);
        return $this->success(null, 'Requirement deleted');
    }
}
