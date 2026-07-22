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
        Schema::table('listings', function (Blueprint $table) {
            if (!Schema::hasColumn('listings', 'subscription_plan')) {
                $table->string('subscription_plan', 100)->default('free')->after('status');
            }
            if (!Schema::hasColumn('listings', 'subscription_status')) {
                $table->enum('subscription_status', ['active', 'past_due', 'canceled', 'trial'])->default('active')->after('subscription_plan');
            }
            if (!Schema::hasColumn('listings', 'verified_at')) {
                $table->timestamp('verified_at')->nullable()->after('subscription_status');
            }
            if (!Schema::hasColumn('listings', 'featured_until')) {
                $table->timestamp('featured_until')->nullable()->after('verified_at');
            }
            if (!Schema::hasColumn('listings', 'premium_until')) {
                $table->timestamp('premium_until')->nullable()->after('featured_until');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropColumn([
                'subscription_plan',
                'subscription_status',
                'verified_at',
                'featured_until',
                'premium_until'
            ]);
        });
    }
};
