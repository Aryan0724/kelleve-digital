import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)

# Update docker-compose.yml to use correct API URL
stdin, stdout, stderr = client.exec_command(
    "sed -i 's|NEXT_PUBLIC_API_URL: http://localhost:8000/api/v1|NEXT_PUBLIC_API_URL: https://findmyinterior.com/api/v1|g' /var/www/find-my-interior/docker-compose.yml"
)
print("sed exit:", stdout.channel.recv_exit_status())

# Verify
stdin, stdout, stderr = client.exec_command('grep -n "NEXT_PUBLIC_API_URL" /var/www/find-my-interior/docker-compose.yml')
print("Updated docker-compose.yml line:", stdout.read().decode('utf-8'))

client.close()
