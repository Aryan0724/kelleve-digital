<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->decimal('price_monthly', 10, 2);
            $table->decimal('price_yearly', 10, 2);
            $table->json('features')->comment('Array of feature strings shown on pricing page');
            $table->integer('max_listings')->default(1);
            $table->integer('max_gallery_images')->default(10);
            $table->integer('lead_unlocks_per_month')->default(0)->comment('0 = not applicable');
            $table->boolean('can_see_all_leads')->default(false)->comment('Premium subscribers see all requirement contacts');
            $table->boolean('is_featured_listing')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscription_plans');
    }
};
