import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

cmd = """docker exec fmi_backend php artisan tinker --execute="
\$user = \\App\\Models\\User::where('email', 'test12345@test.com')->first();
\$token = \$user->createToken('admin')->plainTextToken;
echo 'TOKEN: ' . \$token;
" """

stdin, stdout, stderr = client.exec_command(cmd)
print("STDOUT:", stdout.read().decode())
print("STDERR:", stderr.read().decode())
