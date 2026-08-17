import paramiko
import json
import urllib.request

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

TOKEN = "63|CoHHsgy85g39fW1MdHPVfDeNRfqZEul8cX5UdoG155f5f472"

# 1. Check nginx truedial.conf
_, stdout, _ = client.exec_command('docker exec fmi_nginx cat /etc/nginx/conf.d/truedial.conf')
print("=== TRUEDIAL NGINX CONF ===")
print(stdout.read().decode())

# 2. Test direct API call with token to local backend
_, stdout, _ = client.exec_command(
    f'docker exec fmi_backend curl -s http://localhost/api/v1/truedial/vendor/my-business -H "Authorization: Bearer {TOKEN}" -H "Accept: application/json"'
)
print("\n=== MY-BUSINESS WITH TOKEN (direct) ===")
print(stdout.read().decode())

# 3. Test PUT update with token
_, stdout, _ = client.exec_command(
    f'docker exec fmi_backend curl -s -X PUT http://localhost/api/v1/truedial/vendor/businesses/1 -H "Authorization: Bearer {TOKEN}" -H "Content-Type: application/json" -H "Accept: application/json" -d \'{{"title": "Test Biz Update"}}\''
)
print("\n=== PUT BUSINESSES/1 WITH TOKEN ===")
print(stdout.read().decode())

# 4. Test via the Vercel proxy (public URL)
print("\n=== TEST VIA VERCEL PROXY (public) ===")
from http.cookiejar import CookieJar, Cookie
cj = CookieJar()
# simulate the auth_token cookie
c = Cookie(version=0, name='auth_token', value=TOKEN, port=None, port_specified=False, 
           domain='kelleve-digital.vercel.app', domain_specified=True, domain_initial_dot=False, 
           path='/', path_specified=True, secure=True, expires=None, discard=True, 
           comment=None, comment_url=None, rest={'HttpOnly': None}, rfc2109=False)
cj.set_cookie(c)
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
try:
    req = urllib.request.Request('https://kelleve-digital.vercel.app/api/proxy/truedial/vendor/my-business', 
                                 headers={'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0'})
    res = opener.open(req)
    print("GET my-business via Vercel proxy:", res.read().decode()[:500])
except Exception as e:
    try:
        print("Error:", e.read().decode()[:500])
    except:
        print("Error:", str(e))
