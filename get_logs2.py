import paramiko, sys
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)
stdin, stdout, stderr = client.exec_command('docker exec fmi_backend grep -A 5 "local.ERROR" storage/logs/laravel.log | tail -n 20')
print(stdout.read().decode())
client.close()
