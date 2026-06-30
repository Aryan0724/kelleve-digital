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
        Schema::table('saved_projects', function (Blueprint $table) {
            $table->dropForeign(['requirement_id']);
            $table->index('user_id'); // Add explicit index so foreign key doesn't block dropping unique
            $table->dropUnique(['user_id', 'requirement_id']);
            $table->string('requirement_type')->default('App\Models\Project')->after('requirement_id');
            $table->unique(['user_id', 'requirement_id', 'requirement_type'], 'saved_proj_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('saved_projects', function (Blueprint $table) {
            $table->dropUnique('saved_proj_unique');
            $table->dropColumn('requirement_type');
            $table->unique(['user_id', 'requirement_id']);
            $table->foreign('requirement_id')->references('id')->on('requirements')->cascadeOnDelete();
        });
    }
};
