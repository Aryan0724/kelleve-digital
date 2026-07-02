<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Rfq;
use App\Models\OpportunityType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RfqController extends Controller
{
    use \App\Traits\ApiResponse, \App\Traits\ParsesBudget;

    public function index()
    {
        return $this->success(Rfq::latest()->get());
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
            'budget' => 'nullable|string',
            'quantity' => 'nullable|string',
            'material_type' => 'nullable|string',
            'delivery_location' => 'nullable|string',
            'image'            => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $user = Auth::user();
        if (!$user) {
            return $this->error('Unauthenticated', 401);
        }

        $budgetMin = null;
        $budgetMax = null;
        $this->parseBudget($validated['budget'] ?? null, $budgetMin, $budgetMax);

        $oppType = OpportunityType::where('type', $validated['requirement_type'])->first();

        $creatorRole = 'homeowner';
        if ($user->roles()->exists()) {
            $firstRole = $user->roles()->first();
            if ($firstRole) {
                $creatorRole = $firstRole->slug;
            }
        }

        $rfq = Rfq::create([
            'user_id' => $user->id,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'city' => $validated['city'],
            'district' => $validated['district'],
            'opportunity_type' => $validated['opportunity_type'],
            'requirement_type' => $validated['requirement_type'],
            'budget_min' => $budgetMin,
            'budget_max' => $budgetMax,
            'quantity' => $validated['quantity'] ?? null,
            'material_type' => $validated['material_type'] ?? null,
            'delivery_location' => $validated['delivery_location'] ?? $validated['city'],
            'creator_role' => $creatorRole,
            'target_roles' => $oppType ? $oppType->target_roles : ['supplier'],
            'status' => 'open'
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $rfq->image = \App\Helpers\ImageHelper::toBase64($file, 1200, 80);
            $rfq->save();
        }

        return $this->success($rfq, 'RFQ created successfully', 201);
    }

    public function show(string $id)
    {
        $rfq = Rfq::with(['user', 'bids.professional'])->findOrFail($id);
        
        $user = Auth::guard('sanctum')->user();
        
        // Unauthenticated users get a basic public view
        if (!$user) {
            $rfq->increment('views_count');
            $rfq->views_count = $rfq->views_count + 1;
            return $this->success($rfq);
        }

        $userRoles = $user->roles->pluck('slug')->toArray();
        $isCreator = $rfq->user_id === $user->id;
        $isAdmin   = in_array('admin', $userRoles);

        if (!$isCreator && !$isAdmin) {
            $rfq->increment('views_count');
            $rfq->views_count = $rfq->views_count + 1;
        }

        // Creator or admin can always see their own RFQ
        if ($isCreator || $isAdmin) {
            return $this->success($rfq);
        }
        
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

        if (!$isTarget) {
            return $this->error('Forbidden. This RFQ is not available for your role.', 403);
        }

        return $this->success($rfq);
    }

    public function update(Request $request, string $id)
    {
        $rfq = Rfq::findOrFail($id);
        $rfq->update($request->all());
        return $this->success($rfq, 'RFQ updated successfully');
    }

    public function updateProgress(Request $request, string $id)
    {
        $rfq = Rfq::findOrFail($id);
        $user = Auth::user();
        
        if ($user->id !== $rfq->user_id && $user->id !== $rfq->supplier_id) {
            return $this->error('Unauthorized', 403);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:posted,receiving_quotes,awarded,in_progress,completed,fulfilled'
        ]);

        $rfq->status = $validated['status'];
        $rfq->save();

        return $this->success($rfq, 'Progress updated successfully');
    }

    public function destroy(string $id)
    {
        Rfq::destroy($id);
        return $this->success(null, 'RFQ deleted');
    }
}
