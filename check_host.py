import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)

# Is there a HOST nginx running?
stdin, stdout, stderr = client.exec_command('systemctl status nginx 2>/dev/null | head -20')
out = stdout.read().decode('utf-8')
err = stderr.read().decode('utf-8')
print("=== HOST NGINX SERVICE ===")
print(out or err or "NO OUTPUT")

# What is listening on 443 and 80?
stdin, stdout, stderr = client.exec_command('ss -tlnp')
print("=== PORTS LISTENING ===")
print(stdout.read().decode('utf-8'))

client.close()
