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
        Schema::table('listing_galleries', function (Blueprint $table) {
            $table->string('storage_url')->nullable()->after('image_url');
        });

        Schema::table('listings', function (Blueprint $table) {
            $table->string('cover_image_url')->nullable()->after('cover_image');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('listing_galleries', function (Blueprint $table) {
            $table->dropColumn('storage_url');
        });

        Schema::table('listings', function (Blueprint $table) {
            $table->dropColumn('cover_image_url');
        });
    }
};
