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
                'recent_blogs' => \Illuminate\Support\Facades\Cache::remember('dashboard_recent_blogs', 3600, function() {
                    return \App\Http\Resources\BlogResource::collection(
                        \App\Models\Blog::published()->with(['author', 'tags'])->latest()->take(3)->get()
                    );
                }),
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
                    ->latest()
                    ->get();
                    
                // Eager load requirement titles and worker profiles to avoid N+1
                $reqIds = $data['received_bids']->pluck('requirement_id')->unique();
                $profIds = $data['received_bids']->pluck('professional.id')->filter()->unique();
                
                $requirements = \App\Models\Requirement::whereIn('id', $reqIds)->pluck('title', 'id');
                $rfqs = \App\Models\Rfq::whereIn('id', $reqIds)->pluck('title', 'id');
                $workerJobs = \App\Models\WorkerJob::whereIn('id', $reqIds)->pluck('title', 'id');
                $workerProfiles = \App\Models\Worker::whereIn('user_id', $profIds)->get()->keyBy('user_id');

                $data['received_bids'] = $data['received_bids']->map(function ($bid) use ($requirements, $rfqs, $workerJobs, $workerProfiles) {
                        // Resolve the requirement title and type label
                        $requirementTitle = 'Requirement #' . $bid->requirement_id;
                        $requirementTypeLabel = $bid->requirement_type;

                        if (in_array($bid->requirement_type, ['Project', 'Requirement', 'App\Models\Requirement', 'App\Models\Project'])) {
                            $requirementTitle = $requirements[$bid->requirement_id] ?? $requirementTitle;
                            $requirementTypeLabel = 'Project';
                        } elseif (in_array($bid->requirement_type, ['Rfq', 'App\Models\Rfq'])) {
                            $requirementTitle = $rfqs[$bid->requirement_id] ?? $requirementTitle;
                            $requirementTypeLabel = 'RFQ';
                        } elseif (in_array($bid->requirement_type, ['WorkerJob', 'App\Models\WorkerJob'])) {
                            $requirementTitle = $workerJobs[$bid->requirement_id] ?? $requirementTitle;
                            $requirementTypeLabel = 'Skilled Worker Job';
                        }

                        // Get worker/professional profile for extra info
                        $professional = $bid->professional;
                        $workerProfile = $professional ? ($workerProfiles[$professional->id] ?? null) : null;

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
                    
                    // Recent profile viewers (logged-in users only)
                    $listingIds = $user->listings()->pluck('id');
                    $data['recent_visitors'] = \Illuminate\Support\Facades\DB::table('analytics_events')
                        ->join('users', 'users.id', '=', 'analytics_events.user_id')
                        ->where('analytics_events.event_type', 'view')
                        ->where('analytics_events.entity_type', 'listing')
                        ->whereIn('analytics_events.entity_id', $listingIds)
                        ->whereNotNull('analytics_events.user_id')
                        ->where('analytics_events.user_id', '!=', $user->id)
                        ->select(
                            'users.id',
                            'users.name',
                            'users.avatar',
                            
                            'analytics_events.created_at as viewed_at'
                        )
                        ->orderByDesc('analytics_events.created_at')
                        ->limit(10)
                        ->get();
                } else {
                    $data['total_views']     = $entity?->views_count ?? 0;
                    $data['recent_visitors'] = [];
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
                    $entity?->approvedReviews()->with('reviewer')->latest()->take(5)->get() ?? collect()
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
                    ->with('requirement.user')
                    ->latest()
                    ->get()
                    ->map(function($unlock) {
                        if ($unlock->requirement) {
                            $unlock->requirement->name = $unlock->requirement->name ?? $unlock->requirement->user->name ?? 'Customer';
                            $unlock->requirement->phone = $unlock->requirement->phone ?? $unlock->requirement->user->phone ?? null;
                            $unlock->requirement->email = $unlock->requirement->email ?? $unlock->requirement->user->email ?? null;
                        }
                        return $unlock;
                    });

                // Fetch Vendor Metrics
                $data['vendor_metrics'] = $user->vendorMetric;

                // Fetch Recommended Leads based on Phase C visibility engine
                if (in_array('material_supplier', $userRoles) || in_array('supplier', $userRoles)) {
                    $data['recommended_leads'] = \App\Models\Rfq::where('status', 'open')
                        ->latest()
                        ->take(10)
                        ->get();
                } elseif (in_array('skilled_worker', $userRoles) || in_array('worker', $userRoles)) {
                    $workerEntity = $user->worker;
                    $query = \App\Models\WorkerJob::where('status', 'open');
                    
                    if ($workerEntity && $workerEntity->skill) {
                        $skill = strtolower($workerEntity->skill);
                        // Order by matching skill instead of filtering out non-matches
                        $query->orderByRaw("CASE 
                            WHEN LOWER(CAST(skills_required AS TEXT)) LIKE ? THEN 0 
                            WHEN skills_required IS NULL OR CAST(skills_required AS TEXT) = '[]' OR CAST(skills_required AS TEXT) = '\"\"' THEN 1
                            ELSE 2 END", ['%' . $skill . '%']);
                    }
                    if ($workerEntity && $workerEntity->city) {
                        $query->orderByRaw("CASE WHEN city = ? THEN 0 ELSE 1 END", [$workerEntity->city]);
                    }
                    
                    $data['recommended_leads'] = $query->latest()->take(20)->get();
                } else {
                    $recommendedIds = \Illuminate\Support\Facades\DB::table('requirement_recommendations')
                        ->where('vendor_id', $user->id)
                        ->orderByDesc('match_score')
                        ->take(10)
                        ->pluck('requirement_id');

                    $query = \App\Models\Requirement::where('status', 'open')
                        ->where(function($q) {
                            $q->whereNull('opportunity_type')
                              ->orWhereNotIn('opportunity_type', ['JOB', 'WORKER_JOB', 'RFQ']);
                        })
                        ->whereDoesntHave('category', function($q) {
                            $q->where('slug', 'workers');
                        });
                    
                    $validReqTypes = ['Project', 'Requirement', 'App\Models\Requirement', 'App\Models\Project'];
                    $profType = $user->professional_type;

                    if (in_array('interior_designer', $userRoles) || in_array('interior_company', $userRoles) || in_array($profType, ['interior_designer', 'interior_company'])) {
                        $validReqTypes = array_merge($validReqTypes, ['INTERIOR_DESIGN', 'Interior Design', 'FURNITURE', 'Furniture']);
                    }
                    if (in_array('architect', $userRoles) || in_array($profType, ['architect', 'architecture_firm'])) {
                        $validReqTypes = array_merge($validReqTypes, ['ARCHITECTURE', 'Architecture']);
                    }
                    if (in_array('contractor', $userRoles) || in_array($profType, ['contractor', 'civil_contractor', 'turnkey_contractor'])) {
                        $validReqTypes = array_merge($validReqTypes, ['CONSTRUCTION', 'Construction']);
                    }
                    if (in_array('builder', $userRoles) || in_array($profType, ['builder', 'real_estate_developer'])) {
                        $validReqTypes = array_merge($validReqTypes, ['BUILDER_PROJECT', 'Builder Project']);
                    }

                    if (count($validReqTypes) > 4) { // 4 is the base array length
                        $query->whereIn('requirement_type', $validReqTypes);
                    } else {
                        // Fallback for all other professional roles (e.g. pest_control, modular_kitchen_designer)
                        $listingCategoryIds = $user->listings()->pluck('category_id')->toArray();
                        $roleSlugs = array_map(fn($r) => str_replace('_', '-', $r), $userRoles);
                        
                        $query->where(function($q) use ($listingCategoryIds, $roleSlugs) {
                            if (!empty($listingCategoryIds)) {
                                $q->whereIn('category_id', $listingCategoryIds);
                            } else {
                                $q->whereHas('category', function($q2) use ($roleSlugs) {
                                    $q2->whereIn('slug', $roleSlugs);
                                });
                            }
                        });
                    }

                    if ($recommendedIds->isEmpty()) {
                        $data['recommended_leads'] = (clone $query)->latest()->take(10)->get();
                    } else {
                        $data['recommended_leads'] = (clone $query)->whereIn('id', $recommendedIds)->get();
                        if ($data['recommended_leads']->isEmpty()) {
                            $data['recommended_leads'] = (clone $query)->latest()->take(10)->get();
                        }
                    }
                }
            }

            if (isset($data['recommended_leads']) && $data['recommended_leads']->isNotEmpty()) {
                $data['recommended_leads'] = $data['recommended_leads']->map(function($lead) use ($user) {
                    $hasBid = false;
                    if ($lead instanceof \App\Models\Requirement) {
                        $hasBid = \App\Models\Bid::where('requirement_id', $lead->id)
                            ->where('professional_id', $user->id)
                            ->exists();
                    }
                    
                    $canSeeContact = clone $user;
                    $canSeeContact = $canSeeContact && (
                        $canSeeContact->id === $lead->user_id ||
                        $canSeeContact->isAdmin() || 
                        $canSeeContact->hasPremiumSubscription() || 
                        $canSeeContact->hasUnlockedRequirement($lead->id) ||
                        $hasBid
                    );
                    
                    // Attach the contact info from the user if it exists (for models like WorkerJob)
                    $phone = $lead->phone ?? $lead->user->phone ?? null;
                    $email = $lead->email ?? $lead->user->email ?? null;

                    // Mask phone if not allowed
                    if (!$canSeeContact && !empty($phone)) {
                        $lead->phone = substr($phone, 0, 2) . '********';
                    } elseif ($canSeeContact) {
                        $lead->phone = $phone;
                    }
                    
                    if (!$canSeeContact && !empty($email)) {
                        $lead->email = null;
                    } elseif ($canSeeContact) {
                        $lead->email = $email;
                    }
                    
                    $lead->is_unlocked = $canSeeContact;
                    
                    return $lead;
                });
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
