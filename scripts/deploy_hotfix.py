import paramiko
import time

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

print("=== Pulling latest code ===")
_, stdout, stderr = client.exec_command('cd /var/www/find-my-interior && git pull origin main 2>&1')
print(stdout.read().decode())
