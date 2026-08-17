#!/bin/bash
# =============================================================================
#  TrueDial Dedicated Database Setup Script
#  Run this on your VPS server to provision TrueDial's separate database.
#
#  Usage:
#    chmod +x setup_truedial_db.sh
#    ./setup_truedial_db.sh
#
#  What this does:
#    1. Creates the 'truedial_db' MySQL database
#    2. Creates the 'findmyinterior_auth' shared auth database (if separate from fmi)
#    3. Grants all privileges to the DB user
#    4. Runs TrueDial database migrations
#    5. Seeds 35 categories + 175 businesses
# =============================================================================

set -e  # Exit immediately if a command fails

# ─── Configuration ────────────────────────────────────────────────────────────
LARAVEL_DIR="/var/www/findmyinterior-backend"   # Adjust this to your Laravel root
MYSQL_ROOT_USER="root"
MYSQL_ROOT_PASS=""                               # Set if root has a password
DB_TRUEDIAL="truedial_db"
DB_AUTH="findmyinterior"                         # Shared auth DB (same as main FMI DB by default)
DB_USER="truedial_user"                          # DB user for TrueDial
DB_PASS="truedial_secure_pass"                   # Change this!

MYSQL_CMD="mysql -u${MYSQL_ROOT_USER}"
if [ -n "$MYSQL_ROOT_PASS" ]; then
    MYSQL_CMD="mysql -u${MYSQL_ROOT_USER} -p${MYSQL_ROOT_PASS}"
fi

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║         TrueDial Database Provisioning Script            ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# ─── Step 1: Create Databases ─────────────────────────────────────────────────
echo "▶ Step 1: Creating databases..."
$MYSQL_CMD <<-SQL
    CREATE DATABASE IF NOT EXISTS \`${DB_TRUEDIAL}\`
        CHARACTER SET utf8mb4
        COLLATE utf8mb4_unicode_ci;

    CREATE DATABASE IF NOT EXISTS \`${DB_AUTH}\`
        CHARACTER SET utf8mb4
        COLLATE utf8mb4_unicode_ci;
SQL
echo "  ✅ Databases created: ${DB_TRUEDIAL}, ${DB_AUTH}"

# ─── Step 2: Grant Privileges ─────────────────────────────────────────────────
echo ""
echo "▶ Step 2: Granting privileges..."
$MYSQL_CMD <<-SQL
    CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
    GRANT ALL PRIVILEGES ON \`${DB_TRUEDIAL}\`.* TO '${DB_USER}'@'localhost';
    GRANT ALL PRIVILEGES ON \`${DB_AUTH}\`.* TO '${DB_USER}'@'localhost';
    FLUSH PRIVILEGES;
SQL
echo "  ✅ Privileges granted to '${DB_USER}'@'localhost'"

# ─── Step 3: Update .env with TrueDial DB config ──────────────────────────────
echo ""
echo "▶ Step 3: Updating .env file..."
if [ -f "${LARAVEL_DIR}/.env" ]; then
    cd "$LARAVEL_DIR"

    # Remove any existing TRUEDIAL DB settings and re-add
    grep -v "DB_TRUEDIAL_" .env > .env.tmp && mv .env.tmp .env
    grep -v "DB_AUTH_" .env > .env.tmp && mv .env.tmp .env

    echo "" >> .env
    echo "# TrueDial Dedicated Database" >> .env
    echo "DB_TRUEDIAL_HOST=127.0.0.1" >> .env
    echo "DB_TRUEDIAL_PORT=3306" >> .env
    echo "DB_TRUEDIAL_DATABASE=${DB_TRUEDIAL}" >> .env
    echo "DB_TRUEDIAL_USERNAME=${DB_USER}" >> .env
    echo "DB_TRUEDIAL_PASSWORD=${DB_PASS}" >> .env

    echo "" >> .env
    echo "# Shared Auth Database (users, roles, tokens)" >> .env
    echo "DB_AUTH_HOST=127.0.0.1" >> .env
    echo "DB_AUTH_PORT=3306" >> .env
    echo "DB_AUTH_DATABASE=${DB_AUTH}" >> .env
    echo "DB_AUTH_USERNAME=${DB_USER}" >> .env
    echo "DB_AUTH_PASSWORD=${DB_PASS}" >> .env

    echo "  ✅ .env updated with TrueDial DB settings"
else
    echo "  ⚠️  .env not found at ${LARAVEL_DIR}/.env — please add settings manually!"
fi

# ─── Step 4: Run Auth Database Migrations ─────────────────────────────────────
echo ""
echo "▶ Step 4: Running Auth database migrations..."
cd "$LARAVEL_DIR"
php artisan migrate \
    --database=auth \
    --path=database/migrations/auth \
    --force
echo "  ✅ Auth database schema ready"

# ─── Step 5: Run TrueDial Database Migrations ─────────────────────────────────
echo ""
echo "▶ Step 5: Running TrueDial database migrations..."
php artisan migrate \
    --database=truedial \
    --path=database/migrations/truedial \
    --force
echo "  ✅ TrueDial database schema ready"

# ─── Step 6: Seed TrueDial Data ───────────────────────────────────────────────
echo ""
echo "▶ Step 6: Seeding TrueDial database with 35 categories + 175 businesses..."
php artisan db:seed --class=TruedialSeeder --force
echo "  ✅ TrueDial data seeded"

# ─── Step 7: Clear Application Caches ────────────────────────────────────────
echo ""
echo "▶ Step 7: Clearing application caches..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
echo "  ✅ Caches cleared"

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║            ✅ TrueDial Database Ready!                   ║"
echo "╠══════════════════════════════════════════════════════════╣"
echo "║                                                          ║"
echo "║  Auth DB:     ${DB_AUTH}                         ║"
echo "║  TrueDial DB: ${DB_TRUEDIAL}                             ║"
echo "║                                                          ║"
echo "║  Registering on Find My Interior → instant login on     ║"
echo "║  TrueDial. Both apps share the same user accounts.      ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
