import paramiko
import sys

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.127.164.142', username='root', password='Truedial@1111')

print("Checking if build is still running...")
stdin, stdout, stderr = ssh.exec_command('ps aux | grep "docker compose build"')
print(stdout.read().decode('ascii', errors='ignore'))

# Wait for it to finish and restart
stdin, stdout, stderr = ssh.exec_command('cd /var/www/find-my-interior && docker compose build frontend && docker compose up -d frontend')

print("Waiting for build and restart...")
# This will block until done
while not stdout.channel.exit_status_ready():
    if stdout.channel.recv_ready():
        sys.stdout.write(stdout.channel.recv(1024).decode('ascii', errors='ignore'))

ssh.close()
