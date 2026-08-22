<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'fmi_mysql';
    public function up(): void
    {
        Schema::create('workers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->foreignId('city_id')->nullable()->constrained('cities')->nullOnDelete();
            $table->foreignId('district_id')->nullable()->constrained('districts')->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('avatar')->nullable();
            $table->string('phone', 20);
            $table->string('city', 100);
            $table->string('district', 100);
            $table->string('skill', 100)->comment('Primary skill: Painter, Plumber, Electrician, etc.');
            $table->json('skills_tags')->nullable()->comment('Array of additional skills');
            $table->integer('experience_years')->default(0);
            $table->decimal('daily_rate', 8, 2)->nullable();
            $table->boolean('is_available')->default(true);
            
            $table->boolean('is_featured')->default(false);
            $table->decimal('avg_rating', 3, 2)->default(0.00);
            $table->integer('review_count')->default(0);
            $table->text('bio')->nullable();
            $table->enum('status', ['pending', 'active', 'inactive'])->default('pending');
            $table->softDeletes();
            $table->timestamps();

            $table->index('city_id');
            $table->index('district_id');
            $table->index('skill');
            $table->index('is_available');
            $table->index('is_featured');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('workers');
    }
};
