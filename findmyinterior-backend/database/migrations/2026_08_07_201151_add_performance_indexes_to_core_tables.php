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
            $table->index('user_id');
            $table->index('category_id');
            $table->index('status');
            $table->index('city');
        });

        Schema::table('requirements', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('status');
        });

        Schema::table('bids', function (Blueprint $table) {
            $table->index('requirement_id');
            $table->index('user_id');
            $table->index('status');
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->index('user_id');
            $table->index('reviewer_id');
        });
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
