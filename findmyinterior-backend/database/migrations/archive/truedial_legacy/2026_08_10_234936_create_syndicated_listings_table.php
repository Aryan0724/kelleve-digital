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
        Schema::create('syndicated_listings', function (Blueprint $table) {
            $table->id();
            $table->string('source_platform', 50)->index();
            $table->unsignedBigInteger('source_id')->index();
            $table->string('source_slug', 255)->nullable();
            $table->string('category', 100)->nullable();
            $table->string('title', 255)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('state', 100)->nullable();
            $table->string('country', 100)->default('India');
            $table->boolean('is_verified')->default(false);
            $table->decimal('rating', 3, 2)->nullable();
            $table->integer('review_count')->default(0);
            $table->longText('thumbnail_url')->nullable();
            $table->longText('profile_url')->nullable();
            $table->timestamp('last_synced_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Should be unique together
            $table->unique(['source_platform', 'source_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('syndicated_listings');
    }
};
