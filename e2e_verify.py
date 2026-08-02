import requests, sys
sys.stdout.reconfigure(encoding='utf-8')

print("=" * 60)
print("FULL END-TO-END VERIFICATION")
print("=" * 60)

# 1. Check frontend page loads
print("\n[1] Frontend login page...")
r = requests.get('https://findmyinterior.com/login', timeout=15)
print(f"    Status: {r.status_code} {'OK' if r.status_code == 200 else 'FAIL'}")
print(f"    Content-Type: {r.headers.get('content-type', 'N/A')}")
assert r.status_code == 200, "Frontend not serving!"

# 2. Check API is reachable
print("\n[2] Backend API health...")
r2 = requests.get('https://findmyinterior.com/api/v1/health', timeout=10)
print(f"    Status: {r2.status_code}")

# 3. Test login with correct credentials
print("\n[3] Login with admin credentials...")
r3 = requests.post(
    'https://findmyinterior.com/api/v1/auth/login',
    json={"email": "Aryantiwari@findmyinterior.com", "password": "findmyinterior"},
    headers={"Accept": "application/json", "Content-Type": "application/json"},
    timeout=15
)
print(f"    Status: {r3.status_code}")
data = r3.json()
if data.get('success'):
    token = data['data']['token']
    user = data['data']['user']
    print(f"    LOGIN SUCCESS!")
    print(f"    User: {user['name']} ({user['email']})")
    print(f"    Role: {user['role']}")
    print(f"    isAdmin: {user['isAdmin']}")
    print(f"    Token: {token[:20]}...")
else:
    print(f"    FAIL: {data}")
    token = None

# 4. Test authenticated endpoint with the token
if token:
    print("\n[4] Authenticated request (get user profile)...")
    r4 = requests.get(
        'https://findmyinterior.com/api/v1/auth/user',
        headers={"Authorization": f"Bearer {token}", "Accept": "application/json"},
        timeout=15
    )
    print(f"    Status: {r4.status_code}")
    if r4.status_code == 200:
        print(f"    Auth verified! User: {r4.json().get('data', {}).get('name', 'N/A')}")
    else:
        print(f"    Response: {r4.text[:200]}")

# 5. Test wrong credentials
print("\n[5] Login with WRONG credentials (should fail)...")
r5 = requests.post(
    'https://findmyinterior.com/api/v1/auth/login',
    json={"email": "wrong@email.com", "password": "wrongpass"},
    headers={"Accept": "application/json"},
    timeout=15
)
print(f"    Status: {r5.status_code} {'OK (rejected correctly)' if r5.status_code in [401, 422, 400] else 'UNEXPECTED'}")

# 6. Verify JS bundle has correct URL
print("\n[6] Verifying JS bundle has correct API URL...")
import re
login_html = requests.get('https://findmyinterior.com/login', timeout=15).text
bundles = re.findall(r'"(/_next/static/[^"]+\.js)"', login_html)
correct_found = False
old_found = False
for b in bundles:
    url = 'https://findmyinterior.com' + b
    try:
        content = requests.get(url, timeout=15).text
        if 'findmyinterior.com/api/v1' in content:
            correct_found = True
        if 'localhost:8000' in content:
            old_found = True
    except:
        pass
print(f"    Correct API URL baked in: {'YES' if correct_found else 'NO'}")
print(f"    Old localhost:8000 present: {'YES (BAD!)' if old_found else 'NO (clean)'}")

print("\n" + "=" * 60)
print("VERIFICATION COMPLETE")
print("=" * 60)
all_ok = r.status_code == 200 and r3.status_code == 200 and data.get('success') and correct_found and not old_found
print(f"OVERALL STATUS: {'ALL CHECKS PASSED' if all_ok else 'SOME CHECKS FAILED'}")
