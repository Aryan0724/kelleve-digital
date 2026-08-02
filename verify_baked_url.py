import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)

# Grep specifically for the URL string in all build files
stdin, stdout, stderr = client.exec_command(
    'docker exec fmi_frontend grep -r "findmyinterior.com/api" /app/.next/ 2>/dev/null | grep -v ".map" | head -5 | cut -c1-200'
)
print("=== API URL in build (non-map files) ===")
print(stdout.read().decode('utf-8'))

# What URL is in the main chunk?
stdin, stdout, stderr = client.exec_command(
    'docker exec fmi_frontend grep -ro "https://findmyinterior[^\"\'\\\\]*" /app/.next/ 2>/dev/null | grep -v ".map" | head -10'
)
print("=== All findmyinterior.com URLs in build ===")
print(stdout.read().decode('utf-8'))

# Check if localhost:8000 still exists anywhere in non-map build files
stdin, stdout, stderr = client.exec_command(
    'docker exec fmi_frontend grep -rl "localhost:8000" /app/.next/ 2>/dev/null | grep -v ".map" | head -5'
)
print("=== localhost:8000 in build (non-map) ===")
out = stdout.read().decode('utf-8')
print(out.strip() if out.strip() else "NONE - good!")

client.close()
