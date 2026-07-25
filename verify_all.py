import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

php_script = """
<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\\Contracts\\Console\\Kernel::class);
$kernel->bootstrap();

echo "\\n=== VERIFYING BUSINESS VERIFICATION ===\\n";
$user = \\App\\Models\\User::find(1113);
if ($user) {
    $user->update(['verification_level' => 'business_verified', 'is_verified_business' => 1]);
    echo "User 1113 verified successfully!\\n";
    echo "Verification Level: " . $user->verification_level . "\\n";
} else {
    echo "User 1113 not found.\\n";
}

echo "\\n=== VERIFYING ADVERTISEMENT LOGIC ===\\n";
$ad = \\App\\Models\\Advertisement::create([
    'title' => 'Test Popup Ad',
    'location' => 'popup',
    'media_type' => 'image',
    'banner_url' => 'https://via.placeholder.com/400x300',
    'is_active' => 1
]);
echo "Created Ad ID: " . $ad->id . "\\n";
"""

stdin, stdout, stderr = client.exec_command('cat > /var/www/find-my-interior/findmyinterior-backend/test_script.php')
stdin.write(php_script)
stdin.close()
cmd = "docker exec fmi_backend php test_script.php"
stdin, stdout, stderr = client.exec_command(cmd)
print(stdout.read().decode('utf-8'))
print(stderr.read().decode('utf-8'))

print("\\n=== CALLING ADVERTISEMENT API ===")
cmd3 = "curl -s http://localhost:8000/api/v1/advertisements?location=popup"
stdin, stdout, stderr = client.exec_command(cmd3)
print(stdout.read().decode('utf-8'))

client.close()
