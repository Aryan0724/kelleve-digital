import paramiko
import time

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.127.164.142', username='root', password='Truedial@1111')

# Run in background on server and pipe to log
stdin, stdout, stderr = ssh.exec_command('cd /var/www/find-my-interior && nohup docker compose build frontend > /var/www/find-my-interior/frontend_build.log 2>&1 &')
time.sleep(2)

print("Started build in background")
ssh.close()
