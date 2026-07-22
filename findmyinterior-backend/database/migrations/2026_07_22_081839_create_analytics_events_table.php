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
        Schema::create('analytics_events', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tenant_id')->nullable();
            
            $table->string('event_type', 50); // view, click, call, whatsapp, website, direction
            $table->string('entity_type');
            $table->unsignedBigInteger('entity_id');
            
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('session_id')->nullable();
            
            $table->json('metadata')->nullable();
            
            $table->timestamp('created_at')->useCurrent();
            
            $table->index(['entity_type', 'entity_id']);
            $table->index(['event_type', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('analytics_events');
    }
};
