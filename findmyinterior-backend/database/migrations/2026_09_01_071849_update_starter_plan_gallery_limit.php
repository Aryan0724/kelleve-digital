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
        DB::table('subscription_plans')->where('slug', 'starter')->update([
            'max_gallery_images' => 5
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('subscription_plans')->where('slug', 'starter')->update([
            'max_gallery_images' => 10
        ]);
    }
};
