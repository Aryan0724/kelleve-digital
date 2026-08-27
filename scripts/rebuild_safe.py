import paramiko
import sys

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

def run(cmd):
    print(f"> {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd)
    
    with open('build_output.log', 'w', encoding='utf-8') as f:
        for line in iter(stdout.readline, ""):
            f.write(line)
        for line in iter(stderr.readline, ""):
            f.write(line)

run('cd /var/www/find-my-interior && docker compose build --no-cache frontend && docker compose up -d frontend')
run('docker ps | grep fmi_')
