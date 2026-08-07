#!/bin/bash
# Backup script for database and uploaded files

BACKUP_DIR="/var/www/backups"
TIMESTAMP=$(date +"%F_%H-%M-%S")
DB_BACKUP_FILE="$BACKUP_DIR/db_$TIMESTAMP.sql.gz"
STORAGE_BACKUP_FILE="$BACKUP_DIR/storage_$TIMESTAMP.tar.gz"
DAYS_TO_KEEP=7

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

# Backup Database
echo "Starting database backup to $DB_BACKUP_FILE"
mysqldump -h db -u fmi_user -psecret findmyinterior | gzip > "$DB_BACKUP_FILE"

# Backup Storage
echo "Starting storage backup to $STORAGE_BACKUP_FILE"
tar -czf "$STORAGE_BACKUP_FILE" -C /var/www/html/storage/app/public .

# Cleanup old backups
echo "Cleaning up backups older than $DAYS_TO_KEEP days"
find "$BACKUP_DIR" -type f -mtime +$DAYS_TO_KEEP -name "*.gz" -exec rm {} \;

echo "Backup completed successfully!"
