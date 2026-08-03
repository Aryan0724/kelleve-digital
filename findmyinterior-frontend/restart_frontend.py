import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.127.164.142', username='root', password='Truedial@1111')

print("Restarting frontend...")
stdin, stdout, stderr = ssh.exec_command('cd /var/www/find-my-interior && docker compose up -d frontend')

stdout_bytes = stdout.read()
print(stdout_bytes.decode('ascii', errors='ignore'))

ssh.close()
