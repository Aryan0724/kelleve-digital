import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)
stdin, stdout, stderr = client.exec_command('docker exec fmi_mysql mysql -u truedial -ptruedial123 truedial -e "SELECT id, email FROM users;"')
print(stdout.read().decode('utf-8'))
client.close()
