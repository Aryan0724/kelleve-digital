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
        // Drop the v1 schema (created by 2026_06_12_181243) and replace with full polymorphic schema
        Schema::dropIfExists('conversations');
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->morphs('conversationable'); // conversationable_type, conversationable_id
            $table->foreignId('customer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('vendor_id')->constrained('users')->onDelete('cascade');
            
            // Status and tracking
            $table->enum('status', ['active', 'archived', 'awarded', 'completed'])->default('active');
            $table->string('project_stage')->default('initiated');
            
            // Counters
            $table->integer('customer_unread_count')->default(0);
            $table->integer('vendor_unread_count')->default(0);
            
            // Timestamps
            $table->timestamp('unlocked_at')->nullable();
            $table->timestamp('first_vendor_reply_at')->nullable();
            $table->timestamp('last_customer_reply_at')->nullable();
            $table->timestamp('last_vendor_reply_at')->nullable();
            $table->timestamp('last_message_at')->nullable();
            $table->timestamp('awarded_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            
            $table->timestamps();
            
            $table->unique(['conversationable_type', 'conversationable_id', 'customer_id', 'vendor_id'], 'conv_unique_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
