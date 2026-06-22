<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('worker_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->json('skills_required')->nullable();
            $table->string('location')->nullable();
            $table->string('duration')->nullable();
            $table->decimal('daily_rate', 10, 2)->nullable();
            $table->string('status', 50)->default('posted'); // posted, receiving_applications, awarded, completed
            $table->foreignId('winning_application_id')->nullable(); // will constrain to applications table later
            $table->foreignId('worker_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('worker_jobs');
    }
};
