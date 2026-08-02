import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=60)

stdin, stdout, stderr = client.exec_command('curl -s https://findmyinterior.com | head -n 30')
print(stdout.read().decode('utf-8'))
client.close()
