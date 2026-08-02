import paramiko, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)

tinker_script = '''<?php
$user = App\\Models\\User::firstOrCreate(
    ['email' => 'Aryantiwari@findmyinterior.com'],
    [
        'name' => 'FindMyInterior Admin',
        'phone' => '9999999999',
        'password' => Illuminate\\Support\\Facades\\Hash::make('findmyinterior'),
        'verification_level' => 'site_verified',
        'is_active' => true,
        'email_verified_at' => now(),
    ]
);
$user->password = Illuminate\\Support\\Facades\\Hash::make('findmyinterior');
$user->save();
$role = App\\Models\\Role::where('slug', 'admin')->first();
if ($role) {
    $user->roles()->syncWithoutDetaching([$role->id]);
}
echo "Admin user ready. Password set to 'findmyinterior'. Role attached.\\n";
'''

print('Uploading php script...')
sftp = client.open_sftp()
with sftp.file('/tmp/reset_admin.php', 'w') as f:
    f.write(tinker_script)
sftp.close()

print('Executing script inside docker container...')
stdin, stdout, stderr = client.exec_command('docker cp /tmp/reset_admin.php fmi_backend:/tmp/reset_admin.php && docker exec fmi_backend php /tmp/reset_admin.php')
print("STDOUT:")
print(stdout.read().decode('utf-8', errors='replace'))
print("STDERR:")
print(stderr.read().decode('utf-8', errors='replace'))

print("Testing login via API (using HTTPS because of the 301 redirect)...")
stdin, stdout, stderr = client.exec_command("curl -k -X POST -H 'Content-Type: application/json' -d '{\"email\":\"Aryantiwari@findmyinterior.com\",\"password\":\"findmyinterior\",\"device_name\":\"test\"}' https://localhost/api/v1/public/login")
print("API Response:")
print(stdout.read().decode('utf-8', errors='replace'))

client.close()
