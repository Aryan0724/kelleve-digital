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
        Schema::table('users', function (Blueprint $table) {
            $table->integer('profile_completion_score')->default(0)->after('is_verified');
            $table->integer('trust_score')->default(0)->after('profile_completion_score');
            $table->boolean('is_verified_business')->default(false)->after('trust_score');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['profile_completion_score', 'trust_score', 'is_verified_business']);
        });
    }
};
