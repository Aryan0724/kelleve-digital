<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use \App\Models\Bid;
use \App\Models\Requirement;
use App\Services\BidService;
use App\Services\WalletService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BidController extends Controller
{
    use \App\Traits\ApiResponse;

    private BidService $bidService;
    private WalletService $walletService;

    public function __construct(BidService $bidService, WalletService $walletService)
    {
        $this->bidService = $bidService;
        $this->walletService = $walletService;
    }

    /**
     * Submit a bid for a requirement
     */
    public function store(Request $request): JsonResponse
    {
        if ($request->user()->cannot('create', Bid::class)) {
            return $this->error('Only verified professionals can bid', 403);
        }

        $validated = $request->validate([
            'requirement_id' => 'required|integer',
            'requirement_type' => 'nullable|string|in:project,rfq,job',
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
        // Default to 'project' when omitted — most bids are for project requirements
        $validated['requirement_type'] = $validated['requirement_type'] ?? 'project';

        $modelClass = \App\Models\Requirement::class;
        $morphType = 'Project'; // Must match morphMap in AppServiceProvider
        if ($validated['requirement_type'] === 'rfq') {
            $modelClass = \App\Models\Rfq::class;
            $morphType = 'Rfq';
        }
        if ($validated['requirement_type'] === 'job') {
            $modelClass = \App\Models\WorkerJob::class;
            $morphType = 'WorkerJob';
        }
        
        $validated['requirement_type'] = $morphType; // override for DB
        $validated['requirement_type_class'] = $modelClass;

        // Attempt to auto-fill business details from the user's listing
        $listing = \App\Models\Listing::where('user_id', $request->user()->id)->first();
        
        $validated['company_name'] = $listing ? $listing->title : $request->user()->name;
        $validated['contact_person'] = $request->user()->name;
        $validated['category'] = collect($request->user()->roles)->first() ?? 'Professional';
        $validated['experience_years'] = $listing ? $listing->years_experience : 0;
        $validated['previous_projects_count'] = 0; // Default or calculate from won bids

        // Determine primary role to fetch specific bid fee
        $userRoles = $request->user()->roles->pluck('slug')->toArray();
        $primaryRole = count($userRoles) > 0 ? $userRoles[0] : 'worker';
        if ($primaryRole === 'designer') $primaryRole = 'interior'; // Map designer to interior if needed
        
        $settingKey = 'bid_fee_' . $primaryRole;
        $feeSetting = \App\Models\Setting::where('key', $settingKey)->first();
        $fee = $feeSetting ? (float) $feeSetting->value : 10.00; // fallback to 10.00
        
        if ($fee > 0) {
            $balance = $this->walletService->getBalance($request->user());
            if ($balance < $fee) {
                return $this->error("Insufficient wallet balance to submit bid. Please recharge ₹{$fee}.", 402);
            }
            
            try {
                $this->walletService->deduct(
                    $request->user(), 
                    $fee, 
                    "Fee for submitting bid on requirement #{$validated['requirement_id']}",
                    ['reference_type' => $morphType, 'reference_id' => $validated['requirement_id']]
                );
            } catch (\Exception $e) {
                return $this->error('Failed to process bid fee: ' . $e->getMessage(), 400);
            }
        }

        $bid = $this->bidService->submitBid($request->user()->id, $validated);

        return $this->success($bid, 'Bid submitted successfully', 201);
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
        $type = $request->query('requirement_type', 'project');
        $modelClasses = [\App\Models\Requirement::class, \App\Models\Project::class, 'Project', 'Requirement'];
        
        if ($type === 'rfq') {
            $modelClasses = [\App\Models\Rfq::class, 'Rfq'];
            $requirement = \App\Models\Rfq::findOrFail($requirementId);
        } else if ($type === 'job') {
            $modelClasses = [\App\Models\WorkerJob::class, 'WorkerJob'];
            $requirement = \App\Models\WorkerJob::findOrFail($requirementId);
        } else {
            $requirement = \App\Models\Requirement::findOrFail($requirementId);
        }
        
        // Authorization logic here (ideally via Policy)
        if ($requirement->user_id !== $request->user()->id && !$request->user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $bids = Bid::with('professional')
            ->where('requirement_id', $requirementId)
            ->whereIn('requirement_type', $modelClasses)
            ->orderByDesc('smart_bid_score')
            ->get();

        return response()->json($bids);
    }

    /**
     * Get a side-by-side comparison matrix of all bids for a requirement
     */
    public function compare(Request $request, int $requirementId): JsonResponse
    {
        $type = $request->query('requirement_type', 'project');
        $modelClasses = [\App\Models\Requirement::class, \App\Models\Project::class, 'Project', 'Requirement'];
        
        if ($type === 'rfq') {
            $modelClasses = [\App\Models\Rfq::class, 'Rfq'];
            $requirement = \App\Models\Rfq::findOrFail($requirementId);
        } else if ($type === 'job') {
            $modelClasses = [\App\Models\WorkerJob::class, 'WorkerJob'];
            $requirement = \App\Models\WorkerJob::findOrFail($requirementId);
        } else {
            $requirement = \App\Models\Requirement::findOrFail($requirementId);
        }
        
        // Authorization
        if ($requirement->user_id !== $request->user()->id && !$request->user()->hasRole('admin')) {
            return $this->error('Unauthorized', 403);
        }

        $bids = Bid::with(['professional.vendorMetrics'])
            ->where('requirement_id', $requirementId)
            ->whereIn('requirement_type', $modelClasses)
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

        return $this->success([
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
            return $this->error('Unauthorized', 403);
        }

        $requirement = $bid->requirement;
        if (in_array($requirement->status, ['awarded', 'in_progress', 'completed', 'fulfilled', 'expired', 'closed'])) {
            return $this->error("Cannot shortlist bid for a requirement that is {$requirement->status}.", 400);
        }

        $this->bidService->shortlistBid($bid, $request->user());

        return $this->success($bid->fresh(), 'Bid shortlisted successfully');
    }

    public function reject(Request $request, Bid $bid): JsonResponse
    {
        if ($request->user()->cannot('award', $bid)) {
            return $this->error('Unauthorized', 403);
        }

        $bid->update(['status' => 'rejected']);

        return $this->success($bid, 'Bid rejected');
    }

    /**
     * Award the project to a bid
     */
    public function award(Request $request, Bid $bid): JsonResponse
    {
        if ($request->user()->cannot('award', $bid)) {
            return $this->error('Unauthorized', 403);
        }

        $requirement = $bid->requirement;
        if (in_array($requirement->status, ['awarded', 'in_progress', 'completed', 'fulfilled', 'expired', 'closed'])) {
            return $this->error("Cannot award project that is already {$requirement->status}.", 400);
        }

        $this->bidService->awardBid($bid, $request->user());

        return $this->success($bid->fresh(), 'Project awarded successfully');
    }

    /**
     * Professional accepts the awarded project
     */
    public function acceptAward(Request $request, int $requirementId): JsonResponse
    {
        $type = $request->query('requirement_type', 'project');
        $modelClass = \App\Models\Requirement::class;
        if ($type === 'rfq') $modelClass = \App\Models\Rfq::class;
        if ($type === 'job') $modelClass = \App\Models\WorkerJob::class;
        
        $requirement = $modelClass::findOrFail($requirementId);
        
        $professionalId = $requirement->professional_id ?? $requirement->worker_id ?? $requirement->supplier_id;

        if ($professionalId !== $request->user()->id) {
            return $this->error('Unauthorized', 403);
        }

        if ($requirement->status !== 'awarded') {
            return $this->error("Cannot accept a project that is {$requirement->status}. Project must be 'awarded'.", 400);
        }

        // Project accepted, moves to In Progress
        if ($modelClass === \App\Models\Requirement::class || $modelClass === \App\Models\Project::class) {
            $requirement->update(['status' => 'in_progress']);
        } else if ($modelClass === \App\Models\Rfq::class) {
            $requirement->update(['status' => 'in_progress']);
        } else if ($modelClass === \App\Models\WorkerJob::class) {
            $requirement->update(['status' => 'in_progress']);
        }

        \Illuminate\Support\Facades\DB::table('activity_logs')->insert([
            'subject_type' => $requirement->getMorphClass(),
            'subject_id' => $requirement->id,
            'user_id' => $request->user()->id,
            'event_type' => 'Project Accepted',
            'description' => "Professional accepted the awarded project. Work has begun.",
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return $this->success($requirement->fresh(), 'Project accepted successfully');
    }

    /**
     * Complete the requirement
     */
    public function complete(Request $request, int $requirementId): JsonResponse
    {
        $type = $request->query('requirement_type', 'project');
        $modelClass = \App\Models\Requirement::class;
        if ($type === 'rfq') $modelClass = \App\Models\Rfq::class;
        if ($type === 'job') $modelClass = \App\Models\WorkerJob::class;
        
        $requirement = $modelClass::findOrFail($requirementId);
        
        if ($requirement->user_id !== $request->user()->id) {
            return $this->error('Unauthorized', 403);
        }

        if ($requirement->status !== 'in_progress') {
            return $this->error("Cannot complete a project that is {$requirement->status}. Project must be 'in_progress'.", 400);
        }

        $this->bidService->completeRequirement($requirement, $request->user());

        return $this->success($requirement->fresh(), 'Project completed successfully');
    }
}
