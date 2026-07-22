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
        Schema::create('listing_products', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->nullable();
            $table->unsignedBigInteger('listing_id');
            $table->unsignedBigInteger('product_category_id')->nullable();
            
            $table->string('name');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->json('tags')->nullable();
            
            $table->decimal('price', 10, 2)->nullable();
            $table->decimal('price_max', 10, 2)->nullable();
            $table->string('currency', 10)->default('INR');
            $table->decimal('tax_rate', 5, 2)->nullable();
            $table->string('unit', 100)->nullable();
            $table->boolean('is_in_stock')->default(true);
            $table->string('sku')->nullable();
            $table->string('brand')->nullable();
            $table->string('manufacturer')->nullable();
            
            $table->enum('visibility', ['public', 'hidden', 'archived'])->default('public');
            $table->enum('status', ['draft', 'active', 'archived'])->default('active');
            $table->boolean('is_featured')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamp('published_at')->nullable();

            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('listing_id')->references('id')->on('listings')->onDelete('cascade');
            $table->foreign('product_category_id')->references('id')->on('product_categories')->onDelete('set null');
            $table->unique(['tenant_id', 'slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('listing_products');
    }
};
