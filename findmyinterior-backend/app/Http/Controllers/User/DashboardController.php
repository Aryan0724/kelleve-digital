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

        // Homeowner — show their posted requirements and received bids
        if ($user->hasRole('customer')) {
            $data['requirements'] = RequirementResource::collection(
                $user->requirements()->with(['category', 'images'])->latest()->get()
            );
            $data['total_requirements'] = $user->requirements()->count();
            
            // Get all bids received on their requirements
            $data['received_bids'] = \App\Models\Bid::with(['requirement', 'professional'])
                ->whereIn('requirement_id', $user->requirements()->pluck('id'))
                ->latest()
                ->get();
        }

        // Business/Builder/Supplier/Worker — show their leads and reviews
        $isProfessional = $user->hasRole('business') || $user->hasRole('builder') || $user->hasRole('supplier') || $user->hasRole('worker');
        
        if ($isProfessional) {
            $entity = null;
            if ($user->hasRole('builder')) $entity = $user->builder;
            elseif ($user->hasRole('supplier')) $entity = $user->supplier;
            elseif ($user->hasRole('worker')) $entity = $user->worker;
            else $entity = $user->listing; // Default to business

            $data['total_inquiries'] = $entity?->inquiries()->count() ?? 0;
            $data['total_reviews']   = $entity?->approvedReviews()->count() ?? 0;
            $data['avg_rating']      = $entity?->avg_rating ?? 0;
            
            if ($user->hasRole('business')) {
                $data['listing_count']   = $user->listings()->count();
                $data['total_views']     = $user->listings()->sum('views_count');
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

            // Fetch Recommended Leads
            $recommendedIds = \Illuminate\Support\Facades\DB::table('requirement_recommendations')
                ->where('vendor_id', $user->id)
                ->pluck('requirement_id');
                
            if ($recommendedIds->isEmpty()) {
                // Fallback for new professionals without a listing/recommendations
                $data['recommended_leads'] = RequirementResource::collection(
                    \App\Models\Requirement::where('status', 'open')
                        ->with(['city', 'category'])
                        ->latest()
                        ->take(10)
                        ->get()
                );
            } else {
                $data['recommended_leads'] = RequirementResource::collection(
                    \App\Models\Requirement::whereIn('id', $recommendedIds)
                        ->where('status', 'open')
                        ->with(['city', 'category'])
                        ->latest()
                        ->take(10)
                        ->get()
                );
            }
        }

        return response()->json([
            'success' => true,
            'data'    => $data,
        ]);
    }
}
