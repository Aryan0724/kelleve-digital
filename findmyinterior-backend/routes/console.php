<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

// Console routes

\Illuminate\Support\Facades\Schedule::command('subscriptions:downgrade')->daily();
\Illuminate\Support\Facades\Schedule::command('app:expire-requirements')->daily();
\Illuminate\Support\Facades\Schedule::command('app:disburse-monthly-wallet-credits-command')->daily();

\Illuminate\Support\Facades\Schedule::command('system:health-check')->everyFiveMinutes();

// TrueDial Analytics
\Illuminate\Support\Facades\Schedule::job(new \App\Modules\Truedial\Jobs\AggregateAnalyticsHourly())->hourly();
\Illuminate\Support\Facades\Schedule::job(new \App\Modules\Truedial\Jobs\ReconcileAnalyticsDaily())->dailyAt('00:05');
