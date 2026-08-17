import paramiko
import time

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

print("=== STEP 1: Pulling latest code ===")
_, stdout, stderr = client.exec_command('cd /var/www/find-my-interior && git pull origin main 2>&1')
print(stdout.read().decode())
print(stderr.read().decode())
time.sleep(2)

print("\n=== STEP 2: Restarting backend container to pick up new middleware ===")
_, stdout, _ = client.exec_command('docker restart fmi_backend 2>&1')
print(stdout.read().decode())
time.sleep(8)

print("\n=== STEP 3: Clearing backend caches ===")
_, stdout, _ = client.exec_command('docker exec fmi_backend php artisan cache:clear ; docker exec fmi_backend php artisan config:clear ; docker exec fmi_backend php artisan route:clear 2>&1')
print(stdout.read().decode())
time.sleep(3)

print("\n=== STEP 4: DB Migration - move TrueDial listings from tenant_id=1 to tenant_id=2 ===")
# Find users who registered via TrueDial (they have professional_type that maps to non-interior roles)
# Strategy: users with active tokens recently, plus any who registered via truedial frontend

# First check how many listings are under tenant 1 that should be tenant 2
_, stdout, _ = client.exec_command(
    "docker exec fmi_backend php artisan tinker --execute=\""
    "echo 'Listings under tenant 1: ' . App\\\\Models\\\\Listing::where('tenant_id', 1)->count();"
    "echo PHP_EOL . 'Listings under tenant 2: ' . App\\\\Models\\\\Listing::where('tenant_id', 2)->count();"
    "\""
)
print(stdout.read().decode())

print("\n=== STEP 5: Verify X-Tenant-ID now works ===")
_, stdout, _ = client.exec_command(
    "docker exec fmi_backend curl -s http://localhost/api/v1/truedial/vendor/my-business "
    "-H 'X-Tenant-ID: 2' "
    "-H 'Accept: application/json' "
    "-H 'Authorization: Bearer 66|VpB9OLqD5c3cekNp1gfEJhbxO6Y8BxKnl5wFHalc06f0f7f2' 2>&1"
)
print("Test auth with X-Tenant-ID:2 header:", stdout.read().decode())

print("\nDone!")
