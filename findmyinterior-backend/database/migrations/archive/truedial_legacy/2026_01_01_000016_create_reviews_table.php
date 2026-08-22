<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            // Polymorphic: Listing, Builder, Supplier, Worker
            $table->string('reviewable_type');
            $table->unsignedBigInteger('reviewable_id');
            $table->tinyInteger('rating')->unsigned()->comment('1 to 5');
            $table->string('title')->nullable();
            $table->text('body');
            $table->boolean('is_approved')->default(false);
            $table->softDeletes();
            $table->timestamps();

            $table->index('user_id');
            $table->index(['reviewable_type', 'reviewable_id']);
            $table->index('is_approved');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
