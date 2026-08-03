import paramiko
import sys

hostname = '187.127.164.142'
username = 'root'
password = 'Truedial@1111'

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname, username=username, password=password, timeout=10)

def run(cmd):
    stdin, stdout, stderr = client.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    return out + err

print("Docker ps:")
print(run("docker ps | grep truedial_staging_frontend").encode('cp1252', errors='replace').decode('cp1252'))

print("Curl:")
print(run("curl -s -o /dev/null -w '%{http_code}' http://localhost:3001"))

client.close()
