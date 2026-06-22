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
    /**
     * GET /api/v1/user/dashboard
     * Returns everything needed to render the business/homeowner dashboard.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user()->load(['activeSubscription.plan']);

        $unreadCustomer = \App\Models\Conversation::where('customer_id', $user->id)->sum('customer_unread_count');
        $unreadVendor = \App\Models\Conversation::where('vendor_id', $user->id)->sum('vendor_unread_count');

        $data = [
            'user' => [
                'id'           => $user->id,
                'name'         => $user->name,
                'roles'        => $user->roles->pluck('slug'),
                'subscription' => $user->activeSubscription?->plan?->name ?? 'Basic (Free)',
                'wallet_balance' => \Illuminate\Support\Facades\DB::table('wallets')->where('user_id', $user->id)->value('balance') ?? 0.0,
                'unread_messages_count' => $unreadCustomer + $unreadVendor,
            ],
        ];

        $userRoles = $user->roles->pluck('slug')->toArray();
        $isHomeowner = in_array('homeowner', $userRoles) || in_array('customer', $userRoles);
        
        // Homeowner / Customer — show their posted projects and shortlists
        if ($isHomeowner) {
            $data['projects'] = \App\Models\Project::where('user_id', $user->id)->latest()->get();
            $data['total_projects'] = \App\Models\Project::where('user_id', $user->id)->count();
            
            // Get all bids received on their projects (requires bid table update to polymorphic or mapping, but for now fallback)
            $data['received_bids'] = \App\Models\Bid::with(['professional'])
                ->whereIn('requirement_id', \App\Models\Project::where('user_id', $user->id)->pluck('id'))
                ->latest()
                ->get();

            // Shortlisted Professionals
            $data['shortlisted_professionals'] = \App\Models\Shortlist::with(['professional'])
                ->where('user_id', $user->id)
                ->latest()
                ->get();
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
            $data['submitted_bids'] = \App\Models\Bid::with('requirement.city')
                ->where('professional_id', $user->id)
                ->latest()
                ->get();
                
            // Fetch unlocked contacts
            $data['unlocked_contacts'] = $user->contactUnlocks()
                ->with('requirement.city')
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

        return response()->json([
            'success' => true,
            'data'    => $data,
        ]);
    }
}
