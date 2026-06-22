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
            $table->integer('phone_clicks')->default(0)->after('views_count');
            $table->integer('whatsapp_clicks')->default(0)->after('phone_clicks');
            $table->integer('website_clicks')->default(0)->after('whatsapp_clicks');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropColumn(['phone_clicks', 'whatsapp_clicks', 'website_clicks']);
        });
    }
};
