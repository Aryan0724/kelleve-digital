<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Public\BlogController;
use App\Http\Controllers\Public\BuilderController;
use App\Http\Controllers\Public\HomepageController;
use App\Http\Controllers\Public\InquiryController;
use App\Http\Controllers\Public\ListingController;
use App\Http\Controllers\Public\RequirementController;
use App\Http\Controllers\Public\SearchController;
use App\Http\Controllers\Public\SupplierController;
use App\Http\Controllers\Public\WorkerController;
use App\Http\Controllers\Api\V1\OpportunityProjectController;
use App\Http\Controllers\Api\V1\RfqController;
use App\Http\Controllers\Api\V1\JobController;
use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\User\PaymentController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\ReviewController;
use App\Http\Controllers\Api\V1\BidController;
use App\Http\Controllers\Api\V1\WalletController;
use App\Http\Controllers\Api\V1\UnlockController;
use App\Http\Controllers\Api\V1\RecommendationController;
use App\Http\Controllers\Api\V1\VendorMetricController;
use App\Http\Controllers\Api\V1\InviteController;
use App\Http\Controllers\Api\V1\Admin\RevenueController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// E2E Reset removed for security
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->middleware('throttle:api')->group(function () {
    
    Route::get('/health/live', [\App\Http\Controllers\Api\V1\HealthController::class, 'live']);
    Route::get('/health/ready', [\App\Http\Controllers\Api\V1\HealthController::class, 'ready']);
    Route::get('/debug-internal', function (\Illuminate\Http\Request $request) {
        $url = 'http://127.0.0.1:80/api/v1/listings?search=Interior+Designer';
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Host: backend']);
        $response = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        return response()->json([
            'url' => $url,
            'status' => $status,
            'response' => $response,
            'curl_error' => $error
        ]);
    });

    // ─── Temp fix ────────────────────────────────────────────────────────
    Route::get('/fix-unlocks', function() {
        $affected = \App\Models\ContactUnlock::where('requirement_type', 'App\Models\Requirement')
            ->whereNotExists(function ($query) {
                $query->select(\Illuminate\Support\Facades\DB::raw(1))
                    ->from('projects')
                    ->whereColumn('projects.id', 'contact_unlocks.requirement_id');
            })
            ->update(['requirement_type' => 'App\Models\WorkerJob']);
        return response()->json(['affected' => $affected]);
    });

    // ─── Auth ─────────────────────────────────────────────────────────────
    Route::prefix('auth')->middleware('throttle:auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);
        Route::post('send-otp', [AuthController::class, 'sendOtp']);
        Route::post('verify-otp', [AuthController::class, 'verifyOtp']);
        Route::post('login-with-otp', [AuthController::class, 'loginWithOtp']);
        Route::post('forgot-password', [PasswordResetController::class, 'forgotPassword']);
        Route::post('reset-password', [PasswordResetController::class, 'resetPassword']);

        Route::middleware('auth:sanctum')->group(function () {
            Route::get('me', [AuthController::class, 'me']);
            Route::post('logout', [AuthController::class, 'logout']);
        });
    });

    // ─── Public ───────────────────────────────────────────────────────────
    Route::get('homepage', HomepageController::class);
    Route::get('search', SearchController::class);
    
    // Dropdown Data
    Route::get('categories', function () {
        return \Illuminate\Support\Facades\Cache::remember('categories_dropdown', 3600, function() {
            return \App\Models\Category::orderBy('sort_order')->get()->toArray();
        });
    });
    Route::get('cities', function () {
        return \Illuminate\Support\Facades\Cache::remember('cities_dropdown', 3600, function() {
            return \App\Models\City::orderBy('name')->get()->toArray();
        });
    });
    Route::get('districts', function () {
        return \Illuminate\Support\Facades\Cache::remember('districts_dropdown', 3600, function() {
            return \App\Models\District::orderBy('name')->get()->toArray();
        });
    });
    Route::get('locations', [\App\Http\Controllers\LocationController::class, 'index']);
    Route::apiResource('listings', ListingController::class)->only(['index', 'show']);
    Route::post('listings/{id}/click', [ListingController::class, 'trackClick']);
    Route::apiResource('builders', BuilderController::class)->only(['index', 'show']);
    Route::get('builder-projects', [BuilderController::class, 'projects']);
    Route::get('builder-projects/{slug}', [BuilderController::class, 'projectShow']);
    
    Route::apiResource('suppliers', SupplierController::class)->only(['index', 'show']);
    Route::apiResource('workers', WorkerController::class)->only(['index', 'show']);
    Route::apiResource('blogs', BlogController::class)->only(['index', 'show']);
    Route::get('seo-pages/{slug}', [\App\Http\Controllers\Api\V1\Public\SeoPageController::class, 'show']);
    
    // Advertisements
    Route::get('advertisements', [\App\Http\Controllers\Api\V1\Public\AdvertisementController::class, 'index']);
    Route::post('advertisements/{id}/impression', [\App\Http\Controllers\Api\V1\Public\AdvertisementController::class, 'trackImpression']);
    Route::post('advertisements/{id}/click', [\App\Http\Controllers\Api\V1\Public\AdvertisementController::class, 'trackClick']);
    
    // Public inquiry submission
    Route::post('inquiries', [InquiryController::class, 'store']);
    Route::post('call-logs', [\App\Http\Controllers\Api\V1\Public\CallLogController::class, 'store']);
    Route::get('health', \App\Http\Controllers\HealthCheckController::class);
    Route::post('contact', [\App\Http\Controllers\Public\ContactController::class, 'store']);
    
    // Opportunity Backend Configuration
    Route::get('opportunities/config', [\App\Http\Controllers\Public\OpportunityConfigController::class, '__invoke']);

    // Opportunity Entity API Contracts (Sprint A) - Public Read
    Route::apiResource('projects', OpportunityProjectController::class)->only(['index', 'show']);
    Route::apiResource('rfqs', RfqController::class)->only(['index', 'show']);
    Route::apiResource('worker-jobs', JobController::class)->only(['index', 'show']);
    
    // Legacy Requirements (Masked for guests/free users, unmasked for premium/admin via Resource logic)
    Route::apiResource('requirements', RequirementController::class)->only(['index', 'show']);
    // Auth required to post requirement
    Route::post('requirements', [RequirementController::class, 'store'])->middleware('auth:sanctum');

    Route::get('subscriptions/plans', [PaymentController::class, 'plans']);

    // ─── User Dashboard (Protected) ───────────────────────────────────────
    Route::middleware('auth:sanctum')->prefix('user')->group(function () {
        Route::get('dashboard', DashboardController::class);
        
        Route::get('profile', [ProfileController::class, 'show']);
        Route::put('profile', [ProfileController::class, 'update']);
        Route::post('avatar', [ProfileController::class, 'uploadAvatar']);
        Route::post('cover', [ProfileController::class, 'uploadCover']);
        Route::put('change-password', [ProfileController::class, 'changePassword']);
        
        // Bookmarks
        Route::get('bookmarks', [\App\Http\Controllers\Api\V1\BookmarkController::class, 'index']);
        Route::post('bookmarks/toggle', [\App\Http\Controllers\Api\V1\BookmarkController::class, 'toggle']);
        
        Route::post('/verification/upload', [\App\Http\Controllers\Api\V1\VerificationController::class, 'upload']);
        
        // Listing & Professional Profile management
        Route::get('listings', [ProfileController::class, 'listings']);
        Route::post('listings', [ProfileController::class, 'createListing']);
        Route::put('listings/{id}', [ProfileController::class, 'updateListing']);
        Route::post('listings/{id}/cover', [ProfileController::class, 'uploadListingCover']);
        Route::post('listings/{id}/gallery', [ProfileController::class, 'addGalleryImages']);
        Route::put('listings/{id}/gallery/{imageId}', [ProfileController::class, 'updateGalleryImage']);
        Route::delete('listings/{id}/gallery/{imageId}', [ProfileController::class, 'deleteGalleryImage']);
        
        // Unified Role-based Professional Profile
        Route::get('professional-profile', [\App\Http\Controllers\Api\V1\ProfessionalProfileController::class, 'show']);
        Route::put('professional-profile', [\App\Http\Controllers\Api\V1\ProfessionalProfileController::class, 'update']);

        // Reviews
        Route::post('reviews', [ReviewController::class, 'store']);
        Route::get('reviews', [ReviewController::class, 'myReviews']);

        // Ventures — multi-GST company profiles
        Route::get('ventures', [\App\Http\Controllers\Api\V1\VentureController::class, 'index']);
        Route::post('ventures', [\App\Http\Controllers\Api\V1\VentureController::class, 'store']);
        Route::delete('ventures/{id}', [\App\Http\Controllers\Api\V1\VentureController::class, 'destroy']);
    });

    // ─── Marketplace Engine (Protected) ───────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {
        // Bids
        Route::post('bids', [BidController::class, 'store']);
        Route::get('bids', [BidController::class, 'myBids']);
        Route::get('requirements/{id}/bids', [BidController::class, 'indexForRequirement']);
        Route::get('requirements/{id}/bids/compare', [BidController::class, 'compare']);
        Route::patch('requirements/{id}/complete', [BidController::class, 'complete']);
        Route::put('requirements/{id}', [RequirementController::class, 'update']);
        Route::patch('requirements/{id}/status', [RequirementController::class, 'updateStatus']);
        Route::patch('requirements/{id}/extend', [RequirementController::class, 'extend']);
        Route::patch('bids/{bid}/accept', [BidController::class, 'accept']);
        Route::patch('bids/{bid}/reject', [BidController::class, 'reject']);
        Route::patch('bids/{bid}/award', [BidController::class, 'award']);
        Route::patch('requirements/{id}/accept-award', [BidController::class, 'acceptAward']);
        
        // Milestones
        Route::get('requirements/{id}/milestones', [\App\Http\Controllers\Api\V1\MilestoneController::class, 'index']);
        Route::post('requirements/{id}/milestones', [\App\Http\Controllers\Api\V1\MilestoneController::class, 'store']);
        Route::patch('requirements/{id}/milestones/{milestoneId}', [\App\Http\Controllers\Api\V1\MilestoneController::class, 'update']);
        Route::patch('requirements/{id}/milestones/{milestoneId}/pay', [\App\Http\Controllers\Api\V1\MilestoneController::class, 'markAsPaid']);
        
        // Wallet
        Route::get('wallet', [WalletController::class, 'index']);
        Route::post('wallet/add-funds', [WalletController::class, 'store']); // Placeholder for testing
        
        // Contact Unlocks
        Route::post('/requirements/{requirement}/unlock', [UnlockController::class, 'unlockContact']);
        Route::post('/listings/{listing}/unlock', [UnlockController::class, 'unlockListing']);
        Route::get('/requirements/{requirement}/pricing-context', [\App\Http\Controllers\Api\V1\PricingController::class, 'getPricingContext']);
        // Saved Items
        Route::post('/saved-projects/{requirement}', [\App\Http\Controllers\Api\V1\SaveController::class, 'saveProject']);
        Route::delete('/saved-projects/{requirement}', [\App\Http\Controllers\Api\V1\SaveController::class, 'unsaveProject']);
        Route::get('/saved-projects', [\App\Http\Controllers\Api\V1\SaveController::class, 'getSavedProjects']);
        
        Route::post('/saved-vendors/{vendor}', [\App\Http\Controllers\Api\V1\SaveController::class, 'saveVendor']);
        Route::delete('/saved-vendors/{vendor}', [\App\Http\Controllers\Api\V1\SaveController::class, 'unsaveVendor']);
        Route::get('/saved-vendors', [\App\Http\Controllers\Api\V1\SaveController::class, 'getSavedVendors']);

        // Shortlists
        Route::get('shortlists', [\App\Http\Controllers\ShortlistController::class, 'index']);
        Route::post('shortlists', [\App\Http\Controllers\ShortlistController::class, 'store']);
        Route::delete('shortlists/{professional_id}', [\App\Http\Controllers\ShortlistController::class, 'destroy']);

        // Messaging
        Route::get('/conversations', [\App\Http\Controllers\Api\V1\ConversationController::class, 'index']);
        Route::post('/conversations', [\App\Http\Controllers\Api\V1\ConversationController::class, 'storeDirect']);
        Route::get('/conversations/{id}', [\App\Http\Controllers\Api\V1\ConversationController::class, 'show']);
        Route::post('/requirements/{id}/conversations', [\App\Http\Controllers\Api\V1\ConversationController::class, 'store']);
        Route::get('/conversations/{id}/messages', [\App\Http\Controllers\Api\V1\MessageController::class, 'index']);
        Route::post('/conversations/{id}/messages', [\App\Http\Controllers\Api\V1\MessageController::class, 'store']);

        // Recommendations
        Route::get('/requirements/{id}/recommendations', [RecommendationController::class, 'index']);
        Route::post('/requirements/{id}/invite-vendor', [InviteController::class, 'invite']);

        // Vendor Metrics
        Route::get('/vendors/me/metrics', [VendorMetricController::class, 'show']);

        // User Advertisements
        Route::get('user/advertisements', [\App\Http\Controllers\Api\V1\UserAdvertisementController::class, 'index']);
        Route::post('user/advertisements', [\App\Http\Controllers\Api\V1\UserAdvertisementController::class, 'store']);

        // Notifications
        Route::get('/notifications', function (Request $request) {
            return $request->user()->notifications;
        });
        Route::patch('/notifications/{id}/read', function (Request $request, $id) {
            $notification = $request->user()->notifications()->findOrFail($id);
            $notification->markAsRead();
            return response()->json(['message' => 'Marked as read']);
        });

        // Ecosystem Opportunities — Write operations require auth
        // (Read routes index/show are already registered publicly above)
        Route::post('projects', [\App\Http\Controllers\Api\V1\OpportunityProjectController::class, 'store']);
        Route::put('projects/{id}', [\App\Http\Controllers\Api\V1\OpportunityProjectController::class, 'update']);
        Route::patch('projects/{id}', [\App\Http\Controllers\Api\V1\OpportunityProjectController::class, 'update']);
        Route::delete('projects/{id}', [\App\Http\Controllers\Api\V1\OpportunityProjectController::class, 'destroy']);
        Route::post('projects/{id}/progress', [\App\Http\Controllers\Api\V1\OpportunityProjectController::class, 'updateProgress']);
        Route::post('projects/{id}/complete', [\App\Http\Controllers\Api\V1\OpportunityProjectController::class, 'complete']);

        Route::post('rfqs', [\App\Http\Controllers\Api\V1\RfqController::class, 'store']);
        Route::put('rfqs/{id}', [\App\Http\Controllers\Api\V1\RfqController::class, 'update']);
        Route::patch('rfqs/{id}', [\App\Http\Controllers\Api\V1\RfqController::class, 'update']);
        Route::delete('rfqs/{id}', [\App\Http\Controllers\Api\V1\RfqController::class, 'destroy']);
        Route::post('rfqs/{id}/progress', [\App\Http\Controllers\Api\V1\RfqController::class, 'updateProgress']);

        Route::post('worker-jobs', [\App\Http\Controllers\Api\V1\JobController::class, 'store']);
        Route::put('worker-jobs/{id}', [\App\Http\Controllers\Api\V1\JobController::class, 'update']);
        Route::patch('worker-jobs/{id}', [\App\Http\Controllers\Api\V1\JobController::class, 'update']);
        Route::delete('worker-jobs/{id}', [\App\Http\Controllers\Api\V1\JobController::class, 'destroy']);
        Route::post('worker-jobs/{id}/progress', [\App\Http\Controllers\Api\V1\JobController::class, 'updateProgress']);

        // Verification & Trust
        Route::get('/verification/status', [\App\Http\Controllers\Api\V1\VerificationController::class, 'status']);
        Route::post('/verification/upload', [\App\Http\Controllers\Api\V1\VerificationController::class, 'upload']);
        Route::delete('/verification/document/{id}', [\App\Http\Controllers\Api\V1\VerificationController::class, 'destroy']);
    });

    // ─── Payments (Protected) ─────────────────────────────────────────────
    Route::middleware('auth:sanctum')->prefix('payments')->group(function () {
        Route::post('create-order', [PaymentController::class, 'createOrder']);
        Route::post('pay-with-wallet', [PaymentController::class, 'payWithWallet']);
        Route::post('verify', [PaymentController::class, 'verify']);
        Route::get('history', [PaymentController::class, 'history']);
    });

    // ─── Admin (Protected + Admin Role) ───────────────────────────────────
    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
        Route::get('dashboard', [AdminController::class, 'dashboard']);
        
        Route::get('users', [AdminController::class, 'users']);
        Route::patch('users/{id}/toggle-active', [AdminController::class, 'toggleUserActive']);
        Route::patch('users/{id}/verify', [AdminController::class, 'verifyUser']);
        Route::delete('users/{id}', [AdminController::class, 'deleteUser']);
        Route::delete('users/mock/purge', [AdminController::class, 'purgeMockUsers']);
        
        Route::get('listings', [AdminController::class, 'listings']);
        Route::patch('listings/{id}/verify', [AdminController::class, 'verifyListing']);
        Route::patch('listings/{id}/reject', [AdminController::class, 'rejectListing']);
        Route::patch('listings/{id}/feature', [AdminController::class, 'featureListing']);
        
        // Trust & Verifications Admin
        Route::get('verifications', [\App\Http\Controllers\Api\V1\Admin\VerificationController::class, 'index']);
        Route::get('verifications/documents/{id}', [\App\Http\Controllers\Api\V1\Admin\VerificationController::class, 'showDocument']);
        Route::patch('verifications/documents/{id}/approve', [\App\Http\Controllers\Api\V1\Admin\VerificationController::class, 'approveDocument']);
        Route::patch('verifications/documents/{id}/reject', [\App\Http\Controllers\Api\V1\Admin\VerificationController::class, 'rejectDocument']);
        Route::patch('verifications/users/{id}/approve-business', [\App\Http\Controllers\Api\V1\Admin\VerificationController::class, 'approveBusiness']);
        Route::patch('verifications/users/{id}/revoke-business', [\App\Http\Controllers\Api\V1\Admin\VerificationController::class, 'revokeBusiness']);

        Route::get('reviews/pending', [AdminController::class, 'pendingReviews']);
        Route::patch('reviews/{id}/approve', [AdminController::class, 'approveReview']);
        Route::delete('reviews/{id}', [AdminController::class, 'deleteReview']);
        
        Route::post('settings', [\App\Http\Controllers\SettingController::class, 'updateAll']);

        // Advertisements Management
        Route::apiResource('advertisements', \App\Http\Controllers\Api\V1\Admin\AdvertisementController::class);
        
        Route::post('blogs', [AdminController::class, 'createBlog']);
        Route::put('blogs/{id}', [AdminController::class, 'updateBlog']);
        Route::delete('blogs/{id}', [AdminController::class, 'deleteBlog']);
        
        Route::apiResource('locations', \App\Http\Controllers\LocationController::class)->except(['index', 'show']);
        Route::get('settings', [\App\Http\Controllers\SettingController::class, 'index']);
        Route::put('settings', [\App\Http\Controllers\SettingController::class, 'update']);

        Route::patch('builders/{id}/verify', [AdminController::class, 'verifyBuilder']);
        Route::patch('suppliers/{id}/verify', [AdminController::class, 'verifySupplier']);
        Route::patch('workers/{id}/verify', [AdminController::class, 'verifyWorker']);
        
        Route::get('requirements', [AdminController::class, 'requirements']);
        Route::patch('requirements/{id}/close', [AdminController::class, 'closeRequirement']);
        Route::patch('requirements/{id}/status', [AdminController::class, 'updateRequirementStatus']);
        Route::patch('requirements/{id}/price', [AdminController::class, 'updateRequirementPrice']);
        Route::patch('requirements/{id}/approve', [AdminController::class, 'approveRequirement']);
        Route::patch('requirements/{id}/reject', [AdminController::class, 'rejectRequirement']);

        // Projects
        Route::post('projects/{id}/reviews', [App\Http\Controllers\Api\V1\ReviewController::class, 'store']);

        // Projects
        Route::get('projects', [App\Http\Controllers\Api\V1\ProjectController::class, 'index']);
        Route::get('projects/{id}', [App\Http\Controllers\Api\V1\ProjectController::class, 'show']);
        Route::post('projects/{id}/complete', [App\Http\Controllers\Api\V1\ProjectController::class, 'complete']);
        Route::post('projects/{id}/progress', [App\Http\Controllers\Api\V1\ProjectController::class, 'markProgress']);

        // Revenue Dashboard
        Route::get('revenue', [RevenueController::class, 'index']);
        Route::get('payments', [AdminController::class, 'payments']);

        // Database Explorer (God Mode)
        Route::get('database/tables', [\App\Http\Controllers\Admin\DatabaseExplorerController::class, 'tables']);
        Route::get('database/query/{table}', [\App\Http\Controllers\Admin\DatabaseExplorerController::class, 'query']);
        Route::delete('database/query/{table}/{id}', [\App\Http\Controllers\Admin\DatabaseExplorerController::class, 'deleteRow']);

        // Subscription Plans
        Route::apiResource('subscription-plans', \App\Http\Controllers\Admin\SubscriptionPlanController::class)->except(['show']);

        // Categories
        Route::post('categories', [AdminController::class, 'createCategory']);
        Route::delete('categories/{id}', [AdminController::class, 'deleteCategory']);

        // Inquiries & Contact
        Route::get('inquiries', [AdminController::class, 'inquiries']);
        Route::patch('inquiries/{id}/resolve', [AdminController::class, 'resolveInquiry']);
        Route::get('contact-messages', [AdminController::class, 'contactMessages']);
        Route::patch('contact-messages/{id}/status', [AdminController::class, 'updateContactMessageStatus']);
        
        // Blogs
        Route::get('blogs', [AdminController::class, 'blogs']);
        
        // System Health Dashboard
        Route::get('system-health', [\App\Http\Controllers\Admin\SystemHealthController::class, 'index']);
        Route::get('system-health/logs', [\App\Http\Controllers\Admin\SystemHealthController::class, 'logs']);
    });

    require __DIR__.'/api_c1_marketplace.php';
});

Route::get('clear-cache', function () {
    if (function_exists('opcache_reset')) {
        @opcache_reset();
    }
    \Illuminate\Support\Facades\Artisan::call('route:clear');
    \Illuminate\Support\Facades\Artisan::call('config:clear');
    \Illuminate\Support\Facades\Artisan::call('cache:clear');
    return response()->json(['success' => true, 'message' => 'OPcache, route, config, and application cache reset successfully.']);
});
