<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Config;

/**
 * TrueDial Database Setup Command
 *
 * This command provisions the dedicated TrueDial database (truedial_db) separately
 * from Find My Interior's primary database, while sharing the same Auth/User tables.
 *
 * Usage:
 *   php artisan truedial:setup            # Create truedial_db and run all migrations
 *   php artisan truedial:setup --fresh    # Drop truedial_db and recreate from scratch
 *   php artisan truedial:setup --seed     # Also run TruedialSeeder after migration
 */
class TruedialSetup extends Command
{
    protected $signature   = 'truedial:setup {--fresh : Drop all truedial tables before migrating} {--seed : Run TruedialSeeder after migration}';
    protected $description = 'Set up the dedicated TrueDial database. If DB_TRUEDIAL_DATABASE is set, creates it and runs TrueDial migrations. Shared User/Auth tables remain untouched.';

    public function handle(): int
    {
        $truedialDb = config('database.connections.truedial.database');
        $defaultDb  = config('database.connections.mysql.database');
        $isSeparate = $truedialDb !== $defaultDb;

        $this->info('');
        $this->info('╔══════════════════════════════════════════╗');
        $this->info('║        TrueDial Database Setup           ║');
        $this->info('╚══════════════════════════════════════════╝');
        $this->info('');

        if ($isSeparate) {
            $this->info("Mode: Separate Database");
            $this->info("Auth/User DB:   {$defaultDb}");
            $this->info("TrueDial DB:    {$truedialDb}");
        } else {
            $this->info("Mode: Shared Database (DB_TRUEDIAL_DATABASE not set — using {$defaultDb})");
            $this->info("TrueDial models will query the same database as Find My Interior.");
            $this->info("To use a dedicated TrueDial database, set DB_TRUEDIAL_DATABASE in .env");
        }

        $this->info('');

        if ($isSeparate) {
            // Step 1: Create the truedial_db database if it doesn't exist
            $this->createDatabase($truedialDb);
        }

        // Step 2: Run --fresh if requested
        if ($this->option('fresh') && $isSeparate) {
            $this->warn("--fresh: Dropping all TrueDial tables from {$truedialDb}...");
            $this->dropTruedialTables();
        }

        // Step 3: Run TrueDial-specific migrations against the truedial connection
        $this->info('Running TrueDial migrations...');
        $this->call('migrate', [
            '--database' => 'truedial',
            '--path'     => 'database/migrations/truedial',
            '--force'    => true,
        ]);

        $this->info('');

        // Step 4: Run seeder if requested
        if ($this->option('seed')) {
            $this->info('Seeding TrueDial database...');
            $this->call('db:seed', ['--class' => 'TruedialSeeder', '--force' => true]);
        }

        $this->info('');
        $this->info('✅ TrueDial database setup complete!');
        $this->info('');
        $this->info('Registration on Find My Interior automatically logs users into TrueDial.');
        $this->info("Both apps share the same users table in '{$defaultDb}'.");
        $this->info('');

        return self::SUCCESS;
    }

    /**
     * Create the TrueDial database on the server if it doesn't already exist.
     */
    protected function createDatabase(string $dbName): void
    {
        $this->info("Creating database '{$dbName}' if not exists...");

        try {
            // Use the root connection (mysql) without a specific DB selected
            $host     = config('database.connections.truedial.host');
            $port     = config('database.connections.truedial.port');
            $username = config('database.connections.truedial.username');
            $password = config('database.connections.truedial.password');
            $charset  = config('database.connections.truedial.charset', 'utf8mb4');
            $collation = config('database.connections.truedial.collation', 'utf8mb4_unicode_ci');

            // Temporarily configure a connection without database name for CREATE DATABASE
            Config::set('database.connections.truedial_create', [
                'driver'    => 'mysql',
                'host'      => $host,
                'port'      => $port,
                'database'  => '',
                'username'  => $username,
                'password'  => $password,
                'charset'   => $charset,
                'collation' => $collation,
            ]);

            DB::connection('truedial_create')
                ->statement("CREATE DATABASE IF NOT EXISTS `{$dbName}` CHARACTER SET {$charset} COLLATE {$collation}");

            $this->info("  → Database '{$dbName}' ready.");
        } catch (\Exception $e) {
            $this->error("  ✗ Could not create database: " . $e->getMessage());
            $this->warn("  → You may need to create '{$dbName}' manually on your server.");
        }
    }

    /**
     * Drop all TrueDial-specific tables for a fresh start.
     */
    protected function dropTruedialTables(): void
    {
        $tables = [
            'analytics_daily',
            'analytics_events',
            'privilege_cards',
            'marketing_campaigns',
            'consulting_leads',
            'review_reports',
            'review_helpful_votes',
            'review_replies',
            'saved_vendors',
            'media',
            'listing_galleries',
            'listing_products',
            'listing_services',
            'product_categories',
            'service_categories',
            'offers',
            'listings',
            'categories',
            'migrations',
        ];

        Schema::connection('truedial')->disableForeignKeyConstraints();
        foreach ($tables as $table) {
            Schema::connection('truedial')->dropIfExists($table);
        }
        Schema::connection('truedial')->enableForeignKeyConstraints();

        $this->info('  → Dropped all TrueDial tables.');
    }
}
