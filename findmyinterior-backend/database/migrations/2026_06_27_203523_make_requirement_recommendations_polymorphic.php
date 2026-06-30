<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('requirement_recommendations', function (Blueprint $table) {
            $table->dropForeign(['requirement_id']);
            $table->string('requirement_type')->default('App\Models\Project')->after('requirement_id');
        });
    }

    public function down(): void
    {
        Schema::table('requirement_recommendations', function (Blueprint $table) {
            $table->dropColumn('requirement_type');
            $table->foreign('requirement_id')->references('id')->on('projects')->cascadeOnDelete();
        });
    }
};
