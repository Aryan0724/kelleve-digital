import paramiko
import sys
import time

sys.stdout.reconfigure(encoding='utf-8')

hostname = "187.127.164.142"
username = "root"
password = "Truedial@1111"

def run_cmd_sync(client, cmd):
    print(f"\n---> Executing: {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace').strip()
    err = stderr.read().decode('utf-8', errors='replace').strip()
    status = stdout.channel.recv_exit_status()
    print(f"     [Exit: {status}]")
    if out:
        for line in out.splitlines()[:10]:
            print("     OUT:", line)
    if err:
        for line in err.splitlines()[:10]:
            print("     ERR:", line)
    return status, out, err

try:
    print(f"=== CONNECTING TO VPS {hostname} ===")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(hostname, username=username, password=password, timeout=15)
    print("✅ Connected successfully!")

    print("\n1. Restarting Docker daemon so it rebuilds its DOCKER iptables chains...")
    run_cmd_sync(client, "systemctl restart docker")
    time.sleep(3)

    print("\n2. Checking Docker containers status...")
    run_cmd_sync(client, "docker ps -a --format 'table {{.Names}}\t{{.Status}}'")

    print("\n3. Starting all findmyinterior compose containers...")
    run_cmd_sync(client, "cd /var/www/find-my-interior && docker-compose up -d --remove-orphans || docker compose up -d")

    print("\n4. Re-checking running containers...")
    run_cmd_sync(client, "docker ps --format 'table {{.Names}}\t{{.Status}}'")

    print("\n5. Checking HTTP Status...")
    run_cmd_sync(client, "curl -k -s -o /dev/null -w '%{http_code}' https://findmyinterior.com")

    client.close()
    print("\n✅ === SUCCESS: DOCKER NETWORKING RESTORED & CONTAINERS LIVE! ===")
except Exception as e:
    print("\n❌ SSH Connection Failed:", e)
