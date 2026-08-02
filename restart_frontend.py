import paramiko, sys
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

print("Building frontend...")
stdin, stdout, stderr = client.exec_command('docker exec fmi_frontend npm run build')
# Read to block until finished, but don't print
stdout.read()
stderr.read()
print("Build finished.")

print("Restarting frontend...")
stdin, stdout, stderr = client.exec_command('docker restart fmi_frontend')
print(stdout.read().decode('utf-8', errors='ignore'))
print("Restart finished.")

client.close()
