import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

# Tail the latest Laravel log
print("=== LATEST BACKEND LOGS ===")
_, stdout, _ = client.exec_command('docker exec fmi_backend tail -n 100 /var/www/html/storage/logs/laravel.log')
print(stdout.read().decode())
