import requests
import json
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

BASE_URL = "https://187.127.164.142/api/v1"
HEADERS = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "X-Tenant-ID": "2"
}

def test_api():
    print("Testing TrueDial Public Businesses Endpoint (Tenant ID: 2)...")
    res = requests.get(f"{BASE_URL}/truedial/public/businesses", headers=HEADERS, verify=False)
    print("Status:", res.status_code)
    data = res.json()
    items = data.get('data', {}).get('data', []) if isinstance(data.get('data'), dict) else data.get('data', [])
    print(f"Total TrueDial Listings found: {len(items)}")
    for item in items[:5]:
        print(f" - [{item.get('id')}] {item.get('title')} ({item.get('city')})")

    print("\nTesting TrueDial Categories Endpoint...")
    cat_res = requests.get(f"{BASE_URL}/truedial/public/categories", headers=HEADERS, verify=False)
    if cat_res.status_code == 404:
        cat_res = requests.get(f"{BASE_URL}/categories", headers=HEADERS, verify=False)
    print("Status:", cat_res.status_code)
    cat_data = cat_res.json()
    categories = cat_data.get('data', []) if isinstance(cat_data.get('data'), list) else cat_data.get('categories', [])
    print(f"Total Categories found: {len(categories)}")
    for cat in categories[:5]:
        print(f" - {cat.get('name')} (Slug: {cat.get('slug')})")

    print("\nTesting Login and Conversations...")
    login_res = requests.post(f"{BASE_URL}/auth/login", headers=HEADERS, json={
        "email": "customer@truedial.in",
        "password": "password123"
    }, verify=False, allow_redirects=True)
    print("Login Status:", login_res.status_code)
    token = login_res.json().get('data', {}).get('token') if isinstance(login_res.json(), dict) else None
    if token:
        print("Login Successful! Token acquired.")
        auth_headers = {**HEADERS, "Authorization": f"Bearer {token}"}
        conv_res = requests.get(f"{BASE_URL}/conversations", headers=auth_headers, verify=False)
        print("Conversations Status:", conv_res.status_code)
        conv_data = conv_res.json()
        convs = conv_data.get('data', []) if isinstance(conv_data, dict) else []
        print(f"Total Active Conversations found for customer@truedial.in: {len(convs)}")
    else:
        print("Login response:", login_res.text[:200])

if __name__ == '__main__':
    test_api()
