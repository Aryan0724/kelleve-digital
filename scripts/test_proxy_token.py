import paramiko
import urllib.request, json
from http.cookiejar import CookieJar, Cookie

# 1. Generate Token
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

script = """
<?php
require '/var/www/find-my-interior/findmyinterior-backend/vendor/autoload.php';
$app = require_once '/var/www/find-my-interior/findmyinterior-backend/bootstrap/app.php';
$app->make(Illuminate\\Contracts\\Console\\Kernel::class)->bootstrap();
$user = App\\Models\\User::first();
echo $user->createToken('test')->plainTextToken;
"""

client.exec_command('cat << \'EOF\' > /tmp/test_api.php\n' + script + '\nEOF')
_, stdout, _ = client.exec_command('docker exec findmyinterior-app php /tmp/test_api.php')
token = stdout.read().decode('utf-8').strip()

print(f"Generated Token: {token}")

# 2. Test Proxy GET
cj = CookieJar()
c = Cookie(version=0, name='auth_token', value=token, port=None, port_specified=False, domain='kelleve-digital.vercel.app', domain_specified=False, domain_initial_dot=False, path='/', path_specified=True, secure=True, expires=None, discard=True, comment=None, comment_url=None, rest={'HttpOnly': None}, rfc2109=False)
cj.set_cookie(c)
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

req2 = urllib.request.Request('https://kelleve-digital.vercel.app/api-proxy/truedial/vendor/my-business', headers={'Accept': 'application/json'})
try:
    res2 = opener.open(req2)
    print("My Business:", res2.read().decode())
except Exception as e:
    print("My Business Error:", e.read().decode())

# 3. Test Proxy PUT
update_data = json.dumps({"title": "Test Update"}).encode('utf-8')
req3 = urllib.request.Request(f'https://kelleve-digital.vercel.app/api-proxy/truedial/vendor/businesses/1', data=update_data, headers={'Content-Type': 'application/json', 'Accept': 'application/json'}, method='PUT')
try:
    res3 = opener.open(req3)
    print("Update Business:", res3.read().decode())
except Exception as e:
    print(f"Update Business Error: {e.read().decode()}")
