<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Truedial\Controllers\Public\BusinessDirectoryController;
use App\Modules\Truedial\Controllers\Public\SearchController;
use App\Modules\Truedial\Controllers\OfferController;
use App\Modules\Truedial\Controllers\Auth\OtpController;

// Truedial specific routes
Route::prefix('v1/truedial')->middleware(['api'])->group(function () {
    
    // Auth Routes
    Route::prefix('auth')->group(function () {
        Route::post('/otp/send', [OtpController::class, 'sendOtp']);
        Route::post('/otp/verify', [OtpController::class, 'verifyOtp']);
    });
    
    // Direct Public Aliases
    Route::get('/businesses', [BusinessDirectoryController::class, 'index']);
    Route::get('/businesses/{slug}', [BusinessDirectoryController::class, 'show']);

    Route::prefix('public')->group(function () {
        Route::get('/businesses', [BusinessDirectoryController::class, 'index']);
        Route::get('/businesses/{slug}', [BusinessDirectoryController::class, 'show']);
        
        // Search & Discovery
        Route::get('/search', [SearchController::class, 'index']);
        Route::get('/search/autocomplete', [SearchController::class, 'autocomplete']);
        Route::get('/categories', [SearchController::class, 'categories']);
        
        // Reviews
        Route::get('/businesses/{slug}/reviews', [\App\Modules\Truedial\Controllers\Public\ReviewController::class, 'index']);

        // Analytics
        Route::post('/analytics/track', [\App\Modules\Truedial\Controllers\Public\AnalyticsTrackingController::class, 'track']);
        
        // Ecosystem Modules (TIER 3 - DEFERRED FROM BETA)
        // Route::get('/academy/courses', [\App\Modules\Truedial\Controllers\Public\AcademyController::class, 'courses']);
        // Route::get('/jobs', [\App\Modules\Truedial\Controllers\Public\JobBoardController::class, 'index']);
        // Route::get('/news', [\App\Modules\Truedial\Controllers\Public\NewsController::class, 'index']);
        
        Route::get('/requirements', [\App\Modules\Truedial\Controllers\Public\RequirementsController::class, 'sharedFeed']);
        Route::post('/consulting/lead', [\App\Modules\Truedial\Controllers\Public\ConsultingController::class, 'submitLead']);
    });
    
    // Offers
    Route::get('/public/offers', [\App\Modules\Truedial\Controllers\Public\OfferController::class, 'index']);
    Route::get('/public/businesses/{slug}/offers', [\App\Modules\Truedial\Controllers\Public\OfferController::class, 'businessOffers']);
    
    // Auth protected vendor routes
    Route::prefix('vendor')->middleware(['auth:sanctum'])->group(function () {
        Route::get('/my-business', [\App\Modules\Truedial\Controllers\Vendor\BusinessController::class, 'myBusiness']);
        Route::post('/businesses', [\App\Modules\Truedial\Controllers\Vendor\BusinessController::class, 'store']);
        Route::put('/businesses/{id}', [\App\Modules\Truedial\Controllers\Vendor\BusinessController::class, 'update']);
        Route::put('/businesses/me/products', [\App\Modules\Truedial\Controllers\Vendor\BusinessController::class, 'updateProducts']);
        Route::put('/businesses/me/services', [\App\Modules\Truedial\Controllers\Vendor\BusinessController::class, 'updateServices']);
        
        // Media Layer
        Route::post('/media', [\App\Modules\Truedial\Controllers\Vendor\MediaController::class, 'store']);
        Route::delete('/media/{id}', [\App\Modules\Truedial\Controllers\Vendor\MediaController::class, 'destroy']);
        Route::put('/media/order', [\App\Modules\Truedial\Controllers\Vendor\MediaController::class, 'updateOrder']);
        Route::put('/media/{id}/cover', [\App\Modules\Truedial\Controllers\Vendor\MediaController::class, 'setCover']);
        
        // Privilege Cards
        Route::post('/privilege-cards/generate', [\App\Modules\Truedial\Controllers\PrivilegeCardController::class, 'generate']);
        Route::get('/privilege-cards/my-cards', [\App\Modules\Truedial\Controllers\PrivilegeCardController::class, 'myCards']);
        
        // Reviews
        Route::get('/reviews', [\App\Modules\Truedial\Controllers\Vendor\ReviewManagementController::class, 'index']);
        Route::post('/reviews/{id}/reply', [\App\Modules\Truedial\Controllers\Vendor\ReviewManagementController::class, 'reply']);
        Route::post('/reviews/{id}/report', [\App\Modules\Truedial\Controllers\Vendor\ReviewManagementController::class, 'report']);
        
        // Offers management
        Route::get('/offers', [\App\Modules\Truedial\Controllers\Vendor\OfferManagementController::class, 'index']);
        Route::post('/offers', [\App\Modules\Truedial\Controllers\Vendor\OfferManagementController::class, 'store']);
        Route::put('/offers/{id}', [\App\Modules\Truedial\Controllers\Vendor\OfferManagementController::class, 'update']);
        
        // Analytics
        Route::get('/analytics/overview', [\App\Modules\Truedial\Controllers\Vendor\AnalyticsController::class, 'overview']);
        Route::get('/analytics/chart', [\App\Modules\Truedial\Controllers\Vendor\AnalyticsController::class, 'chart']);
        
        // Invoices & Payments
        // Route::get('/businesses/me/staff', [\App\Modules\Truedial\Controllers\Vendor\StaffController::class, 'index']);
        // Route::post('/businesses/me/staff', [\App\Modules\Truedial\Controllers\Vendor\StaffController::class, 'store']);
        
        // Marketing
        // Route::get('/marketing/campaigns', [\App\Modules\Truedial\Controllers\Vendor\MarketingController::class, 'index']);
        // Route::post('/marketing/campaigns', [\App\Modules\Truedial\Controllers\Vendor\MarketingController::class, 'store']);
        
        Route::post('/payments/order', [\App\Modules\Truedial\Controllers\Vendor\PaymentController::class, 'createOrder']);
        Route::post('/payments/verify', [\App\Modules\Truedial\Controllers\Vendor\PaymentController::class, 'verifyPayment']);
        
        // CRM
        Route::get('/crm/leads', [\App\Modules\Truedial\Controllers\Vendor\CrmController::class, 'leads']);
        Route::patch('/crm/leads/{id}/status', [\App\Modules\Truedial\Controllers\Vendor\CrmController::class, 'updateLeadStatus']);

        // Patients (EHR)
        Route::apiResource('/patients', \App\Modules\Truedial\Controllers\Vendor\PatientController::class);
        
        // Marketing Campaigns (Duplicate block, also commenting out)
        // Route::get('/marketing/campaigns', [\App\Modules\Truedial\Controllers\Vendor\MarketingCampaignController::class, 'index']);
        // Route::post('/marketing/campaigns', [\App\Modules\Truedial\Controllers\Vendor\MarketingCampaignController::class, 'store']);
    });
    
    // Auth protected user routes
    Route::prefix('user')->middleware(['auth:sanctum'])->group(function () {
        Route::post('/businesses/{slug}/reviews', [\App\Modules\Truedial\Controllers\User\ReviewController::class, 'store']);
        Route::put('/reviews/{id}/helpful', [\App\Modules\Truedial\Controllers\User\ReviewController::class, 'voteHelpful']);
        Route::put('/categories', [\App\Modules\Truedial\Controllers\User\CategoryController::class, 'updateCategories']);

        // Checkout & Payments
        Route::post('/checkout/initiate', [\App\Modules\Truedial\Controllers\Public\CheckoutController::class, 'initiate']);
        Route::post('/checkout/verify', [\App\Modules\Truedial\Controllers\Public\CheckoutController::class, 'verify']);
    });
    
    // Admin routes
    Route::prefix('admin')->middleware(['auth:sanctum'])->group(function () {
        Route::get('/stats', [\App\Modules\Truedial\Controllers\Admin\AdminController::class, 'stats']);
        Route::get('/vendors', [\App\Modules\Truedial\Controllers\Admin\AdminController::class, 'vendors']);
        Route::patch('/vendors/{id}/approve', [\App\Modules\Truedial\Controllers\Admin\AdminController::class, 'approveVendor']);
    });
});
