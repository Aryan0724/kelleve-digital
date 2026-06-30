<?php

namespace App\Http\Controllers;

use App\Models\Bid;
use App\Models\Requirement;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BidController extends Controller
{
    /**
     * Store a newly created bid.
     * POST /api/v1/bids
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'requirement_id' => 'required|exists:projects,id',
            'amount' => 'required|numeric|min:1',
            'proposal_message' => 'required|string|max:2000',
            'timeline_days' => 'required|integer|min:1',
            'warranty_months' => 'nullable|integer|min:0',
            'material_included' => 'nullable|boolean',
            'labour_included' => 'nullable|boolean',
            'design_included' => 'nullable|boolean',
            'supervision_included' => 'nullable|boolean',
            'portfolio_urls' => 'nullable|array',
            'previous_projects_count' => 'nullable|integer|min:0',
        ]);

        $user = Auth::user();

        // Must be a business/pro to bid
        if (!$user->isBusiness() && !$user->isWorker() && !$user->isBuilder()) {
            return response()->json(['message' => 'Only professionals can bid on requirements.'], 403);
        }

        $requirement = Requirement::findOrFail($validated['requirement_id']);

        // Cannot bid on own requirement
        if ($requirement->user_id === $user->id) {
            return response()->json(['message' => 'You cannot bid on your own requirement.'], 403);
        }

        // Only one bid per requirement per user
        $existingBid = Bid::where('requirement_id', $requirement->id)
                          ->where('professional_id', $user->id)
                          ->first();

        if ($existingBid) {
            return response()->json(['message' => 'You have already submitted a bid for this requirement.'], 422);
        }

        $bid = Bid::create([
            'requirement_id' => $requirement->id,
            'professional_id' => $user->id,
            'amount' => $validated['amount'],
            'proposal_message' => $validated['proposal_message'],
            'timeline_days' => $validated['timeline_days'],
            'warranty_months' => $validated['warranty_months'] ?? 0,
            'material_included' => $validated['material_included'] ?? false,
            'labour_included' => $validated['labour_included'] ?? false,
            'design_included' => $validated['design_included'] ?? false,
            'supervision_included' => $validated['supervision_included'] ?? false,
            'portfolio_urls' => $validated['portfolio_urls'] ?? null,
            'previous_projects_count' => $validated['previous_projects_count'] ?? 0,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Bid submitted successfully',
            'data' => $bid
        ], 201);
    }

    /**
     * Get bids for a specific requirement.
     * GET /api/v1/requirements/{id}/bids
     */
    public function indexForRequirement(Request $request, $id): JsonResponse
    {
        $requirement = Requirement::findOrFail($id);
        $user = Auth::user();

        // Only the owner of the requirement or an admin can see all bids
        if ($requirement->user_id !== $user->id && !$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized to view bids for this requirement.'], 403);
        }

        $bids = Bid::with('professional:id,name,avatar,phone,email')
                   ->where('requirement_id', $id)
                   ->latest()
                   ->get();

        return response()->json([
            'data' => $bids
        ]);
    }

    /**
     * Get bids submitted by the authenticated professional.
     * GET /api/v1/user/bids
     */
    public function myBids(Request $request): JsonResponse
    {
        $bids = Bid::with('requirement.category')
                   ->where('professional_id', Auth::id())
                   ->latest()
                   ->get();

        return response()->json([
            'data' => $bids
        ]);
    }

    /**
     * Accept a bid.
     * PATCH /api/v1/bids/{id}/accept
     */
    public function accept(Bid $bid): JsonResponse
    {
        $user = Auth::user();

        // Only the requirement owner can accept
        if ($bid->requirement->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        // Check if any other bid is already accepted for this requirement
        $alreadyAccepted = Bid::where('requirement_id', $bid->requirement_id)
                              ->where('status', 'accepted')
                              ->exists();

        if ($alreadyAccepted) {
            return response()->json(['message' => 'Another bid has already been accepted.'], 422);
        }

        DB::transaction(function () use ($bid) {
            $bid->update(['status' => 'accepted']);
            
            // Optionally, mark other bids as rejected
            Bid::where('requirement_id', $bid->requirement_id)
               ->where('id', '!=', $bid->id)
               ->update(['status' => 'rejected']);
               
            // Close the requirement
            $bid->requirement->update(['status' => 'closed']);
        });

        return response()->json([
            'message' => 'Bid accepted successfully.',
            'data' => $bid->fresh()
        ]);
    }

    /**
     * Reject a bid.
     * PATCH /api/v1/bids/{id}/reject
     */
    public function reject(Bid $bid): JsonResponse
    {
        $user = Auth::user();

        // Only the requirement owner can reject
        if ($bid->requirement->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if ($bid->status === 'accepted') {
            return response()->json(['message' => 'Cannot reject an already accepted bid.'], 422);
        }

        $bid->update(['status' => 'rejected']);

        return response()->json([
            'message' => 'Bid rejected successfully.',
            'data' => $bid
        ]);
    }
}
