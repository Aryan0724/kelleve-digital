import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

stdin, stdout, stderr = client.exec_command('docker exec fmi_frontend grep -rn "http://localhost:8000" /app/.next/')
print('GREP:', stdout.read().decode('utf-8', errors='ignore'))
