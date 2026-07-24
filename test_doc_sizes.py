import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

cmd = """docker exec fmi_backend php artisan tinker --execute="
\$docs = \\App\\Models\\UserDocument::all();
foreach(\$docs as \$d) {
    echo \$d->id . ' -> ' . strlen(\$d->file_path) . '\\n';
}
" """
stdin, stdout, stderr = client.exec_command(cmd)
print("STDOUT:", stdout.read().decode())
