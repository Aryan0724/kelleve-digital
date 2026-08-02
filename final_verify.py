import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)

# Get the specific grep match context from the SSR files
stdin, stdout, stderr = client.exec_command(
    '''docker exec fmi_frontend bash -c 'grep -o ".[^"]*localhost:8000[^"]*." /app/.next/server/chunks/ssr/[root-of-the-server]__19d3g61._.js 2>/dev/null | head -3' '''
)
print("=== What contains localhost:8000 in build ===")
print(stdout.read().decode('utf-8') or "Empty")

# Check if findmyinterior.com/api URL is in client-side JS
stdin, stdout, stderr = client.exec_command(
    'docker exec fmi_frontend grep -rl "findmyinterior" /app/.next/ 2>/dev/null | grep -v ".map" | head -10'
)
print("=== Files mentioning findmyinterior ===")
print(stdout.read().decode('utf-8'))

# Make the actual login POST call from the VPS to confirm the API works
stdin, stdout, stderr = client.exec_command(
    '''curl -s -X POST https://findmyinterior.com/api/v1/auth/login '''
    '''-H "Content-Type: application/json" '''
    '''-H "Accept: application/json" '''
    '''-d '{"email":"Aryantiwari@findmyinterior.com","password":"findmyinterior"}\' '''
)
print("=== FULL LOGIN API RESPONSE ===")
print(stdout.read().decode('utf-8'))

client.close()
