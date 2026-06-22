<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropIndex(['reviewable_type', 'reviewable_id']);
            $table->dropColumn(['user_id', 'reviewable_type', 'reviewable_id']);
            
            $table->foreignId('project_id')->nullable()->after('id')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('reviewer_id')->nullable()->after('project_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('reviewed_user_id')->nullable()->after('reviewer_id')->constrained('users')->cascadeOnDelete();
            $table->string('role_of_reviewer')->nullable()->after('body'); // homeowner, professional
        });
    }

    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
            $table->dropForeign(['reviewer_id']);
            $table->dropForeign(['reviewed_user_id']);
            $table->dropColumn(['project_id', 'reviewer_id', 'reviewed_user_id', 'role_of_reviewer']);
            
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->string('reviewable_type')->nullable();
            $table->unsignedBigInteger('reviewable_id')->nullable();
            $table->index(['reviewable_type', 'reviewable_id']);
        });
    }
};
