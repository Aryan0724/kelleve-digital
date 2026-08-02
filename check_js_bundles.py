import requests, re
# Fetch the login page to get the JS bundle references
r = requests.get('https://findmyinterior.com/login', timeout=15)
print("Login page status:", r.status_code)

# Find JS bundle URLs
bundles = re.findall(r'src="(/_next/static/[^"]+\.js)"', r.text)
print(f"JS bundles found: {len(bundles)}")
for b in bundles[:5]:
    print("  ", b)

# Now fetch one of the main bundles and look for the API URL
if bundles:
    for b in bundles[:5]:
        url = 'https://findmyinterior.com' + b
        r2 = requests.get(url, timeout=15)
        content = r2.text
        # Check for findmyinterior.com/api
        if 'findmyinterior.com/api' in content:
            print(f"\n✅ FOUND API URL in bundle: {b}")
            # Extract context
            idx = content.find('findmyinterior.com/api')
            print("Context:", content[max(0,idx-50):idx+100])
        elif 'localhost:8000' in content:
            print(f"\n❌ STILL HAS localhost:8000 in bundle: {b}")
