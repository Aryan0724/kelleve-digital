import paramiko, sys, time
sys.stdout.reconfigure(encoding='utf-8')

# Use a longer timeout since rebuild can take a while
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=600)

# Set a big timeout on the channel
transport = client.get_transport()
transport.set_keepalive(30)

print("=== Rebuilding fmi_frontend container ===")
print("This will take a few minutes...")

stdin, stdout, stderr = client.exec_command(
    'cd /var/www/find-my-interior && docker compose build frontend 2>&1',
    timeout=600
)

# Stream output
channel = stdout.channel
channel.setblocking(0)

import select
start = time.time()
while not channel.exit_status_ready():
    if time.time() - start > 540:
        print("TIMEOUT after 9 minutes")
        break
    r, w, x = select.select([channel], [], [], 5)
    if r:
        try:
            data = channel.recv(4096)
            if data:
                print(data.decode('utf-8', errors='replace'), end='', flush=True)
        except:
            pass
    time.sleep(0.5)

# Get any remaining output
try:
    remaining = stdout.read().decode('utf-8', errors='replace')
    if remaining:
        print(remaining)
except:
    pass

exit_code = channel.recv_exit_status()
print(f"\nBuild exit code: {exit_code}")

if exit_code == 0:
    print("=== Restarting frontend container ===")
    stdin2, stdout2, stderr2 = client.exec_command(
        'cd /var/www/find-my-interior && docker compose up -d frontend 2>&1',
        timeout=60
    )
    ch2 = stdout2.channel
    while not ch2.exit_status_ready():
        time.sleep(1)
    print(stdout2.read().decode('utf-8'))
    print(stderr2.read().decode('utf-8'))
    print("=== Restart complete ===")
else:
    print("Build FAILED with exit code:", exit_code)
    print(stderr.read().decode('utf-8', errors='replace'))

client.close()
