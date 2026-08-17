<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

/**
 * Auth Database Schema Migration
 *
 * Creates the shared auth tables used by BOTH Find My Interior and TrueDial.
 * Registering on either app creates a user here → instant cross-app login.
 *
 * Usage: php artisan migrate --database=auth --path=database/migrations/auth
 */
return new class extends Migration
{
    protected $connection = 'auth';

    public function up(): void
    {
        // ─── Users ─────────────────────────────────────────────────────────
        if (!Schema::connection('auth')->hasTable('users')) {
            Schema::connection('auth')->create('users', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('email')->unique();
                $table->string('phone', 20)->nullable()->unique();
                $table->timestamp('email_verified_at')->nullable();
                $table->string('password');
                $table->string('avatar')->nullable();
                $table->string('professional_type')->nullable();
                $table->boolean('is_active')->default(true);
                $table->boolean('is_mock')->default(false);
                $table->boolean('is_verified')->default(false);
                $table->boolean('is_verified_business')->default(false);
                $table->integer('verification_level')->default(0);
                $table->integer('profile_completion_score')->default(0);
                $table->integer('trust_score')->default(0);
                $table->integer('daily_notification_limit')->default(5);
                $table->unsignedBigInteger('primary_role_id')->nullable();
                $table->rememberToken();
                $table->softDeletes();
                $table->timestamps();
            });
        }

        // ─── Roles ─────────────────────────────────────────────────────────
        if (!Schema::connection('auth')->hasTable('roles')) {
            Schema::connection('auth')->create('roles', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->text('description')->nullable();
                $table->timestamps();
            });
        }

        // ─── User Roles (Pivot) ─────────────────────────────────────────────
        if (!Schema::connection('auth')->hasTable('user_roles')) {
            Schema::connection('auth')->create('user_roles', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->unsignedBigInteger('role_id');
                $table->timestamps();

                $table->unique(['user_id', 'role_id']);
                $table->index('user_id');
                $table->index('role_id');
            });
        }

        // ─── Personal Access Tokens (Sanctum) ──────────────────────────────
        if (!Schema::connection('auth')->hasTable('personal_access_tokens')) {
            Schema::connection('auth')->create('personal_access_tokens', function (Blueprint $table) {
                $table->id();
                $table->morphs('tokenable');
                $table->string('name');
                $table->string('token', 64)->unique();
                $table->text('abilities')->nullable();
                $table->timestamp('last_used_at')->nullable();
                $table->timestamp('expires_at')->nullable();
                $table->timestamps();
            });
        }

        // ─── Wallets ────────────────────────────────────────────────────────
        if (!Schema::connection('auth')->hasTable('wallets')) {
            Schema::connection('auth')->create('wallets', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id')->unique();
                $table->decimal('balance', 10, 2)->default(0.00);
                $table->timestamps();
            });
        }

        // ─── Password Reset Tokens ──────────────────────────────────────────
        if (!Schema::connection('auth')->hasTable('password_reset_tokens')) {
            Schema::connection('auth')->create('password_reset_tokens', function (Blueprint $table) {
                $table->string('email')->primary();
                $table->string('token');
                $table->timestamp('created_at')->nullable();
            });
        }

        // ─── Seed Default Roles ─────────────────────────────────────────────
        $roles = [
            ['name' => 'Customer',           'slug' => 'customer'],
            ['name' => 'Business Owner',     'slug' => 'business'],
            ['name' => 'Interior Designer',  'slug' => 'interior_designer'],
            ['name' => 'Freelancer/Worker',  'slug' => 'worker'],
            ['name' => 'Supplier',           'slug' => 'supplier'],
            ['name' => 'Builder',            'slug' => 'builder'],
            ['name' => 'Admin',              'slug' => 'admin'],
        ];

        foreach ($roles as $role) {
            DB::connection('auth')->table('roles')->updateOrInsert(
                ['slug' => $role['slug']],
                array_merge($role, ['created_at' => now(), 'updated_at' => now()])
            );
        }
    }

    public function down(): void
    {
        Schema::connection('auth')->dropIfExists('password_reset_tokens');
        Schema::connection('auth')->dropIfExists('wallets');
        Schema::connection('auth')->dropIfExists('personal_access_tokens');
        Schema::connection('auth')->dropIfExists('user_roles');
        Schema::connection('auth')->dropIfExists('roles');
        Schema::connection('auth')->dropIfExists('users');
    }
};
