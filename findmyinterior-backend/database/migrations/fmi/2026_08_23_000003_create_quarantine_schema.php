<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Purpose-built quarantine schema.
     *
     * This migration targets the `findmyinterior_legacy_quarantine` database.
     * It does NOT clone the production schema. It uses purpose-built tables
     * with denormalized JSON payloads so the original record state is fully
     * preserved regardless of future production schema drift.
     *
     * Records land here when they cannot be safely migrated to the restoration
     * DB because of a broken or missing relationship (e.g. user_id IS NULL).
     *
     * The quarantine DB is:
     *   - Never exposed to normal application users
     *   - Available for forensic recovery and future relationship repair
     *   - The authoritative evidence that no legacy record was silently discarded
     */

    // Intentionally no $connection — this migration targets legacy_quarantine
    // and is run explicitly via php artisan migrate --database=legacy_quarantine
    // in the setup script.

    public function up(): void
    {
        if (!config()->has('database.connections.legacy_quarantine')) {
            return;
        }

        // ------------------------------------------------------------------
        // quarantine_projects
        // One row per legacy project that could not be migrated to restoration DB.
        // Reason is always documented.
        // ------------------------------------------------------------------
        Schema::connection('legacy_quarantine')->create('quarantine_projects', function (Blueprint $table) {
            $table->id();

            // Original legacy identity (preserved verbatim)
            $table->unsignedBigInteger('legacy_project_id')->unique();
            $table->unsignedBigInteger('legacy_user_id')->nullable()
                ->comment('NULL when quarantine_reason is user_id IS NULL');
            $table->string('legacy_opportunity_type')->nullable();
            $table->string('legacy_requirement_type')->nullable();
            $table->string('legacy_title')->nullable();
            $table->string('legacy_status', 50)->nullable();
            $table->timestamp('legacy_created_at')->nullable();
            $table->timestamp('legacy_updated_at')->nullable();

            // Complete original row as JSON — source of truth for recovery
            $table->json('original_data')
                ->comment('Complete serialized row from findmyinterior_legacy_restore.projects');

            // Why this record is quarantined (human-readable)
            $table->string('quarantine_reason')
                ->comment('e.g. user_id IS NULL — no valid owner');

            // The domain this project WOULD have been routed to, had migration been possible
            $table->string('intended_domain')->nullable()
                ->comment('projects | worker_jobs | rfqs');

            // Recovery metadata
            $table->boolean('is_recoverable')->default(false)
                ->comment('Set true if owner can be deterministically found');
            $table->text('recovery_notes')->nullable();

            $table->timestamps();

            $table->index('legacy_project_id');
            $table->index('legacy_user_id');
            $table->index('quarantine_reason');
        });

        // ------------------------------------------------------------------
        // quarantine_bids
        // Bids that could not be migrated because their parent project was quarantined.
        // Full original bid data preserved.
        // ------------------------------------------------------------------
        Schema::connection('legacy_quarantine')->create('quarantine_bids', function (Blueprint $table) {
            $table->id();

            // FK to parent quarantine record
            $table->unsignedBigInteger('quarantine_project_id')
                ->comment('FK to quarantine_projects.id');

            // Original legacy identity
            $table->unsignedBigInteger('legacy_bid_id')->unique();
            $table->unsignedBigInteger('legacy_requirement_id');
            $table->unsignedBigInteger('legacy_professional_id')->nullable();
            $table->string('legacy_status', 50)->nullable();
            $table->decimal('legacy_amount', 12, 2)->nullable();
            $table->timestamp('legacy_created_at')->nullable();

            // Complete original row
            $table->json('original_data')
                ->comment('Complete serialized row from findmyinterior_legacy_restore.bids');

            // The domain this bid WOULD have been routed to
            $table->string('intended_domain')->nullable()
                ->comment('bids | job_applications | rfq_quotations');

            $table->string('quarantine_reason')
                ->default('parent_project_quarantined');

            $table->timestamps();

            $table->index('quarantine_project_id');
            $table->index('legacy_bid_id');
            $table->index('legacy_requirement_id');
        });

        // ------------------------------------------------------------------
        // quarantine_unlocks
        // Contact unlocks that could not be migrated because their parent was quarantined.
        // ------------------------------------------------------------------
        Schema::connection('legacy_quarantine')->create('quarantine_unlocks', function (Blueprint $table) {
            $table->id();

            // FK to parent quarantine record
            $table->unsignedBigInteger('quarantine_project_id')
                ->comment('FK to quarantine_projects.id');

            // Original legacy identity
            $table->unsignedBigInteger('legacy_unlock_id')->unique();
            $table->unsignedBigInteger('legacy_requirement_id');
            $table->unsignedBigInteger('legacy_user_id')->nullable();
            $table->string('legacy_requirement_type')->nullable();
            $table->decimal('legacy_amount_paid', 12, 2)->nullable();
            $table->timestamp('legacy_created_at')->nullable();

            // Complete original row
            $table->json('original_data')
                ->comment('Complete serialized row from findmyinterior_legacy_restore.contact_unlocks');

            $table->string('quarantine_reason')
                ->default('parent_project_quarantined');

            $table->timestamps();

            $table->index('quarantine_project_id');
            $table->index('legacy_unlock_id');
            $table->index('legacy_requirement_id');
        });

        // ------------------------------------------------------------------
        // quarantine_migration_log
        // One summary record per migration run — gives an auditable trail of
        // what happened in each execution, including counts and any warnings.
        // ------------------------------------------------------------------
        Schema::connection('legacy_quarantine')->create('quarantine_migration_log', function (Blueprint $table) {
            $table->id();
            $table->string('run_id')->unique()->comment('UUID for this migration run');
            $table->timestamp('started_at');
            $table->timestamp('completed_at')->nullable();
            $table->string('engine_version')->nullable();

            // Conservation accounting
            $table->json('conservation_counts')
                ->comment('Source totals vs migrated/quarantined/excluded per entity');

            // Warnings emitted during migration (e.g. non-null award_value found)
            $table->json('warnings')->nullable();

            // Pass/fail result
            $table->string('result')->nullable()
                ->comment('PASS | FAIL | PARTIAL');
            $table->text('failure_reason')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        if (!config()->has('database.connections.legacy_quarantine')) {
            return;
        }

        Schema::connection('legacy_quarantine')->dropIfExists('quarantine_migration_log');
        Schema::connection('legacy_quarantine')->dropIfExists('quarantine_unlocks');
        Schema::connection('legacy_quarantine')->dropIfExists('quarantine_bids');
        Schema::connection('legacy_quarantine')->dropIfExists('quarantine_projects');
    }
};
