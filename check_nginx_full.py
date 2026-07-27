import paramiko
import sys
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')
stdin, stdout, stderr = client.exec_command('docker exec fmi_nginx ls -la /etc/nginx/conf.d/')
print("ls conf.d:")
print(stdout.read().decode())
stdin, stdout, stderr = client.exec_command('docker exec fmi_nginx cat /etc/nginx/nginx.conf')
print("\nnginx.conf:")
print(stdout.read().decode())
client.close()
