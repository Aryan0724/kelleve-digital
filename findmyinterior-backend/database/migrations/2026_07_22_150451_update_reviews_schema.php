<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->foreignId('listing_id')->nullable()->after('id')->constrained('listings')->cascadeOnDelete();
            $table->string('status')->default('pending')->after('body'); // pending, approved, rejected, hidden, reported
            
            // Migrate old is_approved data to status enum if possible
        });

        // Update data
        \Illuminate\Support\Facades\DB::table('reviews')
            ->where('is_approved', 1)
            ->update(['status' => 'approved']);

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropColumn('is_approved');
            
            // Depending on DB driver, sqlite might not support dropping foreign keys cleanly inline
            // But we can drop columns that are no longer strictly needed.
            // However, we will leave `project_id` for now to avoid breaking other parts of the ecosystem if they use it.
        });
    }

    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            $table->boolean('is_approved')->default(false);
        });

        \Illuminate\Support\Facades\DB::table('reviews')
            ->where('status', 'approved')
            ->update(['is_approved' => 1]);

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropForeign(['listing_id']);
            $table->dropColumn(['listing_id', 'status']);
        });
    }
};
