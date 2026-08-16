<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('app:sync-media', function () {
    $users = \App\Models\User::withoutGlobalScopes()->where('name', 'like', '%integral%')->orWhere('id', 2311)->get();
    foreach ($users as $u) {
        $u->avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb';
        $u->cover_image = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6';
        $u->save();
        $this->info("Updated User #{$u->id} ({$u->name}) avatar and cover.");

        $listings = \App\Models\Listing::withoutGlobalScopes()->where('user_id', $u->id)->get();
        foreach ($listings as $l) {
            $l->cover_image = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6';
            $l->save();
            $this->info("Updated Listing #{$l->id} (user_id #{$l->user_id}) cover image.");
        }
    }
})->purpose('Sync user avatar and cover image');

\Illuminate\Support\Facades\Schedule::command('subscriptions:downgrade')->daily();
\Illuminate\Support\Facades\Schedule::command('app:expire-requirements')->daily();
\Illuminate\Support\Facades\Schedule::command('app:disburse-monthly-wallet-credits-command')->daily();

\Illuminate\Support\Facades\Schedule::command('system:health-check')->everyFiveMinutes();

// TrueDial Analytics
\Illuminate\Support\Facades\Schedule::job(new \App\Modules\Truedial\Jobs\AggregateAnalyticsHourly())->hourly();
\Illuminate\Support\Facades\Schedule::job(new \App\Modules\Truedial\Jobs\ReconcileAnalyticsDaily())->dailyAt('00:05');
