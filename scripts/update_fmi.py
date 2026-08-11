import paramiko
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

def run(cmd):
    print(f"> {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    status = stdout.channel.recv_exit_status()
    print(out)
    if err: print("ERR:", err)
    return status

# Pull the latest code
run("cd /var/www/find-my-interior && git pull origin main")

# Usually FMI is running via docker-compose in /var/www/find-my-interior
print("Restarting fmi_frontend container")
run("cd /var/www/find-my-interior && docker compose restart fmi_frontend || docker restart fmi_frontend")

client.close()
