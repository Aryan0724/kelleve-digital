import paramiko
import time

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

cmd = """docker exec fmi_backend php artisan tinker --execute="
\$start = microtime(true);
\$users = \\App\\Models\\User::query()
    ->with(['documents' => function (\$q) {
        \$q->orderBy('created_at', 'desc');
    }, 'listing', 'primaryRole'])
    ->whereHas('documents', function (\$q) {
        \$q->where('status', 'pending');
    })
    ->paginate(20);

\$users->getCollection()->transform(function (\$user) {
    \$user->documents->transform(function (\$doc) {
        \$doc->url = \$doc->file_path;
        return \$doc;
    });
    return \$user;
});

echo 'JSON Length: ' . strlen(json_encode(\$users));
echo '\\nTime: ' . (microtime(true) - \$start) . ' seconds';
" """
stdin, stdout, stderr = client.exec_command(cmd)
print("STDOUT:", stdout.read().decode())
print("STDERR:", stderr.read().decode())
