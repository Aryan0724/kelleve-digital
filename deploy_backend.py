import paramiko, sys, base64

sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)

def run(cmd):
    print(f'CMD: {cmd[:80]}...' if len(cmd) > 80 else f'CMD: {cmd}')
    stdin, stdout, stderr = client.exec_command(cmd, timeout=90, get_pty=True)
    out = stdout.read().decode('utf-8', errors='replace')
    if out: print(out[:1000])
    return out

def copy_file(local_path, container_path):
    with open(local_path, 'rb') as f:
        content = f.read()
    encoded = base64.b64encode(content).decode('ascii')
    tmp_path = '/tmp/' + local_path.replace('\\', '/').split('/')[-1]
    # Write in chunks to avoid command length limits
    chunk_size = 10000
    if len(encoded) <= chunk_size:
        run(f"echo '{encoded}' | base64 -d > {tmp_path}")
    else:
        run(f"rm -f {tmp_path}")
        for i in range(0, len(encoded), chunk_size):
            chunk = encoded[i:i+chunk_size]
            if i == 0:
                run(f"echo '{chunk}' > {tmp_path}.b64")
            else:
                run(f"echo '{chunk}' >> {tmp_path}.b64")
        run(f"base64 -d {tmp_path}.b64 > {tmp_path} && rm {tmp_path}.b64")
    run(f"docker cp {tmp_path} fmi_backend:{container_path}")
    print(f"Copied {local_path} -> {container_path}")

# Copy updated backend files
base = r'd:\find my interior\findmyinterior-backend'

# AuthController
copy_file(
    fr'{base}\app\Http\Controllers\Auth\AuthController.php',
    '/var/www/html/app/Http/Controllers/Auth/AuthController.php'
)

# ListingController
copy_file(
    fr'{base}\app\Http\Controllers\Public\ListingController.php',
    '/var/www/html/app/Http/Controllers/Public/ListingController.php'
)

# ProfessionalProfileController
copy_file(
    fr'{base}\app\Http\Controllers\Api\V1\ProfessionalProfileController.php',
    '/var/www/html/app/Http/Controllers/Api/V1/ProfessionalProfileController.php'
)

# User Model
copy_file(
    fr'{base}\app\Models\User.php',
    '/var/www/html/app/Models/User.php'
)

# api.php routes
copy_file(
    fr'{base}\routes\api.php',
    '/var/www/html/routes/api.php'
)

# VentureController (new file)
copy_file(
    fr'{base}\app\Http\Controllers\Api\V1\VentureController.php',
    '/var/www/html/app/Http/Controllers/Api/V1/VentureController.php'
)

# Clear caches
run("docker exec fmi_backend php artisan config:clear")
run("docker exec fmi_backend php artisan route:clear")
run("docker exec fmi_backend php artisan cache:clear")
run("docker exec fmi_backend php artisan view:clear")

# Verify routes include ventures
run("docker exec fmi_backend php artisan route:list | grep venture")

client.close()
print('=== BACKEND DEPLOYED ===')
