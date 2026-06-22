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
        Schema::create('rfqs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('material_type')->nullable();
            $table->string('quantity')->nullable();
            $table->string('delivery_location')->nullable();
            $table->string('timeline')->nullable();
            $table->string('status', 50)->default('posted'); // posted, receiving_quotes, awarded, fulfilled
            $table->foreignId('winning_quote_id')->nullable(); // will constrain to quotes table later
            $table->foreignId('supplier_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rfqs');
    }
};
