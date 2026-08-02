import paramiko, sys, time, select
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=600)
transport = client.get_transport()
transport.set_keepalive(30)

print("=== Step 1: Git pull ===")
stdin, stdout, stderr = client.exec_command('cd /var/www/find-my-interior && git pull origin main 2>&1', timeout=60)
ch = stdout.channel
while not ch.exit_status_ready():
    time.sleep(1)
print(stdout.read().decode('utf-8'))

print("=== Step 2: Rebuild frontend ===")
stdin, stdout, stderr = client.exec_command(
    'cd /var/www/find-my-interior && docker compose build frontend 2>&1',
    timeout=600
)
channel = stdout.channel
channel.setblocking(0)
start = time.time()
while not channel.exit_status_ready():
    if time.time() - start > 540:
        print("TIMEOUT!")
        break
    r, w, x = select.select([channel], [], [], 5)
    if r:
        try:
            data = channel.recv(4096)
            if data:
                sys.stdout.write(data.decode('utf-8', errors='replace'))
                sys.stdout.flush()
        except:
            pass
    time.sleep(0.5)
try:
    remaining = stdout.read().decode('utf-8', errors='replace')
    if remaining:
        print(remaining)
except:
    pass

exit_code = channel.recv_exit_status()
print(f"\nBuild exit code: {exit_code}")

if exit_code == 0:
    print("=== Step 4: Restart container ===")
    stdin2, stdout2, stderr2 = client.exec_command(
        'cd /var/www/find-my-interior && docker compose up -d frontend 2>&1', timeout=60
    )
    ch2 = stdout2.channel
    while not ch2.exit_status_ready():
        time.sleep(1)
    print(stdout2.read().decode('utf-8'))
    time.sleep(5)
    stdin3, stdout3, _ = client.exec_command('docker ps --filter name=fmi_frontend --format "{{.Names}}\t{{.Status}}"')
    print("Container:", stdout3.read().decode('utf-8'))
else:
    print("BUILD FAILED!")

client.close()
