import paramiko

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('187.127.164.142', username='root', password='Truedial@1111')

print("Rebuilding Docker container...")
stdin, stdout, stderr = ssh.exec_command('cd /var/www/find-my-interior && docker compose build frontend && docker compose up -d frontend')
print("STDOUT:", stdout.read().decode())
print("STDERR:", stderr.read().decode())

ssh.close()
