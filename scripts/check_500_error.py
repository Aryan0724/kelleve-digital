import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

print("=== LATEST BACKEND LOGS ===")
# Tail the last 100 lines of the Laravel log to catch the 500 error stack trace
_, stdout, _ = client.exec_command('docker exec fmi_backend tail -n 100 /var/www/html/storage/logs/laravel.log')
print(stdout.read().decode())
