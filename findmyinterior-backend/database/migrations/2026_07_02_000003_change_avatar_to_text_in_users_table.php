<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Change avatar column from VARCHAR(255) to TEXT so it can hold base64 data URIs.
     * A 600px JPEG at quality 82 typically produces 20-80KB raw → 27-110KB base64 string.
     * VARCHAR(255) is far too small; TEXT can hold up to 65KB (MySQL) or unlimited (PostgreSQL).
     * Since Render uses PostgreSQL, TEXT is effectively unlimited here.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->text('avatar')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('avatar')->nullable()->change();
        });
    }
};
