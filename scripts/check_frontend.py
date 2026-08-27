import paramiko
import sys
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')
def r(cmd):
    i,o,e = client.exec_command(cmd)
    print(o.read().decode())
r('docker ps | grep fmi_')
r('docker logs fmi_frontend > /tmp/frontend.log 2>&1')
r('tail -n 10 /tmp/frontend.log | tr -cd "\\11\\12\\15\\40-\\176"')
