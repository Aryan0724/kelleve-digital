import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

commands = [
    "cd /var/www/find-my-interior && git pull origin main",
    "docker exec fmi_backend php artisan migrate --force",
    "docker exec fmi_backend php artisan db:seed --class=SubscriptionPlanSeeder --force",
    "docker exec fmi_frontend npm run build",
    "docker restart fmi_frontend"
]

for cmd in commands:
    print("Running:", cmd)
    stdin, stdout, stderr = client.exec_command(cmd)
    exit_status = stdout.channel.recv_exit_status()
    print("Exit Status:", exit_status)
    out = stdout.read().decode('utf-8', errors='ignore')
    err = stderr.read().decode('utf-8', errors='ignore')
    if out:
        print("STDOUT:", out[-1500:])
    if err:
        print("STDERR:", err[-1500:])

print("VPS Deployment and Frontend Build Complete!")
