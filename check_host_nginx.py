import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)

# Find host nginx config files
stdin, stdout, stderr = client.exec_command('ls /etc/nginx/sites-enabled/ 2>/dev/null && echo "---" && ls /etc/nginx/conf.d/ 2>/dev/null')
print("=== HOST NGINX CONFIG FILES ===")
print(stdout.read().decode('utf-8'))

stdin, stdout, stderr = client.exec_command('cat /etc/nginx/sites-enabled/* 2>/dev/null')
print("=== HOST NGINX SITES-ENABLED ===")
print(stdout.read().decode('utf-8'))

stdin, stdout, stderr = client.exec_command('ls /etc/nginx/conf.d/ 2>/dev/null && cat /etc/nginx/conf.d/*.conf 2>/dev/null')
print("=== HOST NGINX CONF.D ===")
print(stdout.read().decode('utf-8'))

client.close()
