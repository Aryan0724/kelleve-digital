import paramiko

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect('187.127.164.142', username='root', password='Truedial@1111')

def r(cmd):
    print(f'> {cmd}')
    i,o,e = c.exec_command(cmd)
    out = o.read().decode('utf-8', errors='replace')
    err = e.read().decode('utf-8', errors='replace')
    print(out)
    if err:
        print('ERR:', err)

r("docker exec fmi_backend grep RAZORPAY /var/www/html/.env")
r("docker exec fmi_backend php artisan tinker --execute=\"dump([config('services.razorpay.key'), config('services.razorpay.secret')]);\"")
