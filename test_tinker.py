import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

cmd = """docker exec fmi_backend php artisan tinker --execute="
\$request = new \\Illuminate\\Http\\Request();
\$controller = app()->make(\\App\\Http\\Controllers\\Api\\V1\\Admin\\VerificationController::class);
try {
    \$response = \$controller->index(\$request);
    echo \$response->getContent();
} catch (\\Exception \$e) {
    echo 'ERROR: ' . \$e->getMessage();
}
"
"""

stdin, stdout, stderr = client.exec_command(cmd)
print("STDOUT:", stdout.read().decode())
print("STDERR:", stderr.read().decode())
