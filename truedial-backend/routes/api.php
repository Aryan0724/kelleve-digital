<?php

use Illuminate\Support\Facades\Route;

// Health check
Route::get('/health', function () {
    return response()->json(['status' => 'ok', 'app' => 'TrueDial', 'version' => '1.0.0']);
});

$registerCoreRoutes = function () {
    // ─── Public Auth ─────────────────────────────────────────────────────────
    Route::prefix('auth')->group(function () {
        Route::post('/register', [App\Http\Controllers\Auth\AuthController::class, 'register']);
        Route::post('/login', [App\Http\Controllers\Auth\AuthController::class, 'login']);
        Route::post('/otp/send', [App\Http\Controllers\Auth\OtpController::class, 'sendOtp']);
        Route::post('/otp/verify', [App\Http\Controllers\Auth\OtpController::class, 'verifyOtp']);
    });

    // ─── Public Directory & Search ───────────────────────────────────────────
    Route::get('/businesses', [App\Http\Controllers\Public\BusinessDirectoryController::class, 'index']);
    Route::get('/businesses/{slug}', [App\Http\Controllers\Public\BusinessDirectoryController::class, 'show']);
    Route::get('/businesses/{slug}/offers', [App\Http\Controllers\Public\OfferController::class, 'businessOffers']);
    Route::get('/businesses/{slug}/reviews', [App\Http\Controllers\Public\ReviewController::class, 'index']);

    Route::get('/categories', [App\Http\Controllers\Public\SearchController::class, 'categories']);
    Route::get('/search', [App\Http\Controllers\Public\SearchController::class, 'index']);
    Route::get('/search/autocomplete', [App\Http\Controllers\Public\SearchController::class, 'autocomplete']);
    Route::get('/listings', [App\Http\Controllers\Public\BusinessDirectoryController::class, 'index']);
    Route::get('/offers', [App\Http\Controllers\Public\OfferController::class, 'index']);

    // ─── Public Ecosystem & Content ──────────────────────────────────────────
    Route::get('/news', [App\Http\Controllers\Public\NewsController::class, 'index']);
    Route::get('/jobs', [App\Http\Controllers\Public\JobBoardController::class, 'index']);
    Route::get('/courses', [App\Http\Controllers\Public\AcademyController::class, 'courses']);
    Route::get('/academy/courses', [App\Http\Controllers\Public\AcademyController::class, 'courses']);
    Route::post('/consult', [App\Http\Controllers\Public\ConsultingController::class, 'submitLead']);
    Route::post('/consulting/lead', [App\Http\Controllers\Public\ConsultingController::class, 'submitLead']);
    Route::post('/inquiries', [App\Http\Controllers\Public\InquiryController::class, 'store']);
    Route::get('/locations', [App\Http\Controllers\Public\LocationController::class, 'index']);
    Route::get('/cities', [App\Http\Controllers\Public\LocationController::class, 'cities']);
    Route::get('/districts', [App\Http\Controllers\Public\LocationController::class, 'districts']);

    // ─── Advertisements & Analytics ──────────────────────────────────────────
    Route::get('/advertisements', [App\Http\Controllers\Public\AdvertisementController::class, 'index']);
    Route::post('/advertisements/{id}/impression', [App\Http\Controllers\Public\AdvertisementController::class, 'trackImpression']);
    Route::post('/advertisements/{id}/click', [App\Http\Controllers\Public\AdvertisementController::class, 'trackClick']);
    Route::post('/analytics/track', [App\Http\Controllers\Public\AnalyticsTrackingController::class, 'track']);

    // ─── Protected Routes (Sanctum) ──────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {
        // Auth Management
        Route::post('/auth/logout', [App\Http\Controllers\Auth\AuthController::class, 'logout']);
        Route::get('/auth/me', [App\Http\Controllers\Auth\AuthController::class, 'me']);
        Route::put('/auth/profile', [App\Http\Controllers\Auth\AuthController::class, 'updateProfile']);

        // Notifications
        Route::get('/notifications', [App\Http\Controllers\NotificationController::class, 'index']);
        Route::patch('/notifications/{id}/read', [App\Http\Controllers\NotificationController::class, 'markAsRead']);
        Route::post('/notifications/read-all', [App\Http\Controllers\NotificationController::class, 'markAllAsRead']);

        // Conversations & Chat
        Route::get('/conversations', [App\Http\Controllers\Public\ConversationController::class, 'index']);
        Route::post('/conversations', [App\Http\Controllers\Public\ConversationController::class, 'store']);
        Route::get('/conversations/{id}', [App\Http\Controllers\Public\ConversationController::class, 'show']);
        Route::get('/conversations/{id}/messages', [App\Http\Controllers\Public\ConversationController::class, 'messages']);
        Route::post('/conversations/{id}/messages', [App\Http\Controllers\Public\ConversationController::class, 'sendMessage']);
        Route::post('/conversations/{id}/read', [App\Http\Controllers\Public\ConversationController::class, 'markAsRead']);

        // Digital Privilege Cards
        Route::post('/privilege-cards/generate', [App\Http\Controllers\PrivilegeCardController::class, 'generate']);
        Route::get('/privilege-cards/my-cards', [App\Http\Controllers\PrivilegeCardController::class, 'myCards']);
        Route::get('/privilege-cards/my', [App\Http\Controllers\PrivilegeCardController::class, 'myCards']);
        Route::get('/privilege-cards', [App\Http\Controllers\PrivilegeCardController::class, 'myCards']);

        // User Customer Actions
        Route::prefix('user')->group(function () {
            Route::post('/businesses/{slug}/reviews', [App\Http\Controllers\User\ReviewController::class, 'store']);
            Route::put('/reviews/{id}/helpful', [App\Http\Controllers\User\ReviewController::class, 'voteHelpful']);
            Route::post('/reviews/{id}/helpful', [App\Http\Controllers\User\ReviewController::class, 'voteHelpful']);
            Route::get('/saved-businesses', [App\Http\Controllers\User\SavedVendorController::class, 'index']);
            Route::post('/saved-businesses/{id}/toggle', [App\Http\Controllers\User\SavedVendorController::class, 'toggle']);
        });

        // Vendor Dashboard Operations
        Route::prefix('vendor')->group(function () {
            // Business Profile
            Route::get('/my-business', [App\Http\Controllers\Vendor\BusinessController::class, 'myBusiness']);
            Route::get('/business', [App\Http\Controllers\Vendor\BusinessController::class, 'myBusiness']);
            Route::post('/businesses', [App\Http\Controllers\Vendor\BusinessController::class, 'store']);
            Route::post('/business', [App\Http\Controllers\Vendor\BusinessController::class, 'store']);
            Route::put('/businesses/{id}', [App\Http\Controllers\Vendor\BusinessController::class, 'update']);
            Route::put('/business/{id}', [App\Http\Controllers\Vendor\BusinessController::class, 'update']);
            Route::put('/businesses/me/products', [App\Http\Controllers\Vendor\BusinessController::class, 'updateProducts']);
            Route::put('/businesses/me/services', [App\Http\Controllers\Vendor\BusinessController::class, 'updateServices']);
            Route::put('/business/{id}/products', [App\Http\Controllers\Vendor\BusinessController::class, 'updateProducts']);
            Route::put('/business/{id}/services', [App\Http\Controllers\Vendor\BusinessController::class, 'updateServices']);

            // Media
            Route::get('/media', [App\Http\Controllers\Vendor\MediaController::class, 'index']);
            Route::post('/media', [App\Http\Controllers\Vendor\MediaController::class, 'store']);
            Route::delete('/media/{id}', [App\Http\Controllers\Vendor\MediaController::class, 'destroy']);
            Route::put('/media/order', [App\Http\Controllers\Vendor\MediaController::class, 'updateOrder']);
            Route::put('/media/{id}/cover', [App\Http\Controllers\Vendor\MediaController::class, 'setCover']);

            // Offers
            Route::get('/offers', [App\Http\Controllers\Vendor\OfferManagementController::class, 'index']);
            Route::post('/offers', [App\Http\Controllers\Vendor\OfferManagementController::class, 'store']);
            Route::put('/offers/{id}', [App\Http\Controllers\Vendor\OfferManagementController::class, 'update']);
            Route::delete('/offers/{id}', [App\Http\Controllers\Vendor\OfferManagementController::class, 'destroy']);

            // Reviews Management
            Route::get('/reviews', [App\Http\Controllers\Vendor\ReviewManagementController::class, 'index']);
            Route::post('/reviews/{id}/reply', [App\Http\Controllers\Vendor\ReviewManagementController::class, 'reply']);

            // Analytics
            Route::get('/analytics/overview', [App\Http\Controllers\Vendor\AnalyticsController::class, 'overview']);
            Route::get('/analytics/chart', [App\Http\Controllers\Vendor\AnalyticsController::class, 'chart']);
            Route::get('/analytics', [App\Http\Controllers\Vendor\AnalyticsController::class, 'overview']);

            // CRM Leads
            Route::get('/crm/leads', [App\Http\Controllers\Vendor\CrmController::class, 'leads']);
            Route::patch('/crm/leads/{id}/status', [App\Http\Controllers\Vendor\CrmController::class, 'updateLeadStatus']);
            Route::put('/crm/leads/{id}', [App\Http\Controllers\Vendor\CrmController::class, 'updateLeadStatus']);

            // Invoices
            Route::get('/invoices', [App\Http\Controllers\Vendor\InvoiceController::class, 'index']);
            Route::post('/invoices', [App\Http\Controllers\Vendor\InvoiceController::class, 'store']);

            // Marketing Campaigns
            Route::get('/marketing/campaigns', [App\Http\Controllers\Vendor\MarketingCampaignController::class, 'index']);
            Route::post('/marketing/campaigns', [App\Http\Controllers\Vendor\MarketingCampaignController::class, 'store']);
            Route::get('/campaigns', [App\Http\Controllers\Vendor\MarketingCampaignController::class, 'index']);
            Route::post('/campaigns', [App\Http\Controllers\Vendor\MarketingCampaignController::class, 'store']);

            // Healthcare EHR Patients
            Route::apiResource('/patients', App\Http\Controllers\Vendor\PatientController::class);

            // Payments & Subscriptions
            Route::post('/payments/order', [App\Http\Controllers\Vendor\PaymentController::class, 'createOrder']);
            Route::post('/payments/verify', [App\Http\Controllers\Vendor\PaymentController::class, 'verifyPayment']);

            // Privilege Cards for Vendor
            Route::post('/privilege-cards/generate', [App\Http\Controllers\PrivilegeCardController::class, 'generate']);
            Route::get('/privilege-cards/my-cards', [App\Http\Controllers\PrivilegeCardController::class, 'myCards']);
        });

        // Admin Platform Control
        Route::prefix('admin')->group(function () {
            Route::get('/stats', [App\Http\Controllers\Admin\AdminController::class, 'stats']);
            Route::get('/vendors', [App\Http\Controllers\Admin\AdminController::class, 'vendors']);
            Route::patch('/vendors/{id}/approve', [App\Http\Controllers\Admin\AdminController::class, 'approveVendor']);
            Route::put('/vendors/{id}/approve', [App\Http\Controllers\Admin\AdminController::class, 'approveVendor']);
        });
    });
};

