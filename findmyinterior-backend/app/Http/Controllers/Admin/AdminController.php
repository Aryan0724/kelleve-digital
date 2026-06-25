<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\BlogTag;
use App\Models\Builder;
use App\Models\Inquiry;
use App\Models\Listing;
use App\Models\Payment;
use App\Models\Requirement;
use App\Models\Review;
use App\Models\Supplier;
use App\Models\User;
use App\Models\UserSubscription;
use App\Models\Worker;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    // ─── Dashboard ────────────────────────────────────────────────────────────

    /**
     * GET /api/v1/admin/dashboard
     */
    public function dashboard(): JsonResponse
    {
        $totalRevenue = Payment::successful()->sum('amount');
        $unlockRevenue = Payment::successful()->where('purpose', 'lead_unlock')->sum('amount');
        $bidRevenue = Payment::successful()->where('purpose', 'bid_fee')->sum('amount');
        $subRevenue = Payment::successful()->where('purpose', 'subscription')->sum('amount');

        // Top Professionals by leads unlocked/bids (using User relation count)
        $topProfessionals = User::whereIn('role', ['business', 'worker', 'builder'])
            ->withCount(['contactUnlocks', 'submittedBids'])
            ->orderByRaw('(contact_unlocks_count + submitted_bids_count) DESC')
            ->take(5)
            ->get(['id', 'name', 'role']);

        // Top Districts by Requirement volume
        $topDistricts = Requirement::select('district', \Illuminate\Support\Facades\DB::raw('count(*) as total'))
            ->groupBy('district')
            ->orderByDesc('total')
            ->take(5)
            ->get();

        return response()->json([
            'success' => true,
            'data'    => [
                'stats' => [
                    'total_users'           => User::count(),
                    'active_professionals'  => User::whereIn('role', ['business', 'worker', 'builder', 'supplier'])->where('is_active', true)->count(),
                    'total_requirements'    => Requirement::count(),
                    'total_bids'            => \App\Models\Bid::count(),
                    'open_requirements'     => Requirement::open()->count(),
                    'pending_reviews'       => Review::where('is_approved', false)->count(),
                    'pending_listings'      => Listing::where('is_verified', false)->count(),
                    'total_revenue'         => $totalRevenue,
                    'unlock_revenue'        => $unlockRevenue,
                    'bid_revenue'           => $bidRevenue,
                    'subscription_revenue'  => $subRevenue,
                    'active_subscriptions'  => UserSubscription::active()->count(),
                    'total_inquiries'       => Inquiry::count(),
                ],
                'top_professionals' => $topProfessionals,
                'top_districts' => $topDistricts,
                'recent_users' => User::latest()->take(5)->get(['id', 'name', 'email', 'role', 'created_at']),
                'recent_payments' => Payment::with('user:id,name,email')
                    ->latest()
                    ->take(5)
                    ->get(['id', 'user_id', 'amount', 'purpose', 'status', 'created_at']),
                'pending_verifications' => Listing::where('is_verified', false)
                    ->with('user:id,name,email')
                    ->latest()
                    ->take(10)
                    ->get(['id', 'user_id', 'title', 'city', 'created_at'])
                    ->map(fn($l) => array_merge($l->toArray(), ['type' => 'Listing'])),
            ],
        ]);
    }

    // ─── Users ────────────────────────────────────────────────────────────────

    /**
     * GET /api/v1/admin/users
     */
    public function users(Request $request): JsonResponse
    {
        $query = User::with('roles:id,slug,name')->withCount(['listings', 'submittedBids']);

        if ($request->filled('role')) {
            $query->whereHas('roles', fn($q) => $q->where('slug', $request->role));
        }
        if ($request->filled('search')) {
            $query->where(fn($q) => $q->where('name', 'LIKE', "%{$request->search}%")
                ->orWhere('email', 'LIKE', "%{$request->search}%")
                ->orWhere('phone', 'LIKE', "%{$request->search}%"));
        }
        if ($request->filled('filter')) {
            if ($request->filter === 'mock') {
                $query->where('is_mock', true);
            } elseif ($request->filter === 'real') {
                $query->where('is_mock', false);
            }
        }

        $users = $query->latest()->paginate(20);

        return response()->json([
            'success' => true,
            'data'    => $users->items(),
            'meta'    => [
                'total'      => $users->total(),
                'last_page'  => $users->lastPage(),
                'mock_count' => User::where('is_mock', true)->count(),
                'real_count' => User::where('is_mock', false)->count(),
            ],
        ]);
    }

    /**
     * PATCH /api/v1/admin/users/{id}/toggle-active
     */
    public function toggleUserActive(int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->update(['is_active' => !$user->is_active]);

        return response()->json([
            'success' => true,
            'message' => 'User status updated.',
            'is_active' => $user->is_active,
        ]);
    }

    // ─── Listings ─────────────────────────────────────────────────────────────

    /**
     * GET /api/v1/admin/listings
     */
    public function listings(Request $request): JsonResponse
    {
        $listings = Listing::withTrashed()
            ->with(['user:id,name', 'category:id,name'])
            ->when($request->filled('status'), fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data'    => $listings->items(),
            'meta'    => ['total' => $listings->total(), 'last_page' => $listings->lastPage()],
        ]);
    }

    /**
     * PATCH /api/v1/admin/listings/{id}/verify
     */
    public function verifyListing(int $id): JsonResponse
    {
        $listing = Listing::findOrFail($id);
        $listing->update([
            'is_verified' => true,
            'status' => 'active',
        ]);

        return response()->json([
            'success'     => true,
            'message'     => 'Listing approved and verified.',
            'is_verified' => $listing->is_verified,
            'status'      => $listing->status,
        ]);
    }

    /**
     * PATCH /api/v1/admin/listings/{id}/reject
     */
    public function rejectListing(int $id): JsonResponse
    {
        $listing = Listing::findOrFail($id);
        $listing->update([
            'is_verified' => false,
            'status' => 'suspended',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Listing rejected and suspended.',
            'status' => $listing->status,
        ]);
    }

    /**
     * PATCH /api/v1/admin/listings/{id}/feature
     */
    public function featureListing(int $id): JsonResponse
    {
        $listing = Listing::findOrFail($id);
        $listing->update(['is_featured' => !$listing->is_featured]);

        return response()->json([
            'success'     => true,
            'message'     => 'Listing featured status updated.',
            'is_featured' => $listing->is_featured,
        ]);
    }

    // ─── Reviews ──────────────────────────────────────────────────────────────

    /**
     * GET /api/v1/admin/reviews/pending
     */
    public function pendingReviews(): JsonResponse
    {
        $reviews = Review::where('is_approved', false)
            ->with(['user:id,name', 'reviewable'])
            ->latest()
            ->get();

        return response()->json(['success' => true, 'data' => $reviews]);
    }

    /**
     * PATCH /api/v1/admin/reviews/{id}/approve
     */
    public function approveReview(int $id): JsonResponse
    {
        $review = Review::findOrFail($id);
        $review->update(['is_approved' => true]);

        return response()->json(['success' => true, 'message' => 'Review approved and published.']);
    }

    /**
     * DELETE /api/v1/admin/reviews/{id}
     */
    public function deleteReview(int $id): JsonResponse
    {
        Review::findOrFail($id)->delete();

        return response()->json(['success' => true, 'message' => 'Review deleted.']);
    }

    // ─── Blogs ────────────────────────────────────────────────────────────────

    /**
     * POST /api/v1/admin/blogs
     */
    public function createBlog(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'excerpt'     => ['required', 'string', 'max:500'],
            'content'     => ['required', 'string'],
            'cover_image' => ['nullable', 'url'],
            'category'    => ['required', 'string', 'max:100'],
            'status'      => ['in:draft,published'],
            'tags'        => ['nullable', 'array'],
            'tags.*'      => ['string', 'max:100'],
        ]);

        $blog = Blog::create([
            'author_id'    => $request->user()->id,
            'title'        => $data['title'],
            'slug'         => Str::slug($data['title']) . '-' . Str::random(6),
            'excerpt'      => $data['excerpt'],
            'content'      => $data['content'],
            'cover_image'  => $data['cover_image'] ?? null,
            'category'     => $data['category'],
            'status'       => $data['status'] ?? 'draft',
            'published_at' => ($data['status'] ?? 'draft') === 'published' ? now() : null,
        ]);

        if (!empty($data['tags'])) {
            foreach ($data['tags'] as $tag) {
                BlogTag::create(['blog_id' => $blog->id, 'tag' => $tag]);
            }
        }

        return response()->json(['success' => true, 'message' => 'Blog post created.', 'data' => $blog], 201);
    }

    /**
     * DELETE /api/v1/admin/blogs/{id}
     */
    public function deleteBlog(int $id): JsonResponse
    {
        Blog::findOrFail($id)->delete();

        return response()->json(['success' => true, 'message' => 'Blog deleted.']);
    }

    // ─── Builders / Suppliers / Workers ──────────────────────────────────────

    /**
     * PATCH /api/v1/admin/builders/{id}/verify
     */
    public function verifyBuilder(int $id): JsonResponse
    {
        $builder = Builder::findOrFail($id);
        $builder->update(['is_verified' => !$builder->is_verified]);

        return response()->json(['success' => true, 'is_verified' => $builder->is_verified]);
    }

    /**
     * PATCH /api/v1/admin/workers/{id}/verify
     */
    public function verifyWorker(int $id): JsonResponse
    {
        $worker = Worker::findOrFail($id);
        $worker->update(['is_verified' => !$worker->is_verified]);

        return response()->json(['success' => true, 'is_verified' => $worker->is_verified]);
    }

    /**
     * PATCH /api/v1/admin/suppliers/{id}/verify
     */
    public function verifySupplier(int $id): JsonResponse
    {
        $supplier = Supplier::findOrFail($id);
        $supplier->update(['is_verified' => !$supplier->is_verified]);

        return response()->json(['success' => true, 'is_verified' => $supplier->is_verified]);
    }

    // ─── Requirements ─────────────────────────────────────────────────────────

    /**
     * GET /api/v1/admin/requirements
     */
    public function requirements(Request $request): JsonResponse
    {
        $requirements = Requirement::with(['user:id,name', 'category:id,name'])
            ->withCount('bids')
            ->when($request->filled('status'), fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data'    => $requirements->items(),
            'meta'    => ['total' => $requirements->total()],
        ]);
    }

    /**
     * PATCH /api/v1/admin/requirements/{id}/close
     */
    public function closeRequirement(int $id): JsonResponse
    {
        Requirement::findOrFail($id)->update(['status' => 'expired']);

        return response()->json(['success' => true, 'message' => 'Requirement closed.']);
    }

    /**
     * PATCH /api/v1/admin/requirements/{id}/status
     */
    public function updateRequirementStatus(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:open,bidding,shortlisted,awarded,completed,expired'],
        ]);

        $requirement = Requirement::findOrFail($id);
        $requirement->update(['status' => $data['status']]);

        return response()->json([
            'success' => true,
            'message' => 'Requirement status updated.',
            'data' => $requirement,
        ]);
    }

    /**
     * PATCH /api/v1/admin/requirements/{id}/approve
     */
    public function approveRequirement(Request $request, int $id, \App\Services\RecommendationEngineService $recommendationEngine): JsonResponse
    {
        $requirement = Requirement::findOrFail($id);
        
        if ($requirement->status !== 'pending') {
            return response()->json(['message' => 'Requirement is not pending.'], 400);
        }

        $requirement->update(['status' => 'open']);

        // Generate recommendations and notify top professionals
        $recommendationEngine->generateFor($requirement);

        // Notify Customer
        if ($requirement->user_id) {
            $customer = User::find($requirement->user_id);
            if ($customer) {
                $customer->notify(new \App\Notifications\RequirementApprovedNotification([
                    'title' => $requirement->title,
                    'city' => $requirement->city,
                    'requirement_id' => $requirement->id
                ]));
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Requirement approved and notifications sent.',
            'data' => $requirement,
        ]);
    }

    /**
     * PATCH /api/v1/admin/requirements/{id}/reject
     */
    public function rejectRequirement(Request $request, int $id): JsonResponse
    {
        $requirement = Requirement::findOrFail($id);
        
        $requirement->update(['status' => 'rejected']);

        // Notify Customer
        if ($requirement->user_id) {
            $customer = User::find($requirement->user_id);
            if ($customer) {
                $customer->notify(new \App\Notifications\RequirementRejectedNotification([
                    'title' => $requirement->title,
                    'requirement_id' => $requirement->id
                ]));
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Requirement rejected.',
            'data' => $requirement,
        ]);
    }

    /**
     * PATCH /api/v1/admin/users/{id}/verify
     */
    public function verifyUser(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'verification_level' => ['nullable', 'in:unverified,mobile_verified,identity_verified,business_verified,site_verified'],
        ]);

        $user = User::findOrFail($id);
        $nextVerified = !$user->is_verified;

        $user->update([
            'is_verified' => $nextVerified,
            'verification_level' => $data['verification_level'] ?? ($nextVerified ? 'business_verified' : 'unverified'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User verification updated.',
            'data' => $user->only(['id', 'name', 'email', 'is_verified', 'verification_level']),
        ]);
    }

    /**
     * GET /api/v1/admin/payments
     */
    public function payments(Request $request): JsonResponse
    {
        $payments = Payment::with('user:id,name,email')
            ->when($request->filled('status'), fn($q) => $q->where('status', $request->status))
            ->when($request->filled('purpose'), fn($q) => $q->where('purpose', $request->purpose))
            ->latest()
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $payments->items(),
            'meta' => ['total' => $payments->total(), 'last_page' => $payments->lastPage()],
        ]);
    }

    // ─── God Mode Enhancements ───────────────────────────────────────────────

    public function updateSubscriptionPlan(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'price_monthly' => 'nullable|numeric',
            'price_yearly'  => 'nullable|numeric',
            'features'      => 'nullable|array',
            'is_active'     => 'nullable|boolean',
        ]);

        $plan = \App\Models\SubscriptionPlan::findOrFail($id);
        $plan->update($data);

        return response()->json(['success' => true, 'message' => 'Subscription plan updated.', 'data' => $plan]);
    }

    public function createCategory(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon'        => 'nullable|string',
        ]);

        $category = \App\Models\Category::create([
            'name' => $data['name'],
            'slug' => Str::slug($data['name']),
            'description' => $data['description'] ?? null,
            'icon' => $data['icon'] ?? null,
            'is_active' => true,
        ]);

        return response()->json(['success' => true, 'message' => 'Category created.', 'data' => $category]);
    }

    public function deleteCategory(int $id): JsonResponse
    {
        \App\Models\Category::findOrFail($id)->delete();
        return response()->json(['success' => true, 'message' => 'Category deleted.']);
    }

    public function inquiries(Request $request): JsonResponse
    {
        $inquiries = Inquiry::latest()->paginate(20);
        return response()->json([
            'success' => true,
            'data' => $inquiries->items(),
            'meta' => ['total' => $inquiries->total()]
        ]);
    }

    public function resolveInquiry(int $id): JsonResponse
    {
        $inquiry = Inquiry::findOrFail($id);
        $inquiry->update(['status' => 'resolved']);
        return response()->json(['success' => true, 'message' => 'Inquiry marked as resolved.']);
    }

    public function blogs(Request $request): JsonResponse
    {
        $blogs = Blog::with('author:id,name')->latest()->paginate(20);
        return response()->json([
            'success' => true,
            'data' => $blogs->items(),
            'meta' => ['total' => $blogs->total()]
        ]);
    }

    // ─── Mock User Management ──────────────────────────────────────────────────

    /**
     * DELETE /api/v1/admin/users/{id}
     */
    public function deleteUser(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        // Safety: cannot delete admins or self
        if ($user->isAdmin()) {
            return response()->json(['success' => false, 'message' => 'Cannot delete admin accounts.'], 403);
        }

        // Cascade delete related records
        $user->listings()->forceDelete();
        $user->tokens()->delete();
        $user->forceDelete();

        return response()->json(['success' => true, 'message' => 'User and all associated data deleted permanently.']);
    }

    /**
     * DELETE /api/v1/admin/users/mock/purge
     * Deletes ALL mock users from the database.
     */
    public function purgeMockUsers(): JsonResponse
    {
        $mockUsers = User::where('is_mock', true)->get();
        $count = $mockUsers->count();

        foreach ($mockUsers as $user) {
            $user->listings()->forceDelete();
            $user->tokens()->delete();
            $user->forceDelete();
        }

        return response()->json([
            'success' => true,
            'message' => "{$count} mock users and their data have been permanently deleted.",
        ]);
    }
}
