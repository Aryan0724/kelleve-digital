import paramiko
import sys
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')
def r(cmd):
    i,o,e = client.exec_command(cmd)
    print(o.read().decode())
r('cat /var/www/find-my-interior/docker-compose.yml | grep -E "image|build"')
