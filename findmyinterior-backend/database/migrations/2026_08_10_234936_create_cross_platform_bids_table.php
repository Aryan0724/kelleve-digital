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
        Schema::create('cross_platform_bids', function (Blueprint $table) {
            $table->id();
            $table->string('source_platform', 50)->index();
            $table->string('target_platform', 50)->index();
            $table->unsignedBigInteger('bidder_user_id')->index();
            $table->unsignedBigInteger('target_listing_id')->index();
            $table->decimal('bid_amount', 15, 2)->nullable();
            $table->integer('timeline_days')->nullable();
            $table->text('message')->nullable();
            $table->string('status', 50)->default('submitted');
            $table->timestamp('imported_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cross_platform_bids');
    }
};
