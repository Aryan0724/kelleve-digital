<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\ProjectQuoteController;
use App\Http\Controllers\Api\V1\JobApplicationController;
use App\Http\Controllers\Api\V1\RfqQuotationController;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/projects/{id}/quotes', [ProjectQuoteController::class, 'store']);
    Route::patch('/projects/{id}/quotes/{quote_id}/shortlist', [ProjectQuoteController::class, 'shortlist']);
    Route::patch('/projects/{id}/quotes/{quote_id}/award', [ProjectQuoteController::class, 'award']);
    
    Route::post('/worker-jobs/{id}/apply', [JobApplicationController::class, 'store']);
    Route::patch('/worker-jobs/{id}/apply/{application_id}/award', [JobApplicationController::class, 'award']);

    Route::post('/rfqs/{id}/quotes', [RfqQuotationController::class, 'store']);
    Route::patch('/rfqs/{id}/quotes/{quotation_id}/award', [RfqQuotationController::class, 'award']);
});
