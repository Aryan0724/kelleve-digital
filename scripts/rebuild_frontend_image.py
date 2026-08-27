import paramiko
import sys
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')
def r(cmd):
    print(f'> {cmd}')
    i,o,e = client.exec_command(cmd)
    for line in iter(o.readline, ""):
        sys.stdout.write(line)
    for line in iter(e.readline, ""):
        sys.stderr.write(line)

r('cd /var/www/find-my-interior && docker compose build --no-cache frontend && docker compose up -d frontend')
