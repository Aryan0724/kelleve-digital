#!/bin/bash
# Simple uptime monitoring script
# Ping the /api/health endpoint and log the result
# Run via cron on the host machine every minute

URL="https://findmyinterior.com/api/v1/health"
LOG_FILE="/var/log/fmi_uptime.log"
DATE=$(date +"%Y-%m-%d %H:%M:%S")

STATUS=$(curl -o /dev/null -s -w "%{http_code}\n" $URL)

if [ "$STATUS" -eq 200 ]; then
    echo "[$DATE] HEALTHY - Status $STATUS" >> $LOG_FILE
else
    echo "[$DATE] CRITICAL - Status $STATUS" >> $LOG_FILE
    # Optionally, we can restart the backend container if it's down
    # docker compose -f /var/www/find-my-interior/docker-compose.yml restart backend
fi
