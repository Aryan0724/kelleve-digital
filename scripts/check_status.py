import paramiko
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')
stdin, stdout, stderr = client.exec_command('docker restart fmi_frontend && docker ps --format "{{.Names}} {{.Status}}" | grep fmi_frontend')
print(stdout.read().decode('utf-8', errors='replace'))
