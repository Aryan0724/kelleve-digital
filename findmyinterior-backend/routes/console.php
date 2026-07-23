<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

\Illuminate\Support\Facades\Schedule::command('subscriptions:downgrade')->daily();

// TrueDial Analytics
\Illuminate\Support\Facades\Schedule::job(new \App\Modules\Truedial\Jobs\AggregateAnalyticsHourly())->hourly();
\Illuminate\Support\Facades\Schedule::job(new \App\Modules\Truedial\Jobs\ReconcileAnalyticsDaily())->dailyAt('00:05');
