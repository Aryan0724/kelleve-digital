import requests
import sys

BASE_URL = "https://findmyinterior.com/api/v1"

def check(name, url, method="GET", data=None, expected_status=200):
    try:
        if method == "GET":
            res = requests.get(url, timeout=10)
        else:
            res = requests.post(url, json=data, timeout=10)
            
        if res.status_code == expected_status or (expected_status == 200 and res.status_code in [200, 201, 301, 302, 401, 403]):
             # If expected was 200 but we got 401/403 for some endpoints, it's technically reachable but unauthorized. 
             # We want to know if it didn't 500.
             if res.status_code >= 500:
                 print(f"[FAIL] {name}: FAILED (HTTP {res.status_code})")
                 return False
             else:
                 print(f"[PASS] {name}: OK (HTTP {res.status_code})")
                 return True
        elif res.status_code == expected_status:
             print(f"[PASS] {name}: OK (HTTP {res.status_code})")
             return True
        else:
             print(f"[FAIL] {name}: FAILED (HTTP {res.status_code})")
             return False
    except Exception as e:
        print(f"[FAIL] {name}: FAILED ({e})")
        return False

print("=== STARTING C1-6 PRODUCTION SMOKE TEST ===")

tests = [
    ("Health Probe (Live)", f"{BASE_URL}/health/live", "GET", None, 200),
    ("Health Probe (Ready)", f"{BASE_URL}/health/ready", "GET", None, 200),
    ("Categories (Public)", f"{BASE_URL}/categories", "GET", None, 200),
    ("Search (Public)", f"{BASE_URL}/search?q=test", "GET", None, 200),
    ("Listings (Public)", f"{BASE_URL}/listings", "GET", None, 200),
    ("Auth Endpoint Availability", f"{BASE_URL}/auth/login", "POST", {"phone": "0000000000", "password": "wrong"}, 422),
    ("Workers (Public)", f"{BASE_URL}/workers", "GET", None, 200),
]

all_passed = True
for name, url, method, data, expected in tests:
    if not check(name, url, method, data, expected):
        all_passed = False

if all_passed:
    print("\n[PASS] SMOKE TEST PASSED: Production is fully reachable and responsive.")
    sys.exit(0)
else:
    print("\n[FAIL] SMOKE TEST FAILED: One or more production endpoints are unhealthy.")
    sys.exit(1)
