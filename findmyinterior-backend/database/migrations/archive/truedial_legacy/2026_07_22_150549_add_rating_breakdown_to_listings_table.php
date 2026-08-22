<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->unsignedInteger('five_star')->default(0)->after('review_count');
            $table->unsignedInteger('four_star')->default(0)->after('five_star');
            $table->unsignedInteger('three_star')->default(0)->after('four_star');
            $table->unsignedInteger('two_star')->default(0)->after('three_star');
            $table->unsignedInteger('one_star')->default(0)->after('two_star');
        });
    }

    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropColumn(['five_star', 'four_star', 'three_star', 'two_star', 'one_star']);
        });
    }
};
