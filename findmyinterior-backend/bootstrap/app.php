<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        then: function () {
            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/truedial_api.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
            'role'  => \App\Http\Middleware\EnsureRoleMiddleware::class,
            'cross_auth' => \App\Http\Middleware\CrossPlatformAuth::class,
        ]);

        // Return a clean JSON 401 instead of trying to redirect to a named "login" web route
        $middleware->redirectGuestsTo(function (\Illuminate\Http\Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                abort(response()->json([
                    'success' => false,
                    'message' => 'Please log in to continue.',
                ], 401));
            }
            return '/login';
        });

        // Allow cross-origin requests from the frontend (Vercel)
        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
            \App\Http\Middleware\SecureHeadersMiddleware::class,
            \App\Http\Middleware\TenantResolverMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (Throwable $e, Request $request) {
            if ($request->is('api/*')) {
                return \App\Exceptions\ApiExceptionHandler::handle($e, $request);
            }
        });
    })->create();
