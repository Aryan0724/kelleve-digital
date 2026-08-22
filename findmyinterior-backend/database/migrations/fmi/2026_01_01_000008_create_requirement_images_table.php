<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'fmi_mysql';
    public function up(): void
    {
        Schema::create('requirement_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('requirement_id')->constrained('requirements')->cascadeOnDelete();
            $table->string('image_url');
            $table->timestamps();

            $table->index('requirement_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('requirement_images');
    }
};
