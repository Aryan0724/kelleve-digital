import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

cmd = 'docker exec fmi_backend php artisan tinker --execute="App\Models\Listing::where(\'tenant_id\', 2)->where(\'status\', \'pending\')->update([\'status\' => \'active\']);"'
_, stdout, _ = client.exec_command(cmd)
print(stdout.read().decode())
