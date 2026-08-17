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
        // 1. user_documents
        Schema::table('user_documents', function (Blueprint $table) {
            $table->longText('file_path')->change();
        });

        // 2. listings
        Schema::table('listings', function (Blueprint $table) {
            $table->longText('cover_image')->nullable()->change();
        });

        // 3. listing_galleries
        Schema::table('listing_galleries', function (Blueprint $table) {
            $table->longText('image_url')->change();
        });

        // 4. categories
        Schema::table('categories', function (Blueprint $table) {
            $table->longText('image')->nullable()->change();
        });

        // 5. builders
        Schema::table('builders', function (Blueprint $table) {
            $table->longText('cover_image')->nullable()->change();
        });

        // 6. builder_projects
        Schema::table('builder_projects', function (Blueprint $table) {
            $table->longText('cover_image')->nullable()->change();
        });

        // 7. suppliers
        Schema::table('suppliers', function (Blueprint $table) {
            $table->longText('cover_image')->nullable()->change();
        });

        // 8. supplier_products
        Schema::table('supplier_products', function (Blueprint $table) {
            $table->longText('cover_image')->nullable()->change();
        });

        // 9. supplier_product_images
        Schema::table('supplier_product_images', function (Blueprint $table) {
            $table->longText('image_url')->change();
        });

        // 10. workers
        Schema::table('workers', function (Blueprint $table) {
            $table->longText('avatar')->nullable()->change();
        });

        // 11. blogs
        Schema::table('blogs', function (Blueprint $table) {
            $table->longText('cover_image')->nullable()->change();
        });

        // 12. projects
        if (Schema::hasColumn('projects', 'image')) {
            Schema::table('projects', function (Blueprint $table) {
                $table->longText('image')->nullable()->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Reverting back to string is dangerous and could lose data, so keeping it longText is safer.
        // Or we can leave down() empty.
    }
};
