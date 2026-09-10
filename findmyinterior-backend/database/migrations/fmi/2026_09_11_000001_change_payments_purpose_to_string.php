<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

/**
 * Change payments.purpose to VARCHAR(50) so it supports 'bid_fee' alongside existing
 * purposes ('wallet_recharge', 'subscription', 'premium_listing', 'featured_listing', 'lead_unlock')
 * without MySQL enum truncation errors.
 */
return new class extends Migration
{
    public function up(): void
    {
        $connection = Schema::connection('fmi_mysql');
        $driver = DB::connection('fmi_mysql')->getDriverName();

        if ($driver === 'mysql') {
            DB::connection('fmi_mysql')->statement("ALTER TABLE payments MODIFY COLUMN purpose VARCHAR(50) NOT NULL");
        } else {
            $connection->table('payments', function (Blueprint $table) {
                $table->string('purpose', 50)->change();
            });
        }
    }

    public function down(): void
    {
        $driver = DB::connection('fmi_mysql')->getDriverName();
        if ($driver === 'mysql') {
            DB::connection('fmi_mysql')->statement("ALTER TABLE payments MODIFY COLUMN purpose ENUM('wallet_recharge','subscription','premium_listing','featured_listing','lead_unlock','bid_fee') NOT NULL");
        }
    }
};
