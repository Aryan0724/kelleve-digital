<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Requirement;
use App\Models\OpportunityType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OpportunityProjectController extends Controller
{
    public function index()
    {
        return response()->json(Requirement::latest()->get());
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
        ]);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

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
            'budget_min'       => $validated['budget_min'] ?? null,
            'budget_max'       => $validated['budget_max'] ?? null,
            'creator_role'     => $creatorRole,
            'target_roles'     => $oppType ? $oppType->target_roles : ['interior_designer', 'contractor', 'builder'],
            'status'           => 'open',
        ]);

        if ($request->hasFile('image')) {
            $file     = $request->file('image');
            $filename = 'req_' . $requirement->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $path     = $file->storeAs('requirements', $filename, 'public');
            \App\Models\RequirementImage::create([
                'requirement_id' => $requirement->id,
                'image_url'      => asset('storage/' . $path),
            ]);
        }

        return response()->json(['status' => 'success', 'data' => $requirement], 201);
    }

    public function show(string $id)
    {
        $requirement = Requirement::with(['user', 'bids.professional'])->findOrFail($id);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $userRoles = $user->roles->pluck('slug')->toArray();
        $isCreator = $requirement->user_id === $user->id;
        $isAdmin   = in_array('admin', $userRoles);

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

        if (!$isCreator && !$isTarget && !$isAdmin) {
            return response()->json(['message' => 'Forbidden. This opportunity is not available for your role.'], 403);
        }

        return response()->json(['status' => 'success', 'data' => $requirement]);
    }

    public function update(Request $request, string $id)
    {
        $requirement = Requirement::findOrFail($id);
        $requirement->update($request->all());
        return response()->json(['status' => 'success', 'data' => $requirement]);
    }

    public function updateProgress(Request $request, string $id)
    {
        $requirement = Requirement::findOrFail($id);
        $user        = Auth::user();

        $isAdmin = in_array('admin', $user->roles->pluck('slug')->toArray());

        if ($user->id !== $requirement->user_id && !$isAdmin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:open,awarded,in_progress,completed,expired',
        ]);

        $requirement->status = $validated['status'];
        $requirement->save();

        return response()->json(['status' => 'success', 'data' => $requirement]);
    }

    public function complete(Request $request, string $id)
    {
        $requirement = Requirement::findOrFail($id);
        $user        = Auth::user();

        if ($user->id !== $requirement->user_id) {
            return response()->json(['message' => 'Only the client can complete the project'], 403);
        }

        $requirement->status       = 'completed';
        $requirement->completed_at = now();
        $requirement->save();

        return response()->json(['status' => 'success', 'data' => $requirement]);
    }

    public function destroy(string $id)
    {
        Requirement::destroy($id);
        return response()->json(['status' => 'success']);
    }
}
