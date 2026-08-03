import paramiko
import sys
import time

hostname = '187.127.164.142'
username = 'root'
password = 'Truedial@1111'

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
try:
    client.connect(hostname, username=username, password=password, timeout=10)
except Exception as e:
    print(f"Connection failed: {e}")
    sys.exit(1)

def run(cmd):
    print(f"> {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    status = stdout.channel.recv_exit_status()
    if out: sys.stdout.buffer.write(out.encode('utf-8', 'replace') + b'\n')
    if err: sys.stderr.buffer.write(err.encode('utf-8', 'replace') + b'\n')
    if status != 0:
        print(f"Command failed with exit code {status}")
    return status, out, err

# Pull latest code
print("Pulling latest code in /var/www/find-my-interior...")
run("cd /var/www/find-my-interior && git pull origin main")

# Update TRUEDIAL Frontend
print("Updating TRUEDIAL Frontend...")
run("rm -rf /var/www/truedial/src /var/www/truedial/public /var/www/truedial/package.json /var/www/truedial/package-lock.json /var/www/truedial/tailwind.config.ts /var/www/truedial/tsconfig.json /var/www/truedial/next.config.mjs /var/www/truedial/components /var/www/truedial/lib")
run("cp -r /var/www/find-my-interior/truedial-frontend/* /var/www/truedial/ 2>/dev/null || true")
run("cd /var/www/truedial && docker compose up --build -d")

# Update Backend 
print("Updating Find My Interior Backend...")
run("docker exec findmyinterior-app php artisan optimize:clear || true")

client.close()
