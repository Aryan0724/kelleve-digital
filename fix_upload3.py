import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=60)

commands = [
    # 1. Fix PHP custom.ini inside backend container
    "docker exec fmi_backend sh -c 'echo \"upload_max_filesize = 50M\" > /usr/local/etc/php/conf.d/custom.ini'",
    "docker exec fmi_backend sh -c 'echo \"post_max_size = 50M\" >> /usr/local/etc/php/conf.d/custom.ini'",
    "docker exec fmi_backend sh -c 'echo \"memory_limit = 256M\" >> /usr/local/etc/php/conf.d/custom.ini'",
    
    # 2. Fix PHP custom.ini in source code
    "echo \"upload_max_filesize = 50M\" > /var/www/find-my-interior/findmyinterior-backend/docker/custom.ini",
    "echo \"post_max_size = 50M\" >> /var/www/find-my-interior/findmyinterior-backend/docker/custom.ini",
    "echo \"memory_limit = 256M\" >> /var/www/find-my-interior/findmyinterior-backend/docker/custom.ini",
    
    # 3. Add client_max_body_size to fmi_nginx container
    "docker exec fmi_nginx sed -i '/listen       80;/a \\    client_max_body_size 50M;' /etc/nginx/conf.d/default.conf",
    
    # 4. Restart containers
    "docker restart fmi_backend",
    "docker restart fmi_nginx"
]

for cmd in commands:
    print(f"Running: {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd)
    stdout.channel.recv_exit_status()
    err = stderr.read().decode('utf-8')
    if err:
        print("ERR:", err)

# 5. Check what was applied
stdin, stdout, stderr = client.exec_command('docker exec fmi_backend php -i | grep -i "upload_max_filesize\|post_max_size"')
print("=== NEW PHP LIMITS ===")
print(stdout.read().decode('utf-8'))

stdin, stdout, stderr = client.exec_command('docker exec fmi_nginx grep -i "client_max_body_size" /etc/nginx/conf.d/default.conf')
print("=== NEW NGINX HOST LIMITS ===")
print(stdout.read().decode('utf-8'))

client.close()
