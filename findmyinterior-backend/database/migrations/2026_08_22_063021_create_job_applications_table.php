<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('requirement_id')->constrained('worker_jobs')->cascadeOnDelete();
            $table->foreignId('professional_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('amount', 12, 2)->nullable(); // mapped from expected_pay or amount
            $table->decimal('estimated_cost', 12, 2)->nullable();
            $table->integer('timeline_days')->nullable();
            $table->text('proposal_message')->nullable();
            $table->enum('status', ['pending', 'shortlisted', 'accepted', 'rejected', 'awarded', 'completed'])->default('pending');
            $table->string('requirement_type')->default('job'); // For backward compatibility if needed
            $table->timestamps();
            
            // A professional can only apply once per job
            $table->unique(['requirement_id', 'professional_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};
