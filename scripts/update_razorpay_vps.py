import paramiko

c = paramiko.SSHClient()
c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
c.connect('187.127.164.142', username='root', password='Truedial@1111')

def r(cmd):
    print(f'> {cmd}')
    i,o,e = c.exec_command(cmd)
    out = o.read().decode('utf-8', errors='replace')
    err = e.read().decode('utf-8', errors='replace')
    print(out.encode('ascii', 'ignore').decode())
    if err:
        print('ERR:', err.encode('ascii', 'ignore').decode())

r("sed -i 's/RAZORPAY_KEY_ID=.*/RAZORPAY_KEY_ID=rzp_live_TRfrjzfAExcLjs/' /var/www/find-my-interior/findmyinterior-backend/.env")
r("sed -i 's/RAZORPAY_KEY_SECRET=.*/RAZORPAY_KEY_SECRET=OBznnGo3CVenrGsOu3ED2nWe/' /var/www/find-my-interior/findmyinterior-backend/.env")
r("grep RAZORPAY /var/www/find-my-interior/findmyinterior-backend/.env")
r("sed -i 's/NEXT_PUBLIC_RAZORPAY_KEY_ID=.*/NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_TRfrjzfAExcLjs/' /var/www/find-my-interior/findmyinterior-frontend/.env.production")
r("sed -i 's/NEXT_PUBLIC_RAZORPAY_KEY_ID=.*/NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_TRfrjzfAExcLjs/' /var/www/find-my-interior/findmyinterior-frontend/.env.local")
r("sed -i 's/NEXT_PUBLIC_RAZORPAY_KEY_ID=.*/NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_TRfrjzfAExcLjs/' /var/www/find-my-interior/findmyinterior-frontend/.env")
r("grep NEXT_PUBLIC_RAZORPAY /var/www/find-my-interior/findmyinterior-frontend/.env.production")
r("docker exec fmi_backend php artisan config:clear")
r("docker exec fmi_backend php artisan cache:clear")
r("docker restart fmi_backend")
r("cd /var/www/find-my-interior && docker compose build frontend && docker compose up -d frontend")
