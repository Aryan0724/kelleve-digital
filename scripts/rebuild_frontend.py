import paramiko
import sys

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

def r(cmd):
    print(f'> {cmd}')
    i,o,e = client.exec_command(cmd)
    sys.stdout.write(o.read().decode('utf-8', errors='replace'))
    sys.stderr.write(e.read().decode('utf-8', errors='replace'))

r('docker exec fmi_frontend sh -c "CI=1 npm run build > build.log 2>&1"')
r('docker restart fmi_frontend')
