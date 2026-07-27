import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

# Rebuild the frontend inside the container
print("=== Rebuilding frontend inside container ===")
stdin, stdout, stderr = client.exec_command(
    'docker exec -e NEXT_PUBLIC_API_URL=https://findmyinterior.com/api/v1 fmi_frontend npm run build 2>&1'
)
out = stdout.read().decode('utf-8', errors='replace')
# Print last 1000 chars
print(out[-1000:])

# Restart
print("\n=== Restarting container ===")
stdin, stdout, stderr = client.exec_command('docker restart fmi_frontend')
print("Restart:", stdout.read().decode('utf-8', errors='replace'))

client.close()
print("\n=== DONE ===")
