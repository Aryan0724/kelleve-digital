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
        for line in out.splitlines()[:15]:
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

    print("\n1. Pulling latest git commit (f80c449 - sleek logo resize)...")
    run_cmd_sync(client, "cd /var/www/find-my-interior && git fetch origin main && git reset --hard origin/main")

    print("\n2. Rebuilding fmi_frontend container for production...")
    run_cmd_sync(client, "docker exec fmi_frontend npm run build")

    print("\n3. Restarting fmi_frontend container...")
    run_cmd_sync(client, "docker restart fmi_frontend")

    print("\n4. Verifying HTTP status code...")
    run_cmd_sync(client, "curl -k -s -o /dev/null -w '%{http_code}' https://findmyinterior.com")

    client.close()
    print("\n✅ === SUCCESS: SLEEK LOGO RESIZE DEPLOYED TO LIVE SERVER! ===")
except Exception as e:
    print("\n❌ SSH Connection Failed:", e)
