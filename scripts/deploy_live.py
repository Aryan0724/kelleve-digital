import paramiko
import sys
import time

hostname = '187.127.164.142'
username = 'root'
password = 'Truedial@1111'

print("Connecting to VPS via SSH...")
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
    if out: print(out.strip())
    if err: print("ERR: " + err.strip())

run("cd /var/www/find-my-interior && git pull origin main")

# Update .env
run("cd /var/www/find-my-interior/findmyinterior-backend && sed -i '/SENTRY_/d' .env")
run("cd /var/www/find-my-interior/findmyinterior-backend && echo 'SENTRY_LARAVEL_DSN=https://fc0f14f9f8d00507e15a0e67a6e79d56@o4511973377966080.ingest.us.sentry.io/4511973386485760' >> .env")
run("cd /var/www/find-my-interior/findmyinterior-backend && echo 'SENTRY_TRACES_SAMPLE_RATE=1.0' >> .env")
run("cd /var/www/find-my-interior/findmyinterior-backend && echo 'SENTRY_PROFILES_SAMPLE_RATE=1.0' >> .env")
run("cd /var/www/find-my-interior/findmyinterior-backend && echo 'SENTRY_ENABLE_LOGS=true' >> .env")
run("cd /var/www/find-my-interior/findmyinterior-backend && sed -i '/LOG_STACK/d' .env && echo 'LOG_STACK=single,sentry_logs' >> .env")
run("cd /var/www/find-my-interior/findmyinterior-backend && sed -i 's/QUEUE_CONNECTION=sync/QUEUE_CONNECTION=database/g' .env")

# Restart docker container so the new .env variables (Sentry) are picked up by the container environment
print("Restarting docker container to load new .env variables...")
run("cd /var/www/find-my-interior && docker compose restart backend")
run("sleep 5")

print("Executing artisan commands inside Docker container...")
run("docker exec fmi_backend php artisan optimize:clear")
run("docker exec fmi_backend php artisan migrate --force")
run("docker exec fmi_backend php artisan db:seed --class=ProductionSeeder --force")
run("docker exec fmi_backend php artisan queue:restart")
run("docker exec fmi_backend php artisan sentry:test")
print("Deployment and Sentry config completed!")
