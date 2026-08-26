<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Named login route so Sanctum/Authenticate middleware never throws RouteNotFoundException
Route::get('/login', function () {
    return response()->json([
        'success' => false,
        'message' => 'Unauthenticated.'
    ], 401);
})->name('login');