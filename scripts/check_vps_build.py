import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

print("=== Check if Build is Running ===")
stdin, stdout, stderr = client.exec_command('ps aux | grep build | grep -v grep')
print(stdout.read().decode())

print("=== Check Git Log in find-my-interior ===")
stdin, stdout, stderr = client.exec_command('cd /var/www/find-my-interior && git log -1 --oneline')
print(stdout.read().decode())

print("=== Check fmi_frontend Container Uptime ===")
stdin, stdout, stderr = client.exec_command('docker ps --filter "name=fmi_frontend" --format "table {{.Names}}\t{{.Status}}\t{{.CreatedAt}}"')
print(stdout.read().decode())

client.close()
