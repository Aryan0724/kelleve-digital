<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Auth Tables for TrueDial Database
 *
 * These reference-only tables point to the shared auth users table.
 * NOTE: In shared-database mode this migration runs on the same DB as FMI
 * and these tables will already exist (no-op via createIfNotExists checks).
 */
return new class extends Migration
{
    public function up(): void
    {
        // ─── TrueDial Categories ────────────────────────────────────────────
        if (!Schema::hasTable('categories')) {
            Schema::create('categories', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->string('icon')->nullable();
                $table->string('image')->nullable();
                $table->text('description')->nullable();
                $table->unsignedBigInteger('parent_id')->nullable();
                $table->integer('sort_order')->default(0);
                $table->boolean('is_active')->default(true);
                $table->unsignedInteger('tenant_id')->nullable()->default(2);
                $table->timestamps();
            });
        }

        // ─── Listings (Business Directory) ─────────────────────────────────
        if (!Schema::hasTable('listings')) {
            Schema::create('listings', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->unsignedBigInteger('category_id')->nullable();
                $table->unsignedBigInteger('city_id')->nullable();
                $table->unsignedBigInteger('district_id')->nullable();
                $table->string('title');
                $table->string('slug')->unique();
                $table->text('description')->nullable();
                $table->string('tagline')->nullable();
                $table->string('cover_image')->nullable();
                $table->string('phone', 20)->nullable();
                $table->string('whatsapp', 20)->nullable();
                $table->string('email')->nullable();
                $table->string('website')->nullable();
                $table->string('city', 100)->nullable();
                $table->string('district', 100)->nullable();
                $table->string('state', 100)->default('Bihar');
                $table->text('address')->nullable();
                $table->decimal('lat', 10, 8)->nullable();
                $table->decimal('lng', 11, 8)->nullable();
                $table->integer('years_experience')->nullable();
                $table->integer('team_size')->nullable();
                $table->decimal('avg_rating', 3, 2)->default(0.00);
                $table->integer('review_count')->default(0);
                $table->boolean('is_featured')->default(false);
                $table->boolean('is_premium')->default(false);
                $table->boolean('is_verified')->default(false);
                $table->enum('status', ['pending', 'active', 'inactive', 'suspended'])->default('pending');
                $table->integer('views_count')->default(0);
                $table->integer('phone_clicks')->default(0);
                $table->integer('whatsapp_clicks')->default(0);
                $table->integer('website_clicks')->default(0);
                $table->unsignedInteger('tenant_id')->nullable()->default(2);
                $table->string('subscription_plan')->nullable();
                $table->string('subscription_status')->nullable();
                $table->string('gst_number')->nullable();
                $table->json('services')->nullable();
                $table->json('products')->nullable();
                $table->json('social_links')->nullable();
                $table->json('availability')->nullable();
                $table->softDeletes();
                $table->timestamps();

                $table->index('user_id');
                $table->index('category_id');
                $table->index('status');
                $table->index('is_featured');
                $table->index('tenant_id');
            });
        }

        // ─── Listing Gallery ────────────────────────────────────────────────
        if (!Schema::hasTable('listing_galleries')) {
            Schema::create('listing_galleries', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('listing_id');
                $table->string('image_url');
                $table->string('caption')->nullable();
                $table->string('type')->default('image');
                $table->string('video_url')->nullable();
                $table->integer('sort_order')->default(0);
                $table->timestamps();

                $table->index('listing_id');
            });
        }

        // ─── Media (Generic Media Store for Listings) ───────────────────────
        if (!Schema::hasTable('media')) {
            Schema::create('media', function (Blueprint $table) {
                $table->id();
                $table->unsignedInteger('tenant_id')->nullable();
                $table->string('model_type');
                $table->unsignedBigInteger('model_id');
                $table->string('collection_name')->default('default');
                $table->string('file_name');
                $table->string('mime_type')->nullable();
                $table->string('disk')->default('public');
                $table->unsignedBigInteger('size')->nullable();
                $table->integer('width')->nullable();
                $table->integer('height')->nullable();
                $table->string('alt_text')->nullable();
                $table->string('blur_hash')->nullable();
                $table->string('dominant_color')->nullable();
                $table->integer('sort_order')->default(0);
                $table->boolean('is_cover')->default(false);
                $table->softDeletes();
                $table->timestamps();

                $table->index(['model_type', 'model_id']);
                $table->index('tenant_id');
            });
        }

        // ─── Offers / Promotions ────────────────────────────────────────────
        if (!Schema::hasTable('offers')) {
            Schema::create('offers', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('listing_id');
                $table->unsignedInteger('tenant_id')->nullable()->default(2);
                $table->string('title');
                $table->text('description')->nullable();
                $table->string('promo_code')->nullable();
                $table->timestamp('valid_until')->nullable();
                $table->enum('status', ['draft', 'active', 'paused', 'archived'])->default('draft');
                $table->string('discount_type')->nullable();
                $table->decimal('discount_value', 8, 2)->nullable();
                $table->string('cta_label')->nullable();
                $table->string('cta_url')->nullable();
                $table->timestamps();

                $table->index('listing_id');
                $table->index('status');
                $table->index('tenant_id');
            });
        }

        // ─── Reviews ───────────────────────────────────────────────────────
        if (!Schema::hasTable('reviews')) {
            Schema::create('reviews', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('listing_id')->nullable();
                $table->unsignedBigInteger('user_id')->nullable();
                $table->unsignedBigInteger('reviewer_id')->nullable();
                $table->unsignedBigInteger('reviewed_user_id')->nullable();
                $table->unsignedInteger('tenant_id')->nullable()->default(2);
                $table->decimal('rating', 3, 1);
                $table->string('title')->nullable();
                $table->text('body')->nullable();
                $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
                $table->integer('helpful_count')->default(0);
                $table->text('vendor_reply')->nullable();
                $table->timestamp('vendor_replied_at')->nullable();
                $table->softDeletes();
                $table->timestamps();

                $table->index('listing_id');
                $table->index('user_id');
                $table->index('status');
            });
        }

        // ─── Review Replies ─────────────────────────────────────────────────
        if (!Schema::hasTable('review_replies')) {
            Schema::create('review_replies', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('review_id');
                $table->unsignedBigInteger('user_id');
                $table->text('body');
                $table->timestamps();
            });
        }

        // ─── Review Helpful Votes ──────────────────────────────────────────
        if (!Schema::hasTable('review_helpful_votes')) {
            Schema::create('review_helpful_votes', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('review_id');
                $table->unsignedBigInteger('user_id');
                $table->timestamps();
            });
        }

        // ─── Review Reports ────────────────────────────────────────────────
        if (!Schema::hasTable('review_reports')) {
            Schema::create('review_reports', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('review_id');
                $table->unsignedBigInteger('user_id');
                $table->string('reason');
                $table->text('note')->nullable();
                $table->timestamps();
            });
        }

        // ─── Privilege Cards ───────────────────────────────────────────────
        if (!Schema::hasTable('privilege_cards')) {
            Schema::create('privilege_cards', function (Blueprint $table) {
                $table->id();
                $table->unsignedInteger('tenant_id')->nullable()->default(2);
                $table->unsignedBigInteger('user_id');
                $table->string('card_number')->unique();
                $table->enum('status', ['active', 'revoked', 'expired'])->default('active');
                $table->timestamp('valid_until')->nullable();
                $table->timestamps();

                $table->index('user_id');
            });
        }

        // ─── Analytics Events ──────────────────────────────────────────────
        if (!Schema::hasTable('analytics_events')) {
            Schema::create('analytics_events', function (Blueprint $table) {
                $table->id();
                $table->unsignedInteger('tenant_id')->nullable()->default(2);
                $table->string('event_type');
                $table->string('entity_type')->nullable();
                $table->unsignedBigInteger('entity_id')->nullable();
                $table->unsignedBigInteger('user_id')->nullable();
                $table->string('session_id')->nullable();
                $table->string('ip_address', 45)->nullable();
                $table->json('metadata')->nullable();
                $table->timestamp('created_at')->useCurrent();

                $table->index(['entity_type', 'entity_id']);
                $table->index('tenant_id');
                $table->index('event_type');
            });
        }

        // ─── Analytics Daily Aggregates ────────────────────────────────────
        if (!Schema::hasTable('analytics_daily')) {
            Schema::create('analytics_daily', function (Blueprint $table) {
                $table->id();
                $table->unsignedInteger('tenant_id')->nullable()->default(2);
                $table->date('date');
                $table->string('entity_type')->nullable();
                $table->unsignedBigInteger('entity_id')->nullable();
                $table->string('metric_name');
                $table->unsignedBigInteger('count')->default(0);
                $table->timestamps();

                $table->index(['date', 'entity_type', 'entity_id']);
            });
        }

        // ─── Consulting Leads (Enquiries) ──────────────────────────────────
        if (!Schema::hasTable('consulting_leads')) {
            Schema::create('consulting_leads', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('listing_id')->nullable();
                $table->unsignedBigInteger('user_id')->nullable();
                $table->unsignedInteger('tenant_id')->nullable()->default(2);
                $table->string('name');
                $table->string('phone', 20)->nullable();
                $table->string('email')->nullable();
                $table->string('service_type')->nullable();
                $table->text('message')->nullable();
                $table->enum('status', ['new', 'contacted', 'converted', 'closed'])->default('new');
                $table->timestamps();

                $table->index('listing_id');
                $table->index('status');
            });
        }

        // ─── Marketing Campaigns ────────────────────────────────────────────
        if (!Schema::hasTable('marketing_campaigns')) {
            Schema::create('marketing_campaigns', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->unsignedInteger('tenant_id')->nullable()->default(2);
                $table->string('name');
                $table->text('message')->nullable();
                $table->json('audience')->nullable();
                $table->enum('status', ['draft', 'active', 'paused', 'completed'])->default('draft');
                $table->timestamp('scheduled_at')->nullable();
                $table->timestamps();
            });
        }

        // ─── TrueDial Invoices ──────────────────────────────────────────────
        if (!Schema::hasTable('truedial_invoices')) {
            Schema::create('truedial_invoices', function (Blueprint $table) {
                $table->id();
                $table->unsignedInteger('tenant_id')->nullable()->default(2);
                $table->unsignedBigInteger('vendor_id');
                $table->string('invoice_number')->unique();
                $table->decimal('amount', 10, 2)->default(0);
                $table->decimal('tax_amount', 10, 2)->default(0);
                $table->enum('status', ['paid', 'unpaid', 'overdue'])->default('unpaid');
                $table->timestamp('issued_at')->nullable();
                $table->timestamp('due_at')->nullable();
                $table->timestamps();

                $table->index('vendor_id');
                $table->index('status');
            });
        }

        // ─── Saved Vendors ─────────────────────────────────────────────────
        if (!Schema::hasTable('saved_vendors')) {
            Schema::create('saved_vendors', function (Blueprint $table) {
                $table->id();
                $table->unsignedInteger('tenant_id')->nullable()->default(2);
                $table->unsignedBigInteger('user_id');
                $table->unsignedBigInteger('vendor_id');
                $table->timestamps();

                $table->unique(['user_id', 'vendor_id']);
            });
        }

        // ─── Listing Products & Services ────────────────────────────────────
        if (!Schema::hasTable('listing_products')) {
            Schema::create('listing_products', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('listing_id');
                $table->unsignedInteger('tenant_id')->nullable()->default(2);
                $table->string('name');
                $table->text('description')->nullable();
                $table->decimal('price', 10, 2)->nullable();
                $table->string('unit')->nullable();
                $table->boolean('is_active')->default(true);
                $table->softDeletes();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('listing_services')) {
            Schema::create('listing_services', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('listing_id');
                $table->unsignedInteger('tenant_id')->nullable()->default(2);
                $table->string('name');
                $table->text('description')->nullable();
                $table->decimal('price_from', 10, 2)->nullable();
                $table->decimal('price_to', 10, 2)->nullable();
                $table->boolean('is_active')->default(true);
                $table->softDeletes();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('conversations')) {
            Schema::create('conversations', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('project_id')->nullable();
                $table->unsignedBigInteger('customer_id');
                $table->unsignedBigInteger('vendor_id');
                $table->string('status')->default('active');
                $table->string('project_stage')->nullable();
                $table->integer('customer_unread_count')->default(0);
                $table->integer('vendor_unread_count')->default(0);
                $table->timestamp('unlocked_at')->nullable();
                $table->timestamp('first_vendor_reply_at')->nullable();
                $table->timestamp('last_customer_reply_at')->nullable();
                $table->timestamp('last_vendor_reply_at')->nullable();
                $table->timestamp('last_message_at')->nullable();
                $table->timestamp('awarded_at')->nullable();
                $table->timestamp('completed_at')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('messages')) {
            Schema::create('messages', function (Blueprint $table) {
                $table->id();
                $table->foreignId('conversation_id')->constrained('conversations')->cascadeOnDelete();
                $table->unsignedBigInteger('sender_id');
                $table->text('message');
                $table->string('message_type')->default('text');
                $table->json('meta_data')->nullable();
                $table->timestamp('read_at')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        $tables = [
            'listing_services', 'listing_products', 'saved_vendors',
            'truedial_invoices', 'marketing_campaigns', 'consulting_leads',
            'analytics_daily', 'analytics_events', 'privilege_cards',
            'review_reports', 'review_helpful_votes', 'review_replies',
            'reviews', 'offers', 'media', 'listing_galleries',
            'listings', 'categories',
        ];

        Schema::disableForeignKeyConstraints();
        foreach ($tables as $table) {
            Schema::dropIfExists($table);
        }
        Schema::enableForeignKeyConstraints();
    }
};


