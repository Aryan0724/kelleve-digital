import requests, re, sys
sys.stdout.reconfigure(encoding='utf-8')

r = requests.get('https://findmyinterior.com/login', timeout=15)
print("Login page status:", r.status_code)

bundles = re.findall(r'"(/_next/static/[^"]+\.js)"', r.text)
print(f"JS bundles found: {len(bundles)}")

found_correct = False
found_old = False

for b in bundles:
    url = 'https://findmyinterior.com' + b
    try:
        r2 = requests.get(url, timeout=15)
        content = r2.text
        if 'findmyinterior.com/api' in content:
            print(f"\nCORRECT API URL found in: {b}")
            idx = content.find('findmyinterior.com/api')
            print("Context:", content[max(0,idx-80):idx+120])
            found_correct = True
        if 'localhost:8000' in content:
            print(f"\nWARN: localhost:8000 still in: {b}")
            idx = content.find('localhost:8000')
            print("Context:", content[max(0,idx-80):idx+120])
            found_old = True
    except Exception as e:
        print(f"Error fetching {b}: {e}")

print("\n=== SUMMARY ===")
print("Correct API URL found:", "YES" if found_correct else "NOT FOUND")
print("Old localhost:8000 found:", "YES (problem)" if found_old else "NO (clean)")
