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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('requirement_id')->constrained('requirements')->cascadeOnDelete();
            $table->foreignId('winning_bid_id')->constrained('bids')->cascadeOnDelete();
            $table->foreignId('client_id')->constrained('users');
            $table->foreignId('professional_id')->constrained('users');
            
            $table->string('status', 50)->default('in_progress'); // in_progress, on_hold, completed, cancelled
            
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
