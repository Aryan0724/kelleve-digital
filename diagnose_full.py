import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)

# Check what's actually running and what ports are open
stdin, stdout, stderr = client.exec_command('docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"')
print("=== DOCKER CONTAINERS ===")
print(stdout.read().decode('utf-8'))

# Check the nginx config that's actually serving findmyinterior.com
stdin, stdout, stderr = client.exec_command('docker exec fmi_nginx cat /etc/nginx/conf.d/findmyinterior.conf 2>/dev/null || docker exec fmi_nginx cat /etc/nginx/sites-enabled/findmyinterior.conf 2>/dev/null || echo "NOT FOUND"')
print("=== NGINX FMI CONF ===")
print(stdout.read().decode('utf-8'))

client.close()
