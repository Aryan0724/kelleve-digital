import paramiko
import json

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

# Check nginx config in the main nginx container
_, stdout, _ = client.exec_command('docker exec fmi_nginx ls /etc/nginx/conf.d/')
print("=== NGINX CONF FILES ===")
print(stdout.read().decode())

_, stdout, _ = client.exec_command('docker exec fmi_nginx cat /etc/nginx/conf.d/default.conf 2>/dev/null || docker exec fmi_nginx cat /etc/nginx/conf.d/app.conf 2>/dev/null')
print("=== NGINX DEFAULT CONF ===")
print(stdout.read().decode())

# Check the actual URL the vercel app calls
_, stdout, _ = client.exec_command('docker exec fmi_nginx env | grep -i backend')
print("=== NGINX ENV ===")
print(stdout.read().decode())

# Generate a working token to test the full flow
_, stdout, _ = client.exec_command(
    "docker exec fmi_backend php -r \"require '/var/www/html/vendor/autoload.php'; \\$app = require_once '/var/www/html/bootstrap/app.php'; \\$kernel = \\$app->make(Illuminate\\Contracts\\Http\\Kernel::class); \\$request = Illuminate\\Http\\Request::capture(); \\$kernel->handle(\\$request); \\$u = App\\\\Models\\\\User::first(); if(\\$u) { \\$t = \\$u->createToken('test'); echo \\$t->plainTextToken; } else { echo 'NO_USERS'; }\""
)
print("=== TOKEN ===")
token_output = stdout.read().decode()
print(repr(token_output))
