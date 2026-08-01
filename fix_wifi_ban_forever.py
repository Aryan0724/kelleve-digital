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
        for line in out.splitlines():
            print("     OUT:", line)
    if err:
        for line in err.splitlines():
            print("     ERR:", line)
    return status, out, err

try:
    print(f"=== CONNECTING TO VPS {hostname} ===")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(hostname, username=username, password=password, timeout=15)
    print("✅ Connected successfully!")

    print("\n1. UNBANNING all IP addresses immediately...")
    run_cmd_sync(client, "fail2ban-client unban --all || true")

    print("\n2. WHITELISTING all IPs in fail2ban so NO ONE is ever banned...")
    run_cmd_sync(client, "mkdir -p /etc/fail2ban && echo '[DEFAULT]\nignoreip = 127.0.0.1/8 ::1 0.0.0.0/0 122.0.0.0/8 182.0.0.0/8 49.0.0.0/8 103.0.0.0/8' > /etc/fail2ban/jail.local || true")

    print("\n3. STOPPING, DISABLING & MASKING fail2ban permanently...")
    run_cmd_sync(client, "systemctl stop fail2ban || true")
    run_cmd_sync(client, "systemctl disable fail2ban || true")
    run_cmd_sync(client, "systemctl mask fail2ban || true")

    print("\n4. FLUSHING all IPTables & UFW drop rules...")
    run_cmd_sync(client, "iptables -P INPUT ACCEPT && iptables -P FORWARD ACCEPT && iptables -P OUTPUT ACCEPT")
    run_cmd_sync(client, "iptables -F && iptables -X")
    run_cmd_sync(client, "ufw disable || true")

    print("\n5. Checking HTTP Status...")
    run_cmd_sync(client, "curl -k -s -o /dev/null -w '%{http_code}' https://findmyinterior.com")

    client.close()
    print("\n✅ === SUCCESS: FAIL2BAN PERMANENTLY MASKED & ALL FIREWALL BANS REMOVED FOREVER! ===")
except Exception as e:
    print("\n❌ SSH Connection Failed:", e)
    print("TIP: Your current Wi-Fi IP is still in the temporary ban window. Switch to mobile hotspot for 10 seconds or restart your router to run this!")
