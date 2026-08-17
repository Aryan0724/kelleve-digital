import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

# Check .env file content
_, stdout, _ = client.exec_command('docker exec fmi_backend cat /var/www/html/.env | head -30')
print("=== BACKEND .ENV ===")
print(stdout.read().decode())

# Try artisan migrate:status
_, stdout, _ = client.exec_command('docker exec fmi_backend php artisan migrate:status 2>&1 | head -30')
print("=== MIGRATION STATUS ===")
print(stdout.read().decode())

# Test basic DB connection
_, stdout, _ = client.exec_command('docker exec fmi_backend php artisan tinker --execute="echo DB::connection()->getDatabaseName();"')
print("=== DB NAME ===")
print(stdout.read().decode())

# Check container env
_, stdout, _ = client.exec_command('docker exec fmi_backend env | grep -E "DB_|APP_"')
print("=== CONTAINER ENV ===")
print(stdout.read().decode())
