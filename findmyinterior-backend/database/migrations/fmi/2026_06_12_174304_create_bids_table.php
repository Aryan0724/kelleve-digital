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
        Schema::create('bids', function (Blueprint $table) {
            $table->id();
            $table->foreignId('requirement_id')->constrained()->cascadeOnDelete();
            $table->foreignId('professional_id')->constrained('users')->cascadeOnDelete();
            
            $table->decimal('amount', 12, 2);
            
            $table->integer('timeline_days');
            $table->integer('warranty_months')->default(0);
            $table->boolean('material_included')->default(false);
            $table->boolean('labour_included')->default(false);
            $table->boolean('design_included')->default(false);
            $table->boolean('supervision_included')->default(false);
            $table->json('portfolio_urls')->nullable();
            $table->integer('previous_projects_count')->default(0);
            $table->text('proposal_message');
            $table->decimal('smart_bid_score', 5, 2)->default(0.00);
            $table->enum('status', ['pending', 'shortlisted', 'accepted', 'rejected', 'awarded', 'completed'])->default('pending');
            
            $table->timestamps();
            $table->softDeletes();
            
            // A professional can only bid once per requirement
            $table->unique(['requirement_id', 'professional_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bids');
    }
};
