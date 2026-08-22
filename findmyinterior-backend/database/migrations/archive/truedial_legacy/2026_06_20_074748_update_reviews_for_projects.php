<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'truedial_mysql';
    public function up(): void
    {
        if (\Illuminate\Support\Facades\DB::connection()->getDriverName() !== 'sqlite') {
            Schema::table('reviews', function (Blueprint $table) {
                
                $table->dropIndex(['reviewable_type', 'reviewable_id']);
                $table->dropColumn(['user_id', 'reviewable_type', 'reviewable_id']);
                
                $table->foreignId('project_id')->nullable()->after('id');
                $table->foreignId('reviewer_id')->nullable()->after('project_id');
                $table->foreignId('reviewed_user_id')->nullable()->after('reviewer_id');
                $table->string('role_of_reviewer')->nullable()->after('body'); // homeowner, professional
            });
        } else {
            Schema::table('reviews', function (Blueprint $table) {
                $table->foreignId('project_id')->nullable();
                $table->foreignId('reviewer_id')->nullable();
                $table->foreignId('reviewed_user_id')->nullable();
                $table->string('role_of_reviewer')->nullable(); // homeowner, professional
            });
        }
    }

    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            
            
            
            $table->dropColumn(['project_id', 'reviewer_id', 'reviewed_user_id', 'role_of_reviewer']);
            
            $table->foreignId('user_id')->nullable();
            $table->string('reviewable_type')->nullable();
            $table->unsignedBigInteger('reviewable_id')->nullable();
            $table->index(['reviewable_type', 'reviewable_id']);
        });
    }
};
