import paramiko
import sys
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')
def r(cmd):
    i,o,e = client.exec_command(cmd)
    with open('laravel_log.txt', 'w', encoding='utf-8') as f:
        f.write(o.read().decode())
        f.write(e.read().decode())
r('docker exec fmi_backend tail -n 100 storage/logs/laravel.log')
