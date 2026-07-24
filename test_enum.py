import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

cmd = """docker exec fmi_backend php artisan tinker --execute="
\$type = \\Illuminate\\Support\\Facades\\DB::select(\\"SHOW COLUMNS FROM users WHERE Field = 'verification_level'\\")[0]->Type;
echo 'TYPE: ' . \$type . '\\n';
" """
stdin, stdout, stderr = client.exec_command(cmd)
print("STDOUT:", stdout.read().decode())
print("STDERR:", stderr.read().decode())
