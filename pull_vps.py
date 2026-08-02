import paramiko, sys, time
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=120)

print("=== Step 1: Git pull on VPS ===")
stdin, stdout, stderr = client.exec_command('cd /var/www/find-my-interior && git pull origin main 2>&1')
# Wait for it
channel = stdout.channel
while not channel.exit_status_ready():
    time.sleep(1)
print(stdout.read().decode('utf-8'))
print("STDERR:", stderr.read().decode('utf-8'))

print("=== Step 2: Verify api.ts is updated ===")
stdin, stdout, stderr = client.exec_command('head -6 /var/www/find-my-interior/findmyinterior-frontend/src/lib/api.ts')
print(stdout.read().decode('utf-8'))

client.close()
print("=== DONE ===" )
