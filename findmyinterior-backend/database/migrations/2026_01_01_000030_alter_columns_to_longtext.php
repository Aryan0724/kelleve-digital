<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $tables = [
            'project_milestones' => ['images'],
            'message_attachments' => ['file_url'],
            'blogs' => ['cover_image'],
            'supplier_product_images' => ['image_url'],
            'supplier_products' => ['cover_image'],
            'suppliers' => ['cover_image', 'logo'],
            'builder_project_images' => ['image_url'],
            'builder_projects' => ['cover_image'],
            'builders' => ['cover_image', 'logo'],
            'requirement_images' => ['image_url'],
            'listing_galleries' => ['image_url'],
            'listings' => ['cover_image'],
            'categories' => ['image'],
            'user_documents' => ['file_path'],
            'tenders' => ['document_url'],
            'workers' => ['avatar']
        ];

        foreach ($tables as $table => $columns) {
            if (Schema::hasTable($table)) {
                foreach ($columns as $column) {
                    if (Schema::hasColumn($table, $column)) {
                        DB::statement("ALTER TABLE `{$table}` MODIFY `{$column}` LONGTEXT");
                    }
                }
            }
        }
    }

    public function down(): void
    {
        // Down migration can be complex as we don't know the exact prior size, but typically it was VARCHAR(255)
    }
};
