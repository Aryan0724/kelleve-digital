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
            $table->json('services')->nullable();
            $table->json('achievements')->nullable();
            $table->string('availability')->nullable();
            $table->string('response_time')->nullable();
            $table->json('languages')->nullable();
            $table->json('social_links')->nullable();
        });

        Schema::table('workers', function (Blueprint $table) {
            $table->json('services')->nullable();
            $table->json('achievements')->nullable();
            $table->string('availability')->nullable();
            $table->string('response_time')->nullable();
            $table->json('languages')->nullable();
            $table->json('social_links')->nullable();
        });

        Schema::table('suppliers', function (Blueprint $table) {
            $table->json('services')->nullable();
            $table->json('achievements')->nullable();
            $table->string('availability')->nullable();
            $table->string('response_time')->nullable();
            $table->json('languages')->nullable();
            $table->json('social_links')->nullable();
        });

        Schema::table('builders', function (Blueprint $table) {
            $table->json('services')->nullable();
            $table->json('achievements')->nullable();
            $table->string('availability')->nullable();
            $table->string('response_time')->nullable();
            $table->json('languages')->nullable();
            $table->json('social_links')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropColumn(['services', 'achievements', 'availability', 'response_time', 'languages', 'social_links']);
        });
        Schema::table('workers', function (Blueprint $table) {
            $table->dropColumn(['services', 'achievements', 'availability', 'response_time', 'languages', 'social_links']);
        });
        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropColumn(['services', 'achievements', 'availability', 'response_time', 'languages', 'social_links']);
        });
        Schema::table('builders', function (Blueprint $table) {
            $table->dropColumn(['services', 'achievements', 'availability', 'response_time', 'languages', 'social_links']);
        });
    }
};
