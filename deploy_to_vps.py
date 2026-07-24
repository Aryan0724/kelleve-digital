import paramiko
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

commands = [
    "cd /var/www/find-my-interior && docker compose build frontend backend",
    "cd /var/www/find-my-interior && docker compose up -d --no-deps frontend backend",
    "docker exec fmi_backend php artisan migrate --force"
]

for cmd in commands:
    print("Running:", cmd)
    stdin, stdout, stderr = client.exec_command(cmd)
    
    # Wait for the command to finish and print output
    exit_status = stdout.channel.recv_exit_status()
    print("Exit Status:", exit_status)
    print("STDOUT:", stdout.read().decode())
    print("STDERR:", stderr.read().decode())
    
print("Deployment to VPS finished.")
