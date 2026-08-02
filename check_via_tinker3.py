import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)

tinker_script = '''
$user = App\\Models\\User::withoutGlobalScopes()->where('email', 'Aryantiwari@findmyinterior.com')->first();
echo "USER1_TENANT: " . ($user ? $user->tenant_id : "NOT_FOUND") . "\\n";
$user2 = App\\Models\\User::withoutGlobalScopes()->where('email', 'admin@findmyinterior.com')->first();
echo "USER2_TENANT: " . ($user2 ? $user2->tenant_id : "NOT_FOUND") . "\\n";
'''

# Escape double quotes properly for bash
tinker_script_escaped = tinker_script.replace('"', '\\"').replace('$', '\\$')
command = f'docker exec fmi_backend php artisan tinker --execute="{tinker_script_escaped}"'
stdin, stdout, stderr = client.exec_command(command)
print("STDOUT:")
print(stdout.read().decode('utf-8', errors='replace'))
client.close()
