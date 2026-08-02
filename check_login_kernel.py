import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)
php_code = """<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\\Contracts\\Http\\Kernel::class);

$request = Illuminate\\Http\\Request::create('/api/v1/auth/login', 'POST', ['email' => 'Aryantiwari@findmyinterior.com', 'password' => 'findmyinterior']);
$request->headers->set('Accept', 'application/json');

$response = $kernel->handle($request);
echo $response->getContent();
"""
sftp = client.open_sftp()
with sftp.file('/root/test_login_kernel.php', 'w') as f:
    f.write(php_code)
sftp.close()
stdin, stdout, stderr = client.exec_command('docker cp /root/test_login_kernel.php fmi_backend:/var/www/html/test_login_kernel.php && docker exec fmi_backend php test_login_kernel.php')
print(stdout.read().decode('utf-8'))
print(stderr.read().decode('utf-8'))
client.close()
