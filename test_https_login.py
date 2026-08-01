import urllib.request, ssl, json, sys

sys.stdout.reconfigure(encoding='utf-8')

# Test the EXACT path a browser takes: HTTPS through truedial.com (via VPS IP with Host header)
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

payload = json.dumps({"email": "admin@truedial.com", "password": "Truedial@1111"}).encode()

req = urllib.request.Request(
    "https://187.127.164.142/api/auth/login",
    data=payload,
    headers={
        "Content-Type": "application/json",
        "Host": "truedial.com",
    },
    method="POST"
)

try:
    with urllib.request.urlopen(req, context=ctx, timeout=15) as r:
        body = r.read().decode("utf-8")
        print(f"HTTP Status: {r.status}")
        print(f"Response: {body[:500]}")
        print(f"Set-Cookie: {r.headers.get('Set-Cookie','none')[:100]}")
except Exception as e:
    print(f"ERROR: {e}")
