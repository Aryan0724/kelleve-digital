<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'fmi_mysql';
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vendor_metrics', function (Blueprint $table) {

            $table->id();
            $table->foreignId('vendor_id')->constrained('users')->onDelete('cascade');
            $table->unique('vendor_id');
            $table->integer('total_bids')->default(0);
            $table->integer('successful_bids')->default(0);
            $table->integer('award_count')->default(0);
            $table->integer('projects_completed')->default(0);
            $table->integer('messages_received')->default(0);
            $table->integer('messages_replied')->default(0);
            $table->integer('total_response_minutes')->default(0);
            $table->integer('response_count')->default(0);
            $table->integer('review_count')->default(0);
            $table->integer('review_sum')->default(0);
            $table->integer('unlock_count')->default(0);
            $table->timestamp('last_active_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendor_metrics');
    }
};
