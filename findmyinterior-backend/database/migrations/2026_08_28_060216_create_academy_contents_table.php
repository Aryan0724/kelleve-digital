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
        Schema::connection('truedial_mysql')->create('academy_contents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category');
            $table->string('video_url');
            $table->string('thumbnail')->nullable();
            $table->string('duration')->nullable(); // e.g. "12:30"
            $table->string('instructor')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('truedial_mysql')->dropIfExists('academy_contents');
    }
};
