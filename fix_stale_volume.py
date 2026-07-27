import paramiko
import sys
import io

# Force UTF-8 output
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

# Step 1: Run npm run build INSIDE the container to overwrite the stale .next volume
print("=== Step 1: Rebuilding Next.js inside the container ===")
stdin, stdout, stderr = client.exec_command(
    'docker exec -e NEXT_PUBLIC_API_URL=https://findmyinterior.com/api/v1 fmi_frontend npm run build 2>&1'
)
out = stdout.read().decode('utf-8', errors='replace')
print(out[-2000:])  # last 2000 chars to see result

# Step 2: Restart the container to pick up the new build
print("\n=== Step 2: Restarting container ===")
stdin, stdout, stderr = client.exec_command('docker restart fmi_frontend')
print("Restart:", stdout.read().decode('utf-8', errors='replace'))
err = stderr.read().decode('utf-8', errors='replace')
if err:
    print("Restart err:", err)

# Step 3: Wait a moment then verify
import time
time.sleep(5)

# Step 4: Verify localhost is gone from the new .next build
print("\n=== Step 3: Verifying localhost removed from .next ===")
stdin, stdout, stderr = client.exec_command(
    'docker exec fmi_frontend grep -rl "http://localhost:8000" /app/.next/static/chunks/ 2>/dev/null | wc -l'
)
count = stdout.read().decode('utf-8', errors='replace').strip()
print(f"Files with localhost in .next: {count}")

if count == "0":
    print("SUCCESS: No localhost references in the build!")
else:
    print("STILL HAS LOCALHOST - investigating...")
    stdin, stdout, stderr = client.exec_command(
        'docker exec fmi_frontend grep -rl "http://localhost:8000" /app/.next/static/chunks/'
    )
    print("Files:", stdout.read().decode('utf-8', errors='replace'))

# Step 5: Test login API again to confirm backend still works
print("\n=== Step 4: Confirming backend login works ===")
stdin, stdout, stderr = client.exec_command(
    'curl -s -w "\\nHTTP_CODE:%{http_code}" -X POST http://localhost:8000/api/v1/auth/login '
    '-H "Content-Type: application/json" '
    '-H "Accept: application/json" '
    '-d \'{"email":"Aryantiwari@findmyinterior.com","password":"Admin@123!"}\''
)
print(stdout.read().decode('utf-8', errors='replace'))

client.close()
print("\n=== DONE ===")
