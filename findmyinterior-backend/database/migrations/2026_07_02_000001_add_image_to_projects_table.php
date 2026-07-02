<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add the image column to the projects table (formerly requirements).
     * The Requirement model ($table = 'projects') has 'image' in $fillable
     * but the column was never added to the schema.
     */
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            if (!Schema::hasColumn('projects', 'image')) {
                $table->string('image')->nullable()->after('budget_tier');
            }
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('image');
        });
    }
};
