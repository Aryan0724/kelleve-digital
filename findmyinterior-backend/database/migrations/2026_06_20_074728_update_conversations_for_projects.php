<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            $table->dropUnique('conv_unique_idx');
            $table->dropMorphs('conversationable');
            $table->foreignId('project_id')->nullable()->after('id')->constrained('projects')->cascadeOnDelete();
            $table->unique(['project_id', 'customer_id', 'vendor_id'], 'conv_proj_unique_idx');
        });
    }

    public function down(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            $table->dropUnique('conv_proj_unique_idx');
            $table->dropForeign(['project_id']);
            $table->dropColumn('project_id');
            $table->nullableMorphs('conversationable');
            $table->unique(['conversationable_type', 'conversationable_id', 'customer_id', 'vendor_id'], 'conv_unique_idx');
        });
    }
};
