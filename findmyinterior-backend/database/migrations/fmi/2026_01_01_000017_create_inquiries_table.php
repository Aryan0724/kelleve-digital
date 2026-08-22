<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'fmi_mysql';
    public function up(): void
    {
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            // Polymorphic: Listing, Builder, Supplier, Worker
            $table->string('inquirable_type');
            $table->unsignedBigInteger('inquirable_id');
            $table->string('name');
            $table->string('phone', 20);
            $table->string('email')->nullable();
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->enum('status', ['new', 'contacted', 'closed'])->default('new');
            $table->boolean('whatsapp_sent')->default(false);
            $table->boolean('email_sent')->default(false);
            $table->timestamps();

            $table->index('user_id');
            $table->index(['inquirable_type', 'inquirable_id']);
            $table->index('status');
            $table->index('is_read');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inquiries');
    }
};
