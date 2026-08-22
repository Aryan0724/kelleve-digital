<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration: Fix critical bugs found in production
 * 
 * 1. Make listings.district nullable (was NOT NULL, causing 1364 errors when users register without district)
 * 2. Make listings.state nullable (consistent with district)
 */
return new class extends Migration
{
    protected $connection = 'fmi_mysql';
    public function up(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->string('district', 100)->nullable()->default(null)->change();
            $table->string('state', 100)->nullable()->default('Bihar')->change();
        });
    }

    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->string('district', 100)->nullable(false)->change();
        });
    }
};
