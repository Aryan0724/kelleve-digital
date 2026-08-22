<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('offers', function (Blueprint $table) {
            $table->dropColumn('image_url');
            
            // Drop old enum and create new string column since modifying enums directly is tricky in SQLite/MySQL
            // But since this is a new table for MVP, we can just drop status and recreate it
            $table->dropColumn('status');
        });

        Schema::table('offers', function (Blueprint $table) {
            $table->enum('status', ['draft', 'active', 'paused', 'archived'])->default('draft');
            $table->string('discount_type')->nullable(); // percentage, fixed_amount, free_item, bundle, cashback, coupon_code, custom
            $table->decimal('discount_value', 10, 2)->nullable();
            $table->string('cta_label')->nullable();
            $table->string('cta_url')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('offers', function (Blueprint $table) {
            $table->string('image_url')->nullable();
            $table->dropColumn(['status', 'discount_type', 'discount_value', 'cta_label', 'cta_url']);
        });

        Schema::table('offers', function (Blueprint $table) {
            $table->enum('status', ['active', 'expired', 'draft'])->default('active');
        });
    }
};
