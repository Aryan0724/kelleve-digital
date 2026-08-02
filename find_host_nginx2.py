import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)

# Find where the host nginx config is - using proc to get pid 248425 config file
stdin, stdout, stderr = client.exec_command('ls -la /proc/248425/exe 2>/dev/null')
print("=== PID 248425 binary ===")
print(stdout.read().decode('utf-8'))

# Get the config file the process was started with
stdin, stdout, stderr = client.exec_command('cat /proc/248425/cmdline 2>/dev/null | tr "\\0" " "')
print("=== PID cmdline ===")
print(stdout.read().decode('utf-8'))

# find config file
stdin, stdout, stderr = client.exec_command('find / -maxdepth 10 -name "nginx.conf" -not -path "*/docker/*" -not -path "*/proc/*" 2>/dev/null | head -20')
print("=== NGINX CONF FILES ON HOST ===")
print(stdout.read().decode('utf-8'))

client.close()
