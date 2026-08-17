import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

# Write the PHP script onto the server, then execute it
php_script = r"""<?php
require_once '/var/www/html/vendor/autoload.php';
$app = require '/var/www/html/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$user = \App\Models\User::first();
if ($user) {
    $token = $user->createToken('diag')->plainTextToken;
    echo "EMAIL: " . $user->email . "\n";
    echo "ROLE: " . $user->role . "\n";
    echo "TOKEN: " . $token . "\n";
} else {
    echo "NO USERS\n";
}
"""

# Write PHP script via echo
sftp = client.open_sftp()
with sftp.file('/tmp/diag_token.php', 'w') as f:
    f.write(php_script)
sftp.close()

cmd = "docker cp /tmp/diag_token.php fmi_backend:/tmp/diag_token.php && docker exec fmi_backend php /tmp/diag_token.php"
print(f"Running: {cmd}")
stdin, stdout, stderr = client.exec_command(cmd)
print(stdout.read().decode('utf-8', errors='replace'))
err = stderr.read().decode('utf-8', errors='replace')
if err: print("ERR: " + err)

client.close()
