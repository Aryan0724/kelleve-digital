<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'truedial_mysql';
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::connection('truedial_mysql')->create('podcast_episodes', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('host');
            $table->string('audio_url');
            $table->string('cover_image')->nullable();
            $table->string('duration')->nullable(); // e.g. "45:00"
            $table->text('description')->nullable();
            $table->string('guest_name')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('truedial_mysql')->dropIfExists('podcast_episodes');
    }
};
