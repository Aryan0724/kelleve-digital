<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('analytics_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('event_type'); // view, click, call, whatsapp, website, direction
            $table->string('entity_type'); // listing, product, service, offer
            $table->unsignedBigInteger('entity_id');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('session_id')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamp('created_at')->useCurrent();
            
            $table->index(['tenant_id', 'event_type', 'created_at']);
            $table->index(['entity_type', 'entity_id', 'event_type']);
            // To ensure exact-once logic per session
            $table->unique(['session_id', 'event_type', 'entity_type', 'entity_id'], 'analytics_unique_event');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytics_events');
    }
};
