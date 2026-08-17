import paramiko
import sys

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
try:
    ssh.connect('187.127.164.142', username='root', password='Truedial@1111')
    print("Connected to VPS")
    
    commands = [
        "cd /var/www/find-my-interior && git fetch origin && git reset --hard origin/main",
        "docker restart fmi_backend",
    ]
    
    for cmd in commands:
        print(f"Executing: {cmd}")
        stdin, stdout, stderr = ssh.exec_command(cmd)
        
        exit_status = stdout.channel.recv_exit_status()
        
        print("STDOUT:")
        sys.stdout.buffer.write(stdout.read())
        print("\nSTDERR:")
        sys.stderr.buffer.write(stderr.read())
        print("\n")
        
        if exit_status != 0:
            print(f"Command failed with exit status {exit_status}")
            sys.exit(1)
            
    print("Deployment completed successfully!")
finally:
    ssh.close()
