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

# Test creating order in Laravel via Razorpay SDK
r("""docker exec fmi_backend php artisan tinker --execute="
\$api = new \Razorpay\Api\Api(config('services.razorpay.key'), config('services.razorpay.secret'));
\$order = \$api->order->create([
    'amount' => 1799900,
    'currency' => 'INR',
    'receipt' => 'fmi_live_test_' . time(),
    'payment_capture' => 1,
]);
dump(\$order['id']);
" """)
