<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;
use Illuminate\Cache\RateLimiting\Limit;
use App\Models\Bid;
use App\Models\Message;
use App\Models\Review;
use App\Models\ContactUnlock;
use App\Models\Requirement;
use App\Observers\BidObserver;
use App\Observers\MessageObserver;
use App\Observers\ReviewObserver;
use App\Observers\ContactUnlockObserver;
use App\Observers\RequirementObserver;

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
            'Requirement'    => 'App\Models\Requirement',
            'Project'        => 'App\Models\Project', // Even though Requirement and Project share the same table, the class is used.
            'Rfq'            => 'App\Models\Rfq',
            'WorkerJob'      => 'App\Models\WorkerJob',
        ]);

        // Register Observers
        Bid::observe(BidObserver::class);
        Message::observe(MessageObserver::class);
        Review::observe(ReviewObserver::class);
        ContactUnlock::observe(ContactUnlockObserver::class);
        Requirement::observe(RequirementObserver::class);

        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('auth', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });
    }
}
