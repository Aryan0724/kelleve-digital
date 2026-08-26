<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Symfony\Component\Routing\Exception\RouteNotFoundException;

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

        // Replace the default Authenticate middleware with our custom version
        // that returns JSON 401 for API routes instead of redirecting to route('login')
        $middleware->replace(
            \Illuminate\Auth\Middleware\Authenticate::class,
            \App\Http\Middleware\Authenticate::class,
        );

        // Allow cross-origin requests from the frontend (Vercel)
        $middleware->api(prepend: [
            \Illuminate\Http\Middleware\HandleCors::class,
            \App\Http\Middleware\SecureHeadersMiddleware::class,
            \App\Http\Middleware\TenantResolverMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        \Sentry\Laravel\Integration::handles($exceptions);

        // Always render AuthenticationException as 401 JSON for API
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Please log in to continue.',
            ], 401);
        });

        // Safety net: Catch RouteNotFoundException thrown if anything tries to redirect to route('login')
        $exceptions->render(function (RouteNotFoundException $e, Request $request) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Please log in to continue.',
            ], 401);
        });

        $exceptions->render(function (Throwable $e, Request $request) {
            if ($request->is('api/*')) {
                return \App\Exceptions\ApiExceptionHandler::handle($e, $request);
            }
        });
    })->create();
