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
use App\Services\TrustScoreService;
use App\Notifications\AccountVerifiedNotification;
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
        $topProfessionals = User::whereHas('roles', function($q) {
                $q->whereIn('slug', ['business', 'worker', 'builder']);
            })
            ->withCount(['contactUnlocks', 'submittedBids'])
            ->orderBy('contact_unlocks_count', 'desc')
            ->orderBy('submitted_bids_count', 'desc')
            ->take(5)
            ->get(['id', 'name']);

        // Top Districts by Requirement volume (Union across all active requirement domains)
        $topDistricts = \Illuminate\Support\Facades\DB::query()
            ->fromSub(function ($query) {
                $query->select('district')->from('projects')->whereNotNull('district')->where('district', '!=', '')
                    ->unionAll(\Illuminate\Support\Facades\DB::table('worker_jobs')->select('district')->whereNotNull('district')->where('district', '!=', ''))
                    ->unionAll(\Illuminate\Support\Facades\DB::table('rfqs')->select('district')->whereNotNull('district')->where('district', '!=', ''));
            }, 'all_reqs')
            ->select('district', \Illuminate\Support\Facades\DB::raw('count(*) as total'))
            ->groupBy('district')
            ->orderByDesc('total')
            ->take(5)
            ->get();

        return response()->json([
            'success' => true,
            'data'    => [
                'stats' => [
                    'total_users'           => User::count(),
                    'active_professionals'  => User::whereHas('roles', function($q) {
                        $q->whereIn('slug', ['business', 'worker', 'builder', 'supplier']);
                    })->where('is_active', true)->count(),
                    'total_requirements'    => \App\Models\Project::count() + \App\Models\WorkerJob::count() + \App\Models\Rfq::count(),
                    'total_bids'            => \App\Models\Bid::count() + \App\Models\JobApplication::count() + \App\Models\RfqQuotation::count(),
                    'open_requirements'     => \App\Models\Project::where('status', 'open')->count() + \App\Models\WorkerJob::where('status', 'open')->count() + \App\Models\Rfq::where('status', 'open')->count(),
                    'pending_reviews'       => Review::where('status', 'pending')->count(),
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
                'recent_users' => User::with('roles:id,slug,name')->latest()->take(5)->get(['id', 'name', 'email', 'created_at']),
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
    public function toggleUserActive(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        $user = User::findOrFail($id);
        $before = ['is_active' => $user->is_active];
        $user->update(['is_active' => !$user->is_active]);

        \App\Models\ActivityLog::recordAdminAction(
            auth()->id(),
            $user->is_active ? 'RESTORE' : 'SUSPEND',
            $user,
            $before,
            ['is_active' => $user->is_active],
            $validated['reason']
        );

        return response()->json([
            'success' => true,
            'message' => 'User status updated.',
            'is_active' => $user->is_active,
        ]);
    }

    /**
     * POST /api/v1/admin/users/{id}/impersonate
     */
    public function impersonateUser(Request $request, int $id): JsonResponse
    {
        $targetUser = User::with(['roles', 'primaryRole'])->findOrFail($id);
        $token = $targetUser->createToken('admin_impersonation')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Impersonation token generated.',
            'data'    => [
                'token' => $token,
                'user'  => $targetUser,
            ]
        ]);
    }

    /**
     * PATCH /api/v1/admin/users/{id}/reset-password
     */
    public function resetUserPassword(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $newPassword = $request->input('password') ?: \Illuminate\Support\Str::random(10);

        $user->update([
            'password' => \Illuminate\Support\Facades\Hash::make($newPassword),
        ]);

        return response()->json([
            'success'      => true,
            'message'      => 'Password updated successfully.',
            'new_password' => $newPassword,
            'login_id'     => $user->email ?? $user->phone,
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
    public function verifyListing(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        $listing = Listing::findOrFail($id);
        $before = ['is_verified' => $listing->is_verified, 'status' => $listing->status];
        
        $listing->update([
            'is_verified' => true,
            'status' => 'active',
        ]);

        \App\Models\ActivityLog::recordAdminAction(
            auth()->id(),
            'APPROVE',
            $listing,
            $before,
            ['is_verified' => true, 'status' => 'active'],
            $validated['reason']
        );

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
    public function rejectListing(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        $listing = Listing::findOrFail($id);
        $before = ['is_verified' => $listing->is_verified, 'status' => $listing->status];
        
        $listing->update([
            'is_verified' => false,
            'status' => 'suspended',
        ]);

        \App\Models\ActivityLog::recordAdminAction(
            auth()->id(),
            'REJECT',
            $listing,
            $before,
            ['is_verified' => false, 'status' => 'suspended'],
            $validated['reason']
        );

        return response()->json([
            'success' => true,
            'message' => 'Listing rejected and suspended.',
            'status' => $listing->status,
        ]);
    }

    /**
     * PATCH /api/v1/admin/listings/{id}/feature
     */
    public function featureListing(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        $listing = Listing::findOrFail($id);
        $before = ['is_featured' => $listing->is_featured];
        $listing->update(['is_featured' => !$listing->is_featured]);

        \App\Models\ActivityLog::recordAdminAction(
            auth()->id(),
            $listing->is_featured ? 'FEATURE' : 'UNFEATURE',
            $listing,
            $before,
            ['is_featured' => $listing->is_featured],
            $validated['reason']
        );

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
        $reviews = Review::where('status', 'pending')
            ->with(['reviewer:id,name', 'reviewedUser:id,name', 'project:id,title'])
            ->latest()
            ->get();

        return response()->json(['success' => true, 'data' => $reviews]);
    }

    /**
     * PATCH /api/v1/admin/reviews/{id}/approve
     */
    public function approveReview(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        $review = Review::findOrFail($id);
        $before = ['status' => $review->status];
        $review->update(['status' => 'approved']);

        \App\Models\ActivityLog::recordAdminAction(
            auth()->id(),
            'APPROVE',
            $review,
            $before,
            ['status' => 'approved'],
            $validated['reason']
        );

        return response()->json(['success' => true, 'message' => 'Review approved and published.']);
    }

    /**
     * DELETE /api/v1/admin/reviews/{id}
     */
    public function deleteReview(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        $review = Review::findOrFail($id);
        $before = $review->toArray();
        $review->delete();

        \App\Models\ActivityLog::recordAdminAction(
            auth()->id(),
            'DELETE',
            $review,
            $before,
            [],
            $validated['reason']
        );

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
            'excerpt'     => ['nullable', 'string', 'max:500'],
            'content'     => ['required', 'string'],
            'cover_image' => ['nullable', 'url'],
            'category'    => ['nullable', 'string', 'max:100'],
            'status'      => ['in:draft,published'],
            'tags'        => ['nullable', 'array'],
            'tags.*'      => ['string', 'max:100'],
            'target_audience'   => ['nullable', 'array'],
            'target_audience.*' => ['string'],
        ]);

        $blog = Blog::create([
            'author_id'    => $request->user()->id,
            'title'        => $data['title'],
            'slug'         => Str::slug($data['title']) . '-' . Str::random(6),
            'excerpt'      => $data['excerpt'] ?? Str::limit(strip_tags($data['content']), 150),
            'content'      => $data['content'],
            'cover_image'  => $data['cover_image'] ?? null,
            'category'     => $data['category'] ?? 'General',
            'status'       => $data['status'] ?? 'draft',
            'published_at' => ($data['status'] ?? 'draft') === 'published' ? now() : null,
            'target_audience' => $data['target_audience'] ?? null,
        ]);

        if (!empty($data['tags'])) {
            foreach ($data['tags'] as $tag) {
                BlogTag::create(['blog_id' => $blog->id, 'tag' => $tag]);
            }
        }

        return response()->json(['success' => true, 'message' => 'Blog post created.', 'data' => $blog], 201);
    }

    /**
     * PUT /api/v1/admin/blogs/{id}
     */
    public function updateBlog(Request $request, int $id): JsonResponse
    {
        $blog = Blog::findOrFail($id);
        
        $data = $request->validate([
            'title'       => ['sometimes', 'string', 'max:255'],
            'excerpt'     => ['nullable', 'string', 'max:500'],
            'content'     => ['sometimes', 'string'],
            'cover_image' => ['nullable', 'url'],
            'category'    => ['nullable', 'string', 'max:100'],
            'status'      => ['in:draft,published'],
            'tags'        => ['nullable', 'array'],
            'tags.*'      => ['string', 'max:100'],
            'target_audience'   => ['nullable', 'array'],
            'target_audience.*' => ['string'],
        ]);

        if (isset($data['title'])) {
            $data['slug'] = Str::slug($data['title']) . '-' . Str::random(6);
        }
        
        if (isset($data['status']) && $data['status'] === 'published' && $blog->status !== 'published') {
            $data['published_at'] = now();
        }

        if (isset($data['content']) && empty($data['excerpt']) && empty($blog->excerpt)) {
            $data['excerpt'] = Str::limit(strip_tags($data['content']), 150);
        }

        $blog->update($data);

        if (isset($data['tags'])) {
            BlogTag::where('blog_id', $blog->id)->delete();
            foreach ($data['tags'] as $tag) {
                BlogTag::create(['blog_id' => $blog->id, 'tag' => $tag]);
            }
        }

        return response()->json(['success' => true, 'message' => 'Blog post updated.', 'data' => $blog]);
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
    public function verifyBuilder(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        $builder = Builder::findOrFail($id);
        $before = ['is_verified' => $builder->is_verified];
        $builder->update(['is_verified' => !$builder->is_verified]);

        \App\Models\ActivityLog::recordAdminAction(
            auth()->id(),
            $builder->is_verified ? 'VERIFY' : 'UNVERIFY',
            $builder,
            $before,
            ['is_verified' => $builder->is_verified],
            $validated['reason']
        );

        return response()->json(['success' => true, 'is_verified' => $builder->is_verified]);
    }

    /**
     * PATCH /api/v1/admin/workers/{id}/verify
     */
    public function verifyWorker(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        $worker = Worker::findOrFail($id);
        $before = ['is_verified' => $worker->is_verified];
        $worker->update(['is_verified' => !$worker->is_verified]);

        \App\Models\ActivityLog::recordAdminAction(
            auth()->id(),
            $worker->is_verified ? 'VERIFY' : 'UNVERIFY',
            $worker,
            $before,
            ['is_verified' => $worker->is_verified],
            $validated['reason']
        );

        return response()->json(['success' => true, 'is_verified' => $worker->is_verified]);
    }

    /**
     * PATCH /api/v1/admin/suppliers/{id}/verify
     */
    public function verifySupplier(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        $supplier = Supplier::findOrFail($id);
        $before = ['is_verified' => $supplier->is_verified];
        $supplier->update(['is_verified' => !$supplier->is_verified]);

        \App\Models\ActivityLog::recordAdminAction(
            auth()->id(),
            $supplier->is_verified ? 'VERIFY' : 'UNVERIFY',
            $supplier,
);

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
     * GET /api/v1/admin/worker-jobs
     */
    public function workerJobs(Request $request): JsonResponse
    {
        $jobs = \App\Models\WorkerJob::with(['user:id,name'])
            ->withCount('bids')
            ->when($request->filled('status'), fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data'    => $jobs->items(),
            'meta'    => ['total' => $jobs->total()],
        ]);
    }

    /**
     * GET /api/v1/admin/rfqs
     */
    public function rfqs(Request $request): JsonResponse
    {
        $rfqs = \App\Models\Rfq::with(['user:id,name'])
            ->withCount('bids')
            ->when($request->filled('status'), fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate(15);

        return response()->json([
            'success' => true,
            'data'    => $rfqs->items(),
            'meta'    => ['total' => $rfqs->total()],
        ]);
    }

    /**
     * PATCH /api/v1/admin/requirements/{id}/price
     */
    public function updateRequirementPrice(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'unlock_price' => ['nullable', 'numeric', 'min:0'],
        ]);

        $requirement = Requirement::findOrFail($id);
        $requirement->update(['unlock_price' => $data['unlock_price']]);

        return response()->json([
            'success' => true,
            'message' => 'Requirement unlock price updated.',
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
            'reason' => 'required|string|max:500'
        ]);

        $user = User::findOrFail($id);
        $nextVerified = !$user->is_verified;
        
        $before = [
            'is_verified' => $user->is_verified,
            'is_verified_business' => $user->is_verified_business,
            'verification_level' => $user->verification_level,
        ];

        $user->update([
            'is_verified' => $nextVerified,
            'is_verified_business' => $nextVerified,
            'verification_level' => $data['verification_level'] ?? ($nextVerified ? 'business_verified' : 'unverified'),
        ]);

        \App\Models\ActivityLog::recordAdminAction(
            auth()->id(),
            $nextVerified ? 'VERIFY' : 'UNVERIFY',
            $user,
            $before,
            [
                'is_verified' => $user->is_verified,
                'is_verified_business' => $user->is_verified_business,
                'verification_level' => $user->verification_level,
            ],
            $data['reason']
        );

        // Recalculate trust score using TrustScoreService
        app(TrustScoreService::class)->recalculateForUser($user);

        if ($nextVerified) {
            $user->notify(new AccountVerifiedNotification());
        }

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

    public function contactMessages()
    {
        return response()->json([
            'success' => true,
            'data' => \App\Models\ContactMessage::latest()->paginate(20)
        ]);
    }

    public function updateContactMessageStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:new,read,resolved'
        ]);
        $msg = \App\Models\ContactMessage::findOrFail($id);
        $msg->update(['status' => $validated['status']]);
        return response()->json(['success' => true, 'data' => $msg]);
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
    public function purgeMockUsers(Request $request): JsonResponse
    {
        if ($request->query('confirm') !== 'yes') {
            return response()->json([
                'success' => false,
                'message' => 'Missing confirmation token. Pass ?confirm=yes to proceed with destructive purge.'
            ], 403);
        }

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
