#!/bin/bash
# Records deployment status and writes to a file accessible by the API

STATUS_FILE="/var/www/find-my-interior/findmyinterior-backend/storage/app/public/deploy_status.json"
DATE=$(date +"%Y-%m-%dT%H:%M:%SZ")

cat <<EOF > $STATUS_FILE
{
    "last_deploy": "$DATE",
    "status": "success",
    "version": "$(git rev-parse --short HEAD)"
}
EOF

echo "Post-deploy status updated."
