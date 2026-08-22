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
        Schema::create('storage_migrations', function (Blueprint $table) {
            $table->id();
            $table->string('source_table');
            $table->string('source_column');
            $table->string('source_record_id'); // String because some tables might use UUIDs
            $table->string('source_sha256')->nullable();
            $table->unsignedBigInteger('decoded_size')->nullable();
            $table->string('mime_type')->nullable();
            $table->string('storage_disk')->nullable();
            $table->string('storage_path')->nullable();
            $table->string('destination_sha256')->nullable();
            $table->unsignedBigInteger('destination_size')->nullable();
            $table->string('destination_url')->nullable();
            $table->string('status'); // PENDING, VERIFIED, FAILED, SKIPPED, DUPLICATE_MAPPED
            $table->string('error_id')->nullable();
            $table->text('error_reason')->nullable();
            $table->timestamp('migrated_at')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();

            // Indexes for faster lookups during deduplication and resumes
            $table->index(['source_table', 'source_column', 'source_record_id'], 'idx_source_record');
            $table->index('source_sha256');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('storage_migrations');
    }
};
