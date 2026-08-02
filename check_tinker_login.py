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
    echo 'EXCEPTION: ' . $e->getMessage() . \"\\n\" . $e->getTraceAsString();
}
"""
stdin, stdout, stderr = client.exec_command(f'docker exec fmi_backend php artisan tinker --execute="{tinker_code}"')
print(stdout.read().decode('utf-8'))
print(stderr.read().decode('utf-8'))
client.close()
