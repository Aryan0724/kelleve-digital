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
        if (Schema::hasTable('listings')) {
            Schema::table('listings', function (Blueprint $table) {
                try { $table->index('user_id'); } catch (\Throwable $e) {}
                try { $table->index('category_id'); } catch (\Throwable $e) {}
                try { $table->index('status'); } catch (\Throwable $e) {}
                try { $table->index('city'); } catch (\Throwable $e) {}
            });
        }

        if (Schema::hasTable('projects')) {
            Schema::table('projects', function (Blueprint $table) {
                try { $table->index('user_id'); } catch (\Throwable $e) {}
                try { $table->index('status'); } catch (\Throwable $e) {}
            });
        }

        if (Schema::hasTable('bids')) {
            Schema::table('bids', function (Blueprint $table) {
                try { $table->index('user_id'); } catch (\Throwable $e) {}
                try { $table->index('status'); } catch (\Throwable $e) {}
            });
        }

        if (Schema::hasTable('reviews')) {
            Schema::table('reviews', function (Blueprint $table) {
                try { $table->index('user_id'); } catch (\Throwable $e) {}
                try { $table->index('reviewer_id'); } catch (\Throwable $e) {}
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('core_tables', function (Blueprint $table) {
            //
        });
    }
};
