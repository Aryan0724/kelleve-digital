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
use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\User\PaymentController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\ReviewController;
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
            return "Database migrated successfully! (Seeders disabled to prevent memory crashes). Please remove this route later.";
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
    Route::apiResource('builders', BuilderController::class)->only(['index', 'show']);
    Route::get('builder-projects', [BuilderController::class, 'projects']);
    Route::get('builder-projects/{slug}', [BuilderController::class, 'projectShow']);
    
    Route::apiResource('suppliers', SupplierController::class)->only(['index', 'show']);
    Route::apiResource('workers', WorkerController::class)->only(['index', 'show']);
    Route::apiResource('blogs', BlogController::class)->only(['index', 'show']);
    
    // Public inquiry submission
    Route::post('inquiries', [InquiryController::class, 'store']);
    
    // Requirements (Masked for guests/free users, unmasked for premium/admin via Resource logic)
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
        
        Route::get('listings', [AdminController::class, 'listings']);
        Route::patch('listings/{id}/verify', [AdminController::class, 'verifyListing']);
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
    });
});
