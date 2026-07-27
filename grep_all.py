import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

stdin, stdout, stderr = client.exec_command('cd /var/www/find-my-interior && grep -rn "http://localhost:8000" findmyinterior-frontend/')
print('GREP HOST:', stdout.read().decode('utf-8', errors='ignore'))
