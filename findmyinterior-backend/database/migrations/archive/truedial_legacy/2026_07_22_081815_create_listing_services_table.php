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
        Schema::create('listing_services', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->nullable();
            $table->unsignedBigInteger('listing_id');
            $table->unsignedBigInteger('service_category_id')->nullable();
            
            $table->string('name');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->json('tags')->nullable();
            
            $table->decimal('price_starting_at', 10, 2)->nullable();
            $table->enum('price_type', ['fixed', 'hourly', 'starting_at', 'custom'])->default('fixed');
            $table->string('currency', 10)->default('INR');
            $table->decimal('tax_rate', 5, 2)->nullable();
            $table->integer('duration_minutes')->nullable();
            
            $table->boolean('is_bookable')->default(false);
            $table->integer('booking_buffer')->nullable();
            $table->string('availability_type', 100)->nullable();
            $table->boolean('online_booking_enabled')->default(false);
            
            $table->enum('visibility', ['public', 'hidden', 'archived'])->default('public');
            $table->enum('status', ['draft', 'active', 'archived'])->default('active');
            $table->boolean('is_featured')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamp('published_at')->nullable();

            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('listing_id')->references('id')->on('listings')->onDelete('cascade');
            $table->foreign('service_category_id')->references('id')->on('service_categories')->onDelete('set null');
            $table->unique(['tenant_id', 'slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listing_services');
    }
};
