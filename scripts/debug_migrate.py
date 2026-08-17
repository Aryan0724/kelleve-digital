import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

# Complete migration status
_, stdout, _ = client.exec_command('docker exec fmi_backend php artisan migrate:status 2>&1')
print("=== FULL MIGRATION STATUS ===")
print(stdout.read().decode())
