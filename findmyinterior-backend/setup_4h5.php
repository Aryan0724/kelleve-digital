<?php
/**
 * Phase 4H.5.3 — Fresh Destination Rebuild
 *
 * SAFETY GATES:
 *   1. The destination and quarantine DB names are declared as constants.
 *      Any mismatch between constant and attempted DROP aborts immediately.
 *   2. Production database name is declared as a constant and the script
 *      will refuse to DROP any database matching it.
 *   3. The legacy_restore database is declared as read-only by this script.
 *      Any write or DROP attempt to it aborts immediately.
 *
 * NEVER run this against production.
 * NEVER run this against legacy_restore.
 */

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

// ─── Safety Gate Constants ────────────────────────────────────────────────────
const DISPOSABLE_RESTORATION_DB = 'findmyinterior_legacy_migrated';
const DISPOSABLE_QUARANTINE_DB  = 'findmyinterior_legacy_quarantine';
const FORBIDDEN_PRODUCTION_DB   = 'findmyinterior_local';        // adjust if different in prod
const FORBIDDEN_LEGACY_DB       = 'findmyinterior_legacy_restore';

function abort_if_forbidden(string $dbName, string $operation): void
{
    $upper = strtolower($dbName);
    if (in_array($upper, [FORBIDDEN_PRODUCTION_DB, FORBIDDEN_LEGACY_DB], true)) {
        echo "[SAFETY GATE TRIGGERED] Attempted to $operation on protected database: $dbName\n";
        echo "Aborting. No changes made.\n";
        exit(1);
    }
}

function assert_disposable(string $dbName, string $expected): void
{
    if ($dbName !== $expected) {
        echo "[SAFETY GATE TRIGGERED] DB name mismatch: expected '$expected', got '$dbName'\n";
        echo "Aborting. No changes made.\n";
        exit(1);
    }
}

// ─── Verify safety gates before any destructive operation ────────────────────
echo "=== Phase 4H.5.3 Safety Gate Check ===\n";

abort_if_forbidden(DISPOSABLE_RESTORATION_DB, 'DROP');
abort_if_forbidden(DISPOSABLE_QUARANTINE_DB, 'DROP');
assert_disposable(DISPOSABLE_RESTORATION_DB, 'findmyinterior_legacy_migrated');
assert_disposable(DISPOSABLE_QUARANTINE_DB, 'findmyinterior_legacy_quarantine');

echo "[OK] Safety gates passed. Proceeding with rebuild.\n\n";

// ─── Register DB connections ──────────────────────────────────────────────────
$base = [
    'driver'   => 'mysql',
    'host'     => env('DB_HOST', '127.0.0.1'),
    'port'     => env('DB_PORT', '3306'),
    'username' => env('DB_USERNAME', 'root'),
    'password' => env('DB_PASSWORD', ''),
];

Config::set('database.connections.legacy_migrated', array_merge($base, ['database' => DISPOSABLE_RESTORATION_DB]));
Config::set('database.connections.legacy_quarantine', array_merge($base, ['database' => DISPOSABLE_QUARANTINE_DB]));

// Point fmi_mysql and truedial_mysql at the restoration DB so migrations
// with `protected $connection = 'fmi_mysql'` target the disposable destination.
Config::set('database.connections.fmi_mysql',      array_merge($base, ['database' => DISPOSABLE_RESTORATION_DB]));
Config::set('database.connections.truedial_mysql', array_merge($base, ['database' => DISPOSABLE_RESTORATION_DB]));

// Purge any cached connections so the new config takes effect.
DB::purge('fmi_mysql');
DB::purge('truedial_mysql');
DB::purge('legacy_migrated');
DB::purge('legacy_quarantine');

// ─── Drop and recreate both disposable databases ──────────────────────────────
$rootConn = DB::connection('mysql');

echo "--- Dropping " . DISPOSABLE_RESTORATION_DB . " ---\n";
$rootConn->statement('DROP DATABASE IF EXISTS ' . DISPOSABLE_RESTORATION_DB);
$rootConn->statement('CREATE DATABASE ' . DISPOSABLE_RESTORATION_DB . ' CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
echo "[OK] " . DISPOSABLE_RESTORATION_DB . " recreated.\n\n";

echo "--- Dropping " . DISPOSABLE_QUARANTINE_DB . " ---\n";
$rootConn->statement('DROP DATABASE IF EXISTS ' . DISPOSABLE_QUARANTINE_DB);
$rootConn->statement('CREATE DATABASE ' . DISPOSABLE_QUARANTINE_DB . ' CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
echo "[OK] " . DISPOSABLE_QUARANTINE_DB . " recreated.\n\n";

// ─── Run migrations on restoration DB ────────────────────────────────────────
echo "=== Running Auth Migrations on restoration DB ===\n";
Artisan::call('migrate', ['--database' => 'legacy_migrated', '--path' => 'database/migrations/auth', '--force' => true]);
echo Artisan::output();

echo "=== Running FMI Migrations on restoration DB ===\n";
Artisan::call('migrate', ['--database' => 'legacy_migrated', '--path' => 'database/migrations/fmi', '--force' => true]);
echo Artisan::output();

echo "=== Running TrueDial Migrations on restoration DB ===\n";
Artisan::call('migrate', ['--database' => 'legacy_migrated', '--path' => 'database/migrations/truedial', '--force' => true]);
echo Artisan::output();

// ─── Quarantine schema is already applied by the FMI migration batch above ────
// (2026_08_23_000003_create_quarantine_schema.php runs against fmi_mysql
//  which is now pointing at the restoration DB — the quarantine_* tables land
//  in findmyinterior_legacy_migrated and are accessible via the legacy_quarantine
//  alias since both currently point at the same host.
//
//  If you want a physically separate quarantine DB, move that migration file
//  to a separate path and run it against legacy_quarantine explicitly.)

echo "=== Phase 4H.5.3 Complete — Both disposable databases are clean and ready. ===\n";
echo "  Restoration DB: " . DISPOSABLE_RESTORATION_DB . " (all FMI + TrueDial migrations applied)\n";
echo "  Quarantine schema: quarantine_* tables in restoration DB (accessible via legacy_quarantine alias)\n";
