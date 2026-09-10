<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Phase H — Priority Support:
 * Add `priority` column to inquiries table.
 * Elite subscribers' listings will receive high-priority inquiries.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (!\Illuminate\Support\Facades\Schema::connection('fmi_mysql')->hasColumn('inquiries', 'priority')) {
            \Illuminate\Support\Facades\Schema::connection('fmi_mysql')->table('inquiries', function (\Illuminate\Database\Schema\Blueprint $table) {
                $table->enum('priority', ['normal', 'high'])
                    ->default('normal')
                    ->comment('high = inquiry sent to an Elite-subscribed professional. Used for admin sorting.')
                    ->after('status');
            });
        }
    }

    public function down(): void
    {
        \Illuminate\Support\Facades\Schema::connection('fmi_mysql')->table('inquiries', function (\Illuminate\Database\Schema\Blueprint $table) {
            $table->dropColumn('priority');
        });
    }
};
