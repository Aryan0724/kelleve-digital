<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'fmi_mysql';
    public function up(): void
    {
        Schema::create('builder_projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('builder_id')->constrained('builders')->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('cover_image')->nullable();
            $table->enum('project_type', ['residential', 'commercial', 'mixed'])->default('residential');
            $table->string('location');
            $table->string('city', 100);
            $table->string('bhk_options', 100)->nullable()->comment('e.g. 2BHK, 3BHK, 4BHK');
            $table->integer('area_sqft_min')->nullable();
            $table->integer('area_sqft_max')->nullable();
            $table->decimal('price_min', 15, 2)->nullable();
            $table->decimal('price_max', 15, 2)->nullable();
            $table->date('possession_date')->nullable();
            $table->boolean('is_possession_ready')->default(false);
            $table->enum('status', ['upcoming', 'ongoing', 'completed', 'possession_ready'])->default('upcoming');
            $table->boolean('is_featured')->default(false);
            $table->softDeletes();
            $table->timestamps();

            $table->index('builder_id');
            $table->index('status');
            $table->index('is_possession_ready');
            $table->index('is_featured');
            $table->index('project_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('builder_projects');
    }
};
