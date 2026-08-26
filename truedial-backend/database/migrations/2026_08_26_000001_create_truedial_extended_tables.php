<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        // ─── Locations, Cities & Districts ─────────────────────────────────
        if (!Schema::hasTable('districts')) {
            Schema::create('districts', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('state')->default('Bihar');
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('cities')) {
            Schema::create('cities', function (Blueprint $table) {
                $table->id();
                $table->foreignId('district_id')->nullable()->constrained('districts')->nullOnDelete();
                $table->string('name');
                $table->string('state')->default('Bihar');
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('locations')) {
            Schema::create('locations', function (Blueprint $table) {
                $table->id();
                $table->string('city');
                $table->string('district')->nullable();
                $table->string('state')->default('Bihar');
                $table->decimal('lat', 10, 8)->nullable();
                $table->decimal('lng', 11, 8)->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        // ─── Advertisements ────────────────────────────────────────────────
        if (!Schema::hasTable('advertisements')) {
            Schema::create('advertisements', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->string('location')->default('in_list'); // in_list, top_ribbon, popup
                $table->string('banner_url')->nullable();
                $table->string('media_type')->default('image');
                $table->text('custom_code')->nullable();
                $table->string('link')->nullable();
                $table->string('target_city')->nullable();
                $table->unsignedBigInteger('target_category_id')->nullable();
                $table->integer('priority')->default(0);
                $table->timestamp('starts_at')->nullable();
                $table->timestamp('ends_at')->nullable();
                $table->boolean('is_active')->default(true);
                $table->unsignedBigInteger('user_id')->nullable();
                $table->decimal('budget', 12, 2)->nullable();
                $table->integer('max_impressions')->nullable();
                $table->integer('max_clicks')->nullable();
                $table->string('target_role')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('advertisement_stats')) {
            Schema::create('advertisement_stats', function (Blueprint $table) {
                $table->id();
                $table->foreignId('advertisement_id')->constrained('advertisements')->cascadeOnDelete();
                $table->enum('type', ['impression', 'click']);
                $table->string('ip_address', 45)->nullable();
                $table->string('user_agent')->nullable();
                $table->json('metadata')->nullable();
                $table->timestamps();
            });
        }

        // ─── Healthcare Patients (EHR) ─────────────────────────────────────
        if (!Schema::hasTable('patients')) {
            Schema::create('patients', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id'); // Doctor/Clinic vendor
                $table->string('patient_identifier')->nullable();
                $table->string('name');
                $table->integer('age')->nullable();
                $table->string('gender', 20)->nullable();
                $table->string('phone', 20)->nullable();
                $table->string('blood_group', 10)->nullable();
                $table->string('condition')->nullable();
                $table->string('status')->default('In Treatment');
                $table->text('allergies')->nullable();
                $table->text('notes')->nullable();
                $table->timestamp('last_visit_at')->nullable();
                $table->timestamps();
                $table->softDeletes();
            });
        }

        // ─── News Articles ─────────────────────────────────────────────────
        if (!Schema::hasTable('news_articles')) {
            Schema::create('news_articles', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->string('slug')->unique();
                $table->string('category')->default('Business');
                $table->text('summary')->nullable();
                $table->longText('content')->nullable();
                $table->string('image_url')->nullable();
                $table->string('author_name')->default('TrueDial Editorial');
                $table->boolean('is_published')->default(true);
                $table->timestamp('published_at')->nullable();
                $table->timestamps();
            });
        }

        // ─── Job Board ─────────────────────────────────────────────────────
        if (!Schema::hasTable('jobs')) {
            Schema::create('jobs', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id')->nullable();
                $table->string('title');
                $table->string('slug')->unique();
                $table->string('company_name');
                $table->string('company_logo')->nullable();
                $table->string('location')->nullable();
                $table->string('job_type')->default('Full-time'); // Full-time, Part-time, Remote, Internship
                $table->string('experience_level')->nullable();
                $table->string('salary_range')->nullable();
                $table->text('description')->nullable();
                $table->json('requirements')->nullable();
                $table->string('contact_email')->nullable();
                $table->string('contact_phone')->nullable();
                $table->string('apply_url')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        // ─── Academy Courses ───────────────────────────────────────────────
        if (!Schema::hasTable('courses')) {
            Schema::create('courses', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->string('slug')->unique();
                $table->string('instructor_name')->nullable();
                $table->string('category')->nullable();
                $table->string('duration')->nullable();
                $table->string('level')->default('Beginner');
                $table->decimal('price', 10, 2)->default(0.00);
                $table->string('thumbnail_url')->nullable();
                $table->text('description')->nullable();
                $table->json('modules')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        // ─── Inquiries ─────────────────────────────────────────────────────
        if (!Schema::hasTable('inquiries')) {
            Schema::create('inquiries', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('listing_id')->nullable();
                $table->unsignedBigInteger('user_id')->nullable();
                $table->string('name');
                $table->string('phone', 20);
                $table->string('email')->nullable();
                $table->text('message');
                $table->string('service_type')->nullable();
                $table->string('city')->nullable();
                $table->enum('status', ['new', 'in_progress', 'resolved', 'closed'])->default('new');
                $table->timestamps();
            });
        }

        // ─── Notifications ─────────────────────────────────────────────────
        if (!Schema::hasTable('notifications')) {
            Schema::create('notifications', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->string('type')->default('general');
                $table->string('title');
                $table->text('message');
                $table->json('data')->nullable();
                $table->boolean('is_read')->default(false);
                $table->timestamp('read_at')->nullable();
                $table->timestamps();
            });
        }

        // ─── Subscription Plans & Payments ─────────────────────────────────
        if (!Schema::hasTable('subscription_plans')) {
            Schema::create('subscription_plans', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->decimal('price_monthly', 10, 2)->default(0);
                $table->decimal('price_yearly', 10, 2)->default(0);
                $table->json('features')->nullable();
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('payments')) {
            Schema::create('payments', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->string('razorpay_order_id')->nullable();
                $table->string('razorpay_payment_id')->nullable();
                $table->string('razorpay_signature')->nullable();
                $table->decimal('amount', 10, 2);
                $table->string('currency', 10)->default('INR');
                $table->string('purpose')->default('subscription');
                $table->string('status')->default('pending'); // pending, successful, failed
                $table->json('meta')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('user_subscriptions')) {
            Schema::create('user_subscriptions', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('user_id');
                $table->unsignedBigInteger('plan_id');
                $table->string('billing_cycle')->default('monthly');
                $table->string('status')->default('active'); // active, cancelled, expired
                $table->timestamp('starts_at')->nullable();
                $table->timestamp('ends_at')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void {
        Schema::dropIfExists('user_subscriptions');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('subscription_plans');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('inquiries');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('news_articles');
        Schema::dropIfExists('patients');
        Schema::dropIfExists('advertisement_stats');
        Schema::dropIfExists('advertisements');
        Schema::dropIfExists('locations');
        Schema::dropIfExists('cities');
        Schema::dropIfExists('districts');
    }
};
