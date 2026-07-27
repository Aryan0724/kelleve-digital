import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

script = """
echo "NEXT_PUBLIC_API_URL=http://187.127.164.142:8000/api/v1" > /var/www/find-my-interior/truedial-frontend/.env
docker exec truedial_staging_frontend npm run build
docker restart truedial_staging_frontend
"""

stdin, stdout, stderr = client.exec_command(script)
print('RESULT:', stdout.read().decode('utf-8'))
print('ERROR:', stderr.read().decode('utf-8'))
