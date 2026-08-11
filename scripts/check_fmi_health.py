import paramiko
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

def run(cmd):
    stdin, stdout, stderr = client.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    return out

print("Backend Container:", run("docker ps --filter name=fmi_backend --format '{{.Status}}'"))
print("Frontend Container:", run("docker ps --filter name=fmi_frontend --format '{{.Status}}'"))
print("Database Container:", run("docker ps --filter name=fmi_mysql --format '{{.Status}}'"))

# Also hit the local API inside the VPS to make sure it's alive
print("Backend API Health:", run("curl -s -o /dev/null -w '%{http_code}' http://localhost:8000/api/v1/listings"))

client.close()
