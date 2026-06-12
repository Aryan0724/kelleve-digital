<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;
use Illuminate\Cache\RateLimiting\Limit;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Enforce explicit morph mapping for polymorphic relations
        // This decouples the database "type" column from our internal fully qualified class names.
        Relation::enforceMorphMap([
            'Listing'        => 'App\Models\Listing',
            'Builder'        => 'App\Models\Builder',
            'BuilderProject' => 'App\Models\BuilderProject',
            'Supplier'       => 'App\Models\Supplier',
            'Worker'         => 'App\Models\Worker',
            'Blog'           => 'App\Models\Blog',
            'User'           => 'App\Models\User',
        ]);

        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('auth', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });
    }
}
