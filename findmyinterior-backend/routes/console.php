<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('app:sync-media', function () {
    $u = \App\Models\User::withoutGlobalScopes()->where('name', 'like', '%integral%')->first()
        ?? \App\Models\User::withoutGlobalScopes()->find(2311);

    if ($u) {
        $u->avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb';
        $u->cover_image = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6';
        $u->save();

        $l = \App\Models\Listing::withoutGlobalScopes()->where('user_id', $u->id)->first();
        if ($l) {
            $l->cover_image = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6';
            $l->save();
        }

        $this->info("Updated user {$u->id} ({$u->name}) media cleanly.");
    } else {
        $this->error("User not found.");
    }
})->purpose('Sync user avatar and cover image');

\Illuminate\Support\Facades\Schedule::command('subscriptions:downgrade')->daily();
\Illuminate\Support\Facades\Schedule::command('app:expire-requirements')->daily();
\Illuminate\Support\Facades\Schedule::command('app:disburse-monthly-wallet-credits-command')->daily();

\Illuminate\Support\Facades\Schedule::command('system:health-check')->everyFiveMinutes();

// TrueDial Analytics
\Illuminate\Support\Facades\Schedule::job(new \App\Modules\Truedial\Jobs\AggregateAnalyticsHourly())->hourly();
\Illuminate\Support\Facades\Schedule::job(new \App\Modules\Truedial\Jobs\ReconcileAnalyticsDaily())->dailyAt('00:05');
