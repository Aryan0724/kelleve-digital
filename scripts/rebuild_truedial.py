import paramiko
import sys
import time

hostname = '187.127.164.142'
username = 'root'
password = 'Truedial@1111'

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname, username=username, password=password, timeout=10)

def run(cmd):
    print(f"> {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out: print(out)
    if err: print(err)

run("sed -i 's/npm ci/npm install/g' /var/www/truedial/Dockerfile")
run("cd /var/www/truedial && docker compose up --build -d")
time.sleep(5)
run("docker ps | grep truedial_staging_frontend")
run("curl -s -o /dev/null -w '%{http_code}' http://localhost:3001")
client.close()
