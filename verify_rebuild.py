import paramiko, sys, time
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)

# 1. Check container is running
stdin, stdout, stderr = client.exec_command('docker ps --filter name=fmi_frontend --format "{{.Names}}\t{{.Status}}\t{{.Ports}}"')
print("=== fmi_frontend status ===")
print(stdout.read().decode('utf-8'))

# 2. Verify the baked API URL in the actual compiled build
stdin, stdout, stderr = client.exec_command('docker exec fmi_frontend grep -r "findmyinterior.com/api/v1" /app/.next/server/ 2>/dev/null | head -3 | cut -c1-200')
print("=== BAKED API URL IN BUILD ===")
out = stdout.read().decode('utf-8')
print(out if out.strip() else "NOT FOUND - checking client bundle...")

# 3. Try grepping static chunks (client-side bundle)
stdin, stdout, stderr = client.exec_command('docker exec fmi_frontend grep -rl "findmyinterior.com/api/v1" /app/.next/static/ 2>/dev/null | head -3')
print("=== BAKED URL IN STATIC CHUNKS ===")
print(stdout.read().decode('utf-8'))

# 4. Test the API endpoint directly
stdin, stdout, stderr = client.exec_command('curl -s -o /dev/null -w "%{http_code}" -X POST https://findmyinterior.com/api/v1/auth/login -H "Content-Type: application/json" -H "Accept: application/json" -d \'{"email":"Aryantiwari@findmyinterior.com","password":"findmyinterior"}\'')
print("=== LOGIN API STATUS CODE ===")
print(stdout.read().decode('utf-8'))

# 5. Verify frontend is responding
stdin, stdout, stderr = client.exec_command('curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/login')
print("=== FRONTEND /login STATUS ===")
print(stdout.read().decode('utf-8'))

client.close()
