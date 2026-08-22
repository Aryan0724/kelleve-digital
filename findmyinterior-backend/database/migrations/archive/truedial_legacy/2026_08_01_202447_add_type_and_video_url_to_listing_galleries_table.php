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
            $table->string('type')->default('image')->after('listing_id');
            $table->text('video_url')->nullable()->after('type');
            $table->longText('image_url')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('listing_galleries', function (Blueprint $table) {
            $table->dropColumn(['type', 'video_url']);
            $table->longText('image_url')->nullable(false)->change();
        });
    }
};
