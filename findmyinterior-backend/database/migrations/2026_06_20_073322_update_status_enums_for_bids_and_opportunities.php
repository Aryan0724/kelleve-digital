<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('requirements', function (Blueprint $table) {
            $table->dropColumn('status');
        });
        
        Schema::table('requirements', function (Blueprint $table) {
            $table->string('status', 50)->default('published');
        });

        Schema::table('bids', function (Blueprint $table) {
            $table->dropColumn('status');
        });
        
        Schema::table('bids', function (Blueprint $table) {
            $table->string('status', 50)->default('submitted');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE requirements MODIFY COLUMN status ENUM('open', 'bidding', 'shortlisted', 'awarded', 'completed', 'expired') DEFAULT 'open'");
        DB::statement("ALTER TABLE bids MODIFY COLUMN status ENUM('pending', 'shortlisted', 'accepted', 'rejected', 'awarded', 'completed') DEFAULT 'pending'");
    }
};
