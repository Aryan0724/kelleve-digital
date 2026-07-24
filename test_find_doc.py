import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

cmd = """docker exec fmi_backend php artisan tinker --execute="
\$start = microtime(true);
\$doc = \\App\\Models\\UserDocument::findOrFail(1);
echo 'Doc ID: ' . \$doc->id . '\\n';
echo 'Time: ' . (microtime(true) - \$start) . '\\n';
" """
stdin, stdout, stderr = client.exec_command(cmd)
print("STDOUT:", stdout.read().decode())
print("STDERR:", stderr.read().decode())
