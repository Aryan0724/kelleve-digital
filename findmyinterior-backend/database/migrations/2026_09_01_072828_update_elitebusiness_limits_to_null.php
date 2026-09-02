<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('subscription_plans')->where('slug', 'elitebusiness')->update([
            'max_listings' => null,
            'max_gallery_images' => null
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('subscription_plans')->where('slug', 'elitebusiness')->update([
            'max_listings' => 9999,
            'max_gallery_images' => 9999
        ]);
    }
};
