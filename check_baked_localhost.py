import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)
stdin, stdout, stderr = client.exec_command('docker exec fmi_frontend grep -r "http://localhost:8000" /app/.next/static 2>/dev/null | head -n 5')
print("Static files containing localhost:8000:")
print(stdout.read().decode('utf-8'))
client.close()
