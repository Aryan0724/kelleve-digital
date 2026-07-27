import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

stdin, stdout, stderr = client.exec_command("docker exec fmi_backend php artisan tinker --execute=\"echo \App\Models\User::whereHas('roles', function(\$q) { \$q->where('slug', 'admin'); })->first()->email;\"")
print('ADMIN EMAIL:', stdout.read().decode('utf-8'))
