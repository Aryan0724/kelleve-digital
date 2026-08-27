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

# 1. Update .env inside container
r("docker exec fmi_backend sed -i 's/RAZORPAY_KEY_ID=.*/RAZORPAY_KEY_ID=rzp_live_TRfrjzfAExcLjs/' /var/www/html/.env")
r("docker exec fmi_backend sed -i 's/RAZORPAY_KEY_SECRET=.*/RAZORPAY_KEY_SECRET=OBznnGo3CVenrGsOu3ED2nWe/' /var/www/html/.env")

# 2. Update .env on host
r("sed -i 's/RAZORPAY_KEY_ID=.*/RAZORPAY_KEY_ID=rzp_live_TRfrjzfAExcLjs/' /var/www/find-my-interior/findmyinterior-backend/.env")
r("sed -i 's/RAZORPAY_KEY_SECRET=.*/RAZORPAY_KEY_SECRET=OBznnGo3CVenrGsOu3ED2nWe/' /var/www/find-my-interior/findmyinterior-backend/.env")

# 3. Clear cache inside container
r("docker exec fmi_backend php artisan config:clear")
r("docker exec fmi_backend php artisan cache:clear")

# 4. Verify inside container
r("docker exec fmi_backend php artisan tinker --execute=\"dump([config('services.razorpay.key'), config('services.razorpay.secret')]);\"")
