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

            // ─── Phase M: Subscription Usage ─────────────────────────────────
            $entitlement = app(\App\Services\EntitlementService::class);
            $plan = $entitlement->getActivePlan($user);
            $activeSub = $user->activeSubscription()
                ->where('status', 'active')
                ->where('expires_at', '>', now())
                ->first();

            $listingsUsed = \App\Models\Listing::where('user_id', $user->id)
                ->where('status', 'active')
                ->count();
            $listingsLimit = $entitlement->getLimit($user, 'max_listings');

            $firstListing = \App\Models\Listing::where('user_id', $user->id)->first();
            $imagesUsed = $firstListing 
                ? \App\Models\ListingGallery::where('listing_id', $firstListing->id)->count()
                : 0;
            $imagesLimit = $entitlement->getLimit($user, 'max_gallery_images');

            $features = [];
            if ($plan?->can_add_whatsapp) $features[] = 'whatsapp';
            if ($plan?->can_add_website) $features[] = 'website';
            if ($plan?->badge_type && $plan->badge_type !== 'none') $features[] = $plan->badge_type . '_badge';
            if ($plan?->early_lead_access_hours === 0) $features[] = 'instant_lead_access';
            elseif ($plan?->early_lead_access_hours !== null) $features[] = 'early_lead_' . $plan->early_lead_access_hours . 'h';
            if ($plan?->badge_type === 'trusted' || $plan?->badge_type === 'elite') $features[] = 'category_spotlight';
            if ($plan?->badge_type === 'elite') {
                $features[] = 'top3_guaranteed';
                $features[] = 'featured_homepage';
                $features[] = 'competitor_insights';
                $features[] = 'priority_support';
            }

            $daysRemaining = $activeSub?->expires_at ? max(0, (int) now()->diffInDays($activeSub->expires_at, false)) : null;

            $data['subscription_usage'] = [
                'plan_name'      => $plan?->name ?? 'Starter',
                'plan_slug'      => $plan?->slug ?? 'starter',
                'expires_at'     => $activeSub?->expires_at?->toDateString(),
                'days_remaining' => $daysRemaining,
                'listings_used'  => $listingsUsed,
                'listings_limit' => $listingsLimit,
                'images_used'    => $imagesUsed,
                'images_limit'   => $imagesLimit,
                'analytics_tier' => $entitlement->getAnalyticsTier($user),
                'features'       => $features,
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
                    $q->whereIn('status', ['accepted', 'completed', 'awarded']);
                }])
                ->latest()->get()->map(function($r) {
                    $awardedBid = $r->bids->first();
                    $r->professional_id = $awardedBid?->professional_id ?? $r->supplier_id ?? null;
                    $r->_type = 'rfq';
                    return $r;
                });
                
            $data['jobs'] = \App\Models\WorkerJob::where('user_id', $user->id)
                ->with(['bids' => function($q) {
                    $q->whereIn('status', ['accepted', 'completed', 'awarded']);
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
                try {
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
                            $requirementTypeLabel = 'Job';
                        }

                        $bid->requirement_title = $requirementTitle;
                        $bid->requirement_type_label = $requirementTypeLabel;

                        if ($bid->professional) {
                            $worker = $workerProfiles->get($bid->professional->id);
                            if ($worker) {
                                $bid->professional->daily_rate = $worker->daily_rate;
                                $bid->professional->experience_years = $worker->experience_years;
                                $bid->professional->skills = $worker->skills;
                            }
                        }

                        return $bid;
                    });
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::warning('Failed to load received bids: ' . $e->getMessage());
                    $data['received_bids'] = collect([]);
                }
            } // end else (has opportunities)

            try {
                $data['shortlisted_professionals'] = \App\Models\Shortlist::with(['professional'])
                    ->where('user_id', $user->id)
                    ->latest()
                    ->get();
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::warning('Dashboard shortlists failed: ' . $e->getMessage());
                $data['shortlisted_professionals'] = collect([]);
            }

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
                
                // ─── Phase F: Analytics Subscription Gating ───────────────────
                $analyticsTier = $entitlement->getAnalyticsTier($user);
                $data['analytics_tier'] = $analyticsTier;

                if ($analyticsTier === 'none') {
                    // Starter / Growth: Analytics section is gated
                    $data['listing_count']   = $user->listings()->count();
                    $data['total_views']     = 0;
                    $data['phone_clicks']    = 0;
                    $data['whatsapp_clicks'] = 0;
                    $data['website_clicks']  = 0;
                    $data['recent_visitors'] = [];
                    $data['analytics_gated'] = true;
                } else {
                    // Professional ('summary') or Elite ('full')
                    $data['listing_count']   = $user->listings()->count();
                    $data['total_views']     = (int) $user->listings()->sum('views_count');
                    $data['phone_clicks']    = (int) $user->listings()->sum('phone_clicks');
                    $data['whatsapp_clicks'] = (int) $user->listings()->sum('whatsapp_clicks');
                    $data['website_clicks']  = (int) $user->listings()->sum('website_clicks');
                    $data['analytics_gated'] = false;
                    
                    // Recent profile viewers (logged-in users only)
                    $listingIds = $user->listings()->pluck('id');
                    $visitorsQuery = \Illuminate\Support\Facades\DB::table('analytics_events')
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
                        ->orderByDesc('analytics_events.created_at');

                    if ($analyticsTier === 'summary') {
                        $visitorsQuery->where('analytics_events.created_at', '>=', now()->subDays(7));
                    }

                    $data['recent_visitors'] = $visitorsQuery->limit(10)->get();
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

                // Fetch their submitted bids across all three domains
                $bids = \App\Models\Bid::with('requirement')
                    ->where('professional_id', $user->id)
                    ->latest()
                    ->get();
                    
                $jobApps = \Illuminate\Support\Facades\Schema::hasTable('job_applications') 
                    ? \App\Models\JobApplication::with('job')->where('professional_id', $user->id)->latest()->get()->map(function($app) { $app->requirement = $app->job; return $app; })
                    : collect();
                    
                $rfqQuotes = \Illuminate\Support\Facades\Schema::hasTable('rfq_quotations')
                    ? \App\Models\RfqQuotation::with('rfq')->where('professional_id', $user->id)->latest()->get()->map(function($quote) { $quote->requirement = $quote->rfq; return $quote; })
                    : collect();
                    
                $data['submitted_bids'] = $bids->concat($jobApps)->concat($rfqQuotes)->sortByDesc('created_at')->values();
                    
                // Fetch unlocked contacts
                $data['unlocked_contacts'] = $user->contactUnlocks()
                    ->with('requirement.user')
                    ->latest()
                    ->get()
                    ->filter(fn($unlock) => !is_null($unlock->requirement))
                    ->map(function($unlock) {
                        $unlock->requirement->name = $unlock->requirement->name ?? $unlock->requirement->user->name ?? 'Customer';
                        $unlock->requirement->phone = $unlock->requirement->phone ?? $unlock->requirement->user->phone ?? null;
                        $unlock->requirement->email = $unlock->requirement->email ?? $unlock->requirement->user->email ?? null;
                        return $unlock;
                    })
                    ->values();

                // Fetch Vendor Metrics
                $data['vendor_metrics'] = $user->vendorMetric;

                // Fetch Recommended Leads — role-mapped, cached, robust fallback
                // Uses direct requirement_type matching instead of fragile category/recommendation-table joins
                try {
                    $roleToReqTypes = [
                        'interior_designer'  => ['INTERIOR_DESIGN', 'Interior Design', 'interior_design', 'RENOVATION', 'renovation', 'ARCHITECT', 'architect', 'FURNITURE', 'furniture', 'Project', 'project'],
                        'interior_company'   => ['INTERIOR_DESIGN', 'Interior Design', 'interior_design', 'RENOVATION', 'renovation', 'ARCHITECT', 'architect', 'FURNITURE', 'furniture', 'Project', 'project'],
                        'architect'          => ['ARCHITECT', 'Architecture', 'ARCHITECTURE', 'CONSTRUCTION', 'Construction', 'architect', 'architecture', 'construction', 'Project', 'project'],
                        'contractor'         => ['CONSTRUCTION', 'Construction', 'construction', 'RENOVATION', 'renovation', 'INTERIOR_DESIGN', 'interior_design', 'Project', 'project'],
                        'builder'            => ['BUILDER_PROJECT', 'Builder Project', 'builder_project', 'CONSTRUCTION', 'Construction', 'construction', 'Project', 'project'],
                        'material_supplier'  => ['MATERIALS', 'RFQ', 'materials', 'rfq', 'Material', 'material'],
                        'supplier'           => ['MATERIALS', 'RFQ', 'materials', 'rfq', 'Material', 'material'],
                        'skilled_worker'     => ['JOB', 'WORKER_JOB', 'job', 'worker_job', 'Skilled Worker Job'],
                        'worker'             => ['JOB', 'WORKER_JOB', 'job', 'worker_job', 'Skilled Worker Job'],
                    ];

                    // Build a merged list of valid requirement_types for this user's roles
                    $validReqTypes = [];
                    foreach ($userRoles as $r) {
                        if (isset($roleToReqTypes[$r])) {
                            $validReqTypes = array_merge($validReqTypes, $roleToReqTypes[$r]);
                        }
                    }
                    $validReqTypes = array_unique($validReqTypes);

                    // Semantic fix: 0 = immediate access (no delay), null = standard delay, N = N hours early access
                    $earlyAccessHours = $plan?->early_lead_access_hours;
                    $maxSystemEarlyAccess = 6;
                    if ($earlyAccessHours === 0) {
                        $delayHours = 0; // Elite: 0-delay immediate access
                    } elseif ($earlyAccessHours === null) {
                        $delayHours = $maxSystemEarlyAccess; // Standard delay
                    } else {
                        $delayHours = max(0, $maxSystemEarlyAccess - (int) $earlyAccessHours);
                    }

                    // Base query: open or bidding requirements matching role
                    $query = \App\Models\Requirement::with(['category', 'user'])
                        ->whereIn('status', ['open', 'bidding', 'active', 'published'])
                        ->when($delayHours > 0, function($q) use ($delayHours) {
                            $q->where('created_at', '<=', now()->subHours($delayHours));
                        });

                    if (!empty($validReqTypes)) {
                        $query->where(function($q) use ($validReqTypes) {
                            $q->whereIn('requirement_type', $validReqTypes)
                              ->orWhereIn('opportunity_type', $validReqTypes);
                        });
                    } else {
                        // Fallback for unrecognised roles: show all project-type reqs
                        $query->where(function($q) {
                            $q->whereNull('opportunity_type')
                              ->orWhereNotIn('opportunity_type', ['JOB', 'WORKER_JOB', 'RFQ']);
                        });
                    }

                    // Try personalised recs first
                    $recommendedIds = \Illuminate\Support\Facades\DB::table('requirement_recommendations')
                        ->where('vendor_id', $user->id)
                        ->orderByDesc('match_score')
                        ->take(10)
                        ->pluck('requirement_id');

                    if ($recommendedIds->isNotEmpty()) {
                        $personalised = (clone $query)->whereIn('id', $recommendedIds)->get();
                        if ($personalised->isNotEmpty()) {
                            $data['recommended_leads'] = $personalised;
                        } else {
                            $data['recommended_leads'] = $query->latest()->take(10)->get();
                        }
                    } else {
                        $data['recommended_leads'] = $query->latest()->take(10)->get();
                    }
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::warning('Dashboard recommended_leads failed: ' . $e->getMessage());
                    $data['recommended_leads'] = collect([]);
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
                    $phone = $lead->phone ?? $lead->user?->phone ?? null;
                    $email = $lead->email ?? $lead->user?->email ?? null;

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

    /**
     * GET /api/v1/user/analytics
     * Gated endpoint for professional profile statistics and analytics.
     * Starter / Growth: 403 Forbidden
     * Professional: 200 OK with Profile Statistics (all-time counters + last 7 days visitors)
     * Elite: 200 OK with Comprehensive Analytics (all-time counters + all-time visitors + events breakdown)
     */
    public function analytics(Request $request): JsonResponse
    {
        $user = $request->user();
        $entitlement = app(\App\Services\EntitlementService::class);
        $tier = $entitlement->getAnalyticsTier($user);

        if ($tier === 'none') {
            return response()->json([
                'success' => false,
                'message' => 'Upgrade to Professional or Elite to access profile analytics and performance metrics.',
                'code'    => 'ANALYTICS_UPGRADE_REQUIRED',
            ], 403);
        }

        $listingIds = $user->listings()->pluck('id');

        // Honest profile statistics from actual DB counters
        $stats = [
            'listing_count'   => $user->listings()->count(),
            'total_views'     => (int) $user->listings()->sum('views_count'),
            'phone_clicks'    => (int) $user->listings()->sum('phone_clicks'),
            'whatsapp_clicks' => (int) $user->listings()->sum('whatsapp_clicks'),
            'website_clicks'  => (int) $user->listings()->sum('website_clicks'),
            'total_inquiries' => (int) \App\Models\Inquiry::whereIn('inquirable_id', $listingIds)
                ->where('inquirable_type', \App\Models\Listing::class)
                ->count(),
        ];

        $visitorsQuery = \Illuminate\Support\Facades\DB::table('analytics_events')
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
            ->orderByDesc('analytics_events.created_at');

        if ($tier === 'summary') {
            $visitorsQuery->where('analytics_events.created_at', '>=', now()->subDays(7));
        }

        $recentVisitors = $visitorsQuery->limit(20)->get();

        $payload = [
            'tier'               => $tier,
            'label'              => $tier === 'full' ? 'Comprehensive Analytics' : 'Profile Statistics',
            'profile_statistics' => $stats,
            'recent_visitors'    => $recentVisitors,
        ];

        if ($tier === 'full') {
            $eventsBreakdown = \Illuminate\Support\Facades\DB::table('analytics_events')
                ->whereIn('entity_id', $listingIds)
                ->where('entity_type', 'listing')
                ->select('event_type', \Illuminate\Support\Facades\DB::raw('count(*) as count'))
                ->groupBy('event_type')
                ->pluck('count', 'event_type');

            $payload['events_breakdown'] = $eventsBreakdown;
        }

        return response()->json([
            'success' => true,
            'data'    => $payload,
        ]);
    }
}
