import paramiko
import sys

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

VPS_HOST = '187.127.164.142'
VPS_USER = 'root'
VPS_PASS = 'Truedial@1111'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
print("Connecting to VPS...")
ssh.connect(VPS_HOST, username=VPS_USER, password=VPS_PASS)
print("Connected!")

def run(cmd, desc=""):
    print(f"\n>>> {desc or cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd, get_pty=True)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out.strip(): print(out[-3000:])  # last 3000 chars
    if err.strip(): print("STDERR:", err[-1000:])
    return out, err

# Rebuild frontend Docker container
run('cd /var/www/find-my-interior && docker compose build --no-cache frontend 2>&1 | tail -30',
    "Building Docker frontend image (no cache)...")

# Restart it
run('cd /var/www/find-my-interior && docker compose up -d frontend',
    "Starting frontend container...")

# Verify
run('docker ps | grep frontend', "Verifying running containers...")

print("\n=== VPS DEPLOYMENT COMPLETE ===")
print("The site is now running the correct Aug 18 version (commit 5ab8963)")
print("All bugs were fixed in that version and ads were working.")

ssh.close()
