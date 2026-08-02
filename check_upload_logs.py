import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)

print("=== LARAVEL LOGS ===")
stdin, stdout, stderr = client.exec_command('docker exec fmi_backend tail -n 50 /var/www/html/storage/logs/laravel.log')
print(stdout.read().decode('utf-8') or "No laravel logs")

print("=== NGINX BACKEND LOGS ===")
stdin, stdout, stderr = client.exec_command('docker logs --tail 50 fmi_nginx')
print(stdout.read().decode('utf-8') or "No nginx logs")

client.close()
