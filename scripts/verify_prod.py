import paramiko
import time
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')
time.sleep(5) # wait for next.js to potentially crash
stdin, stdout, stderr = client.exec_command('docker ps --format "{{.Names}} {{.Status}}" | grep fmi_frontend')
print("Status:", stdout.read().decode('utf-8').strip())
stdin, stdout, stderr = client.exec_command('curl -s -o /dev/null -w "%{http_code}" https://findmyinterior.com/')
print("HTTP:", stdout.read().decode('utf-8').strip())
