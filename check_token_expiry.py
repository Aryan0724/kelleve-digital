import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)

# 1. Check Sanctum token expiry config
stdin, stdout, stderr = client.exec_command('docker exec fmi_backend cat /var/www/html/config/sanctum.php | grep -A5 expiration')
print("=== SANCTUM EXPIRATION ===")
print(stdout.read().decode('utf-8') or "NOT FOUND")

# 2. Check .env for SANCTUM settings
stdin, stdout, stderr = client.exec_command('docker exec fmi_backend grep -i sanctum /var/www/html/.env')
print("=== .ENV SANCTUM ===")
print(stdout.read().decode('utf-8') or "NOT FOUND")

# 3. Check SESSION config
stdin, stdout, stderr = client.exec_command('docker exec fmi_backend grep -i "SESSION_LIFETIME\|SESSION_DRIVER" /var/www/html/.env')
print("=== .ENV SESSION ===")
print(stdout.read().decode('utf-8') or "NOT FOUND")

# 4. Make a login, get a token, then check its expiry in DB
stdin, stdout, stderr = client.exec_command(
    '''docker exec fmi_backend php -r "
require '/var/www/html/vendor/autoload.php';
\$app = require '/var/www/html/bootstrap/app.php';
\$app->make(\\Illuminate\\Contracts\\Http\\Kernel::class)->bootstrap();
\$tokens = DB::table('personal_access_tokens')->orderByDesc('created_at')->limit(5)->get(['name','tokenable_id','expires_at','created_at','last_used_at']);
echo json_encode(\$tokens, JSON_PRETTY_PRINT);
"'''
)
print("=== RECENT TOKENS IN DB ===")
print(stdout.read().decode('utf-8'))
print("ERR:", stderr.read().decode('utf-8')[:200])

client.close()
