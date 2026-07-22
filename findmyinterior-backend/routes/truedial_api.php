<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Truedial\Controllers\Public\BusinessDirectoryController;
use App\Modules\Truedial\Controllers\Public\SearchController;
use App\Modules\Truedial\Controllers\OfferController;

// Truedial specific routes
Route::prefix('v1/truedial')->middleware(['api'])->group(function () {
    
    Route::prefix('public')->group(function () {
        Route::get('/businesses', [BusinessDirectoryController::class, 'index']);
        Route::get('/businesses/{slug}', [BusinessDirectoryController::class, 'show']);
        
        // Search & Discovery
        Route::get('/search', [SearchController::class, 'index']);
        Route::get('/search/autocomplete', [SearchController::class, 'autocomplete']);
        Route::get('/categories', [SearchController::class, 'categories']);
        
        // Reviews
        Route::get('/businesses/{slug}/reviews', [\App\Modules\Truedial\Controllers\Public\ReviewController::class, 'index']);
    });
    
    // Offers
    Route::get('/public/offers', [OfferController::class, 'index']);
    Route::get('/public/offers/{id}', [OfferController::class, 'show']);
    
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
        Route::post('/offers', [\App\Modules\Truedial\Controllers\OfferController::class, 'store']);
    });
    
    // Auth protected user routes
    Route::prefix('user')->middleware(['auth:sanctum'])->group(function () {
        Route::post('/businesses/{slug}/reviews', [\App\Modules\Truedial\Controllers\User\ReviewController::class, 'store']);
        Route::put('/reviews/{id}/helpful', [\App\Modules\Truedial\Controllers\User\ReviewController::class, 'voteHelpful']);
    });
});
