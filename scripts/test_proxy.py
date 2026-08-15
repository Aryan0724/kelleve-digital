import urllib.request, json
from http.cookiejar import CookieJar

cj = CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

# 1. Login
login_data = json.dumps({"email": "aryan@truedial.com", "password": "password"}).encode('utf-8')
req1 = urllib.request.Request('https://kelleve-digital.vercel.app/api/auth/login', data=login_data, headers={'Content-Type': 'application/json'})
res1 = opener.open(req1)
print("Login:", res1.read().decode())

# Print cookies to verify auth_token
for cookie in cj:
    print(f"Cookie: {cookie.name} = {cookie.value[:10]}...")

# 2. Get My Business
req2 = urllib.request.Request('https://kelleve-digital.vercel.app/api-proxy/truedial/vendor/my-business', headers={'Accept': 'application/json'})
res2 = opener.open(req2)
business = json.loads(res2.read().decode())
print("My Business:", business.get('success'), business.get('data', {}).get('id'))

if business.get('success') and business.get('data'):
    biz_id = business['data']['id']
    # 3. Update Business
    update_data = json.dumps({"title": "Test Update"}).encode('utf-8')
    req3 = urllib.request.Request(f'https://kelleve-digital.vercel.app/api-proxy/truedial/vendor/businesses/{biz_id}', data=update_data, headers={'Content-Type': 'application/json', 'Accept': 'application/json'}, method='PUT')
    try:
        res3 = opener.open(req3)
        print("Update Business:", res3.read().decode())
    except urllib.error.HTTPError as e:
        print(f"Update Business Failed: {e.code} - {e.read().decode()}")
