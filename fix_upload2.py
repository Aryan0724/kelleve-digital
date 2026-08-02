import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=60)

commands = [
    # Restart backend container to apply the changes made previously
    "docker restart fmi_backend",
    
    # Let's check what containers exist for Nginx
    "docker ps | grep nginx"
]

for cmd in commands:
    print(f"Running: {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd)
    stdout.channel.recv_exit_status()
    print(stdout.read().decode('utf-8'))
    err = stderr.read().decode('utf-8')
    if err:
        print("ERR:", err)

persist_cmds = [
    "sed -i '/server_name localhost;/a \\    client_max_body_size 50M;' /var/www/find-my-interior/findmyinterior-backend/docker/nginx.conf",
    "echo -e 'upload_max_filesize = 50M\\npost_max_size = 50M\\nmemory_limit = 256M' > /var/www/find-my-interior/findmyinterior-backend/docker/custom.ini",
    "sed -i '/Configure PHP-FPM/i COPY docker/custom.ini \\/usr\\/local\\/etc\\/php\\/conf.d\\/custom.ini\\n' /var/www/find-my-interior/findmyinterior-backend/Dockerfile"
]
for cmd in persist_cmds:
    stdin, stdout, stderr = client.exec_command(cmd)
    stdout.channel.recv_exit_status()

# 3. Check what was applied
stdin, stdout, stderr = client.exec_command('docker exec fmi_backend php -i | grep -i "upload_max_filesize\|post_max_size"')
print("=== NEW PHP LIMITS ===")
print(stdout.read().decode('utf-8'))

stdin, stdout, stderr = client.exec_command('docker exec fmi_backend grep -i "client_max_body_size" /etc/nginx/http.d/default.conf')
print("=== NEW NGINX LIMITS ===")
print(stdout.read().decode('utf-8'))

client.close()
