import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)
stdin, stdout, stderr = client.exec_command('docker inspect fmi_frontend | grep -A 10 "Mounts"')
print("Mounts for fmi_frontend:")
print(stdout.read().decode('utf-8'))
client.close()
