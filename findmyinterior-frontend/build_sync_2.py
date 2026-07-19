import paramiko
import sys

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.127.164.142', username='root', password='Truedial@1111')

print("Uploading fixed MyBidsTab.tsx...")
sftp = ssh.open_sftp()
sftp.put(r'd:\find my interior\findmyinterior-frontend\src\components\dashboard\MyBidsTab.tsx', '/var/www/find-my-interior/findmyinterior-frontend/src/components/dashboard/MyBidsTab.tsx')
sftp.close()

# Wait for it to finish and restart
print("Building and restarting frontend...")
stdin, stdout, stderr = ssh.exec_command('cd /var/www/find-my-interior && docker compose build frontend && docker compose up -d frontend')

while not stdout.channel.exit_status_ready():
    if stdout.channel.recv_ready():
        sys.stdout.write(stdout.channel.recv(1024).decode('ascii', errors='ignore'))

ssh.close()
