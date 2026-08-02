import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=60)

commands = [
    "cd /opt/findmyinterior/findmyinterior-frontend && git stash && git pull --rebase origin main && git stash pop",
    "cd /opt/findmyinterior/findmyinterior-frontend && docker-compose build frontend",
    "cd /opt/findmyinterior/findmyinterior-frontend && docker-compose up -d --no-deps frontend"
]

for cmd in commands:
    print(f"Running: {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd)
    
    # Print stdout in real-time
    while True:
        line = stdout.readline()
        if not line:
            break
        print(line, end="")
        
    err = stderr.read().decode()
    if err:
        print(f"STDERR: {err}")
        
client.close()
