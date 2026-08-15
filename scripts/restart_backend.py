import paramiko
import time

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

print("=== Restarting FMI Backend ===")
# Depending on the docker setup, we restart the backend container
_, stdout, stderr = client.exec_command('docker restart fmi_backend')
print(stdout.read().decode())
print(stderr.read().decode())
