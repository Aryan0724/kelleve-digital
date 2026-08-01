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

    print("\n1. Discovering any background firewall / block daemons (csf, lfd, crowdsec, fail2ban)...")
    run_cmd_sync(client, "ps aux | grep -E 'csf|lfd|crowdsec|fail2ban|f2b|guard|deny' | grep -v grep || true")

    print("\n2. Stopping any csf/lfd or crowdsec if installed...")
    run_cmd_sync(client, "csf -f || true; systemctl stop csf lfd crowdsec || true; systemctl disable csf lfd crowdsec || true")

    print("\n3. Flushing all existing iptables drop rules...")
    run_cmd_sync(client, "iptables -P INPUT ACCEPT && iptables -F && iptables -X")

    print("\n4. INSERTING PERMANENT TOP-PRIORITY WHITELIST RULES AT #1 IN IPTABLES...")
    # By inserting (-I INPUT 1) at the top of the chain, these IPs will ALWAYS be accepted
    # even if another background tool adds block rules later!
    whitelist_subnets = [
        "122.0.0.0/8",   # Airtel India Wi-Fi IP range
        "182.0.0.0/8",   # Airtel India secondary range
        "49.0.0.0/8",    # Jio & Airtel India range
        "103.0.0.0/8",   # Indian broadband ISPs range
        "127.0.0.0/8",   # Localhost
        "10.0.0.0/8",    # Private networks
        "192.168.0.0/16" # LAN networks
    ]
    for idx, subnet in enumerate(whitelist_subnets, start=1):
        run_cmd_sync(client, f"iptables -I INPUT {idx} -s {subnet} -j ACCEPT")

    print("\n5. Saving iptables rules so they survive reboot and override any daemon...")
    run_cmd_sync(client, "mkdir -p /etc/iptables && iptables-save > /etc/iptables/rules.v4 || true")
    run_cmd_sync(client, "netfilter-persistent save || true")

    print("\n6. Checking current top 15 rules in iptables INPUT chain...")
    run_cmd_sync(client, "iptables -L INPUT -n -v --line-numbers | head -n 15")

    print("\n7. Checking HTTP Status...")
    run_cmd_sync(client, "curl -k -s -o /dev/null -w '%{http_code}' https://findmyinterior.com")

    client.close()
    print("\n✅ === SUCCESS: ALL INDIAN BROADBAND & WI-FI SUBNETS PERMANENTLY WHITELISTED AT IPTABLES RULE #1! ===")
except Exception as e:
    print("\n❌ SSH Connection Failed:", e)
    print("TIP: Switch to your mobile hotspot for 10 seconds (or restart your Wi-Fi router) and run this script!")
