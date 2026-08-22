<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('analytics_daily', function (Blueprint $table) {
            $table->id();
            $table->foreignId('listing_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            
            // Standard metrics
            $table->unsignedInteger('views')->default(0);
            $table->unsignedInteger('search_impressions')->default(0);
            $table->unsignedInteger('search_clicks')->default(0);
            $table->unsignedInteger('gallery_views')->default(0);
            $table->unsignedInteger('product_views')->default(0);
            $table->unsignedInteger('service_views')->default(0);
            $table->unsignedInteger('offer_views')->default(0);
            
            // Interactions & Conversions
            $table->unsignedInteger('offer_clicks')->default(0);
            $table->unsignedInteger('offer_copies')->default(0);
            $table->unsignedInteger('website_clicks')->default(0);
            $table->unsignedInteger('phone_clicks')->default(0);
            $table->unsignedInteger('whatsapp_clicks')->default(0);
            $table->unsignedInteger('direction_clicks')->default(0);
            
            // Reputation
            $table->unsignedInteger('review_count')->default(0);
            $table->unsignedInteger('review_reply_count')->default(0);
            
            $table->timestamps();
            
            // Unique index for upserts
            $table->unique(['listing_id', 'date']);
            $table->index(['date', 'listing_id']); // For faster time-series queries
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytics_daily');
    }
};
