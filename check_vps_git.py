import paramiko, sys, time
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=60)

# Check what the current api.ts says on VPS
stdin, stdout, stderr = client.exec_command('cat /var/www/find-my-interior/findmyinterior-frontend/src/lib/api.ts')
print("=== CURRENT api.ts ON VPS ===")
print(stdout.read().decode('utf-8'))

# Check the current git log on VPS
stdin, stdout, stderr = client.exec_command('cd /var/www/find-my-interior && git log --oneline -5')
print("=== GIT LOG ON VPS ===")
print(stdout.read().decode('utf-8'))

# Check what the VPS git remote points to
stdin, stdout, stderr = client.exec_command('cd /var/www/find-my-interior && git remote -v')
print("=== GIT REMOTE ON VPS ===")
print(stdout.read().decode('utf-8'))

client.close()
