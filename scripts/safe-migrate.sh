#!/bin/bash
# Safe migration script for Multi-Database Architecture

set -e

FORCE_PROD=$1

# Verify safety via PHP script
echo "Verifying environment and connections..."
# Note: we run this via docker or locally depending on context, for now we run directly
if [ -f "findmyinterior-backend/verify_db_wipe_safe.php" ]; then
    cd findmyinterior-backend
    php verify_db_wipe_safe.php
    cd ..
elif [ -f "verify_db_wipe_safe.php" ]; then
    php verify_db_wipe_safe.php
else
    echo "ERROR: Safety check script missing!"
    exit 1
fi

echo "Safety check passed. Executing segregated migrations..."
# For local use:
if [ -d "findmyinterior-backend" ]; then
    cd findmyinterior-backend
fi

echo "Running TrueDial Migrations..."
php artisan migrate --database=truedial_mysql --path=database/migrations/truedial --force

echo "Running FMI Migrations..."
php artisan migrate --database=fmi_mysql --path=database/migrations/fmi --force

echo "Migrations completed successfully."
