import paramiko
import sys
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')
stdin, stdout, stderr = client.exec_command('netstat -tulnp | grep -E ":80|:443"')
print(stdout.read().decode())
stdin, stdout, stderr = client.exec_command('cat /etc/nginx/sites-available/findmyinterior')
print(stdout.read().decode())
stdin, stdout, stderr = client.exec_command('ls -la /etc/nginx/sites-available/')
print(stdout.read().decode())
stdin, stdout, stderr = client.exec_command('docker ps')
print(stdout.read().decode())
client.close()
