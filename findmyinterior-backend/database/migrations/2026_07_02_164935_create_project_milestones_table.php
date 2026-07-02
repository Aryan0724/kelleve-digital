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
        Schema::create('project_milestones', function (Blueprint $table) {
            $table->id();
            // Since `requirements` was renamed to `projects` but the code still sometimes refers to it, we use polymorphic or project_id.
            // Using project_id for simplicity as per MVP.
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('percentage')->default(0);
            $table->decimal('amount', 12, 2)->default(0);
            $table->string('status')->default('pending'); // pending, requested, approved, paid
            $table->string('payment_status')->default('unpaid'); // unpaid, paid
            $table->text('images')->nullable(); // json array
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project_milestones');
    }
};
