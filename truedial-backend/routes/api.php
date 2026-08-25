<?php
use Illuminate\Support\Facades\Route;

Route::get('/health', function() {
    return response()->json(['status' => 'ok', 'app' => 'TrueDial']);
});

Route::post('/auth/register', [App\Http\Controllers\Auth\AuthController::class, 'register']);
Route::post('/auth/login', [App\Http\Controllers\Auth\AuthController::class, 'login']);
Route::post('/auth/otp/send', [App\Http\Controllers\Auth\OtpController::class, 'sendOtp']);
Route::post('/auth/otp/verify', [App\Http\Controllers\Auth\OtpController::class, 'verifyOtp']);

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
Route::get('/courses', [App\Http\Controllers\Public\AcademyController::class, 'courses']);
Route::post('/consult', [App\Http\Controllers\Public\ConsultingController::class, 'submitLead']);
Route::post('/analytics/track', [App\Http\Controllers\Public\AnalyticsTrackingController::class, 'track']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [App\Http\Controllers\Auth\AuthController::class, 'logout']);
    Route::get('/auth/me', [App\Http\Controllers\Auth\AuthController::class, 'me']);
    Route::put('/auth/profile', [App\Http\Controllers\Auth\AuthController::class, 'updateProfile']);
    // CONVERSATIONS & CHAT
    Route::get('/conversations', [App\Http\Controllers\Public\ConversationController::class, 'index']);
    Route::post('/conversations', [App\Http\Controllers\Public\ConversationController::class, 'store']);
    Route::get('/conversations/{id}', [App\Http\Controllers\Public\ConversationController::class, 'show']);
    Route::get('/conversations/{id}/messages', [App\Http\Controllers\Public\ConversationController::class, 'messages']);
    Route::post('/conversations/{id}/messages', [App\Http\Controllers\Public\ConversationController::class, 'sendMessage']);
    Route::post('/conversations/{id}/read', [App\Http\Controllers\Public\ConversationController::class, 'markAsRead']);
    
    // EXPLORER
    Route::post('/businesses/{slug}/reviews', [App\Http\Controllers\User\ReviewController::class, 'store']);
    Route::post('/reviews/{id}/helpful', [App\Http\Controllers\User\ReviewController::class, 'voteHelpful']);
    
    // VENDOR
    Route::prefix('vendor')->group(function() {
        Route::get('/business', [App\Http\Controllers\Vendor\BusinessController::class, 'myBusiness']);
        Route::post('/business', [App\Http\Controllers\Vendor\BusinessController::class, 'store']);
        Route::put('/business/{id}', [App\Http\Controllers\Vendor\BusinessController::class, 'update']);
        Route::put('/business/{id}/products', [App\Http\Controllers\Vendor\BusinessController::class, 'updateProducts']);
        Route::put('/business/{id}/services', [App\Http\Controllers\Vendor\BusinessController::class, 'updateServices']);
        
        Route::get('/analytics', [App\Http\Controllers\Vendor\AnalyticsController::class, 'overview']);
        Route::get('/analytics/chart', [App\Http\Controllers\Vendor\AnalyticsController::class, 'chart']);
        
        Route::apiResource('offers', App\Http\Controllers\Vendor\OfferManagementController::class);
        
        Route::get('/reviews', [App\Http\Controllers\Vendor\ReviewManagementController::class, 'index']);
        Route::post('/reviews/{id}/reply', [App\Http\Controllers\Vendor\ReviewManagementController::class, 'reply']);
        
        Route::get('/media', [App\Http\Controllers\Vendor\MediaController::class, 'index']);
        Route::post('/media', [App\Http\Controllers\Vendor\MediaController::class, 'upload']);
        Route::delete('/media/{id}', [App\Http\Controllers\Vendor\MediaController::class, 'destroy']);
        
        Route::get('/invoices', [App\Http\Controllers\Vendor\InvoiceController::class, 'index']);
        Route::post('/invoices', [App\Http\Controllers\Vendor\InvoiceController::class, 'store']);
        
        Route::get('/crm/leads', [App\Http\Controllers\Vendor\CrmController::class, 'leads']);
        Route::put('/crm/leads/{id}', [App\Http\Controllers\Vendor\CrmController::class, 'updateLeadStatus']);
        
        Route::get('/campaigns', [App\Http\Controllers\Vendor\MarketingCampaignController::class, 'index']);
        Route::post('/campaigns', [App\Http\Controllers\Vendor\MarketingCampaignController::class, 'store']);
    });
    
    // ADMIN
    Route::prefix('admin')->group(function() {
        Route::get('/stats', [App\Http\Controllers\Admin\AdminController::class, 'stats']);
        Route::get('/vendors', [App\Http\Controllers\Admin\AdminController::class, 'vendors']);
        Route::put('/vendors/{id}/approve', [App\Http\Controllers\Admin\AdminController::class, 'approveVendor']);
    });
    
    // PRIVILEGE CARDS
    Route::post('/privilege-cards/generate', [App\Http\Controllers\PrivilegeCardController::class, 'generate']);
    Route::get('/privilege-cards/my', [App\Http\Controllers\PrivilegeCardController::class, 'myCards']);
});
