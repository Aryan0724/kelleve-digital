<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    protected $connection = 'fmi_mysql';

    public function up(): void
    {
        // Add 'withdrawn' to job_applications.status enum.
        // This is required before Phase 4H.5 migration to correctly represent
        // legacy bids with withdrawn_at IS NOT NULL.
        DB::connection($this->connection)->statement("
            ALTER TABLE job_applications
            MODIFY COLUMN status ENUM(
                'pending',
                'shortlisted',
                'accepted',
                'rejected',
                'awarded',
                'completed',
                'withdrawn'
            ) NOT NULL DEFAULT 'pending'
        ");
    }

    public function down(): void
    {
        DB::connection($this->connection)->statement("
            ALTER TABLE job_applications
            MODIFY COLUMN status ENUM(
                'pending',
                'shortlisted',
                'accepted',
                'rejected',
                'awarded',
                'completed'
            ) NOT NULL DEFAULT 'pending'
        ");
    }
};
