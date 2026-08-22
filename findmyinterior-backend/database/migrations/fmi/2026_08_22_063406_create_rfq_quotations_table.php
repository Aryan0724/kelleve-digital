<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'fmi_mysql';
    public function up(): void
    {
        Schema::create('rfq_quotations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('requirement_id')->constrained('rfqs')->cascadeOnDelete();
            $table->foreignId('professional_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('amount', 12, 2)->nullable();
            $table->decimal('estimated_cost', 12, 2)->nullable();
            $table->integer('timeline_days')->nullable();
            $table->text('proposal_message')->nullable();
            $table->enum('status', ['pending', 'shortlisted', 'accepted', 'rejected', 'awarded', 'completed'])->default('pending');
            $table->string('requirement_type')->default('rfq'); // For backward compatibility if needed
            $table->timestamps();
            
            // A professional can only apply once per rfq
            $table->unique(['requirement_id', 'professional_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rfq_quotations');
    }
};
