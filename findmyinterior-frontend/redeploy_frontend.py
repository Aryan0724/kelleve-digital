import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
try:
    ssh.connect('187.127.164.142', username='root', password='Truedial@1111')
    
    # Run git pull and rebuild
    command = "cd /var/www/find-my-interior && git reset --hard && git pull origin main && (docker-compose build frontend || docker compose build frontend) && (docker-compose up -d frontend || docker compose up -d frontend)"
    stdin, stdout, stderr = ssh.exec_command(command)
    
    for line in iter(stdout.readline, ""):
        print(line, end="")
        
    for line in iter(stderr.readline, ""):
        print(line, end="", file=sys.stderr)
        
    exit_status = stdout.channel.recv_exit_status()
    print(f"\nDeployment completed with status: {exit_status}")
    
finally:
    ssh.close()
