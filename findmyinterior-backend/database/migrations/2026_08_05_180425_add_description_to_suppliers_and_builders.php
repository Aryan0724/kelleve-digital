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
        if (!Schema::hasColumn('suppliers', 'description')) {
            Schema::table('suppliers', function (Blueprint $table) {
                $table->text('description')->nullable();
            });
        }
        if (!Schema::hasColumn('builders', 'description')) {
            Schema::table('builders', function (Blueprint $table) {
                $table->text('description')->nullable();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropColumn('description');
        });
        Schema::table('builders', function (Blueprint $table) {
            $table->dropColumn('description');
        });
    }
};
