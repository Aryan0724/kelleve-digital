import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

php_script = r"""<?php
require_once '/var/www/html/vendor/autoload.php';
$app = require '/var/www/html/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$listing = \App\Models\Listing::find(1635);
if ($listing) {
    echo "ID: " . $listing->id . "\n";
    echo "USER_ID: " . $listing->user_id . "\n";
    echo "TENANT_ID: " . $listing->tenant_id . "\n";
    echo "TITLE: " . $listing->title . "\n";
    echo "SLUG: " . $listing->slug . "\n";
    echo "STATUS: " . $listing->status . "\n";
} else {
    echo "LISTING 1635 NOT FOUND\n";
}
"""

sftp = client.open_sftp()
with sftp.file('/tmp/check_1635.php', 'w') as f:
    f.write(php_script)
sftp.close()

cmd = "docker cp /tmp/check_1635.php fmi_backend:/tmp/check_1635.php && docker exec fmi_backend php /tmp/check_1635.php"
stdin, stdout, stderr = client.exec_command(cmd)
print(stdout.read().decode('utf-8', errors='replace'))
client.close()
