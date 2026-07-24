import paramiko
from paramiko import SFTPClient
import sys, os

sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)

def run(cmd):
    print(f'CMD: {cmd}')
    stdin, stdout, stderr = client.exec_command(cmd, timeout=90, get_pty=True)
    out = stdout.read().decode('utf-8', errors='replace')
    if out: print(out)
    return out

# Read migration files from local
migration1 = open(r'd:\find my interior\findmyinterior-backend\database\migrations\2026_07_24_000001_add_expanded_professional_roles.php', 'r', encoding='utf-8').read()
migration2 = open(r'd:\find my interior\findmyinterior-backend\database\migrations\2026_07_24_000002_add_professional_type_and_ventures.php', 'r', encoding='utf-8').read()

# Write them to the server via SSH exec
def write_file_on_server(content, remote_path):
    import base64
    encoded = base64.b64encode(content.encode('utf-8')).decode('ascii')
    run(f"echo '{encoded}' | base64 -d > {remote_path}")

# Copy to tmp on server
run("mkdir -p /tmp/migrations")
write_file_on_server(migration1, '/tmp/migrations/2026_07_24_000001_add_expanded_professional_roles.php')
write_file_on_server(migration2, '/tmp/migrations/2026_07_24_000002_add_professional_type_and_ventures.php')

# Copy into the container
run("docker cp /tmp/migrations/2026_07_24_000001_add_expanded_professional_roles.php fmi_backend:/var/www/html/database/migrations/")
run("docker cp /tmp/migrations/2026_07_24_000002_add_professional_type_and_ventures.php fmi_backend:/var/www/html/database/migrations/")

# Run migrations
run("docker exec fmi_backend php artisan migrate --path=database/migrations/2026_07_24_000001_add_expanded_professional_roles.php --force")
run("docker exec fmi_backend php artisan migrate --path=database/migrations/2026_07_24_000002_add_professional_type_and_ventures.php --force")

# Verify
run("docker exec fmi_backend php artisan migrate:status | tail -10")

client.close()
print('=== MIGRATION DONE ===')
