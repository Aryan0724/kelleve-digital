import paramiko
import os

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.127.164.142', username='root', password='Truedial@1111')

sftp = ssh.open_sftp()

files = [
    (r'd:\find my interior\findmyinterior-frontend\src\components\dashboard\UnlockedLeadsTab.tsx', '/var/www/find-my-interior/findmyinterior-frontend/src/components/dashboard/UnlockedLeadsTab.tsx'),
    (r'd:\find my interior\findmyinterior-frontend\src\app\requirements\[id]\page.tsx', '/var/www/find-my-interior/findmyinterior-frontend/src/app/requirements/[id]/page.tsx'),
    (r'd:\find my interior\findmyinterior-frontend\src\components\dashboard\MyBidsTab.tsx', '/var/www/find-my-interior/findmyinterior-frontend/src/components/dashboard/MyBidsTab.tsx')
]

for local_path, remote_path in files:
    print(f"Uploading {local_path} to {remote_path}...")
    sftp.put(local_path, remote_path)

sftp.close()

print("Rebuilding Docker container...")
stdin, stdout, stderr = ssh.exec_command('cd /var/www/find-my-interior && docker-compose build frontend && docker-compose up -d frontend')
print("STDOUT:", stdout.read().decode())
print("STDERR:", stderr.read().decode())

ssh.close()
