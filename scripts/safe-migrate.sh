#!/bin/bash
# Safe migration script: backs up the database, runs migrations.
# If migrations fail, alerts but does not automatically rollback to prevent data loss without inspection.

set -e

BACKUP_DIR="/var/www/backups"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/pre_migrate_${DATE}.sql.gz"

echo "Creating pre-migration backup at ${BACKUP_FILE}..."
docker exec fmi_backend bash -c "mkdir -p ${BACKUP_DIR} && mysqldump -h db -u \${DB_USERNAME} -p\${DB_PASSWORD} \${DB_DATABASE} | gzip > ${BACKUP_FILE}"

echo "Running migrations..."
if ! docker exec fmi_backend php artisan migrate --force; then
    echo "ERROR: Migrations failed!"
    echo "To rollback, run: docker exec -it fmi_backend zcat ${BACKUP_FILE} | mysql -h db -u <username> -p<password> <database>"
    exit 1
fi

echo "Migrations completed successfully."
