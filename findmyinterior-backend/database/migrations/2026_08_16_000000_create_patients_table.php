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
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // The vendor user who owns the record
            $table->string('patient_identifier')->nullable()->index(); // e.g. P-10021
            $table->string('name');
            $table->integer('age')->nullable();
            $table->string('gender')->nullable();
            $table->string('phone')->nullable();
            $table->string('blood_group')->nullable();
            $table->string('condition')->nullable(); // Primary Condition
            $table->string('status')->default('Active'); // In Treatment, Follow-up, etc.
            $table->text('allergies')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('last_visit_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
