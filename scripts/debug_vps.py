import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

# Check users
_, stdout, _ = client.exec_command(
    'docker exec fmi_backend php artisan tinker --execute="echo App\\\\Models\\\\User::all([\'id\',\'name\',\'email\',\'professional_type\'])->toJson();"'
)
print("=== USERS ===")
print(stdout.read().decode())

# Check if there's a findmyinterior-app container
_, stdout, _ = client.exec_command('docker exec fmi_backend curl -s http://localhost/api/v1/truedial/vendor/my-business -H "Accept: application/json" 2>&1')
print("\n=== MY-BUSINESS without token (should return 401) ===")
print(stdout.read().decode())

# Check nginx config for truedial
_, stdout, _ = client.exec_command('cat /etc/nginx/conf.d/*.conf 2>/dev/null || docker exec fmi_nginx cat /etc/nginx/conf.d/*.conf 2>/dev/null || echo "no nginx conf found"')
print("\n=== NGINX CONFIG ===")
print(stdout.read().decode())
