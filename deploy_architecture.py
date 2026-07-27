import paramiko
import sys
import os

files_to_sync = [
    r"findmyinterior-backend\database\migrations\2026_07_26_000002_add_smart_fields_to_advertisements_table.php",
    r"findmyinterior-backend\database\migrations\2026_07_26_000003_add_dynamic_blocks_to_seo_pages_table.php",
    r"findmyinterior-backend\app\Models\Advertisement.php",
    r"findmyinterior-backend\app\Models\SeoPage.php",
    r"findmyinterior-backend\app\Http\Controllers\Api\V1\Admin\AdvertisementController.php",
    r"findmyinterior-backend\app\Http\Controllers\Api\V1\Public\AdvertisementController.php",
    r"findmyinterior-backend\app\Http\Controllers\Api\V1\UserAdvertisementController.php",
    r"findmyinterior-backend\app\Http\Controllers\Api\V1\Admin\SeoPageController.php",
    r"findmyinterior-backend\app\Http\Controllers\Api\V1\Public\SeoPageController.php",
    r"findmyinterior-backend\app\Services\ShortcodeService.php",
    r"findmyinterior-backend\routes\api.php",
    r"findmyinterior-frontend\src\components\ads\AdSlot.tsx",
    r"findmyinterior-frontend\src\app\pages\[slug]\page.tsx"
]

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
print("Connecting to VPS...")
client.connect('187.127.164.142', username='root', password='Truedial@1111')

sftp = client.open_sftp()
base_local = r"d:\find my interior"
base_remote = "/var/www/find-my-interior"

print("Uploading files...")
for file in files_to_sync:
    local_path = os.path.join(base_local, file)
    remote_path = f"{base_remote}/{file.replace(chr(92), '/')}"
    
    # ensure remote dir exists
    remote_dir = os.path.dirname(remote_path)
    stdin, stdout, stderr = client.exec_command(f'mkdir -p "{remote_dir}"')
    stdout.read()
    
    if os.path.exists(local_path):
        print(f"Uploading {local_path} to {remote_path}")
        sftp.put(local_path, remote_path)
    else:
        print(f"Warning: {local_path} not found locally.")

sftp.close()

print("Running migrations...")
commands = [
    "cd /var/www/find-my-interior/findmyinterior-backend && docker exec fmi_backend php artisan migrate --force",
    "cd /var/www/find-my-interior/findmyinterior-frontend && npm run build && pm2 restart fmi-frontend"
]

for cmd in commands:
    print(f"Executing: {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd)
    exit_status = stdout.channel.recv_exit_status()
    print("Output:", stdout.read().decode())
    print("Errors:", stderr.read().decode())

print("Deployment complete.")
client.close()
