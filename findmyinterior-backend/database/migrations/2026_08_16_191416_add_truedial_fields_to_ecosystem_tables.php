<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('privilege_cards', function (Blueprint $table) {
            if (!Schema::hasColumn('privilege_cards', 'card_type')) {
                $table->enum('card_type', ['free', 'city', 'multi-city'])->default('free')->after('card_number');
                $table->decimal('price', 10, 2)->default(0)->after('card_type');
            }
        });

        Schema::table('offers', function (Blueprint $table) {
            if (!Schema::hasColumn('offers', 'eligible_card_type')) {
                $table->enum('eligible_card_type', ['all', 'free', 'city', 'multi-city'])->default('all')->after('status');
            }
        });

        Schema::table('marketing_campaigns', function (Blueprint $table) {
            if (!Schema::hasColumn('marketing_campaigns', 'channel')) {
                $table->enum('channel', ['sms', 'whatsapp', 'push'])->default('sms')->after('audience');
                $table->enum('target_card_type', ['all', 'free', 'city', 'multi-city'])->default('all')->after('channel');
                $table->integer('sent_count')->default(0)->after('status');
                $table->integer('delivered_count')->default(0)->after('sent_count');
                $table->integer('opened_count')->default(0)->after('delivered_count');
                $table->integer('clicks_count')->default(0)->after('opened_count');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('marketing_campaigns', function (Blueprint $table) {
            $table->dropColumn(['channel', 'target_card_type', 'sent_count', 'delivered_count', 'opened_count', 'clicks_count']);
        });

        Schema::table('offers', function (Blueprint $table) {
            $table->dropColumn(['eligible_card_type']);
        });

        Schema::table('privilege_cards', function (Blueprint $table) {
            $table->dropColumn(['card_type', 'price']);
        });
    }
};
