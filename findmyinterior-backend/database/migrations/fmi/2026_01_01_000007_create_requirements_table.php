<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'fmi_mysql';
    public function up(): void
    {
        Schema::create('requirements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('category_id')->constrained('categories');
            $table->foreignId('city_id')->nullable()->constrained('cities')->nullOnDelete();
            $table->foreignId('district_id')->nullable()->constrained('districts')->nullOnDelete();
            $table->string('title');
            $table->text('description');
            $table->string('project_type', 100);
            $table->decimal('budget_min', 12, 2)->nullable();
            $table->decimal('budget_max', 12, 2)->nullable();
            $table->string('city', 100);
            $table->string('district', 100);
            // Guest fields — name/phone stored even when user is logged in for lead display
            $table->string('name');
            $table->string('phone', 20);
            $table->string('email')->nullable();
            $table->enum('status', ['open', 'bidding', 'shortlisted', 'awarded', 'completed', 'expired'])->default('open');
            $table->foreignId('awarded_vendor_id')->nullable()->constrained('users');
            $table->foreignId('awarded_bid_id')->nullable();
            $table->decimal('award_value', 12, 2)->nullable();
            $table->timestamp('awarded_at')->nullable();
            
            $table->softDeletes();
            $table->timestamps();

            $table->index('user_id');
            $table->index('category_id');
            $table->index('status');
            $table->index('city_id');
            $table->index('district_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('requirements');
    }
};
