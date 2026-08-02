import paramiko, sys
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)
cmd = """docker exec fmi_backend php artisan tinker --execute="
try {
    \$rfqs = \App\Models\Rfq::with(['category'])->where('status', 'open')->latest()->take(6)->get();
    echo json_encode(\$rfqs);
} catch (\Throwable \$e) {
    echo 'ERROR: ' . \$e->getMessage();
}
"
"""
stdin, stdout, stderr = client.exec_command(cmd)
print(stdout.read().decode())
client.close()
