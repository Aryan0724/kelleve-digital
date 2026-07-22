<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 100)->unique();
            $table->string('name', 255);
            $table->string('domain', 255)->nullable()->unique();
            $table->string('logo', 255)->nullable();
            $table->json('theme')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });

        Schema::create('tenant_modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->onDelete('cascade');
            $table->string('module_name', 100);
            $table->boolean('enabled')->default(true);
            $table->timestamps();
            
            $table->unique(['tenant_id', 'module_name']);
        });

        Schema::create('tenant_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained('tenants')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('role_id')->nullable()->constrained('roles')->onDelete('cascade');
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
            $table->timestamps();

            $table->unique(['tenant_id', 'user_id', 'role_id']);
        });

        // Insert the default tenant so we don't break the existing application
        DB::table('tenants')->insert([
            'id' => 1,
            'slug' => 'findmyinterior',
            'name' => 'Find My Interior',
            'domain' => 'findmyinterior.com',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        DB::table('tenants')->insert([
            'id' => 2,
            'slug' => 'truedial',
            'name' => 'TrueDial',
            'domain' => 'truedial.in',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tenant_user');
        Schema::dropIfExists('tenant_modules');
        Schema::dropIfExists('tenants');
    }
};
