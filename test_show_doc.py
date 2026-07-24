import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

cmd = """docker exec fmi_backend php artisan tinker --execute="
\$start = microtime(true);
\$doc = \\App\\Models\\UserDocument::first();
\$json = json_encode(['status' => 'success', 'data' => \$doc]);
echo 'Len: ' . strlen(\$json) . '\\n';
echo 'Time: ' . (microtime(true) - \$start);
" """
stdin, stdout, stderr = client.exec_command(cmd)
print("STDOUT:", stdout.read().decode())
print("STDERR:", stderr.read().decode())
