import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

script = """
sed -i 's|NEXT_PUBLIC_API_URL: http://localhost:8000/api/v1|NEXT_PUBLIC_API_URL: https://findmyinterior.com/api/v1|g' /var/www/find-my-interior/docker-compose.yml
cd /var/www/find-my-interior
docker compose up -d
"""

stdin, stdout, stderr = client.exec_command(script)
print('RESULT:', stdout.read().decode('utf-8', errors='ignore'))
print('ERROR:', stderr.read().decode('utf-8', errors='ignore'))
