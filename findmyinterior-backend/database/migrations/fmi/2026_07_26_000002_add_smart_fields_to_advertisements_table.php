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
        Schema::table('advertisements', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->after('id');
            $table->decimal('budget', 10, 2)->nullable()->after('priority');
            $table->integer('max_impressions')->nullable()->after('budget');
            $table->integer('max_clicks')->nullable()->after('max_impressions');
            $table->string('target_role')->nullable()->after('target_category_id');
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('advertisements', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn([
                'user_id',
                'budget',
                'max_impressions',
                'max_clicks',
                'target_role'
            ]);
        });
    }
};
