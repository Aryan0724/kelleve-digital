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
        Schema::create('activity_timelines', function (Blueprint $table) {

            $table->id();
            $table->string('entity_type', 255);
            $table->unsignedBigInteger('entity_id');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('action', 255);
            $table->text('description');
            $table->json('meta_data')->nullable();
            $table->timestamps();
            
            $table->index(['entity_type', 'entity_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_timelines');
    }
};
