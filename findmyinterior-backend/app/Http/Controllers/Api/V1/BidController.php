<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Bid;
use App\Models\Requirement;
use App\Services\BidService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BidController extends Controller
{
    private BidService $bidService;

    public function __construct(BidService $bidService)
    {
        $this->bidService = $bidService;
    }

    /**
     * Submit a bid for a requirement
     */
    public function store(Request $request): JsonResponse
    {
        if ($request->user()->cannot('create', Bid::class)) {
            return response()->json(['message' => 'Only verified professionals can bid'], 403);
        }

        $validated = $request->validate([
            'requirement_id' => 'required|exists:requirements,id',
            'estimated_cost' => 'required|numeric|min:0',
            'timeline_days' => 'required|integer|min:1',
            'warranty_months' => 'nullable|integer|min:0',
            'material_included' => 'boolean',
            'labour_included' => 'boolean',
            'design_included' => 'boolean',
            'supervision_included' => 'boolean',
            'portfolio_urls' => 'nullable|array',
            'proposal_message' => 'required|string|max:1000',
        ]);

        // Attempt to auto-fill business details from the user's listing
        $listing = \App\Models\Listing::where('user_id', $request->user()->id)->first();
        
        $validated['company_name'] = $listing ? $listing->title : $request->user()->name;
        $validated['contact_person'] = $request->user()->name;
        $validated['category'] = collect($request->user()->roles)->first() ?? 'Professional';
        $validated['experience_years'] = $listing ? $listing->years_experience : 0;
        $validated['previous_projects_count'] = 0; // Default or calculate from won bids

        $bid = $this->bidService->submitBid($request->user()->id, $validated);

        return response()->json([
            'message' => 'Bid submitted successfully',
            'bid' => $bid
        ], 201);
    }

    /**
     * Get bids submitted by the current user
     */
    public function myBids(Request $request): JsonResponse
    {
        $bids = Bid::with('requirement')
            ->where('professional_id', $request->user()->id)
            ->latest()
            ->paginate(10);
            
        return response()->json($bids);
    }

    /**
     * Get all bids for a specific requirement (Customer only)
     */
    public function indexForRequirement(Request $request, int $requirementId): JsonResponse
    {
        $requirement = Requirement::findOrFail($requirementId);
        
        // Authorization logic here (ideally via Policy)
        if ($requirement->user_id !== $request->user()->id && !$request->user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $bids = Bid::with('professional')
            ->where('requirement_id', $requirementId)
            ->orderByDesc('smart_bid_score')
            ->get();

        return response()->json($bids);
    }

    /**
     * Get a side-by-side comparison matrix of all bids for a requirement
     */
    public function compare(Request $request, int $requirementId): JsonResponse
    {
        $requirement = Requirement::findOrFail($requirementId);
        
        // Authorization
        if ($requirement->user_id !== $request->user()->id && !$request->user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $bids = Bid::with(['professional.vendorMetrics'])
            ->where('requirement_id', $requirementId)
            ->orderByDesc('smart_bid_score')
            ->get();

        $comparison = $bids->map(function ($bid) {
            // Recalculate breakdown for the response
            $scoreBreakdown = app(BidService::class)->calculateSmartScore($bid->professional_id, $bid->toArray());
            return [
                'bid_id' => $bid->id,
                'vendor_id' => $bid->professional_id,
                'company_name' => collect($bid->professional->roles)->firstWhere('slug', 'business') ? $bid->professional->name : null,
                'price' => $bid->amount,
                'experience_years' => null,
                'rating' => $bid->professional->vendorMetrics->score ?? 0.0,
                'projects_completed' => $bid->previous_projects_count,
                'warranty_months' => $bid->warranty_months,
                'timeline_days' => $bid->timeline_days,
                'verification_level' => $bid->professional->verification_level,
                'smart_bid_score' => $bid->smart_bid_score,
                'smart_bid_score_breakdown' => $scoreBreakdown,
                'recommended' => $bid->smart_bid_score >= 7.0, // Mark as recommended if score >= 7
            ];
        });

        return response()->json([
            'requirement_id' => $requirementId,
            'bids_count' => $bids->count(),
            'comparison_matrix' => $comparison
        ]);
    }

    /**
     * Shortlist a bid
     */
    public function accept(Request $request, Bid $bid): JsonResponse
    {
        if ($request->user()->cannot('award', $bid)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $this->bidService->shortlistBid($bid, $request->user());

        return response()->json([
            'message' => 'Bid shortlisted successfully',
            'bid' => $bid->fresh()
        ]);
    }

    public function reject(Request $request, Bid $bid): JsonResponse
    {
        if ($request->user()->cannot('award', $bid)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $bid->update(['status' => 'rejected']);

        return response()->json([
            'message' => 'Bid rejected',
            'bid' => $bid
        ]);
    }

    /**
     * Award the project to a bid
     */
    public function award(Request $request, Bid $bid): JsonResponse
    {
        if ($request->user()->cannot('award', $bid)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $this->bidService->awardBid($bid, $request->user());

        return response()->json([
            'message' => 'Project awarded successfully',
            'bid' => $bid->fresh()
        ]);
    }

    /**
     * Complete the requirement
     */
    public function complete(Request $request, int $requirementId): JsonResponse
    {
        $requirement = Requirement::findOrFail($requirementId);
        
        if ($requirement->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $this->bidService->completeRequirement($requirement, $request->user());

        return response()->json([
            'message' => 'Project completed successfully',
            'requirement' => $requirement->fresh()
        ]);
    }
}
