import paramiko, sys
sys.stdout.reconfigure(encoding='utf-8')
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)
tinker_code = """
$request = Illuminate\\Http\\Request::create('/api/v1/auth/login', 'POST', ['email' => 'Aryantiwari@findmyinterior.com', 'password' => 'findmyinterior']);
$controller = app()->make(App\\Http\\Controllers\\Auth\\AuthController::class);
try {
    $response = $controller->login($request);
    echo $response->getContent();
} catch (\\Exception $e) {
    echo 'EXCEPTION: ' . $e->getMessage() . "\\n" . $e->getTraceAsString();
}
"""
sftp = client.open_sftp()
with sftp.file('/root/test_login.php', 'w') as f:
    f.write(tinker_code)
sftp.close()
stdin, stdout, stderr = client.exec_command('docker cp /root/test_login.php fmi_backend:/var/www/html/test_login.php && docker exec fmi_backend php artisan tinker test_login.php')
print(stdout.read().decode('utf-8'))
print(stderr.read().decode('utf-8'))
client.close()
