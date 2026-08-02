import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)

print("=== HOST NGINX LIMITS ===")
stdin, stdout, stderr = client.exec_command('grep -i "client_max_body_size" /tmp/nginx.conf')
print(stdout.read().decode('utf-8').strip() or "Not set in /tmp/nginx.conf")

print("\n=== DOCKER NGINX LIMITS ===")
stdin, stdout, stderr = client.exec_command('docker exec fmi_nginx grep -i "client_max_body_size" /etc/nginx/conf.d/default.conf')
print(stdout.read().decode('utf-8').strip() or "Not set in docker nginx default.conf")
stdin, stdout, stderr = client.exec_command('docker exec fmi_nginx grep -ir "client_max_body_size" /etc/nginx/nginx.conf')
print(stdout.read().decode('utf-8').strip() or "Not set in docker nginx.conf")

print("\n=== PHP UPLOAD LIMITS ===")
stdin, stdout, stderr = client.exec_command('docker exec fmi_backend php -i | grep -i "upload_max_filesize\|post_max_size"')
print(stdout.read().decode('utf-8').strip())

client.close()
