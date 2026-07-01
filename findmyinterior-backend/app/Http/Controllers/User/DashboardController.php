<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\RequirementResource;
use App\Http\Resources\ReviewResource;
use App\Http\Resources\PaymentResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    use \App\Traits\ApiResponse;

    /**
     * GET /api/v1/user/dashboard
     * Returns everything needed to render the business/homeowner dashboard.
     */
    public function __invoke(Request $request): JsonResponse
    {
        try {
            $user = $request->user()->load(['activeSubscription.plan']);

            try {
                $unreadCustomer = \App\Models\Conversation::where('customer_id', $user->id)->sum('customer_unread_count');
                $unreadVendor = \App\Models\Conversation::where('vendor_id', $user->id)->sum('vendor_unread_count');
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::warning('Failed to sum unread messages: ' . $e->getMessage());
                $unreadCustomer = 0;
                $unreadVendor = 0;
            }

            $data = [
                'user' => [
                    'id'           => $user->id,
                    'name'         => $user->name,
                    'roles'        => $user->roles->pluck('slug'),
                    'subscription' => $user->activeSubscription?->plan?->name ?? 'Basic (Free)',
                    'wallet_balance' => \Illuminate\Support\Facades\DB::table('wallets')->where('user_id', $user->id)->value('balance') ?? 0.0,
                    'unread_messages_count' => $unreadCustomer + $unreadVendor,
                    'has_pending_verification' => \App\Models\UserDocument::where('user_id', $user->id)->where('status', 'pending')->exists(),
                ],
            ];

            $userRoles = $user->roles->pluck('slug')->toArray();
            $isHomeowner = in_array('homeowner', $userRoles) || in_array('customer', $userRoles);
            
            // Fetch projects posted by this user (Homeowners, Builders, etc.)
            $data['projects'] = \App\Models\Requirement::where('user_id', $user->id)
                ->with(['bids' => function($q) {
                    $q->where(function($q2) {
                        $q2->where('is_awarded', true)
                           ->orWhereIn('status', ['accepted', 'completed']);
                    });
                }])
                ->latest()->get()->map(function($p) {
                    $awardedBid = $p->bids->first();
                    // Fix: proper operator precedence with explicit parentheses
                    $p->professional_id = $awardedBid?->professional_id 
                        ?? ($p->winning_bid_id ? \App\Models\Bid::find($p->winning_bid_id)?->professional_id : null);
                    $p->_type = 'project';
                    return $p;
                });
                
            $data['rfqs'] = \App\Models\Rfq::where('user_id', $user->id)
                ->with(['bids' => function($q) {
                    $q->where(function($q2) {
                        $q2->where('is_awarded', true)
                           ->orWhereIn('status', ['accepted', 'completed']);
                    });
                }])
                ->latest()->get()->map(function($r) {
                    $awardedBid = $r->bids->first();
                    $r->professional_id = $awardedBid?->professional_id ?? $r->supplier_id ?? null;
                    $r->_type = 'rfq';
                    return $r;
                });
                
            $data['jobs'] = \App\Models\WorkerJob::where('user_id', $user->id)
                ->with(['bids' => function($q) {
                    $q->where(function($q2) {
                        $q2->where('is_awarded', true)
                           ->orWhereIn('status', ['accepted', 'completed']);
                    });
                }])
                ->latest()->get()->map(function($j) {
                    $awardedBid = $j->bids->first();
                    $j->professional_id = $awardedBid?->professional_id ?? $j->worker_id ?? null;
                    $j->_type = 'job';
                    return $j;
                });
            
            $data['total_projects'] = $data['projects']->count() + $data['rfqs']->count() + $data['jobs']->count();
            
            $projectIds = \App\Models\Requirement::where('user_id', $user->id)->pluck('id');
            $rfqIds = \App\Models\Rfq::where('user_id', $user->id)->pluck('id');
            $jobIds = \App\Models\WorkerJob::where('user_id', $user->id)->pluck('id');

            // Short-circuit: if user has no opportunities, they have no received bids
            if ($projectIds->isEmpty() && $rfqIds->isEmpty() && $jobIds->isEmpty()) {
                $data['received_bids'] = collect([]);
            } else {
                $data['received_bids'] = \App\Models\Bid::with(['professional'])
                    ->where(function($query) use ($projectIds, $rfqIds, $jobIds) {
                        if ($projectIds->isNotEmpty()) {
                            $query->orWhere(function($q) use ($projectIds) {
                                $q->whereIn('requirement_type', ['Project', 'Requirement', 'App\Models\Requirement', 'App\Models\Project'])
                                  ->whereIn('requirement_id', $projectIds);
                            });
                        }
                        if ($rfqIds->isNotEmpty()) {
                            $query->orWhere(function($q) use ($rfqIds) {
                                $q->whereIn('requirement_type', ['Rfq', 'App\Models\Rfq'])
                                  ->whereIn('requirement_id', $rfqIds);
                            });
                        }
                        if ($jobIds->isNotEmpty()) {
                            $query->orWhere(function($q) use ($jobIds) {
                                $q->whereIn('requirement_type', ['WorkerJob', 'App\Models\WorkerJob'])
                                  ->whereIn('requirement_id', $jobIds);
                            });
                        }
                    })
                    ->latest()
                    ->get()
                    ->map(function ($bid) {
                        // Resolve the requirement title and type label
                        $requirementTitle = 'Requirement #' . $bid->requirement_id;
                        $requirementTypeLabel = $bid->requirement_type;

                        if (in_array($bid->requirement_type, ['Project', 'Requirement', 'App\Models\Requirement', 'App\Models\Project'])) {
                            $req = \App\Models\Requirement::find($bid->requirement_id);
                            $requirementTitle = $req?->title ?? $requirementTitle;
                            $requirementTypeLabel = 'Project';
                        } elseif (in_array($bid->requirement_type, ['Rfq', 'App\Models\Rfq'])) {
                            $req = \App\Models\Rfq::find($bid->requirement_id);
                            $requirementTitle = $req?->title ?? $requirementTitle;
                            $requirementTypeLabel = 'RFQ';
                        } elseif (in_array($bid->requirement_type, ['WorkerJob', 'App\Models\WorkerJob'])) {
                            $req = \App\Models\WorkerJob::find($bid->requirement_id);
                            $requirementTitle = $req?->title ?? $requirementTitle;
                            $requirementTypeLabel = 'Skilled Labour Job';
                        }

                        // Get worker/professional profile for extra info
                        $professional = $bid->professional;
                        $workerProfile = null;
                        if ($professional) {
                            $workerProfile = \App\Models\Worker::where('user_id', $professional->id)->first();
                        }

                        return [
                            'id'                  => $bid->id,
                            'status'              => $bid->status,
                            'amount'              => $bid->amount,
                            'timeline_days'       => $bid->timeline_days,
                            'proposal_message'    => $bid->proposal_message,
                            'smart_bid_score'     => $bid->smart_bid_score,
                            'is_awarded'          => $bid->is_awarded,
                            'created_at'          => $bid->created_at?->diffForHumans(),
                            'requirement_title'   => $requirementTitle,
                            'requirement_type'    => $requirementTypeLabel,
                            'requirement_id'      => $bid->requirement_id,
                            'professional' => $professional ? [
                                'id'     => $professional->id,
                                'name'   => $professional->name,
                                'email'  => $professional->email,
                                'avatar' => $professional->avatar,
                                'skill'  => $workerProfile?->skill ?? null,
                                'city'   => $workerProfile?->city ?? null,
                                'experience_years' => $workerProfile?->experience_years ?? null,
                                'avg_rating'       => $workerProfile?->avg_rating ?? 0,
                            ] : null,
                        ];
                    });
            } // end else (has opportunities)

            $data['shortlisted_professionals'] = \App\Models\Shortlist::with(['professional'])
                ->where('user_id', $user->id)
                ->latest()
                ->get();

            // Professional logic
            $isProfessional = array_intersect(
                ['interior_designer', 'interior_company', 'contractor', 'architect', 'builder', 'material_supplier', 'skilled_worker', 'business', 'supplier', 'worker'],
                $userRoles
            );
            
            if ($isProfessional) {
                $entity = null;
                if (in_array('builder', $userRoles)) $entity = $user->builder;
                elseif (in_array('material_supplier', $userRoles) || in_array('supplier', $userRoles)) $entity = $user->supplier;
                elseif (in_array('skilled_worker', $userRoles) || in_array('worker', $userRoles)) $entity = $user->worker;
                else $entity = $user->listing; // Default for designers, contractors, etc.

                $data['total_inquiries'] = $entity?->inquiries()->count() ?? 0;
                $data['total_reviews']   = $entity?->approvedReviews()->count() ?? 0;
                $data['avg_rating']      = $entity?->avg_rating ?? 0;
                
                if (in_array('business', $userRoles) || in_array('interior_designer', $userRoles) || in_array('interior_company', $userRoles) || in_array('contractor', $userRoles) || in_array('architect', $userRoles)) {
                    $data['listing_count']   = $user->listings()->count();
                    $data['total_views']     = $user->listings()->sum('views_count');
                    $data['phone_clicks']    = $user->listings()->sum('phone_clicks');
                    $data['whatsapp_clicks'] = $user->listings()->sum('whatsapp_clicks');
                    $data['website_clicks']  = $user->listings()->sum('website_clicks');
                } else {
                    $data['total_views']     = $entity?->views_count ?? 0;
                }

                $data['recent_inquiries'] = $entity?->inquiries()
                    ->latest()
                    ->take(5)
                    ->get()
                    ->map(fn($i) => [
                        'id'         => $i->id,
                        'name'       => $i->name,
                        'phone'      => $i->phone,
                        'message'    => $i->message,
                        'status'     => $i->status,
                        'is_read'    => $i->is_read,
                        'created_at' => $i->created_at?->diffForHumans(),
                    ]) ?? [];

                $data['recent_reviews'] = ReviewResource::collection(
                    $entity?->approvedReviews()->with('user')->latest()->take(5)->get() ?? collect()
                );

                $data['recent_payments'] = PaymentResource::collection(
                    $user->payments()->latest()->take(5)->get()
                );

                // Fetch their submitted bids
                $data['submitted_bids'] = \App\Models\Bid::with('requirement')
                    ->where('professional_id', $user->id)
                    ->latest()
                    ->get();
                    
                // Fetch unlocked contacts
                $data['unlocked_contacts'] = $user->contactUnlocks()
                    ->with('requirement')
                    ->latest()
                    ->get();

                // Fetch Vendor Metrics
                $data['vendor_metrics'] = $user->vendorMetric;

                // Fetch Recommended Leads based on Phase C visibility engine
                if (in_array('material_supplier', $userRoles) || in_array('supplier', $userRoles)) {
                    $data['recommended_leads'] = \App\Models\Rfq::where('status', 'open')
                        ->latest()
                        ->take(10)
                        ->get();
                } elseif (in_array('skilled_worker', $userRoles) || in_array('worker', $userRoles)) {
                    $data['recommended_leads'] = \App\Models\WorkerJob::where('status', 'open')
                        ->latest()
                        ->take(10)
                        ->get();
                } else {
                    $recommendedIds = \Illuminate\Support\Facades\DB::table('requirement_recommendations')
                        ->where('vendor_id', $user->id)
                        ->orderByDesc('match_score')
                        ->take(10)
                        ->pluck('requirement_id');

                    if ($recommendedIds->isEmpty()) {
                        $data['recommended_leads'] = \App\Models\Requirement::where('status', 'open')
                            ->latest()
                            ->take(10)
                            ->get();
                    } else {
                        $data['recommended_leads'] = \App\Models\Requirement::whereIn('id', $recommendedIds)
                            ->where('status', 'open')
                            ->get();
                    }
                }
            }

            return $this->success($data);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Dashboard loading failed: ' . $e->getMessage(), [
                'exception' => $e,
                'user_id' => $request->user()?->id,
            ]);
            return $this->error('Failed to load dashboard data: ' . $e->getMessage(), 500);
        }
    }
}
