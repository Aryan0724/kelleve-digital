<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->decimal('unlock_price', 10, 2)->nullable()->after('status');
        });
        
        Schema::table('rfqs', function (Blueprint $table) {
            $table->decimal('unlock_price', 10, 2)->nullable()->after('status');
        });
        
        Schema::table('worker_jobs', function (Blueprint $table) {
            $table->decimal('unlock_price', 10, 2)->nullable()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('unlock_price');
        });
        
        Schema::table('rfqs', function (Blueprint $table) {
            $table->dropColumn('unlock_price');
        });
        
        Schema::table('worker_jobs', function (Blueprint $table) {
            $table->dropColumn('unlock_price');
        });
    }
};
