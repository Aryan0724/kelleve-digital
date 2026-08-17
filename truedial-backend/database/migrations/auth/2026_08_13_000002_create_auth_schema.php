<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    protected $connection = 'auth';
    public function up(): void {
        if (!Schema::connection('auth')->hasTable('users')) {
            Schema::connection('auth')->create('users', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('email')->unique()->nullable();
                $table->string('phone')->unique();
                $table->string('password');
                $table->string('professional_type')->nullable();
                $table->string('avatar')->nullable();
                $table->boolean('is_active')->default(true);
                $table->boolean('is_mock')->default(false);
                $table->boolean('is_verified')->default(false);
                $table->boolean('is_verified_business')->default(false);
                $table->string('verification_level')->nullable();
                $table->integer('profile_completion_score')->default(0);
                $table->integer('trust_score')->default(0);
                $table->integer('daily_notification_limit')->default(0);
                $table->unsignedBigInteger('primary_role_id')->nullable();
                $table->timestamps();
                $table->softDeletes();
            });
        }
        if (!Schema::connection('auth')->hasTable('roles')) {
            Schema::connection('auth')->create('roles', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->string('description')->nullable();
                $table->timestamps();
            });
        }
        if (!Schema::connection('auth')->hasTable('user_roles')) {
            Schema::connection('auth')->create('user_roles', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
                $table->foreignId('role_id')->constrained('roles')->cascadeOnDelete();
                $table->timestamps();
            });
        }
    }
    public function down(): void {}
};
