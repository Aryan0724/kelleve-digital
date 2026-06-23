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

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->middleware('throttle:api')->group(function () {
    
    // Simple health check to verify PHP is running
    Route::get('/health', function () {
        return response()->json(['status' => 'ok', 'database' => 'connected']);
    });

    // TEMPORARY: Render Free Tier Migration Route
    Route::get('/setup-db-secret', function () {
        try {
            \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
            \Illuminate\Support\Facades\Artisan::call('db:seed', ['--force' => true]);
            return "Database migrated and seeded successfully!";
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    });

    // ─── Auth ─────────────────────────────────────────────────────────────
    Route::prefix('auth')->middleware('throttle:auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);
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
        return \App\Models\Category::orderBy('sort_order')->get();
    });
    Route::get('cities', function () {
        return \App\Models\City::orderBy('name')->get();
    });
    Route::get('districts', function () {
        return \App\Models\District::orderBy('name')->get();
    });
    Route::apiResource('listings', ListingController::class)->only(['index', 'show']);
    Route::post('listings/{id}/click', [ListingController::class, 'trackClick']);
    Route::apiResource('builders', BuilderController::class)->only(['index', 'show']);
    Route::get('builder-projects', [BuilderController::class, 'projects']);
    Route::get('builder-projects/{slug}', [BuilderController::class, 'projectShow']);
    
    Route::apiResource('suppliers', SupplierController::class)->only(['index', 'show']);
    Route::apiResource('workers', WorkerController::class)->only(['index', 'show']);
    Route::apiResource('blogs', BlogController::class)->only(['index', 'show']);
    
    // Public inquiry submission
    Route::post('inquiries', [InquiryController::class, 'store']);
    
    // Opportunity Backend Configuration
    Route::get('opportunities/config', [\App\Http\Controllers\Public\OpportunityConfigController::class, '__invoke']);

    // Opportunity Entity API Contracts (Sprint A)
    Route::apiResource('projects', OpportunityProjectController::class);
    Route::apiResource('rfqs', RfqController::class);
    Route::apiResource('worker-jobs', JobController::class);
    Route::get('shortlists', [\App\Http\Controllers\ShortlistController::class, 'index']);
    Route::post('shortlists', [\App\Http\Controllers\ShortlistController::class, 'store']);
    Route::delete('shortlists/{professional_id}', [\App\Http\Controllers\ShortlistController::class, 'destroy']);
    
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
        Route::put('change-password', [ProfileController::class, 'changePassword']);
        
        // Listing management for businesses
        Route::middleware('role:business,builder,supplier,worker')->group(function () {
            Route::get('listings', [ProfileController::class, 'listings']);
            Route::post('listings', [ProfileController::class, 'createListing']);
            Route::put('listings/{id}', [ProfileController::class, 'updateListing']);
            Route::post('listings/{id}/gallery', [ProfileController::class, 'addGalleryImages']);
            Route::delete('listings/{id}/gallery/{imageId}', [ProfileController::class, 'deleteGalleryImage']);
        });

        // Reviews
        Route::post('reviews', [ReviewController::class, 'store']);
        Route::get('reviews', [ReviewController::class, 'myReviews']);
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
        Route::patch('bids/{bid}/accept', [BidController::class, 'accept']);
        Route::patch('bids/{bid}/reject', [BidController::class, 'reject']);
        Route::patch('bids/{bid}/award', [BidController::class, 'award']);
        
        // Wallet
        Route::get('wallet', [WalletController::class, 'index']);
        Route::post('wallet/add-funds', [WalletController::class, 'store']); // Placeholder for testing
        
        // Contact Unlocks
        Route::post('/requirements/{requirement}/unlock', [UnlockController::class, 'unlockContact']);
        Route::get('/requirements/{requirement}/pricing-context', [\App\Http\Controllers\Api\V1\PricingController::class, 'getPricingContext']);
        // Saved Items
        Route::post('/saved-projects/{requirement}', [\App\Http\Controllers\Api\V1\SaveController::class, 'saveProject']);
        Route::delete('/saved-projects/{requirement}', [\App\Http\Controllers\Api\V1\SaveController::class, 'unsaveProject']);
        Route::get('/saved-projects', [\App\Http\Controllers\Api\V1\SaveController::class, 'getSavedProjects']);
        
        Route::post('/saved-vendors/{vendor}', [\App\Http\Controllers\Api\V1\SaveController::class, 'saveVendor']);
        Route::delete('/saved-vendors/{vendor}', [\App\Http\Controllers\Api\V1\SaveController::class, 'unsaveVendor']);
        Route::get('/saved-vendors', [\App\Http\Controllers\Api\V1\SaveController::class, 'getSavedVendors']);

        // Messaging
        Route::get('/conversations', [\App\Http\Controllers\Api\V1\ConversationController::class, 'index']);
        Route::get('/conversations/{id}', [\App\Http\Controllers\Api\V1\ConversationController::class, 'show']);
        Route::post('/requirements/{id}/conversations', [\App\Http\Controllers\Api\V1\ConversationController::class, 'store']);
        Route::get('/conversations/{id}/messages', [\App\Http\Controllers\Api\V1\MessageController::class, 'index']);
        Route::post('/conversations/{id}/messages', [\App\Http\Controllers\Api\V1\MessageController::class, 'store']);

        // Recommendations
        Route::get('/requirements/{id}/recommendations', [RecommendationController::class, 'index']);
        Route::post('/requirements/{id}/invite-vendor', [InviteController::class, 'invite']);

        // Vendor Metrics
        Route::get('/vendors/me/metrics', [VendorMetricController::class, 'show']);

        // Notifications
        Route::get('/notifications', function (Request $request) {
            return $request->user()->notifications;
        });
        Route::patch('/notifications/{id}/read', function (Request $request, $id) {
            $notification = $request->user()->notifications()->findOrFail($id);
            $notification->markAsRead();
            return response()->json(['message' => 'Marked as read']);
        });

        // Ecosystem Opportunities
        Route::apiResource('projects', \App\Http\Controllers\Api\V1\OpportunityProjectController::class);
        Route::post('projects/{id}/progress', [\App\Http\Controllers\Api\V1\OpportunityProjectController::class, 'updateProgress']);
        Route::post('projects/{id}/complete', [\App\Http\Controllers\Api\V1\OpportunityProjectController::class, 'complete']);

        Route::apiResource('rfqs', \App\Http\Controllers\Api\V1\RfqController::class);
        Route::post('rfqs/{id}/progress', [\App\Http\Controllers\Api\V1\RfqController::class, 'updateProgress']);

        Route::apiResource('worker-jobs', \App\Http\Controllers\Api\V1\JobController::class);
        Route::post('worker-jobs/{id}/progress', [\App\Http\Controllers\Api\V1\JobController::class, 'updateProgress']);
    });

    // ─── Payments (Protected) ─────────────────────────────────────────────
    Route::middleware('auth:sanctum')->prefix('payments')->group(function () {
        Route::post('create-order', [PaymentController::class, 'createOrder']);
        Route::post('verify', [PaymentController::class, 'verify']);
        Route::get('history', [PaymentController::class, 'history']);
    });

    // ─── Admin (Protected + Admin Role) ───────────────────────────────────
    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
        Route::get('dashboard', [AdminController::class, 'dashboard']);
        
        Route::get('users', [AdminController::class, 'users']);
        Route::patch('users/{id}/toggle-active', [AdminController::class, 'toggleUserActive']);
        Route::patch('users/{id}/verify', [AdminController::class, 'verifyUser']);
        
        Route::get('listings', [AdminController::class, 'listings']);
        Route::patch('listings/{id}/verify', [AdminController::class, 'verifyListing']);
        Route::patch('listings/{id}/reject', [AdminController::class, 'rejectListing']);
        Route::patch('listings/{id}/feature', [AdminController::class, 'featureListing']);
        
        Route::get('reviews/pending', [AdminController::class, 'pendingReviews']);
        Route::patch('reviews/{id}/approve', [AdminController::class, 'approveReview']);
        Route::delete('reviews/{id}', [AdminController::class, 'deleteReview']);
        
        Route::post('blogs', [AdminController::class, 'createBlog']);
        Route::delete('blogs/{id}', [AdminController::class, 'deleteBlog']);
        
        Route::patch('builders/{id}/verify', [AdminController::class, 'verifyBuilder']);
        Route::patch('suppliers/{id}/verify', [AdminController::class, 'verifySupplier']);
        Route::patch('workers/{id}/verify', [AdminController::class, 'verifyWorker']);
        
        Route::get('requirements', [AdminController::class, 'requirements']);
        Route::patch('requirements/{id}/close', [AdminController::class, 'closeRequirement']);
        Route::patch('requirements/{id}/status', [AdminController::class, 'updateRequirementStatus']);
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
        Route::post('subscription-plans/{id}', [AdminController::class, 'updateSubscriptionPlan']);

        // Categories
        Route::post('categories', [AdminController::class, 'createCategory']);
        Route::delete('categories/{id}', [AdminController::class, 'deleteCategory']);

        // Inquiries
        Route::get('inquiries', [AdminController::class, 'inquiries']);
        Route::patch('inquiries/{id}/resolve', [AdminController::class, 'resolveInquiry']);
        
        // Blogs
        Route::get('blogs', [AdminController::class, 'blogs']);
    });
});


