<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('analytics_events', function (Blueprint $table) {
            $table->string('device')->nullable()->after('session_id');
            $table->string('referrer')->nullable()->after('device');
            $table->string('city')->nullable()->after('referrer');
            $table->string('campaign_id')->nullable()->after('city');
            $table->string('source')->nullable()->after('campaign_id');
            $table->string('medium')->nullable()->after('source');
            $table->json('utm_parameters')->nullable()->after('medium');
        });
    }

    public function down(): void
    {
        Schema::table('analytics_events', function (Blueprint $table) {
            $table->dropColumn([
                'device',
                'referrer',
                'city',
                'campaign_id',
                'source',
                'medium',
                'utm_parameters'
            ]);
        });
    }
};
