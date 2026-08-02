import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)

tinker_script = '''<?php
$user = App\\Models\\User::withoutGlobalScopes()->where('email', 'Aryantiwari@findmyinterior.com')->first();
if ($user) {
    $user->password = Illuminate\\Support\\Facades\\Hash::make('findmyinterior');
    $user->is_active = true;
    $user->save();
    echo "Password reset successfully for Aryantiwari.\\n";
} else {
    echo "User Aryantiwari not found!\\n";
}
'''

sftp = client.open_sftp()
with sftp.file('/tmp/reset.php', 'w') as f:
    f.write(tinker_script)
sftp.close()

stdin, stdout, stderr = client.exec_command('docker cp /tmp/reset.php fmi_backend:/tmp/reset.php && docker exec fmi_backend php artisan tinker /tmp/reset.php')
print("STDOUT:")
print(stdout.read().decode('utf-8', errors='replace'))

client.close()
