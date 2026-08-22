<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'fmi_mysql';
    public function up(): void
    {
        Schema::create('builders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->foreignId('city_id')->nullable()->constrained('cities')->nullOnDelete();
            $table->foreignId('district_id')->nullable()->constrained('districts')->nullOnDelete();
            $table->string('company_name');
            $table->string('slug')->unique();
            $table->string('tagline')->nullable();
            $table->string('logo')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('phone', 20);
            $table->string('email');
            $table->string('website')->nullable();
            $table->string('city', 100);
            $table->string('district', 100);
            $table->string('rera_number', 100)->nullable();
            $table->year('established_year')->nullable();
            $table->integer('total_projects')->default(0);
            $table->integer('delivered_projects')->default(0);
            $table->decimal('avg_rating', 3, 2)->default(0.00);
            $table->integer('review_count')->default(0);
            
            $table->boolean('is_featured')->default(false);
            $table->timestamp('sponsored_until')->nullable();
            $table->integer('sponsored_rank')->default(0);
            $table->enum('status', ['pending', 'active', 'inactive'])->default('pending');
            $table->softDeletes();
            $table->timestamps();

            $table->index('city_id');
            $table->index('district_id');
            $table->index('is_featured');

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('builders');
    }
};
