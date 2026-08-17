import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

_, stdout, _ = client.exec_command('docker exec fmi_backend php artisan tinker --execute="echo App\Models\Category::first()->id;"')
print("First Category ID:", stdout.read().decode().strip())

_, stdout, _ = client.exec_command('docker exec fmi_backend php artisan tinker --execute="echo App\Models\City::first()->id;"')
print("First City ID:", stdout.read().decode().strip())
