import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

# Check what users exist and their professional_type
_, stdout, _ = client.exec_command(
    'docker exec fmi_backend php -r "define(\'LARAVEL_START\', microtime(true)); require \'/var/www/html/vendor/autoload.php\'; $app = require_once \'/var/www/html/bootstrap/app.php\'; $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class); $kernel->bootstrap(); $users = DB::table(\'users\')->select(\'id\',\'name\',\'email\',\'professional_type\')->get(); echo json_encode($users);"'
)
print("=== ALL USERS ===")
print(stdout.read().decode())

# Check what listings exist
_, stdout, _ = client.exec_command(
    'docker exec fmi_backend php -r "define(\'LARAVEL_START\', microtime(true)); require \'/var/www/html/vendor/autoload.php\'; $app = require_once \'/var/www/html/bootstrap/app.php\'; $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class); $kernel->bootstrap(); $listings = DB::table(\'listings\')->select(\'id\',\'user_id\',\'title\',\'status\',\'tenant_id\')->get(); echo json_encode($listings);"'
)
print("=== ALL LISTINGS ===")
print(stdout.read().decode())

# Check the tenant IDs and API config
_, stdout, _ = client.exec_command(
    'docker exec fmi_backend cat .env | grep -E "TENANT|APP_URL|X-Tenant|X-Platform" 2>/dev/null | head -20'
)
print("=== ENV (tenant/url related) ===")
print(stdout.read().decode())

# Also check the TRUEDIAL routes to see what tenant_id they use
_, stdout, _ = client.exec_command(
    'docker exec fmi_backend php -r "define(\'LARAVEL_START\', microtime(true)); require \'/var/www/html/vendor/autoload.php\'; $app = require_once \'/var/www/html/bootstrap/app.php\'; $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class); $kernel->bootstrap(); $tenants = DB::table(\'tenants\')->get(); echo json_encode($tenants);" 2>/dev/null'
)
print("=== TENANTS TABLE ===")
print(stdout.read().decode())
