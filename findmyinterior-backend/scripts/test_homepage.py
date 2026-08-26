import paramiko
import sys

hostname = '187.127.164.142'
username = 'root'
password = 'Truedial@1111'

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(hostname, username=username, password=password, timeout=10)

def run(cmd):
    print(f"> {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out: sys.stdout.write(out + '\n')
    if err: sys.stderr.write(err + '\n')

# Clear cache on VPS so the latest Homepage code isn't serving stale cache
run("docker exec fmi_backend php artisan cache:clear")

# Test HomepageController
php_code = """
try {
    $ctrl = app(\\\\App\\\\Http\\\\Controllers\\\\Public\\\\HomepageController::class);
    $res = $ctrl();
    echo 'HOMEPAGE STATUS: ' . $res->getStatusCode() . PHP_EOL;
    echo 'HOMEPAGE DATA KEYS: ' . implode(',', array_keys($res->getData(true)['data'])) . PHP_EOL;
} catch (\\\\Throwable $e) {
    echo 'HOMEPAGE EXCEPTION: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine() . PHP_EOL;
    echo $e->getTraceAsString() . PHP_EOL;
}
"""

run(f"docker exec fmi_backend php artisan tinker --execute=\"{php_code.strip()}\"")

client.close()
