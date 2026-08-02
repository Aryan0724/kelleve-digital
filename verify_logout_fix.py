import requests, re, sys
sys.stdout.reconfigure(encoding='utf-8')

print("Scanning live JS bundles for logout fix...")
r = requests.get('https://findmyinterior.com/login', timeout=15)
bundles = re.findall(r'"(/_next/static/[^"]+\.js)"', r.text)
print(f"Bundles found: {len(bundles)}")

found_debounce = False
found_old_aggressive = False
found_correct_api = False
found_old_url = False

for b in bundles:
    url = 'https://findmyinterior.com' + b
    try:
        content = requests.get(url, timeout=15).text
        if 'isLoggingOut' in content:
            print(f"\nDEBOUNCE GUARD found in: {b}")
            idx = content.find('isLoggingOut')
            print("Context:", content[max(0,idx-50):idx+150])
            found_debounce = True
        if 'window.location.href="/login"' in content or "window.location.href='/login'" in content:
            # Check if it's the old aggressive one (no debounce guard)
            idx = content.find('window.location.href')
            ctx = content[max(0,idx-100):idx+50]
            if 'isLoggingOut' not in ctx:
                print(f"\nWARN: Aggressive redirect still in: {b}")
                found_old_aggressive = True
        if 'findmyinterior.com/api/v1' in content:
            found_correct_api = True
        if 'localhost:8000' in content:
            found_old_url = True
    except Exception as e:
        print(f"Error fetching {b}: {e}")

print("\n=== FINAL VERIFICATION ===")
print("Debounce guard (isLoggingOut) in bundle:", "YES" if found_debounce else "NOT FOUND - may be minified differently")
print("Old aggressive logout present:", "YES (problem)" if found_old_aggressive else "NO (clean)")
print("Correct API URL (findmyinterior.com/api/v1):", "YES" if found_correct_api else "NO")
print("Old localhost:8000 URL:", "YES (problem)" if found_old_url else "NO (clean)")
print("\nOverall:", "ALL GOOD" if (not found_old_aggressive and found_correct_api and not found_old_url) else "ISSUES FOUND")
