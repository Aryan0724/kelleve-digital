import paramiko
import time

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

print("=== Checking VPS git log ===")
_, stdout, stderr = client.exec_command('cd /var/www/find-my-interior && git pull origin main && git log -n 3 --oneline 2>&1')
print(stdout.read().decode())
