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
        // Drop foreign keys that depend on projects
        Schema::table('conversations', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
        });
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
        });

        // Drop the new projects table from Sprint 2 to avoid conflicts
        Schema::dropIfExists('projects');
        
        // Rename requirements to projects
        Schema::rename('requirements', 'projects');
        
        // Add execution fields to projects
        Schema::table('projects', function (Blueprint $table) {
            $table->foreignId('winning_bid_id')->nullable()->constrained('bids')->nullOnDelete();
            $table->foreignId('professional_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeign(['winning_bid_id']);
            $table->dropForeign(['professional_id']);
            $table->dropColumn(['winning_bid_id', 'professional_id', 'started_at', 'completed_at']);
        });
        
        Schema::rename('projects', 'requirements');
    }
};
