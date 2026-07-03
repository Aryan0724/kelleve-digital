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
        Schema::table('contact_unlocks', function (Blueprint $table) {
            $table->dropUnique(['user_id', 'requirement_id']);
            $table->unique(['user_id', 'requirement_id', 'requirement_type'], 'contact_unlocks_polymorphic_unique');
        });

        Schema::table('bids', function (Blueprint $table) {
            $table->dropUnique(['requirement_id', 'professional_id']);
            $table->unique(['requirement_id', 'professional_id', 'requirement_type'], 'bids_polymorphic_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bids', function (Blueprint $table) {
            $table->dropUnique('bids_polymorphic_unique');
            $table->unique(['requirement_id', 'professional_id']);
        });

        Schema::table('contact_unlocks', function (Blueprint $table) {
            $table->dropUnique('contact_unlocks_polymorphic_unique');
            $table->unique(['user_id', 'requirement_id']);
        });
    }
};
