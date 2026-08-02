import paramiko, sys, time
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=120)

print("=== Step 1: Stop fmi_frontend and remove its volumes ===")
stdin, stdout, stderr = client.exec_command(
    'cd /var/www/find-my-interior && docker compose stop frontend 2>&1'
)
ch = stdout.channel
while not ch.exit_status_ready():
    time.sleep(1)
print(stdout.read().decode('utf-8'))

# Remove the container and its anonymous volumes
stdin, stdout, stderr = client.exec_command(
    'cd /var/www/find-my-interior && docker compose rm -f -v frontend 2>&1'
)
ch = stdout.channel
while not ch.exit_status_ready():
    time.sleep(1)
print("rm output:", stdout.read().decode('utf-8'))

print("=== Step 2: Check the source api.ts on VPS ===")
stdin, stdout, stderr = client.exec_command('cat /var/www/find-my-interior/findmyinterior-frontend/src/lib/api.ts | head -6')
print(stdout.read().decode('utf-8'))

print("=== Step 3: Check the .next/static exists on VPS filesystem ===")
stdin, stdout, stderr = client.exec_command('ls /var/www/find-my-interior/findmyinterior-frontend/.next/static/chunks/ 2>/dev/null | head -5')
out = stdout.read().decode('utf-8')
print(out if out.strip() else "No .next directory in source - good!")

print("=== Step 4: Remove .next from source filesystem if it exists ===")
stdin, stdout, stderr = client.exec_command('rm -rf /var/www/find-my-interior/findmyinterior-frontend/.next 2>&1 && echo "Removed"')
ch = stdout.channel
while not ch.exit_status_ready():
    time.sleep(1)
print(stdout.read().decode('utf-8'))

print("=== Step 5: Also remove node_modules/.cache ===")
stdin, stdout, stderr = client.exec_command('rm -rf /var/www/find-my-interior/findmyinterior-frontend/node_modules/.cache 2>&1 && echo "Cache removed"')
ch = stdout.channel
while not ch.exit_status_ready():
    time.sleep(1)
print(stdout.read().decode('utf-8'))

print("=== Step 6: Prune anonymous volumes ===")
stdin, stdout, stderr = client.exec_command('docker volume prune -f 2>&1')
ch = stdout.channel
while not ch.exit_status_ready():
    time.sleep(1)
print(stdout.read().decode('utf-8'))

client.close()
print("=== Done cleaning ===")
