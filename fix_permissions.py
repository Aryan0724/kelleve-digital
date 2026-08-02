import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)
stdin, stdout, stderr = client.exec_command('docker exec fmi_backend chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache && docker exec fmi_backend chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache')
print(stdout.read().decode('utf-8'))
print(stderr.read().decode('utf-8'))
client.close()