// 1. Register canonical routes directly (prefixed with api/v1 automatically by bootstrap/app.php)
$registerCoreRoutes();

// 2. Register legacy aliases under /truedial (e.g. /api/v1/truedial/public/businesses, /api/v1/truedial/vendor/crm/leads)
Route::prefix('truedial')->group(function () use ($registerCoreRoutes) {
    Route::prefix('public')->group(function () {
        Route::get('/businesses', [App\Http\Controllers\Public\BusinessDirectoryController::class, 'index']);
        Route::get('/businesses/{slug}', [App\Http\Controllers\Public\BusinessDirectoryController::class, 'show']);
        Route::get('/businesses/{slug}/offers', [App\Http\Controllers\Public\OfferController::class, 'businessOffers']);
        Route::get('/businesses/{slug}/reviews', [App\Http\Controllers\Public\ReviewController::class, 'index']);
        Route::get('/offers', [App\Http\Controllers\Public\OfferController::class, 'index']);
        Route::get('/search', [App\Http\Controllers\Public\SearchController::class, 'index']);
        Route::get('/search/autocomplete', [App\Http\Controllers\Public\SearchController::class, 'autocomplete']);
        Route::get('/categories', [App\Http\Controllers\Public\SearchController::class, 'categories']);
        Route::get('/news', [App\Http\Controllers\Public\NewsController::class, 'index']);
        Route::get('/jobs', [App\Http\Controllers\Public\JobBoardController::class, 'index']);
        Route::get('/academy/courses', [App\Http\Controllers\Public\AcademyController::class, 'courses']);
        Route::post('/consulting/lead', [App\Http\Controllers\Public\ConsultingController::class, 'submitLead']);
        Route::post('/analytics/track', [App\Http\Controllers\Public\AnalyticsTrackingController::class, 'track']);
    });
    $registerCoreRoutes();
});
