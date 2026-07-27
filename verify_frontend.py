import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')
stdin, stdout, stderr = client.exec_command('docker exec fmi_backend curl -s http://fmi_frontend:3000/pages/dynamic-test-page | grep -o "Welcome to 2026!"')
print(stdout.read().decode('utf-8'))
client.close()
