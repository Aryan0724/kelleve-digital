import paramiko
import json

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

# 1. Test backend login API directly with curl
print("=== TEST 1: Backend API Login ===")
stdin, stdout, stderr = client.exec_command(
    'curl -s -w "\\nHTTP_CODE:%{http_code}" -X POST http://localhost:8000/api/v1/auth/login '
    '-H "Content-Type: application/json" '
    '-H "Accept: application/json" '
    '-d \'{"email":"Aryantiwari@findmyinterior.com","password":"Admin@123!"}\''
)
result = stdout.read().decode('utf-8', errors='ignore')
print(result)

# 2. Check what .next build hash is being served (inside the container vs on disk)
print("\n=== TEST 2: Build ID inside container ===")
stdin, stdout, stderr = client.exec_command(
    'docker exec fmi_frontend cat /app/.next/BUILD_ID 2>/dev/null || echo "NO BUILD_ID"'
)
print("Container BUILD_ID:", stdout.read().decode('utf-8', errors='ignore').strip())

# 3. Check the .next volume type
print("\n=== TEST 3: Docker volume mounts ===")
stdin, stdout, stderr = client.exec_command(
    'docker inspect fmi_frontend --format \'{{json .Mounts}}\' | python3 -m json.tool 2>/dev/null || docker inspect fmi_frontend --format \'{{json .Mounts}}\''
)
print("Mounts:", stdout.read().decode('utf-8', errors='ignore'))

# 4. Check if the .next JS chunks inside the container still have localhost
print("\n=== TEST 4: Grep localhost in container .next ===")
stdin, stdout, stderr = client.exec_command(
    'docker exec fmi_frontend grep -rl "http://localhost:8000" /app/.next/static/chunks/ | head -5'
)
print("Files with localhost:", stdout.read().decode('utf-8', errors='ignore'))

# 5. Check SSL / nginx setup
print("\n=== TEST 5: Nginx/SSL config ===")
stdin, stdout, stderr = client.exec_command(
    'nginx -T 2>/dev/null | grep -A5 "server_name.*findmyinterior" || echo "No system nginx"'
)
print("System nginx:", stdout.read().decode('utf-8', errors='ignore'))

stdin, stdout, stderr = client.exec_command(
    'ls -la /etc/nginx/sites-enabled/ 2>/dev/null || echo "No sites-enabled"'
)
print("Sites:", stdout.read().decode('utf-8', errors='ignore'))

# 6. Check what's actually listening on port 443 (HTTPS)
print("\n=== TEST 6: Port 443 listener ===")
stdin, stdout, stderr = client.exec_command(
    'ss -tlnp | grep -E ":443|:80|:3000|:8000"'
)
print("Listeners:", stdout.read().decode('utf-8', errors='ignore'))

# 7. Test HTTPS backend endpoint 
print("\n=== TEST 7: HTTPS API test ===")
stdin, stdout, stderr = client.exec_command(
    'curl -s -w "\\nHTTP_CODE:%{http_code}" https://findmyinterior.com/api/v1/health 2>&1'
)
print("HTTPS health:", stdout.read().decode('utf-8', errors='ignore'))

client.close()
