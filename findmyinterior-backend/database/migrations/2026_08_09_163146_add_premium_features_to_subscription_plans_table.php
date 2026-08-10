<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('subscription_plans', function (Blueprint $table) {
            $table->integer('monthly_wallet_credit')->default(0)->after('price_yearly');
            $table->integer('search_ranking_boost')->default(0)->after('monthly_wallet_credit');
            $table->integer('recommendation_score_boost')->default(0)->after('search_ranking_boost');
            $table->integer('contact_unlock_discount_percent')->default(0)->after('recommendation_score_boost');
            $table->integer('early_lead_access_hours')->nullable()->after('contact_unlock_discount_percent');
            $table->string('lead_notification_type')->default('none')->comment('none, category, instant, real-time')->after('early_lead_access_hours');
            $table->string('badge_type')->default('none')->comment('none, trusted, elite')->after('lead_notification_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscription_plans', function (Blueprint $table) {
            $table->dropColumn([
                'monthly_wallet_credit',
                'search_ranking_boost',
                'recommendation_score_boost',
                'contact_unlock_discount_percent',
                'early_lead_access_hours',
                'lead_notification_type',
                'badge_type'
            ]);
        });
    }
};
