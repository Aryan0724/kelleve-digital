<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Phase A — Step 1:
 * Add structural columns needed for canonical plan migration:
 *   - billing_period_months: replaces hardcoded slug-based expiry logic
 *   - is_archived: marks legacy plans as deprecated without deleting them
 *
 * Legacy plan rows are preserved for historical referential integrity.
 * They will be marked is_archived=true, is_active=false via the seeder.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::connection('fmi_mysql')->table('subscription_plans', function (Blueprint $table) {
            if (!Schema::connection('fmi_mysql')->hasColumn('subscription_plans', 'billing_period_months')) {
                $table->integer('billing_period_months')
                    ->nullable()
                    ->default(12)
                    ->comment('Duration in months. null = indefinite (e.g. Starter). Used for subscription expiry instead of slug pattern matching.')
                    ->after('price_yearly');
            }

            if (!Schema::connection('fmi_mysql')->hasColumn('subscription_plans', 'is_archived')) {
                $table->boolean('is_archived')
                    ->default(false)
                    ->comment('True for legacy deprecated plans. Preserved for referential integrity but not selectable by new subscribers.')
                    ->after('is_active');
            }
        });
    }

    public function down(): void
    {
        Schema::connection('fmi_mysql')->table('subscription_plans', function (Blueprint $table) {
            $table->dropColumn(['billing_period_months', 'is_archived']);
        });
    }
};
