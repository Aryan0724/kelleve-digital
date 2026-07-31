import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

cmd = "docker exec fmi_backend php artisan tinker --execute=\"dump(App\Models\SubscriptionPlan::all()->toArray());\""
stdin, stdout, stderr = client.exec_command(cmd)
print("VPS Subscription Plans in DB:")
print(stdout.read().decode('utf-8', errors='ignore'))
