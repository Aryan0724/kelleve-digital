<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add FULLTEXT indexes for search functionality.
     * These are separate from the main table migrations
     * because FULLTEXT requires MyISAM or InnoDB (MySQL 5.6+).
     */
    public function up(): void
    {
        // Listings full-text search
        // DB::statement('ALTER TABLE listings ADD FULLTEXT fulltext_listings (title, description)');

        // Workers full-text search
        // DB::statement('ALTER TABLE workers ADD FULLTEXT fulltext_workers (name, skill, bio)');

        // Blogs full-text search
        // DB::statement('ALTER TABLE blogs ADD FULLTEXT fulltext_blogs (title, excerpt, content)');
    }

    public function down(): void
    {
        // DB::statement('ALTER TABLE listings DROP INDEX fulltext_listings');
        // DB::statement('ALTER TABLE workers DROP INDEX fulltext_workers');
        // DB::statement('ALTER TABLE blogs DROP INDEX fulltext_blogs');
    }
};
