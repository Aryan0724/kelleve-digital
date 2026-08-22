<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'fmi_mysql';
    public function up(): void
    {
        Schema::table('subscription_plans', function (Blueprint $table) {
            $table->boolean('can_add_website')->default(false)->after('can_see_all_leads');
            $table->boolean('can_add_whatsapp')->default(false)->after('can_add_website');
            $table->boolean('is_gold_verified')->default(false)->after('can_add_whatsapp');
        });
    }

    public function down(): void
    {
        Schema::table('subscription_plans', function (Blueprint $table) {
            $table->dropColumn(['can_add_website', 'can_add_whatsapp', 'is_gold_verified']);
        });
    }
};
