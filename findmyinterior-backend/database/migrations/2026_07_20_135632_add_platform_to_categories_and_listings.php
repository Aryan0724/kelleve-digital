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
        Schema::table('categories', function (Blueprint $table) {
            $table->enum('platform', ['findmyinterior', 'truedial', 'both'])->default('both')->after('is_active');
            $table->index('platform');
        });

        Schema::table('listings', function (Blueprint $table) {
            $table->enum('platform', ['findmyinterior', 'truedial', 'both'])->default('both')->after('is_premium');
            $table->index('platform');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropIndex(['platform']);
            $table->dropColumn('platform');
        });

        Schema::table('listings', function (Blueprint $table) {
            $table->dropIndex(['platform']);
            $table->dropColumn('platform');
        });
    }
};
