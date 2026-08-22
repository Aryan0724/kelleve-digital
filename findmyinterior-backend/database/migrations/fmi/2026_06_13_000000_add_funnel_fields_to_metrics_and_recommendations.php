<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'fmi_mysql';
    public function up(): void
    {
        Schema::table('requirement_recommendations', function (Blueprint $table) {
            $table->json('score_breakdown_json')->nullable();
            $table->timestamp('recommended_at')->nullable();
            $table->timestamp('invited_at')->nullable();
            $table->timestamp('viewed_at')->nullable();
            $table->timestamp('bid_submitted_at')->nullable();
        });

        Schema::table('vendor_metrics', function (Blueprint $table) {
            $table->integer('recommendations_received')->default(0);
            $table->integer('profile_views')->default(0);
            $table->integer('invites_received')->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('requirement_recommendations', function (Blueprint $table) {
            $table->dropColumn([
                'score_breakdown_json',
                'recommended_at',
                'invited_at',
                'viewed_at',
                'bid_submitted_at',
            ]);
        });

        Schema::table('vendor_metrics', function (Blueprint $table) {
            $table->dropColumn([
                'recommendations_received',
                'profile_views',
                'invites_received',
            ]);
        });
    }
};
