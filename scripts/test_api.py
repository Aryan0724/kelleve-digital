import urllib.request
import json

url = "http://187.127.164.142:8000/api/v1/listings?search=Interior+Designer"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode('utf-8'))
        print(f"Success: {data.get('success')}")
        print(f"Total results: {data.get('meta', {}).get('total')}")
        for item in data.get('data', [])[:3]:
            print(f"- {item.get('title')} ({item.get('category', {}).get('name')})")
except Exception as e:
    print(f"Error: {e}")
