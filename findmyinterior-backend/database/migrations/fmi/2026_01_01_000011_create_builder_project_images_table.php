<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'fmi_mysql';
    public function up(): void
    {
        Schema::create('builder_project_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('builder_project_id')->constrained('builder_projects')->cascadeOnDelete();
            $table->string('image_url');
            $table->string('caption')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index('builder_project_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('builder_project_images');
    }
};
