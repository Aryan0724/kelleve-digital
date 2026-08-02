import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)

tinker_script = '''
$user = App\\Models\\User::where('email', 'Aryantiwari@findmyinterior.com')->first();
if (!$user) {
    echo "USER NOT FOUND!\\n";
} else {
    echo "USER FOUND!\\n";
    $check = Illuminate\\Support\\Facades\\Hash::check('findmyinterior', $user->password);
    echo "PASSWORD CHECK: " . ($check ? "TRUE" : "FALSE") . "\\n";
}
$user2 = App\\Models\\User::where('email', 'admin@findmyinterior.com')->first();
if (!$user2) {
    echo "USER2 NOT FOUND!\\n";
} else {
    echo "USER2 FOUND!\\n";
    $check2 = Illuminate\\Support\\Facades\\Hash::check('password123', $user2->password);
    echo "PASSWORD2 CHECK: " . ($check2 ? "TRUE" : "FALSE") . "\\n";
}
'''
tinker_script_escaped = tinker_script.replace('"', '\\"').replace('$', '\\$')
command = f'docker exec fmi_backend php artisan tinker --execute="{tinker_script_escaped}"'
print("Executing tinker script to check auth logic...")
stdin, stdout, stderr = client.exec_command(command)
print("STDOUT:", stdout.read().decode('utf-8'))
client.close()
