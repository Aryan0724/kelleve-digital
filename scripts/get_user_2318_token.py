import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

php_script = r"""<?php
require_once '/var/www/html/vendor/autoload.php';
$app = require '/var/www/html/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$user = \App\Models\User::find(2318);
if ($user) {
    $token = $user->createToken('diag-2318')->plainTextToken;
    echo "USER ID: " . $user->id . "\n";
    echo "EMAIL: " . $user->email . "\n";
    echo "ROLE: " . $user->role . "\n";
    echo "TOKEN: " . $token . "\n";
} else {
    echo "USER NOT FOUND\n";
}
"""

sftp = client.open_sftp()
with sftp.file('/tmp/diag_2318.php', 'w') as f:
    f.write(php_script)
sftp.close()

cmd = "docker cp /tmp/diag_2318.php fmi_backend:/tmp/diag_2318.php && docker exec fmi_backend php /tmp/diag_2318.php"
stdin, stdout, stderr = client.exec_command(cmd)
print(stdout.read().decode('utf-8', errors='replace'))
client.close()
