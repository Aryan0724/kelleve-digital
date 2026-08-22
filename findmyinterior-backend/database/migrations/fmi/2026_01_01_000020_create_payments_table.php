<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'fmi_mysql';
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('razorpay_order_id')->unique();
            $table->string('razorpay_payment_id')->nullable();
            $table->string('razorpay_signature')->nullable();
            $table->decimal('amount', 10, 2);
            $table->string('currency', 10)->default('INR');
            $table->enum('purpose', ['wallet_recharge', 'subscription', 'premium_listing', 'featured_listing']);
            $table->enum('status', ['pending', 'success', 'failed', 'refunded'])->default('pending');
            $table->json('meta')->nullable()->comment('Additional context: listing_id, plan_id, etc.');
            $table->timestamps();

            $table->index('user_id');
            $table->index('status');
            $table->index('purpose');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
