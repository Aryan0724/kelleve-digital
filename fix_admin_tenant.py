import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)

tinker_script = '''
$user = App\\Models\\User::withoutGlobalScopes()->where('email', 'Aryantiwari@findmyinterior.com')->first();
if ($user) {
    $user->tenant_id = 1;
    $user->save();
    echo "Updated Aryantiwari to tenant_id = 1\\n";
} else {
    echo "User Aryantiwari not found!\\n";
}

$user2 = App\\Models\\User::withoutGlobalScopes()->firstOrCreate(
    ['email' => 'admin@findmyinterior.com'],
    [
        'name' => 'FMI Admin',
        'phone' => '8888888888',
        'password' => Illuminate\\Support\\Facades\\Hash::make('password123'),
        'verification_level' => 'site_verified',
        'is_active' => true,
        'email_verified_at' => now(),
        'tenant_id' => 1
    ]
);
$user2->tenant_id = 1;
$user2->password = Illuminate\\Support\\Facades\\Hash::make('password123');
$user2->save();
$role = App\\Models\\Role::where('slug', 'admin')->first();
if ($role) {
    $user2->roles()->syncWithoutDetaching([$role->id]);
}
echo "Ensured admin@findmyinterior.com exists with tenant_id = 1\\n";
'''

tinker_script_escaped = tinker_script.replace('"', '\\"').replace('$', '\\$')
command = f'docker exec fmi_backend php artisan tinker --execute="{tinker_script_escaped}"'
print("Executing tinker script to fix tenant_id...")
stdin, stdout, stderr = client.exec_command(command)
print("STDOUT:", stdout.read().decode('utf-8'))

print("\\nTesting login via API...")
test_script = '''curl -X POST -H 'Content-Type: application/json' -d '{"email":"Aryantiwari@findmyinterior.com","password":"findmyinterior","device_name":"test"}' https://findmyinterior.com/api/v1/auth/login'''
stdin, stdout, stderr = client.exec_command(test_script)
print("API Response:")
print(stdout.read().decode('utf-8'))

client.close()
