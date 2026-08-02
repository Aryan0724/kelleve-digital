import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)

# Find where the host nginx config is
stdin, stdout, stderr = client.exec_command('nginx -T 2>/dev/null | head -100')
print("=== HOST NGINX -T (first 100 lines) ===")
print(stdout.read().decode('utf-8'))
print("STDERR:", stderr.read().decode('utf-8'))

client.close()
