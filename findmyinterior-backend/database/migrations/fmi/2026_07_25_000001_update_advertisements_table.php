<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    protected $connection = 'fmi_mysql';
    public function up(): void
    {
        Schema::table('advertisements', function (Blueprint $table) {
            $table->string('title')->nullable()->after('id');
            $table->string('media_type', 50)->default('image')->after('banner_url'); // image, video, html
            $table->text('custom_code')->nullable()->after('media_type'); // for HTML/JS snippets
            $table->string('target_city')->nullable()->after('link');
            $table->unsignedBigInteger('target_category_id')->nullable()->after('target_city');
            $table->unsignedBigInteger('created_by')->nullable()->after('is_active');
            
            $table->foreign('target_category_id')->references('id')->on('categories')->onDelete('set null');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('advertisements', function (Blueprint $table) {
            $table->dropForeign(['target_category_id']);
            $table->dropForeign(['created_by']);
            $table->dropColumn([
                'title',
                'media_type',
                'custom_code',
                'target_city',
                'target_category_id',
                'created_by'
            ]);
        });
    }
};
