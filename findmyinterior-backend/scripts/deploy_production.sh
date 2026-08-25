#!/bin/bash
# FindMyInterior Production Deployment & Stability Script

echo "Starting Production Deployment..."

# 1. Update Code
echo "Pulling latest changes from main branch..."
git pull origin main

# 2. Switch Queue Driver to Database
if grep -q "QUEUE_CONNECTION=sync" .env; then
    echo "Updating QUEUE_CONNECTION from sync to database in .env..."
    sed -i 's/QUEUE_CONNECTION=sync/QUEUE_CONNECTION=database/g' .env
    echo "Make sure to run a queue worker! (e.g. php artisan queue:work --daemon)"
fi

# 3. Optimize and Clear Caches
echo "Clearing Laravel caches..."
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 4. Restart Queues
echo "Restarting queue workers to pick up new code..."
php artisan queue:restart

# 5. Run Database Migrations
echo "Running database migrations..."
php artisan migrate --force

# 6. Run Production Seeder
echo "Seeding essential reference data (Categories, etc)..."
php artisan db:seed --class=ProductionSeeder --force

echo "Deployment completed successfully!"
