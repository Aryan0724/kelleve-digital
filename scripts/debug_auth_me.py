import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111')

TOKEN = "63|CoHHsgy85g39fW1MdHPVfDeNRfqZEul8cX5UdoG155f5f472"

# Test auth/me
_, stdout, _ = client.exec_command(
    f'docker exec fmi_backend curl -s http://localhost/api/v1/auth/me -H "Authorization: Bearer {TOKEN}" -H "Accept: application/json"'
)
me_result = stdout.read().decode()
print("=== AUTH/ME RESPONSE ===")
print(me_result)

# Test if new proxy endpoint handles it
# Just check if the Vercel deployed build has the new route
import json
try:
    import urllib.request
    req = urllib.request.Request(
        'https://kelleve-digital.vercel.app/api/proxy/auth/me',
        headers={'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0'}
    )
    res = urllib.request.urlopen(req)
    print("\n=== VERCEL PROXY /api/proxy/auth/me ===")
    print(res.read().decode())
except Exception as e:
    try:
        print(f"\n=== VERCEL PROXY /api/proxy/auth/me ERROR {e.code} ===")
        print(e.read().decode()[:500])
    except:
        print(f"\nError: {e}")

# Test what the Vercel /api/auth/me returns without cookie
try:
    req2 = urllib.request.Request(
        'https://kelleve-digital.vercel.app/api/auth/me',
        headers={'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0'}
    )
    res2 = urllib.request.urlopen(req2)
    print("\n=== VERCEL /api/auth/me (no cookie) ===")
    print(res2.read().decode())
except Exception as e:
    try:
        print(f"\n=== VERCEL /api/auth/me ERROR {e.code} ===")
        print(e.read().decode()[:300])
    except:
        print(f"\nError: {e}")
