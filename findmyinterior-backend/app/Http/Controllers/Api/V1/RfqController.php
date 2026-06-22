<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Rfq;
use App\Models\OpportunityType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RfqController extends Controller
{
    public function index()
    {
        return response()->json(Rfq::latest()->get());
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

        $rfq = Rfq::create([
            'user_id' => Auth::id() ?? 1,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'city' => $validated['city'],
            'district' => $validated['district'],
            'opportunity_type' => $validated['opportunity_type'],
            'requirement_type' => $validated['requirement_type'],
            'creator_role' => Auth::check() ? Auth::user()->roles->first()->slug ?? 'homeowner' : 'homeowner',
            'target_roles' => $oppType ? $oppType->target_roles : ['supplier'],
            'status' => 'open'
        ]);

        return response()->json(['status' => 'success', 'data' => $rfq], 201);
    }

    public function show(string $id)
    {
        $rfq = Rfq::with(['user', 'bids.professional'])->findOrFail($id);
        
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $userRoles = $user->roles->pluck('slug')->toArray();
        $isCreator = $rfq->user_id === $user->id;
        
        $isTarget = false;
        if ($rfq->target_roles) {
            foreach ($userRoles as $role) {
                if (in_array($role, $rfq->target_roles)) {
                    $isTarget = true;
                    break;
                }
            }
        } else {
            $isTarget = true; 
        }

        if (!$isCreator && !$isTarget) {
            return response()->json(['message' => 'Forbidden. This RFQ is not available for your role.'], 403);
        }

        return response()->json(['status' => 'success', 'data' => $rfq]);
    }

    public function update(Request $request, string $id)
    {
        $rfq = Rfq::findOrFail($id);
        $rfq->update($request->all());
        return response()->json(['status' => 'success', 'data' => $rfq]);
    }

    public function updateProgress(Request $request, string $id)
    {
        $rfq = Rfq::findOrFail($id);
        $user = Auth::user();
        
        if ($user->id !== $rfq->user_id && $user->id !== $rfq->supplier_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:posted,receiving_quotes,awarded,in_progress,completed,fulfilled'
        ]);

        $rfq->status = $validated['status'];
        $rfq->save();

        return response()->json(['status' => 'success', 'data' => $rfq]);
    }

    public function destroy(string $id)
    {
        Rfq::destroy($id);
        return response()->json(['status' => 'success']);
    }
}
