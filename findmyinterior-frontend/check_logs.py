import paramiko
import sys

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
try:
    ssh.connect('187.127.164.142', username='root', password='Truedial@1111')
    
    stdin, stdout, stderr = ssh.exec_command("docker logs fmi_frontend --tail 50")
    with open('docker_logs.txt', 'w', encoding='utf-8') as f:
        f.write(stdout.read().decode('utf-8'))
        f.write(stderr.read().decode('utf-8'))
finally:
    ssh.close()
