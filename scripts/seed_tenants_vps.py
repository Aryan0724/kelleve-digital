import paramiko
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')
def r(cmd):
    print(f"Running: {cmd}")
    i,o,e = client.exec_command(cmd)
    print(o.read().decode())
    print(e.read().decode())

r('docker exec fmi_backend php artisan db:seed --class=FindMyInteriorSeeder --force')
r('docker exec fmi_backend php artisan db:seed --class=TruedialSeeder --force')
r('docker exec fmi_backend php artisan cache:clear')
