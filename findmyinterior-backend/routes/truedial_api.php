<?php

use Illuminate\Support\Facades\Route;

// Truedial specific routes
Route::prefix('v1/truedial')->middleware(['api'])->group(function () {
    
    // Public business search
    Route::get('/public/businesses', [\App\Modules\Truedial\Controllers\Public\BusinessDirectoryController::class, 'index']);
    Route::get('/public/businesses/{slug}', [\App\Modules\Truedial\Controllers\Public\BusinessDirectoryController::class, 'show']);
    
    // Offers
    Route::get('/public/offers', [\App\Modules\Truedial\Controllers\OfferController::class, 'index']);
    Route::get('/public/offers/{id}', [\App\Modules\Truedial\Controllers\OfferController::class, 'show']);
    
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
        
        // Offers management
        Route::post('/offers', [\App\Modules\Truedial\Controllers\OfferController::class, 'store']);
    });
});
