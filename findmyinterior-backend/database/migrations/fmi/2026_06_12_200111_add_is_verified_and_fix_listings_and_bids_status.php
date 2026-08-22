<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'fmi_mysql';
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add is_verified to users
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'is_verified')) {
                $table->boolean('is_verified')->default(false)->after('is_active');
            }
        });

        // Make listings.city nullable
        Schema::table('listings', function (Blueprint $table) {
            if (Schema::hasColumn('listings', 'city')) {
                $table->string('city', 100)->nullable()->change();
            }
        });

        // PostgreSQL doesn't support ALTER on enum — handled via raw SQL on production only.
        // For SQLite (tests): the bids status enum check is enforced at application level.
        // Add 'awarded' to allowed bid statuses via a new migration step.
        // Note: for PostgreSQL in production, you'll need to run:
        // ALTER TABLE bids DROP CONSTRAINT bids_status_check;
        // ALTER TABLE bids ADD CONSTRAINT bids_status_check CHECK (status IN ('pending','shortlisted','accepted','rejected','awarded'));
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_verified');
        });
    }
};
