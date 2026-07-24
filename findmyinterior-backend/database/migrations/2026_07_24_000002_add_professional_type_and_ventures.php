<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add professional_type to users table
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'professional_type')) {
                $table->string('professional_type', 100)->nullable()->after('phone')->index();
            }
        });

        // Create ventures table for multi-GST support
        if (!Schema::hasTable('ventures')) {
            Schema::create('ventures', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->string('name');
                $table->string('professional_type', 100)->nullable();
                $table->string('broad_role', 50)->default('interior_designer'); // maps to DB role
                $table->string('gst_number', 20)->nullable();
                $table->string('pan_number', 20)->nullable();
                $table->string('phone', 20)->nullable();
                $table->string('city', 100)->nullable();
                $table->string('district', 100)->nullable();
                $table->string('address')->nullable();
                $table->unsignedBigInteger('listing_id')->nullable(); // linked listing
                $table->enum('status', ['active', 'inactive', 'pending'])->default('active');
                $table->timestamps();
                $table->softDeletes();

                $table->index(['user_id', 'status']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('ventures');
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('professional_type');
        });
    }
};
