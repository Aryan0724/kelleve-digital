import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

print("=== Check truedial_staging_frontend Container Uptime ===")
stdin, stdout, stderr = client.exec_command('docker ps --filter "name=truedial_staging_frontend" --format "table {{.Names}}\t{{.Status}}\t{{.CreatedAt}}"')
print(stdout.read().decode())

print("=== Check Webhook/Auto-deploy Scripts ===")
stdin, stdout, stderr = client.exec_command('ls -l /var/www/find-my-interior/scripts/')
print(stdout.read().decode())

client.close()
