import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

_, stdout, _ = client.exec_command('docker exec fmi_backend php artisan tinker --execute="echo App\Models\ListingProduct::with(\'media\')->latest()->take(5)->get()->toJson();"')
print(stdout.read().decode())
