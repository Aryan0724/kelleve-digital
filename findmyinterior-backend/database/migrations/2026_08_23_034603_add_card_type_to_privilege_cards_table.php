<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'truedial_mysql';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::connection('truedial_mysql')->table('privilege_cards', function (Blueprint $table) {
            if (!Schema::connection('truedial_mysql')->hasColumn('privilege_cards', 'card_type')) {
                $table->string('card_type', 50)->default('free')->after('card_number');
            }
            if (!Schema::connection('truedial_mysql')->hasColumn('privilege_cards', 'price')) {
                $table->decimal('price', 10, 2)->default(0.00)->after('card_type');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::connection('truedial_mysql')->table('privilege_cards', function (Blueprint $table) {
            if (Schema::connection('truedial_mysql')->hasColumn('privilege_cards', 'card_type')) {
                $table->dropColumn('card_type');
            }
            if (Schema::connection('truedial_mysql')->hasColumn('privilege_cards', 'price')) {
                $table->dropColumn('price');
            }
        });
    }
};
