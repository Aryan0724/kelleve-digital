import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

def run(cmd):
    print(f"> {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out: print(out)
    if err: print("ERR:", err)

run("cd /var/www/find-my-interior && git pull")
# Assuming truedial on VPS is built from the monorepo truedial-frontend folder
# Let's check if /var/www/truedial is a separate repo or a symlink, or just a docker-compose folder
run("ls -la /var/www/truedial")
run("cd /var/www/truedial && git pull || echo 'not a git repo'")

run("cd /var/www/truedial && docker compose up --build -d")

client.close()
