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
        Schema::create('labour_requirements', function (Blueprint $table) {

            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('city_id')->constrained('cities')->onDelete('cascade');
            $table->string('title', 255);
            $table->text('description');
            $table->json('skills_required');
            $table->integer('workers_needed');
            $table->decimal('daily_wage', 8, 2)->nullable();
            $table->integer('duration_days')->nullable();
            $table->enum('status', ['open', 'fulfilled', 'cancelled'])->default('open');
            $table->timestamps();
            
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('labour_requirements');
    }
};
