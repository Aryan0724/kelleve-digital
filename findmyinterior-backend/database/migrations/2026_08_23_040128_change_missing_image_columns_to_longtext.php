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
        Schema::table('listings', function (Blueprint $table) {
            $table->longText('cover_image')->nullable()->change();
            $table->longText('cover_image_url')->nullable()->change();
        });

        Schema::table('listing_galleries', function (Blueprint $table) {
            $table->longText('image_url')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->string('cover_image')->nullable()->change();
            $table->string('cover_image_url')->nullable()->change();
        });

        Schema::table('listing_galleries', function (Blueprint $table) {
            $table->string('image_url')->nullable()->change();
        });
    }
};
