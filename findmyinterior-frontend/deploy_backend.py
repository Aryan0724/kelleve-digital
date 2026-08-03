import paramiko
import os

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.127.164.142', username='root', password='Truedial@1111')

sftp = ssh.open_sftp()

files = [
    (r'd:\find my interior\findmyinterior-backend\app\Http\Controllers\Api\V1\JobController.php', '/var/www/find-my-interior/findmyinterior-backend/app/Http/Controllers/Api/V1/JobController.php'),
    (r'd:\find my interior\findmyinterior-backend\app\Http\Controllers\Api\V1\RfqController.php', '/var/www/find-my-interior/findmyinterior-backend/app/Http/Controllers/Api/V1/RfqController.php'),
    (r'd:\find my interior\findmyinterior-backend\app\Http\Controllers\Api\V1\MilestoneController.php', '/var/www/find-my-interior/findmyinterior-backend/app/Http/Controllers/Api/V1/MilestoneController.php'),
    (r'd:\find my interior\findmyinterior-backend\database\migrations\2026_01_01_000030_alter_columns_to_longtext.php', '/var/www/find-my-interior/findmyinterior-backend/database/migrations/2026_01_01_000030_alter_columns_to_longtext.php')
]

for local_path, remote_path in files:
    print(f"Uploading {local_path} to {remote_path}...")
    sftp.put(local_path, remote_path)

sftp.close()

print("Rebuilding Docker backend container...")
stdin, stdout, stderr = ssh.exec_command('cd /var/www/find-my-interior && docker compose build backend && docker compose up -d backend')
print("STDOUT:", stdout.read().decode())
print("STDERR:", stderr.read().decode())

print("Running migrations...")
stdin, stdout, stderr = ssh.exec_command('docker exec fmi_backend php artisan migrate --force')
print("STDOUT:", stdout.read().decode())
print("STDERR:", stderr.read().decode())

ssh.close()
