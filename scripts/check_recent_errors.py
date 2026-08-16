import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

print("=== RECENT 500 ERRORS ===")
# Grep the log for the most recent unhandled exceptions
_, stdout, _ = client.exec_command('docker exec fmi_backend grep -A 5 "Unhandled Exception" /var/www/html/storage/logs/laravel.log | tail -n 30')
print(stdout.read().decode())
