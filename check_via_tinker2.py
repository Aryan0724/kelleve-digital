import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)

tinker_script = '''
$user = App\\Models\\User::where('email', 'Aryantiwari@findmyinterior.com')->first();
echo "Aryantiwari: " . json_encode($user) . "\\n";
$user2 = App\\Models\\User::where('email', 'admin@findmyinterior.com')->first();
echo "admin: " . json_encode($user2) . "\\n";
'''

sftp = client.open_sftp()
with sftp.file('/tmp/check_admin.php', 'w') as f:
    f.write(tinker_script)
sftp.close()

stdin, stdout, stderr = client.exec_command('docker cp /tmp/check_admin.php fmi_backend:/tmp/check_admin.php && docker exec fmi_backend php artisan tinker /tmp/check_admin.php')
print("STDOUT:")
print(stdout.read().decode('utf-8', errors='replace'))
print("STDERR:")
print(stderr.read().decode('utf-8', errors='replace'))
client.close()
