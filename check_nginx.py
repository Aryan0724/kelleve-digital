import paramiko
import sys
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')
stdin, stdout, stderr = client.exec_command('docker exec fmi_nginx cat /etc/nginx/conf.d/default.conf')
print("nginx default.conf:")
print(stdout.read().decode())
client.close()
