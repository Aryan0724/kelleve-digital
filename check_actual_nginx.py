import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)

# Read the /tmp/nginx.conf - which is what's actually running
stdin, stdout, stderr = client.exec_command('cat /tmp/nginx.conf')
print("=== /tmp/nginx.conf ===")
print(stdout.read().decode('utf-8'))

# Also check what's in the project nginx.conf
stdin, stdout, stderr = client.exec_command('cat /var/www/find-my-interior/nginx.conf')
print("=== /var/www/find-my-interior/nginx.conf ===")
print(stdout.read().decode('utf-8'))

# what env file does the frontend container have?
stdin, stdout, stderr = client.exec_command('docker exec fmi_frontend env | grep -i api')
print("=== FRONTEND CONTAINER ENV (API) ===")
print(stdout.read().decode('utf-8'))

# What URL is baked into the frontend build?
stdin, stdout, stderr = client.exec_command('docker exec fmi_frontend grep -rl "NEXT_PUBLIC_API_URL\\|findmyinterior.com/api\\|localhost:8000" /app/.next/server/ 2>/dev/null | head -3')
files = stdout.read().decode('utf-8').strip().split('\n')
print("=== FILES CONTAINING API URL ===")
print('\n'.join(files))

# Find actual baked URL
stdin, stdout, stderr = client.exec_command('docker exec fmi_frontend grep -o "https\\?://[^\"]*api[^\"]*" /app/.next/server/app/login/page.js 2>/dev/null | head -5')
print("=== BAKED API URL IN LOGIN PAGE ===")
print(stdout.read().decode('utf-8'))

client.close()
