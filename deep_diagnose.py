import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)

# Is there a HOST nginx running?
stdin, stdout, stderr = client.exec_command('systemctl status nginx 2>/dev/null || service nginx status 2>/dev/null || echo "NO HOST NGINX SERVICE"')
print("=== HOST NGINX SERVICE ===")
print(stdout.read().decode('utf-8'))

# What is listening on 443 and 80?
stdin, stdout, stderr = client.exec_command('ss -tlnp | grep -E ":80|:443|:3000|:8000"')
print("=== PORTS LISTENING ===")
print(stdout.read().decode('utf-8'))

# What does the actual running frontend container have?
stdin, stdout, stderr = client.exec_command('docker exec fmi_frontend cat /app/.env.production 2>/dev/null || docker exec fmi_frontend cat /app/.env 2>/dev/null || echo "NO ENV FOUND IN CONTAINER"')
print("=== FRONTEND ENV IN CONTAINER ===")
print(stdout.read().decode('utf-8'))

# What is the NEXT_PUBLIC_API_URL baked into the build?
stdin, stdout, stderr = client.exec_command('docker exec fmi_frontend grep -r "NEXT_PUBLIC_API_URL" /app/.next/server/ 2>/dev/null | head -5 || echo "NOT FOUND IN BUILD"')
print("=== BAKED API URL ===")
print(stdout.read().decode('utf-8'))

client.close()
