import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

script = """
cd /var/www/find-my-interior/findmyinterior-frontend
find src -type f -exec sed -i 's|http://localhost:8000/api/v1|https://findmyinterior.com/api/v1|g' {} +
find src -type f -exec sed -i 's|http://localhost:8000/|https://findmyinterior.com/|g' {} +

cd /var/www/find-my-interior
docker compose up -d --build frontend
"""

stdin, stdout, stderr = client.exec_command(script)
print('RESULT:', stdout.read().decode('utf-8', errors='ignore'))
print('ERROR:', stderr.read().decode('utf-8', errors='ignore'))
