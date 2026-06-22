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
        Schema::table('bids', function (Blueprint $table) {
            $table->boolean('is_awarded')->default(false)->after('status');
            $table->timestamp('awarded_at')->nullable()->after('is_awarded');
            $table->integer('revision_count')->default(0)->after('awarded_at');
            $table->timestamp('withdrawn_at')->nullable()->after('revision_count');
            $table->text('rejection_reason')->nullable()->after('withdrawn_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bids', function (Blueprint $table) {
            $table->dropColumn([
                'is_awarded',
                'awarded_at',
                'revision_count',
                'withdrawn_at',
                'rejection_reason'
            ]);
        });
    }
};
