<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The requirement_images table has a foreign key referencing 'requirements',
     * but that table was renamed to 'projects' in migration 2026_06_20_135323.
     * This migration fixes the broken FK so image uploads don't throw DB errors.
     */
    public function up(): void
    {
        // Only proceed if the table exists
        if (!Schema::hasTable('requirement_images')) {
            return;
        }

        Schema::table('requirement_images', function (Blueprint $table) {
            // Drop the old broken FK that points to non-existent 'requirements' table
            // Use try/catch because the FK name may vary across environments
            try {
                $table->dropForeign(['requirement_id']);
            } catch (\Exception $e) {
                // FK may already be missing or have a different name — that's fine
            }

            // Add updated FK pointing to the 'projects' table
            $table->foreign('requirement_id')
                  ->references('id')
                  ->on('projects')
                  ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        if (!Schema::hasTable('requirement_images')) {
            return;
        }

        Schema::table('requirement_images', function (Blueprint $table) {
            try {
                $table->dropForeign(['requirement_id']);
            } catch (\Exception $e) {
                // ignore
            }
            // Restore old FK (requirements table must exist)
            if (Schema::hasTable('requirements')) {
                $table->foreign('requirement_id')
                      ->references('id')
                      ->on('requirements')
                      ->cascadeOnDelete();
            }
        });
    }
};
