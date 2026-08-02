import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)

# What is the context of localhost:8000 in the build file?
stdin, stdout, stderr = client.exec_command(
    'docker exec fmi_frontend grep -o "..localhost:8000.{0,200}" /app/.next/server/chunks/ssr/[root-of-the-server]__19d3g61._.js 2>/dev/null | head -5'
)
print("=== localhost:8000 context ===")
print(stdout.read().decode('utf-8'))

# Check api.ts specifically - look for baseURL
stdin, stdout, stderr = client.exec_command(
    'docker exec fmi_frontend grep -r "baseURL" /app/.next/ 2>/dev/null | grep -v ".map" | head -5 | cut -c1-300'
)
print("=== baseURL in build ===")
print(stdout.read().decode('utf-8'))

# Look for the actual api.ts source used in build
stdin, stdout, stderr = client.exec_command(
    'docker exec fmi_frontend cat /app/src/lib/api.ts 2>/dev/null'
)
print("=== api.ts in container ===")
print(stdout.read().decode('utf-8'))

client.close()
