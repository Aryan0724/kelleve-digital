import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)
stdin, stdout, stderr = client.exec_command('curl -s -X POST https://findmyinterior.com/api/v1/auth/login -H "Accept: application/json" -H "Content-Type: application/json" -d \'{"email":"Aryantiwari@findmyinterior.com","password":"findmyinterior"}\'')
print(stdout.read().decode('utf-8'))
client.close()
