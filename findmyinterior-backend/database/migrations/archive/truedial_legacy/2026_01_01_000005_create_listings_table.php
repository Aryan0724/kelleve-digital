<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('categories');
            $table->foreignId('city_id')->nullable()->constrained('cities')->nullOnDelete();
            $table->foreignId('district_id')->nullable()->constrained('districts')->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('tagline')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('whatsapp', 20)->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->string('city', 100);
            $table->string('district', 100);
            $table->string('state', 100)->default('Bihar');
            $table->text('address')->nullable();
            $table->decimal('lat', 10, 8)->nullable();
            $table->decimal('lng', 11, 8)->nullable();
            $table->integer('years_experience')->nullable();
            $table->integer('team_size')->nullable();
            $table->decimal('avg_rating', 3, 2)->default(0.00);
            $table->integer('review_count')->default(0);
            
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_premium')->default(false);
            $table->timestamp('sponsored_until')->nullable();
            $table->integer('sponsored_rank')->default(0);
            $table->enum('status', ['pending', 'active', 'inactive', 'suspended'])->default('pending');
            $table->integer('views_count')->default(0);
            $table->softDeletes();
            $table->timestamps();

            $table->index('user_id');
            $table->index('category_id');
            $table->index('city_id');
            $table->index('district_id');
            $table->index('status');
            $table->index('is_featured');

            $table->index('is_premium');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
