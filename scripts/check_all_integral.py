import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

php_script = r"""<?php
require_once '/var/www/html/vendor/autoload.php';
$app = require '/var/www/html/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$listings = \App\Models\Listing::withoutGlobalScopes()->where('title', 'like', '%integral%')->get();
foreach ($listings as $l) {
    echo "ID: " . $l->id . " | USER_ID: " . $l->user_id . " | TITLE: " . $l->title . " | SLUG: " . $l->slug . "\n";
}
"""

sftp = client.open_sftp()
with sftp.file('/tmp/check_all_integral.php', 'w') as f:
    f.write(php_script)
sftp.close()

cmd = "docker cp /tmp/check_all_integral.php fmi_backend:/tmp/check_all_integral.php && docker exec fmi_backend php /tmp/check_all_integral.php"
stdin, stdout, stderr = client.exec_command(cmd)
print(stdout.read().decode('utf-8', errors='replace'))
client.close()
