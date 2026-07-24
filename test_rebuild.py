import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

cmd = "cd /var/www/find-my-interior && git log -1"
stdin, stdout, stderr = client.exec_command(cmd)
print("GIT LOG:", stdout.read().decode())

cmd = "cd /var/www/find-my-interior && docker compose build --no-cache frontend"
stdin, stdout, stderr = client.exec_command(cmd)
print("BUILD STDOUT:", stdout.read().decode()[-1000:])
print("BUILD STDERR:", stderr.read().decode()[-1000:])

cmd = "cd /var/www/find-my-interior && docker compose up -d frontend"
stdin, stdout, stderr = client.exec_command(cmd)
